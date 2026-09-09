/**
 * 权限分配目录
 *
 * 说明：
 * 1. 完全依据系统现有功能页面生成，每个菜单只列出该页面【实际存在】的操作。
 * 2. 页面节点本身即「查看」权限（key = `${perms}/lists`），其子节点为操作权限。
 * 3. 若某板块没有某操作（如数据台无新增/编辑），则不会出现对应权限项。
 */

interface PermOp {
    /** 权限动作标识，最终权限为 `${page.perms}/${key}` */
    key: string
    name: string
}

interface PermPage {
    name: string
    perms: string
    ops: PermOp[]
}

interface PermModule {
    name: string
    pages: PermPage[]
}

/** 仅声明操作：避免出现频率高，单独抽出来复用 */
const OP_ADD = (name = '新增') => ({ key: 'add', name })
const OP_EDIT = (name = '编辑') => ({ key: 'edit', name })
const OP_DELETE = (name = '删除') => ({ key: 'delete', name })
const OP_DETAIL = (name = '详情') => ({ key: 'detail', name })
const OP_STATUS = (name = '显示/隐藏') => ({ key: 'status', name })
const OP_AUDIT = (name = '审核') => ({ key: 'audit', name })
const OP_EXPORT = (name = '导出') => ({ key: 'export', name })

/** 无任何操作的页面（纯查看） */
const VIEW_ONLY: PermOp[] = []

