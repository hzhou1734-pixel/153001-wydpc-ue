<template>
    <div class="finance-overview" v-loading="loading">
        <!-- 订单金额总览 -->
        <el-card class="!border-none" shadow="never">
            <template #header>
                <span class="card-title">订单金额</span>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="stat-box">
                    <div class="stat-label">订单总金额</div>
                    <div class="stat-value">¥{{ info.order_total || '0.00' }}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">有效订单总金额（待结算 + 已完成）</div>
                    <div class="stat-value text-green-600">¥{{ info.order_valid || '0.00' }}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">退款订单总金额</div>
                    <div class="stat-value text-red-500">¥{{ info.order_refund || '0.00' }}</div>
                </div>
            </div>
        </el-card>

        <!-- 各类订单金额 -->
        <el-card class="!border-none mt-4" shadow="never">
            <template #header>
                <span class="card-title">分类订单金额</span>
            </template>
            <el-table :data="typeRows" border stripe>
                <el-table-column prop="name" label="订单类型" min-width="120" />
                <el-table-column label="订单总金额" min-width="140">
                    <template #default="{ row }">
                        <span class="font-medium">¥{{ row.data.total }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="有效订单总金额" min-width="150">
                    <template #default="{ row }">
                        <span class="text-green-600 font-medium">¥{{ row.data.valid }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已取消订单总金额" min-width="160">
                    <template #default="{ row }">
                        <span class="text-red-500 font-medium">¥{{ row.data.cancel }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 结算情况 -->
        <el-card class="!border-none mt-4" shadow="never">
            <template #header>
                <span class="card-title">结算金额</span>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div class="stat-box">
                    <div class="stat-label">待结算总金额</div>
                    <div class="stat-value text-orange-500">¥{{ info.settle_pending || '0.00' }}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">已结算总金额</div>
                    <div class="stat-value text-blue-500">¥{{ info.settle_done || '0.00' }}</div>
                </div>
            </div>
            <el-table :data="typeRows" border stripe>
                <el-table-column prop="name" label="订单类型" min-width="120" />
                <el-table-column label="待结算金额" min-width="140">
                    <template #default="{ row }">
                        <span class="text-orange-500 font-medium">¥{{ row.data.pending }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已结算金额" min-width="140">
                    <template #default="{ row }">
                        <span class="text-blue-500 font-medium">¥{{ row.data.settled }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 员工收益 -->
        <el-card class="!border-none mt-4" shadow="never">
            <template #header>
                <span class="card-title">员工收益</span>
            </template>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="stat-box">
                    <div class="stat-label">员工已获得收益总额</div>
                    <div class="stat-value text-green-600">¥{{ info.staff_earnings_total || '0.00' }}</div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="financeOverview">
import { getFinanceOverview } from '@/mock/api'

const loading = ref(false)
const info = ref<Record<string, any>>({})

const emptyStat = { total: '0.00', valid: '0.00', cancel: '0.00', pending: '0.00', settled: '0.00' }

const typeRows = computed(() => [
    { name: '托管单', data: info.value.nursing || emptyStat },
    { name: '膳食单', data: info.value.meal || emptyStat },
    { name: '陪诊单', data: info.value.escort || emptyStat }
])

const getDetail = async () => {
    loading.value = true
    try {
        const res: any = await getFinanceOverview()
        info.value = res || {}
    } finally {
        loading.value = false
    }
}

onMounted(getDetail)
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
