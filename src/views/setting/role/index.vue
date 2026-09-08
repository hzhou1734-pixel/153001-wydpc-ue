<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">角色管理</span>
        <el-input v-model="keyword" placeholder="搜索角色名称" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column prop="name" label="角色名称" min-width="140">
        <template #default="{ row }">
          <el-tag size="small" type="primary">{{ row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="角色描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="members" label="成员数量" width="110" sortable />
      <el-table-column prop="create_time" label="创建时间" width="170" />
    </el-table>
    <div class="flex justify-end mt-4">
      <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.limit" :total="pager.total" layout="total, prev, pager, next" @current-change="getLists" />
    </div>
  </el-card>
</template>

<script setup lang="ts" name="settingRole">
import { getRoleList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getRoleList, firstLoading: true })
const keyword = ref('')

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.name?.includes(kw))
})

onMounted(getLists)
</script>
