<template>
    <div>
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
                <!-- 板块一：基础信息 -->
                <el-tab-pane label="基础信息" name="base">
                    <div class="flex items-center mb-6 p-4 rounded-lg bg-[#f7f8fa]">
                        <el-avatar :src="detail.avatar" :size="72" />
                        <div class="ml-4">
                            <div class="text-lg font-medium">{{ detail.nickname }}</div>
                            <div class="text-sm text-tx-secondary mt-1">{{ detail.mobile }}</div>
                        </div>
                        <el-tag class="ml-4" :type="detail.certified ? 'success' : 'info'" effect="light">
                            {{ detail.certified ? '业主已认证' : '未认证' }}
                        </el-tag>
                    </div>
                    <el-descriptions :column="2" border>
                        <el-descriptions-item label="用户ID">{{ detail.id }}</el-descriptions-item>
                        <el-descriptions-item label="用户昵称">{{ detail.nickname }}</el-descriptions-item>
                        <el-descriptions-item label="手机号码">{{ detail.mobile }}</el-descriptions-item>
                        <el-descriptions-item label="性别">{{ detail.gender || '未设置' }}</el-descriptions-item>
                        <el-descriptions-item label="所属小区">{{ detail.community }}</el-descriptions-item>
                        <el-descriptions-item label="房屋信息">{{ detail.room || '—' }}</el-descriptions-item>
                        <el-descriptions-item label="服务订单">{{ detail.orders }} 单</el-descriptions-item>
                        <el-descriptions-item label="未结算金额">¥{{ detail.unsettled_amount || '0.00' }}</el-descriptions-item>
                        <el-descriptions-item label="已结算金额">¥{{ detail.settled_amount || '0.00' }}</el-descriptions-item>
                        <el-descriptions-item label="账号状态">
                            <el-tag :type="detail.status ? 'success' : 'danger'" effect="light">
                                {{ detail.status ? '正常' : '已禁用' }}
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item label="注册时间">{{ detail.create_time }}</el-descriptions-item>
                    </el-descriptions>
                </el-tab-pane>

                <!-- 板块二：订单信息 -->
                <el-tab-pane :label="`订单信息（${userOrders.length}）`" name="orders">
                    <el-table :data="userOrders" size="large">
                        <el-table-column label="订单号" prop="sn" min-width="170" />
                        <el-table-column label="订单类型" prop="type_name" min-width="110" />
                        <el-table-column label="服务内容" prop="service" min-width="160" show-overflow-tooltip />
                        <el-table-column label="金额" min-width="110" align="right">
                            <template #default="{ row }">¥{{ row.amount }}</template>
                        </el-table-column>
                        <el-table-column label="状态" min-width="100">
                            <template #default="{ row }">
                                <el-tag :type="orderStatusMap[row.status]?.type" effect="light">
                                    {{ orderStatusMap[row.status]?.label }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="下单时间" prop="create_time" min-width="170" />
                    </el-table>
                    <el-empty v-if="!userOrders.length" description="暂无订单记录" />
                </el-tab-pane>

                <!-- 板块三：结算信息 -->
                <el-tab-pane :label="`结算信息（${userSettles.length}）`" name="settle">
                    <el-table :data="userSettles" size="large">
                        <el-table-column label="结算单号" prop="settle_sn" min-width="160" />
                        <el-table-column label="订单类型" prop="order_type" min-width="110" />
                        <el-table-column label="结算金额" min-width="110" align="right">
                            <template #default="{ row }">¥{{ row.amount }}</template>
                        </el-table-column>
                        <el-table-column label="结算状态" min-width="110">
                            <template #default="{ row }">
                                <el-tag :type="settleStatusMap[row.status]?.type" effect="light">
                                    {{ settleStatusMap[row.status]?.label }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="结算时间" min-width="170">
                            <template #default="{ row }">{{ row.settle_time || '—' }}</template>
                        </el-table-column>
                        <el-table-column label="创建时间" prop="create_time" min-width="170" />
                        <el-table-column label="备注" prop="remark" min-width="150" show-overflow-tooltip />
                    </el-table>
                    <el-empty v-if="!userSettles.length" description="暂无结算记录" />
                </el-tab-pane>

                <!-- 板块四：帖子发布 -->
                <el-tab-pane :label="`帖子发布（${userPosts.length}）`" name="posts">
                    <el-table :data="userPosts" size="large">
                        <el-table-column label="帖子标题" prop="title" min-width="220" show-overflow-tooltip />
                        <el-table-column label="浏览量" prop="views" min-width="90" align="center" />
                        <el-table-column label="回复数" prop="replies" min-width="90" align="center" />
                        <el-table-column label="状态" min-width="100">
                            <template #default="{ row }">
                                <el-tag :type="row.status ? 'success' : 'danger'" effect="light">
                                    {{ row.status ? '已发布' : '已下架' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="发布时间" prop="create_time" min-width="170" />
                    </el-table>
                    <el-empty v-if="!userPosts.length" description="暂无帖子记录" />
                </el-tab-pane>

                <!-- 板块五：资源大厅 -->
                <el-tab-pane :label="`资源大厅（${userResources.length}）`" name="resource">
                    <el-table :data="userResources" size="large">
                        <el-table-column label="封面" width="110">
                            <template #default="{ row }">
                                <el-image :src="row.cover" :preview-src-list="[row.cover]" fit="cover" class="w-[80px] h-[54px] rounded" preview-teleported />
                            </template>
                        </el-table-column>
                        <el-table-column label="标题" prop="title" min-width="220" show-overflow-tooltip />
                        <el-table-column label="分类" prop="category" min-width="110" />
                        <el-table-column label="价格" min-width="100" align="right">
                            <template #default="{ row }">{{ row.price === '面议' ? '面议' : `¥${row.price}` }}</template>
                        </el-table-column>
                        <el-table-column label="浏览量" prop="views" min-width="90" align="center" />
                        <el-table-column label="状态" min-width="100">
                            <template #default="{ row }">
                                <el-tag :type="row.status ? 'success' : 'info'" effect="light">
                                    {{ row.status ? '展示中' : '已下架' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="发布时间" prop="create_time" min-width="170" />
                    </el-table>
                    <el-empty v-if="!userResources.length" description="暂无资源发布记录" />
                </el-tab-pane>

                <!-- 板块六：健康手环 -->
                <el-tab-pane :label="`健康手环（${userBands.length}）`" name="band">
                    <el-table :data="userBands" size="large">
                        <el-table-column label="设备编号" prop="band_sn" min-width="160" />
                        <el-table-column label="绑定时间" prop="bind_time" min-width="170" />
                        <el-table-column label="电量" min-width="90" align="center">
                            <template #default="{ row }">
                                <span :class="row.battery < 20 ? 'text-[#f56c6c] font-medium' : ''">{{ row.battery }}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="心率" min-width="90" align="center">
                            <template #default="{ row }">{{ row.heart_rate ? `${row.heart_rate} 次/分` : '—' }}</template>
                        </el-table-column>
                        <el-table-column label="今日步数" prop="steps" min-width="100" align="center" />
                        <el-table-column label="昨日睡眠" prop="sleep" min-width="110" align="center" />
                        <el-table-column label="最后同步" prop="last_sync" min-width="170" />
                        <el-table-column label="状态" min-width="100">
                            <template #default="{ row }">
                                <el-tag :type="row.status ? 'success' : 'danger'" effect="light">
                                    {{ row.status ? '在线' : '离线' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="备注" prop="note" min-width="150" show-overflow-tooltip />
                    </el-table>
                    <el-empty v-if="!userBands.length" description="暂无绑定手环" />
                </el-tab-pane>

                <!-- 板块七：报名记录 -->
                <el-tab-pane :label="`报名记录（${userSignups.length}）`" name="signup">
                    <el-table :data="userSignups" size="large">
                        <el-table-column label="活动名称" prop="activity_name" min-width="180" show-overflow-tooltip />
                        <el-table-column label="活动状态" min-width="100">
                            <template #default="{ row }">
                                <el-tag :type="row.activity_status === 1 ? 'success' : 'info'" effect="light">
                                    {{ row.activity_status === 1 ? '进行中/已上线' : '未开始/已结束' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="报名人数" min-width="100" align="center">
                            <template #default="{ row }">{{ row.signup_count }} 人</template>
                        </el-table-column>
                        <el-table-column label="房屋信息" prop="room" min-width="140" />
                        <el-table-column label="报名备注" prop="remark" min-width="150" show-overflow-tooltip>
                            <template #default="{ row }">{{ row.remark || '—' }}</template>
                        </el-table-column>
                        <el-table-column label="报名时间" prop="signup_time" min-width="170" />
                    </el-table>
                    <el-empty v-if="!userSignups.length" description="暂无活动报名记录" />
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script lang="ts" setup name="consumerDetail">
import { ArrowLeft } from '@element-plus/icons-vue'
import { getConsumerDetail } from '@/mock/api'
import {
    consumerList,
    nursingOrders,
    mealOrders,
    escortOrders,
    userSettleList,
    barList,
    resourceList,
    healthBandList,
    activitySignupList,
    activityList,
} from '@/mock/data'
import { useRoute } from 'vue-router'

const route = useRoute()
const userId = Number(route.query.id)

const loading = ref(false)
const detail = ref<any>({})
const activeTab = ref('base')

// 状态映射
const orderStatusMap: Record<number, any> = {
    0: { label: '待接单', type: 'warning' },
    1: { label: '服务中', type: 'primary' },
    2: { label: '已完成', type: 'success' },
    3: { label: '已取消', type: 'info' },
}
const settleStatusMap: Record<number, any> = {
    0: { label: '待确认', type: 'warning' },
    1: { label: '结算中', type: 'primary' },
    2: { label: '已结算', type: 'success' },
}

// 用户名（各数据集按姓名字符串关联）
const userName = computed(() => consumerList.find((item) => item.id === userId)?.nickname || '')

// ===== 各板块数据（前端过滤） =====
// 订单信息：三类订单按用户名过滤后合并
const userOrders = computed(() => {
    if (!userName.value) return []
    const all = [
        ...nursingOrders.filter((item: any) => item.nickname === userName.value).map((item: any) => ({ ...item, type_name: '托管服务' })),
        ...mealOrders.filter((item: any) => item.nickname === userName.value).map((item: any) => ({ ...item, type_name: '膳食服务', service: `${item.combo} ×${item.quantity}` })),
        ...escortOrders.filter((item: any) => item.nickname === userName.value).map((item: any) => ({ ...item, type_name: '陪诊服务' })),
    ]
    return all.sort((a: any, b: any) => (a.create_time < b.create_time ? 1 : -1))
})

// 结算信息：按 user_id 过滤
const userSettles = computed(() => userSettleList.filter((item) => item.user_id === userId))

// 帖子发布：按作者昵称过滤
const userPosts = computed(() => barList.filter((item) => item.author === userName.value))

// 资源大厅：按 user_id 过滤
const userResources = computed(() => resourceList.filter((item) => item.user_id === userId))

// 健康手环：按 user_id 过滤
const userBands = computed(() => healthBandList.filter((item) => item.user_id === userId))

// 报名记录：按昵称过滤，关联活动名称与状态
const userSignups = computed(() =>
    activitySignupList
        .filter((item) => item.nickname === userName.value)
        .map((item) => {
            const activity: any = activityList.find((a: any) => a.id === item.activity_id) || {}
            return { ...item, activity_name: activity.title || `活动 #${item.activity_id}`, activity_status: activity.status }
        })
)

const getDetail = async () => {
    loading.value = true
    try {
        const res: any = await getConsumerDetail({ id: userId })
        detail.value = res.list || res || {}
    } finally {
        loading.value = false
    }
}

getDetail()
</script>
