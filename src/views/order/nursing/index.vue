<template>
    <div class="order-nursing">
        <el-card class="!border-none" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item class="w-[280px]" label="关键字">
                    <el-input v-model="queryParams.keyword" placeholder="订单编号 / 托管名称 / 昵称 / 手机号"
                        clearable @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="订单状态">
                    <el-select v-model="queryParams.status" class="w-[140px]" clearable placeholder="全部状态">
                        <el-option v-for="(label, value) in statusMap" :key="value" :label="label"
                            :value="Number(value)" />
                    </el-select>
                </el-form-item>
                <el-form-item label="支付状态">
                    <el-select v-model="queryParams.pay_status" class="w-[120px]" clearable placeholder="全部">
                        <el-option label="已支付" :value="1" />
                        <el-option label="未支付" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-select v-model="queryParams.pay_type" class="w-[130px]" clearable placeholder="全部方式">
                        <el-option v-for="item in payTypeOptions" :key="item" :label="item" :value="item" />
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
                    <span class="card-title">托管订单</span>
                </div>
            </template>
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column prop="sn" label="订单编号" width="170" />
                <el-table-column prop="service" label="托管名称" min-width="170" show-overflow-tooltip />
                <el-table-column label="托管类型" width="120">
                    <template #default="{ row }">
                        <el-tag size="small" effect="light" :type="typeTag(row.type)">{{ row.type }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="价格" width="110" align="right">
                    <template #default="{ row }">
                        <span class="text-orange-500 font-bold">¥{{ row.price }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="下单人" min-width="150">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :src="row.avatar" :size="32" />
                            <span class="ml-2">{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" width="130" />
                <el-table-column prop="building" label="所属楼栋" min-width="150" show-overflow-tooltip />
                <el-table-column label="订单状态" width="100">
                    <template #default="{ row }">
                        <el-tag size="small" :type="statusTag(row.status)">{{ statusMap[row.status] }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="支付状态" width="100">
                    <template #default="{ row }">
                        <el-tag size="small" :type="row.pay_status === 1 ? 'success' : 'info'">
                            {{ row.pay_status === 1 ? '已支付' : '未支付' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" width="170" />
                <el-table-column label="支付时间" width="170">
                    <template #default="{ row }">{{ row.pay_time || '—' }}</template>
                </el-table-column>
                <el-table-column label="支付方式" width="110">
                    <template #default="{ row }">{{ row.pay_type || '—' }}</template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" :disabled="!canDispatch(row)"
                            @click="openDispatch(row)">派单</el-button>
                        <el-button size="small" plain @click="viewDetail(row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-2">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 派单 -->
        <el-dialog v-model="showDispatch" title="托管派单" width="460px">
            <el-form label-width="100px">
                <el-form-item label="订单编号">
                    <span class="font-bold">{{ dispatchRow?.sn }}</span>
                </el-form-item>
                <el-form-item label="托管名称">{{ dispatchRow?.service }}</el-form-item>
                <el-form-item label="是否需要接送">
                    <el-tag size="small" :type="dispatchRow?.need_pickup ? 'warning' : 'info'">
                        {{ dispatchRow?.need_pickup ? `需要接送（${dispatchRow?.pickup_time}）` : '无需接送' }}
                    </el-tag>
                </el-form-item>
                <el-form-item label="指派托管员" required>
                    <el-select v-model="dispatchStaffId" placeholder="请选择托管员" class="!w-full">
                        <el-option v-for="s in staffOptions" :key="s.id"
                            :label="`${s.name}（${s.community}）`" :value="s.id" :disabled="s.status === 0" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!dispatchRow?.need_pickup" label="">
                    <el-alert type="warning" :closable="false" title="该订单无需接送，仅需要接送的订单才需派单给托管员。" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showDispatch = false">取消</el-button>
                <el-button type="primary" @click="submitDispatch">确认派单</el-button>
            </template>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog v-model="showDetail" title="托管订单详情" width="760px" top="5vh">
            <div v-if="detailRow">
                <div class="section-title">托管信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="订单编号">{{ detailRow.sn }}</el-descriptions-item>
                    <el-descriptions-item label="托管名称">{{ detailRow.service }}</el-descriptions-item>
                    <el-descriptions-item label="托管类型">{{ detailRow.type }}</el-descriptions-item>
                    <el-descriptions-item label="托管状态">{{ statusMap[detailRow.status] }}</el-descriptions-item>
                    <el-descriptions-item label="是否需要接送">
                        {{ detailRow.need_pickup ? `需要（${detailRow.pickup_time}）` : '不需要' }}
                    </el-descriptions-item>
                    <el-descriptions-item label="服务员工">{{ detailRow.staff || '未派单' }}</el-descriptions-item>
                    <el-descriptions-item label="下单时间">{{ detailRow.create_time }}</el-descriptions-item>
                </el-descriptions>

                <div class="section-title">支付人信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="下单人">
                        <div class="flex items-center">
                            <el-avatar :src="detailRow.avatar" :size="32" />
                            <span class="ml-2">{{ detailRow.nickname }}</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="手机号码">{{ detailRow.mobile }}</el-descriptions-item>
                    <el-descriptions-item label="支付人">{{ detailRow.payer_name }}</el-descriptions-item>
                    <el-descriptions-item label="支付人手机">{{ detailRow.payer_mobile }}</el-descriptions-item>
                    <el-descriptions-item label="与下单人关系">{{ detailRow.payer_relation }}</el-descriptions-item>
                    <el-descriptions-item label="所属小区">{{ detailRow.community }}</el-descriptions-item>
                </el-descriptions>

                <div class="section-title">地址信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="联系人">{{ detailRow.contact_name }}</el-descriptions-item>
                    <el-descriptions-item label="联系电话">{{ detailRow.contact_mobile }}</el-descriptions-item>
                    <el-descriptions-item label="所属楼栋">{{ detailRow.building }}</el-descriptions-item>
                    <el-descriptions-item label="详细地址" :span="2">{{ detailRow.address }}</el-descriptions-item>
                </el-descriptions>

                <div class="section-title">金额信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="托管单价">¥{{ detailRow.price }}</el-descriptions-item>
                    <el-descriptions-item label="优惠金额">¥0.00</el-descriptions-item>
                    <el-descriptions-item label="订单金额">
                        <span class="text-orange-500 font-bold">¥{{ detailRow.amount }}</span>
                    </el-descriptions-item>
                    <el-descriptions-item label="实付金额">¥{{ detailRow.amount }}</el-descriptions-item>
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

<script setup lang="ts" name="orderNursing">
import { dispatchOrder, getNursingOrderList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { staffList } from '@/mock/data'

const statusMap: Record<number, string> = { 0: '待支付', 1: '待派单', 2: '服务中', 3: '已完成', 4: '已取消' }
const statusTag = (s: number) => ({ 0: 'info', 1: 'warning', 2: 'primary', 3: 'success', 4: 'danger' }[s] || 'info')
const typeTag = (t: string) => ({ '日托': 'success', '学期每日托': 'warning', '学期周末托': 'primary' }[t] || 'info')
const payTypeOptions = ['微信支付', '支付宝', '银行卡']

const queryParams = reactive({
    keyword: '',
    status: '' as '' | number,
    pay_status: '' as '' | number,
    pay_type: '',
    start_time: '',
    end_time: '',
    pay_start: '',
    pay_end: ''
})
const createRange = ref<string[]>([])
const payRange = ref<string[]>([])

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getNursingOrderList,
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

// ---- 派单：仅需要接送的订单可派单给托管员 ----
const showDispatch = ref(false)
const dispatchRow = ref<any>(null)
const dispatchStaffId = ref<number | undefined>()
const staffOptions = staffList.filter((s: any) => s.role_id === 1)

const canDispatch = (row: any) => row.need_pickup === 1 && row.status === 1
const openDispatch = (row: any) => {
    dispatchRow.value = row
    dispatchStaffId.value = undefined
    showDispatch.value = true
}
const submitDispatch = async () => {
    if (!dispatchStaffId.value) return ElMessage.warning('请选择指派的托管员')
    await dispatchOrder({ type: 'nursing', id: dispatchRow.value.id, staff_id: dispatchStaffId.value })
    ElMessage.success('派单成功，订单已进入服务中')
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
