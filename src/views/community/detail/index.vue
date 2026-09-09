<script setup lang="ts" name="communityDetail">
import { getCommunityList } from '@/mock/api'
import {
    buildingTree,
    certifyList,
    consumerList,
    escortOrders,
    mealOrders,
    noticeList,
    nursingOrders,
    roomList,
    staffList,
} from '@/mock/data'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const detail = ref<any>({})
const activeTab = ref('info')

const getInfo = async () => {
    loading.value = true
    try {
        const res: any = await getCommunityList({ page_no: 1, page_size: 100 })
        detail.value = res.lists.find((item: any) => String(item.id) === String(route.query.id)) || res.lists[0] || {}
    } finally {
        loading.value = false
    }
}

const buildings = computed(() => buildingTree.filter((item: any) => item.community_id === detail.value.id))
const rooms = computed(() => roomList.filter((room: any) => buildings.value.some((building: any) => building.id === room.building_id)))
const certifiedOwners = computed(() => certifyList.filter((item: any) => item.community === detail.value.name))
const communityUsers = computed(() => consumerList.filter((item: any) => item.community === detail.value.name))
const communityStaff = computed(() => staffList.filter((item: any) => item.community === detail.value.name))
const communityOrders = computed(() => [
    ...nursingOrders.map((item: any) => ({ ...item, type: '托管服务', user: item.nickname })),
    ...mealOrders.map((item: any) => ({ ...item, type: '膳食服务', user: item.nickname, service: `${item.combo} ×${item.quantity}` })),
    ...escortOrders.map((item: any) => ({ ...item, type: '陪诊服务', user: item.nickname })),
].filter((item) => item.community === detail.value.name))
const communityNotices = computed(() => noticeList.filter((item: any) => item.status === 1))

const infoItems = computed(() => [
    { label: '小区名称', value: detail.value.name || '-' },
    { label: '小区地址', value: detail.value.address || '-' },
    { label: '楼栋数', value: `${buildings.value.length} 栋` },
    { label: '房屋数', value: `${rooms.value.length} 套` },
    { label: '已认证住户', value: `${certifiedOwners.value.filter((item: any) => item.status === 1).length} 人` },
    { label: '注册用户', value: `${communityUsers.value.length} 人` },
    { label: '状态', value: detail.value.status === 1 ? '启用' : '已停用' },
    { label: '创建时间', value: detail.value.create_time || '-' },
])

const tabStats = computed(() => [
    { label: '楼栋', value: buildings.value.length, icon: 'el-icon-OfficeBuilding', color: '#409eff' },
    { label: '房屋', value: rooms.value.length, icon: 'el-icon-House', color: '#67c23a' },
    { label: '认证住户', value: certifiedOwners.value.filter((item: any) => item.status === 1).length, icon: 'el-icon-Postcard', color: '#e6a23c' },
    { label: '注册用户', value: communityUsers.value.length, icon: 'el-icon-User', color: '#f56c6c' },
])

const back = () => router.back()

// 楼栋 / 单元维度的房号明细，用于楼栋管理页签直接展示具体数据
const unitRooms = (buildingId: number, unitId: number) =>
    rooms.value.filter((room: any) => room.building_id === buildingId && room.unit_id === unitId)
const buildingRoomCount = (buildingId: number) =>
    rooms.value.filter((room: any) => room.building_id === buildingId).length
const buildingCertifiedCount = (buildingId: number) =>
    rooms.value.filter((room: any) => room.building_id === buildingId && room.certified === 1).length
const buildingUnitNames = (row: any) => (row.children || []).map((unit: any) => unit.name).join('、') || '-'

onMounted(getInfo)
</script>