export const permModules: PermModule[] = [
    {
        name: '数据台',
        pages: [
            { name: '数据总览', perms: 'dashboard.overview', ops: VIEW_ONLY },
            { name: '业务总览', perms: 'dashboard.business', ops: VIEW_ONLY },
            { name: '待处理事项', perms: 'dashboard.todo', ops: VIEW_ONLY }
        ]
    },
    {
        name: '小区管理',
        pages: [
            {
                name: '小区列表',
                perms: 'community.lists',
                ops: [OP_ADD('新增小区'), OP_EDIT(), OP_DELETE(), OP_STATUS('启用/停用')]
            },
            {
                name: '楼栋房号',
                perms: 'community.building',
                ops: [OP_ADD('新增楼栋/单元/房号'), OP_EDIT(), OP_DELETE()]
            },
            {
                name: '认证列表',
                perms: 'community.certify',
                ops: [OP_DETAIL(), OP_AUDIT('认证审核')]
            },
            { name: '小区详情', perms: 'community.detail', ops: VIEW_ONLY }
        ]
    },
    {
        name: '用户管理',
        pages: [
            { name: '用户列表', perms: 'consumer.lists', ops: [OP_DETAIL()] },
            { name: '用户详情', perms: 'consumer.detail', ops: VIEW_ONLY }
        ]
    },
    {
        name: '员工管理',
        pages: [
            {
                name: '员工列表',
                perms: 'staff.lists',
                ops: [OP_ADD('新增员工'), OP_EDIT(), OP_DELETE()]
            }
        ]
    },
    {
        name: '服务管理',
        pages: [
            {
                name: '托管服务',
                perms: 'service.nursing',
                ops: [OP_ADD('添加托管'), OP_EDIT('编辑托管'), OP_DELETE(), OP_STATUS()]
            },
            {
                name: '陪诊服务',
                perms: 'service.escort',
                ops: [
                    { key: 'setting', name: '单价设置' }
                ]
            },
            {
                name: '膳食服务',
                perms: 'service.meal',
                ops: [
                    { key: 'addDish', name: '新增菜品' },
                    { key: 'addCombo', name: '新增组合' },
                    OP_EDIT(),
                    OP_DELETE(),
                    { key: 'menu', name: '保存当日菜单' },
                    OP_STATUS()
                ]
            }
        ]
    },
    {
        name: '订单管理',
        pages: [
            {
                name: '托管订单',
                perms: 'order.nursing',
                ops: [OP_DETAIL('订单详情'), { key: 'dispatch', name: '托管派单' }]
            },
            {
                name: '膳食订单',
                perms: 'order.meal',
                ops: [OP_DETAIL('订单详情'), { key: 'dispatch', name: '配送派单' }]
            },
            {
                name: '陪诊订单',
                perms: 'order.escort',
                ops: [OP_DETAIL('订单详情'), { key: 'dispatch', name: '陪诊派单' }]
            }
        ]
    },
    {
        name: '内容管理',
        pages: [
            {
                name: '人力资源',
                perms: 'article.hr',
                ops: [
                    OP_DETAIL(),
                    OP_ADD('添加资源'),
                    OP_EDIT(),
                    OP_AUDIT('发布审核'),
                    OP_DELETE(),
                    OP_STATUS()
                ]
            },
            {
                name: '贴吧管理',
                perms: 'article.bar',
                ops: [
                    OP_DETAIL('帖子详情'),
                    OP_AUDIT('帖子审核'),
                    { key: 'comment', name: '帖子评论' },
                    OP_DELETE('删除帖子'),
                    OP_STATUS()
                ]
            },
            {
                name: '精彩内容',
                perms: 'article.wonderful',
                ops: [OP_DETAIL(), OP_ADD('添加内容'), OP_EDIT(), OP_DELETE(), OP_STATUS()]
            },
            {
                name: '通知公告',
                perms: 'article.notice',
                ops: [OP_DETAIL(), OP_ADD('添加通知'), OP_EDIT(), OP_DELETE(), OP_STATUS()]
            },
            {
                name: '活动管理',
                perms: 'article.activity',
                ops: [
                    OP_DETAIL(),
                    OP_ADD('添加活动'),
                    OP_EDIT(),
                    { key: 'stop', name: '停止报名' },
                    { key: 'signup', name: '报名列表' },
                    OP_DELETE(),
                    OP_STATUS()
                ]
            },
            {
                name: '生活帮手',
                perms: 'article.helper',
                ops: [OP_DETAIL(), { key: 'handle', name: '标记已处理' }]
            },
            {
                name: 'Banner管理',
                perms: 'article.banner',
                ops: [OP_ADD('添加Banner图'), OP_EDIT(), OP_DELETE(), OP_STATUS()]
            }
        ]
    },
    {
        name: '财务管理',
        pages: [
            { name: '财务概况', perms: 'finance.overview', ops: VIEW_ONLY },
            { name: '财务流水', perms: 'finance.flow', ops: [OP_EXPORT('流水导出')] },
            {
                name: '账单结算',
                perms: 'finance.bill',
                ops: [
                    OP_DETAIL('账单详情'),
                    OP_EXPORT('账单导出'),
                    { key: 'settle', name: '账单结算' }
                ]
            },
            {
                name: '员工收益',
                perms: 'finance.earnings',
                ops: [OP_ADD('添加收益'), OP_EXPORT('收益导出')]
            }
        ]
    },
    {
        name: '系统设置',
        pages: [
            { name: '物业信息', perms: 'setting.property', ops: [OP_EDIT('编辑信息')] },
            {
                name: '角色管理',
                perms: 'setting.role',
                ops: [OP_ADD('新增角色'), OP_EDIT(), OP_DELETE(), { key: 'auth', name: '分配权限' }]
            },
            {
                name: '管理员管理',
                perms: 'setting.admin',
                ops: [OP_ADD('新增管理员'), OP_EDIT(), OP_DELETE()]
            }
        ]
    }
]

/** 全部权限标识（扁平） */
export const allPermKeys: string[] = permModules.flatMap((m) =>
    m.pages.flatMap((p) => [`${p.perms}/lists`, ...p.ops.map((o) => `${p.perms}/${o.key}`)])
)

/** 权限树节点 */
export interface PermTreeNode {
    key: string
    name: string
    /** 节点类型：module 板块 / page 页面（查看权限） / op 操作权限 */
    type: 'module' | 'page' | 'op'
    perms?: string
    children?: PermTreeNode[]
}

