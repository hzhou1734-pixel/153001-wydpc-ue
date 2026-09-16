<template>
    <div class="dashboard-todo">
        <!-- 今日新增 -->
        <el-card class="!border-none" shadow="never">
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
                        @click="handleClick(item)"
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
                        @click="handleClick(item)"
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

<script setup lang="ts" name="dashboardTodo">
/**
 * 待处理事项
 * 今日新增：陪诊单 / 托管单 / 膳食单 + 售后陪诊单待审核
 * 待审核：业主认证 / 帖子发布 / 资源大厅发布 / 生活帮手
 * 数量全部由 mock 数据实时统计，点击跳转对应列表页（路由不存在时自动兜底）
 */
import { getRoutePath } from '@/router'
import { certifyList, escortOrders, mealOrders, nursingOrders } from '@/mock/data'
import { escortAfterSaleIds, pendingHelpers, pendingPosts, pendingResources } from '@/mock/data_dashboard'

const router = useRouter()

interface TodoItem {
    name: string
    count: number
    /** 目标路由权限串，按顺序取第一个可用的路由 */
    perms: string[]
}

/** 日期补全 */
const pad = (v: number) => String(v).padStart(2, '0')
/** 今天 YYYY-MM-DD */
const todayStr = `${new Date().getFullYear()}-${pad(new Date().getMonth() + 1)}-${pad(new Date().getDate())}`
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
    {
        name: '待审核业主认证',
        count: certifyList.filter((item: any) => item.status === 0).length,
        perms: ['community.certify/lists']
    },
    // 帖子管理页面若被移除，则兜底跳转至人力资源（资源大厅）列表
    { name: '待审核帖子发布', count: pendingPosts.length, perms: ['article.bar/lists', 'article.hr/lists'] },
    { name: '待审核资源大厅发布', count: pendingResources.length, perms: ['article.hr/lists'] },
    { name: '待查看生活帮手', count: pendingHelpers.length, perms: ['service.helper/lists', 'article.helper/lists'] }
]

/** 取第一个可用的路由路径，防止页面删除导致跳转失败 */
const resolvePath = (permsList: string[]) => {
    for (const perms of permsList) {
        const path = getRoutePath(perms)
        if (path) return path
    }
    return ''
}

const handleClick = (item: TodoItem) => {
    const path = resolvePath(item.perms)
    if (!path) {
        ElMessage.warning(`「${item.name}」对应页面暂未开放`)
        return
    }
    router.push(path)
}
</script>
