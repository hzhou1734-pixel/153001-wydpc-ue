<template>
    <div class="article-hr">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">人力资源</span>
                    <div class="text-xs text-tx-secondary">业主提交的人力资源 / 技能认证申请，审核通过后自动进入人才库</div>
                </div>
            </template>

            <!-- 筛选搜索 -->
            <el-form inline class="mb-2">
                <el-form-item label="关键词">
                    <el-input v-model="queryParams.keyword" placeholder="资源标题 / 发布人昵称 / 手机号码" clearable class="!w-64"
                        :prefix-icon="Search" @keyup.enter="onSearch" />
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="queryParams.status" placeholder="请选择" clearable class="!w-32">
                        <el-option label="待审核" :value="0" />
                        <el-option label="已通过" :value="1" />
                        <el-option label="已驳回" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="提交时间">
                    <el-date-picker v-model="submitRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-64" />
                </el-form-item>
                <el-form-item label="审核时间">
                    <el-date-picker v-model="auditRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-64" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetQuery">重置</el-button>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="pager.lists" stripe v-loading="pager.loading">
                <el-table-column label="认证技能标题" min-width="220" show-overflow-tooltip>
                    <template #default="{ row }">
                        <span>{{ row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="提交用户" width="170">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="28" :src="row.avatar" class="!mr-2" />
                            <span>{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" width="120" show-overflow-tooltip />
                <el-table-column label="认证凭证" width="160">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-image v-for="(img, i) in row.cert_images.slice(0, 3)" :key="i" :src="img"
                                :preview-src-list="row.cert_images" :initial-index="i" preview-teleported fit="cover"
                                class="w-10 h-10 rounded !mr-1" />
                            <span v-if="!row.cert_images?.length" class="text-tx-secondary">—</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="submit_time" label="提交时间" width="160" show-overflow-tooltip />
                <el-table-column label="审核状态" width="100">
                    <template #default="{ row }">
                        <el-tag size="small" :type="statusTag(row.status)">{{ statusText(row.status) }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="审核时间" width="160">
                    <template #default="{ row }">{{ row.audit_time || '—' }}</template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openDetail(row)">
                            <el-icon class="mr-1"><InfoFilled /></el-icon>认证详情
                        </el-button>
                        <el-button link type="warning" :disabled="row.status !== 0" @click="openAudit(row)">认证审核</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 认证详情 -->
        <el-dialog v-model="detailVisible" title="人力资源认证详情" width="720px" top="6vh">
            <el-descriptions :column="2" border>
                <el-descriptions-item label="认证技能标题" :span="2">{{ detail.title }}</el-descriptions-item>
                <el-descriptions-item label="提交用户">
                    <div class="flex items-center">
                        <el-avatar :size="28" :src="detail.avatar" class="!mr-2" />
                        <span>{{ detail.nickname }}</span>
                    </div>
                </el-descriptions-item>
                <el-descriptions-item label="手机号码">{{ detail.mobile || '—' }}</el-descriptions-item>
                <el-descriptions-item label="技能信息">{{ detail.skill }}</el-descriptions-item>
                <el-descriptions-item label="审核状态">
                    <el-tag size="small" :type="statusTag(detail.status)">{{ statusText(detail.status) }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="提交时间">{{ detail.submit_time }}</el-descriptions-item>
                <el-descriptions-item label="审核时间">{{ detail.audit_time || '—' }}</el-descriptions-item>
                <el-descriptions-item v-if="detail.status === 2" label="驳回备注" :span="2">
                    {{ detail.audit_reason || '—' }}
                </el-descriptions-item>
            </el-descriptions>

            <div class="detail-content-title">详情描述</div>
            <div class="detail-content">{{ detail.detail || '（暂无描述）' }}</div>

            <div class="detail-content-title">认证凭证</div>
            <div v-if="detail.cert_images?.length" class="flex flex-wrap">
                <el-image v-for="(img, i) in detail.cert_images" :key="i" :src="img" :preview-src-list="detail.cert_images"
                    :initial-index="i" preview-teleported fit="cover" class="w-32 h-32 rounded !mr-2 !mb-2" />
            </div>
            <div v-else class="text-tx-secondary text-sm">（未上传凭证）</div>
            <template #footer>
                <el-button @click="detailVisible = false">关闭</el-button>
            </template>
        </el-dialog>

        <!-- 认证审核 -->
        <el-dialog v-model="auditVisible" title="人力资源认证审核" width="560px">
            <div v-if="auditRow" class="mb-3">
                <div class="font-bold">{{ auditRow.title }}</div>
                <div class="text-xs text-tx-secondary mt-1">
                    {{ auditRow.nickname }} · {{ auditRow.mobile }} · 提交于 {{ auditRow.submit_time }}
                </div>
            </div>
            <el-form label-width="80px">
                <el-form-item label="审核结果" required>
                    <el-radio-group v-model="auditForm.status">
                        <el-radio :value="1">审核通过</el-radio>
                        <el-radio :value="2">驳回</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="auditForm.status === 1" label=" ">
                    <el-alert title="审核通过后，该用户将自动进入人才库，可接单生活帮手服务" type="success" :closable="false" show-icon />
                </el-form-item>
                <el-form-item v-else label="驳回备注" required>
                    <el-input v-model="auditForm.reason" type="textarea" :rows="3" maxlength="100" show-word-limit
                        placeholder="请填写驳回备注，如：证件照片模糊无法辨认，请重新上传" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="auditVisible = false">取消</el-button>
                <el-button :type="auditForm.status === 1 ? 'success' : 'danger'" @click="submitAudit">
                    确认{{ auditForm.status === 1 ? '通过' : '驳回' }}
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="articleHr">
import { hrCertList, talentList, helperCategories } from '@/mock/data_content'
import { usePaging } from '@/hooks/usePaging'
import { Search, InfoFilled } from '@element-plus/icons-vue'

const queryParams = reactive({ keyword: '', status: '', submit_start: '', submit_end: '', audit_start: '', audit_end: '' })
const submitRange = ref<string[]>([])
const auditRange = ref<string[]>([])

// 本地筛选：列表分页与数据源保持一致
const doFilter = (data: any[], params: Record<string, any> = {}) => {
    let result = data
    if (params.keyword) {
        const kw = String(params.keyword)
        result = result.filter(
            (i: any) =>
                String(i.title || '').includes(kw) ||
                String(i.nickname || '').includes(kw) ||
                String(i.mobile || '').includes(kw)
        )
    }
    if (params.status !== '' && params.status !== undefined && params.status !== null) {
        result = result.filter((i: any) => i.status === Number(params.status))
    }
    if (params.submit_start) {
        result = result.filter((i: any) => String(i.submit_time).slice(0, 10) >= params.submit_start)
    }
    if (params.submit_end) {
        result = result.filter((i: any) => String(i.submit_time).slice(0, 10) <= params.submit_end)
    }
    if (params.audit_start) {
        result = result.filter((i: any) => i.audit_time && String(i.audit_time).slice(0, 10) >= params.audit_start)
    }
    if (params.audit_end) {
        result = result.filter((i: any) => i.audit_time && String(i.audit_time).slice(0, 10) <= params.audit_end)
    }
    return result
}

const getCertList = (params: Record<string, any>) => {
    const { page_no = 1, page_size = 15, ...rest } = params
    const lists = doFilter(hrCertList, rest)
    return Promise.resolve({
        count: lists.length,
        lists: lists.slice((page_no - 1) * page_size, page_no * page_size)
    })
}

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getCertList,
    params: queryParams,
    firstLoading: true
})

const onSearch = () => {
    queryParams.submit_start = submitRange.value?.[0] || ''
    queryParams.submit_end = submitRange.value?.[1] || ''
    queryParams.audit_start = auditRange.value?.[0] || ''
    queryParams.audit_end = auditRange.value?.[1] || ''
    resetPage()
}
const resetQuery = () => {
    submitRange.value = []
    auditRange.value = []
    queryParams.submit_start = ''
    queryParams.submit_end = ''
    queryParams.audit_start = ''
    queryParams.audit_end = ''
    resetParams()
}

const statusText = (s: number) => (s === 1 ? '已通过' : s === 2 ? '已驳回' : '待审核')
const statusTag = (s: number) => (s === 1 ? 'success' : s === 2 ? 'danger' : 'warning')
const nowTimeStr = () => {
    const d = new Date()
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// ---- 认证详情 ----
const detailVisible = ref(false)
const detail = ref<any>({})
const openDetail = (row: any) => {
    detail.value = row
    detailVisible.value = true
}

// ---- 认证审核 ----
const auditVisible = ref(false)
const auditRow = ref<any>(null)
const auditForm = reactive({ status: 1, reason: '' })
const openAudit = (row: any) => {
    auditRow.value = row
    auditForm.status = 1
    auditForm.reason = ''
    auditVisible.value = true
}
const submitAudit = () => {
    const row = auditRow.value
    if (!row) return
    if (auditForm.status === 2 && !auditForm.reason.trim()) return ElMessage.warning('驳回时请填写备注内容')
    row.status = auditForm.status
    row.audit_time = nowTimeStr()
    row.audit_reason = auditForm.status === 2 ? auditForm.reason.trim() : ''
    if (auditForm.status === 1) {
        // 审核通过后进入人才库
        const exist = talentList.find((t: any) => t.mobile === row.mobile)
        if (exist) {
            if (!exist.categories.includes(row.skill) && helperCategories.includes(row.skill)) {
                exist.categories.push(row.skill)
            }
            ElMessage.success('审核通过，该用户已在人才库中并补充了服务类目')
        } else {
            const category = helperCategories.includes(row.skill) ? row.skill : '其他'
            talentList.unshift({
                id: Date.now(),
                avatar: row.avatar,
                nickname: row.nickname,
                mobile: row.mobile,
                skill: row.skill,
                categories: [category],
                order_total: 0,
                processing: 0,
                done: 0,
                canceled: 0,
                done_amount: 0,
                status: 1,
                create_time: nowTimeStr()
            })
            ElMessage.success('审核通过，该用户已进入人才库')
        }
    } else {
        ElMessage.success('已驳回，请用户根据备注内容重新提交')
    }
    auditVisible.value = false
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
    max-height: 300px;
    overflow-y: auto;
}
</style>
