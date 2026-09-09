<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">精彩时刻</span>
        <div class="flex items-center gap-3">
          <el-input v-model="keyword" placeholder="搜索标题/作者" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
          <el-button type="primary" @click="openAdd">
            <el-icon class="mr-1"><Plus /></el-icon>添加文章
          </el-button>
        </div>
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
  <el-dialog v-model="detailVisible" title="精彩时刻详情" width="640px">
    <div class="detail-wrap">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="标题" :span="2">{{ current.title }}</el-descriptions-item>
        <el-descriptions-item label="发布人">{{ current.author }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ current.status === 1 ? '已上架' : '已下架' }}</el-descriptions-item>
        <el-descriptions-item label="浏览量">{{ current.views }}</el-descriptions-item>
        <el-descriptions-item label="点赞数">{{ current.likes }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ current.create_time }}</el-descriptions-item>
        <el-descriptions-item label="封面" :span="2">
          <el-image v-if="current.cover" :src="current.cover" :preview-src-list="[current.cover]" preview-teleported fit="cover" class="w-32 h-24 rounded" />
          <span v-else class="text-gray-400">暂无封面</span>
        </el-descriptions-item>
      </el-descriptions>
      <div class="detail-content-title">文章内容</div>
      <div class="detail-content rich-content">
        <div v-if="current.content" v-html="current.content"></div>
        <span v-else class="text-gray-400">（暂无正文）</span>
      </div>
    </div>
  </el-dialog>

  <!-- 添加/编辑弹窗 -->
  <el-dialog v-model="editVisible" :title="editForm.id ? '编辑文章' : '添加文章'" width="680px" destroy-on-close>
    <el-form ref="formRef" :model="editForm" :rules="rules" label-width="80px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="editForm.title" placeholder="请输入文章标题" maxlength="50" show-word-limit />
      </el-form-item>
      <el-form-item label="发布人" prop="author">
        <el-input v-model="editForm.author" placeholder="请输入发布人姓名" maxlength="20" />
      </el-form-item>
      <el-form-item label="封面图片" prop="cover">
        <div class="w-full">
          <el-input v-model="editForm.cover" placeholder="请输入封面图片地址（留空使用默认封面）" clearable />
          <el-image v-if="editForm.cover" :src="editForm.cover" fit="cover" class="w-32 h-20 rounded mt-2 cover-preview">
            <template #error>
              <div class="cover-error">图片加载失败</div>
            </template>
          </el-image>
        </div>
      </el-form-item>
      <el-form-item label="是否上架" prop="status">
        <el-radio-group v-model="editForm.status">
          <el-radio :value="1">上架</el-radio>
          <el-radio :value="0">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <div class="w-full">
          <editor v-model="editForm.content" :height="320" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="editVisible = false">取消</el-button>
      <el-button type="primary" :loading="saving" @click="saveForm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="articleWonderful">
import { getWonderfulList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search, Plus } from '@element-plus/icons-vue'
import Editor from '@/components/editor/index.vue'

const { pager, getLists } = usePaging({ fetchFun: getWonderfulList, firstLoading: true })
const keyword = ref('')

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.title?.includes(kw) || item.author?.includes(kw))
})

// ==================== 详情 ====================
const detailVisible = ref(false)
const current = ref<any>({})
const openDetail = (row: any) => {
  current.value = row
  detailVisible.value = true
}

// ==================== 状态切换 ====================
const toggleStatus = (row: any) => {
  ElMessage.success(`已${row.status === 1 ? '上架' : '下架'}：${row.title}`)
}

// ==================== 添加/编辑 ====================
const editVisible = ref(false)
const saving = ref(false)
const formRef = ref<any>()
const defaultCover = 'https://picsum.photos/seed/ghj-wonderful-default/600/340'
const emptyForm = () => ({
  id: 0,
  title: '',
  author: '',
  cover: '',
  status: 1,
  content: ''
})
const editForm = reactive(emptyForm())

const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  author: [{ required: true, message: '请输入发布人姓名', trigger: 'blur' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
}

const openAdd = () => {
  Object.assign(editForm, emptyForm())
  editVisible.value = true
}

const openEdit = (row: any) => {
  Object.assign(editForm, {
    id: row.id,
    title: row.title,
    author: row.author,
    cover: row.cover,
    status: row.status,
    content: row.content || ''
  })
  editVisible.value = true
}

const formatTime = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

const saveForm = () => {
  formRef.value?.validate((valid: boolean) => {
    if (!valid) return
    saving.value = true
    setTimeout(() => {
      const cover = editForm.cover || defaultCover
      if (editForm.id) {
        const row = pager.lists.find((item: any) => item.id === editForm.id)
        if (row) Object.assign(row, { ...editForm, cover })
        ElMessage.success('保存成功')
      } else {
        pager.lists.unshift({
          id: Date.now(),
          views: 0,
          likes: 0,
          create_time: formatTime(),
          ...editForm,
          cover
        })
        pager.total += 1
        ElMessage.success('添加成功')
      }
      saving.value = false
      editVisible.value = false
    }, 300)
  })
}

// ==================== 删除 ====================
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
  }
  .rich-content {
    :deep(img) {
      max-width: 100%;
      border-radius: 8px;
    }
    :deep(h4) {
      margin: 10px 0 6px;
      font-size: 15px;
      font-weight: bold;
      color: var(--el-text-color-primary);
    }
    :deep(p) {
      margin: 6px 0;
    }
    :deep(ul) {
      margin: 6px 0;
      padding-left: 20px;
      list-style: disc;
    }
    :deep(li) {
      margin: 4px 0;
    }
    :deep(blockquote) {
      margin: 8px 0;
      padding: 8px 12px;
      border-left: 3px solid var(--el-color-primary-light-5);
      background: var(--el-color-primary-light-9);
      border-radius: 4px;
      color: var(--el-text-color-secondary);
    }
  }
}
.cover-preview {
  display: block;
}
.cover-error {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 12px;
  color: var(--el-text-color-secondary);
  background: var(--el-fill-color-light);
}
</style>
