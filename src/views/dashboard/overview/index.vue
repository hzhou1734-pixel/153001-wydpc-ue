<template>
    <div class="dashboard-overview">
        <!-- 统计卡片：用户数 / 订单数 / 交易额 / 结算额 -->
        <el-row :gutter="16">
            <el-col v-for="card in cards" :key="card.title" :span="24" :md="12" :xl="6" class="mb-4">
                <el-card class="!border-none" shadow="never">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <span class="font-medium">{{ card.title }}</span>
                            <icon :name="card.icon" :size="18" />
                        </div>
                    </template>
                    <div class="flex">
                        <div v-for="item in card.items" :key="item.label" class="flex-1 text-center">
                            <div class="text-xs text-tx-secondary mb-1">{{ item.label }}</div>
                            <div class="text-2xl font-medium" :class="card.color">{{ item.value }}</div>
                        </div>
                    </div>
                    <div class="mt-3 text-xs text-tx-secondary leading-5">{{ card.tips }}</div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 近 7 日订单趋势 -->
        <el-card class="!border-none" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="font-medium">近 7 日订单趋势</span>
                    <span class="text-xs text-tx-secondary">按订单创建时间统计，合计 {{ trendTotal }} 单</span>
                </div>
            </template>
            <div class="flex items-end pt-4">
                <div v-for="item in trend" :key="item.date" class="flex-1 flex flex-col items-center">
                    <div class="text-xs text-tx-secondary mb-1">{{ item.count }}</div>
                    <div
                        class="w-[36px] rounded-t bg-primary"
                        :style="{ height: (item.count / trendMax) * 110 + 'px' }"
                        :title="`${item.date} 共 ${item.count} 单`"
                    ></div>
                    <div class="text-xs text-tx-secondary mt-2">{{ item.label }}</div>
                </div>
            </div>
        </el-card>

        <!-- 今日新增 -->
        <el-card class="!border-none mt-4" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="font-medium">今日新增</span>
                    <span class="text-xs text-tx-secondary">按订单创建时间统计，点击卡片查看对应订单</span>
                </div>
            </template>
            <el-row :gutter="16">
                <el-col
                    v-for="item in todayGroups"
                    :key="item.name"
                    :span="24"
                    :sm="12"
                    :lg="6"
                    class="mb-4"
                >
                    <div
                        class="flex items-center justify-between p-4 rounded-lg border border-br-light cursor-pointer hover:shadow"
                        @click="handleTodoClick(item)"
                    >
                        <div>
                            <div class="text-xs text-tx-secondary mb-1">{{ item.name }}</div>
                            <div class="text-3xl font-medium" :class="item.count ? 'text-primary' : 'text-tx-secondary'">
                                {{ item.count }}
                            </div>
                        </div>
                        <icon name="el-icon-ArrowRight" :size="20" />
                    </div>
                </el-col>
            </el-row>
        </el-card>

        <!-- 待审核事项 -->
        <el-card class="!border-none mt-4" shadow="never">
            <template #header>
                <div class="flex items-center justify-between">
                    <span class="font-medium">待审核事项</span>
                    <span class="text-xs text-tx-secondary">点击卡片前往对应页面处理</span>
                </div>
            </template>
            <el-row :gutter="16">
                <el-col
                    v-for="item in pendingGroups"
                    :key="item.name"
                    :span="24"
                    :sm="12"
                    :lg="6"
                    class="mb-4"
                >
                    <div
                        class="flex items-center justify-between p-4 rounded-lg border border-br-light cursor-pointer hover:shadow"
                        @click="handleTodoClick(item)"
                    >
                        <div>
                            <div class="text-xs text-tx-secondary mb-1">{{ item.name }}</div>
                            <div class="text-3xl font-medium" :class="item.count ? 'text-warning' : 'text-tx-secondary'">
                                {{ item.count }}
                            </div>
                        </div>
                        <icon name="el-icon-ArrowRight" :size="20" />
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup lang="ts" name="dashboardOverview">
/**
 * 数据总览
 * 用户数：今日 / 本月 / 累计新增用户
 * 订单数：今日 / 本月 / 累计订单
 * 交易额：今日 / 本月 / 累计订单交易额（已支付且未取消）
 * 结算额：今日 / 本月 / 累计结算额（已结算流水）
 * 所有数值均由 mock 数据实时统计，无硬编码
 */
import { getRoutePath } from '@/router'
import { certifyList, consumerList, escortOrders, mealOrders, nursingOrders } from '@/mock/data'
import { escortAfterSaleIds, pendingHelpers, pendingPosts, pendingResources, recentUsers, settleRecords } from '@/mock/data_dashboard'

/** 日期补全 */
const pad = (v: number) => String(v).padStart(2, '0')
/** 当前日期 YYYY-MM-DD */
const todayStr = `${new Date().getFullYear()}-${pad(new Date().getMonth() + 1)}-${pad(new Date().getDate())}`
/** 当前月份 YYYY-MM */
const monthStr = todayStr.slice(0, 7)

/** 是否今天 */
const isToday = (time: string) => String(time || '').slice(0, 10) === todayStr
/** 是否本月 */
const isThisMonth = (time: string) => String(time || '').slice(0, 7) === monthStr

/** 金额求和：兼容 amount 为字符串或数字 */
const sumAmount = (list: any[]) => list.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
/** 金额格式化 */
const money = (value: number) => `¥${Number(value || 0).toFixed(2)}`

// ==================== 用户数 ====================
/** 全部用户：主用户表 + 近期新增用户 */
const allUsers = [...consumerList, ...recentUsers]
const userStat = {
    today: allUsers.filter((item: any) => isToday(item.create_time)).length,
    month: allUsers.filter((item: any) => isThisMonth(item.create_time)).length,
    total: allUsers.length
}

