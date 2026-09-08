<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">资金流水</span>
        <el-input v-model="keyword" placeholder="搜索单号/来源" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column prop="sn" label="流水单号" min-width="180" show-overflow-tooltip />
      <el-table-column prop="type" label="类型" width="110">
        <template #default="{ row }">
          <el-tag size="small">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="from" label="来源" min-width="140" show-overflow-tooltip />
      <el-table-column label="金额" width="130">
        <template #default="{ row }">
          <span class="font-medium" :class="amountClass(row.amount)">{{ row.amount }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="pay_type" label="支付方式" width="110" />
      <el-table-column prop="create_time" label="时间" width="170" />
    </el-table>
    <div class="flex justify-end mt-4">
      <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.limit" :total="pager.total" layout="total, prev, pager, next" @current-change="getLists" />
    </div>
  </el-card>
</template>

<script setup lang="ts" name="financeFlow">
import { getFinanceFlow } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getFinanceFlow, firstLoading: true })
const keyword = ref('')

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.sn?.includes(kw) || item.from?.includes(kw))
})

const amountClass = (amount: string) => {
  if (amount?.startsWith('+')) return 'text-green-600'
  if (amount?.startsWith('-')) return 'text-red-500'
  return ''
}

onMounted(getLists)
</script>
