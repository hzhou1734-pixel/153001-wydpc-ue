<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">轮播图管理</span>
        <el-input v-model="keyword" placeholder="搜索名称/链接" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column label="图片" width="130">
        <template #default="{ row }">
          <el-image :src="row.image" :preview-src-list="[row.image]" preview-teleported fit="cover" class="w-24 h-10 rounded" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="160" show-overflow-tooltip />
      <el-table-column prop="link" label="跳转链接" min-width="200" show-overflow-tooltip />
      <el-table-column prop="sort" label="排序" width="90" sortable />
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

  <el-dialog v-model="editVisible" title="编辑轮播图" width="520px">
    <el-form :model="editForm" label-width="90px">
      <el-form-item label="名称">
        <el-input v-model="editForm.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="图片地址">
        <el-input v-model="editForm.image" placeholder="请输入图片 URL" />
        <el-image v-if="editForm.image" :src="editForm.image" fit="cover" class="w-full h-28 rounded mt-2" />
      </el-form-item>
      <el-form-item label="跳转链接">
        <el-input v-model="editForm.link" placeholder="请输入跳转链接" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="editForm.sort" :min="0" :max="999" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="articleBanner">
import { getBannerList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getBannerList, firstLoading: true })
const keyword = ref('')

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.name?.includes(kw) || item.link?.includes(kw))
})

const editVisible = ref(false)
const editForm = reactive({ id: 0, name: '', image: '', link: '', sort: 0 })
const openEdit = (row: any) => {
  editForm.id = row.id
  editForm.name = row.name
  editForm.image = row.image
  editForm.link = row.link
  editForm.sort = row.sort
  editVisible.value = true
}
const saveEdit = () => {
  const row = pager.lists.find((item: any) => item.id === editForm.id)
  if (row) {
    row.name = editForm.name
    row.image = editForm.image
    row.link = editForm.link
    row.sort = editForm.sort
  }
  editVisible.value = false
  ElMessage.success('保存成功')
}

const toggleStatus = (row: any) => {
  ElMessage.success(`已${row.status === 1 ? '启用' : '停用'}：${row.name}`)
}

const removeRow = (row: any) => {
  ElMessageBox.confirm(`确定删除「${row.name}」吗？删除后不可恢复。`, '提示', { type: 'warning' })
    .then(() => {
      const idx = pager.lists.indexOf(row)
      if (idx > -1) pager.lists.splice(idx, 1)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

onMounted(getLists)
</script>
