<template>
    <div class="order-helper">
        <el-card class="!border-none" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item class="w-[240px]" label="下单用户">
                    <el-input v-model="queryParams.keyword" placeholder="下单用户昵称 / 手机号码" clearable
                        @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item class="w-[240px]" label="接单人">
                    <el-input v-model="queryParams.staff_keyword" placeholder="接单人姓名 / 手机号码" clearable
                        @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select v-model="queryParams.status" class="w-[140px]" clearable placeholder="全部状态">
                        <el-option v-for="(label, value) in statusMap" :key="value" :label="label"
                            :value="Number(value)" />
                    </el-select>
                </el-form-item>
                <el-form-item label="下单时间">
                    <el-date-picker v-model="createRange" type="daterange" value-format="YYYY-MM-DD"
                        range-separator="~" start-placeholder="开始" end-placeholder="结束" class="!w-[240px]" />
                </el-form-item>
                <el-form-item label="完成时间">
                    <el-date-picker v-model="finishRange" type="daterange" value-format="YYYY-MM-DD"
                        range-separator="~" start-placeholder="开始" end-placeholder="结束" class="!w-[240px]" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="!border-none mt-4" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="flex items-center flex-1 mr-4">
                        <span class="card-title">生活帮手订单</span>
                        <span class="ml-3 text-xs text-tx-secondary">
                            说明：生活帮手订单无需线上派单，选择人才库用户关联后，由该用户与业主线下对接完成
                        </span>
                    </div>
                </div>
            </template>
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="封面图" width="100">
                    <template #default="{ row }">
                        <el-image :src="row.cover" class="w-16 h-12 rounded" :preview-src-list="[row.cover]"
                            preview-teleported fit="cover" />
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="服务标题" min-width="150" show-overflow-tooltip />
                <el-table-column label="下单用户" min-width="150">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-image :src="row.avatar" class="w-8 h-8 rounded-full mr-2" />
                            <span>{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" width="120" show-overflow-tooltip />
                <el-table-column label="接单人" width="120" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span v-if="row.staff">{{ row.staff }}</span>
                        <el-tag v-else size="small" type="info">未关联</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" width="90">
                    <template #default="{ row }">
                        <el-tag size="small" :type="statusTag(row.status)">{{ statusMap[row.status] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" width="160" show-overflow-tooltip />
                <el-table-column label="完成时间" width="160">
                    <template #default="{ row }">{{ row.finish_time || '—' }}</template>
                </el-table-column>
                <el-table-column label="操作" width="190" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" :disabled="!canRelate(row)"
                            @click="openRelate(row)">订单关联</el-button>
                        <el-button size="small" type="danger" :disabled="!canCancel(row)" plain
                            @click="handleCancel(row)">取消订单</el-button>
                        <el-button size="small" plain @click="viewDetail(row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 订单关联：从人才库选择接单人 -->
        <el-dialog v-model="showRelate" title="订单关联" width="720px">
            <el-alert type="info" :closable="false" class="mb-4"
                title="关联后该订单由所选人才库用户与业主线下对接完成，状态更新为服务中。" />
            <el-table :data="talentOptions" size="small" highlight-current-row @current-change="handleTalentChange">
                <el-table-column label="选择" width="60">
                    <template #default="{ row }">
                        <el-radio v-model="relateTalentId" :value="row.id"><span /></el-radio>
                    </template>
                </el-table-column>
                <el-table-column label="接单人" min-width="160">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-image :src="row.avatar" class="w-8 h-8 rounded-full mr-2" />
                            <span>{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" width="120" />
                <el-table-column label="认证技能" min-width="200">
                    <template #default="{ row }">
                        <el-tag v-for="skill in row.skills" :key="skill" size="small" effect="light" class="mr-1">
                            {{ skill }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="community" label="所属小区" min-width="150" show-overflow-tooltip />
                <el-table-column label="接单量" width="90" align="right" prop="orders" />
            </el-table>
            <template #footer>
                <el-button @click="showRelate = false">取消</el-button>
                <el-button type="primary" @click="submitRelate">确认关联</el-button>
            </template>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog v-model="showDetail" title="生活帮手订单详情" width="760px" top="5vh">
            <div v-if="detailRow">
                <div class="section-title">订单信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="订单编号">{{ detailRow.sn }}</el-descriptions-item>
                    <el-descriptions-item label="订单状态">{{ statusMap[detailRow.status] }}</el-descriptions-item>
                    <el-descriptions-item label="服务标题">
                        <div class="flex items-center">
                            <el-image :src="detailRow.cover" class="w-10 h-10 rounded mr-2" fit="cover" />
                            <span>{{ detailRow.title }}</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="服务规格">{{ detailRow.spec }}</el-descriptions-item>
                    <el-descriptions-item label="服务金额">
                        <span class="text-orange-500 font-bold">¥{{ detailRow.amount }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="接单人">
                        {{ detailRow.staff ? `${detailRow.staff}（${detailRow.staff_mobile || '—'}）` : '未关联' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="下单时间">{{ detailRow.create_time }}</el-descriptions-item>
                    <el-descriptions-item label="完成时间">{{ detailRow.finish_time || '—' }}</el-descriptions-item>
                    <el-descriptions-item label="备注要求" :span="2">{{ detailRow.remark || '—' }}</el-descriptions-item>
                </el-descriptions>

                <div class="section-title">下单用户信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="下单用户">
                        <div class="flex items-center">
                            <el-image :src="detailRow.avatar" class="w-8 h-8 rounded-full mr-2" />
                            <span>{{ detailRow.nickname }}</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="手机号码">{{ detailRow.mobile }}</el-descriptions-item>
                    <el-descriptions-item label="所属小区">{{ detailRow.community }}</el-descriptions-item>
                    <el-descriptions-item label="所属楼栋">{{ detailRow.building }}</el-descriptions-item>
                    <el-descriptions-item label="服务地址" :span="2">{{ detailRow.address }}</el-descriptions-item>
                </el-descriptions>

                <div class="section-title">接单人信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="接单人">{{ detailRow.staff || '未关联' }}</el-descriptions-item>
                    <el-descriptions-item label="联系手机">{{ detailRow.staff_mobile || '—' }}</el-descriptions-item>
                </el-descriptions>

                <div class="section-title">订单日志</div>
                <el-timeline>
                    <el-timeline-item v-for="(log, idx) in detailRow.logs || []" :key="idx" :timestamp="log.time"
                        placement="top">
                        {{ log.content }}
                        <span class="text-tx-secondary">（{{ log.operator }}）</span>
                    </el-timeline-item>
                </el-timeline>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="orderHelper">
import { helperOrders, talentList } from '@/mock/data_order'
import { usePaging } from '@/hooks/usePaging'

/** 当前时间文本 */
const nowText = () => {
    const d = new Date()
    const p = (v: number) => String(v).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

type TagType = 'info' | 'warning' | 'primary' | 'success' | 'danger'
const statusMap: Record<number, string> = { 0: '待支付', 1: '待派单', 2: '服务中', 3: '已完成', 4: '已取消' }
const statusTag = (s: number): TagType =>
    ({ 0: 'info', 1: 'warning', 2: 'primary', 3: 'success', 4: 'danger' } as Record<number, TagType>)[s] || 'info'

const queryParams = reactive({
    keyword: '',
    staff_keyword: '',
    status: '' as '' | number,
    start_time: '',
    end_time: '',
    finish_start: '',
    finish_end: ''
})
const createRange = ref<string[]>([])
const finishRange = ref<string[]>([])

// 本地筛选：列表分页与数据源保持一致
const doFilter = (data: any[], params: Record<string, any> = {}) => {
    let result = data
    if (params.keyword) {
        const kw = String(params.keyword)
        result = result.filter((i: any) =>
            String(i.nickname || '').includes(kw) || String(i.mobile || '').includes(kw)
        )
    }
    if (params.staff_keyword) {
        const skw = String(params.staff_keyword)
        result = result.filter((i: any) =>
            String(i.staff || '').includes(skw) || String(i.staff_mobile || '').includes(skw)
        )
    }
    if (params.status !== '' && params.status !== undefined && params.status !== null) {
        result = result.filter((i: any) => i.status === Number(params.status))
    }
    if (params.start_time) {
        result = result.filter((i: any) => String(i.create_time).slice(0, 10) >= params.start_time)
    }
    if (params.end_time) {
        result = result.filter((i: any) => String(i.create_time).slice(0, 10) <= params.end_time)
    }
    if (params.finish_start) {
        result = result.filter((i: any) => i.finish_time && String(i.finish_time).slice(0, 10) >= params.finish_start)
    }
    if (params.finish_end) {
        result = result.filter((i: any) => i.finish_time && String(i.finish_time).slice(0, 10) <= params.finish_end)
    }
    return result
}

const getOrderList = (params: Record<string, any>) => {
    const { page_no = 1, page_size = 15, ...rest } = params
    const lists = doFilter(helperOrders, rest)
    return Promise.resolve({
        count: lists.length,
        lists: lists.slice((page_no - 1) * page_size, page_no * page_size)
    })
}

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getOrderList,
    params: queryParams,
    firstLoading: true
})

const handleQuery = () => {
    queryParams.start_time = createRange.value?.[0] || ''
    queryParams.end_time = createRange.value?.[1] || ''
    queryParams.finish_start = finishRange.value?.[0] || ''
    queryParams.finish_end = finishRange.value?.[1] || ''
    resetPage()
}
const handleReset = () => {
    createRange.value = []
    finishRange.value = []
    queryParams.start_time = ''
    queryParams.end_time = ''
    queryParams.finish_start = ''
    queryParams.finish_end = ''
    resetParams()
}

// ---- 订单关联：待派单且未关联的订单可关联人才库用户 ----
const talentOptions = talentList.filter((t: any) => t.status === 1)
const showRelate = ref(false)
const relateRow = ref<any>(null)
const relateTalentId = ref<number | undefined>()

const canRelate = (row: any) => row.status === 1 && !row.staff
const openRelate = (row: any) => {
    relateRow.value = row
    relateTalentId.value = undefined
    showRelate.value = true
}
const handleTalentChange = (row: any) => {
    if (row) relateTalentId.value = row.id
}
const submitRelate = () => {
    if (!relateTalentId.value) return ElMessage.warning('请选择需要关联的人才库用户')
    const talent: any = talentList.find((t: any) => t.id === relateTalentId.value)
    const order: any = relateRow.value
    if (!talent || !order) return ElMessage.error('关联失败，请重试')
    order.staff = talent.nickname
    order.staff_id = talent.id
    order.staff_mobile = talent.mobile
    order.status = 2
    order.logs = [
        ...(order.logs || []),
        { time: nowText(), content: `订单已关联到人才库用户 ${talent.nickname}，由其线下对接完成`, operator: '物业管理员' }
    ]
    ElMessage.success('关联成功，订单已进入服务中')
    showRelate.value = false
    getLists()
}

// ---- 取消订单：仅服务中的订单可取消 ----
const canCancel = (row: any) => row.status === 2
const handleCancel = (row: any) => {
    ElMessageBox.confirm(`确定取消订单「${row.sn}」吗？取消后将不再提供服务。`, '取消订单', { type: 'warning' })
        .then(() => {
            row.status = 4
            row.logs = [
                ...(row.logs || []),
                { time: nowText(), content: '物业后台取消订单，服务已终止', operator: '物业管理员' }
            ]
            ElMessage.success('订单已取消')
            getLists()
        })
        .catch(() => { })
}

// ---- 详情 ----
const showDetail = ref(false)
const detailRow = ref<any>(null)
const viewDetail = (row: any) => {
    detailRow.value = row
    showDetail.value = true
}

onMounted(getLists)
</script>

<style lang="scss" scoped>
.section-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 10px;
    padding-left: 8px;
    border-left: 3px solid var(--el-color-primary);
}
</style>
