<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">物业信息</span>
        <el-button type="primary" plain @click="editVisible = true">编辑信息</el-button>
      </div>
    </template>
    <el-descriptions :column="2" border>
      <el-descriptions-item label="物业名称">{{ info.name }}</el-descriptions-item>
      <el-descriptions-item label="简称">{{ info.short_name }}</el-descriptions-item>
      <el-descriptions-item label="负责人">{{ info.contact }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ info.mobile }}</el-descriptions-item>
      <el-descriptions-item label="办公地址" :span="2">{{ info.address }}</el-descriptions-item>
      <el-descriptions-item label="营业执照" :span="2">
        <el-image v-if="info.license" :src="info.license" :preview-src-list="[info.license]" preview-teleported fit="cover" class="w-40 h-28 rounded" />
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ info.create_time }}</el-descriptions-item>
    </el-descriptions>
  </el-card>

  <el-dialog v-model="editVisible" title="编辑物业信息" width="520">
    <el-form :model="editForm" label-width="90">
      <el-form-item label="物业名称">
        <el-input v-model="editForm.name" />
      </el-form-item>
      <el-form-item label="简称">
        <el-input v-model="editForm.short_name" />
      </el-form-item>
      <el-form-item label="负责人">
        <el-input v-model="editForm.contact" />
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="editForm.mobile" />
      </el-form-item>
      <el-form-item label="办公地址">
        <el-input v-model="editForm.address" />
      </el-form-item>
      <el-form-item label="营业执照">
        <el-input v-model="editForm.license" />
        <el-image v-if="editForm.license" :src="editForm.license" fit="cover" class="w-full h-28 rounded mt-2" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="settingProperty">
import { getPropertyInfo } from '@/mock/api'
import { ElMessage } from 'element-plus'

const info = ref<Record<string, string>>({})
const editVisible = ref(false)

const editForm = reactive({
  name: '',
  short_name: '',
  contact: '',
  mobile: '',
  address: '',
  license: ''
})

const saveEdit = () => {
  Object.assign(info.value, editForm)
  editVisible.value = false
  ElMessage.success('保存成功')
}

onMounted(async () => {
  const res = await getPropertyInfo()
  info.value = res as Record<string, string>
  Object.assign(editForm, info.value)
})
</script>
