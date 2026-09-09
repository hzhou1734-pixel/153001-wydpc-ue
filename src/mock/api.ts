/**
 * Mock 业务 API 工具
 * 统一返回 { count, lists, extend } 结构，配合 usePaging
 */
import {
    communityList,
    buildingTree,
    roomList,
    certifyList,
    consumerList,
    staffList,
    nursingServices,
    escortServices,
    escortPriceSetting,
    mealServices,
    mealCombos,
    dailyMenus,
    nursingOrders,
    mealOrders,
    escortOrders,
    hrList,
    barList,
    wonderfulList,
    noticeList,
    activityList,
    activitySignupList,
    helperList,
    barComments,
    bannerList,
    financeFlow,
    financeBill,
    staffEarnings,
    propertyInfo,
    roleList,
    adminList,
    dashboardStats,
    dashboardBusiness,
    dashboardTodo,
} from './data'

/** 通用分页包装 */
function page<T>(lists: T[], params: Record<string, any> = {}) {
    const page_no = Number(params.page_no) || 1
    const page_size = Number(params.page_size) || 20
    const start = (page_no - 1) * page_size
    return Promise.resolve({
        count: lists.length,
        lists: lists.slice(start, start + page_size),
        extend: {},
    })
}

// ============ 数据台 ============
export function getDashboardStats() {
    return Promise.resolve(dashboardStats)
}
export function getDashboardBusiness(_params?: Record<string, any>) {
    return Promise.resolve(dashboardBusiness)
}
export function getDashboardTodo() {
    return Promise.resolve(dashboardTodo)
}

// ============ 小区管理 ============
export function getCommunityList(params?: Record<string, any>) {
    let lists = communityList
    if (params?.keyword) lists = lists.filter((item: any) => item.name.includes(params.keyword))
    if (params?.address) lists = lists.filter((item: any) => item.address.includes(params.address))
    return page(lists, params)
}
export function getBuildingTree() {
    return Promise.resolve(buildingTree)
}
export function getRoomList() {
    return Promise.resolve(roomList)
}
export function getCertifyList(params?: Record<string, any>) {
    return page(certifyList, params)
}

// ============ 用户管理 ============
export function getConsumerList(params?: Record<string, any>) {
    let lists = consumerList
    if (params?.keyword) {
        const keyword = String(params.keyword)
        lists = lists.filter((item: any) =>
            item.nickname.includes(keyword) || item.mobile.includes(keyword) || item.community.includes(keyword)
        )
    }
    if (params?.community) lists = lists.filter((item: any) => item.community === params.community)
    if (params?.status !== '' && params?.status !== undefined) {
        lists = lists.filter((item: any) => item.status === Number(params.status))
    }
    return page(lists, params)
}
export function getConsumerDetail(params?: Record<string, any>) {
    const item = consumerList.find((row: any) => row.id === Number(params?.id))
    return Promise.resolve(item || consumerList[0])
}

// ============ 员工管理 ============
export function getStaffList(params?: Record<string, any>) {
    return page(staffList, params)
}

