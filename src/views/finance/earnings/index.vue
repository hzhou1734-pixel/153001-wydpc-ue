<template>
    <div class="finance-earnings">
        <el-card class="!border-none" shadow="never">
            <el-alert
                class="mb-4"
                type="info"
                :closable="false"
                show-icon
                title="说明"
                :description="`所有的收益由收益配置的金额及完成的订单自动计算：托管收益 = 已完成托管趟次 × 托管接送单价（受单次最低 / 最高收益限制），配送收益 = 已完成配送趟次 × 膳食配送单价，陪诊收益 = 已完成陪诊趟次 × 陪诊接送单价。`"
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
                <el-table-column label="员工名称" min-width="160">
                    <template #default="{ row }">
                        <div class="flex items-center">
                            <el-avatar :size="32" :src="row.avatar" />
                            <span class="ml-2">{{ row.name }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号" width="120" />
                <el-table-column label="角色" min-width="110">
                    <template #default="{ row }">
                        <el-tag size="small" :type="roleTag(row.role_id)">{{ row.role }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="单次收益总金额" min-width="140" align="right">
                    <template #default="{ row }">
                        <span class="text-green-600 font-medium">¥{{ row.total_income }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="陪诊收益" min-width="120" align="right">
                    <template #default="{ row }">¥{{ row.escort_income }}</template>
                </el-table-column>
                <el-table-column label="配送收益" min-width="120" align="right">
                    <template #default="{ row }">¥{{ row.delivery_income }}</template>
                </el-table-column>
                <el-table-column label="托管收益" min-width="120" align="right">
                    <template #default="{ row }">¥{{ row.nursing_income }}</template>
                </el-table-column>
                <el-table-column prop="create_time" label="添加时间" width="160" />
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

/** 单次托管收益：取托管接送单价，并限制在单次最低 / 最高收益金额之间 */
const nursingUnit = computed(() => {
    const price = Number(profitConfig.nursing_price) || 0
    const min = Number(profitConfig.nursing_min) || 0
    const max = Number(profitConfig.nursing_max) || Number.MAX_SAFE_INTEGER
    return Math.min(Math.max(price, min), max)
})

/** 员工收益列表：由收益配置金额 × 已完成订单趟次自动计算 */
const earningLists = computed(() =>
    staffEarningRows.map((item: any) => {
        const nursing_income = item.nursing_count * nursingUnit.value
        const delivery_income = item.delivery_count * (Number(profitConfig.meal_price) || 0)
        const escort_income = item.escort_count * (Number(profitConfig.escort_price) || 0)
        return {
            ...item,
            nursing_income: money(nursing_income),
            delivery_income: money(delivery_income),
            escort_income: money(escort_income),
            total_income: money(nursing_income + delivery_income + escort_income)
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
    { label: '托管员', value: 1 },
    { label: '配送员', value: 2 },
    { label: '陪诊员', value: 3 },
    { label: '楼栋管理员', value: 4 }
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
    roleId === 1 ? 'success' : roleId === 2 ? 'warning' : roleId === 3 ? 'primary' : 'info'

/** 收益导出：导出当前筛选结果下的全部数据 */
const handleExport = async () => {
    const res: any = await getEarningLists({ ...queryParams, page_no: 1, page_size: 9999 })
    exportCsv(
        `员工收益_${new Date().toLocaleDateString('zh-CN')}`,
        [
            { label: '员工名称', prop: 'name' },
            { label: '手机号', prop: 'mobile' },
            { label: '角色', prop: 'role' },
            { label: '单次收益总金额', prop: 'total_income' },
            { label: '陪诊收益', prop: 'escort_income' },
            { label: '配送收益', prop: 'delivery_income' },
            { label: '托管收益', prop: 'nursing_income' },
            { label: '添加时间', prop: 'create_time' }
        ],
        res.lists
    )
}

onMounted(getLists)
</script>