// ==================== 订单数 ====================
/** 全部订单：托管 + 膳食 + 陪诊 */
const allOrders = [
    ...nursingOrders.map((item: any) => ({ ...item, _biz: '托管' })),
    ...mealOrders.map((item: any) => ({ ...item, _biz: '膳食' })),
    ...escortOrders.map((item: any) => ({ ...item, _biz: '陪诊' }))
]
const orderStat = {
    today: allOrders.filter((item: any) => isToday(item.create_time)).length,
    month: allOrders.filter((item: any) => isThisMonth(item.create_time)).length,
    total: allOrders.length
}

// ==================== 交易额 ====================
/** 有效交易订单：已支付且未取消 */
const paidOrders = allOrders.filter((item: any) => item.pay_status === 1 && item.status !== 4)
/** 按创建时间汇总金额 */
const sumByCreateTime = (list: any[], match: (time: string) => boolean) =>
    list.filter((item: any) => match(item.create_time)).reduce((sum, item: any) => sum + (Number(item.amount) || 0), 0)
const tradeStat = {
    today: sumByCreateTime(paidOrders, isToday),
    month: sumByCreateTime(paidOrders, isThisMonth),
    total: sumAmount(paidOrders)
}

// ==================== 结算额 ====================
/** 已结算流水 */
const settledRecords = settleRecords.filter((item: any) => item.status === 1)
/** 按结算时间汇总金额 */
const sumBySettleTime = (match: (time: string) => boolean) =>
    settledRecords.filter((item: any) => match(item.settle_time)).reduce((sum, item: any) => sum + (Number(item.amount) || 0), 0)
const settleStat = {
    today: sumBySettleTime(isToday),
    month: sumBySettleTime(isThisMonth),
    total: sumAmount(settledRecords)
}

interface StatItem {
    label: string
    value: string | number
}
interface StatCard {
    title: string
    icon: string
    color: string
    items: StatItem[]
    tips: string
}

const cards: StatCard[] = [
    {
        title: '用户数',
        icon: 'el-icon-User',
        color: 'text-primary',
        items: [
            { label: '今日新增', value: userStat.today },
            { label: '本月新增', value: userStat.month },
            { label: '累计总数', value: userStat.total }
        ],
        tips: '按用户注册时间统计'
    },
    {
        title: '订单数',
        icon: 'el-icon-Tickets',
        color: 'text-warning',
        items: [
            { label: '今日新增', value: orderStat.today },
            { label: '本月新增', value: orderStat.month },
            { label: '累计总数', value: orderStat.total }
        ],
        tips: '托管 + 膳食 + 陪诊全部订单'
    },
    {
        title: '交易额',
        icon: 'el-icon-Money',
        color: 'text-success',
        items: [
            { label: '今日新增', value: money(tradeStat.today) },
            { label: '本月新增', value: money(tradeStat.month) },
            { label: '累计总额', value: money(tradeStat.total) }
        ],
        tips: '已支付且未取消的有效订单金额'
    },
    {
        title: '结算额',
        icon: 'el-icon-Wallet',
        color: 'text-danger',
        items: [
            { label: '今日结算', value: money(settleStat.today) },
            { label: '本月结算', value: money(settleStat.month) },
            { label: '累计结算', value: money(settleStat.total) }
        ],
        tips: '已结算流水的结算金额，按结算时间统计'
    }
]

// ==================== 近 7 日订单趋势 ====================
const trend = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))
    const dateKey = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    return {
        date: dateKey,
        label: `${date.getMonth() + 1}/${date.getDate()}`,
        count: allOrders.filter((item: any) => String(item.create_time).slice(0, 10) === dateKey).length
    }
})
const trendTotal = trend.reduce((sum, item) => sum + item.count, 0)
/** 柱状图基准值，避免全 0 时高度为 NaN */
const trendMax = Math.max(1, ...trend.map((item) => item.count))

// ==================== 待处理事项 ====================
const router = useRouter()

interface TodoItem {
    name: string
    count: number
    /** 目标路由权限串，按顺序取第一个可用的路由 */
    perms: string[]
}

/** 今日新增订单数量 */
const countToday = (list: any[]) => list.filter((item: any) => String(item.create_time).slice(0, 10) === todayStr).length

const todayGroups: TodoItem[] = [
    { name: '今日新增陪诊单', count: countToday(escortOrders), perms: ['order.escort/lists'] },
    { name: '今日新增托管单', count: countToday(nursingOrders), perms: ['order.nursing/lists'] },
    { name: '今日新增膳食单', count: countToday(mealOrders), perms: ['order.meal/lists'] },
    {
        name: '售后陪诊单待审核',
        count: escortOrders.filter((o: any) => o.status === 3 && escortAfterSaleIds.includes(o.id)).length,
        perms: ['order.escort/lists']
    }
]

const pendingGroups: TodoItem[] = [
    { name: '待审核业主认证', count: certifyList.filter((item: any) => item.status === 0).length, perms: ['community.certify/lists'] },
    { name: '待审核帖子发布', count: pendingPosts.length, perms: ['article.hr/lists'] },
    { name: '待审核资源大厅发布', count: pendingResources.length, perms: ['article.hr/lists'] },
    { name: '待查看生活帮手', count: pendingHelpers.length, perms: ['service.helper/lists'] }
]

/** 取第一个可用的路由路径，防止页面删除导致跳转失败 */
const resolvePath = (permsList: string[]) => {
    for (const perms of permsList) {
        const path = getRoutePath(perms)
        if (path) return path
    }
    return ''
}

const handleTodoClick = (item: TodoItem) => {
    const path = resolvePath(item.perms)
    if (!path) {
        ElMessage.warning(`「${item.name}」对应页面暂未开放`)
        return
    }
    router.push(path)
}
</script>
