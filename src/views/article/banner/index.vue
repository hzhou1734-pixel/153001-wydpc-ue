<template>
    <div class="article-banner">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">Banner图设置</span>
                    <el-button type="primary" @click="openAdd">
                        <el-icon class="mr-1"><Plus /></el-icon>添加Banner图
                    </el-button>
                </div>
            </template>

            <!-- 筛选搜索 -->
            <el-form inline class="mb-2">
                <el-form-item label="Banner标题">
                    <el-input v-model="queryParams.keyword" placeholder="请输入Banner图标题" clearable class="!w-60"
                        :prefix-icon="Search" @keyup.enter="onSearch" />
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="queryParams.status" placeholder="全部状态" clearable class="!w-32">
                        <el-option label="显示" :value="1" />
                        <el-option label="隐藏" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="添加时间">
                    <el-date-picker v-model="createRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-60" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetQuery">重置</el-button>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="pager.lists" stripe v-loading="pager.loading">
                <el-table-column prop="name" label="Banner图标题" min-width="220" show-overflow-tooltip />
                <el-table-column label="封面图" min-width="220">
                    <template #default="{ row }">
                        <el-image :src="row.image" :preview-src-list="[row.image]" preview-teleported fit="cover"
                            class="w-40 h-14 rounded" />
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="90" sortable />
                <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                        <el-tag size="small" :type="row.status === 1 ? 'success' : 'info'">{{ row.status === 1 ? '显示' : '隐藏' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间" width="170" />
                <el-table-column label="操作" width="220" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                        <el-button link type="info" @click="toggleShow(row)">
                            {{ row.status === 1 ? '隐藏' : '显示' }}
                        </el-button>
                        <el-button link type="danger" @click="delRow(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 添加/编辑弹窗 -->
        <el-dialog v-model="editVisible" :title="editForm.id ? '编辑Banner图' : '添加Banner图'" width="600px" destroy-on-close>
            <el-form :model="editForm" label-width="110px">
                <el-form-item label="Banner标题" required>
                    <el-input v-model="editForm.name" placeholder="如：首页-中秋活动推广" maxlength="40" show-word-limit />
                </el-form-item>
                <el-form-item label="Banner图" required>
                    <div class="w-full">
                        <el-input v-model="editForm.image" placeholder="请输入Banner图地址（留空自动生成）" clearable />
                        <el-image v-if="editForm.image" :src="editForm.image" fit="cover" class="w-full h-28 rounded mt-2" />
                    </div>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="editForm.sort" :min="0" :max="999" />
                    <span class="ml-2 text-xs text-tx-secondary">数值越小越靠前</span>
                </el-form-item>
                <el-form-item label="状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :value="1">显示</el-radio>
                        <el-radio :value="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳转设置">
                    <el-select v-model="editForm.link_type" class="!w-full" @change="onTypeChange">
                        <el-option v-for="t in linkTypes" :key="t.value" :label="t.label" :value="t.value" />
                    </el-select>
                    <div class="text-xs text-tx-secondary mt-1">选填，设置用户点击 Banner 后打开的页面</div>
                </el-form-item>
                <el-form-item v-if="editForm.link_type === 'activity'" label="关联活动">
                    <el-select v-model="editForm.link_id" placeholder="请选择要推广的活动" class="!w-full">
                        <el-option v-for="a in activityOptions" :key="a.id" :label="`#${a.id} ${a.title}`" :value="a.id" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="editForm.link_type === 'page'" label="选择页面">
                    <el-select v-model="editForm.link_id" placeholder="请选择 APP 内置页面" class="!w-full">
                        <el-option v-for="p in builtinPages" :key="p.value" :label="p.label" :value="p.value" />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="editForm.link_type === 'custom'" label="自定义路径">
                    <el-input v-model="editForm.link" placeholder="如：/pages/xxx/index 或 https://..." />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="articleBanner">
import { getBannerList, getActivityList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search, Plus } from '@element-plus/icons-vue'

const queryParams = reactive({ keyword: '', status: '', start_time: '', end_time: '' })
const { pager, getLists } = usePaging({ fetchFun: getBannerList, params: queryParams, firstLoading: true })

const createRange = ref<string[]>([])
const onSearch = () => {
    queryParams.start_time = createRange.value?.[0] || ''
    queryParams.end_time = createRange.value?.[1] || ''
    pager.page = 1
    getLists()
}
const resetQuery = () => {
    queryParams.keyword = ''
    queryParams.status = ''
    createRange.value = []
    onSearch()
}

const nowTimeStr = () => {
    const d = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// ============ 跳转类型 ============
const linkTypes = [
    { value: 'none', label: '不跳转' },
    { value: 'activity', label: '社区活动详情' },
    { value: 'page', label: '内置页面（膳食/陪诊/家政等）' },
    { value: 'custom', label: '自定义链接' },
]
const builtinPages = [
    { value: '/pages/meal/index', label: '膳食服务' },
    { value: '/pages/escort/index', label: '陪诊服务' },
    { value: '/pages/housekeeping/index', label: '家政服务' },
    { value: '/pages/helper/index', label: '生活帮手' },
    { value: '/pages/article/list', label: '精彩内容列表' },
]
const activityOptions = ref<any[]>([])
getActivityList({ page_size: 100 }).then((res: any) => {
    activityOptions.value = res?.lists || []
})

const onTypeChange = () => {
    editForm.link = ''
    editForm.link_id = ''
}
const buildLink = () => {
    if (editForm.link_type === 'none') return ''
    if (editForm.link_type === 'activity') return editForm.link_id ? `/pages/activity/detail?id=${editForm.link_id}` : ''
    if (editForm.link_type === 'page') return editForm.link_id || ''
    return String(editForm.link || '').trim()
}

// ============ 添加 / 编辑 ============
const editVisible = ref(false)
const editForm = reactive({ id: 0, name: '', image: '', sort: 0, status: 1, link: '', link_type: 'none', link_id: '' as any })
const openAdd = () => {
    Object.assign(editForm, { id: 0, name: '', image: '', sort: (pager.lists.length || 0) + 1, status: 1, link: '', link_type: 'none', link_id: '' })
    editVisible.value = true
}
const openEdit = (row: any) => {
    Object.assign(editForm, {
        id: row.id, name: row.name, image: row.image, sort: row.sort, status: row.status,
        link: row.link || '', link_type: 'none', link_id: ''
    })
    if (row.link?.startsWith('/pages/activity/detail')) {
        editForm.link_type = 'activity'
        const m = row.link.match(/[?&]id=(\d+)/)
        editForm.link_id = m ? Number(m[1]) : ''
    } else if (builtinPages.some((p) => p.value === row.link)) {
        editForm.link_type = 'page'
        editForm.link_id = row.link
    } else if (row.link) {
        editForm.link_type = 'custom'
    }
    editVisible.value = true
}
const submitEdit = () => {
    if (!editForm.name.trim()) return ElMessage.warning('请输入Banner图标题')
    const image = editForm.image.trim() || `https://picsum.photos/seed/ghj-banner-${Date.now() % 1000}/750/300`
    const link = buildLink()
    if (editForm.id) {
        const row = pager.lists.find((i: any) => i.id === editForm.id)
        if (row) Object.assign(row, { name: editForm.name, image, sort: editForm.sort, status: editForm.status, link })
        ElMessage.success('保存成功')
    } else {
        pager.lists.unshift({ id: Date.now(), name: editForm.name, image, sort: editForm.sort, status: editForm.status, link, create_time: nowTimeStr() })
        pager.count += 1
        ElMessage.success('添加成功')
    }
    editVisible.value = false
}

// ============ 显示 / 隐藏 ============
const toggleShow = (row: any) => {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(row.status === 1 ? '已设置为显示' : '已隐藏，前端不再显示')
}

// ============ 删除 ============
const delRow = (row: any) => {
    ElMessageBox.confirm(`确定删除Banner图「${row.name}」吗？删除后前端不再显示。`, '删除确认', { type: 'warning' })
        .then(() => {
            const idx = pager.lists.findIndex((i: any) => i.id === row.id)
            if (idx > -1) pager.lists.splice(idx, 1)
            pager.count = Math.max(0, pager.count - 1)
            ElMessage.success('删除成功')
        })
        .catch(() => { })
}

onMounted(getLists)
</script>
