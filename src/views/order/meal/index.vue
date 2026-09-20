<template>
    <div class="order-meal">
        <el-card class="!border-none" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item class="w-[280px]" label="关键字">
                    <el-input v-model="queryParams.keyword" placeholder="订单编号 / 昵称 / 手机号" clearable
                        @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="是否需要配送">
                    <el-select v-model="queryParams.need_delivery" class="!w-[130px]" clearable placeholder="请选择">
                        <el-option label="需要配送" :value="1" />
                        <el-option label="无需配送" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="楼栋">
                    <el-select v-model="queryParams.building" class="!w-[170px]" clearable placeholder="请选择"
                        filterable>
                        <el-option v-for="item in buildingOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="下单时间">
                    <el-date-picker v-model="createRange" type="daterange" value-format="YYYY-MM-DD"
                        range-separator="~" start-placeholder="开始" end-placeholder="结束" class="!w-[240px]" />
                </el-form-item>
                <el-form-item label="支付时间">
                    <el-date-picker v-model="payRange" type="daterange" value-format="YYYY-MM-DD"
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
                    <el-radio-group v-model="queryParams.status" @change="resetPage()">
                        <el-radio-button value="">全部</el-radio-button>
                        <el-radio-button :value="1">待派单</el-radio-button>
                        <el-radio-button :value="2">进行中</el-radio-button>
                        <el-radio-button :value="3">已完成</el-radio-button>
                        <el-radio-button :value="4">已取消</el-radio-button>
                    </el-radio-group>
                </div>
            </template>
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column prop="sn" label="订单编号" min-width="170" show-overflow-tooltip />
                <el-table-column label="支付人" min-width="130">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-image :src="row.avatar" class="w-8 h-8 rounded-full mr-2" />
                            <span>{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" min-width="120" show-overflow-tooltip />
                <el-table-column label="是否需要配送" min-width="110">
                    <template #default="{ row }">
                        <el-tag size="small" :type="row.need_delivery ? 'warning' : 'info'">
                            {{ row.need_delivery ? '需要配送' : '自取' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="building" label="楼栋" min-width="100" show-overflow-tooltip />
                <el-table-column label="价格" min-width="100" align="right">
                    <template #default="{ row }">
                        <span class="text-orange-500 font-bold">¥{{ row.amount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" min-width="90">
                    <template #default="{ row }">
                        <el-tag size="small" :type="statusTag(row.status)">{{ statusMap[row.status] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="支付状态" min-width="90">
                    <template #default="{ row }">
                        <el-tag size="small" :type="row.pay_status === 1 ? 'success' : 'info'">
                            {{ row.pay_status === 1 ? '已支付' : '未支付' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" min-width="170" show-overflow-tooltip />
                <el-table-column label="支付时间" min-width="170">
                    <template #default="{ row }">{{ row.pay_time || '—' }}</template>
                </el-table-column>
                <el-table-column label="支付方式" min-width="110">
                    <template #default="{ row }">{{ row.pay_type || '—' }}</template>
                </el-table-column>
                <el-table-column label="操作" width="130" fixed="right">
                    <template #default="{ row }">
                        <el-button v-if="row.need_delivery === 1" size="small" type="primary"
                            :disabled="!canDispatch(row)" @click="openDispatch(row)">派单</el-button>
                        <el-button size="small" plain @click="viewDetail(row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 派单 -->
        <el-dialog v-model="showDispatch" title="配送派单" width="460px">
            <el-form label-width="100px">
                <el-form-item label="订单编号">
                    <span class="font-bold">{{ dispatchRow?.sn }}</span>
                </el-form-item>
                <el-form-item label="套餐内容">{{ dispatchRow?.combo }} × {{ dispatchRow?.quantity }}</el-form-item>
                <el-form-item label="配送要求">{{ dispatchRow?.delivery_time }}</el-form-item>
                <el-form-item label="指派员工" required>
                    <el-select v-model="dispatchStaffId" placeholder="请选择员工" class="!w-full">
                        <el-option v-for="s in staffOptions" :key="s.id"
                            :label="`${s.name}（${roleNames[s.role_id] || '员工'}）`" :value="s.id" :disabled="s.status === 0" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showDispatch = false">取消</el-button>
                <el-button type="primary" @click="submitDispatch">确认派单</el-button>
            </template>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog v-model="showDetail" title="膳食订单详情" width="760px" top="5vh">
            <div v-if="detailRow">
                <div class="section-title">膳食信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="订单编号">{{ detailRow.sn }}</el-descriptions-item>
                    <el-descriptions-item label="套餐组合">{{ detailRow.combo }}</el-descriptions-item>
                    <el-descriptions-item label="包含菜品" :span="2">{{ detailRow.dishes }}</el-descriptions-item>
                    <el-descriptions-item label="购买份数">{{ detailRow.quantity }}</el-descriptions-item>
                    <el-descriptions-item label="是否需要配送">
                        {{ detailRow.need_delivery ? `需要（${detailRow.delivery_time}）` : '自取' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="配送员工">{{ detailRow.staff || '未派单' }}</el-descriptions-item>
                    <el-descriptions-item label="订单状态">{{ statusMap[detailRow.status] }}</el-descriptions-item>
                </el-descriptions>

                <div class="section-title">支付人信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="下单人">
                        <div class="flex items-center">
                            <el-image :src="detailRow.avatar" class="w-8 h-8 rounded-full mr-2" />
                            <span>{{ detailRow.nickname }}</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="手机号码">{{ detailRow.mobile }}</el-descriptions-item>
                    <el-descriptions-item label="支付人">{{ detailRow.payer_name }}</el-descriptions-item>
                    <el-descriptions-item label="支付人手机">{{ detailRow.payer_mobile }}</el-descriptions-item>
                    <el-descriptions-item label="与下单人关系">{{ detailRow.payer_relation }}</el-descriptions-item>
                </el-descriptions>

                <div class="section-title">地址信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="联系人">{{ detailRow.contact_name }}</el-descriptions-item>
                    <el-descriptions-item label="联系电话">{{ detailRow.contact_mobile }}</el-descriptions-item>
                    <el-descriptions-item label="所属楼栋">{{ detailRow.building }}</el-descriptions-item>
                    <el-descriptions-item label="详细地址" :span="2">{{ detailRow.address }}</el-descriptions-item>
                </el-descriptions>

                <template v-if="detailRow.delivery_imgs && detailRow.delivery_imgs.length">
                    <div class="section-title">送达确认</div>
                    <div class="flex flex-wrap mb-4">
                        <el-image v-for="(img, idx) in detailRow.delivery_imgs" :key="idx" :src="img"
                            :preview-src-list="detailRow.delivery_imgs" :initial-index="idx" preview-teleported
                            class="w-24 h-20 rounded mr-2 mb-2" fit="cover" />
                    </div>
                </template>

                <div class="section-title">金额信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="套餐单价">¥{{ detailRow.price }}</el-descriptions-item>
                    <el-descriptions-item label="购买份数">{{ detailRow.quantity }}</el-descriptions-item>
                    <el-descriptions-item label="订单金额">
                        <span class="text-orange-500 font-bold">¥{{ detailRow.amount }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="支付方式">{{ detailRow.pay_type || '—' }}</el-descriptions-item>
                    <el-descriptions-item label="支付时间">{{ detailRow.pay_time || '—' }}</el-descriptions-item>
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

<script setup lang="ts" name="orderMeal">
import { mealOrders, staffList } from '@/mock/data'
import { dispatchOrder } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'

type TagType = 'info' | 'warning' | 'primary' | 'success' | 'danger'
const statusMap: Record<number, string> = { 1: '待派单', 2: '服务中', 3: '已完成', 4: '已取消' }
const statusTag = (s: number): TagType =>
    ({ 0: 'info', 1: 'warning', 2: 'primary', 3: 'success', 4: 'danger' } as Record<number, TagType>)[s] || 'info'
const buildingOptions = Array.from(new Set(mealOrders.map((i: any) => i.building)))

const queryParams = reactive({
    keyword: '',
    need_delivery: '' as '' | number,
    building: '',
    status: '' as '' | number,
    start_time: '',
    end_time: '',
    pay_start: '',
    pay_end: ''
})
const createRange = ref<string[]>([])
const payRange = ref<string[]>([])

// 本地筛选：用于列表分页与导出的数据源保持一致
const doFilter = (data: any[], params: Record<string, any> = {}) => {
    let result = data
    if (params.keyword) {
        const kw = String(params.keyword)
        result = result.filter((i: any) =>
            String(i.sn).includes(kw) ||
            String(i.nickname || '').includes(kw) ||
            String(i.mobile || '').includes(kw)
        )
    }
    if (params.need_delivery !== '' && params.need_delivery !== undefined && params.need_delivery !== null) {
        result = result.filter((i: any) => i.need_delivery === Number(params.need_delivery))
    }
    if (params.building) result = result.filter((i: any) => i.building === params.building)
    if (params.status !== '' && params.status !== undefined && params.status !== null) {
        result = result.filter((i: any) => i.status === Number(params.status))
    }
    if (params.start_time) {
        result = result.filter((i: any) => String(i.create_time).slice(0, 10) >= params.start_time)
    }
    if (params.end_time) {
        result = result.filter((i: any) => String(i.create_time).slice(0, 10) <= params.end_time)
    }
    if (params.pay_start) {
        result = result.filter((i: any) => i.pay_time && String(i.pay_time).slice(0, 10) >= params.pay_start)
    }
    if (params.pay_end) {
        result = result.filter((i: any) => i.pay_time && String(i.pay_time).slice(0, 10) <= params.pay_end)
    }
    return result
}

const getOrderList = (params: Record<string, any>) => {
    const { page_no = 1, page_size = 15, ...rest } = params
    const lists = doFilter(mealOrders, rest)
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
    queryParams.pay_start = payRange.value?.[0] || ''
    queryParams.pay_end = payRange.value?.[1] || ''
    resetPage()
}
const handleReset = () => {
    createRange.value = []
    payRange.value = []
    queryParams.start_time = ''
    queryParams.end_time = ''
    queryParams.pay_start = ''
    queryParams.pay_end = ''
    resetParams()
}

// ---- 派单：需要配送的订单可派单给员工 ----
const showDispatch = ref(false)
const dispatchRow = ref<any>(null)
const dispatchStaffId = ref<number | undefined>()
const roleNames: Record<number, string> = { 1: '楼栋管理员', 2: '保安', 3: '保洁' }
// 派单仅可选本订单所属小区的员工
const staffOptions = computed(() => staffList.filter((s: any) => s.community === dispatchRow.value?.community))

const canDispatch = (row: any) => row.need_delivery === 1 && row.status === 1
const openDispatch = (row: any) => {
    dispatchRow.value = row
    dispatchStaffId.value = undefined
    showDispatch.value = true
}
const submitDispatch = async () => {
    if (!dispatchStaffId.value) return ElMessage.warning('请选择指派的员工')
    await dispatchOrder({ type: 'meal', id: dispatchRow.value.id, staff_id: dispatchStaffId.value })
    ElMessage.success('派单成功，订单已进入配送环节')
    showDispatch.value = false
    getLists()
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
