<template>
    <div>
        <el-card class="!border-none" shadow="never">
            <el-page-header content="用户详情" @back="$router.back()" />
        </el-card>

        <el-card class="mt-4 !border-none" shadow="never">
            <el-tabs v-model="activeTab">
                <el-tab-pane label="基本信息" name="profile">
                    <div class="bg-page flex py-5 mb-8 items-center">
                        <div class="basis-40 flex flex-col justify-center items-center">
                            <div class="mb-2 text-tx-regular">用户头像</div>
                            <el-avatar :src="formData.avatar" :size="58" />
                        </div>
                        <div class="basis-40 flex flex-col justify-center items-center">
                            <div class="text-tx-regular">服务订单</div>
                            <div class="mt-2 text-lg font-medium">{{ formData.orders }} 单</div>
                        </div>
                    </div>
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="用户昵称">{{ formData.nickname || '-' }}</el-descriptions-item>
                        <el-descriptions-item label="手机号码">{{ formData.mobile || '-' }}</el-descriptions-item>
                        <el-descriptions-item label="所属小区">{{ formData.community || '-' }}</el-descriptions-item>
                        <el-descriptions-item label="房屋信息">{{ formData.room || '-' }}</el-descriptions-item>
                        <el-descriptions-item label="业主认证">
                            <el-tag :type="formData.certified ? 'success' : 'info'" effect="light">
                                {{ formData.certified ? '已认证' : '未认证' }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="账户状态">
                            <el-tag :type="formData.status ? 'success' : 'danger'" effect="light">
                                {{ formData.status ? '正常' : '已禁用' }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="注册时间" :span="2">{{ formData.create_time || '-' }}</el-descriptions-item>
                    </el-descriptions>
                </el-tab-pane>

                <el-tab-pane label="资金流水" name="finance">
                    <el-table :data="userFinanceFlows" size="large" empty-text="暂无资金流水">
                        <el-table-column label="流水单号" prop="sn" min-width="180" />
                        <el-table-column label="业务类型" prop="type" min-width="120" />
                        <el-table-column label="关联业务" prop="from" min-width="200" />
                        <el-table-column label="金额" min-width="120" align="right">
                            <template #default="{ row }">
                                <span :class="row.amount.startsWith('+') ? 'text-success' : 'text-error'">¥{{ row.amount }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="支付方式" prop="pay_type" min-width="120" />
                        <el-table-column label="发生时间" prop="create_time" min-width="180" />
                    </el-table>
                </el-tab-pane>

                <el-tab-pane label="服务订单" name="orders">
                    <el-table :data="userOrders" size="large" empty-text="暂无服务订单">
                        <el-table-column label="订单编号" prop="sn" min-width="180" />
                        <el-table-column label="服务类型" prop="orderType" min-width="110" />
                        <el-table-column label="服务项目" prop="service" min-width="180" />
                        <el-table-column label="服务人员" prop="staff" min-width="110" />
                        <el-table-column label="订单金额" min-width="110" align="right">
                            <template #default="{ row }">¥{{ row.amount }}</template>
                        </el-table-column>
                        <el-table-column label="支付状态" min-width="100">
                            <template #default="{ row }">
                                <el-tag :type="row.pay_status ? 'success' : 'warning'" effect="light">
                                    {{ row.pay_status ? '已支付' : '待支付' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="订单状态" min-width="100">
                            <template #default="{ row }">
                                <el-tag :type="orderStatusMap[row.status]?.type || 'info'" effect="light">
                                    {{ orderStatusMap[row.status]?.label || '未知' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="下单时间" prop="create_time" min-width="180" />
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>

    </div>
</template>

<script lang="ts" setup name="consumerDetail">
import { getConsumerDetail } from '@/mock/api'
import { escortOrders, financeFlow, mealOrders, nursingOrders } from '@/mock/data'

const route = useRoute()
const activeTab = ref('profile')
const formData = reactive({
    avatar: '',
    nickname: '',
    mobile: '',
    community: '',
    room: '',
    certified: 0,
    orders: 0,
    status: 1,
    create_time: '',
})
const orderStatusMap: Record<number, { label: string; type: string }> = {
    0: { label: '待接单', type: 'warning' },
    1: { label: '服务中', type: 'primary' },
    2: { label: '已完成', type: 'success' },
    3: { label: '已取消', type: 'info' },
}

const userFinanceFlows = computed(() =>
    financeFlow.filter((item) => item.from.startsWith(`${formData.nickname}-`))
)
const userOrders = computed(() => [
    ...nursingOrders.map((item) => ({ ...item, orderType: '托管服务' })),
    ...mealOrders.map((item) => ({ ...item, orderType: '膳食服务' })),
    ...escortOrders.map((item) => ({ ...item, orderType: '陪诊服务' })),
].filter((item) => item.user === formData.nickname))

const getDetails = async () => {
    const data = await getConsumerDetail({ id: route.query.id })
    Object.assign(formData, data)
}

getDetails()
</script>
