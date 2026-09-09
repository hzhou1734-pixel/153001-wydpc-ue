<template>
    <div class="finance-flow">
        <el-card class="!border-none" shadow="never">
            <el-form :model="queryParams" inline class="mb--4">
                <el-form-item label="订单类型">
                    <el-select v-model="queryParams.order_type" placeholder="全部" clearable class="!w-[130px]">
                        <el-option label="托管服务" :value="1" />
                        <el-option label="膳食服务" :value="2" />
                        <el-option label="陪诊服务" :value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-select v-model="queryParams.pay_type" placeholder="全部" clearable class="!w-[130px]">
                        <el-option label="微信支付" value="微信支付" />
                        <el-option label="支付宝" value="支付宝" />
                    </el-select>
                </el-form-item>
                <el-form-item label="提交时间">
                    <el-date-picker
                        v-model="submitRange"
                        type="daterange"
                        value-format="YYYY-MM-DD"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        class="!w-[240px]"
                    />
                </el-form-item>
                <el-form-item label="支付时间">
                    <el-date-picker
                        v-model="payRange"
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
                        placeholder="订单流水号/服务名称/昵称/手机号"
                        clearable
                        class="!w-[280px]"
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParamsHandler">重置</el-button>
                    <el-button type="success" @click="handleExport">流水导出</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="!border-none mt-4" shadow="never" v-loading="pager.loading">
            <el-table :data="pager.lists" stripe>
                <el-table-column prop="sn" label="订单流水号" min-width="170" show-overflow-tooltip />
                <el-table-column label="订单类型" width="110">
                    <template #default="{ row }">
                        <el-tag size="small" :type="orderTypeTag(row.order_type)">{{ row.order_type_name }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="service" label="服务名称" min-width="180" show-overflow-tooltip />
                <el-table-column label="支付用户" min-width="160">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="32" :src="row.avatar" />
                            <span class="ml-2">{{ row.nickname }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码" min-width="130" />
                <el-table-column label="订单金额" width="120" align="right">
                    <template #default="{ row }">¥{{ row.order_amount }}</template>
                </el-table-column>
                <el-table-column label="支付金额" width="120" align="right">
                    <template #default="{ row }">
                        <span class="text-green-600 font-medium">¥{{ row.pay_amount }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="提交时间" min-width="170" />
                <el-table-column prop="pay_time" label="支付时间" min-width="170" />
                <el-table-column prop="pay_type" label="支付方式" width="110" show-overflow-tooltip />
            </el-table>
            <div class="flex justify-end mt-4">
                <el-pagination
                    v-model:current-page="pager.page"
                    v-model:page-size="pager.size"
                    :page-sizes="[10, 15, 20, 50]"
                    :total="pager.count"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="getLists"
                    @size-change="resetPage"
                />
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="financeFlow">
import { getFinanceFlow, getFinanceFlowAll } from '@/mock/api'
import { usePaging } from '@/hooks/usePaging'
import { exportCsv } from '@/utils/export'

const queryParams = reactive({
    keyword: '',
    order_type: '',
    pay_type: '',
    start_time: '',
    end_time: '',
    pay_start: '',
    pay_end: ''
})

const submitRange = ref<any[]>([])
const payRange = ref<any[]>([])

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getFinanceFlow,
    params: queryParams,
    firstLoading: true
})

const buildParams = () => ({
    ...queryParams,
    start_time: submitRange.value?.[0] || '',
    end_time: submitRange.value?.[1] || '',
    pay_start: payRange.value?.[0] || '',
    pay_end: payRange.value?.[1] || ''
})

watch([submitRange, payRange], () => {
    Object.assign(queryParams, {
        start_time: submitRange.value?.[0] || '',
        end_time: submitRange.value?.[1] || '',
        pay_start: payRange.value?.[0] || '',
        pay_end: payRange.value?.[1] || ''
    })
    resetPage()
})

watch(
    () => [queryParams.order_type, queryParams.pay_type],
    () => resetPage()
)

const resetParamsHandler = () => {
    Object.assign(queryParams, {
        keyword: '',
        order_type: '',
        pay_type: '',
        start_time: '',
        end_time: '',
        pay_start: '',
        pay_end: ''
    })
    submitRange.value = []
    payRange.value = []
    resetPage()
}

const orderTypeTag = (type: number) => (type === 1 ? 'success' : type === 2 ? 'warning' : 'primary')

const handleExport = async () => {
    const rows: any[] = await getFinanceFlowAll(buildParams())
    exportCsv(`订单流水_${new Date().toLocaleDateString('zh-CN')}`, [
        { label: '订单流水号', prop: 'sn' },
        { label: '订单类型', prop: 'order_type_name' },
        { label: '服务名称', prop: 'service' },
        { label: '支付用户昵称', prop: 'nickname' },
        { label: '手机号码', prop: 'mobile' },
        { label: '订单金额', prop: 'order_amount' },
        { label: '支付金额', prop: 'pay_amount' },
        { label: '提交时间', prop: 'create_time' },
        { label: '支付时间', prop: 'pay_time' },
        { label: '支付方式', prop: 'pay_type' }
    ], rows)
}

onMounted(getLists)
</script>
