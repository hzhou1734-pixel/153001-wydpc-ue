<template>
    <div class="finance-bill">
        <el-card class="!border-none" shadow="never">
            <el-form :model="queryParams" inline class="mb--4">
                <el-form-item label="账单状态">
                    <el-select v-model="queryParams.status" placeholder="全部" clearable class="!w-[130px]">
                        <el-option label="待结算" :value="0" />
                        <el-option label="已结算" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="queryParams.keyword"
                        placeholder="账单号/用户昵称/手机号"
                        clearable
                        class="!w-[260px]"
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParamsHandler">重置</el-button>
                    <el-button type="success" :disabled="!multipleSelection.length" @click="exportBills">
                        账单导出
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="!border-none mt-4" shadow="never" v-loading="pager.loading">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">账单结算</span>
                    <span class="text-xs text-tx-secondary">勾选账单后可批量导出；单条账单可导出其订单明细</span>
                </div>
            </template>
            <el-table
                :data="pager.lists"
                stripe
                row-key="id"
                @selection-change="(val: any[]) => (multipleSelection = val)"
            >
                <el-table-column type="selection" width="50" />
                <el-table-column prop="sn" label="账单号" min-width="170" show-overflow-tooltip />
                <el-table-column label="账单金额" min-width="130" align="right">
                    <template #default="{ row }">
                        <span class="text-green-600 font-medium">¥{{ row.amount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="所属用户" min-width="170">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="32" :src="row.avatar" />
                            <div class="ml-2">
                                <div>{{ row.nickname }}</div>
                                <div class="text-xs text-tx-secondary">{{ row.mobile }}</div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="订单数" width="90" align="center">
                    <template #default="{ row }">{{ row.order_count }} 单</template>
                </el-table-column>
                <el-table-column prop="update_time" label="账单更新时间" min-width="170" />
                <el-table-column label="账单结算时间" min-width="170">
                    <template #default="{ row }">{{ row.settle_time || '-' }}</template>
                </el-table-column>
                <el-table-column label="账单状态" width="110">
                    <template #default="{ row }">
                        <el-tag size="small" :type="row.status === 1 ? 'success' : 'warning'">
                            {{ row.status === 1 ? '已结算' : '待结算' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="220" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openDetail(row)">账单详情</el-button>
                        <el-button link type="success" @click="exportSingle(row)">导出明细</el-button>
                        <el-button
                            v-if="row.status === 0"
                            link
                            type="warning"
                            @click="handleSettle(row)"
                        >
                            结算
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination
                    v-model:current-page="pager.page"
                    v-model:page-size="pager.size"
                    :page-sizes="[10, 15, 20, 50]"
                    :total="pager.count"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="getLists"
                    @size-change="resetPage"
                />
            </div>
        </el-card>

        <!-- 账单详情 -->
        <el-dialog v-model="detailState.show" title="账单详情" width="860px" top="5vh">
            <el-descriptions :column="2" border class="mb-4">
                <el-descriptions-item label="账单号">{{ detailState.row.sn }}</el-descriptions-item>
                <el-descriptions-item label="账单金额">
                    <span class="text-green-600 font-medium">¥{{ detailState.row.amount }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="所属用户">
                    {{ detailState.row.nickname }}（{{ detailState.row.mobile }}）
                </el-descriptions-item>
                <el-descriptions-item label="账单状态">
                    <el-tag size="small" :type="detailState.row.status === 1 ? 'success' : 'warning'">
                        {{ detailState.row.status === 1 ? '已结算' : '待结算' }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="账单更新时间">{{ detailState.row.update_time }}</el-descriptions-item>
                <el-descriptions-item label="账单结算时间">{{ detailState.row.settle_time || '-' }}</el-descriptions-item>
            </el-descriptions>

            <div class="section-title">订单明细</div>
            <el-table :data="detailState.row.orders || []" border stripe size="small">
                <el-table-column prop="order_sn" label="订单编号" min-width="170" show-overflow-tooltip />
                <el-table-column label="订单类型" width="110">
                    <template #default="{ row }">
                        <el-tag size="small">{{ row.order_type_name }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="service" label="服务名称" min-width="200" show-overflow-tooltip />
                <el-table-column label="订单金额" width="120" align="right">
                    <template #default="{ row }">¥{{ row.amount }}</template>
                </el-table-column>
                <el-table-column prop="pay_time" label="支付时间" min-width="170" />
                <el-table-column prop="status_name" label="订单状态" width="100" />
            </el-table>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="financeBill">
import { getFinanceBill } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { exportCsv } from '@/utils/export'

const queryParams = reactive({ keyword: '', status: '' })

const { pager, getLists, resetPage } = usePaging({
    fetchFun: getFinanceBill,
    params: queryParams,
    firstLoading: true
})

const multipleSelection = ref<any[]>([])
const detailState = reactive({ show: false, row: {} as any })

watch(() => queryParams.status, () => resetPage())

const resetParamsHandler = () => {
    Object.assign(queryParams, { keyword: '', status: '' })
    resetPage()
}

/** 账单详情 */
const openDetail = (row: any) => {
    detailState.row = row
    detailState.show = true
}

/** 单条账单 → 导出其订单明细表 */
const exportSingle = (row: any) => {
    exportCsv(`账单明细_${row.sn}`, [
        { label: '账单号', formatter: () => row.sn },
        { label: '所属用户', formatter: () => row.nickname },
        { label: '手机号码', formatter: () => row.mobile },
        { label: '订单编号', prop: 'order_sn' },
        { label: '订单类型', prop: 'order_type_name' },
        { label: '服务名称', prop: 'service' },
        { label: '订单金额', prop: 'amount' },
        { label: '支付时间', prop: 'pay_time' },
        { label: '订单状态', prop: 'status_name' }
    ], row.orders || [])
}

/** 多条账单 → 导出账单记录表 */
const exportBills = () => {
    exportCsv(`账单记录_${new Date().toLocaleDateString('zh-CN')}`, [
        { label: '账单号', prop: 'sn' },
        { label: '账单金额', prop: 'amount' },
        { label: '所属用户昵称', prop: 'nickname' },
        { label: '手机号码', prop: 'mobile' },
        { label: '订单数', prop: 'order_count' },
        { label: '账单更新时间', prop: 'update_time' },
        { label: '账单结算时间', formatter: (row: any) => row.settle_time || '-' },
        { label: '账单状态', formatter: (row: any) => (row.status === 1 ? '已结算' : '待结算') }
    ], multipleSelection.value)
}

/** 结算 */
const handleSettle = (row: any) => {
    ElMessageBox.confirm(`确定将账单「${row.sn}」标记为已结算吗？账单金额 ¥${row.amount}。`, '结算确认', {
        type: 'warning'
    })
        .then(() => {
            row.status = 1
            row.settle_time = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
            ElMessage.success('结算成功')
        })
        .catch(() => {})
}

onMounted(getLists)
</script>

<style lang="scss" scoped>
.section-title {
    @apply text-base font-medium mb-2 pl-2 border-l-4 border-primary;
}
</style>
