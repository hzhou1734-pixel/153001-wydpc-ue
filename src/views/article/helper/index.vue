<template>
  <el-card class="!border-none" shadow="never">
    <template #header>
      <div class="flex items-center justify-between">
        <span class="card-title">生活帮手</span>
        <el-input v-model="keyword" placeholder="搜索昵称/手机号/处理人" :prefix-icon="Search" clearable class="!w-60" @input="getLists" />
      </div>
    </template>

    <!-- 筛选区 -->
    <el-form inline class="mb-1">
      <el-form-item label="类型">
        <el-select v-model="query.type" placeholder="全部类型" clearable class="!w-32" @change="getLists">
          <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
        </el-select>
      </el-form-item>
      <el-form-item label="楼栋">
        <el-select v-model="query.building" placeholder="全部楼栋" clearable class="!w-32" @change="getLists">
          <el-option v-for="b in buildingOptions" :key="b" :label="b" :value="b" />
        </el-select>
      </el-form-item>
      <el-form-item label="处理状态">
        <el-select v-model="query.status" placeholder="全部状态" clearable class="!w-28" @change="getLists">
          <el-option label="待处理" :value="0" />
          <el-option label="已处理" :value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间">
        <el-date-picker v-model="createRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-60" @change="getLists" />
      </el-form-item>
      <el-form-item label="处理时间">
        <el-date-picker v-model="handleRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-60" @change="getLists" />
      </el-form-item>
      <el-form-item>
        <el-button @click="resetQuery">重置</el-button>
        <el-button type="primary" @click="getLists">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="filteredList" stripe>
      <el-table-column label="类型" width="100">
        <template #default="{ row }">
          <el-tag size="small">{{ row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="发布人" min-width="130">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :size="28" :src="row.avatar" class="!mr-2" />
            <span>{{ row.nickname }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" width="130" />
      <el-table-column prop="building" label="楼栋" min-width="120" show-overflow-tooltip />
      <el-table-column label="处理状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'warning'" size="small">{{ row.status === 1 ? '已处理' : '待处理' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="处理人" width="120">
        <template #default="{ row }">
          <span v-if="row.handler">{{ row.handler }}</span>
          <span v-else class="text-gray-400">—</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="提交时间" width="170" />
      <el-table-column label="处理时间" width="170">
        <template #default="{ row }">
          <span v-if="row.handle_time">{{ row.handle_time }}</span>
          <span v-else class="text-gray-400">—</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openDetail(row)">详情</el-button>
          <el-button link type="primary" :disabled="row.status === 1" @click="markHandled(row)">标记已处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end mt-4">
      <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.limit" :total="pager.total" layout="total, prev, pager, next" @current-change="getLists" />
    </div>
  </el-card>

  <!-- 详情弹窗 -->
  <el-dialog v-model="detailVisible" title="生活帮助表单详情" width="640px" top="6vh">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="求助类型">{{ current.type }}</el-descriptions-item>
      <el-descriptions-item label="处理状态">
        <el-tag :type="current.status === 1 ? 'success' : 'warning'" size="small">{{ current.status === 1 ? '已处理' : '待处理' }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="发布人">
        <div class="flex items-center">
          <el-avatar :size="24" :src="current.avatar" class="!mr-2" />
          <span>{{ current.nickname }}</span>
        </div>
      </el-descriptions-item>
      <el-descriptions-item label="手机号码">{{ current.phone }}</el-descriptions-item>
      <el-descriptions-item label="楼栋房号">{{ current.building }}</el-descriptions-item>
      <el-descriptions-item label="处理人">{{ current.handler || '—' }}</el-descriptions-item>
      <el-descriptions-item label="提交时间">{{ current.create_time }}</el-descriptions-item>
      <el-descriptions-item label="处理时间">{{ current.handle_time || '—' }}</el-descriptions-item>
    </el-descriptions>

    <div v-if="current.images && current.images.length" class="mt-4">
      <div class="detail-content-title">现场图片</div>
      <div class="flex flex-wrap gap-2 mt-2">
        <el-image v-for="(img, i) in current.images" :key="i" :src="img" :preview-src-list="current.images" :initial-index="i" preview-teleported fit="cover" class="w-28 h-20 rounded" />
      </div>
    </div>

    <div class="mt-4">
      <div class="detail-content-title">表单内容</div>
      <div class="detail-content rich-content" v-html="current.content || '（暂无内容）'"></div>
    </div>

    <template #footer>
      <el-button @click="detailVisible = false">关闭</el-button>
      <el-button type="primary" :disabled="current.status === 1" @click="markHandled(current)">标记已处理</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts" name="articleHelper">
import { getHelperList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getHelperList, firstLoading: true })

const typeOptions = ['家电维修', '管道疏通', '开锁换锁', '保洁清洗', '代买代办', '其他']
const buildingOptions = ['1栋', '2栋', '3栋', '4栋', '5栋', '6栋']

const keyword = ref('')
const query = reactive({ type: '', building: '', status: '' as number | '' })
const createRange = ref<string[]>([])
const handleRange = ref<string[]>([])

const filteredList = computed(() => {
  const kw = keyword.value.trim()
  return pager.lists.filter((item: any) => {
    if (kw && !(item.nickname?.includes(kw) || item.phone?.includes(kw) || (item.handler || '').includes(kw))) return false
    if (query.type && item.type !== query.type) return false
    if (query.building && !item.building?.startsWith(query.building)) return false
    if (query.status !== '' && query.status != null && item.status !== query.status) return false
    if (createRange.value?.length === 2) {
      const day = (item.create_time || '').slice(0, 10)
      if (!day || day < createRange.value[0] || day > createRange.value[1]) return false
    }
    if (handleRange.value?.length === 2) {
      const day = (item.handle_time || '').slice(0, 10)
      if (!day || day < handleRange.value[0] || day > handleRange.value[1]) return false
    }
    return true
  })
})

const resetQuery = () => {
  keyword.value = ''
  query.type = ''
  query.building = ''
  query.status = ''
  createRange.value = []
  handleRange.value = []
  getLists()
}

// 详情
const detailVisible = ref(false)
const current = ref<any>({})
const openDetail = (row: any) => {
  current.value = row
  detailVisible.value = true
}

// 标记已处理
const formatNow = () => {
  const d = new Date()
  const pad = (v: number) => String(v).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}
const markHandled = (row: any) => {
  ElMessageBox.prompt('请输入处理人姓名，确认后将该表单标记为已处理', '标记已处理', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputPlaceholder: '如：陈晓',
    inputValidator: (v: string) => (v && v.trim() ? true : '处理人不能为空'),
  })
    .then(({ value }) => {
      row.status = 1
      row.handler = value.trim()
      row.handle_time = formatNow()
      ElMessage.success(`已标记为已处理，处理人：${row.handler}`)
    })
    .catch(() => {})
}

onMounted(getLists)
</script>

<style lang="scss" scoped>
.detail-content-title {
  font-size: 13px;
  font-weight: bold;
  margin: 0 0 8px;
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
    }
  }
}
</style>