// ============ 服务管理 ============
export function getNursingServiceList(params?: Record<string, any>) {
    let lists = nursingServices
    if (params?.keyword) {
        lists = lists.filter((item: any) => item.name.includes(String(params.keyword)))
    }
    if (params?.type) lists = lists.filter((item: any) => item.type === params.type)
    if (params?.status !== '' && params?.status !== undefined && params?.status !== null) {
        lists = lists.filter((item: any) => item.status === Number(params.status))
    }
    if (params?.start_time) {
        lists = lists.filter((item: any) => String(item.create_time).slice(0, 10) >= params.start_time)
    }
    if (params?.end_time) {
        lists = lists.filter((item: any) => String(item.create_time).slice(0, 10) <= params.end_time)
    }
    return page(lists, params)
}
export function getEscortServiceList(params?: Record<string, any>) {
    return page(escortServices, params)
}
/** 陪诊服务单价设置（元/小时） */
export function getEscortPriceSetting() {
    return Promise.resolve({ ...escortPriceSetting })
}
export function saveEscortPriceSetting(params?: Record<string, any>) {
    Object.assign(escortPriceSetting, params || {})
    return Promise.resolve({ ...escortPriceSetting })
}
export function getMealServiceList(params?: Record<string, any>) {
    return page(mealServices, params)
}
/** 膳食套餐组合（固定组合价） */
export function getMealComboList(params?: Record<string, any>) {
    return page(mealCombos, params)
}
/** 每日菜单：查询某日供应的套餐组合 */
export function getDailyMenu(params?: Record<string, any>) {
    const item = dailyMenus.find((row: any) => row.date === params?.date)
    return Promise.resolve({ date: params?.date, combo_ids: item ? [...item.combo_ids] : [] })
}
/** 每日菜单：保存某日供应的套餐组合 */
export function saveDailyMenu(params?: Record<string, any>) {
    const idx = dailyMenus.findIndex((row: any) => row.date === params?.date)
    const record = { date: params?.date, combo_ids: params?.combo_ids || [] }
    if (idx > -1) dailyMenus[idx] = record
    else dailyMenus.unshift(record)
    return Promise.resolve({ ...record })
}

