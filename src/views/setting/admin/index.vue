<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">管理员账号</span>
        <el-input v-model="keyword" placeholder="搜索账号/姓名/角色" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column prop="username" label="登录账号" min-width="120" />
      <el-table-column prop="nickname" label="姓名" min-width="110" />
      <el-table-column prop="role" label="角色" width="120">
        <template #default="{ row }">
          <el-tag size="small" type="warning">{{ row.role }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="mobile" label="手机号" width="130" />
      <el-table-column prop="last_login" label="最近登录" width="170" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="onStatusChange(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="170" />
      <el-table-column label="操作" width="90" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" size="small" @click="openEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end mt-4">
      <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.limit" :total="pager.total" layout="total, prev, pager, next" @current-change="getLists" />
    </div>
  </el-card>

  <el-dialog v-model="editVisible" title="编辑管理员" width="480">
    <el-form :model="editForm" label-width="90">
      <el-form-item label="登录账号">
        <el-input v-model="editForm.username" />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="editForm.nickname" />
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="editForm.role" class="!w-full">
          <el-option label="超级管理员" value="超级管理员" />
          <el-option label="运营专员" value="运营专员" />
          <el-option label="财务专员" value="财务专员" />
          <el-option label="客服专员" value="客服专员" />
          <el-option label="保洁主管" value="保洁主管" />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="editForm.mobile" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="settingAdmin">
import { getAdminList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getAdminList, firstLoading: true })
const keyword = ref('')
const editVisible = ref(false)

const editForm = reactive({
  id: 0,
  username: '',
  nickname: '',
  role: '',
  mobile: ''
})

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.username?.includes(kw) || item.nickname?.includes(kw) || item.role?.includes(kw))
})

const onStatusChange = (row: any) => {
  ElMessage.success(row.status === 1 ? `已启用账号「${row.username}」` : `已禁用账号「${row.username}」`)
}

const openEdit = (row: any) => {
  Object.assign(editForm, { id: row.id, username: row.username, nickname: row.nickname, role: row.role, mobile: row.mobile })
  editVisible.value = true
}

const saveEdit = () => {
  const target = pager.lists.find((item: any) => item.id === editForm.id)
  if (target) Object.assign(target, editForm)
  editVisible.value = false
  ElMessage.success('保存成功')
}

onMounted(getLists)
</script>
