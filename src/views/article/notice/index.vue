<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">通知公告</span>
        <el-input v-model="keyword" placeholder="搜索标题" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column label="标题" min-width="220">
        <template #default="{ row }">
          <span>{{ row.title }}</span>
          <el-tag v-if="row.is_top === 1" type="danger" size="small" class="ml-2">置顶</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" width="110">
        <template #default="{ row }">
          <el-tag :type="typeTag(row.type)" size="small">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="views" label="浏览量" width="100" sortable />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="toggleStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="发布时间" width="170" />
      <el-table-column label="操作" width="140" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="removeRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end mt-4">
      <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.limit" :total="pager.total" layout="total, prev, pager, next" @current-change="getLists" />
    </div>
  </el-card>

  <el-dialog v-model="editVisible" title="编辑通知公告" width="520px">
    <el-form :model="editForm" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="editForm.title" placeholder="���输入标题" />
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="editForm.type">
          <el-radio value="物业通知">物业通知</el-radio>
          <el-radio value="活动通知">活动通知</el-radio>
          <el-radio value="安全提示">安全提示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="置顶">
        <el-switch v-model="editForm.is_top" :active-value="1" :inactive-value="0" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="articleNotice">
import { getNoticeList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getNoticeList, firstLoading: true })
const keyword = ref('')

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.title?.includes(kw))
})

const typeTag = (type: string) => {
  const map: Record<string, string> = { 物业通知: 'primary', 活动通知: 'success', 安全提示: 'warning' }
  return map[type] || 'info'
}

const editVisible = ref(false)
const editForm = reactive({ id: 0, title: '', type: '物业通知', is_top: 0 })
const openEdit = (row: any) => {
  editForm.id = row.id
  editForm.title = row.title
  editForm.type = row.type
  editForm.is_top = row.is_top
  editVisible.value = true
}
const saveEdit = () => {
  const row = pager.lists.find((item: any) => item.id === editForm.id)
  if (row) {
    row.title = editForm.title
    row.type = editForm.type
    row.is_top = editForm.is_top
  }
  editVisible.value = false
  ElMessage.success('保存成功')
}

const toggleStatus = (row: any) => {
  ElMessage.success(`已${row.status === 1 ? '发布' : '下架'}：${row.title}`)
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
