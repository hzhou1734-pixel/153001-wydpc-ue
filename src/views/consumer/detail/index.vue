<template>
    <div class="consumer-detail">
        <el-card class="!border-none" shadow="never">
            <div class="flex items-center justify-between">
                <div class="flex items-center">
                    <el-button @click="$router.back()">
                        <el-icon class="mr-1"><ArrowLeft /></el-icon>返回
                    </el-button>
                    <span class="ml-4 text-base font-medium">用户详情</span>
                </div>
                <el-tag :type="detail.status ? 'success' : 'danger'" effect="light" size="large">
                    {{ detail.status ? '账号正常' : '账号已禁用' }}
                </el-tag>
            </div>
        </el-card>

        <el-card class="!border-none mt-4" shadow="never" v-loading="loading">
            <el-tabs v-model="activeTab">
                <!-- 基础信息 -->
                <el-tab-pane label="基础信息" name="base">
                    <el-descriptions :column="3" border>
                        <el-descriptions-item label="用户ID">{{ detail.id }}</el-descriptions-item>
                        <el-descriptions-item label="头像">
                            <el-avatar :src="detail.avatar" :size="56" />
                        </el-descriptions-item>
                        <el-descriptions-item label="昵称">{{ detail.nickname }}</el-descriptions-item>
                        <el-descriptions-item label="手机号码">{{ detail.mobile }}</el-descriptions-item>
                        <el-descriptions-item label="账号状态">
                            <el-tag :type="detail.status ? 'success' : 'danger'" effect="light">
                                {{ detail.status ? '正常' : '已禁用' }}
                            </el-tag>
                            <span class="text-tx-secondary text-xs ml-2">（物业后台仅查看，无法修改）</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="订单总数量">{{ userOrders.length }} 单</el-descriptions-item>
                        <el-descriptions-item label="消费总金额">¥{{ consumeTotal }}</el-descriptions-item>
                        <el-descriptions-item label="所属小区">{{ detail.community || '-' }}</el-descriptions-item>
                        <el-descriptions-item label="房屋信息">{{ detail.room || '-' }}</el-descriptions-item>
                        <el-descriptions-item label="注册时间">{{ detail.create_time }}</el-descriptions-item>
                    </el-descriptions>
                </el-tab-pane>

                <!-- 订单信息 -->
                <el-tab-pane :label="`订单信息（${userOrders.length}）`" name="orders">
                    <el-table :data="userOrders">
                        <el-table-column label="订单编号" prop="sn" min-width="170" />
                        <el-table-column label="订单类型" prop="type_name" min-width="100" />
                        <el-table-column label="标题" prop="title" min-width="180" show-overflow-tooltip />
                        <el-table-column label="消费金额" min-width="110" align="right">
                            <template #default="{ row }">¥{{ row.amount }}</template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="提交时间" min-width="170" />
                        <el-table-column label="订单状态" min-width="100">
                            <template #default="{ row }">
                                <el-tag :type="orderStatusMap[row.status]?.type" effect="light">
                                    {{ orderStatusMap[row.status]?.label }}
                                </el-tag>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-empty v-if="!userOrders.length" description="暂无订单记录" />
                </el-tab-pane>

                <!-- 顾好家币 -->
                <el-tab-pane label="顾好家币" name="coin">
                    <div class="flex gap-4 mb-4">
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">账户余额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ coin.balance || '0.00' }}</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">累计充值</div>
                            <div class="text-2xl font-bold mt-1">¥{{ coin.total_recharge || '0.00' }}</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">累计消费</div>
                            <div class="text-2xl font-bold mt-1">¥{{ coin.total_consume || '0.00' }}</div>
                        </el-card>
                    </div>
                    <el-table :data="userCoinLogs">
                        <el-table-column prop="id" label="流水ID" min-width="80" />
                        <el-table-column label="类型" min-width="90">
                            <template #default="{ row }">
                                <el-tag :type="coinTypeMap[row.type]?.type" size="small">{{ coinTypeMap[row.type]?.label }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额" min-width="110" align="right">
                            <template #default="{ row }">
                                <span :class="Number(row.amount) >= 0 ? 'text-red-500' : 'text-green-600'">
                                    {{ Number(row.amount) >= 0 ? '+' : '' }}{{ row.amount }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="说明" min-width="240" show-overflow-tooltip />
                        <el-table-column prop="create_time" label="时间" min-width="170" />
                    </el-table>
                    <el-empty v-if="!userCoinLogs.length" description="暂无账户明细记录" />
                </el-tab-pane>

                <!-- 结算信息 -->
                <el-tab-pane :label="`结算信息（${userSettles.length}）`" name="settle">
                    <div class="flex gap-4 mb-4">
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">待结算金额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ unsettledTotal }}</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">已结算金额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ settledTotal }}</div>
                        </el-card>
                    </div>
                    <el-table :data="userSettles">
                        <el-table-column prop="settle_sn" label="结算单号" min-width="170" />
                        <el-table-column prop="order_type" label="服务类型" min-width="110" />
                        <el-table-column label="结算金额" min-width="120" align="right">
                            <template #default="{ row }">¥{{ row.amount }}</template>
                        </el-table-column>
                        <el-table-column label="结算状态" min-width="100">
                            <template #default="{ row }">
                                <el-tag :type="settleStatusMap[row.status]?.type" size="small">{{ settleStatusMap[row.status]?.label }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="结算时间" min-width="170">
                            <template #default="{ row }">{{ row.settle_time || '-' }}</template>
                        </el-table-column>
                        <el-table-column label="操作" width="90" fixed="right">
                            <template #default="{ row }">
                                <el-button link type="primary" @click="openSettleDetail(row)">明细</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-empty v-if="!userSettles.length" description="暂无结算记录" />
                </el-tab-pane>

                <!-- 健康手环 -->
                <el-tab-pane :label="`健康手环（${userBands.length}）`" name="band">
                    <el-table :data="userBands" class="mb-4">
                        <el-table-column prop="band_sn" label="设备编号" min-width="160" />
                        <el-table-column prop="nickname" label="绑定人" min-width="110" />
                        <el-table-column prop="bind_time" label="绑定时间" min-width="170" />
                        <el-table-column label="状态" min-width="90">
                            <template #default="{ row }">
                                <el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? '在线' : '离线' }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="电量" min-width="90" align="center">
                            <template #default="{ row }">{{ row.battery }}%</template>
                        </el-table-column>
                        <el-table-column label="心率" min-width="90" align="center">
                            <template #default="{ row }">{{ row.heart_rate || '-' }}</template>
                        </el-table-column>
                        <el-table-column label="步数" min-width="100" align="center">
                            <template #default="{ row }">{{ row.steps || '-' }}</template>
                        </el-table-column>
                        <el-table-column label="睡眠" min-width="120">
                            <template #default="{ row }">{{ row.sleep || '-' }}</template>
                        </el-table-column>
                        <el-table-column prop="last_sync" label="最近同步" min-width="160" />
                    </el-table>
                    <div class="font-bold mb-2">检测数据</div>
                    <el-table :data="userHealthData">
                        <el-table-column prop="type" label="检测项" min-width="110" />
                        <el-table-column prop="value" label="检测值" min-width="160" />
                        <el-table-column label="结果" min-width="100">
                            <template #default="{ row }">
                                <el-tag :type="row.level === '正常' || row.level === '良好' || row.level === '达标' ? 'success' : 'warning'" size="small">
                                    {{ row.level }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="test_time" label="检测时间" min-width="170" />
                    </el-table>
                    <el-empty v-if="!userBands.length && !userHealthData.length" description="暂无绑定手环与健康数据" />
                </el-tab-pane>

                <!-- 报名记录 -->
                <el-tab-pane :label="`报名记录（${userSignups.length}）`" name="signup">
                    <el-table :data="userSignups">
                        <el-table-column label="活动标题" min-width="240" show-overflow-tooltip>
                            <template #default="{ row }">{{ activityTitle(row.activity_id) }}</template>
                        </el-table-column>
                        <el-table-column label="活动时间" min-width="200">
                            <template #default="{ row }">{{ activityTime(row.activity_id) }}</template>
                        </el-table-column>
                        <el-table-column prop="signup_time" label="报名时间" min-width="170" />
                        <el-table-column label="报名人数" min-width="100" align="center">
                            <template #default="{ row }">{{ row.signup_count }} 人</template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" min-width="160" show-overflow-tooltip />
                    </el-table>
                    <el-empty v-if="!userSignups.length" description="暂无报名记录" />
                </el-tab-pane>
            </el-tabs>
        </el-card>

        <!-- 月度结算明细 -->
        <el-dialog v-model="showSettleDetail" :title="`${currentSettle.settle_sn || ''} 结算明细`" width="760px">
            <el-table :data="settleDetailRows">
                <el-table-column prop="sn" label="订单编号" min-width="170" />
                <el-table-column prop="type" label="订单类型" min-width="100" />
                <el-table-column prop="title" label="服务标题" min-width="200" show-overflow-tooltip />
                <el-table-column label="金额" min-width="110" align="right">
                    <template #default="{ row }">¥{{ row.amount }}</template>
                </el-table-column>
                <el-table-column label="订单状态" min-width="100">
                    <template #default="{ row }">
                        <el-tag :type="orderStatusMap[row.status]?.type" size="small">{{ orderStatusMap[row.status]?.label }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="提交时间" min-width="170" />
            </el-table>
            <el-empty v-if="!settleDetailRows.length" description="该月份暂无结算明细" />
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="consumerDetail">
import { ArrowLeft } from '@element-plus/icons-vue'
import { activityList, activitySignupList, consumerList, escortOrders, healthBandList, mealOrders, nursingOrders, userSettleList } from '@/mock/data'
import { coinAccounts, coinLogs, healthData, settleDetails } from '@/mock/data_user'

const route = useRoute()
const userId = Number(route.query.id)
const loading = ref(false)
const activeTab = ref('base')
const detail = ref<any>({})

const getDetail = () => {
    loading.value = true
    detail.value = consumerList.find((item: any) => item.id === userId) || {}
    loading.value = false
}

const userName = computed(() => detail.value.nickname || '')

/** 订单信息：托管 / 报餐 / 陪诊 */
const userOrders = computed(() => {
    const name = userName.value
    if (!name) return []
    return [
        ...nursingOrders.filter((item: any) => item.nickname === name).map((item: any) => ({ ...item, type_name: '托管订单', title: item.service })),
        ...mealOrders.filter((item: any) => item.nickname === name).map((item: any) => ({ ...item, type_name: '报餐订单', title: item.combo })),
        ...escortOrders.filter((item: any) => item.nickname === name).map((item: any) => ({ ...item, type_name: '陪诊订单', title: item.service })),
    ]
})
const consumeTotal = computed(() =>
    userOrders.value
        .filter((item: any) => item.pay_status === 1 && item.status !== 4)
        .reduce((total: number, item: any) => total + Number(item.amount || 0), 0)
        .toFixed(2)
)

/** 顾好家币 */
const coin = computed(() => coinAccounts[userId] || {})
const userCoinLogs = computed(() => coinLogs.filter((item: any) => item.user_id === userId))
const coinTypeMap: Record<number, any> = {
    1: { label: '充值', type: 'success' },
    2: { label: '消费', type: 'warning' },
    3: { label: '退款', type: 'primary' },
    4: { label: '赠送', type: 'info' },
}

/** 结算信息 */
const userSettles = computed(() => userSettleList.filter((item: any) => item.user_id === userId))
const unsettledTotal = computed(() =>
    userSettles.value.filter((item: any) => item.status !== 2).reduce((t: number, i: any) => t + Number(i.amount || 0), 0).toFixed(2)
)
const settledTotal = computed(() =>
    userSettles.value.filter((item: any) => item.status === 2).reduce((t: number, i: any) => t + Number(i.amount || 0), 0).toFixed(2)
)
const settleStatusMap: Record<number, any> = {
    0: { label: '待确认', type: 'warning' },
    1: { label: '结算中', type: 'primary' },
    2: { label: '已结算', type: 'success' },
}
const showSettleDetail = ref(false)
const currentSettle = ref<any>({})
const settleDetailRows = computed(() => settleDetails[String(currentSettle.value.id)] || [])
const openSettleDetail = (row: any) => {
    currentSettle.value = row
    showSettleDetail.value = true
}

/** 健康手环 */
const userBands = computed(() => healthBandList.filter((item: any) => item.user_id === userId))
const userHealthData = computed(() => healthData[userId] || [])

/** 报名记录 */
const userSignups = computed(() => activitySignupList.filter((item: any) => item.nickname === userName.value))
const activityTitle = (id: number) => (activityList.find((item: any) => item.id === id) as any)?.title || '-'
const activityTime = (id: number) => (activityList.find((item: any) => item.id === id) as any)?.activity_time || '-'

const orderStatusMap: Record<number, any> = {
    0: { label: '待支付', type: 'warning' },
    1: { label: '待派单', type: 'warning' },
    2: { label: '服务中', type: 'primary' },
    3: { label: '已完成', type: 'success' },
    4: { label: '已取消', type: 'info' },
}

onMounted(getDetail)
</script>
