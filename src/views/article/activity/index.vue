<template>
    <div class="article-activity">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">社区活动</span>
                    <el-button type="primary" @click="openAdd">
                        <el-icon class="mr-1"><Plus /></el-icon>添加活动
                    </el-button>
                </div>
            </template>

            <!-- 筛选搜索 -->
            <el-form inline class="mb-2">
                <el-form-item label="活动标题">
                    <el-input v-model="queryParams.keyword" placeholder="请输入活动标题" clearable class="!w-60"
                        :prefix-icon="Search" @keyup.enter="onSearch" />
                </el-form-item>
                <el-form-item label="活动状态">
                    <el-select v-model="queryParams.activity_status" placeholder="全部状态" clearable class="!w-32">
                        <el-option label="报名中" :value="1" />
                        <el-option label="已结束" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发布时间">
                    <el-date-picker v-model="createRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-60" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetQuery">重置</el-button>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="pager.lists" stripe v-loading="pager.loading">
                <el-table-column label="封面图" width="100">
                    <template #default="{ row }">
                        <el-image :src="row.cover" :preview-src-list="[row.cover]" preview-teleported fit="cover"
                            class="w-14 h-10 rounded" />
                    </template>
                </el-table-column>
                <el-table-column label="标题" min-width="200" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span>{{ row.title }}</span>
                        <el-tag v-if="row.status === 0" size="small" type="info" class="!ml-1">已隐藏</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="活动状态" width="110">
                    <template #default="{ row }">
                        <el-tag size="small" :type="isEnded(row) ? 'info' : 'success'">{{ isEnded(row) ? '已结束' : '报名中' }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="activity_time" label="活动时间" min-width="180" show-overflow-tooltip />
                <el-table-column label="报名人数/总人数" width="140">
                    <template #default="{ row }">
                        <span class="font-medium">{{ row.signup }}</span>
                        <span class="text-tx-secondary"> / {{ row.limit }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" width="90" sortable />
                <el-table-column prop="create_time" label="发布时间" width="170" />
                <el-table-column label="操作" width="330" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openDetail(row)">详情</el-button>
                        <el-button link type="primary" @click="openSignup(row)">报名列表</el-button>
                        <el-button link type="warning" :disabled="isEnded(row)" @click="stopSignup(row)">停止报名</el-button>
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

        <!-- 活动详情 -->
        <el-dialog v-model="detailVisible" title="社区活动详情" width="720px" top="6vh">
            <el-descriptions :column="2" border>
                <el-descriptions-item label="活动标题" :span="2">{{ detail.title }}</el-descriptions-item>
                <el-descriptions-item label="活动状态">
                    <el-tag size="small" :type="isEnded(detail) ? 'info' : 'success'">{{ isEnded(detail) ? '已结束' : '报名中' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="活动时间">{{ detail.activity_time }}</el-descriptions-item>
                <el-descriptions-item label="报名时间">{{ detail.signup_start }} 至 {{ detail.signup_end }}</el-descriptions-item>
                <el-descriptions-item label="报名人数">{{ detail.signup }} / {{ detail.limit }} 人</el-descriptions-item>
                <el-descriptions-item label="活动地点">{{ detail.address }}</el-descriptions-item>
                <el-descriptions-item label="排序">{{ detail.sort }}</el-descriptions-item>
                <el-descriptions-item label="显示状态">
                    <el-tag size="small" :type="detail.status === 1 ? 'success' : 'info'">{{ detail.status === 1 ? '显示' : '隐藏' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="发布时间">{{ detail.create_time }}</el-descriptions-item>
                <el-descriptions-item label="封面图" :span="2">
                    <el-image :src="detail.cover" :preview-src-list="[detail.cover]" preview-teleported fit="cover"
                        class="w-40 h-24 rounded" />
                </el-descriptions-item>
            </el-descriptions>
            <div class="detail-content-title">详情介绍</div>
            <div class="detail-content rich-content" v-html="detail.content || '（暂无详情）'"></div>
            <template #footer>
                <el-button @click="detailVisible = false">关闭</el-button>
            </template>
        </el-dialog>

        <!-- 添加/编辑弹窗 -->
        <el-dialog v-model="editVisible" :title="editForm.id ? '编辑活动' : '添加活动'" width="760px" top="5vh" destroy-on-close>
            <el-form :model="editForm" label-width="110px">
                <el-form-item label="活动标题" required>
                    <el-input v-model="editForm.title" placeholder="请输入活动标题" maxlength="60" show-word-limit />
                </el-form-item>
                <el-form-item label="活动封面图" required>
                    <div class="w-full">
                        <el-input v-model="editForm.cover" placeholder="请输入封面图地址（留空自动生成）" clearable />
                        <el-image v-if="editForm.cover" :src="editForm.cover" fit="cover" class="w-40 h-24 rounded mt-2" />
                    </div>
                </el-form-item>
                <el-form-item label="活动时间" required>
                    <el-input v-model="editForm.activity_time" placeholder="如：9月15日（中秋节）18:30-21:00" />
                    <div class="text-xs text-tx-secondary mt-1">文字描述，将原样展示给用户</div>
                </el-form-item>
                <el-form-item label="报名时间" required>
                    <el-date-picker v-model="signupRange" type="daterange" range-separator="至" start-placeholder="报名开始"
                        end-placeholder="报名结束" value-format="YYYY-MM-DD" class="!w-full" />
                    <div class="text-xs text-tx-secondary mt-1">超过报名结束时间后活动自动变为「已结束」</div>
                </el-form-item>
                <el-form-item label="活动地点">
                    <el-input v-model="editForm.address" placeholder="请输入活动地点" maxlength="50" />
                </el-form-item>
                <el-form-item label="报名总人数" required>
                    <el-input-number v-model="editForm.limit" :min="1" :max="9999" />
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
                <el-form-item label="详情介绍" required>
                    <Editor v-model="editForm.content" height="300px" class="!w-full" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">保存</el-button>
            </template>
        </el-dialog>

        <!-- 报名列表 -->
        <el-dialog v-model="signupVisible" :title="`报名列表 - ${signupActivity.title || ''}`" width="820px" top="6vh">
            <el-table :data="signupLists" stripe max-height="440" v-loading="signupLoading">
                <el-table-column label="报名用户" min-width="160">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="28" :src="row.avatar" class="!mr-2" />
                            <span>{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号码" width="140" />
                <el-table-column prop="signup_count" label="报名人数" width="100" align="center" />
                <el-table-column prop="signup_time" label="报名时间" width="170" />
                <el-table-column prop="remark" label="备注" min-width="140" show-overflow-tooltip />
            </el-table>
            <template #footer>
                <el-button @click="signupVisible = false">关闭</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="articleActivity">
import { getActivityList, getActivitySignupList, activityEnded } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search, Plus } from '@element-plus/icons-vue'
import Editor from '@/components/editor/index.vue'

const queryParams = reactive({ keyword: '', activity_status: '', start_time: '', end_time: '' })
const { pager, getLists } = usePaging({ fetchFun: getActivityList, params: queryParams, firstLoading: true })

const createRange = ref<string[]>([])
const onSearch = () => {
    queryParams.start_time = createRange.value?.[0] || ''
    queryParams.end_time = createRange.value?.[1] || ''
    pager.page = 1
    getLists()
}
const resetQuery = () => {
    queryParams.keyword = ''
    queryParams.activity_status = ''
    createRange.value = []
    onSearch()
}

const isEnded = (row: any) => activityEnded(row)

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
const signupRange = ref<string[]>([])
const editForm = reactive({
    id: 0, title: '', cover: '', activity_time: '', address: '',
    signup_start: '', signup_end: '', limit: 100, sort: 0, status: 1, content: ''
})
const openAdd = () => {
    Object.assign(editForm, {
        id: 0, title: '', cover: '', activity_time: '', address: '',
        signup_start: '', signup_end: '', limit: 100, sort: (pager.lists.length || 0) + 1, status: 1, content: ''
    })
    signupRange.value = []
    editVisible.value = true
}
const openEdit = (row: any) => {
    Object.assign(editForm, {
        id: row.id, title: row.title, cover: row.cover, activity_time: row.activity_time, address: row.address,
        signup_start: row.signup_start, signup_end: row.signup_end, limit: row.limit,
        sort: row.sort ?? 0, status: row.status, content: row.content || ''
    })
    signupRange.value = [row.signup_start, row.signup_end].filter(Boolean)
    editVisible.value = true
}
const submitEdit = () => {
    if (!editForm.title.trim()) return ElMessage.warning('请输入活动标题')
    if (!editForm.activity_time.trim()) return ElMessage.warning('请输入活动时间')
    if (!signupRange.value?.length) return ElMessage.warning('请选择报名时间范围')
    if (!editForm.limit) return ElMessage.warning('请设置报名总人数')
    if (!editForm.content.trim()) return ElMessage.warning('请输入详情介绍')
    const cover = editForm.cover.trim() || `https://picsum.photos/seed/ghj-activity-${Date.now() % 1000}/400/300`
    const payload = {
        ...editForm,
        cover,
        signup_start: signupRange.value[0] || '',
        signup_end: signupRange.value[1] || '',
    }
    if (editForm.id) {
        const row = pager.lists.find((i: any) => i.id === editForm.id)
        if (row) Object.assign(row, payload)
        ElMessage.success('保存成功')
    } else {
        pager.lists.unshift({
            id: Date.now(),
            ...payload,
            signup: 0,
            signup_status: 1,
            create_time: nowTimeStr(),
        })
        pager.count += 1
        ElMessage.success('添加成功')
    }
    editVisible.value = false
}

// ---- 停止报名 ----
const stopSignup = (row: any) => {
    ElMessageBox.confirm(`确定停止「${row.title}」的报名吗？停止后用户无法再进行报名。`, '停止报名', { type: 'warning' })
        .then(() => {
            row.signup_status = 0
            ElMessage.success('已停止报名，活动状态更新为已结束')
        })
        .catch(() => { })
}

// ---- 显示 / 隐藏 ----
const toggleShow = (row: any) => {
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(row.status === 1 ? '已设置为显示' : '已隐藏，前端不再显示该活动')
}

// ---- 删除 ----
const delRow = (row: any) => {
    ElMessageBox.confirm(`确定删除活动「${row.title}」吗？删除后前端不再显示。`, '删除确认', { type: 'warning' })
        .then(() => {
            const idx = pager.lists.findIndex((i: any) => i.id === row.id)
            if (idx > -1) pager.lists.splice(idx, 1)
            pager.count = Math.max(0, pager.count - 1)
            ElMessage.success('删除成功')
        })
        .catch(() => { })
}

// ---- 报名列表 ----
const signupVisible = ref(false)
const signupLoading = ref(false)
const signupActivity = ref<any>({})
const signupLists = ref<any[]>([])
const openSignup = async (row: any) => {
    signupActivity.value = row
    signupVisible.value = true
    signupLoading.value = true
    try {
        const res: any = await getActivitySignupList({ activity_id: row.id, page_size: 100 })
        signupLists.value = res?.lists || []
    } finally {
        signupLoading.value = false
    }
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
