<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">对账单管理</span>
        <el-input v-model="keyword" placeholder="搜索单号/小区" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column prop="sn" label="账单编号" min-width="180" show-overflow-tooltip />
      <el-table-column prop="community" label="所属小区" min-width="140" show-overflow-tooltip />
      <el-table-column label="收入" width="120">
        <template #default="{ row }">
          <span class="text-green-600 font-medium">¥{{ row.income }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款" width="120">
        <template #default="{ row }">
          <span class="text-red-500 font-medium">¥{{ row.refund }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应结算" width="120">
        <template #default="{ row }">
          <span class="text-blue-500 font-medium">¥{{ row.settle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结算状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'warning'" size="small">{{ row.status === 1 ? '已结算' : '未结算' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="bill_time" label="账期" width="170" />
      <el-table-column label="操作" width="120" fixed="right">
        <template #default="{ row }">
          <el-button v-if="row.status === 0" link type="primary" @click="settle(row)">立即结算</el-button>
          <el-button v-else link type="info" @click="settleDetail(row)">结算明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end mt-4">
      <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.limit" :total="pager.total" layout="total, prev, pager, next" @current-change="getLists" />
    </div>
  </el-card>
</template>

<script setup lang="ts" name="financeBill">
import { getFinanceBill } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getFinanceBill, firstLoading: true })
const keyword = ref('')

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.sn?.includes(kw) || item.community?.includes(kw))
})

const settle = (row: any) => {
  ElMessageBox.confirm(`确定结算账单「${row.sn}」吗？应结算金额 ¥${row.settle}。`, '结算确认', { type: 'warning' })
    .then(() => {
      row.status = 1
      ElMessage.success('结算成功')
    })
    .catch(() => {})
}

const settleDetail = (row: any) => {
  ElMessageBox.alert(
    `账单编号：${row.sn}\n所属小区：${row.community}\n收入：¥${row.income}\n退款：¥${row.refund}\n结算金额：¥${row.settle}\n账期：${row.bill_time}`,
    '结算明细',
    { confirmButtonText: '关闭' }
  )
}

onMounted(getLists)
</script>
