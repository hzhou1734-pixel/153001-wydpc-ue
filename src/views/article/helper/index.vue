<template>
    <div class="article-helper">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <span class="card-title">生活帮手</span>
            </template>

            <!-- 筛选搜索 -->
            <el-form inline class="mb-2">
                <el-form-item label="关键词">
                    <el-input v-model="queryParams.keyword" placeholder="发布人昵称 / 手机号码 / 处理人" clearable class="!w-64"
                        :prefix-icon="Search" @keyup.enter="onSearch" />
                </el-form-item>
                <el-form-item label="类型">
                    <el-select v-model="queryParams.type" placeholder="全部类型" clearable class="!w-36">
                        <el-option v-for="t in typeOptions" :key="t" :label="t" :value="t" />
                    </el-select>
                </el-form-item>
                <el-form-item label="楼栋">
                    <el-select v-model="queryParams.building" placeholder="全部楼栋" clearable class="!w-36">
                        <el-option v-for="b in buildingOptions" :key="b" :label="b" :value="b" />
                    </el-select>
                </el-form-item>
                <el-form-item label="处理状态">
                    <el-select v-model="queryParams.status" placeholder="全部状态" clearable class="!w-32">
                        <el-option label="待处理" :value="0" />
                        <el-option label="已处理" :value="1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="提交时间">
                    <el-date-picker v-model="createRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-60" />
                </el-form-item>
                <el-form-item label="处理时间">
                    <el-date-picker v-model="handleRange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="YYYY-MM-DD" class="!w-60" />
                </el-form-item>
                <el-form-item>
                    <el-button @click="resetQuery">重置</el-button>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="pager.lists" stripe v-loading="pager.loading">
                <el-table-column label="类型" width="110">
                    <template #default="{ row }">
                        <el-tag size="small">{{ row.type }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="发布人" min-width="150">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="28" :src="row.avatar" class="!mr-2" />
                            <span>{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号码" width="120" show-overflow-tooltip />
                <el-table-column prop="building" label="楼栋" min-width="140" show-overflow-tooltip />
                <el-table-column label="处理状态" width="90">
                    <template #default="{ row }">
                        <el-tag size="small" :type="row.status === 1 ? 'success' : 'warning'">
                            {{ row.status === 1 ? '已处理' : '待处理' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="处理人" min-width="160">
                    <template #default="{ row }">
                        <span v-if="row.handler">{{ row.handler }}</span>
                        <span v-else class="text-tx-secondary">—</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="提交时间" width="160" show-overflow-tooltip />
                <el-table-column label="处理时间" width="160">
                    <template #default="{ row }">
                        <span v-if="row.handle_time">{{ row.handle_time }}</span>
                        <span v-else class="text-tx-secondary">—</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="170" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openDetail(row)">详情</el-button>
                        <el-button link type="primary" :disabled="row.status === 1" @click="openHandle(row)">标记已处理</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 详情弹窗 -->
        <el-dialog v-model="detailVisible" title="生活帮手详情" width="720px" top="6vh">
            <el-descriptions :column="2" border>
                <el-descriptions-item label="求助类型">{{ detail.type }}</el-descriptions-item>
                <el-descriptions-item label="处理状态">
                    <el-tag size="small" :type="detail.status === 1 ? 'success' : 'warning'">
                        {{ detail.status === 1 ? '已处理' : '待处理' }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="发布人">
                    <div class="flex items-center">
                        <el-avatar :size="28" :src="detail.avatar" class="!mr-2" />
                        <span>{{ detail.nickname }}</span>
                    </div>
                </el-descriptions-item>
                <el-descriptions-item label="手机号码">{{ detail.phone }}</el-descriptions-item>
                <el-descriptions-item label="楼栋房号" :span="2">{{ detail.building }}</el-descriptions-item>
                <el-descriptions-item label="处理人">{{ detail.handler || '—' }}</el-descriptions-item>
                <el-descriptions-item label="处理时间">{{ detail.handle_time || '—' }}</el-descriptions-item>
                <el-descriptions-item label="提交时间" :span="2">{{ detail.create_time }}</el-descriptions-item>
            </el-descriptions>

            <div v-if="detail.images?.length" class="mt-4">
                <div class="detail-content-title">现场图片</div>
                <div class="flex flex-wrap gap-2">
                    <el-image v-for="(img, i) in detail.images" :key="i" :src="img" :preview-src-list="detail.images"
                        :initial-index="i" preview-teleported fit="cover" class="w-28 h-20 rounded" />
                </div>
            </div>

            <div class="detail-content-title">详情内容</div>
            <div class="detail-content rich-content" v-html="detail.content || '（暂无内容）'"></div>

            <template #footer>
                <el-button @click="detailVisible = false">关闭</el-button>
                <el-button type="primary" :disabled="detail.status === 1" @click="openHandle(detail)">标记已处理</el-button>
            </template>
        </el-dialog>

        <!-- 标记已处理弹窗 -->
        <el-dialog v-model="handleVisible" title="标记为已处理" width="480px">
            <el-form :model="handleForm" label-width="90px">
                <el-form-item label="处理人" required>
                    <el-select v-model="handleForm.admin_id" placeholder="请选择处理人（物业后台管理员账号）" class="!w-full">
                        <el-option v-for="a in adminOptions" :key="a.id" :label="`${a.username}（${a.nickname}）`" :value="a.id"
                            :disabled="a.status === 0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="处理说明">
                    <el-input v-model="handleForm.remark" type="textarea" :rows="3" placeholder="可填写处理结果说明（选填）" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="handleVisible = false">取消</el-button>
                <el-button type="primary" @click="submitHandle">确认标记</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="articleHelper">
import { getHelperList, getAdminList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { Search } from '@element-plus/icons-vue'

/** 生活帮手类型 */
const typeOptions = ['家电维修', '管道疏通', '开锁换锁', '保洁清洗', '代买代办', '居家照护', '其他']
const buildingOptions = ['1栋', '2栋', '3栋', '4栋', '5栋', '6栋']

const queryParams = reactive({
    keyword: '', type: '', building: '', status: '',
    start_time: '', end_time: '', handle_start: '', handle_end: ''
})
const { pager, getLists } = usePaging({ fetchFun: getHelperList, params: queryParams, firstLoading: true })

const createRange = ref<string[]>([])
const handleRange = ref<string[]>([])
const onSearch = () => {
    queryParams.start_time = createRange.value?.[0] || ''
    queryParams.end_time = createRange.value?.[1] || ''
    queryParams.handle_start = handleRange.value?.[0] || ''
    queryParams.handle_end = handleRange.value?.[1] || ''
    pager.page = 1
    getLists()
}
const resetQuery = () => {
    queryParams.keyword = ''
    queryParams.type = ''
    queryParams.building = ''
    queryParams.status = ''
    createRange.value = []
    handleRange.value = []
    onSearch()
}

// 物业后台管理员账号
const adminOptions = ref<any[]>([])
const getAdmins = async () => {
    const res: any = await getAdminList({ page_size: 100 })
    adminOptions.value = res?.lists || []
}
getAdmins()

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

// ---- 标记已处理 ----
const handleVisible = ref(false)
const handleRow = ref<any>(null)
const handleForm = reactive({ admin_id: '', remark: '' })
const openHandle = (row: any) => {
    if (row.status === 1) return ElMessage.warning('该记录已处理')
    handleRow.value = row
    handleForm.admin_id = ''
    handleForm.remark = ''
    handleVisible.value = true
}
const submitHandle = () => {
    if (!handleForm.admin_id) return ElMessage.warning('请选择处理人')
    const admin = adminOptions.value.find((a: any) => a.id === handleForm.admin_id)
    const row = handleRow.value
    if (row) {
        row.status = 1
        row.handler = `${admin.username}（${admin.nickname}）`
        row.handle_time = nowTimeStr()
        if (handleForm.remark.trim()) {
            row.content = `${row.content}<h4>处理说明</h4><p>${handleForm.remark.trim()}（处理人：${row.handler}）</p>`
        }
    }
    handleVisible.value = false
    ElMessage.success(`已标记为已处理，处理人：${row?.handler}`)
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
}
</style>
