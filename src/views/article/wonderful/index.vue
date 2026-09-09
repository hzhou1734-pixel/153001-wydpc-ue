<template>
    <div class="article-wonderful">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">精彩内容</span>
                    <el-button type="primary" @click="openAdd">
                        <el-icon class="mr-1"><Plus /></el-icon>添加内容
                    </el-button>
                </div>
            </template>

            <!-- 筛选搜索 -->
            <el-form inline class="mb-2">
                <el-form-item label="关键词">
                    <el-input v-model="queryParams.keyword" placeholder="文章ID / 标题" clearable class="!w-60"
                        :prefix-icon="Search" @keyup.enter="onSearch" />
                </el-form-item>
                <el-form-item label="显示状态">
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
                <el-table-column prop="id" label="文章ID" width="80" show-overflow-tooltip />
                <el-table-column label="封面图" width="100">
                    <template #default="{ row }">
                        <el-image :src="row.cover" :preview-src-list="[row.cover]" preview-teleported fit="cover"
                            class="w-14 h-10 rounded" />
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="标题" min-width="240" show-overflow-tooltip />
                <el-table-column label="显示状态" width="90">
                    <template #default="{ row }">
                        <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" @change="toggleShow(row)" />
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="80" sortable  show-overflow-tooltip />
                <el-table-column prop="create_time" label="添加时间" width="160" show-overflow-tooltip />
                <el-table-column label="操作" width="190" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openDetail(row)">详情</el-button>
                        <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
                        <el-button link type="danger" @click="delRow(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 详情弹窗 -->
        <el-dialog v-model="detailVisible" title="内容详情" width="720px" top="6vh">
            <el-descriptions :column="2" border>
                <el-descriptions-item label="文章ID">{{ detail.id }}</el-descriptions-item>
                <el-descriptions-item label="标题">{{ detail.title }}</el-descriptions-item>
                <el-descriptions-item label="显示状态">
                    <el-tag size="small" :type="detail.status === 1 ? 'success' : 'info'">{{ detail.status === 1 ? '显示' : '隐藏' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="排序">{{ detail.sort }}</el-descriptions-item>
                <el-descriptions-item label="添加时间">{{ detail.create_time }}</el-descriptions-item>
                <el-descriptions-item label="浏览量">{{ detail.views }}</el-descriptions-item>
                <el-descriptions-item label="封面图" :span="2">
                    <el-image :src="detail.cover" :preview-src-list="[detail.cover]" preview-teleported fit="cover"
                        class="w-40 h-24 rounded" />
                </el-descriptions-item>
            </el-descriptions>
            <div class="detail-content-title">详情内容</div>
            <div class="detail-content rich-content" v-html="detail.content || '（暂无正文）'"></div>
            <template #footer>
                <el-button @click="detailVisible = false">关闭</el-button>
            </template>
        </el-dialog>

        <!-- 添加/编辑弹窗 -->
        <el-dialog v-model="editVisible" :title="editForm.id ? '编辑内容' : '添加内容'" width="760px" top="5vh" destroy-on-close>
            <el-form :model="editForm" label-width="90px">
                <el-form-item label="文章标题" required>
                    <el-input v-model="editForm.title" placeholder="请输入文章标题" maxlength="60" show-word-limit />
                </el-form-item>
                <el-form-item label="封面图" required>
                    <div class="w-full">
                        <el-input v-model="editForm.cover" placeholder="请输入封面图地址（留空自动生成）" clearable />
                        <el-image v-if="editForm.cover" :src="editForm.cover" fit="cover" class="w-40 h-24 rounded mt-2" />
                    </div>
                </el-form-item>
                <el-form-item label="详情内容" required>
                    <Editor v-model="editForm.content" height="300px" class="!w-full" />
                </el-form-item>
                <el-form-item label="排序">
                    <el-input-number v-model="editForm.sort" :min="0" :max="9999" />
                    <span class="ml-2 text-xs text-tx-secondary">数值越小越靠前</span>
                </el-form-item>
                <el-form-item label="显示状态">
                    <el-radio-group v-model="editForm.status">
                        <el-radio :value="1">显示</el-radio>
                        <el-radio :value="0">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="articleWonderful">
import { getWonderfulList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search, Plus } from '@element-plus/icons-vue'
import Editor from '@/components/editor/index.vue'

const queryParams = reactive({ keyword: '', status: '', start_time: '', end_time: '' })
const { pager, getLists } = usePaging({ fetchFun: getWonderfulList, params: queryParams, firstLoading: true })

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

// ---- 详情 ----
const detailVisible = ref(false)
const detail = ref<any>({})
const openDetail = (row: any) => {
    detail.value = row
    detailVisible.value = true
}

// ---- 添加 / 编辑 ----
const editVisible = ref(false)
const editForm = reactive({ id: 0, title: '', cover: '', content: '', sort: 0, status: 1 })
const openAdd = () => {
    Object.assign(editForm, { id: 0, title: '', cover: '', content: '', sort: (pager.lists.length || 0) + 1, status: 1 })
    editVisible.value = true
}
const openEdit = (row: any) => {
    Object.assign(editForm, {
        id: row.id, title: row.title, cover: row.cover,
        content: row.content || '', sort: row.sort ?? 0, status: row.status
    })
    editVisible.value = true
}
const submitEdit = () => {
    if (!editForm.title.trim()) return ElMessage.warning('请输入文章标题')
    if (!editForm.content.trim()) return ElMessage.warning('请输入详情内容')
    const cover = editForm.cover.trim() || `https://picsum.photos/seed/ghj-wonderful-${Date.now() % 1000}/400/300`
    if (editForm.id) {
        const row = pager.lists.find((i: any) => i.id === editForm.id)
        if (row) Object.assign(row, { ...editForm, cover })
        ElMessage.success('保存成功')
    } else {
        pager.lists.unshift({
            id: Date.now(),
            ...editForm,
            cover,
            views: 0,
            likes: 0,
            create_time: nowTimeStr(),
        })
        pager.count += 1
        ElMessage.success('添加成功')
    }
    editVisible.value = false
}

// ---- 显示 / 隐藏 ----
const toggleShow = (row: any) => {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(row.status === 1 ? '已设置为显示' : '已隐藏，前端不再显示')
}

// ---- 删除 ----
const delRow = (row: any) => {
    ElMessageBox.confirm(`确定删除文章「${row.title}」吗？删除后前端不再显示。`, '删除确认', { type: 'warning' })
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

<style lang="scss" scoped>
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
    max-height: 380px;
    overflow-y: auto;

    :deep(img) {
        max-width: 100%;
        border-radius: 8px;
    }

    :deep(h4) {
        font-size: 15px;
        font-weight: bold;
        margin: 10px 0 6px;
        color: var(--el-text-color-primary);
    }

    :deep(p) {
        margin: 6px 0;
    }

    :deep(ul) {
        padding-left: 20px;
        list-style: disc;
    }

    :deep(blockquote) {
        margin: 8px 0;
        padding: 8px 12px;
        border-left: 3px solid var(--el-color-primary);
        background: var(--el-color-primary-light-9);
        border-radius: 4px;
        color: var(--el-text-color-secondary);
    }
}
</style>
