/**
 * Mock 登录 / 用户信息数据
 * 对照《1530-01-01 顾好家社区服务APP需求细化文档-物业端》
 * menu 为完整 10 板块菜单树，数据台排首位（保证 findFirstValidRoute 命中）
 */

/** 生成模拟 token */
export const mockToken = 'mock-token-ghj-admin-0001'

/** 当前登录管理员 */
const mockUser = {
    id: 1,
    username: 'admin',
    nickname: '物业管理员',
    avatar: 'https://picsum.photos/seed/ghj-avatar/100/100',
    role: '超级管理员',
    mobile: '13800138000',
    property_name: '顾好家物业服务集团有限公司',
    create_time: '2026-01-01 09:00:00',
}

/** 全量权限标识（供 v-perms 使用） */
const mockPermissions = [
    'dashboard.overview/lists',
    'dashboard.business/lists',
    'dashboard.todo/lists',
    'community.lists/lists',
    'community.lists/add',
    'community.lists/edit',
    'community.lists/detail',
    'community.building/lists',
    'community.building/add',
    'community.building/delete',
    'community.certify/lists',
    'community.certify/audit',
    'consumer.lists/lists',
    'consumer.lists/detail',
    'staff.lists/lists',
    'staff.lists/add',
    'staff.lists/edit',
    'staff.lists/delete',
    'service.nursing/lists',
    'service.escort/lists',
    'service.meal/lists',
    'order.nursing/lists',
    'order.meal/lists',
    'order.escort/lists',
    'order.dispatch/dispatch',
    'article.hr/lists',
    'article.bar/lists',
    'article.wonderful/lists',
    'article.notice/lists',
    'article.activity/lists',
    'article.helper/lists',
    'article.banner/lists',
    'finance.overview/lists',
    'finance.flow/lists',
    'finance.bill/lists',
    'finance.earnings/lists',
    'setting.property/detail',
    'setting.role/lists',
    'setting.admin/lists',
]

/**
 * 菜单树
 * type: 'M' 目录 / 'C' 菜单页面 / is_show: 0 隐藏路由（详情页）
 */