// ============ 订单管理 ============
/** 订单通用筛选：关键字（订单号/服务名称/昵称/手机号）、状态、支付状态、支付方式、下单/支付时间区间 */
function filterOrders(lists: any[], params: Record<string, any> = {}) {
    let result = lists
    if (params?.keyword) {
        const kw = String(params.keyword)
        result = result.filter((i: any) =>
            String(i.sn).includes(kw) ||
            String(i.service || '').includes(kw) ||
            String(i.combo || '').includes(kw) ||
            String(i.nickname || '').includes(kw) ||
            String(i.mobile || '').includes(kw)
        )
    }
    if (params?.status !== '' && params?.status !== undefined && params?.status !== null) {
        result = result.filter((i: any) => i.status === Number(params.status))
    }
    if (params?.pay_status !== '' && params?.pay_status !== undefined && params?.pay_status !== null) {
        result = result.filter((i: any) => i.pay_status === Number(params.pay_status))
    }
    if (params?.pay_type) result = result.filter((i: any) => i.pay_type === params.pay_type)
    if (params?.start_time) {
        result = result.filter((i: any) => String(i.create_time).slice(0, 10) >= params.start_time)
    }
    if (params?.end_time) {
        result = result.filter((i: any) => String(i.create_time).slice(0, 10) <= params.end_time)
    }
    if (params?.pay_start) {
        result = result.filter((i: any) => i.pay_time && String(i.pay_time).slice(0, 10) >= params.pay_start)
    }
    if (params?.pay_end) {
        result = result.filter((i: any) => i.pay_time && String(i.pay_time).slice(0, 10) <= params.pay_end)
    }
    if (params?.need_delivery !== '' && params?.need_delivery !== undefined && params?.need_delivery !== null) {
        result = result.filter((i: any) => i.need_delivery === Number(params.need_delivery))
    }
    if (params?.building) result = result.filter((i: any) => i.building === params.building)
    return result
}
export function getNursingOrderList(params?: Record<string, any>) {
    return page(filterOrders(nursingOrders, params), params)
}
export function getMealOrderList(params?: Record<string, any>) {
    return page(filterOrders(mealOrders, params), params)
}
export function getEscortOrderList(params?: Record<string, any>) {
    return page(filterOrders(escortOrders, params), params)
}
/** 当前时间文本 */
function nowText() {
    const d = new Date()
    const p = (v: number) => String(v).padStart(2, '0')
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

/** 派单：指派员工并推进订单状态 */
export function dispatchOrder(params?: Record<string, any>) {
    const { type, id, staff_id } = params || {}
    const target = type === 'nursing' ? nursingOrders : type === 'meal' ? mealOrders : escortOrders
    const order: any = target.find((i: any) => i.id === Number(id))
    const staff: any = staffList.find((s: any) => s.id === Number(staff_id))
    if (!order || !staff) return Promise.reject(new Error('订单或员工不存在'))
    order.staff = staff.name
    order.staff_id = staff.id
    order.status = 2
    order.logs = [
        ...(order.logs || []),
        { time: nowText(), content: `已派单给${staff.role} ${staff.name}`, operator: '物业管理员' }
    ]
    return Promise.resolve({ ...order })
}

// ============ 内容管理 ============
/** 取日期部分 YYYY-MM-DD，空值视为不参与区间筛选 */
const dayOf = (v: any) => String(v || '').slice(0, 10)

/** 通用关键字 + 状态 + 时间区间筛选 */
function filterList<T>(lists: T[], params: Record<string, any> = {}, opts: {
    keywordFields?: string[]
    statusField?: string
    timeField?: string
    startTimeKey?: string
    endTimeKey?: string
    extra?: (item: any, params: Record<string, any>) => boolean
} = {}) {
    let result: any[] = lists as any[]
    const kw = String(params.keyword || '').trim()
    if (kw && opts.keywordFields?.length) {
        result = result.filter((item: any) =>
            opts.keywordFields!.some((f) => String(item[f] ?? '').includes(kw))
        )
    }
    const statusField = opts.statusField || 'status'
    if (params.status !== '' && params.status !== undefined && params.status !== null) {
        result = result.filter((item: any) => Number(item[statusField]) === Number(params.status))
    }
    const timeField = opts.timeField || 'create_time'
    if (params.start_time) {
        result = result.filter((item: any) => {
            const day = dayOf(item[timeField])
            return day && day >= params.start_time
        })
    }
    if (params.end_time) {
        result = result.filter((item: any) => {
            const day = dayOf(item[timeField])
            return day && day <= params.end_time
        })
    }
    if (opts.extra) result = result.filter((item: any) => opts.extra!(item, params))
    return result as T[]
}

/** 人力资源：标题 / 昵称 / 手机号 搜索；发布状态、发布时间、审核时间筛选 */
export function getHrList(params?: Record<string, any>) {
    const lists = filterList(hrList, params, {
        keywordFields: ['title', 'nickname', 'mobile', 'account'],
        statusField: 'status',
        timeField: 'create_time',
        extra: (item, p) => {
            if (p.audit_start && !(dayOf(item.audit_time) && dayOf(item.audit_time) >= p.audit_start)) return false
            if (p.audit_end && !(dayOf(item.audit_time) && dayOf(item.audit_time) <= p.audit_end)) return false
            return true
        },
    })
    return page(lists, params)
}
/** 社区贴吧：帖子ID / 标题 / 昵称 / 手机号 搜索；帖子状态、发布时间、审核时间筛选 */
export function getBarList(params?: Record<string, any>) {
    const lists = filterList(barList, params, {
        keywordFields: ['id', 'title', 'author', 'mobile'],
        statusField: 'audit',
        timeField: 'create_time',
        extra: (item, p) => {
            if (p.audit_start && !(dayOf(item.audit_time) && dayOf(item.audit_time) >= p.audit_start)) return false
            if (p.audit_end && !(dayOf(item.audit_time) && dayOf(item.audit_time) <= p.audit_end)) return false
            return true
        },
    })
    return page(lists, params)
}
/** 帖子评论列表 */
export function getBarCommentList(params?: Record<string, any>) {
    const lists = barComments.filter((item: any) => !params?.post_id || item.post_id === Number(params.post_id))
    return page(lists, params)
}
/** 精彩内容：文章ID / 标题 搜索；显示状态、添加时间筛选 */
export function getWonderfulList(params?: Record<string, any>) {
    const lists = filterList(wonderfulList, params, { keywordFields: ['id', 'title'], statusField: 'status' })
    return page(lists, params)
}
/** 社区通知：标题搜索；显示状态、添加时间筛选 */
export function getNoticeList(params?: Record<string, any>) {
    const lists = filterList(noticeList, params, { keywordFields: ['title'], statusField: 'status' })
    return page(lists, params)
}
/** 社区活动：标题搜索；活动状态（1报名中 2已结束）、发布时间筛选 */
export function getActivityList(params?: Record<string, any>) {
    const lists = filterList(activityList, params, {
        keywordFields: ['title'],
        extra: (item, p) => {
            if (!p.activity_status) return true
            const ended = activityEnded(item)
            return Number(p.activity_status) === 2 ? ended : !ended
        },
    })
    return page(lists, params)
}
/** 是否已结束：超过报名结束时间或已手动停止报名 */
export function activityEnded(item: any) {
    const today = new Date()
    const pad = (v: number) => String(v).padStart(2, '0')
    const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
    if (item.signup_status === 0) return true
    return !!(item.signup_end && item.signup_end < todayStr)
}
export function getActivitySignupList(params?: Record<string, any>) {
    let lists = activitySignupList
    if (params?.activity_id) lists = lists.filter((item: any) => item.activity_id === Number(params.activity_id))
    if (params?.keyword) lists = lists.filter((item: any) => item.nickname.includes(params.keyword) || item.room.includes(params.keyword))
    return page(lists, params)
}
/** 生活帮手：昵称 / 手机号 / 处理人 搜索；类型、楼栋、处理状态、提交时间、处理时间筛选 */
export function getHelperList(params?: Record<string, any>) {
    const lists = filterList(helperList, params, {
        keywordFields: ['nickname', 'phone', 'handler'],
        statusField: 'status',
        timeField: 'create_time',
        extra: (item, p) => {
            if (p.type && item.type !== p.type) return false
            if (p.building && !String(item.building || '').startsWith(p.building)) return false
            if (p.handle_start && !(dayOf(item.handle_time) && dayOf(item.handle_time) >= p.handle_start)) return false
            if (p.handle_end && !(dayOf(item.handle_time) && dayOf(item.handle_time) <= p.handle_end)) return false
            return true
        },
    })
    return page(lists, params)
}
/** Banner 图：标题搜索；状态、添加时间筛选 */
export function getBannerList(params?: Record<string, any>) {
    const lists = filterList(bannerList, params, { keywordFields: ['name'], statusField: 'status' })
    return page(lists, params)
}

// ============ 财务管理 ============
/** 财务概况：全部金额由订单 mock 数据实时计算，不硬编码 */
export function getFinanceOverview() {
    const all: any[] = [
        ...nursingOrders.map((o: any) => ({ ...o, _type: 'nursing' })),
        ...mealOrders.map((o: any) => ({ ...o, _type: 'meal' })),
        ...escortOrders.map((o: any) => ({ ...o, _type: 'escort' })),
    ]
    const sum = (arr: any[]) => arr.reduce((s, o) => s + (Number(o.amount) || 0), 0)
    const money = (v: number) => v.toFixed(2)
    // 有效订单：已支付且未取消；待结算＝有效且未完成，已结算＝有效且已完成
    const valid = all.filter((o: any) => o.pay_status === 1 && o.status !== 4)
    const canceled = all.filter((o: any) => o.status === 4)
    const pending = valid.filter((o: any) => o.status !== 3)
    const settled = valid.filter((o: any) => o.status === 3)
    const pick = (arr: any[], t: string) => arr.filter((o: any) => o._type === t)
    const stat = (t: string) => ({
        total: money(sum(pick(all, t))),
        valid: money(sum(pick(valid, t))),
        cancel: money(sum(pick(canceled, t))),
        pending: money(sum(pick(pending, t))),
        settled: money(sum(pick(settled, t))),
    })
    return Promise.resolve({
        order_total: money(sum(all)),
        order_valid: money(sum(valid)),
        order_refund: money(sum(canceled)),
        nursing: stat('nursing'),
        meal: stat('meal'),
        escort: stat('escort'),
        settle_pending: money(sum(pending)),
        settle_done: money(sum(settled)),
        staff_earnings_total: money(
            staffEarnings.reduce(
                (s, o: any) =>
                    s + Number(o.escort_income) + Number(o.delivery_income) + Number(o.nursing_income),
                0
            )
        ),
    })
}

/** 订单流水：流水号 / 服务名称 / 昵称 / 手机号搜索；提交时间、支付时间、支付方式筛选 */
export function getFinanceFlow(params?: Record<string, any>) {
    let lists: any[] = financeFlow as any[]
    if (params?.pay_type) lists = lists.filter((o: any) => o.pay_type === params.pay_type)
    if (params?.order_type) lists = lists.filter((o: any) => Number(o.order_type) === Number(params.order_type))
    if (params?.pay_start) lists = lists.filter((o: any) => dayOf(o.pay_time) >= params.pay_start)
    if (params?.pay_end) lists = lists.filter((o: any) => dayOf(o.pay_time) <= params.pay_end)
    const result = filterList(lists, params, {
        keywordFields: ['sn', 'service', 'nickname', 'mobile'],
        timeField: 'create_time',
    })
    return page(result, params)
}
/** 订单流水导出：返回筛选后的全部数据（不分页） */
export function getFinanceFlowAll(params?: Record<string, any>) {
    return getFinanceFlow({ ...params, page_no: 1, page_size: 9999 }).then((res: any) => res.lists)
}

/** 账单结算：账单号 / 昵称 / 手机号搜索 */
export function getFinanceBill(params?: Record<string, any>) {
    let lists: any[] = (financeBill as any[]).map((item: any) => ({
        ...item,
        amount: item.orders
            .reduce((s: number, o: any) => s + (Number(o.amount) || 0), 0)
            .toFixed(2),
        order_count: item.orders.length,
    }))
    if (params?.status !== '' && params?.status !== undefined && params?.status !== null) {
        lists = lists.filter((o: any) => Number(o.status) === Number(params.status))
    }
    const result = filterList(lists, params, { keywordFields: ['sn', 'nickname', 'mobile'] })
    return page(result, params)
}

/** 员工收益：员工名称 / 手机号搜索；角色、添加时间筛选 */
export function getStaffEarnings(params?: Record<string, any>) {
    let lists: any[] = (staffEarnings as any[]).map((item: any) => ({
        ...item,
        total_income: (
            Number(item.escort_income) +
            Number(item.delivery_income) +
            Number(item.nursing_income)
        ).toFixed(2),
    }))
    if (params?.role_id) lists = lists.filter((o: any) => Number(o.role_id) === Number(params.role_id))
    const result = filterList(lists, params, { keywordFields: ['name', 'mobile'] })
    return page(result, params)
}
/** 员工收益导出：返回筛选后的全部数据（不分页） */
export function getStaffEarningsAll(params?: Record<string, any>) {
    return getStaffEarnings({ ...params, page_no: 1, page_size: 9999 }).then((res: any) => res.lists)
}
/** 添加员工收益：按员工累加三类收益 */
export function addStaffEarning(params?: Record<string, any>) {
    const row: any = (staffEarnings as any[]).find((o: any) => Number(o.staff_id) === Number(params?.staff_id))
    if (!row) return Promise.reject(new Error('员工不存在'))
    row.escort_income = (Number(row.escort_income) + (Number(params?.escort_income) || 0)).toFixed(2)
    row.delivery_income = (Number(row.delivery_income) + (Number(params?.delivery_income) || 0)).toFixed(2)
    row.nursing_income = (Number(row.nursing_income) + (Number(params?.nursing_income) || 0)).toFixed(2)
    const staff: any = (staffList as any[]).find((o: any) => Number(o.id) === Number(params?.staff_id))
    if (staff) {
        staff.earnings = (
            Number(row.escort_income) +
            Number(row.delivery_income) +
            Number(row.nursing_income)
        ).toFixed(2)
    }
    return Promise.resolve({ ...row })
}

// ============ 系统设置 ============
export function getPropertyInfo() {
    return Promise.resolve(propertyInfo)
}
export function getRoleList(params?: Record<string, any>) {
    return page(roleList, params)
}
export function getAdminList(params?: Record<string, any>) {
    return page(adminList, params)
}
