<script setup lang="ts" name="communityLists">
/**
 * 小区信息（单小区）
 * 一个物业后台仅管理一个小区，本页为该小区的资料编辑 + 运营数据概览
 * 资料：门头照 / 名称 / 省市区 / 详细地址（可编辑保存）
 * 运营数据：总户数 / 已认证 / 待审核 / 员工总数 + 托管·膳食·陪诊订单总数与金额 + 结算账单总额
 * 明细请前往「小区详情」「楼栋房号」「认证列表」及各订单管理页面
 */
import ImageUpload from '@/components/image-upload/index.vue'
import {
    buildingTree,
    certifyList,
    communityList,
    escortOrders,
    mealOrders,
    nursingOrders,
    roomList,
    staffList
} from '@/mock/data'
import { useRouter } from 'vue-router'

const router = useRouter()

/** 当前物业后台所管理的小区（唯一） */
const community = reactive({ ...communityList[0] })

// 省市区精简数据（模拟）
const regionOptions = [
    {
        value: '浙江省',
        label: '浙江省',
        children: [
            {
                value: '杭州市',
                label: '杭州市',
                children: [
                    { value: '西湖区', label: '西湖区' },
                    { value: '滨江区', label: '滨江区' },
                    { value: '拱墅区', label: '拱墅区' },
                    { value: '余杭区', label: '余杭区' },
                    { value: '萧山区', label: '萧山区' }
                ]
            },
            {
                value: '宁波市',
                label: '宁波市',
                children: [
                    { value: '鄞州区', label: '鄞州区' },
                    { value: '海曙区', label: '海曙区' }
                ]
            }
        ]
    },
    {
        value: '江苏省',
        label: '江苏省',
        children: [
            {
                value: '南京市',
                label: '南京市',
                children: [
                    { value: '玄武区', label: '玄武区' },
                    { value: '鼓楼区', label: '鼓楼区' }
                ]
            },
            {
                value: '苏州市',
                label: '苏州市',
                children: [
                    { value: '姑苏区', label: '姑苏区' },
                    { value: '工业园区', label: '工业园区' }
                ]
            }
        ]
    }
]

/** 编辑表单（资料） */
const editForm = reactive({
    cover: community.cover,
    name: community.name,
    region: [] as string[],
    address: community.address
})

/** 从地址中拆出省市区（仅展示用，编辑时以级联选择为准） */
const regionText = computed(() => {
    const addr = community.address || ''
    const m = addr.match(/(浙江省|江苏省)(.+?区|.+?市)/)
    return m ? [m[1], m[2]].join(' / ') : '—'
})

const showEdit = ref(false)
const openEdit = () => {
    editForm.cover = community.cover
    editForm.name = community.name
    editForm.region = []
    editForm.address = community.address
    showEdit.value = true
}

const submitEdit = () => {
    if (!editForm.name) return ElMessage.warning('请输入小区名称')
    if (!editForm.address) return ElMessage.warning('请输入详细位置')
    Object.assign(community, {
        cover: editForm.cover,
        name: editForm.name,
        address: editForm.region.length ? editForm.region.join('') + editForm.address : editForm.address
    })
    // 同步回 mock 数据源
    Object.assign(communityList[0], community)
    ElMessage.success('保存成功')
    showEdit.value = false
}

// ==================== 运营数据（实时统计） ====================
const cid = community.id
const buildingIds = buildingTree.filter((b: any) => b.community_id === cid).map((b: any) => b.id)
const rooms = roomList.filter((r: any) => buildingIds.includes(r.building_id))
const staffs = staffList.filter((s: any) => s.community === community.name)
const certifies = certifyList.filter((c: any) => c.community === community.name)

/** 金额求和 */
const sum = (list: any[]) => list.reduce((s, i) => s + (Number(i.amount) || 0), 0)
const money = (v: number) => `¥${Number(v || 0).toFixed(2)}`

/** 单类订单统计：总数 / 有效金额 / 未结算 / 已结算 / 取消数 / 取消金额 */
const buildOrderStat = (orders: any[]) => {
    const valid = orders.filter((o: any) => o.pay_status === 1 && o.status !== 4)
    const unpaid = orders.filter((o: any) => o.pay_status !== 1)
    const settled = valid.filter((o: any) => o.status === 3)
    const unsettled = valid.filter((o: any) => o.status !== 3)
    const canceled = orders.filter((o: any) => o.status === 4)
    return {
        count: orders.length,
        amount: sum(valid),
        unpaid_count: unpaid.length,
        settled_amount: sum(settled),
        unsettled_amount: sum(unsettled),
        cancel_count: canceled.length,
        cancel_amount: sum(canceled)
    }
}

const nursingOrdersOf = nursingOrders.filter((o: any) => o.community === community.name)
const mealOrdersOf = mealOrders.filter((o: any) => o.community === community.name)
const escortOrdersOf = escortOrders.filter((o: any) => o.community === community.name)

const nursingStat = buildOrderStat(nursingOrdersOf)
const mealStat = buildOrderStat(mealOrdersOf)
const escortStat = buildOrderStat(escortOrdersOf)

/** 概览卡片 */
const overview = computed(() => [
    { label: '楼栋总数', value: `${buildingIds.length} 栋` },
    { label: '总户数', value: `${rooms.length} 套` },
    { label: '已认证户数', value: `${rooms.filter((r: any) => r.certified === 1).length} 户` },
    { label: '待审核认证', value: `${certifies.filter((c: any) => c.status === 0).length} 条` },
    { label: '员工总数', value: `${staffs.length} 人` }
])

