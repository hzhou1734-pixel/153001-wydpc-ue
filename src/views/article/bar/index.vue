<template>
    <div class="article-bar" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <el-radio-group v-model="queryAudit" @change="getLists">
                        <el-radio-button :value="-1">全部</el-radio-button>
                        <el-radio-button :value="0">
                            待审核
                            <el-badge v-if="pendingCount" :value="pendingCount" class="!ml-1 tab-badge" />
                        </el-radio-button>
                        <el-radio-button :value="1">已通过</el-radio-button>
                        <el-radio-button :value="2">已拒绝</el-radio-button>
                    </el-radio-group>
                    <el-input v-model="queryKw" placeholder="搜索标题 / 作者 / 小区" clearable style="width: 240px"
                        :prefix-icon="Search" @input="getLists" />
                </div>
            </template>
            <el-table :data="filteredList" stripe>
                <el-table-column label="封面" width="90">
                    <template #default="{ row }">
                        <el-image :src="row.cover" :preview-src-list="[row.cover]" preview-teleported
                            fit="cover" class="w-14 h-10 rounded" />
                    </template>
                </el-table-column>
                <el-table-column prop="title" label="帖子标题" min-width="200" show-overflow-tooltip />
                <el-table-column prop="author" label="作者" width="100" />
                <el-table-column prop="community" label="所属小区" min-width="120" show-overflow-tooltip />
                <el-table-column label="审核状态" width="100">
                    <template #default="{ row }">
                        <el-tag v-if="row.audit === 0" type="warning">待审核</el-tag>
                        <el-tag v-else-if="row.audit === 1" type="success">已通过</el-tag>
                        <el-tooltip v-else :content="row.audit_reason || '不符合社区规范'" placement="top">
                            <el-tag type="danger">已拒绝</el-tag>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="上架状态" width="90">
                    <template #default="{ row }">
                        <el-switch v-if="row.audit === 1" v-model="row.status" :active-value="1" :inactive-value="0"
                            @change="toggleStatus(row)" />
                        <span v-else class="text-xs text-tx-secondary">—</span>
                    </template>
                </el-table-column>
                <el-table-column prop="views" label="浏览量" width="90" sortable />
                <el-table-column prop="replies" label="评论数" width="90" sortable />
                <el-table-column prop="create_time" label="发布时间" width="160" />
                <el-table-column label="操作" width="170" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" type="primary" plain link @click="viewDetail(row)">详情</el-button>
                        <el-button v-if="row.audit === 0" size="small" type="warning" plain link
                            @click="openAudit(row)">审核</el-button>
                        <el-button size="small" type="danger" plain link @click="delRow(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 详情弹窗 -->
        <el-dialog v-model="showDetail" title="帖子详情" width="560px">
            <div v-if="detailRow" class="detail-wrap">
                <div class="flex items-start gap-4">
                    <el-image :src="detailRow.cover" :preview-src-list="[detailRow.cover]" preview-teleported
                        fit="cover" class="w-32 h-24 rounded-lg flex-shrink-0" />
                    <div class="flex-1 min-w-0">
                        <div class="text-base font-bold leading-snug">{{ detailRow.title }}</div>
                        <div class="text-xs text-tx-secondary mt-2">
                            {{ detailRow.author }} · {{ detailRow.community }} · {{ detailRow.create_time }}
                        </div>
                        <div class="flex items-center gap-3 mt-2">
                            <el-tag v-if="detailRow.audit === 0" type="warning" size="small">待审核</el-tag>
                            <el-tag v-else-if="detailRow.audit === 1" type="success" size="small">已通过</el-tag>
                            <el-tag v-else type="danger" size="small">已拒绝</el-tag>
                            <el-tag v-if="detailRow.status === 1" size="small">展示中</el-tag>
                            <el-tag v-else-if="detailRow.audit === 1" type="info" size="small">已下架</el-tag>
                        </div>
                    </div>
                </div>
                <!-- 帖子正文 -->
                <div class="detail-content-title">帖子内容</div>
                <div class="detail-content">{{ detailRow.content || '（暂无正文）' }}</div>
                <div class="flex items-center gap-6 mt-3 text-sm text-tx-secondary">
                    <span>浏览 {{ detailRow.views }}</span>
                    <span>评论 {{ detailRow.replies }}</span>
                </div>
                <!-- 审核信息 -->
                <template v-if="detailRow.audit !== 0">
                    <div class="detail-content-title">审核信息</div>
                    <el-descriptions :column="1" border size="small">
                        <el-descriptions-item label="审核结果">
                            <el-tag :type="detailRow.audit === 1 ? 'success' : 'danger'" size="small">
                                {{ detailRow.audit === 1 ? '审核通过' : '审核拒绝' }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="审核时间">{{ detailRow.audit_time || '—' }}</el-descriptions-item>
                        <el-descriptions-item v-if="detailRow.audit === 2" label="拒绝原因">
                            {{ detailRow.audit_reason || '—' }}
                        </el-descriptions-item>
                    </el-descriptions>
                </template>
            </div>
            <template #footer>
                <div class="flex items-center justify-between w-full">
                    <div>
                        <template v-if="detailRow && detailRow.audit === 0">
                            <el-button type="success" @click="doAudit(detailRow, 1)">通过</el-button>
                            <el-button type="danger" @click="doAudit(detailRow, 2)">拒绝</el-button>
                        </template>
                        <el-button v-else-if="detailRow && detailRow.audit !== 0" @click="reAudit(detailRow)">重新审核</el-button>
                    </div>
                    <el-button @click="showDetail = false">关闭</el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 审核弹窗 -->
        <el-dialog v-model="showAudit" :title="auditForm.action === 1 ? '审核通过' : '审核拒绝'" width="480px">
            <div v-if="auditRow" class="mb-3">
                <div class="font-bold">{{ auditRow.title }}</div>
                <div class="text-xs text-tx-secondary mt-1">{{ auditRow.author }} · {{ auditRow.community }} ·
                    {{ auditRow.create_time }}</div>
            </div>
            <template v-if="auditForm.action === 2">
                <el-input v-model="auditForm.reason" type="textarea" :rows="3" maxlength="100" show-word-limit
                    placeholder="请填写拒绝原因，将通知发帖人（如：内容涉及广告、言论不当等）" />
            </template>
            <el-alert v-else title="通过后帖子将在邻里圈对外展示，业主可浏览、评论" type="success" :closable="false" show-icon />
            <template #footer>
                <el-button @click="showAudit = false">取消</el-button>
                <el-button :type="auditForm.action === 1 ? 'success' : 'danger'" @click="submitAudit">
                    确认{{ auditForm.action === 1 ? '通过' : '拒绝' }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="articleBar">
import { getBarList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

const { pager, getLists } = usePaging({ fetchFun: getBarList, firstLoading: true })

const queryKw = ref('')
const queryAudit = ref(-1)
const filteredList = computed(() => {
    let lists = pager.lists
    if (queryAudit.value !== -1) lists = lists.filter((i: any) => i.audit === queryAudit.value)
    if (!queryKw.value) return lists
    const kw = queryKw.value.toLowerCase()
    return lists.filter((i: any) => i.title.toLowerCase().includes(kw) || i.author.includes(kw) || i.community.includes(kw))
})
const pendingCount = computed(() => pager.lists.filter((i: any) => i.audit === 0).length)

const toggleStatus = (row: any) => {
    ElMessage.success(`已${row.status === 1 ? '恢复展示' : '下架'}帖子`)
}

const nowTimeStr = () => {
    const now = new Date()
    const pad = (v: number) => String(v).padStart(2, '0')
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

// ---- 详情 ----
const showDetail = ref(false)
const detailRow = ref<any>(null)
const viewDetail = (row: any) => {
    detailRow.value = row
    showDetail.value = true
}

// ---- 审核 ----
const showAudit = ref(false)
const auditRow = ref<any>(null)
const auditForm = reactive({ action: 1, reason: '' })
const openAudit = (row: any) => {
    auditRow.value = row
    auditForm.action = 2
    auditForm.reason = ''
    showAudit.value = true
}
const doAudit = (row: any, action: number) => {
    auditRow.value = row
    auditForm.action = action
    auditForm.reason = ''
    showAudit.value = true
}
const reAudit = (row: any) => {
    row.audit = 0
    row.audit_reason = ''
    row.audit_time = ''
    detailRow.value = row
    ElMessage.info('已重置为待审核，请重新审核')
}
const submitAudit = () => {
    if (!auditRow.value) return
    if (auditForm.action === 2 && !auditForm.reason.trim()) return ElMessage.warning('请填写拒绝原因')
    auditRow.value.audit = auditForm.action
    auditRow.value.audit_time = nowTimeStr()
    auditRow.value.audit_reason = auditForm.action === 2 ? auditForm.reason.trim() : ''
    if (auditForm.action === 1) auditRow.value.status = 1
    showAudit.value = false
    ElMessage.success(auditForm.action === 1 ? '已通过，帖子恢复展示' : '已拒绝，将通知发帖人')
}

// ---- 删除 ----
const delRow = (row: any) => {
    ElMessageBox.confirm(`确定删除帖子「${row.title}」吗？删除后不可恢复。`, '删除确认', { type: 'warning' }).then(() => {
        const idx = pager.lists.findIndex((i: any) => i.id === row.id)
        if (idx > -1) pager.lists.splice(idx, 1)
        ElMessage.success('删除成功')
    }).catch(() => { })
}

onMounted(getLists)
</script>

<style lang="scss" scoped>
.tab-badge {
    :deep(.el-badge__content) {
        position: static;
        transform: none;
    }
}

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
        white-space: pre-wrap;
        word-break: break-all;
    }
}
</style>