/** 生成权限树（供 el-tree 使用） */
export const permTree: PermTreeNode[] = permModules.map((m, mi) => ({
    key: `module_${mi}`,
    name: m.name,
    type: 'module' as const,
    children: m.pages.map((p) => ({
        key: `${p.perms}/lists`,
        name: p.name,
        type: 'page' as const,
        perms: p.perms,
        children: p.ops.length
            ? p.ops.map((o) => ({
                  key: `${p.perms}/${o.key}`,
                  name: o.name,
                  type: 'op' as const,
                  perms: `${p.perms}/${o.key}`
              }))
            : undefined
    }))
}))

/** 角色已分配的权限（key 为角色 id） */
export const rolePerms: Record<number, string[]> = {
    // 超级管理员：全部权限
    1: [...allPermKeys],
    // 物业经理：小区、用户、员工、服务、订单、内容管理（不含系统设置与财务敏感操作）
    2: [
        'dashboard.overview/lists',
        'dashboard.business/lists',
        'dashboard.todo/lists',
        'community.lists/lists',
        'community.lists/add',
        'community.lists/edit',
        'community.lists/status',
        'community.building/lists',
        'community.building/add',
        'community.building/edit',
        'community.certify/lists',
        'community.certify/detail',
        'community.certify/audit',
        'community.detail/lists',
        'consumer.lists/lists',
        'consumer.lists/detail',
        'consumer.detail/lists',
        'staff.lists/lists',
        'staff.lists/add',
        'staff.lists/edit',
        'service.nursing/lists',
        'service.nursing/add',
        'service.nursing/edit',
        'service.nursing/status',
        'service.escort/lists',
        'service.meal/lists',
        'service.meal/addDish',
        'service.meal/addCombo',
        'service.meal/edit',
        'service.meal/menu',
        'order.nursing/lists',
        'order.nursing/detail',
        'order.nursing/dispatch',
        'order.meal/lists',
        'order.meal/detail',
        'order.meal/dispatch',
        'order.escort/lists',
        'order.escort/detail',
        'order.escort/dispatch',
        'article.hr/lists',
        'article.hr/detail',
        'article.hr/audit',
        'article.hr/status',
        'article.bar/lists',
        'article.bar/detail',
        'article.bar/audit',
        'article.bar/comment',
        'article.bar/status',
        'article.wonderful/lists',
        'article.wonderful/add',
        'article.wonderful/edit',
        'article.wonderful/status',
        'article.notice/lists',
        'article.notice/add',
        'article.notice/edit',
        'article.notice/status',
        'article.activity/lists',
        'article.activity/add',
        'article.activity/edit',
        'article.activity/stop',
        'article.activity/signup',
        'article.activity/status',
        'article.helper/lists',
        'article.helper/detail',
        'article.helper/handle',
        'article.banner/lists',
        'article.banner/add',
        'article.banner/edit',
        'article.banner/status',
        'finance.overview/lists',
        'finance.flow/lists'
    ],
    // 财务专员：财务管理 + 基础查看
    3: [
        'dashboard.overview/lists',
        'dashboard.business/lists',
        'finance.overview/lists',
        'finance.flow/lists',
        'finance.flow/export',
        'finance.bill/lists',
        'finance.bill/detail',
        'finance.bill/export',
        'finance.bill/settle',
        'finance.earnings/lists',
        'finance.earnings/add',
        'finance.earnings/export',
        'order.nursing/lists',
        'order.nursing/detail',
        'order.meal/lists',
        'order.meal/detail',
        'order.escort/lists',
        'order.escort/detail'
    ],
    // 楼栋管理员：托管与配送相关
    4: [
        'dashboard.overview/lists',
        'community.building/lists',
        'consumer.lists/lists',
        'consumer.lists/detail',
        'service.nursing/lists',
        'service.meal/lists',
        'order.nursing/lists',
        'order.nursing/detail',
        'order.nursing/dispatch',
        'order.meal/lists',
        'order.meal/detail',
        'order.meal/dispatch',
        'article.helper/lists',
        'article.helper/detail',
        'article.helper/handle'
    ]
}
