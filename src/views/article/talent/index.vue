<template>
    <div class="article-talent">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">人才库</span>
                    <div class="text-xs text-tx-secondary">人力资源认证审核通过后自动进入人才库，禁用后无法进行订单关联</div>
                </div>
            </template>

            <!-- 筛选搜索 -->
            <el-form inline class="mb-2">
                <el-form-item label="关键词">
                    <el-input v-model="queryParams.keyword" placeholder="用户昵称 / 手机号码 / 认证技能" clearable class="!w-64"
                        :prefix-icon="Search" @keyup.enter="onSearch" />
                </el-form-item>
                <el-form-item label="服务类目">
                    <el-select v-model="queryParams.category" placeholder="请选择" clearable class="!w-36">
                        <el-option v-for="c in helperCategories" :key="c" :label="c" :value="c" />
                    </el-select>
                </el-form-item>
                <el-form-item label="人才状态">
                    <el-select v-model="queryParams.status" placeholder="请选择" clearable class="!w-32">
                        <el-option label="启用" :value="1" />
                        <el-option label="禁用" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="添加时间">
                    <el-date-picker v-model="createRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-64" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetQuery">重置</el-button>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="pager.lists" stripe v-loading="pager.loading">
                <el-table-column label="用户" width="160">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="28" :src="row.avatar" class="!mr-2" />
                            <span>{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" width="120" show-overflow-tooltip />
                <el-table-column prop="skill" label="认证技能" width="120" show-overflow-tooltip />
                <el-table-column label="可服务类目" min-width="220">
                    <template #default="{ row }">
                        <template v-if="row.categories?.length">
                            <el-tag v-for="c in row.categories" :key="c" size="small" class="!mr-1 !mb-1">{{ c }}</el-tag>
                        </template>
                        <span v-else class="text-tx-secondary">—</span>
                    </template>
                </el-table-column>
                <el-table-column prop="order_total" label="订单总数" width="90" align="center" show-overflow-tooltip />
                <el-table-column prop="processing" label="进行中" width="90" align="center" show-overflow-tooltip />
                <el-table-column prop="done" label="已完成" width="90" align="center" show-overflow-tooltip />
                <el-table-column prop="canceled" label="已取消" width="90" align="center" show-overflow-tooltip />
                <el-table-column label="完成订单总金额" width="130" align="right" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span class="font-medium">¥{{ Number(row.done_amount).toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="人才状态" width="90">
                    <template #default="{ row }">
                        <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @change="toggleStatus(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间" width="160" show-overflow-tooltip />
                <el-table-column label="操作" width="180" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openDetail(row)">人才详情</el-button>
                        <el-button link type="warning" @click="openDispatch(row)">订单派单</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 人才详情 -->
        <el-drawer v-model="detailVisible" :title="`人才详情 - ${detail.nickname || ''}`" size="900px" destroy-on-close>
            <div class="drawer-section">
                <div class="section-title">基础信息</div>
                <el-descriptions :column="2" border>
                    <el-descriptions-item label="人才头像">
                        <el-avatar :size="48" :src="detail.avatar" />
                    </el-descriptions-item>
                    <el-descriptions-item label="用户昵称">{{ detail.nickname }}</el-descriptions-item>
                    <el-descriptions-item label="手机号码">{{ detail.mobile }}</el-descriptions-item>
                    <el-descriptions-item label="认证技能">{{ detail.skill }}</el-descriptions-item>
                    <el-descriptions-item label="服务类目" :span="2">
                        <el-tag v-for="c in detail.categories || []" :key="c" size="small" class="!mr-1">{{ c }}</el-tag>
                        <span v-if="!detail.categories?.length" class="text-tx-secondary">—</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="人才状态">
                        <el-tag size="small" :type="detail.status === 1 ? 'success' : 'info'">
                            {{ detail.status === 1 ? '启用' : '禁用' }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="添加时间">{{ detail.create_time }}</el-descriptions-item>
                </el-descriptions>
            </div>

            <div class="drawer-section">
                <div class="section-title">认证申请信息</div>
                <div class="text-xs text-tx-secondary !mb-2">用户提交人才认证申请时填写的表单内容（与人力资源页数据同源）</div>
                <div v-for="cert in talentCerts" :key="cert.id" class="!mb-3">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="认证技能标题" :span="2">{{ cert.title }}</el-descriptions-item>
                        <el-descriptions-item label="技能类目">{{ cert.skill }}</el-descriptions-item>
                        <el-descriptions-item label="审核状态">
                            <el-tag size="small" :type="certTag(cert.status)">{{ certText(cert.status) }}</el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="提交时间">{{ cert.submit_time }}</el-descriptions-item>
                        <el-descriptions-item label="审核时间">{{ cert.audit_time || '—' }}</el-descriptions-item>
                        <el-descriptions-item v-if="cert.status === 2 && cert.audit_reason" label="驳回备注" :span="2">
                            {{ cert.audit_reason }}
                        </el-descriptions-item>
                        <el-descriptions-item label="详情描述" :span="2">{{ cert.detail }}</el-descriptions-item>
                        <el-descriptions-item label="认证凭证" :span="2">
                            <div v-if="cert.cert_images?.length" class="flex flex-wrap">
                                <el-image v-for="(img, i) in cert.cert_images" :key="i" :src="img"
                                    :preview-src-list="cert.cert_images" :initial-index="i" preview-teleported fit="cover"
                                    class="w-24 h-20 rounded !mr-2 !mb-1" />
                            </div>
                            <span v-else class="text-tx-secondary">（未上传凭证）</span>
                        </el-descriptions-item>
                    </el-descriptions>
                </div>
                <div v-if="!talentCerts.length" class="text-tx-secondary text-sm">（该人才暂无认证申请记录）</div>
            </div>

            <div class="drawer-section">
                <div class="section-title">订单信息</div>
                <div class="order-stat">
                    <div class="order-stat__item">
                        <div class="order-stat__value">{{ detail.order_total || 0 }}</div>
                        <div class="order-stat__label">订单总数</div>
                    </div>
                    <div class="order-stat__item">
                        <div class="order-stat__value">{{ detail.processing || 0 }}</div>
                        <div class="order-stat__label">进行中</div>
                    </div>
                    <div class="order-stat__item">
                        <div class="order-stat__value">{{ detail.done || 0 }}</div>
                        <div class="order-stat__label">已完成</div>
                    </div>
                    <div class="order-stat__item">
                        <div class="order-stat__value">{{ detail.canceled || 0 }}</div>
                        <div class="order-stat__label">已取消</div>
                    </div>
                    <div class="order-stat__item">
                        <div class="order-stat__value">¥{{ Number(detail.done_amount || 0).toFixed(2) }}</div>
                        <div class="order-stat__label">已完成订单总金额</div>
                    </div>
                </div>
                <el-table :data="talentOrders" stripe max-height="320">
                    <el-table-column label="服务封面图" width="100">
                        <template #default="{ row }">
                            <el-image :src="row.cover" :preview-src-list="[row.cover]" preview-teleported fit="cover"
                                class="w-14 h-10 rounded" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="标题" min-width="160" show-overflow-tooltip />
                    <el-table-column label="订单金额" width="100" align="right" show-overflow-tooltip>
                        <template #default="{ row }">¥{{ row.amount }}</template>
                    </el-table-column>
                    <el-table-column prop="buyer" label="下单用户" width="110" show-overflow-tooltip />
                    <el-table-column label="订单状态" width="90">
                        <template #default="{ row }">
                            <el-tag size="small" :type="orderTag(row.status)">{{ talentOrderStatus[row.status] }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单评价" width="170">
                        <template #default="{ row }">
                            <el-tooltip v-if="row.score?.stars" :content="row.score.content || '暂无评语'" placement="top">
                                <el-rate :model-value="row.score.stars" disabled size="small" />
                            </el-tooltip>
                            <span v-else class="text-tx-secondary">未评价</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="submit_time" label="提交时间" width="160" show-overflow-tooltip />
                    <el-table-column label="完成时间" width="160">
                        <template #default="{ row }">{{ row.finish_time || '—' }}</template>
                    </el-table-column>
                </el-table>
            </div>

            <div class="drawer-section">
                <div class="section-title">关联服务</div>
                <div class="text-xs text-tx-secondary !mb-2">勾选该人才可承接的生活帮手服务类目，保存后立即生效</div>
                <el-checkbox-group v-model="relatedCategories">
                    <el-checkbox v-for="c in helperCategories" :key="c" :value="c">{{ c }}</el-checkbox>
                </el-checkbox-group>
                <div class="!mt-3">
                    <el-button type="primary" size="small" @click="saveCategories">保存关联服务</el-button>
                </div>
            </div>

            <template #footer>
                <el-button @click="detailVisible = false">关闭</el-button>
                <el-button type="warning" @click="openDispatch(detail)">订单派单</el-button>
            </template>
        </el-drawer>

        <!-- 订单派单 -->
        <el-dialog v-model="dispatchVisible" title="订单派单" width="1000px" top="6vh" destroy-on-close>
            <el-alert :title="`正在为「${dispatchTalent.nickname || ''}」派单，勾选订单后无需用户同意即可直接指派`"
                type="warning" :closable="false" show-icon class="!mb-3" />
            <el-table ref="dispatchTableRef" :data="dispatchOrders" stripe max-height="420"
                @selection-change="onSelectionChange">
                <el-table-column type="selection" width="50" :selectable="canSelect" />
                <el-table-column label="服务封面图" width="100">
                    <template #default="{ row }">
                        <el-image :src="row.cover" :preview-src-list="[row.cover]" preview-teleported fit="cover"
                            class="w-14 h-10 rounded" />
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="服务标题" min-width="140" show-overflow-tooltip />
                <el-table-column prop="spec" label="服务规格" width="150" show-overflow-tooltip />
                <el-table-column label="订单金额" width="100" align="right" show-overflow-tooltip>
                    <template #default="{ row }">¥{{ row.amount }}</template>
                </el-table-column>
                <el-table-column label="下单用户" width="160">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="24" :src="row.avatar" class="!mr-2" />
                            <span>{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="订单状态" width="100">
                    <template #default="{ row }">
                        <el-tag size="small" :type="orderTag(row.status)">{{ talentOrderStatus[row.status] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="接单人" width="110">
                    <template #default="{ row }">
                        <span v-if="row.staff">{{ row.staff }}</span>
                        <el-tag v-else size="small" type="warning">待派单</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="提交时间" width="160" show-overflow-tooltip />
            </el-table>
            <template #footer>
                <el-button @click="dispatchVisible = false">取消</el-button>
                <el-button type="primary" @click="submitDispatch">确定派单</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="articleTalent">
import { talentList, talentOrderList, talentOrderStatus, helperCategories, hrCertList } from '@/mock/data_content'
import { helperOrders } from '@/mock/data_order'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

type TagType = 'info' | 'warning' | 'primary' | 'success' | 'danger'
const orderTag = (s: number): TagType =>
    ({ 0: 'info', 1: 'warning', 2: 'primary', 3: 'success', 4: 'danger' } as Record<number, TagType>)[s] || 'info'

const queryParams = reactive({ keyword: '', category: '', status: '', start_time: '', end_time: '' })
const createRange = ref<string[]>([])

// 本地筛选：列表分页与数据源保持一致
const doFilter = (data: any[], params: Record<string, any> = {}) => {
    let result = data
    if (params.keyword) {
        const kw = String(params.keyword)
        result = result.filter(
            (i: any) =>
                String(i.nickname || '').includes(kw) ||
                String(i.mobile || '').includes(kw) ||
                String(i.skill || '').includes(kw)
        )
    }
    if (params.category) {
        result = result.filter((i: any) => (i.categories || []).includes(params.category))
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
    return result
}

const getTalentList = (params: Record<string, any>) => {
    const { page_no = 1, page_size = 15, ...rest } = params
    const lists = doFilter(talentList, rest)
    return Promise.resolve({
        count: lists.length,
        lists: lists.slice((page_no - 1) * page_size, page_no * page_size)
    })
}

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getTalentList,
    params: queryParams,
    firstLoading: true
})

const onSearch = () => {
    queryParams.start_time = createRange.value?.[0] || ''
    queryParams.end_time = createRange.value?.[1] || ''
    resetPage()
}
const resetQuery = () => {
    createRange.value = []
    queryParams.start_time = ''
    queryParams.end_time = ''
    resetParams()
}

const nowTimeStr = () => {
    const d = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// ---- 启用 / 禁用 ----
const toggleStatus = (row: any) => {
    const next = row.status === 1 ? 0 : 1
    row.status = next
    ElMessage.success(next === 1 ? '已启用，该人才可进行订单关联' : '已禁用，该人才无法进行订单关联')
}

// ---- 人才详情 ----
const detailVisible = ref(false)
const detail = ref<any>({})
const relatedCategories = ref<string[]>([])
const talentOrders = computed(() =>
    talentOrderList.filter((i: any) => i.talent_id === detail.value.id)
)
/** 用户提交的人才认证申请（按手机号匹配，与人力资源页数据同源） */
const talentCerts = computed(() => hrCertList.filter((c: any) => c.mobile === detail.value.mobile))
const certText = (s: number) => (s === 1 ? '已通过' : s === 2 ? '已驳回' : '待审核')
const certTag = (s: number) => (s === 1 ? 'success' : s === 2 ? 'danger' : 'warning')
const openDetail = (row: any) => {
    detail.value = row
    relatedCategories.value = [...(row.categories || [])]
    detailVisible.value = true
}
const saveCategories = () => {
    if (!relatedCategories.value.length) return ElMessage.warning('请至少关联一个服务类目')
    const row = talentList.find((i: any) => i.id === detail.value.id)
    if (row) row.categories = [...relatedCategories.value]
    detail.value.categories = [...relatedCategories.value]
    ElMessage.success('关联服务已保存')
}

// ---- 订单派单 ----
const dispatchVisible = ref(false)
const dispatchTalent = ref<any>({})
const dispatchTableRef = ref<any>(null)
const selectedOrders = ref<any[]>([])
const dispatchOrders = helperOrders
const canSelect = (row: any) => !row.staff
const onSelectionChange = (rows: any[]) => {
    selectedOrders.value = rows
}
const openDispatch = (row: any) => {
    if (row.status !== 1) return ElMessage.warning('该人才已禁用，无法进行订单关联')
    dispatchTalent.value = row
    selectedOrders.value = []
    dispatchVisible.value = true
}
const submitDispatch = () => {
    if (!selectedOrders.value.length) return ElMessage.warning('请勾选需要派单的订单')
    const talent = dispatchTalent.value
    const time = nowTimeStr()
    selectedOrders.value.forEach((order: any) => {
        order.staff = talent.nickname
        order.staff_id = talent.id
        order.staff_mobile = talent.mobile
        if (order.status === 1) order.status = 2
        talentOrderList.unshift({
            id: order.id,
            talent_id: talent.id,
            cover: order.cover,
            title: order.spec ? `${order.title}·${order.spec}` : order.title,
            amount: order.amount,
            buyer: order.nickname,
            status: order.status,
            score: { stars: 0, content: '' },
            submit_time: order.create_time,
            finish_time: ''
        })
    })
    const row = talentList.find((i: any) => i.id === talent.id)
    if (row) {
        row.order_total += selectedOrders.value.length
        row.processing += selectedOrders.value.length
    }
    dispatchTableRef.value?.clearSelection()
    dispatchVisible.value = false
    ElMessage.success(`已成功派单 ${selectedOrders.value.length} 笔给「${talent.nickname}」`)
}

onMounted(getLists)
</script>

<style lang="scss" scoped>
.drawer-section {
    margin-bottom: 24px;
}

.section-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 12px;
    padding-left: 8px;
    border-left: 3px solid var(--el-color-primary);
}

.order-stat {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;

    &__item {
        flex: 1;
        min-width: 120px;
        background: var(--el-fill-color-light);
        border-radius: 8px;
        padding: 12px 8px;
        text-align: center;
    }

    &__value {
        font-size: 18px;
        font-weight: bold;
        color: var(--el-text-color-primary);
    }

    &__label {
        margin-top: 4px;
        font-size: 12px;
        color: var(--el-text-color-secondary);
    }
}
</style>
