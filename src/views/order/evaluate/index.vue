<template>
    <div class="order-evaluate">
        <el-card class="!border-none" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item class="w-[280px]" label="关键字">
                    <el-input v-model="queryParams.keyword" placeholder="订单编号 / 标题 / 昵称 / 手机号" clearable
                        @keyup.enter="handleQuery" />
                </el-form-item>
                <el-form-item label="评星">
                    <el-select v-model="queryParams.stars" class="w-[130px]" clearable placeholder="全部星级">
                        <el-option v-for="item in starOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="评价时间">
                    <el-date-picker v-model="createRange" type="daterange" value-format="YYYY-MM-DD"
                        range-separator="~" start-placeholder="开始" end-placeholder="结束" class="!w-[240px]" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="!border-none mt-4" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">订单评价</span>
                </div>
            </template>
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column prop="sn" label="订单编号" width="170" show-overflow-tooltip />
                <el-table-column prop="title" label="订单标题" min-width="180" show-overflow-tooltip />
                <el-table-column label="用户" min-width="150">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-image :src="row.avatar" class="w-8 h-8 rounded-full mr-2" />
                            <span>{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" width="120" show-overflow-tooltip />
                <el-table-column label="评星" width="160">
                    <template #default="{ row }">
                        <el-rate :model-value="row.stars" disabled allow-half size="small" />
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="评价时间" width="160" show-overflow-tooltip />
                <el-table-column label="操作" width="90" fixed="right">
                    <template #default="{ row }">
                        <el-button size="small" plain @click="viewDetail(row)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination v-model:current-page="pager.page" v-model:page-size="pager.size" :total="pager.count"
                    layout="total, prev, pager, next" @current-change="getLists" />
            </div>
        </el-card>

        <!-- 详情 -->
        <el-dialog v-model="showDetail" title="评价详情" width="640px">
            <div v-if="detailRow">
                <div class="section-title">评价信息</div>
                <el-descriptions :column="2" border class="mb-4">
                    <el-descriptions-item label="订单编号">{{ detailRow.sn }}</el-descriptions-item>
                    <el-descriptions-item label="订单标题">{{ detailRow.title }}</el-descriptions-item>
                    <el-descriptions-item label="用户">
                        <div class="flex items-center">
                            <el-image :src="detailRow.avatar" class="w-8 h-8 rounded-full mr-2" />
                            <span>{{ detailRow.nickname }}</span>
                        </div>
                    </el-descriptions-item>
                    <el-descriptions-item label="手机号码">{{ detailRow.mobile }}</el-descriptions-item>
                    <el-descriptions-item label="评星">
                        <el-rate :model-value="detailRow.stars" disabled size="small" />
                    </el-descriptions-item>
                    <el-descriptions-item label="评价时间">{{ detailRow.create_time }}</el-descriptions-item>
                    <el-descriptions-item label="评价内容" :span="2">{{ detailRow.content }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="orderEvaluate">
import { orderEvaluations } from '@/mock/data_order'
import { usePaging } from '@/hooks/usePaging'

const starOptions = [
    { label: '5 星', value: 5 },
    { label: '4 星', value: 4 },
    { label: '3 星', value: 3 },
    { label: '2 星', value: 2 },
    { label: '1 星', value: 1 }
]

const queryParams = reactive({
    keyword: '',
    stars: '' as '' | number,
    start_time: '',
    end_time: ''
})
const createRange = ref<string[]>([])

// 本地筛选：列表分页与数据源保持一致
const doFilter = (data: any[], params: Record<string, any> = {}) => {
    let result = data
    if (params.keyword) {
        const kw = String(params.keyword)
        result = result.filter((i: any) =>
            String(i.sn).includes(kw) ||
            String(i.title || '').includes(kw) ||
            String(i.nickname || '').includes(kw) ||
            String(i.mobile || '').includes(kw)
        )
    }
    if (params.stars !== '' && params.stars !== undefined && params.stars !== null) {
        result = result.filter((i: any) => i.stars === Number(params.stars))
    }
    if (params.start_time) {
        result = result.filter((i: any) => String(i.create_time).slice(0, 10) >= params.start_time)
    }
    if (params.end_time) {
        result = result.filter((i: any) => String(i.create_time).slice(0, 10) <= params.end_time)
    }
    return result
}

const getEvaluateList = (params: Record<string, any>) => {
    const { page_no = 1, page_size = 15, ...rest } = params
    const lists = doFilter(orderEvaluations, rest)
    return Promise.resolve({
        count: lists.length,
        lists: lists.slice((page_no - 1) * page_size, page_no * page_size)
    })
}

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getEvaluateList,
    params: queryParams,
    firstLoading: true
})

const handleQuery = () => {
    queryParams.start_time = createRange.value?.[0] || ''
    queryParams.end_time = createRange.value?.[1] || ''
    resetPage()
}
const handleReset = () => {
    createRange.value = []
    queryParams.start_time = ''
    queryParams.end_time = ''
    resetParams()
}

// ---- 详情 ----
const showDetail = ref(false)
const detailRow = ref<any>(null)
const viewDetail = (row: any) => {
    detailRow.value = row
    showDetail.value = true
}

onMounted(getLists)
</script>

<style lang="scss" scoped>
.section-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 10px;
    padding-left: 8px;
    border-left: 3px solid var(--el-color-primary);
}
</style>
