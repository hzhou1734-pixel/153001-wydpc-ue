<script setup lang="ts" name="communityCertify">
import { getCertifyList } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'

const searchParams = reactive({
    keyword: '',
    status: ''
})

const { pager, getLists, resetPage } = usePaging({
    fetchFun: getCertifyList,
    params: searchParams,
    firstLoading: true
})

const handleSearch = () => resetPage()
const handleReset = () => {
    searchParams.keyword = ''
    searchParams.status = ''
    resetPage()
}

// 审核操作
const handleAudit = (row: any, pass: boolean) => {
    ElMessageBox.confirm(
        `确认${pass ? '通过' : '拒绝'}用户「${row.nickname}」（${row.community} ${row.building}${row.unit}${row.room}）的业主认证申请吗？`,
        '审核确认',
        { type: 'warning' }
    )
        .then(() => {
            row.status = pass ? 1 : 2
            ElMessage.success(pass ? '已通过认证' : '已拒绝认证')
        })
        .catch(() => {})
}

const viewDetail = (row: any) => {
    ElMessageBox.alert(
        `申请人：${row.nickname}（${row.mobile}）<br/>小区：${row.community}<br/>房屋：${row.building}${row.unit}${row.room}<br/>申请时间：${row.create_time}`,
        '认证详情',
        { dangerouslyUseHTMLString: true }
    )
}

onMounted(getLists)
</script>

<template>
    <div class="community-certify" v-loading="pager.loading">
        <el-card class="!border-none" shadow="never">
            <template #header><span class="card-title">住户认证审核</span></template>
            <!-- 搜索栏 -->
            <div class="flex flex-wrap items-center gap-3 mb-4">
                <el-input v-model="searchParams.keyword" placeholder="姓名/手机号" clearable class="!w-48" @keyup.enter="handleSearch" />
                <el-select v-model="searchParams.status" placeholder="审核状态" clearable class="!w-32">
                    <el-option label="待审核" :value="0" />
                    <el-option label="已通过" :value="1" />
                    <el-option label="已拒绝" :value="2" />
                </el-select>
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="handleReset">重置</el-button>
            </div>
            <!-- 表格 -->
            <el-table :data="pager.lists" border>
                <el-table-column prop="id" label="ID" width="60" />
                <el-table-column prop="nickname" label="申请人" min-width="90" />
                <el-table-column prop="mobile" label="手机号" width="130" />
                <el-table-column prop="community" label="小区" min-width="130" />
                <el-table-column label="房屋" min-width="140">
                    <template #default="{ row }">{{ row.building }}{{ row.unit }}{{ row.room }}</template>
                </el-table-column>
                <el-table-column label="状态" width="90">
                    <template #default="{ row }">
                        <el-tag :type="row.status === 0 ? 'warning' : row.status === 1 ? 'success' : 'danger'" size="small">
                            {{ row.status === 0 ? '待审核' : row.status === 1 ? '已通过' : '已拒绝' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="申请时间" width="160" />
                <el-table-column label="操作" width="200" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" size="small" @click="viewDetail(row)">详情</el-button>
                        <template v-if="row.status === 0">
                            <el-button link type="success" size="small" @click="handleAudit(row, true)">通过</el-button>
                            <el-button link type="danger" size="small" @click="handleAudit(row, false)">拒绝</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination
                    v-model:current-page="pager.page"
                    v-model:page-size="pager.size"
                    :total="pager.count"
                    layout="total, prev, pager, next, jumper"
                    @current-change="getLists"
                />
            </div>
        </el-card>
    </div>
</template>
