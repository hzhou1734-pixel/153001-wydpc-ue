<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">精彩时刻</span>
        <el-input v-model="keyword" placeholder="搜索标题/作者" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column label="封面" width="100">
        <template #default="{ row }">
          <el-image :src="row.cover" :preview-src-list="[row.cover]" preview-teleported fit="cover" class="w-14 h-10 rounded" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
      <el-table-column prop="author" label="发布人" width="110" />
      <el-table-column prop="views" label="浏览量" width="100" sortable />
      <el-table-column prop="likes" label="点赞数" width="100" sortable />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="toggleStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="170" />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">详情</el-button>
          <el-button link type="danger" @click="removeRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end mt-4">
      <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.limit" :total="pager.total" layout="total, prev, pager, next" @current-change="getLists" />
    </div>
  </el-card>

  <el-dialog v-model="detailVisible" title="精彩时刻详情" width="560px">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="标题" :span="2">{{ current.title }}</el-descriptions-item>
      <el-descriptions-item label="发布人">{{ current.author }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ current.status === 1 ? '已上架' : '已下架' }}</el-descriptions-item>
      <el-descriptions-item label="浏览量">{{ current.views }}</el-descriptions-item>
      <el-descriptions-item label="点赞数">{{ current.likes }}</el-descriptions-item>
      <el-descriptions-item label="创建时间" :span="2">{{ current.create_time }}</el-descriptions-item>
      <el-descriptions-item label="封面" :span="2">
        <el-image :src="current.cover" :preview-src-list="[current.cover]" preview-teleported fit="cover" class="w-32 h-24 rounded" />
      </el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts" name="articleWonderful">
import { getWonderfulList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getWonderfulList, firstLoading: true })
const keyword = ref('')

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.title?.includes(kw) || item.author?.includes(kw))
})

const detailVisible = ref(false)
const current = ref<any>({})
const openDetail = (row: any) => {
  current.value = row
  detailVisible.value = true
}

const toggleStatus = (row: any) => {
  ElMessage.success(`已${row.status === 1 ? '上架' : '下架'}：${row.title}`)
}

const removeRow = (row: any) => {
  ElMessageBox.confirm(`确定删除「${row.title}」吗？删除后不可恢复。`, '提示', { type: 'warning' })
    .then(() => {
      const idx = pager.lists.indexOf(row)
      if (idx > -1) pager.lists.splice(idx, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

onMounted(getLists)
</script>
