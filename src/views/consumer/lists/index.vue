<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-form class="mb-[-16px]" :model="queryParams" :inline="true">
                <el-form-item class="w-[280px]" label="关键词">
                    <el-input
                        v-model="queryParams.keyword"
                        placeholder="用户ID / 昵称 / 手机号码"
                        clearable
                        @keyup.enter="resetPage"
                    />
                </el-form-item>
                <el-form-item label="账号状态">
                    <el-select v-model="queryParams.status" class="w-[140px]" clearable placeholder="全部状态">
                        <el-option label="正常" :value="1" />
                        <el-option label="已禁用" :value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPage">查询</el-button>
                    <el-button @click="resetParams">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="!border-none mt-4" shadow="never">
            <template #header><span class="card-title">用户列表</span></template>
            <el-table size="large" v-loading="pager.loading" :data="pager.lists">
                <el-table-column label="用户ID" prop="id" width="80" show-overflow-tooltip />
                <el-table-column label="头像" width="86">
                    <template #default="{ row }">
                        <el-avatar :src="row.avatar" :size="44" />
                    </template>
                </el-table-column>
                <el-table-column label="昵称" prop="nickname" min-width="110" />
                <el-table-column label="手机号码" prop="mobile" width="120" />
                <el-table-column label="顾好家币" min-width="110" align="right">
                    <template #default="{ row }">¥{{ coinBalance(row.id) }}</template>
                </el-table-column>
                <el-table-column label="已完成订单总金额" min-width="150" align="right">
                    <template #default="{ row }">¥{{ completedAmount(row.mobile) }}</template>
                </el-table-column>
                <el-table-column label="账号状态" width="90">
                    <template #default="{ row }">
                        <el-tag :type="row.status ? 'success' : 'danger'" effect="light">
                            {{ row.status ? '正常' : '已禁用' }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="90" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" link>
                            <router-link
                                :to="{
                                    path: getRoutePath('consumer.lists/detail'),
                                    query: { id: row.id }
                                }"
                            >
                                详情
                            </router-link>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="flex justify-end mt-4">
                <pagination v-model="pager" @change="getLists" />
            </div>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="consumerLists">
import { getConsumerList } from '@/mock/api'
import { escortOrders, mealOrders, nursingOrders } from '@/mock/data'
import { coinAccounts } from '@/mock/data_user'
import { usePaging } from '@/hooks/usePaging'
import { getRoutePath } from '@/router'

/** 顾好家币余额（取自顾好家币账户） */
const coinBalance = (id: number) => coinAccounts[id]?.balance || '0.00'

/** 已完成订单总金额：三类订单中已完成（status=3）且已支付订单金额合计，实时统计 */
const completedAmount = (mobile: string) => {
    const all = [...nursingOrders, ...mealOrders, ...escortOrders] as any[]
    const total = all
        .filter((o: any) => o.mobile === mobile && o.status === 3 && o.pay_status === 1)
        .reduce((s, o: any) => s + (Number(o.amount) || 0), 0)
    return total.toFixed(2)
}

const queryParams = reactive({
    keyword: '',
    status: '',
})

const { pager, getLists, resetPage, resetParams } = usePaging({
    fetchFun: getConsumerList,
    params: queryParams,
})

onActivated(() => {
    getLists()
})

getLists()
</script>
