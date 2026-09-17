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
                {{ totalStat.cancel_count }} 单，有效总金额 ¥{{ totalStat.valid_amount }}（不含生活服务业务，系统不收取对应服务金额）
            </div>

            <!-- 各类业务统计 -->
            <el-row :gutter="16">
                <el-col v-for="row in businessRows" :key="row.name" :span="24" :lg="8" class="mb-4">
                    <el-card class="!border-none" shadow="never">
                        <template #header>
                            <div class="flex items-center justify-between flex-wrap">
                                <span class="font-medium">{{ row.name }}</span>
                                <span v-if="row.offline" class="text-xs text-tx-secondary">系统不收取对应服务金额</span>
                            </div>
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
                <el-table-column label="业务类型" prop="name" min-width="130" />
                <el-table-column label="订单总数" prop="count" min-width="100" />
                <el-table-column label="交易总额（元）" prop="amount" min-width="130" />
                <el-table-column label="取消订单数量" prop="cancel_count" min-width="120" />
                <el-table-column label="有效总金额（元）" prop="valid_amount" min-width="140" />
                <el-table-column label="备注" prop="remark" min-width="200" show-overflow-tooltip />
            </el-table>
            <div class="text-xs text-tx-secondary mt-2">
                说明：合计仅统计物业收取的陪诊、托管、膳食三类业务；生活服务业务由用户与人才线下完成交易，系统不收取对应服务金额。
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="dashboardBusiness">
/**
 * 业务总览
 * 陪诊 / 托管 / 膳食 / 生活服务四类业务：订单总数、交易总额、取消订单数量、有效总金额
 * 支持按下单时间范围筛选（create_time 落在范围内）并导出 Excel（CSV）
 * 统计口径：
 *  - 陪诊 / 托管 / 膳食：交易总额 = 已支付订单金额；有效订单 = 已支付且未取消；取消订单 = status 4
 *  - 生活服务：系统不收取服务金额，交易总额 = 全部订单金额合计，有效总金额 = 未取消订单金额合计
 *  - 合计行仅为物业收取的三类业务，不含生活服务业务
 */
import { escortOrders, mealOrders, nursingOrders } from '@/mock/data'
import { helperOrders } from '@/mock/data_order'
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

/**
 * 单类业务统计
 * @param list 订单列表
 * @param offline 是否为生活服务（系统不收取，交易总额按全部订单金额统计）
 */
const buildStat = (list: any[], offline = false) => {
    const canceled = list.filter((item: any) => item.status === 4)
    const valid = list.filter((item: any) => item.status !== 4)
    // 物业收取的业务：交易总额只统计已支付订单；生活服务为线下交易，按全部订单金额统计
    const amountSource = offline ? list : list.filter((item: any) => item.pay_status === 1)
    const validSource = offline ? valid : valid.filter((item: any) => item.pay_status === 1)
    return {
        count: list.length,
        amount: money(sumAmount(amountSource)),
        cancel_count: canceled.length,
        valid_amount: money(sumAmount(validSource)),
        remark: offline ? '系统不收取对应服务金额' : ''
    }
}

/** 各类业务原始数据（offline = true 表示系统不收取金额） */
const businessGroups = [
    { name: '陪诊业务', orders: escortOrders, offline: false },
    { name: '托管业务', orders: nursingOrders, offline: false },
    { name: '膳食业务', orders: mealOrders, offline: false },
    { name: '生活服务业务', orders: helperOrders, offline: true }
]

/** 筛选后的各类业务统计结果 */
const statRows = computed(() =>
    businessGroups.map((group) => ({
        name: group.name,
        offline: group.offline,
        ...buildStat(filterByRange(group.orders), group.offline)
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

/** 合计：仅物业收取的陪诊 / 托管 / 膳食三类业务 */
const totalStat = computed(() => {
    const rows = statRows.value.filter((row) => !row.offline)
    return {
        count: rows.reduce((sum, row) => sum + row.count, 0),
        amount: money(rows.reduce((sum, row) => sum + Number(row.amount), 0)),
        cancel_count: rows.reduce((sum, row) => sum + row.cancel_count, 0),
        valid_amount: money(rows.reduce((sum, row) => sum + Number(row.valid_amount), 0)),
        remark: '不含生活服务业务（系统不收取对应服务金额）'
    }
})

/** 表格数据：明细 + 合计行 */
const tableRows = computed(() => [
    ...statRows.value.map(({ name, count, amount, cancel_count, valid_amount, remark }) => ({
        name,
        count,
        amount,
        cancel_count,
        valid_amount,
        remark
    })),
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

/** 导出各类业务统计结果 */
const handleExport = () => {
    exportCsv(
        '业务总览',
        [
            { label: '业务类型', prop: 'name' },
            { label: '订单总数', prop: 'count' },
            { label: '交易总额（元）', prop: 'amount' },
            { label: '取消订单数量', prop: 'cancel_count' },
            { label: '有效总金额（元）', prop: 'valid_amount' },
            { label: '备注', prop: 'remark' },
            { label: '统计范围', formatter: () => rangeText.value }
        ],
        tableRows.value
    )
}
</script>
