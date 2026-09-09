<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">社区活动</span>
        <div class="flex items-center">
          <el-input v-model="keyword" placeholder="搜索标题/地址" :prefix-icon="Search" clearable class="!w-60 !mr-3" @input="getLists" />
          <el-button type="primary" @click="openAdd">添加活动</el-button>
        </div>
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column label="封面" width="100">
        <template #default="{ row }">
          <el-image :src="row.cover" :preview-src-list="[row.cover]" preview-teleported fit="cover" class="w-14 h-10 rounded" />
        </template>
      </el-table-column>
      <el-table-column label="活动标题" min-width="180">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="openDetail(row)">{{ row.title }}</el-link>
          <el-tag v-if="row.signup >= row.limit" type="warning" size="small" class="!ml-1">已满员</el-tag>
        </template>
    </el-table-column>
      <el-table-column label="报名进度" width="180">
        <template #default="{ row }">
          <el-progress :percentage="percent(row)" :stroke-width="8" />
          <span class="text-xs text-gray-400">{{ row.signup }}/{{ row.limit }} 人</span>
        </template>
      </el-table-column>
      <el-table-column prop="start_time" label="开始时间" width="170" />
      <el-table-column prop="address" label="活动地点" min-width="150" show-overflow-tooltip />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-switch v-model="row.status" :active-value="1" :inactive-value="0" @change="toggleStatus(row)" />
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="170" />
      <el-table-column label="操作" width="170" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">详情</el-button>
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="removeRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end mt-4">
      <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.limit" :total="pager.total" layout="total, prev, pager, next" @current-change="getLists" />
    </div>
  </el-card>

  <!-- 详情弹窗 -->
  <el-dialog v-model="detailVisible" title="社区活动详情" width="640px" top="6vh">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="活动标题" :span="2">{{ current.title }}</el-descriptions-item>
      <el-descriptions-item label="开始时间">{{ current.start_time }}</el-descriptions-item>
      <el-descriptions-item label="状态">{{ current.status === 1 ? '进行中' : '已下架' }}</el-descriptions-item>
      <el-descriptions-item label="报名人数">{{ current.signup }}/{{ current.limit }} 人</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ current.create_time }}</el-descriptions-item>
      <el-descriptions-item label="活动地点" :span="2">{{ current.address }}</el-descriptions-item>
      <el-descriptions-item label="封面" :span="2">
        <el-image :src="current.cover" :preview-src-list="[current.cover]" preview-teleported fit="cover" class="w-32 h-24 rounded" />
      </el-descriptions-item>
    </el-descriptions>
    <div class="detail-wrap">
      <div class="detail-content-title">活动详情</div>
      <div class="detail-content rich-content" v-html="current.content || '（暂无详情）'"></div>
    </div>
    <template #footer>
      <el-button @click="detailVisible = false">关闭</el-button>
      <el-button type="primary" @click="detailVisible = false; openEdit(current)">编辑</el-button>
    </template>
  </el-dialog>

  <!-- 添加/编辑弹窗 -->
  <el-dialog v-model="editVisible" :title="editForm.id ? '编辑活动' : '添加活动'" width="680px" top="6vh" destroy-on-close>
    <el-form ref="formRef" :model="editForm" :rules="rules" label-width="90px">
      <el-form-item label="活动标题" prop="title">
        <el-input v-model="editForm.title" placeholder="请输入活动标题" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="活动地点" prop="address">
        <el-input v-model="editForm.address" placeholder="请输入活动地点" maxlength="50" />
      </el-form-item>
      <el-form-item label="开始时间" prop="start_time">
        <el-date-picker v-model="editForm.start_time" type="datetime" placeholder="请选择开始时间" format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm:ss" class="!w-full" />
      </el-form-item>
      <el-form-item label="报名上限" prop="limit">
        <el-input-number v-model="editForm.limit" :min="1" :max="9999" class="!w-40" />
      </el-form-item>
      <el-form-item label="活动封面" prop="cover">
        <el-input v-model="editForm.cover" placeholder="请输入封面图片地址（可留空自动生成）" />
      </el-form-item>
      <el-form-item label="上架状态">
        <el-switch v-model="editForm.status" :active-value="1" :inactive-value="0" active-text="上架" inactive-text="下架" />
      </el-form-item>
      <el-form-item label="活动详情" prop="content">
        <editor v-model="editForm.content" :height="320" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editVisible = false">取消</el-button>
      <el-button type="primary" @click="saveEdit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="articleActivity">
