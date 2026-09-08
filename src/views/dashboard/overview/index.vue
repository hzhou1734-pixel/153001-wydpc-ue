<script setup lang="ts" name="dashboardOverview">
import { getDashboardStats } from '@/mock/api'

interface StatItem {
    today: number | string
    month: number | string
    total: number | string
}

const loading = ref(false)
const stats = ref<Record<string, StatItem>>({
    community: { today: 0, month: 0, total: 0 },
    user: { today: 0, month: 0, total: 0 },
    order: { today: 0, month: 0, total: 0 },
    trade: { today: '0.00', month: '0.00', total: '0.00' },
    settle: { today: '0.00', month: '0.00', total: '0.00' }
})

const statCards = computed(() => [
    { key: 'community', label: '小区数', icon: 'local-icon-xiaoqu', color: '#409eff' },
    { key: 'user', label: '用户数', icon: 'local-icon-yonghu', color: '#67c23a' },
    { key: 'order', label: '订单数', icon: 'local-icon-dingdan', color: '#e6a23c' },
    { key: 'trade', label: '交易额（元）', icon: 'local-icon-jiaoyi', color: '#f56c6c' },
    { key: 'settle', label: '结算额（元）', icon: 'local-icon-jiesuan', color: '#9b59f6' }
])

const getStats = async () => {
    loading.value = true
    try {
        stats.value = await getDashboardStats()
    } finally {
        loading.value = false
    }
}

onMounted(getStats)
</script>

<template>
    <div class="dashboard-overview" v-loading="loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <span class="card-title">数据总览</span>
            </template>
            <div class="flex flex-wrap">
                <div
                    v-for="card in statCards"
                    :key="card.key"
                    class="w-1/2 md:w-1/3 lg:w-1/5 mb-4"
                >
                    <div class="flex items-center">
                        <div
                            class="flex items-center justify-center w-12 h-12 rounded-lg mr-3"
                            :style="{ backgroundColor: card.color + '1a' }"
                        >
                            <icon :name="card.icon" :size="24" :color="card.color" />
                        </div>
                        <div class="leading-6">
                            <div class="text-tx-secondary text-sm">{{ card.label }}</div>
                            <div class="text-2xl font-medium">{{ stats[card.key]?.today ?? 0 }}</div>
                        </div>
                    </div>
                    <div class="text-tx-secondary text-xs mt-2 ml-15">
                        本月：{{ stats[card.key]?.month ?? 0 }}　累计：{{ stats[card.key]?.total ?? 0 }}
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>
