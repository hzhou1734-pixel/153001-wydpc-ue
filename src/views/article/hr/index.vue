<template>
    <div class="article-hr">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">人力资源</span>
                    <el-button type="primary" @click="openAdd">
                        <el-icon class="mr-1"><Plus /></el-icon>添加资源
                    </el-button>
                </div>
            </template>

            <!-- 筛选搜索 -->
            <el-form inline class="mb-2">
                <el-form-item label="关键词">
                    <el-input v-model="queryParams.keyword" placeholder="资源标题 / 昵称 / 手机号码" clearable class="!w-60"
                        :prefix-icon="Search" @keyup.enter="onSearch" />
                </el-form-item>
                <el-form-item label="发布状态">
                    <el-select v-model="queryParams.status" placeholder="全部状态" clearable class="!w-32">
                        <el-option label="待审核" :value="0" />
                        <el-option label="已通过" :value="1" />
                        <el-option label="已驳回" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="发布时间">
                    <el-date-picker v-model="createRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-60" />
                </el-form-item>
                <el-form-item label="审核时间">
                    <el-date-picker v-model="auditRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-60" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetQuery">重置</el-button>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="pager.lists" stripe v-loading="pager.loading">
                <el-table-column label="资源标题" min-width="240" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span>{{ row.title }}</span>
                        <el-tag v-if="row.is_top === 1" size="small" type="danger" class="!ml-1">置顶</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="发布人" min-width="170">
                    <template #default="{ row }">
                        <div v-if="row.source === 1" class="flex items-center">
                            <el-avatar :size="28" :src="row.avatar" class="!mr-2" />
                            <div class="leading-tight">
                                <div class="text-xs text-tx-secondary">物业后台</div>
                                <div class="font-medium">{{ row.account }}</div>
                            </div>
                        </div>
                        <div v-else class="flex items-center">
                            <el-avatar :size="28" :src="row.avatar" class="!mr-2" />
                            <span>{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="手机号码" width="120">
                    <template #default="{ row }">{{ row.mobile || '—' }}</template>
                </el-table-column>
                <el-table-column label="发布状态" width="90">
                    <template #default="{ row }">
                        <el-tag size="small" :type="statusTag(row.status)">{{ statusText(row.status) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="发布时间" width="160" show-overflow-tooltip />
                <el-table-column label="审核时间" width="160">
                    <template #default="{ row }">{{ row.audit_time || '—' }}</template>
                </el-table-column>
                <el-table-column label="显示状态" width="90">
                    <template #default="{ row }">
                        <el-switch :model-value="row.is_show" :active-value="1" :inactive-value="0" :disabled="row.status !== 1" @change="toggleShow(row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="270" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openDetail(row)">详情</el-button>
                        <el-button link type="primary" :disabled="row.source !== 1" @click="openEdit(row)">编辑</el-button>
                        <el-button v-if="row.status === 0" link type="warning" @click="openAudit(row, 1)">审核</el-button>
                        <el-button v-else-if="row.status === 1" link type="danger" @click="openAudit(row, 2)">违规驳回</el-button>
                        <el-button v-else link type="warning" @click="reAudit(row)">重新审核</el-button>
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
        <el-dialog v-model="detailVisible" title="人力资源详情" width="680px" top="6vh">
            <el-descriptions :column="2" border>
                <el-descriptions-item label="资源标题" :span="2">{{ detail.title }}</el-descriptions-item>
                <el-descriptions-item label="发布来源">
                    <el-tag size="small" :type="detail.source === 1 ? 'success' : 'info'">
                        {{ detail.source === 1 ? '物业后台' : '用户发布' }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="发布人">
                    {{ detail.source === 1 ? detail.account : detail.nickname }}
                </el-descriptions-item>
                <el-descriptions-item label="手机号码">{{ detail.mobile || '—' }}</el-descriptions-item>
                <el-descriptions-item label="发布状态">
                    <el-tag size="small" :type="statusTag(detail.status)">{{ statusText(detail.status) }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="发布时间">{{ detail.create_time }}</el-descriptions-item>
                <el-descriptions-item label="审核时间">{{ detail.audit_time || '—' }}</el-descriptions-item>
                <el-descriptions-item label="是否置顶">
                    <el-tag size="small" :type="detail.is_top === 1 ? 'danger' : 'info'">{{ detail.is_top === 1 ? '置顶' : '否' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="显示状态">
                    <el-tag size="small" :type="detail.is_show === 1 ? 'success' : 'info'">{{ detail.is_show === 1 ? '显示' : '隐藏' }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item v-if="detail.status === 2" label="驳回原因" :span="2">
                    {{ detail.audit_reason || '—' }}
                </el-descriptions-item>
            </el-descriptions>
            <div class="detail-content-title">详情内容</div>
            <div class="detail-content rich-content" v-html="detail.content || '（暂无内容）'"></div>
            <template #footer>
                <el-button @click="detailVisible = false">关闭</el-button>
            </template>
        </el-dialog>

        <!-- 添加/编辑弹窗 -->
        <el-dialog v-model="editVisible" :title="editForm.id ? '编辑资源' : '添加资源'" width="760px" top="5vh" destroy-on-close>
            <el-form :model="editForm" label-width="100px">
                <el-form-item label="资源标题" required>
                    <el-input v-model="editForm.title" placeholder="请输入资源标题" maxlength="60" show-word-limit />
                </el-form-item>
                <el-form-item label="详情内容" required>
                    <Editor v-model="editForm.content" height="300px" class="!w-full" />
                </el-form-item>
                <el-form-item label="发布状态" required>
                    <el-radio-group v-model="editForm.status">
                        <el-radio :value="1">已通过</el-radio>
                        <el-radio :value="0">待审核</el-radio>
                        <el-radio :value="2">已驳回</el-radio>
                    </el-radio-group>
                    <div class="text-xs text-tx-secondary mt-1">
                        物业后台发布的内容无需审核，保存后即视为已通过、发布时间与审核时间一致，并在前端默认置顶
                    </div>
                </el-form-item>
                <el-form-item v-if="editForm.status === 2" label="驳回原因">
                    <el-input v-model="editForm.audit_reason" type="textarea" :rows="2" placeholder="请填写驳回原因" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">保存</el-button>
            </template>
        </el-dialog>

        <!-- 审核弹窗 -->
        <el-dialog v-model="auditVisible" :title="auditForm.action === 1 ? '发布审核' : '违规驳回'" width="520px">
            <div v-if="auditRow" class="mb-3">
                <div class="font-bold">{{ auditRow.title }}</div>
                <div class="text-xs text-tx-secondary mt-1">
                    {{ auditRow.nickname }} · {{ auditRow.mobile }} · {{ auditRow.create_time }}
                </div>
            </div>
            <template v-if="auditForm.action === 1">
                <el-alert title="审核通过后该资源将在前端正常显示，业主可浏览查看" type="success" :closable="false" show-icon />
            </template>
            <template v-else>
                <el-alert title="驳回后该资源将不在前端显示，请填写驳回原因" type="warning" :closable="false" show-icon class="mb-3" />
                <el-input v-model="auditForm.reason" type="textarea" :rows="3" maxlength="100" show-word-limit
                    placeholder="请填写驳回原因，如：内容含外部联系方式与广告信息" />
            </template>
            <template #footer>
                <el-button @click="auditVisible = false">取消</el-button>
                <el-button :type="auditForm.action === 1 ? 'success' : 'danger'" @click="submitAudit">
                    确认{{ auditForm.action === 1 ? '通过' : '驳回' }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="articleHr">
import { getHrList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search, Plus } from '@element-plus/icons-vue'
import Editor from '@/components/editor/index.vue'

const queryParams = reactive({ keyword: '', status: '', start_time: '', end_time: '', audit_start: '', audit_end: '' })
const { pager, getLists } = usePaging({ fetchFun: getHrList, params: queryParams, firstLoading: true })

const createRange = ref<string[]>([])
const auditRange = ref<string[]>([])

const onSearch = () => {
    queryParams.start_time = createRange.value?.[0] || ''
    queryParams.end_time = createRange.value?.[1] || ''
    queryParams.audit_start = auditRange.value?.[0] || ''
    queryParams.audit_end = auditRange.value?.[1] || ''
    pager.page = 1
    getLists()
}
const resetQuery = () => {
    queryParams.keyword = ''
    queryParams.status = ''
    createRange.value = []
    auditRange.value = []
    onSearch()
}

const statusText = (s: number) => (s === 1 ? '已通过' : s === 2 ? '已驳回' : '待审核')
const statusTag = (s: number) => (s === 1 ? 'success' : s === 2 ? 'danger' : 'warning')
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

// ---- 添加 / 编辑（仅物业后台发布的内容可编辑） ----
const editVisible = ref(false)
const editForm = reactive({ id: 0, title: '', content: '', status: 1, audit_reason: '' })
const openAdd = () => {
    Object.assign(editForm, { id: 0, title: '', content: '', status: 1, audit_reason: '' })
    editVisible.value = true
}
const openEdit = (row: any) => {
    if (row.source !== 1) return ElMessage.warning('用户发布的人力资源无法修改')
    Object.assign(editForm, { id: row.id, title: row.title, content: row.content || '', status: row.status, audit_reason: row.audit_reason || '' })
    editVisible.value = true
}
const submitEdit = () => {
    if (!editForm.title.trim()) return ElMessage.warning('请输入资源标题')
    if (!editForm.content.trim()) return ElMessage.warning('请输入详情内容')
    const time = nowTimeStr()
    if (editForm.id) {
        const row = pager.lists.find((i: any) => i.id === editForm.id)
        if (row) {
            Object.assign(row, {
                title: editForm.title,
                content: editForm.content,
                status: editForm.status,
                audit_reason: editForm.status === 2 ? editForm.audit_reason : '',
                audit_time: editForm.status === 0 ? '' : (row.audit_time || time),
            })
        }
        ElMessage.success('保存成功')
    } else {
        pager.lists.unshift({
            id: Date.now(),
            title: editForm.title,
            content: editForm.content,
            source: 1,
            account: 'admin',
            avatar: 'https://picsum.photos/seed/ghj-admin-logo/100/100',
            nickname: '物业管理员',
            mobile: '13800138000',
            status: editForm.status,
            audit_reason: editForm.status === 2 ? editForm.audit_reason : '',
            is_top: 1,
            is_show: editForm.status === 1 ? 1 : 0,
            sort: 0,
            create_time: time,
            audit_time: editForm.status === 0 ? '' : time,
        })
        pager.count += 1
        ElMessage.success('添加成功')
    }
    editVisible.value = false
}

// ---- 审核 ----
const auditVisible = ref(false)
const auditRow = ref<any>(null)
const auditForm = reactive({ action: 1, reason: '' })
const openAudit = (row: any, action: number) => {
    auditRow.value = row
    auditForm.action = action
    auditForm.reason = ''
    auditVisible.value = true
}
const reAudit = (row: any) => {
    row.status = 0
    row.audit_time = ''
    row.audit_reason = ''
    ElMessage.info('已重置为待审核')
}
const submitAudit = () => {
    if (!auditRow.value) return
    if (auditForm.action === 2 && !auditForm.reason.trim()) return ElMessage.warning('请填写驳回原因')
    const row = auditRow.value
    row.status = auditForm.action
    row.audit_time = nowTimeStr()
    row.audit_reason = auditForm.action === 2 ? auditForm.reason.trim() : ''
    row.is_show = auditForm.action === 1 ? 1 : 0
    auditVisible.value = false
    ElMessage.success(auditForm.action === 1 ? '审核通过，资源已在前端显示' : '已驳回，该资源不在前端显示')
}

// ---- 显示 / 隐藏 ----
const toggleShow = (row: any) => {
    if (row.status !== 1) return ElMessage.warning('仅审核通过的资源可设置显示或隐藏')
    row.is_show = row.is_show === 1 ? 0 : 1
    ElMessage.success(row.is_show === 1 ? '已设置为显示' : '已隐藏，前端不再显示')
}

// ---- 删除 ----
const delRow = (row: any) => {
    ElMessageBox.confirm(`确定删除资源「${row.title}」吗？删除后前端不再显示。`, '删除确认', { type: 'warning' })
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
    max-height: 360px;
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
