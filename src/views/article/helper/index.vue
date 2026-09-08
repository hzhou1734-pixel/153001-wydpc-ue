<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">便民服务</span>
        <el-input v-model="keyword" placeholder="搜索标题/分类/联系人" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column label="封面" width="100">
        <template #default="{ row }">
          <el-image :src="row.cover" :preview-src-list="[row.cover]" preview-teleported fit="cover" class="w-14 h-10 rounded" />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="服务名称" min-width="160" show-overflow-tooltip />
      <el-table-column label="分类" width="100">
        <template #default="{ row }">
          <el-tag size="small">{{ row.category }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contact" label="联系人" width="100" />
      <el-table-column prop="phone" label="联系电话" width="130" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="toggleStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="170" />
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

  <el-dialog v-model="editVisible" title="编辑便民服务" width="520px">
    <el-form :model="editForm" label-width="90px">
      <el-form-item label="服务名称">
        <el-input v-model="editForm.title" placeholder="请输入服务名称" />
      </el-form-item>
      <el-form-item label="分类">
        <el-input v-model="editForm.category" placeholder="请输入分类" />
      </el-form-item>
      <el-form-item label="联系人">
        <el-input v-model="editForm.contact" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="editForm.phone" placeholder="请输入联系电话" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="articleHelper">
import { getHelperList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getHelperList, firstLoading: true })
const keyword = ref('')

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.title?.includes(kw) || item.category?.includes(kw) || item.contact?.includes(kw))
})

const editVisible = ref(false)
const editForm = reactive({ id: 0, title: '', category: '', contact: '', phone: '' })
const openEdit = (row: any) => {
  editForm.id = row.id
  editForm.title = row.title
  editForm.category = row.category
  editForm.contact = row.contact
  editForm.phone = row.phone
  editVisible.value = true
}
const saveEdit = () => {
  const row = pager.lists.find((item: any) => item.id === editForm.id)
  if (row) {
    row.title = editForm.title
    row.category = editForm.category
    row.contact = editForm.contact
    row.phone = editForm.phone
  }
  editVisible.value = false
  ElMessage.success('保存成功')
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
