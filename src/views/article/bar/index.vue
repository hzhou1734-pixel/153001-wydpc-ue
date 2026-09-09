<template>
    <div class="article-bar">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <span class="card-title">社区贴吧</span>
            </template>

            <!-- 筛选搜索 -->
            <el-form inline class="mb-2">
                <el-form-item label="关键词">
                    <el-input v-model="queryParams.keyword" placeholder="帖子ID / 标题 / 昵称 / 手机号码" clearable class="!w-64"
                        :prefix-icon="Search" @keyup.enter="onSearch" />
                </el-form-item>
                <el-form-item label="帖子状态">
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
                <el-table-column prop="id" label="帖子ID" width="90" />
                <el-table-column label="封面图" width="100">
                    <template #default="{ row }">
                        <el-image :src="row.cover" :preview-src-list="[row.cover]" preview-teleported fit="cover"
                            class="w-14 h-10 rounded" />
                    </template>
                </el-table-column>
                <el-table-column label="标题" min-width="220" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span>{{ row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发布人" min-width="150">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="28" :src="row.avatar" class="!mr-2" />
                            <span>{{ row.author }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" width="130" />
                <el-table-column label="帖子状态" width="100">
                    <template #default="{ row }">
                        <el-tooltip v-if="row.audit === 2" :content="row.audit_reason || '—'" placement="top">
                            <el-tag size="small" type="danger">已驳回</el-tag>
                        </el-tooltip>
                        <el-tag v-else size="small" :type="row.audit === 1 ? 'success' : 'warning'">
                            {{ row.audit === 1 ? '已通过' : '待审核' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="发布时间" width="170" />
                <el-table-column label="审核时间" width="170">
                    <template #default="{ row }">{{ row.audit_time || '—' }}</template>
                </el-table-column>
                <el-table-column label="显示状态" width="100">
                    <template #default="{ row }">
                        <el-switch :model-value="row.status" :active-value="1" :inactive-value="0" :disabled="row.audit !== 1" @change="toggleShow(row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="250" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openDetail(row)">详情</el-button>
                        <el-button link type="primary" @click="openComment(row)">评论</el-button>
                        <el-button v-if="row.audit === 0" link type="warning" @click="openAudit(row, 1)">审核</el-button>
                        <el-button v-else link type="danger" @click="openAudit(row, 2)">违规重审</el-button>
                        <el-button link type="danger" @click="delRow(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 帖子详情 -->
        <el-dialog v-model="detailVisible" title="帖子详情" width="760px" top="5vh">
            <div v-if="Object.keys(detail).length">
                <div class="detail-content-title">发布人信息</div>
                <el-descriptions :column="2" border size="small">
                    <el-descriptions-item label="头像">
                        <el-avatar :size="40" :src="detail.avatar" />
                    </el-descriptions-item>
                    <el-descriptions-item label="昵称">{{ detail.author }}</el-descriptions-item>
                    <el-descriptions-item label="手机号码">{{ detail.mobile }}</el-descriptions-item>
                    <el-descriptions-item label="所属小区">{{ detail.community }}</el-descriptions-item>
                </el-descriptions>

                <div class="detail-content-title">帖子信息</div>
                <el-descriptions :column="2" border size="small">
                    <el-descriptions-item label="帖子ID">{{ detail.id }}</el-descriptions-item>
                    <el-descriptions-item label="帖子状态">
                        <el-tag size="small" :type="detail.audit === 1 ? 'success' : detail.audit === 2 ? 'danger' : 'warning'">
                            {{ detail.audit === 1 ? '已通过' : detail.audit === 2 ? '已驳回' : '待审核' }}
                        </el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="收藏数量">{{ detail.collects ?? 0 }}</el-descriptions-item>
                    <el-descriptions-item label="评论数量">{{ detail.replies ?? 0 }}</el-descriptions-item>
                    <el-descriptions-item label="浏览量">{{ detail.views }}</el-descriptions-item>
                    <el-descriptions-item label="显示状态">
                        <el-tag size="small" :type="detail.status === 1 ? 'success' : 'info'">{{ detail.status === 1 ? '显示' : '隐藏' }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="发布时间">{{ detail.create_time }}</el-descriptions-item>
                    <el-descriptions-item label="审核时间">{{ detail.audit_time || '—' }}</el-descriptions-item>
                    <el-descriptions-item label="标题" :span="2">{{ detail.title }}</el-descriptions-item>
                    <el-descriptions-item v-if="detail.audit === 2" label="驳回原因" :span="2">
                        {{ detail.audit_reason || '—' }}
                    </el-descriptions-item>
                </el-descriptions>

                <div class="detail-content-title">帖子内容</div>
                <div class="flex items-start gap-3 mb-2">
                    <el-image :src="detail.cover" :preview-src-list="[detail.cover]" preview-teleported fit="cover"
                        class="w-32 h-24 rounded flex-shrink-0" />
                    <div class="detail-content !mt-0 flex-1">{{ detail.content || '（暂无正文）' }}</div>
                </div>

                <div class="detail-content-title">帖子发布日志</div>
                <el-timeline v-if="detail.logs?.length" class="!pl-1">
                    <el-timeline-item v-for="(log, i) in detail.logs" :key="i" :timestamp="log.time" placement="top">
                        <div class="text-sm">
                            <span class="font-medium">{{ log.content }}</span>
                            <span class="text-tx-secondary ml-2">操作人：{{ log.operator }}</span>
                        </div>
                    </el-timeline-item>
                </el-timeline>
                <div v-else class="text-sm text-tx-secondary">暂无日志</div>
            </div>
            <template #footer>
                <el-button @click="detailVisible = false">关闭</el-button>
            </template>
        </el-dialog>

        <!-- 帖子评论 -->
        <el-dialog v-model="commentVisible" :title="`帖子评论 - ${commentRow.title || ''}`" width="680px" top="6vh">
            <el-table :data="commentLists" stripe max-height="440" v-loading="commentLoading">
                <el-table-column label="用户" min-width="150">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="28" :src="row.avatar" class="!mr-2" />
                            <span>{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="content" label="评论内容" min-width="240" show-overflow-tooltip />
                <el-table-column prop="create_time" label="评论时间" width="170" />
            </el-table>
            <template #footer>
                <el-button @click="commentVisible = false">关闭</el-button>
            </template>
        </el-dialog>

        <!-- 审核弹窗 -->
        <el-dialog v-model="auditVisible" :title="auditForm.action === 1 ? '帖子审核' : '违规重审下架'" width="520px">
            <div v-if="auditRow" class="mb-3">
                <div class="font-bold">{{ auditRow.title }}</div>
                <div class="text-xs text-tx-secondary mt-1">
                    {{ auditRow.author }} · {{ auditRow.mobile }} · {{ auditRow.create_time }}
                </div>
            </div>
            <template v-if="auditForm.action === 1">
                <el-alert title="审核通过后帖子将在前端正常显示，业主可浏览与评论" type="success" :closable="false" show-icon />
            </template>
            <template v-else>
                <el-alert title="驳回后帖子将下架，不在前端显示，请填写备注原因" type="warning" :closable="false" show-icon class="mb-3" />
                <el-input v-model="auditForm.reason" type="textarea" :rows="3" maxlength="100" show-word-limit
                    placeholder="请填写驳回原因，如：内容涉及广告、言论不当等" />
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

<script setup lang="ts" name="articleBar">
import { getBarList, getBarCommentList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const queryParams = reactive({ keyword: '', status: '', start_time: '', end_time: '', audit_start: '', audit_end: '' })
const { pager, getLists } = usePaging({ fetchFun: getBarList, params: queryParams, firstLoading: true })

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

// ---- 评论 ----
const commentVisible = ref(false)
const commentLoading = ref(false)
const commentRow = ref<any>({})
const commentLists = ref<any[]>([])
const openComment = async (row: any) => {
    commentRow.value = row
    commentVisible.value = true
    commentLoading.value = true
    try {
        const res: any = await getBarCommentList({ post_id: row.id, page_size: 100 })
        commentLists.value = res?.lists || []
    } finally {
        commentLoading.value = false
    }
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
const submitAudit = () => {
    if (!auditRow.value) return
    if (auditForm.action === 2 && !auditForm.reason.trim()) return ElMessage.warning('请填写驳回原因')
    const row = auditRow.value
    row.audit = auditForm.action
    row.audit_time = nowTimeStr()
    row.audit_reason = auditForm.action === 2 ? auditForm.reason.trim() : ''
    row.status = auditForm.action === 1 ? 1 : 0
    if (!row.logs) row.logs = []
    row.logs.push({
        time: row.audit_time,
        content: auditForm.action === 1 ? '物业审核通过，帖子对外展示' : `物业违规驳回：${row.audit_reason}`,
        operator: 'admin',
    })
    auditVisible.value = false
    ElMessage.success(auditForm.action === 1 ? '审核通过，帖子已展示' : '已驳回，帖子下架不再显示')
}

// ---- 显示 / 隐藏 ----
const toggleShow = (row: any) => {
    if (row.audit !== 1) return ElMessage.warning('仅审核通过的帖子可设置显示或隐藏')
    row.status = row.status === 1 ? 0 : 1
    ElMessage.success(row.status === 1 ? '已设置为显示' : '已隐藏，前端不再显示')
}

// ---- 删除 ----
const delRow = (row: any) => {
    ElMessageBox.confirm(`确定删除帖子「${row.title}」吗？删除后前端不再显示该帖子。`, '删除确认', { type: 'warning' })
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
    white-space: pre-wrap;
    word-break: break-all;
    max-height: 300px;
    overflow-y: auto;
}
</style>
