<template>
    <div class="community-certify" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header><span class="card-title">认证列表</span></template>

            <el-form :model="searchParams" inline class="mb-2">
                <el-form-item label="关键词">
                    <el-input
                        v-model="searchParams.keyword"
                        placeholder="用户ID / 昵称 / 手机号码 / 房号"
                        clearable
                        class="!w-[240px]"
                        @keyup.enter="handleSearch"
                    />
                </el-form-item>
                <el-form-item label="小区">
                    <el-select v-model="searchParams.community" placeholder="请选择" clearable class="!w-[160px]">
                        <el-option v-for="item in communityOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="楼栋">
                    <el-select v-model="searchParams.building" placeholder="请选择" clearable class="!w-[120px]">
                        <el-option v-for="item in buildingOptions" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="searchParams.status" placeholder="请选择" clearable class="!w-[120px]">
                        <el-option label="待审核" :value="0" />
                        <el-option label="已通过" :value="1" />
                        <el-option label="已驳回" :value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="提交时间">
                    <el-date-picker
                        v-model="searchParams.create_time"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="!w-[240px]"
                    />
                </el-form-item>
                <el-form-item label="审核时间">
                    <el-date-picker
                        v-model="searchParams.audit_time"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="!w-[240px]"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="pager.lists" border>
                <el-table-column prop="user_id" label="用户ID" width="80" />
                <el-table-column label="头像" width="80" align="center">
                    <template #default="{ row }">
                        <el-image :src="row.avatar" class="w-8 h-8 rounded-full" :preview-src-list="[row.avatar]" preview-teleported />
                    </template>
                </el-table-column>
                <el-table-column prop="nickname" label="昵称" min-width="100" show-overflow-tooltip />
                <el-table-column prop="mobile" label="手机号码" width="120" />
                <el-table-column prop="community" label="小区" min-width="150" show-overflow-tooltip />
                <el-table-column prop="building" label="楼栋" width="90" />
                <el-table-column prop="room" label="房号" width="90" />
                <el-table-column prop="job" label="职业" min-width="110" show-overflow-tooltip />
                <el-table-column label="家庭人口" width="100" align="center">
                    <template #default="{ row }">{{ row.family_count }} 人</template>
                </el-table-column>
                <el-table-column prop="hobby" label="兴趣爱好" min-width="140" show-overflow-tooltip />
                <el-table-column label="审核状态" width="90">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 0 ? 'warning' : row.status === 1 ? 'success' : 'danger'" size="small">
                            {{ row.status === 0 ? '待审核' : row.status === 1 ? '已通过' : '已驳回' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="提交时间" width="160" />
                <el-table-column label="审核时间" width="160">
                    <template #default="{ row }">{{ row.audit_time || '-' }}</template>
                </el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="viewDetail(row)">详情</el-button>
                        <template v-if="row.status === 0">
                            <el-button link type="success" @click="handleAudit(row, true)">通过</el-button>
                            <el-button link type="danger" @click="openReject(row)">驳回</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination
                    v-model:current-page="pager.page"
                    v-model:page-size="pager.size"
                    :total="pager.count"
                    layout="total, prev, pager, next"
                    @current-change="getLists"
                />
            </div>
        </el-card>

        <!-- 认证详情 -->
        <el-dialog v-model="showDetail" title="认证详情" width="520px">
            <el-descriptions :column="2" border>
                <el-descriptions-item label="用户ID">{{ current.user_id }}</el-descriptions-item>
                <el-descriptions-item label="昵称">{{ current.nickname }}</el-descriptions-item>
                <el-descriptions-item label="手机号码">{{ current.mobile }}</el-descriptions-item>
                <el-descriptions-item label="身份类型">{{ current.type }}</el-descriptions-item>
                <el-descriptions-item label="小区">{{ current.community }}</el-descriptions-item>
                <el-descriptions-item label="房屋">{{ current.building }} {{ current.room }}</el-descriptions-item>
                <el-descriptions-item label="职业">{{ current.job || '-' }}</el-descriptions-item>
                <el-descriptions-item label="家庭人口">{{ current.family_count }} 人</el-descriptions-item>
                <el-descriptions-item label="兴趣爱好" :span="2">{{ current.hobby || '-' }}</el-descriptions-item>
                <el-descriptions-item label="提交时间">{{ current.create_time }}</el-descriptions-item>
                <el-descriptions-item label="审核时间">{{ current.audit_time || '-' }}</el-descriptions-item>
                <el-descriptions-item label="审核状态">
                    <el-tag :type="current.status === 0 ? 'warning' : current.status === 1 ? 'success' : 'danger'" size="small">
                        {{ current.status === 0 ? '待审核' : current.status === 1 ? '已通过' : '已驳回' }}
                    </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="驳回原因">{{ current.audit_reason || '-' }}</el-descriptions-item>
            </el-descriptions>
        </el-dialog>

        <!-- 驳回原因 -->
        <el-dialog v-model="showReject" title="审核驳回" width="460px">
            <el-form label-width="80px">
                <el-form-item label="驳回原因" required>
                    <el-input v-model="rejectReason" type="textarea" :rows="4" maxlength="100" show-word-limit placeholder="请填写驳回原因，用户可重新提交业主认证" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showReject = false">取消</el-button>
                <el-button type="primary" @click="submitReject">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="communityCertify">
import { certifyList, roomList } from '@/mock/data'
import { usePaging } from '@/hooks/usePaging'

const nowStr = () => {
    const d = new Date()
    const pad = (v: number) => String(v).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

const searchParams = reactive({
    keyword: '',
    community: '',
    building: '',
    status: '',
    create_time: [] as any,
    audit_time: [] as any
})

const fetchCertify = async (params: any) => {
    const { page_no = 1, page_size = 15, keyword, community, building, status, create_time, audit_time } = params
    let list = certifyList.map((item: any) => ({
        ...item,
        avatar: `https://picsum.photos/seed/ghj-user-${item.user_id}/100/100`,
        audit_reason: item.audit_reason || ''
    }))
    if (keyword) {
        const kw = String(keyword)
        list = list.filter(
            (item: any) =>
                String(item.user_id).includes(kw) ||
                item.nickname.includes(kw) ||
                item.mobile.includes(kw) ||
                String(item.room).includes(kw)
        )
    }
    if (community) list = list.filter((item: any) => item.community === community)
    if (building) list = list.filter((item: any) => item.building === building)
    if (status !== '' && status !== undefined && status !== null) list = list.filter((item: any) => item.status === Number(status))
    if (create_time?.length === 2) {
        list = list.filter((item: any) => String(item.create_time).slice(0, 10) >= create_time[0] && String(item.create_time).slice(0, 10) <= create_time[1])
    }
    if (audit_time?.length === 2) {
        list = list.filter((item: any) => item.audit_time && String(item.audit_time).slice(0, 10) >= audit_time[0] && String(item.audit_time).slice(0, 10) <= audit_time[1])
    }
    return { count: list.length, lists: list.slice((page_no - 1) * page_size, page_no * page_size) }
}

const { pager, getLists, resetPage } = usePaging({ fetchFun: fetchCertify, params: searchParams, firstLoading: true })

const communityOptions = [...new Set(certifyList.map((item: any) => item.community))]
const buildingOptions = [...new Set(certifyList.map((item: any) => item.building))]

const handleSearch = () => resetPage()
const handleReset = () => {
    searchParams.keyword = ''
    searchParams.community = ''
    searchParams.building = ''
    searchParams.status = ''
    searchParams.create_time = []
    searchParams.audit_time = []
    resetPage()
}

// 详情
const showDetail = ref(false)
const current = ref<any>({})
const viewDetail = (row: any) => {
    current.value = row
    showDetail.value = true
}

// 审核通过：用户完成认证，楼栋房号信息自动填充该用户信息
const handleAudit = (row: any, pass: boolean) => {
    ElMessageBox.confirm(
        `确认通过用户「${row.nickname}」（${row.community} ${row.building} ${row.room}）的业主认证申请吗？通过后楼栋房号信息将自动填充该用户信息。`,
        '审核通过',
        { type: 'warning' }
    )
        .then(() => {
            row.status = 1
            row.audit_time = nowStr()
            row.audit_reason = ''
            const room = roomList.find((item: any) => item.phone === row.mobile)
            if (room) {
                room.owner = row.nickname
                room.phone = row.mobile
                room.certified = 1
            }
            ElMessage.success('已通过认证')
        })
        .catch(() => {})
}

// 审核驳回
const showReject = ref(false)
const rejectReason = ref('')
const rejectRow = ref<any>(null)
const openReject = (row: any) => {
    rejectRow.value = row
    rejectReason.value = ''
    showReject.value = true
}
const submitReject = () => {
    if (!rejectReason.value.trim()) return ElMessage.warning('请填写驳回原因')
    const row = rejectRow.value
    row.status = 2
    row.audit_time = nowStr()
    row.audit_reason = rejectReason.value.trim()
    ElMessage.success('已驳回，用户可重新提交业主认证')
    showReject.value = false
}

onMounted(getLists)
</script>
