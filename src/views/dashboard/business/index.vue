<script setup lang="ts" name="dashboardBusiness">
import { getDashboardBusiness } from '@/mock/api'

interface BusinessRow {
    date: string
    orders: number
    amount: string
    users: number
}

const loading = ref(false)
const dateRange = ref<[string, string] | null>(null)
const activeTab = ref('escort')
const business = ref<Record<string, BusinessRow[]>>({
    escort: [],
    nursing: [],
    meal: []
})

const tabs = [
    { name: 'escort', label: '陪诊业务' },
    { name: 'nursing', label: '托管业务' },
    { name: 'meal', label: '膳食业务' }
]

const getBusiness = async () => {
    loading.value = true
    try {
        business.value = await getDashboardBusiness({
            start_time: dateRange.value?.[0] || '',
            end_time: dateRange.value?.[1] || ''
        })
    } finally {
        loading.value = false
    }
}

const handleSearch = () => {
    getBusiness()
}

const handleReset = () => {
    dateRange.value = null
    getBusiness()
}

const handleExport = () => {
    const rows = business.value[activeTab.value] || []
    const header = '日期,订单数,交易额(元),下单用户数\n'
    const csv = rows.map((r) => `${r.date},${r.orders},${r.amount},${r.users}`).join('\n')
    const blob = new Blob(['\ufeff' + header + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `业务总览-${tabs.find((t) => t.name === activeTab.value)?.label || '数据'}.csv`
    link.click()
    URL.revokeObjectURL(link.href)
    feedback.msgSuccess('导出成功')
}

const sumOrders = computed(() => {
    const rows = business.value[activeTab.value] || []
    return rows.reduce((acc, r) => acc + r.orders, 0)
})
const sumAmount = computed(() => {
    const rows = business.value[activeTab.value] || []
    return rows.reduce((acc, r) => acc + Number(r.amount), 0).toFixed(2)
})
const sumUsers = computed(() => {
    const rows = business.value[activeTab.value] || []
    return rows.reduce((acc, r) => acc + r.users, 0)
})

onMounted(getBusiness)
</script>

<template>
    <div class="dashboard-business" v-loading="loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between flex-wrap">
                    <span class="card-title">业务总览</span>
                    <el-button type="primary" @click="handleExport">
                        <template #icon><icon name="el-icon-Download" /></template>
                        导出Excel
                    </el-button>
                </div>
            </template>

            <el-form inline :model="{}" class="mb-2">
                <el-form-item label="时间筛选">
                    <el-date-picker
                        v-model="dateRange"
                        type="daterange"
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

            <el-tabs v-model="activeTab">
                <el-tab-pane v-for="tab in tabs" :key="tab.name" :label="tab.label" :name="tab.name" />
            </el-tabs>

            <div class="flex flex-wrap mb-4 mt-2">
                <div class="w-1/3">
                    <div class="text-tx-secondary text-sm">订单总数</div>
                    <div class="text-2xl font-medium">{{ sumOrders }}</div>
                </div>
                <div class="w-1/3">
                    <div class="text-tx-secondary text-sm">交易总额（元）</div>
                    <div class="text-2xl font-medium">{{ sumAmount }}</div>
                </div>
                <div class="w-1/3">
                    <div class="text-tx-secondary text-sm">下单用户数</div>
                    <div class="text-2xl font-medium">{{ sumUsers }}</div>
                </div>
            </div>

            <el-table :data="business[activeTab] || []" border>
                <el-table-column label="日期" prop="date" min-width="140" />
                <el-table-column label="订单数" prop="orders" min-width="100" />
                <el-table-column label="交易额（元）" prop="amount" min-width="120" />
                <el-table-column label="下单用户数" prop="users" min-width="110" />
            </el-table>
        </el-card>
    </div>
</template>
