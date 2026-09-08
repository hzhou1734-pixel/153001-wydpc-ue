<template>
  <div class="space-y-4">
    <el-card class="!border-none" shadow="never">
      <template #header>
        <span class="card-title">财务总览</span>
      </template>
      <div class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
        <div v-for="card in cards" :key="card.label" class="rounded-lg p-4 bg-gray-50">
          <div class="text-sm text-gray-500">{{ card.label }}</div>
          <div class="text-xl font-semibold mt-2" :class="card.color">¥{{ info[card.field] ?? '0.00' }}</div>
        </div>
      </div>
    </el-card>

    <el-card class="!border-none" shadow="never">
      <template #header>
        <span class="card-title">资金说明</span>
      </template>
      <el-descriptions :column="2" border>
        <el-descriptions-item label="今日收入">¥{{ info.today_income }}</el-descriptions-item>
        <el-descriptions-item label="本月收入">¥{{ info.month_income }}</el-descriptions-item>
        <el-descriptions-item label="累计收入">¥{{ info.total_income }}</el-descriptions-item>
        <el-descriptions-item label="账户余额">¥{{ info.balance }}</el-descriptions-item>
        <el-descriptions-item label="本月结算">¥{{ info.month_settle }}</el-descriptions-item>
        <el-descriptions-item label="累计结算">¥{{ info.total_settle }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup lang="ts" name="financeOverview">
import { getFinanceOverview } from '@/mock/api'

const info = ref<Record<string, string>>({})

const cards = computed(() => [
  { label: '今日收入', field: 'today_income', color: 'text-green-600' },
  { label: '本月收入', field: 'month_income', color: 'text-green-600' },
  { label: '累计收入', field: 'total_income', color: 'text-green-600' },
  { label: '今日退款', field: 'today_refund', color: 'text-red-500' },
  { label: '本月退款', field: 'month_refund', color: 'text-red-500' },
  { label: '累计退款', field: 'total_refund', color: 'text-red-500' },
  { label: '本月结算', field: 'month_settle', color: 'text-blue-500' },
  { label: '累计结算', field: 'total_settle', color: 'text-blue-500' },
  { label: '账户余额', field: 'balance', color: 'text-orange-500' }
])

onMounted(async () => {
  const res = await getFinanceOverview()
  info.value = res as Record<string, string>
})
</script>
