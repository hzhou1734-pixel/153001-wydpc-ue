<template>
    <div class="finance-overview">
        <!-- 订单金额 -->
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">订单金额</span>
                    <span class="text-xs text-tx-secondary">
                        有效订单 = 已支付且未取消；退款订单 = 已取消订单；数据由订单实时汇总
                    </span>
                </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="stat-box">
                    <div class="stat-label">订单总金额</div>
                    <div class="stat-value">¥{{ summary.order_total }}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">有效订单总金额（待结算 + 已完成）</div>
                    <div class="stat-value text-green-600">¥{{ summary.order_valid }}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">退款订单总金额</div>
                    <div class="stat-value text-red-500">¥{{ summary.order_refund }}</div>
                </div>
            </div>

            <el-table :data="typeRows" border stripe class="mt-4">
                <el-table-column prop="name" label="订单类型" min-width="120" />
                <el-table-column label="订单总金额" min-width="140">
                    <template #default="{ row }">
                        <span class="font-medium">¥{{ row.total }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="有效订单总金额" min-width="150">
                    <template #default="{ row }">
                        <span class="text-green-600 font-medium">¥{{ row.valid }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已取消订单总金额" min-width="160">
                    <template #default="{ row }">
                        <span class="text-red-500 font-medium">¥{{ row.cancel }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 结算金额 -->
        <el-card class="!border-none mt-4" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">结算金额</span>
                    <span class="text-xs text-tx-secondary">待结算 = 有效且未完成；已结算 = 有效且已完成</span>
                </div>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="stat-box">
                    <div class="stat-label">待结算总金额</div>
                    <div class="stat-value text-orange-500">¥{{ summary.settle_pending }}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">已结算总金额</div>
                    <div class="stat-value text-blue-500">¥{{ summary.settle_done }}</div>
                </div>
            </div>
            <el-table :data="typeRows" border stripe>
                <el-table-column prop="name" label="订单类型" min-width="120" />
                <el-table-column label="待结算金额" min-width="140">
                    <template #default="{ row }">
                        <span class="text-orange-500 font-medium">¥{{ row.pending }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已结算金额" min-width="140">
                    <template #default="{ row }">
                        <span class="text-blue-500 font-medium">¥{{ row.settled }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 员工收益 -->
        <el-card class="!border-none mt-4" shadow="never">
            <template #header>
                <span class="card-title">员工收益</span>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="stat-box">
                    <div class="stat-label">员工已获得收益总额</div>
                    <div class="stat-value text-green-600">¥{{ summary.staff_earnings_total }}</div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="financeOverview">
import { escortOrders, mealOrders, nursingOrders } from '@/mock/data'
import { profitConfig, staffEarningRows } from '@/mock/data_finance'

/** 金额汇总：兼容 amount 为字符串或数字 */
const sumAmount = (list: any[]) => list.reduce((s, item) => s + (Number(item.amount) || 0), 0)
const money = (v: number) => Number(v || 0).toFixed(2)

/** 按统一口径归类订单 */
const buildTypeStat = (list: any[]) => {
    const valid = list.filter((o: any) => o.pay_status === 1 && o.status !== 4)
    const canceled = list.filter((o: any) => o.status === 4)
    return {
        total: money(sumAmount(list)),
        valid: money(sumAmount(valid)),
        cancel: money(sumAmount(canceled)),
        pending: money(sumAmount(valid.filter((o: any) => o.status !== 3))),
        settled: money(sumAmount(valid.filter((o: any) => o.status === 3))),
    }
}

const allOrders = [
    ...nursingOrders.map((o: any) => ({ ...o, _type: '托管单' })),
    ...mealOrders.map((o: any) => ({ ...o, _type: '膳食单' })),
    ...escortOrders.map((o: any) => ({ ...o, _type: '陪诊单' })),
]
const pick = (type: string) => allOrders.filter((o: any) => o._type === type)

const typeRows = computed(() =>
    ['托管单', '膳食单', '陪诊单'].map((name) => ({ name, ...buildTypeStat(pick(name)) }))
)

const summary = computed(() => {
    const valid = allOrders.filter((o: any) => o.pay_status === 1 && o.status !== 4)
    const canceled = allOrders.filter((o: any) => o.status === 4)
    // 员工收益 = 已完成单量 × 收益配置金额（托管单次收益受最低/最高限制）
    const nursingUnit = Math.min(
        Math.max(Number(profitConfig.nursing_price) || 0, Number(profitConfig.nursing_min) || 0),
        Number(profitConfig.nursing_max) || Number.MAX_SAFE_INTEGER
    )
    const staffTotal = staffEarningRows.reduce(
        (s, row: any) =>
            s +
            row.nursing_count * nursingUnit +
            row.delivery_count * (Number(profitConfig.meal_price) || 0) +
            row.escort_count * (Number(profitConfig.escort_price) || 0),
        0
    )
    return {
        order_total: money(sumAmount(allOrders)),
        order_valid: money(sumAmount(valid)),
        order_refund: money(sumAmount(canceled)),
        settle_pending: money(sumAmount(valid.filter((o: any) => o.status !== 3))),
        settle_done: money(sumAmount(valid.filter((o: any) => o.status === 3))),
        staff_earnings_total: money(staffTotal),
    }
})
</script>

<style lang="scss" scoped>
.stat-box {
    @apply rounded-lg p-4 bg-gray-50;
}
.stat-label {
    @apply text-sm text-tx-secondary;
}
.stat-value {
    @apply text-xl font-semibold mt-2;
}
</style>
