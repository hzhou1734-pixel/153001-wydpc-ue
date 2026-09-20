<template>
    <div class="community-detail" v-loading="loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <el-button link @click="back">
                            <icon name="el-icon-Back" :size="16" class="mr-1" />返回
                        </el-button>
                        <span class="card-title ml-3">小区信息</span>
                    </div>
                </div>
            </template>

            <div class="flex gap-6 mb-6">
                <el-image :src="detail.cover" fit="cover" class="w-64 h-36 rounded-lg shrink-0">
                    <template #error>
                        <div class="w-64 h-36 rounded-lg bg-[#f2f3f5] flex items-center justify-center text-tx-secondary text-xs">暂无门头照</div>
                    </template>
                </el-image>
                <div class="flex-1">
                    <div class="flex items-center gap-3">
                        <span class="text-xl font-bold">{{ detail.name }}</span>
                        <el-tag :type="detail.status === 1 ? 'success' : 'info'" size="small">
                            {{ detail.status === 1 ? '启用' : '已停用' }}
                        </el-tag>
                    </div>
                    <div class="text-tx-secondary text-sm mt-3 flex items-center">
                        <icon name="el-icon-Location" :size="14" class="mr-1" />{{ regionText }} {{ detail.address }}
                    </div>
                    <div class="flex mt-4 gap-8 flex-wrap">
                        <div v-for="stat in tabStats" :key="stat.label" class="flex items-center gap-2">
                            <icon :name="stat.icon" :size="28" :color="stat.color" />
                            <div><div class="font-bold text-lg">{{ stat.value }}</div><div class="text-tx-secondary text-xs">{{ stat.label }}</div></div>
                        </div>
                    </div>
                </div>
            </div>

            <el-tabs v-model="activeTab">
                <!-- 基础信息 -->
                <el-tab-pane label="基础信息" name="info">
                    <el-descriptions :column="3" border>
                        <el-descriptions-item label="小区门头">
                            <el-image v-if="detail.cover" :src="detail.cover" class="w-28 h-20 rounded" :preview-src-list="[detail.cover]" preview-teleported />
                            <span v-else>-</span>
                        </el-descriptions-item>
                        <el-descriptions-item label="小区名称">{{ detail.name }}</el-descriptions-item>
                        <el-descriptions-item label="省市区">{{ regionText }}</el-descriptions-item>
                        <el-descriptions-item label="详细地址">{{ detail.address }}</el-descriptions-item>
                        <el-descriptions-item label="总户数">{{ rooms.length }} 户</el-descriptions-item>
                        <el-descriptions-item label="已认证户数">{{ certifiedRooms }} 户</el-descriptions-item>
                        <el-descriptions-item label="待审核认证">{{ pendingCertify }} 户</el-descriptions-item>
                        <el-descriptions-item label="员工总数">{{ communityStaff.length }} 人</el-descriptions-item>
                        <el-descriptions-item label="托管单总数">{{ communityNursing.length }} 单</el-descriptions-item>
                        <el-descriptions-item label="托管单总金额">¥{{ sum(communityNursing) }}</el-descriptions-item>
                        <el-descriptions-item label="膳食单总数">{{ communityMeal.length }} 单</el-descriptions-item>
                        <el-descriptions-item label="膳食单总金额">¥{{ sum(communityMeal) }}</el-descriptions-item>
                        <el-descriptions-item label="陪诊单总数">{{ communityEscort.length }} 单</el-descriptions-item>
                        <el-descriptions-item label="陪诊单总金额">¥{{ sum(communityEscort) }}</el-descriptions-item>
                        <el-descriptions-item label="未结算账单总金额">¥{{ unsettledBillAmount }}</el-descriptions-item>
                        <el-descriptions-item label="已结算账单总金额">¥{{ settledBillAmount }}</el-descriptions-item>
                    </el-descriptions>
                </el-tab-pane>

                <!-- 员工信息 -->
                <el-tab-pane :label="`员工信息（${communityStaff.length}）`" name="staff">
                    <div class="flex gap-4 mb-3">
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">员工总数</div>
                            <div class="text-2xl font-bold mt-1">{{ communityStaff.length }} 人</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">收益总数</div>
                            <div class="text-2xl font-bold mt-1">¥{{ staffEarningsTotal }}</div>
                        </el-card>
                    </div>
                    <el-table :data="communityStaff" border empty-text="暂无绑定员工">
                        <el-table-column label="头像" min-width="80" align="center">
                            <template #default="{ row }"><el-image :src="row.avatar" class="w-8 h-8 rounded-full" /></template>
                        </el-table-column>
                        <el-table-column prop="name" label="昵称" min-width="110" />
                        <el-table-column prop="role" label="角色" min-width="110" />
                        <el-table-column prop="buildings" label="负责楼栋" min-width="160" show-overflow-tooltip />
                        <el-table-column label="收益总额" min-width="120" align="right">
                            <template #default="{ row }">¥{{ row.earnings }}</template>
                        </el-table-column>
                        <el-table-column label="账号状态" min-width="90">
                            <template #default="{ row }">
                                <el-tag :type="row.status ? 'success' : 'info'" size="small">{{ row.status ? '启用' : '禁用' }}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="添加时间" min-width="170" />
                    </el-table>
                </el-tab-pane>

                <!-- 楼栋房号 -->
                <el-tab-pane :label="`楼栋房号（${buildings.length}）`" name="building">
                    <el-table :data="buildingRooms" border row-key="id" default-expand-all :tree-props="{ children: 'children' }" empty-text="暂无楼栋数据">
                        <el-table-column label="楼栋 / 房号" min-width="160">
                            <template #default="{ row }">
                                <span v-if="row.type === 'building'" class="font-bold">{{ row.name }}</span>
                                <span v-else>房号 {{ row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="认证业主" min-width="220">
                            <template #default="{ row }">
                                <div v-if="row.type === 'room' && row.certified" class="flex items-center">
                                    <el-image :src="row.avatar" class="w-7 h-7 rounded-full mr-2 shrink-0" />
                                    <span>{{ row.owner }}</span>
                                    <span class="text-tx-secondary text-xs ml-2">{{ row.phone }}</span>
                                </div>
                                <el-tag v-else-if="row.type === 'room'" type="info" size="small">暂未认证</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="家庭成员数" min-width="110" align="center">
                            <template #default="{ row }">
                                <span v-if="row.type === 'room' && row.certified">{{ row.family_count }} 人</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="家庭成员信息" min-width="200">
                            <template #default="{ row }">
                                <span v-if="row.type === 'room' && row.certified" class="text-tx-secondary text-xs">{{ row.family_info }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="认证时间" min-width="170">
                            <template #default="{ row }">
                                <span v-if="row.type === 'room'">{{ row.certified ? row.cert_time || '-' : '-' }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 托管单 -->
                <el-tab-pane :label="`托管单（${communityNursing.length}）`" name="nursing">
                    <div class="flex gap-4 mb-3 flex-wrap">
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">托管单总数</div>
                            <div class="text-2xl font-bold mt-1">{{ communityNursing.length }} 单</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">托管单总金额（未结算 + 已结算）</div>
                            <div class="text-2xl font-bold mt-1">¥{{ sum(communityNursing) }}</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">未结算金额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ nursingUnsettled }}</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">已结算金额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ nursingSettled }}</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">取消订单总数</div>
                            <div class="text-2xl font-bold mt-1">{{ cancelCount(communityNursing) }} 单</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">取消订单总金额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ cancelAmount(communityNursing) }}</div>
                        </el-card>
                    </div>
                    <el-table :data="communityNursing" border empty-text="暂无托管单">
                        <el-table-column prop="sn" label="订单编号" min-width="170" />
                        <el-table-column prop="service" label="服务名称" min-width="180" show-overflow-tooltip />
                        <el-table-column label="下单人" min-width="160">
                            <template #default="{ row }">
                                <div class="flex items-center"><el-image :src="row.avatar" class="w-7 h-7 rounded-full mr-2 shrink-0" />{{ row.nickname }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mobile" label="手机号码" min-width="120" />
                        <el-table-column label="金额" min-width="110" align="right"><template #default="{ row }">¥{{ row.amount }}</template></el-table-column>
                        <el-table-column label="订单状态" min-width="100">
                            <template #default="{ row }"><el-tag :type="orderStatusMap[row.status]?.type" size="small">{{ orderStatusMap[row.status]?.label }}</el-tag></template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="下单时间" min-width="170" />
                    </el-table>
                </el-tab-pane>

                <!-- 膳食单 -->
                <el-tab-pane :label="`膳食单（${communityMeal.length}）`" name="meal">
                    <div class="flex gap-4 mb-3 flex-wrap">
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">膳食单总数</div>
                            <div class="text-2xl font-bold mt-1">{{ communityMeal.length }} 单</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">膳食单总金额（未结算 + 已结算）</div>
                            <div class="text-2xl font-bold mt-1">¥{{ sum(communityMeal) }}</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">未结算金额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ mealUnsettled }}</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">已结算金额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ mealSettled }}</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">取消订单总数</div>
                            <div class="text-2xl font-bold mt-1">{{ cancelCount(communityMeal) }} 单</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">取消订单总金额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ cancelAmount(communityMeal) }}</div>
                        </el-card>
                    </div>
                    <el-table :data="communityMeal" border empty-text="暂无膳食单">
                        <el-table-column prop="sn" label="订单编号" min-width="170" />
                        <el-table-column prop="combo" label="套餐组合" min-width="180" show-overflow-tooltip />
                        <el-table-column label="下单人" min-width="160">
                            <template #default="{ row }">
                                <div class="flex items-center"><el-image :src="row.avatar" class="w-7 h-7 rounded-full mr-2 shrink-0" />{{ row.nickname }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mobile" label="手机号码" min-width="120" />
                        <el-table-column label="金额" min-width="110" align="right"><template #default="{ row }">¥{{ row.amount }}</template></el-table-column>
                        <el-table-column label="订单状态" min-width="100">
                            <template #default="{ row }"><el-tag :type="orderStatusMap[row.status]?.type" size="small">{{ orderStatusMap[row.status]?.label }}</el-tag></template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="下单时间" min-width="170" />
                    </el-table>
                </el-tab-pane>

                <!-- 陪诊单 -->
                <el-tab-pane :label="`陪诊单（${communityEscort.length}）`" name="escort">
                    <div class="flex gap-4 mb-3 flex-wrap">
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">陪诊单总数</div>
                            <div class="text-2xl font-bold mt-1">{{ communityEscort.length }} 单</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">陪诊单总金额（待陪诊 + 已完成）</div>
                            <div class="text-2xl font-bold mt-1">¥{{ escortValidAmount }}</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">取消订单总数</div>
                            <div class="text-2xl font-bold mt-1">{{ cancelCount(communityEscort) }} 单</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">取消订单总金额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ cancelAmount(communityEscort) }}</div>
                        </el-card>
                    </div>
                    <el-table :data="communityEscort" border empty-text="暂无陪诊单">
                        <el-table-column prop="sn" label="订单编号" min-width="170" />
                        <el-table-column prop="service" label="陪诊服务" min-width="180" show-overflow-tooltip />
                        <el-table-column label="下单人" min-width="160">
                            <template #default="{ row }">
                                <div class="flex items-center"><el-image :src="row.avatar" class="w-7 h-7 rounded-full mr-2 shrink-0" />{{ row.nickname }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mobile" label="手机号码" min-width="120" />
                        <el-table-column label="金额" min-width="110" align="right"><template #default="{ row }">¥{{ row.amount }}</template></el-table-column>
                        <el-table-column label="订单状态" min-width="100">
                            <template #default="{ row }"><el-tag :type="orderStatusMap[row.status]?.type" size="small">{{ orderStatusMap[row.status]?.label }}</el-tag></template>
                        </el-table-column>
                        <el-table-column prop="create_time" label="下单时间" min-width="170" />
                    </el-table>
                </el-tab-pane>

                <!-- 结算账单 -->
                <el-tab-pane label="结算账单" name="bill">
                    <div class="flex gap-4 mb-3 flex-wrap">
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">未结算账单总金额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ unsettledBillAmount }}</div>
                            <div class="text-tx-secondary text-xs mt-2">托管未结算 ¥{{ nursingUnsettled }} ｜ 膳食未结算 ¥{{ mealUnsettled }}</div>
                        </el-card>
                        <el-card class="!border-none flex-1" shadow="never">
                            <div class="text-tx-secondary text-xs">已结算账单总金额</div>
                            <div class="text-2xl font-bold mt-1">¥{{ settledBillAmount }}</div>
                            <div class="text-tx-secondary text-xs mt-2">托管已结算 ¥{{ nursingSettled }} ｜ 膳食已结算 ¥{{ mealSettled }}</div>
                        </el-card>
                    </div>
                    <el-table :data="userBills" border empty-text="暂无账单记录">
                        <el-table-column label="用户" min-width="160">
                            <template #default="{ row }">
                                <div class="flex items-center"><el-image :src="row.avatar" class="w-7 h-7 rounded-full mr-2 shrink-0" />{{ row.nickname }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mobile" label="手机号码" min-width="120" />
                        <el-table-column label="托管单" min-width="90" align="center"><template #default="{ row }">{{ row.nursing_count }} 单</template></el-table-column>
                        <el-table-column label="托管金额" min-width="110" align="right"><template #default="{ row }">¥{{ row.nursing_amount }}</template></el-table-column>
                        <el-table-column label="膳食单" min-width="90" align="center"><template #default="{ row }">{{ row.meal_count }} 单</template></el-table-column>
                        <el-table-column label="膳食金额" min-width="110" align="right"><template #default="{ row }">¥{{ row.meal_amount }}</template></el-table-column>
                        <el-table-column label="未结算金额" min-width="120" align="right"><template #default="{ row }">¥{{ row.unsettled }}</template></el-table-column>
                        <el-table-column label="已结算金额" min-width="120" align="right"><template #default="{ row }">¥{{ row.settled }}</template></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="communityDetail">
import { buildingTree, certifyList, communityList, escortOrders, mealOrders, nursingOrders, roomList, staffList } from '@/mock/data'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const detail = ref<any>({})
const activeTab = ref('info')

const getInfo = () => {
    loading.value = true
    detail.value = communityList.find((item: any) => String(item.id) === String(route.query.id)) || communityList[0] || {}
    loading.value = false
}

const regionText = computed(() => detail.value.region || '浙江省 杭州市 西湖区')

const buildings = computed(() => (buildingTree as any[]).filter((item: any) => item.community_id === detail.value.id))
const rooms = computed(() => roomList.filter((room: any) => buildings.value.some((b: any) => b.id === room.building_id)))
const certifiedRooms = computed(() => rooms.value.filter((item: any) => item.certified === 1).length)
const pendingCertify = computed(() => certifyList.filter((item: any) => item.community === detail.value.name && item.status === 0).length)
const communityStaff = computed(() => staffList.filter((item: any) => item.community === detail.value.name))
const staffEarningsTotal = computed(() =>
    communityStaff.value.reduce((total: number, item: any) => total + Number(item.earnings || 0), 0).toFixed(2)
)

const communityNursing = computed(() => nursingOrders.filter((item: any) => item.community === detail.value.name))
const communityMeal = computed(() => mealOrders.filter((item: any) => item.community === detail.value.name))
const communityEscort = computed(() => escortOrders.filter((item: any) => item.community === detail.value.name))

/** 金额统计工具 */
const sum = (list: any[]) => list.reduce((t: number, i: any) => t + Number(i.amount || 0), 0).toFixed(2)
const validList = (list: any[]) => list.filter((i: any) => i.pay_status === 1 && i.status !== 4)
const cancelCount = (list: any[]) => list.filter((i: any) => i.status === 4).length
const cancelAmount = (list: any[]) =>
    list.filter((i: any) => i.status === 4).reduce((t: number, i: any) => t + Number(i.amount || 0), 0).toFixed(2)
const settledAmount = (list: any[]) =>
    validList(list).filter((i: any) => i.status === 3).reduce((t: number, i: any) => t + Number(i.amount || 0), 0).toFixed(2)
const unsettledAmount = (list: any[]) =>
    validList(list).filter((i: any) => i.status !== 3).reduce((t: number, i: any) => t + Number(i.amount || 0), 0).toFixed(2)

const escortValidAmount = computed(() =>
    communityEscort.value
        .filter((i: any) => i.pay_status === 1 && [1, 2, 3].includes(i.status))
        .reduce((t: number, i: any) => t + Number(i.amount || 0), 0)
        .toFixed(2)
)
const nursingUnsettled = computed(() => unsettledAmount(communityNursing.value))
const nursingSettled = computed(() => settledAmount(communityNursing.value))
const mealUnsettled = computed(() => unsettledAmount(communityMeal.value))
const mealSettled = computed(() => settledAmount(communityMeal.value))
const unsettledBillAmount = computed(() => (Number(nursingUnsettled.value) + Number(mealUnsettled.value)).toFixed(2))
const settledBillAmount = computed(() => (Number(nursingSettled.value) + Number(mealSettled.value)).toFixed(2))

/** 结算账单：按用户显示明细记录 */
const userBills = computed(() => {
    const map = new Map<string, any>()
    const push = (list: any[], type: 'nursing' | 'meal') => {
        list.forEach((o: any) => {
            if (!map.has(o.mobile)) {
                map.set(o.mobile, {
                    avatar: o.avatar,
                    nickname: o.nickname,
                    mobile: o.mobile,
                    nursing_count: 0,
                    nursing_amount: 0,
                    meal_count: 0,
                    meal_amount: 0,
                    unsettled: 0,
                    settled: 0
                })
            }
            const item = map.get(o.mobile)
            item[`${type}_count`] += 1
            item[`${type}_amount`] += Number(o.amount || 0)
            if (o.pay_status === 1 && o.status !== 4) {
                if (o.status === 3) item.settled += Number(o.amount || 0)
                else item.unsettled += Number(o.amount || 0)
            }
        })
    }
    push(communityNursing.value, 'nursing')
    push(communityMeal.value, 'meal')
    return [...map.values()].map((i: any) => ({
        ...i,
        nursing_amount: i.nursing_amount.toFixed(2),
        meal_amount: i.meal_amount.toFixed(2),
        unsettled: i.unsettled.toFixed(2),
        settled: i.settled.toFixed(2)
    }))
})

/** 楼栋-房号树（含业主认证信息） */
const buildingRooms = computed(() =>
    buildings.value.map((b: any) => ({
        id: `b-${b.id}`,
        type: 'building',
        name: b.name,
        children: roomList
            .filter((r: any) => r.building_id === b.id)
            .map((r: any) => {
                const cert: any = certifyList.find((c: any) => c.mobile === r.phone) || {}
                return {
                    id: `r-${r.id}`,
                    type: 'room',
                    name: r.name,
                    owner: r.owner,
                    phone: r.phone,
                    certified: r.certified,
                    avatar: `https://picsum.photos/seed/ghj-room-${r.id}/100/100`,
                    family_count: r.certified ? cert.family_count || 3 : 0,
                    family_info: r.certified ? `${cert.job || '业主'} · 爱好：${cert.hobby || '-'}` : '',
                    cert_time: r.certified ? cert.audit_time || cert.create_time || '-' : ''
                }
            })
    }))
)

const orderStatusMap: Record<number, any> = {
    0: { label: '待支付', type: 'warning' },
    1: { label: '待派单', type: 'warning' },
    2: { label: '服务中', type: 'primary' },
    3: { label: '已完成', type: 'success' },
    4: { label: '已取消', type: 'info' }
}

const tabStats = computed(() => [
    { label: '楼栋', value: buildings.value.length, icon: 'el-icon-OfficeBuilding', color: '#409eff' },
    { label: '房屋', value: rooms.value.length, icon: 'el-icon-House', color: '#67c23a' },
    { label: '已认证户数', value: certifiedRooms.value, icon: 'el-icon-Postcard', color: '#e6a23c' },
    { label: '员工', value: communityStaff.value.length, icon: 'el-icon-User', color: '#f56c6c' }
])

const back = () => router.back()

onMounted(getInfo)
</script>
