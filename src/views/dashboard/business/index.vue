<template>
    <div class="dashboard-business">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between flex-wrap">
                    <span class="font-medium">业务总览</span>
                    <el-button type="primary" @click="handleExport">
                        <template #icon><icon name="el-icon-Download" /></template>
                        导出Excel
                    </el-button>
                </div>
            </template>

            <!-- 时间范围筛选 -->
            <el-form inline class="mb-2">
                <el-form-item label="下单时间">
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="YYYY-MM-DD"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>

            <div class="text-xs text-tx-secondary mb-4">
                当前统计范围：{{ rangeText }}　|　订单总数 {{ totalStat.count }} 单，交易总额 ¥{{ totalStat.amount }}，取消订单
                {{ totalStat.cancel_count }} 单，有效总金额 ¥{{ totalStat.valid_amount }}
            </div>

            <!-- 三类业务统计 -->
            <el-row :gutter="16">
                <el-col v-for="row in businessRows" :key="row.name" :span="24" :lg="8" class="mb-4">
                    <el-card class="!border-none" shadow="never">
                        <template #header>
                            <span class="font-medium">{{ row.name }}</span>
                        </template>
                        <div class="flex flex-wrap">
                            <div v-for="item in row.items" :key="item.label" class="w-1/2 mb-4">
                                <div class="text-xs text-tx-secondary mb-1">{{ item.label }}</div>
                                <div class="text-2xl font-medium" :class="item.color">{{ item.value }}</div>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>

            <el-table :data="tableRows" border stripe>
                <el-table-column label="业务类型" prop="name" min-width="110" />
                <el-table-column label="订单总数" prop="count" min-width="100" />
                <el-table-column label="交易总额（元）" prop="amount" min-width="130" />
                <el-table-column label="取消订单数量" prop="cancel_count" min-width="120" />
                <el-table-column label="有效总金额（元）" prop="valid_amount" min-width="140" />
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="dashboardBusiness">
/**
 * 业务总览
 * 陪诊 / 托管 / 膳食三类业务：订单总数、交易总额、取消订单数量、有效总金额
 * 支持按下单时间范围筛选（create_time 落在范围内）并导出 Excel（CSV）
 * 统计口径：交易总额 = 已支付订单金额；有效订单 = 已支付且未取消；取消订单 = status 4
 */
import { escortOrders, mealOrders, nursingOrders } from '@/mock/data'
import { exportCsv } from '@/utils/export'

/** 下单时间范围（选择中） */
const dateRange = ref<string[]>([])
/** 已应用的时间范围（点击查询后生效） */
const appliedRange = ref<string[]>([])

/** 金额求和 */
const sumAmount = (list: any[]) => list.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
/** 金额格式化 */
const money = (value: number) => Number(value || 0).toFixed(2)

/** 按下单时间范围过滤 */
const filterByRange = (list: any[]) => {
    const start = appliedRange.value?.[0] || ''
    const end = appliedRange.value?.[1] || ''
    return list.filter((item: any) => {
        const day = String(item.create_time).slice(0, 10)
        if (start && day < start) return false
        if (end && day > end) return false
        return true
    })
}

/** 单类业务统计 */
const buildStat = (list: any[]) => {
    const paid = list.filter((item: any) => item.pay_status === 1)
    const canceled = list.filter((item: any) => item.status === 4)
    return {
        count: list.length,
        amount: money(sumAmount(paid)),
        cancel_count: canceled.length,
        valid_amount: money(sumAmount(paid.filter((item: any) => item.status !== 4)))
    }
}

/** 三类业务原始数据 */
const businessGroups = [
    { name: '陪诊业务', orders: escortOrders },
    { name: '托管业务', orders: nursingOrders },
    { name: '膳食业务', orders: mealOrders }
]

/** 筛选后的三类业务统计结果 */
const statRows = computed(() =>
    businessGroups.map((group) => ({
        name: group.name,
        ...buildStat(filterByRange(group.orders))
    }))
)

const businessRows = computed(() =>
    statRows.value.map((row) => ({
        ...row,
        items: [
            { label: '订单总数', value: `${row.count} 单`, color: 'text-primary' },
            { label: '交易总额', value: `¥${row.amount}`, color: 'text-warning' },
            { label: '取消订单数量', value: `${row.cancel_count} 单`, color: 'text-danger' },
            { label: '有效总金额', value: `¥${row.valid_amount}`, color: 'text-success' }
        ]
    }))
)

/** 三类业务合计 */
const totalStat = computed(() => ({
    count: statRows.value.reduce((sum, row) => sum + row.count, 0),
    amount: money(statRows.value.reduce((sum, row) => sum + Number(row.amount), 0)),
    cancel_count: statRows.value.reduce((sum, row) => sum + row.cancel_count, 0),
    valid_amount: money(statRows.value.reduce((sum, row) => sum + Number(row.valid_amount), 0))
}))

/** 表格数据：明细 + 合计行 */
const tableRows = computed(() => [
    ...statRows.value,
    { name: '合计', ...totalStat.value }
])

/** 统计范围文案 */
const rangeText = computed(() => {
    if (!appliedRange.value?.length) return '全部时间'
    return `${appliedRange.value[0]} 至 ${appliedRange.value[1]}`
})

const handleSearch = () => {
    appliedRange.value = [...dateRange.value]
}

const handleReset = () => {
    dateRange.value = []
    appliedRange.value = []
}

/** 导出三类业务统计结果 */
const handleExport = () => {
    exportCsv(
        '业务总览',
        [
            { label: '业务类型', prop: 'name' },
            { label: '订单总数', prop: 'count' },
            { label: '交易总额（元）', prop: 'amount' },
            { label: '取消订单数量', prop: 'cancel_count' },
            { label: '有效总金额（元）', prop: 'valid_amount' },
            { label: '统计范围', formatter: () => rangeText.value }
        ],
        statRows.value
    )
}
</script>
