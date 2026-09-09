<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">轮播图管理</span>
        <div class="flex items-center gap-3">
          <el-input v-model="keyword" placeholder="搜索名称/链接" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
          <el-button type="primary" :icon="Plus" @click="openAdd">新增轮播图</el-button>
        </div>
      </div>
    </template>
    <el-table :data="filteredList" stripe>
      <el-table-column label="图片" width="130">
        <template #default="{ row }">
          <el-image :src="row.image" :preview-src-list="[row.image]" preview-teleported fit="cover" class="w-24 h-10 rounded" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" min-width="160" show-overflow-tooltip />
      <el-table-column label="跳转类型" width="130">
        <template #default="{ row }">
          <el-tag :type="linkTypeTag(row.link).type" size="small">{{ linkTypeTag(row.link).label }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="link" label="跳转目标" min-width="200" show-overflow-tooltip />
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

  <!-- 新增/编辑共用弹窗 -->
  <el-dialog v-model="editVisible" :title="editForm.id ? '编辑轮播图' : '新增轮播图'" width="560px">
    <el-form :model="editForm" label-width="100px">
      <el-form-item label="名称" required>
        <el-input v-model="editForm.name" placeholder="如：首页-国庆活动推广" />
      </el-form-item>
      <el-form-item label="图片地址" required>
        <el-input v-model="editForm.image" placeholder="请输入图片 URL" />
        <el-image v-if="editForm.image" :src="editForm.image" fit="cover" class="w-full h-28 rounded mt-2" />
      </el-form-item>
      <el-form-item label="跳转类型" required>
        <el-select v-model="editForm.link_type" class="!w-full" @change="onTypeChange">
          <el-option v-for="t in linkTypes" :key="t.value" :label="t.label" :value="t.value" />
        </el-select>
        <div class="text-xs text-tx-secondary mt-1">选择用户点击 banner 后打开的页面类型</div>
      </el-form-item>
      <el-form-item v-if="editForm.link_type === 'activity'" label="关联活动" required>
        <el-select v-model="editForm.link_id" placeholder="请选择要推广的活动" class="!w-full">
          <el-option v-for="a in activityOptions" :key="a.id" :label="`#${a.id} ${a.title}`" :value="a.id" />
        </el-select>
        <div class="text-xs text-tx-secondary mt-1">保存后自动生成链接：/pages/activity/detail?id=活动ID</div>
      </el-form-item>
      <el-form-item v-if="editForm.link_type === 'page'" label="选择页面" required>
        <el-select v-model="editForm.link_id" placeholder="请选择 APP 内置页面" class="!w-full">
          <el-option v-for="p in builtinPages" :key="p.value" :label="p.label" :value="p.value" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="editForm.link_type === 'custom'" label="自定义路径" required>
        <el-input v-model="editForm.link" placeholder="如：/pages/xxx/index 或 https://..." />
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
import { getBannerList, getActivityList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search, Plus } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getBannerList, firstLoading: true })
const keyword = ref('')

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  if (!kw) return pager.lists
  return pager.lists.filter((item: any) => item.name?.includes(kw) || item.link?.includes(kw))
})

// ============ 跳转类型 ============
const linkTypes = [
  { value: 'activity', label: '社区活动详情' },
  { value: 'page', label: '内置页面（膳食/陪诊/家政等）' },
  { value: 'custom', label: '自定义链接' },
  { value: 'none', label: '不跳转' },
]

const builtinPages = [
  { value: '/pages/meal/index', label: '膳食服务' },
  { value: '/pages/escort/index', label: '陪诊服务' },
  { value: '/pages/housekeeping/index', label: '家政服务' },
  { value: '/pages/helper/index', label: '生活帮手' },
  { value: '/pages/article/list', label: '精彩内容列表' },
  { value: 'tabbar-home', label: '首页（tabbar）' },
]

// 活动下拉数据（取 activityList 全量）
const activityOptions = ref<any[]>([])
getActivityList().then((res: any) => {
  activityOptions.value = res?.lists || res || []
})

// 按 link 推断跳转类型（用于表格标签展示与编辑回填）
const inferType = (link: string) => {
  if (!link) return 'none'
  if (link.startsWith('/pages/activity/detail')) return 'activity'
  if (link.startsWith('http') || link.startsWith('/pages/')) return 'custom'
  return 'custom'
}

const linkTypeTag = (link: string): { label: string; type: any } => {
  const t = inferType(link)
  if (t === 'activity') return { label: '活动详情', type: 'warning' }
  if (link === '/pages/meal/index') return { label: '膳食服务', type: 'success' }
  if (link === '/pages/escort/index') return { label: '陪诊服务', type: 'success' }
  if (builtinPages.some((p) => p.value === link)) return { label: '内置页面', type: 'success' }
  if (t === 'custom') return { label: '自定义链接', type: 'info' }
  return { label: '不跳转', type: 'info' }
}

// ============ 新增/编辑 ============
const editVisible = ref(false)
const editForm = reactive({ id: 0, name: '', image: '', link: '', link_type: 'activity', link_id: '', sort: 0 })

const resetForm = () => {
  editForm.id = 0
  editForm.name = ''
  editForm.image = ''
  editForm.link = ''
  editForm.link_type = 'activity'
  editForm.link_id = ''
  editForm.sort = (pager.lists.length || 0) + 1
}

const openAdd = () => {
  resetForm()
  editVisible.value = true
}

const openEdit = (row: any) => {
  editForm.id = row.id
  editForm.name = row.name
  editForm.image = row.image
  editForm.link = row.link
  editForm.sort = row.sort
  // 按 link 回填类型与关联对象
  editForm.link_id = ''
  if (row.link?.startsWith('/pages/activity/detail')) {
    editForm.link_type = 'activity'
    const m = row.link.match(/[?&]id=(\d+)/)
    editForm.link_id = m ? Number(m[1]) : ''
  } else if (builtinPages.some((p) => p.value === row.link)) {
    editForm.link_type = 'page'
    editForm.link_id = row.link
  } else if (!row.link) {
    editForm.link_type = 'none'
  } else {
    editForm.link_type = 'custom'
  }
  editVisible.value = true
}

const onTypeChange = () => {
  editForm.link = ''
  editForm.link_id = ''
}

// 由类型 + 关联对象生成最终 link
const buildLink = () => {
  if (editForm.link_type === 'none') return ''
  if (editForm.link_type === 'activity') return editForm.link_id ? `/pages/activity/detail?id=${editForm.link_id}` : ''
  if (editForm.link_type === 'page') return editForm.link_id || ''
  return editForm.link.trim()
}

const saveEdit = () => {
  if (!editForm.name.trim()) return ElMessage.warning('请输入名称')
  if (!editForm.image.trim()) return ElMessage.warning('请输入图片地址')
  const link = buildLink()
  if (editForm.link_type !== 'none' && !link) {
    return ElMessage.warning(editForm.link_type === 'custom' ? '请输入自定义链接' : '请选择跳转目标')
  }
  if (editForm.id) {
    const row = pager.lists.find((item: any) => item.id === editForm.id)
    if (row) {
      row.name = editForm.name
      row.image = editForm.image
      row.link = link
      row.sort = editForm.sort
    }
    ElMessage.success('保存成功')
  } else {
    const maxId = pager.lists.reduce((max: number, item: any) => Math.max(max, item.id || 0), 0)
    pager.lists.unshift({
      id: maxId + 1,
      name: editForm.name,
      image: editForm.image,
      link,
      sort: editForm.sort,
      status: 1,
      create_time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    })
    ElMessage.success('新增成功')
  }
  editVisible.value = false
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
