<template>
    <div class="finance-earnings">
        <el-card class="!border-none" shadow="never">
                <el-alert
                class="mb-4"
                type="info"
                :closable="false"
                show-icon
                title="说明"
                :description="`员工收益由收益配置的金额及已完成的订单趟次自动计算，按结算状态拆分展示待结算 / 已结算总收益。`"
            />
            <el-form :model="queryParams" inline class="mb--4">
                <el-form-item label="角色">
                    <el-select v-model="queryParams.role_id" placeholder="全部" clearable class="!w-[150px]">
                        <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item label="添加时间">
                    <el-date-picker
                        v-model="timeRange"
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
                        placeholder="员工名称/手机号码"
                        clearable
                        class="!w-[240px]"
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParamsHandler">重置</el-button>
                    <el-button type="success" @click="handleExport">收益导出</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="!border-none mt-4" shadow="never" v-loading="pager.loading">
            <el-table :data="pager.lists" stripe>
                <el-table-column label="员工名称" min-width="180">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="32" :src="row.avatar" />
                            <span class="ml-2">{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号" min-width="140" show-overflow-tooltip />
                <el-table-column label="角色" min-width="110">
                    <template #default="{ row }">
                        <el-tag size="small" :type="roleTag(row.role_id)">{{ row.role }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="待结算总收益" min-width="150" align="right">
                    <template #default="{ row }">
                        <span class="text-orange-500 font-medium">¥{{ row.pending_income }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="已结算总收益" min-width="150" align="right">
                    <template #default="{ row }">
                        <span class="text-green-600 font-medium">¥{{ row.settled_income }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间" min-width="160" show-overflow-tooltip />
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
    </div>
</template>

<script setup lang="ts" name="financeEarnings">
import { profitConfig, staffEarningRows } from '@/mock/data_finance'
import { usePaging } from '@/hooks/usePaging'
import { exportCsv } from '@/utils/export'

const queryParams = reactive({ keyword: '', role_id: '', start_time: '', end_time: '' })
const timeRange = ref<any[]>([])

const money = (v: number) => Number(v || 0).toFixed(2)

/** 单次托管服务收益：取托管服务单价，并限制在单次最低 / 最高收益金额之间 */
const nursingUnit = computed(() => {
    const price = Number(profitConfig.nursing_price) || 0
    const min = Number(profitConfig.nursing_min) || 0
    const max = Number(profitConfig.nursing_max) || Number.MAX_SAFE_INTEGER
    return Math.min(Math.max(price, min), max)
})

/** 员工收益列表：由收益配置金额 × 已完成订单趟次自动计算，按订单结算状态拆分待结算 / 已结算 */
const earningLists = computed(() =>
    staffEarningRows.map((item: any) => {
        const pending =
            item.nursing_pending * nursingUnit.value +
            item.delivery_pending * (Number(profitConfig.meal_price) || 0) +
            item.escort_pending * (Number(profitConfig.escort_price) || 0)
        const settled =
            item.nursing_done * nursingUnit.value +
            item.delivery_done * (Number(profitConfig.meal_price) || 0) +
            item.escort_done * (Number(profitConfig.escort_price) || 0)
        return {
            ...item,
            pending_income: money(pending),
            settled_income: money(settled)
        }
    })
)

const getEarningLists = (params: Record<string, any>) => {
    const { page_no, page_size, keyword, role_id, start_time, end_time } = params
    let lists: any[] = earningLists.value
    if (keyword) {
        const kw = String(keyword).trim().toLowerCase()
        lists = lists.filter(
            (item: any) =>
                String(item.name).toLowerCase().includes(kw) || String(item.mobile).includes(kw)
        )
    }
    if (role_id !== '' && role_id !== undefined) {
        lists = lists.filter((item: any) => Number(item.role_id) === Number(role_id))
    }
    if (start_time) lists = lists.filter((item: any) => String(item.create_time).slice(0, 10) >= start_time)
    if (end_time) lists = lists.filter((item: any) => String(item.create_time).slice(0, 10) <= end_time)
    return Promise.resolve({
        count: lists.length,
        lists: lists.slice((page_no - 1) * page_size, page_no * page_size)
    })
}

const { pager, getLists, resetPage } = usePaging({
    fetchFun: getEarningLists,
    params: queryParams,
    firstLoading: true
})

const roleOptions = [
    { label: '楼栋管理员', value: 1 },
    { label: '保安', value: 2 },
    { label: '保洁', value: 3 }
]

watch(timeRange, () => {
    queryParams.start_time = timeRange.value?.[0] || ''
    queryParams.end_time = timeRange.value?.[1] || ''
    resetPage()
})
watch(() => queryParams.role_id, () => resetPage())

const resetParamsHandler = () => {
    Object.assign(queryParams, { keyword: '', role_id: '', start_time: '', end_time: '' })
    timeRange.value = []
    resetPage()
}

const roleTag = (roleId: number) =>
    roleId === 1 ? 'primary' : roleId === 2 ? 'success' : 'warning'

/** 收益导出：导出当前筛选结果下的全部数据 */
const handleExport = async () => {
    const res: any = await getEarningLists({ ...queryParams, page_no: 1, page_size: 9999 })
    exportCsv(
        `员工收益_${new Date().toLocaleDateString('zh-CN')}`,
        [
            { label: '员工名称', prop: 'name' },
            { label: '手机号', prop: 'mobile' },
            { label: '角色', prop: 'role' },
            { label: '待结算总收益', prop: 'pending_income' },
            { label: '已结算总收益', prop: 'settled_income' },
            { label: '添加时间', prop: 'create_time' }
        ],
        res.lists
    )
}

onMounted(getLists)
</script>
