<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">通知公告</span>
        <div class="flex items-center gap-3">
          <el-input v-model="keyword" placeholder="搜索标题" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
          <el-button type="primary" @click="openAdd">添加公告</el-button>
        </div>
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column label="标题" min-width="220">
        <template #default="{ row }">
          <el-link type="primary" :underline="false" @click="openDetail(row)">{{ row.title }}</el-link>
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
  <el-dialog v-model="detailVisible" :title="current?.title || '公告详情'" width="640px">
    <div class="detail-wrap" v-if="current">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="类型">
          <el-tag :type="typeTag(current.type)" size="small">{{ current.type }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="置顶">
          <el-tag v-if="current.is_top === 1" type="danger" size="small">置顶</el-tag>
          <span v-else>否</span>
        </el-descriptions-item>
        <el-descriptions-item label="浏览量">{{ current.views }}</el-descriptions-item>
        <el-descriptions-item label="发布时间">{{ current.create_time }}</el-descriptions-item>
      </el-descriptions>
      <div class="detail-content-title">公告内容</div>
      <div class="detail-content rich-content" v-html="current.content || '（暂无正文）'"></div>
    </div>
    <template #footer>
      <el-button @click="detailVisible = false">关闭</el-button>
      <el-button type="primary" @click="detailVisible = false; openEdit(current)">编辑</el-button>
    </template>
  </el-dialog>

  <!-- 添加/编辑弹窗 -->
  <el-dialog v-model="editVisible" :title="editForm.id ? '编辑公告' : '添加公告'" width="680px" destroy-on-close>
    <el-form ref="formRef" :model="editForm" :rules="rules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="editForm.title" placeholder="请输入标题" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="editForm.type">
          <el-radio value="物业通知">物业通知</el-radio>
          <el-radio value="活动通知">活动通知</el-radio>
          <el-radio value="安全提示">安全提示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="置顶">
        <el-switch v-model="editForm.is_top" :active-value="1" :inactive-value="0" />
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <editor v-model="editForm.content" :height="320" />
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
import type { FormInstance, FormRules } from 'element-plus'
import Editor from '@/components/editor/index.vue'

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

// 详情
const detailVisible = ref(false)
const current = ref<any>(null)
const openDetail = (row: any) => {
  current.value = row
  detailVisible.value = true
}

// 添加/编辑
const formRef = ref<FormInstance>()
const editVisible = ref(false)
const editForm = reactive({ id: 0, title: '', type: '物业通知', is_top: 0, content: '' })
const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
}
const openAdd = () => {
  editForm.id = 0
  editForm.title = ''
  editForm.type = '物业通知'
  editForm.is_top = 0
  editForm.content = ''
  editVisible.value = true
}
const openEdit = (row: any) => {
  editForm.id = row.id
  editForm.title = row.title
  editForm.type = row.type
  editForm.is_top = row.is_top
  editForm.content = row.content || ''
  editVisible.value = true
}
const saveEdit = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    if (editForm.id) {
      const row = pager.lists.find((item: any) => item.id === editForm.id)
      if (row) {
        row.title = editForm.title
        row.type = editForm.type
        row.is_top = editForm.is_top
        row.content = editForm.content
      }
    } else {
      pager.lists.unshift({
        id: Date.now(),
        title: editForm.title,
        type: editForm.type,
        is_top: editForm.is_top,
        views: 0,
        status: 1,
        create_time: formatNow(),
        content: editForm.content,
      })
      pager.total += 1
    }
    editVisible.value = false
    ElMessage.success(editForm.id ? '保存成功' : '添加成功')
  })
}
const formatNow = () => {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`
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

<style scoped lang="scss">
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
    color: var(--el-text-color-regular);
    background: var(--el-fill-color-light);
    border-radius: 8px;
    padding: 12px 16px;
    word-break: break-all;
    line-height: 1.8;
    &.rich-content {
      :deep(h4) {
        font-size: 15px;
        font-weight: bold;
        margin: 12px 0 8px;
        color: var(--el-text-color-primary);
      }
      :deep(h4:first-child) {
        margin-top: 0;
      }
      :deep(p) {
        margin: 8px 0;
      }
      :deep(ul) {
        padding-left: 20px;
        margin: 8px 0;
        li {
          margin: 4px 0;
        }
      }
      :deep(blockquote) {
        margin: 12px 0 0;
        padding: 8px 12px;
        border-left: 3px solid var(--el-color-primary);
        background: var(--el-color-primary-light-9);
        border-radius: 0 6px 6px 0;
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
