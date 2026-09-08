<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">员工分账</span>
        <el-input v-model="keyword" placeholder="搜索员工/月份" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column prop="staff" label="员工" width="110" />
      <el-table-column prop="role" label="岗位" width="120">
        <template #default="{ row }">
          <el-tag size="small">{{ row.role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="month" label="结算月份" width="110" />
      <el-table-column prop="orders" label="订单数" width="100" sortable />
      <el-table-column label="分成金额" width="120">
        <template #default="{ row }">
          <span class="text-green-600 font-medium">¥{{ row.income }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已结算" width="120">
        <template #default="{ row }">
          <span>¥{{ row.settled }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待结算" width="120">
        <template #default="{ row }">
          <span class="text-orange-500 font-medium">¥{{ row.un_settled }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end mt-4">
      <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.limit" :total="pager.total" layout="total, prev, pager, next" @current-change="getLists" />
    </div>
  </el-card>
</template>

<script setup lang="ts" name="financeEarnings">
import { getStaffEarnings } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getStaffEarnings, firstLoading: true })
const keyword = ref('')

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.staff?.includes(kw) || item.month?.includes(kw) || item.role?.includes(kw))
})

onMounted(getLists)
</script>
