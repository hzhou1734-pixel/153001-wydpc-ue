<template>
    <div class="finance-bill">
        <el-card class="!border-none" shadow="never">
            <el-alert
                class="mb-4"
                type="info"
                :closable="false"
                show-icon
                title="账单规则"
                description="每个用户如果在上月有过托管单、膳食单，则自动生成一条账单；账单预付金额、退还金额为其下所有托管单、膳食单的合计。"
            />
            <el-form :model="queryParams" inline class="mb--4">
                <el-form-item label="结算时间">
                    <el-date-picker
                        v-model="settleRange"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="!w-[240px]"
                    />
                </el-form-item>
                <el-form-item>
                    <el-input
                        v-model="queryParams.keyword"
                        placeholder="用户昵称/手机号码"
                        clearable
                        class="!w-[240px]"
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParamsHandler">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="!border-none mt-4" shadow="never" v-loading="pager.loading">
            <template #header>
                <span class="card-title">账单结算</span>
            </template>
            <el-table :data="pager.lists" stripe>
                <el-table-column prop="title" label="账单标题" min-width="200" show-overflow-tooltip />
                <el-table-column label="所属用户" min-width="180">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="32" :src="row.avatar" />
                            <span class="ml-2">{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" min-width="120" />
                <el-table-column label="预付金额" min-width="120" align="right">
                    <template #default="{ row }">
                        <span class="font-medium">¥{{ row.prepay_amount }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="退还金额" min-width="120" align="right">
                    <template #default="{ row }">
                        <span class="text-red-500 font-medium">¥{{ row.refund_amount }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="settle_time" label="结算时间" min-width="170">
                    <template #default="{ row }">{{ row.settle_time || '-' }}</template>
                </el-table-column>
                <el-table-column label="操作" width="90" fixed="right">
                    <template #default="{ row }">
                        <el-button link type="primary" @click="openDetail(row)">账单详情</el-button>
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

        <!-- 账单详情 -->
        <el-dialog v-model="detailState.show" title="账单详情" width="900px" top="5vh">
            <el-descriptions :column="2" border class="mb-4">
                <el-descriptions-item label="账单标题">{{ detailState.row.title }}</el-descriptions-item>
                <el-descriptions-item label="结算时间">{{ detailState.row.settle_time || '-' }}</el-descriptions-item>
                <el-descriptions-item label="所属用户">
                    {{ detailState.row.nickname }}（{{ detailState.row.mobile }}）
                </el-descriptions-item>
                <el-descriptions-item label="账单明细数">
                    {{ detailState.row.items?.length || 0 }} 条
                </el-descriptions-item>
                <el-descriptions-item label="账单预付金额">
                    <span class="font-medium">¥{{ detailState.row.prepay_amount }}</span>
                </el-descriptions-item>
                <el-descriptions-item label="账单退还金额">
                    <span class="text-red-500 font-medium">¥{{ detailState.row.refund_amount }}</span>
                </el-descriptions-item>
            </el-descriptions>

            <div class="section-title">账单明细</div>
            <el-table :data="detailState.row.items || []" border stripe size="small">
                <el-table-column label="订单类型" min-width="100">
                    <template #default="{ row }">
                        <el-tag size="small" :type="row.type === '托管' ? 'success' : 'warning'">
                            {{ row.type }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="sn" label="订单编号" min-width="160" show-overflow-tooltip />
                <el-table-column prop="service" label="服务名称" min-width="200" show-overflow-tooltip />
                <el-table-column label="预付金额" min-width="120" align="right">
                    <template #default="{ row }">¥{{ row.prepay_amount }}</template>
                </el-table-column>
                <el-table-column label="退还金额" min-width="120" align="right">
                    <template #default="{ row }">¥{{ row.refund_amount }}</template>
                </el-table-column>
                <el-table-column prop="create_time" label="下单时间" min-width="170" />
            </el-table>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="financeBill">
import { billList } from '@/mock/data_finance'
import { usePaging } from '@/hooks/usePaging'

const queryParams = reactive({ keyword: '', start_time: '', end_time: '' })
const settleRange = ref<any[]>([])

/** 账单列表：用户昵称 / 手机号搜索，结算时间筛选 */
const getBillLists = (params: Record<string, any>) => {
    const { page_no, page_size, keyword, start_time, end_time } = params
    let lists: any[] = billList as any[]
    if (keyword) {
        const kw = String(keyword).trim().toLowerCase()
        lists = lists.filter(
            (item: any) =>
                String(item.nickname).toLowerCase().includes(kw) || String(item.mobile).includes(kw)
        )
    }
    if (start_time) lists = lists.filter((item: any) => String(item.settle_time).slice(0, 10) >= start_time)
    if (end_time) lists = lists.filter((item: any) => String(item.settle_time).slice(0, 10) <= end_time)
    return Promise.resolve({
        count: lists.length,
        lists: lists.slice((page_no - 1) * page_size, page_no * page_size)
    })
}

const { pager, getLists, resetPage } = usePaging({
    fetchFun: getBillLists,
    params: queryParams,
    firstLoading: true
})

watch(settleRange, () => {
    queryParams.start_time = settleRange.value?.[0] || ''
    queryParams.end_time = settleRange.value?.[1] || ''
    resetPage()
})

const resetParamsHandler = () => {
    Object.assign(queryParams, { keyword: '', start_time: '', end_time: '' })
    settleRange.value = []
    resetPage()
}

/** 账单详情：账单预付金额、退还金额及其下每一条托管单、膳食单明细 */
const detailState = reactive({ show: false, row: {} as any })
const openDetail = (row: any) => {
    detailState.row = row
    detailState.show = true
}

onMounted(getLists)
</script>

<style lang="scss" scoped>
.section-title {
    @apply text-base font-medium mb-2 pl-2 border-l-4 border-primary;
}
</style>
