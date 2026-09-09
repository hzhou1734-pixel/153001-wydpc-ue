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
    bannerList,
    financeOverview,
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
export function getHrList(params?: Record<string, any>) {
    return page(hrList, params)
}
export function getBarList(params?: Record<string, any>) {
    return page(barList, params)
}
export function getWonderfulList(params?: Record<string, any>) {
    return page(wonderfulList, params)
}
export function getNoticeList(params?: Record<string, any>) {
    return page(noticeList, params)
}
export function getActivityList(params?: Record<string, any>) {
    return page(activityList, params)
}
export function getActivitySignupList(params?: Record<string, any>) {
    let lists = activitySignupList
    if (params?.activity_id) lists = lists.filter((item: any) => item.activity_id === Number(params.activity_id))
    if (params?.keyword) lists = lists.filter((item: any) => item.nickname.includes(params.keyword) || item.room.includes(params.keyword))
    return page(lists, params)
}
export function getHelperList(params?: Record<string, any>) {
    return page(helperList, params)
}
export function getBannerList(params?: Record<string, any>) {
    return page(bannerList, params)
}

// ============ 财务管理 ============
export function getFinanceOverview() {
    return Promise.resolve(financeOverview)
}
export function getFinanceFlow(params?: Record<string, any>) {
    return page(financeFlow, params)
}
export function getFinanceBill(params?: Record<string, any>) {
    return page(financeBill, params)
}
export function getStaffEarnings(params?: Record<string, any>) {
    return page(staffEarnings, params)
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