<template>
    <div class="community-detail" v-loading="loading">
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <el-button link @click="back">
                            <icon name="el-icon-Back" :size="16" class="mr-1" />返回
                        </el-button>
                        <span class="card-title ml-3">小区详情</span>
                    </div>
                </div>
            </template>
            <div class="flex gap-6 mb-6">
                <el-image :src="detail.cover" fit="cover" class="w-64 h-36 rounded-lg shrink-0" />
                <div class="flex-1">
                    <div class="flex items-center gap-3">
                        <span class="text-xl font-bold">{{ detail.name }}</span>
                        <el-tag :type="detail.status === 1 ? 'success' : 'info'" size="small">
                            {{ detail.status === 1 ? '启用' : '已停用' }}
                        </el-tag>
                    </div>
                    <div class="text-tx-secondary text-sm mt-3 flex items-center">
                        <icon name="el-icon-Location" :size="14" class="mr-1" />{{ detail.address }}
                    </div>
                    <div class="flex mt-4 gap-8">
                        <div v-for="stat in tabStats" :key="stat.label" class="flex items-center gap-2">
                            <icon :name="stat.icon" :size="28" :color="stat.color" />
                            <div><div class="font-bold text-lg">{{ stat.value }}</div><div class="text-tx-secondary text-xs">{{ stat.label }}</div></div>
                        </div>
                    </div>
                </div>
            </div>

            <el-tabs v-model="activeTab">
                <el-tab-pane label="基本信息" name="info">
                    <el-descriptions :column="2" border>
                        <el-descriptions-item v-for="item in infoItems" :key="item.label" :label="item.label">{{ item.value }}</el-descriptions-item>
                    </el-descriptions>
                </el-tab-pane>
                <el-tab-pane :label="`楼栋管理（${buildings.length}）`" name="building">
                    <el-table :data="buildings" border row-key="id" empty-text="暂无楼栋数据">
                        <el-table-column type="expand">
                            <template #default="{ row }">
                                <div class="px-4 py-2">
                                    <div v-for="unit in row.children || []" :key="unit.id" class="mb-3">
                                        <div class="flex items-center gap-2 mb-2">
                                            <span class="font-bold text-sm">{{ unit.name }}</span>
                                            <span class="text-tx-secondary text-xs">已登记 {{ unitRooms(row.id, unit.id).length }} 套</span>
                                        </div>
                                        <div v-if="unitRooms(row.id, unit.id).length" class="flex flex-wrap gap-2">
                                            <el-tag
                                                v-for="room in unitRooms(row.id, unit.id)"
                                                :key="room.id"
                                                :type="room.certified ? 'success' : 'info'"
                                                effect="plain"
                                            >
                                                {{ room.name }} · {{ room.owner }} · {{ room.phone }}
                                            </el-tag>
                                        </div>
                                        <span v-else class="text-tx-secondary text-xs">该单元暂无登记房屋</span>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="楼栋名称" prop="name" min-width="120" />
                        <el-table-column label="单元数量" min-width="100"><template #default="{ row }">{{ row.children?.length || 0 }} 个</template></el-table-column>
                        <el-table-column label="单元明细" min-width="160"><template #default="{ row }">{{ buildingUnitNames(row) }}</template></el-table-column>
                        <el-table-column label="登记房屋" min-width="100"><template #default="{ row }">{{ buildingRoomCount(row.id) }} 套</template></el-table-column>
                        <el-table-column label="已认证房屋" min-width="110"><template #default="{ row }">{{ buildingCertifiedCount(row.id) }} 套</template></el-table-column>
                    </el-table>
                    <div class="text-tx-secondary text-xs mt-3">点击行首箭头可展开查看该楼栋各单元的房号、业主姓名与联系电话</div>
                </el-tab-pane>
                <el-tab-pane :label="`房屋信息（${rooms.length}）`" name="room">
                    <el-table :data="rooms" border empty-text="暂无房屋数据">
                        <el-table-column label="楼栋" min-width="110"><template #default="{ row }">{{ buildings.find((item) => item.id === row.building_id)?.name || '-' }}</template></el-table-column>
                        <el-table-column label="单元" min-width="110"><template #default="{ row }">{{ buildings.find((item) => item.id === row.building_id)?.children?.find((unit) => unit.id === row.unit_id)?.name || '-' }}</template></el-table-column>
                        <el-table-column label="房号" prop="name" min-width="100" />
                        <el-table-column label="业主" prop="owner" min-width="110" />
                        <el-table-column label="联系电话" prop="phone" min-width="130" />
                        <el-table-column label="认证状态" min-width="110"><template #default="{ row }"><el-tag :type="row.certified ? 'success' : 'info'">{{ row.certified ? '已认证' : '未认证' }}</el-tag></template></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="`认证住户（${certifiedOwners.length}）`" name="certify">
                    <el-table :data="certifiedOwners" border empty-text="暂无认证住户">
                        <el-table-column label="住户姓名" prop="nickname" min-width="110" />
                        <el-table-column label="手机号码" prop="mobile" min-width="130" />
                        <el-table-column label="身份类型" prop="type" min-width="100" />
                        <el-table-column label="楼栋" prop="building" min-width="100" />
                        <el-table-column label="单元/房号" min-width="140"><template #default="{ row }">{{ row.unit }}/{{ row.room }}</template></el-table-column>
                        <el-table-column label="认证状态" min-width="110"><template #default="{ row }"><el-tag :type="row.status ? 'success' : 'warning'">{{ row.status ? '已通过' : '待审核' }}</el-tag></template></el-table-column>
                        <el-table-column label="提交时间" prop="create_time" min-width="180" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="`绑定员工（${communityStaff.length}）`" name="staff">
                    <el-table :data="communityStaff" border empty-text="暂无绑定员工">
                        <el-table-column label="员工" min-width="150"><template #default="{ row }"><el-avatar :src="row.avatar" :size="32" class="mr-2" />{{ row.name }}</template></el-table-column>
                        <el-table-column label="岗位" prop="role" min-width="120" />
                        <el-table-column label="手机号码" prop="mobile" min-width="130" />
                        <el-table-column label="负责楼栋" prop="buildings" min-width="160" />
                        <el-table-column label="服务订单" min-width="110"><template #default="{ row }">{{ row.orders }} 单</template></el-table-column>
                        <el-table-column label="状态" min-width="100"><template #default="{ row }"><el-tag :type="row.status ? 'success' : 'info'">{{ row.status ? '在职' : '已停用' }}</el-tag></template></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="`服务订单（${communityOrders.length}）`" name="order">
                    <el-table :data="communityOrders" border empty-text="暂无服务订单">
                        <el-table-column label="订单编号" prop="sn" min-width="170" />
                        <el-table-column label="服务类型" prop="type" min-width="110" />
                        <el-table-column label="用户" prop="user" min-width="100" />
                        <el-table-column label="服务项目" prop="service" min-width="180" />
                        <el-table-column label="服务人员" prop="staff" min-width="110" />
                        <el-table-column label="订单金额" min-width="110" align="right"><template #default="{ row }">¥{{ row.amount }}</template></el-table-column>
                        <el-table-column label="支付状态" min-width="100"><template #default="{ row }"><el-tag :type="row.pay_status ? 'success' : 'warning'">{{ row.pay_status ? '已支付' : '待支付' }}</el-tag></template></el-table-column>
                        <el-table-column label="下单时间" prop="create_time" min-width="180" />
                    </el-table>
                </el-tab-pane>
                <el-tab-pane :label="`通知公告（${communityNotices.length}）`" name="notice">
                    <el-table :data="communityNotices" border empty-text="暂无已发布通知">
                        <el-table-column label="公告标题" prop="title" min-width="260" />
                        <el-table-column label="公告类型" prop="type" min-width="120" />
                        <el-table-column label="浏览量" prop="views" min-width="100" />
                        <el-table-column label="发布时间" prop="create_time" min-width="180" />
                        <el-table-column label="发布状态" min-width="110"><template #default><el-tag type="success">已发布</el-tag></template></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