import { getActivityList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'
import Editor from '@/components/editor/index.vue'
import type { FormInstance, FormRules } from 'element-plus'

const { pager, getLists } = usePaging({ fetchFun: getActivityList, firstLoading: true })
const keyword = ref('')

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.title?.includes(kw) || item.address?.includes(kw))
})

const percent = (row: any) => {
  if (!row.limit) return 0
  return Math.min(100, Math.round((row.signup / row.limit) * 100))
}

// 详情
const detailVisible = ref(false)
const current = ref<any>({})
const openDetail = (row: any) => {
  current.value = row
  detailVisible.value = true
}

// 添加/编辑
const editVisible = ref(false)
const formRef = ref<FormInstance>()
const editForm = reactive({
  id: 0,
  title: '',
  address: '',
  start_time: '',
  limit: 100,
  cover: '',
  status: 1,
  content: '',
})
const rules: FormRules = {
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  address: [{ required: true, message: '请输入活动地点', trigger: 'blur' }],
  start_time: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  limit: [{ required: true, message: '请设置报名上限', trigger: 'change' }],
  content: [{ required: true, message: '请输入活动详情', trigger: 'blur' }],
}

const openAdd = () => {
  editForm.id = 0
  editForm.title = ''
  editForm.address = ''
  editForm.start_time = ''
  editForm.limit = 100
  editForm.cover = ''
  editForm.status = 1
  editForm.content = ''
  editVisible.value = true
}

const openEdit = (row: any) => {
  editForm.id = row.id
  editForm.title = row.title
  editForm.address = row.address
  editForm.start_time = row.start_time
  editForm.limit = row.limit
  editForm.cover = row.cover
  editForm.status = row.status
  editForm.content = row.content || ''
  editVisible.value = true
}

const formatNow = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:00`
}

const saveEdit = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    if (editForm.id) {
      const row = pager.lists.find((item: any) => item.id === editForm.id)
      if (row) Object.assign(row, { ...editForm, cover: editForm.cover || row.cover })
      ElMessage.success('保存成功')
    } else {
      pager.lists.unshift({
        id: Date.now(),
        views: 0,
        signup: 0,
        limit: editForm.limit,
        title: editForm.title,
        address: editForm.address,
        start_time: editForm.start_time,
        cover: editForm.cover || `https://picsum.photos/seed/ghj-activity-${Date.now() % 1000}/400/300`,
        status: editForm.status,
        content: editForm.content,
        create_time: formatNow(),
      })
      pager.total += 1
      ElMessage.success('添加成功')
    }
    editVisible.value = false
  })
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

<style lang="scss" scoped>
.detail-wrap {
  .detail-content-title {
    font-size: 13px;
    font-weight: bold;
    margin: 16px 0 8px;
    padding-left: 8px;
    border-left: 3px solid var(--el-color-primary);
  }
  .detail-content {
    font-size: 14px;
    line-height: 1.8;
    color: var(--el-text-color-regular);
    background: var(--el-fill-color-light);
    border-radius: 8px;
    padding: 12px 16px;
    word-break: break-all;
    max-height: 420px;
    overflow-y: auto;
    &.rich-content {
      :deep(h4) {
        font-size: 15px;
        font-weight: bold;
        margin: 12px 0 6px;
        color: var(--el-text-color-primary);
      }
      :deep(p) {
        margin: 6px 0;
      }
      :deep(ul) {
        padding-left: 20px;
        margin: 6px 0;
        li {
          margin: 4px 0;
        }
      }
      :deep(blockquote) {
        margin: 10px 0;
        padding: 8px 12px;
        border-left: 3px solid var(--el-color-primary);
        background: var(--el-color-primary-light-9);
        border-radius: 4px;
        color: var(--el-text-color-secondary);
      }
      :deep(img) {
        max-width: 100%;
        border-radius: 8px;
      }
    }
  }
}
</style>