interface BizStat {
    name: string
    count: number
    amount: number
    unsettled: number
    settled: number
    cancelCount: number
    cancelAmount: number
}
const bizRows = computed<BizStat[]>(() => [
    { name: '托管业务', ...nursingStat },
    { name: '膳食业务', ...mealStat },
    { name: '陪诊业务', ...escortStat }
])
const bizTotal = computed(() => ({
    count: bizRows.value.reduce((s, r) => s + r.count, 0),
    amount: bizRows.value.reduce((s, r) => s + r.amount, 0),
    unsettled: bizRows.value.reduce((s, r) => s + r.unsettled, 0),
    settled: bizRows.value.reduce((s, r) => s + r.settled, 0),
    cancelCount: bizRows.value.reduce((s, r) => s + r.cancelCount, 0),
    cancelAmount: bizRows.value.reduce((s, r) => s + r.cancelAmount, 0)
}))

const goDetail = () => router.push({ path: '/community/detail', query: { id: community.id } })
</script>

<template>
    <div class="community-lists">
        <!-- 小区资料 -->
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">小区资料</span>
                    <el-button type="primary" @click="openEdit">
                        <icon name="el-icon-Edit" :size="14" class="mr-1" />
                        编辑资料
                    </el-button>
                </div>
            </template>
            <div class="flex flex-wrap gap-6">
                <div class="flex-shrink-0">
                    <el-image
                        v-if="community.cover"
                        :src="community.cover"
                        :preview-src-list="[community.cover]"
                        preview-teleported
                        fit="cover"
                        class="w-[240px] h-[160px] rounded-lg"
                    />
                    <div
                        v-else
                        class="w-[240px] h-[160px] rounded-lg flex items-center justify-center text-sm text-tx-secondary bg-fill-light"
                    >
                        暂无门头照
                    </div>
                </div>
                <div class="flex-1 min-w-[320px]">
                    <div class="grid grid-cols-2 gap-x-8 gap-y-4">
                        <div>
                            <div class="text-xs text-tx-secondary mb-1">小区名称</div>
                            <div class="text-base font-medium">{{ community.name }}</div>
                        </div>
                        <div>
                            <div class="text-xs text-tx-secondary mb-1">省市区</div>
                            <div class="text-base">{{ regionText }}</div>
                        </div>
                        <div class="col-span-2">
                            <div class="text-xs text-tx-secondary mb-1">详细地址</div>
                            <div class="text-base">{{ community.address }}</div>
                        </div>
                        <div>
                            <div class="text-xs text-tx-secondary mb-1">添加时间</div>
                            <div class="text-base">{{ community.create_time }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>

        <!-- 运营数据 -->
        <el-card class="!border-none mt-4" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="card-title">运营数据</span>
                    <el-button link type="primary" @click="goDetail">查看明细</el-button>
                </div>
            </template>
            <el-row :gutter="16">
                <el-col v-for="item in overview" :key="item.label" :span="12" :sm="8" :lg="4" class="mb-4">
                    <div class="p-4 rounded-lg border border-br-light">
                        <div class="text-xs text-tx-secondary mb-1">{{ item.label }}</div>
                        <div class="text-2xl font-medium text-primary">{{ item.value }}</div>
                    </div>
                </el-col>
            </el-row>

            <!-- 各类业务订单统计 -->
            <el-table :data="[...bizRows, { name: '合计', ...bizTotal, isTotal: true }]" border stripe class="mt-2">
                <el-table-column label="业务类型" prop="name" min-width="110" />
                <el-table-column label="订单总数" prop="count" min-width="90" align="center" />
                <el-table-column label="有效总金额" min-width="120" align="right">
                    <template #default="{ row }">
                        <span class="text-success font-medium">¥{{ Number(row.amount).toFixed(2) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="未结算金额" min-width="120" align="right">
                    <template #default="{ row }">¥{{ Number(row.unsettled).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column label="已结算金额" min-width="120" align="right">
                    <template #default="{ row }">¥{{ Number(row.settled).toFixed(2) }}</template>
                </el-table-column>
                <el-table-column label="取消订单" prop="cancelCount" min-width="90" align="center" />
                <el-table-column label="取消金额" min-width="120" align="right">
                    <template #default="{ row }">
                        <span class="text-danger">¥{{ Number(row.cancelAmount).toFixed(2) }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-xs text-tx-secondary mt-2">
                统计口径：有效订单 = 已支付且未取消；未结算 = 有效且未完成；已结算 = 有效且已完成；取消订单 = status 4
            </div>
        </el-card>

        <!-- 编辑资料弹窗 -->
        <el-dialog v-model="showEdit" title="编辑小区资料" width="560px">
            <el-form label-width="90px">
                <el-form-item label="小区门头照">
                    <ImageUpload v-model="editForm.cover" :width="240" :height="160" text="上传门头照" tip="建议尺寸 400×300，支持 jpg/png/webp，5MB 以内" />
                </el-form-item>
                <el-form-item label="小区名称" required>
                    <el-input v-model="editForm.name" placeholder="请输入小区名称" />
                </el-form-item>
                <el-form-item label="省市区">
                    <el-cascader
                        v-model="editForm.region"
                        :options="regionOptions"
                        placeholder="请选择省 / 市 / 区"
                        class="w-full"
                        clearable
                    />
                </el-form-item>
                <el-form-item label="详细位置" required>
                    <el-input v-model="editForm.address" placeholder="请输入小区详细位置" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showEdit = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">保存</el-button>
            </template>
        </el-dialog>
    </div>
</template>