const mockMenu = [
    // ============ ① 数据台 ============
    {
        name: '数据台',
        paths: 'dashboard',
        icon: 'local-icon-shuju',
        type: 'M',
        is_show: 1,
        is_cache: 0,
        children: [
            {
                name: '数据总览',
                paths: 'overview',
                component: 'dashboard/overview/index',
                perms: 'dashboard.overview/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '业务总览',
                paths: 'business',
                component: 'dashboard/business/index',
                perms: 'dashboard.business/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '待处理事项',
                paths: 'todo',
                component: 'dashboard/todo/index',
                perms: 'dashboard.todo/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
        ],
    },
    // ============ ② 小区管理 ============
    {
        name: '小区管理',
        paths: 'community',
        icon: 'el-icon-OfficeBuilding',
        type: 'M',
        is_show: 1,
        is_cache: 0,
        children: [
            {
                name: '小区列表',
                paths: 'lists',
                component: 'community/lists/index',
                perms: 'community.lists/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '楼栋房号',
                paths: 'building',
                component: 'community/building/index',
                perms: 'community.building/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '认证列表',
                paths: 'certify',
                component: 'community/certify/index',
                perms: 'community.certify/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '小区详情',
                paths: 'detail',
                component: 'community/detail/index',
                perms: 'community.lists/detail',
                type: 'C',
                is_show: 0,
                is_cache: 0,
            },
        ],
    },
    // ============ ③ 用户管理 ============
    {
        name: '用户管理',
        paths: 'consumer',
        icon: 'el-icon-User',
        type: 'M',
        is_show: 1,
        is_cache: 0,
        children: [
            {
                name: '用户列表',
                paths: 'lists',
                component: 'consumer/lists/index',
                perms: 'consumer.lists/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '用户详情',
                paths: 'detail',
                component: 'consumer/detail/index',
                perms: 'consumer.lists/detail',
                type: 'C',
                is_show: 0,
                is_cache: 0,
            },
        ],
    },
    // ============ ④ 员工列表 ============
    {
        name: '员工管理',
        paths: 'staff',
        icon: 'el-icon-Avatar',
        type: 'M',
        is_show: 1,
        is_cache: 0,
        children: [
            {
                name: '员工列表',
                paths: 'lists',
                component: 'staff/lists/index',
                perms: 'staff.lists/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
        ],
    },
    // ============ ⑤ 服务管理 ============
    {
        name: '服务管理',
        paths: 'service',
        icon: 'local-icon-fuwushichang',
        type: 'M',
        is_show: 1,
        is_cache: 0,
        children: [
            {
                name: '托管服务',
                paths: 'nursing',
                component: 'service/nursing/index',
                perms: 'service.nursing/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '陪诊服务',
                paths: 'escort',
                component: 'service/escort/index',
                perms: 'service.escort/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '膳食服务',
                paths: 'meal',
                component: 'service/meal/index',
                perms: 'service.meal/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
        ],
    },
    // ============ ⑥ 订单管理 ============
    {
        name: '订单管理',
        paths: 'order',
        icon: 'local-icon-dingdan',
        type: 'M',
        is_show: 1,
        is_cache: 0,
        children: [
            {
                name: '托管订单',
                paths: 'nursing',
                component: 'order/nursing/index',
                perms: 'order.nursing/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '膳食订单',
                paths: 'meal',
                component: 'order/meal/index',
                perms: 'order.meal/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '陪诊订单',
                paths: 'escort',
                component: 'order/escort/index',
                perms: 'order.escort/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
        ],
    },
    // ============ ⑦ 内容管理 ============
    {
        name: '内容管理',
        paths: 'article',
        icon: 'el-icon-Document',
        type: 'M',
        is_show: 1,
        is_cache: 0,
        children: [
            {
                name: '人力资源',
                paths: 'hr',
                component: 'article/hr/index',
                perms: 'article.hr/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '贴吧管理',
                paths: 'bar',
                component: 'article/bar/index',
                perms: 'article.bar/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '精彩内容',
                paths: 'wonderful',
                component: 'article/wonderful/index',
                perms: 'article.wonderful/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '通知公告',
                paths: 'notice',
                component: 'article/notice/index',
                perms: 'article.notice/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '活动管理',
                paths: 'activity',
                component: 'article/activity/index',
                perms: 'article.activity/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '生活帮手',
                paths: 'helper',
                component: 'article/helper/index',
                perms: 'article.helper/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: 'Banner管理',
                paths: 'banner',
                component: 'article/banner/index',
                perms: 'article.banner/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
        ],
    },
    // ============ ⑧ 财务管理 ============
    {
        name: '财务管理',
        paths: 'finance',
        icon: 'local-icon-caiwu',
        type: 'M',
        is_show: 1,
        is_cache: 0,
        children: [
            {
                name: '财务概况',
                paths: 'overview',
                component: 'finance/overview/index',
                perms: 'finance.overview/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '财务流水',
                paths: 'flow',
                component: 'finance/flow/index',
                perms: 'finance.flow/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '账单结算',
                paths: 'bill',
                component: 'finance/bill/index',
                perms: 'finance.bill/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '员工收益',
                paths: 'earnings',
                component: 'finance/earnings/index',
                perms: 'finance.earnings/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
        ],
    },
    // ============ ⑨ 系统设置 ============
    {
        name: '系统设置',
        paths: 'setting',
        icon: 'local-icon-shezhi',
        type: 'M',
        is_show: 1,
        is_cache: 0,
        children: [
            {
                name: '物业信息',
                paths: 'property',
                component: 'setting/property/index',
                perms: 'setting.property/detail',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '角色管理',
                paths: 'role',
                component: 'setting/role/index',
                perms: 'setting.role/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
            {
                name: '管理员管理',
                paths: 'admin',
                component: 'setting/admin/index',
                perms: 'setting.admin/lists',
                type: 'C',
                is_show: 1,
                is_cache: 0,
            },
        ],
    },
]

/** 模拟登录接口返回 */
export function mockLogin(_params?: Record<string, any>) {
    return Promise.resolve({ token: mockToken })
}

/** 模拟退出登录 */
export function mockLogout() {
    return Promise.resolve({})
}

/** 模拟获取用户信息（含菜单与权限） */
export function mockUserInfo() {
    return Promise.resolve({
        user: mockUser,
        permissions: mockPermissions,
        menu: mockMenu,
    })
}
