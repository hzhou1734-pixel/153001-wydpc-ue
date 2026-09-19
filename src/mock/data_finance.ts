/**
 * 财务管理板块模拟数据
 * 账单结算 / 小区钱袋子 / 收益配置 / 员工收益 均在此维护
 * 账单合计金额由明细自动汇总；钱袋子中仅托管/膳食预收金额自动计算，物业结余金额手工填写
 */
import { reactive } from 'vue'
import { staffList } from './data'

const fmt = (v: number) => Number(v || 0).toFixed(2)
const avatar = (seed: string) => `https://picsum.photos/seed/${seed}/100/100`
const voucher = (seed: string) => `https://picsum.photos/seed/${seed}/400/300`

// ==================== 账单结算 ====================
interface BillItem {
    /** 账单明细类型：托管单 / 膳食单 */
    type: '托管' | '膳食'
    sn: string
    service: string
    prepay_amount: string
    refund_amount: string
    create_time: string
}

interface BillRaw {
    id: number
    title: string
    avatar: string
    nickname: string
    mobile: string
    settle_time: string
    items: BillItem[]
}

/** 账单的预付金额、退还金额 = 其下所有托管单、膳食单明细之和 */
const buildBill = (raw: BillRaw) => {
    const prepay = raw.items.reduce((s, i) => s + (Number(i.prepay_amount) || 0), 0)
    const refund = raw.items.reduce((s, i) => s + (Number(i.refund_amount) || 0), 0)
    return { ...raw, prepay_amount: fmt(prepay), refund_amount: fmt(refund) }
}

/** 规则：每个用户上月有过托管单或膳食单，则生成一条账单 */
export const billList = [
    buildBill({
        id: 1,
        title: '张伟 2026年8月账单',
        avatar: avatar('ghj-user-1'),
        nickname: '张伟',
        mobile: '13812341001',
        settle_time: '2026-09-01 10:20:00',
        items: [
            { type: '托管', sn: 'TG20260805011', service: '日托·8月第一期', prepay_amount: '80.00', refund_amount: '0.00', create_time: '2026-08-05 09:12:00' },
            { type: '膳食', sn: 'SC20260812012', service: 'ABC 经典午餐组合 ×8', prepay_amount: '440.00', refund_amount: '0.00', create_time: '2026-08-12 11:05:00' },
            { type: '膳食', sn: 'SC20260820013', service: '双荤商务午餐组合 ×5', prepay_amount: '225.00', refund_amount: '45.00', create_time: '2026-08-20 11:40:00' },
        ],
    }),
    buildBill({
        id: 2,
        title: '李娜 2026年8月账单',
        avatar: avatar('ghj-user-2'),
        nickname: '李娜',
        mobile: '13812341002',
        settle_time: '2026-09-01 10:22:00',
        items: [
            { type: '托管', sn: 'TG20260803014', service: '日托·8月第一期', prepay_amount: '80.00', refund_amount: '0.00', create_time: '2026-08-03 08:30:00' },
            { type: '膳食', sn: 'SC20260815015', service: '清淡养身晚餐组合 ×10', prepay_amount: '280.00', refund_amount: '0.00', create_time: '2026-08-15 17:20:00' },
        ],
    }),
    buildBill({
        id: 3,
        title: '陈晨 2026年8月账单',
        avatar: avatar('ghj-user-5'),
        nickname: '陈晨',
        mobile: '13812341005',
        settle_time: '2026-09-01 10:25:00',
        items: [
            { type: '托管', sn: 'TG20260801016', service: '学期每日托·2026秋季', prepay_amount: '2600.00', refund_amount: '0.00', create_time: '2026-08-01 16:06:00' },
            { type: '膳食', sn: 'SC20260818017', service: '全日三餐组合 ×6', prepay_amount: '312.00', refund_amount: '0.00', create_time: '2026-08-18 12:00:00' },
        ],
    }),
    buildBill({
        id: 4,
        title: '赵敏 2026年8月账单',
        avatar: avatar('ghj-user-4'),
        nickname: '赵敏',
        mobile: '13812341004',
        settle_time: '2026-09-01 10:28:00',
        items: [
            { type: '托管', sn: 'TG20260822018', service: '日托·暑期托管班', prepay_amount: '90.00', refund_amount: '0.00', create_time: '2026-08-22 09:05:00' },
            { type: '膳食', sn: 'SC20260824019', service: '低糖轻食组合 ×4', prepay_amount: '96.00', refund_amount: '24.00', create_time: '2026-08-24 08:20:00' },
        ],
    }),
    buildBill({
        id: 5,
        title: '刘洋 2026年8月账单',
        avatar: avatar('ghj-user-6'),
        nickname: '刘洋',
        mobile: '13812341006',
        settle_time: '2026-09-01 10:30:00',
        items: [
            { type: '膳食', sn: 'SC20260826020', service: 'ABC 经典午餐组合 ×3', prepay_amount: '165.00', refund_amount: '0.00', create_time: '2026-08-26 11:50:00' },
        ],
    }),
    buildBill({
        id: 6,
        title: '王强 2026年8月账单',
        avatar: avatar('ghj-user-3'),
        nickname: '王强',
        mobile: '13812341003',
        settle_time: '2026-09-01 10:32:00',
        items: [
            { type: '托管', sn: 'TG20260828021', service: '学期周末托·周六班', prepay_amount: '1200.00', refund_amount: '0.00', create_time: '2026-08-28 10:01:00' },
            { type: '膳食', sn: 'SC20260829022', service: '早餐 + 午餐全天组合 ×6', prepay_amount: '174.00', refund_amount: '29.00', create_time: '2026-08-29 07:30:00' },
        ],
    }),
    buildBill({
        id: 7,
        title: '张伟 2026年7月账单',
        avatar: avatar('ghj-user-1'),
        nickname: '张伟',
        mobile: '13812341001',
        settle_time: '2026-08-01 10:05:00',
        items: [
            { type: '托管', sn: 'TG20260705023', service: '日托·暑期托管班', prepay_amount: '90.00', refund_amount: '0.00', create_time: '2026-07-05 09:00:00' },
            { type: '膳食', sn: 'SC20260710024', service: '清淡养身晚餐组合 ×12', prepay_amount: '336.00', refund_amount: '0.00', create_time: '2026-07-10 17:40:00' },
        ],
    }),
    buildBill({
        id: 8,
        title: '李娜 2026年7月账单',
        avatar: avatar('ghj-user-2'),
        nickname: '李娜',
        mobile: '13812341002',
        settle_time: '2026-08-01 10:08:00',
        items: [
            { type: '托管', sn: 'TG20260708025', service: '日托·暑期托管班', prepay_amount: '90.00', refund_amount: '0.00', create_time: '2026-07-08 08:45:00' },
            { type: '膳食', sn: 'SC20260716026', service: '早餐 + 午餐全天组合 ×8', prepay_amount: '232.00', refund_amount: '0.00', create_time: '2026-07-16 07:20:00' },
        ],
    }),
]

// ==================== 小区钱袋子 ====================
/** 物业钱袋子：结余金额手工填写，不做自动计算 */
const buildPropertyWallet = (raw: {
    id: number
    title: string
    month: string
    expense_amount: string
    income_amount: string
    balance_amount: string
    expense_voucher: string
    income_voucher: string
    create_time: string
}) => ({
    ...raw,
})

export const walletProperty = [
    buildPropertyWallet({
        id: 1,
        title: '颐景园·江南里 物业服务项目支出',
        month: '2026-08',
        expense_amount: '12860.00',
        income_amount: '35600.00',
        balance_amount: '22740.00',
        expense_voucher: voucher('ghj-wallet-exp-1'),
        income_voucher: voucher('ghj-wallet-inc-1'),
        create_time: '2026-09-02 09:30:00',
    }),
    buildPropertyWallet({
        id: 2,
        title: '颐景园·江南里 公共收益入账',
        month: '2026-07',
        expense_amount: '15320.00',
        income_amount: '29800.00',
        balance_amount: '14480.00',
        expense_voucher: voucher('ghj-wallet-exp-2'),
        income_voucher: voucher('ghj-wallet-inc-2'),
        create_time: '2026-08-02 10:15:00',
    }),
    buildPropertyWallet({
        id: 3,
        title: '颐景园·江南里 电梯维保专项支出',
        month: '2026-06',
        expense_amount: '22600.00',
        income_amount: '33150.00',
        balance_amount: '10550.00',
        expense_voucher: voucher('ghj-wallet-exp-3'),
        income_voucher: voucher('ghj-wallet-inc-3'),
        create_time: '2026-07-02 14:20:00',
    }),
    buildPropertyWallet({
        id: 4,
        title: '颐景园·江南里 上半年结余结转',
        month: '2026-05',
        expense_amount: '9840.00',
        income_amount: '26400.00',
        balance_amount: '16560.00',
        expense_voucher: voucher('ghj-wallet-exp-4'),
        income_voucher: voucher('ghj-wallet-inc-4'),
        create_time: '2026-06-02 09:05:00',
    }),
]

/** 托管 / 膳食钱袋子：预收金额 = 订单数量 × 每单单价 */
const buildBusinessWallet = (raw: {
    id: number
    title: string
    month: string
    order_count: number
    unit_price: string
    cost_amount: string
    voucher: string
    create_time: string
}) => ({
    ...raw,
    prepay_amount: fmt(raw.order_count * Number(raw.unit_price)),
})

export const walletNursing = [
    buildBusinessWallet({
        id: 1,
        title: '托管服务 2026年8月结算',
        month: '2026-08',
        order_count: 186,
        unit_price: '80.00',
        cost_amount: '11200.00',
        voucher: voucher('ghj-wallet-nur-1'),
        create_time: '2026-09-02 11:20:00',
    }),
    buildBusinessWallet({
        id: 2,
        title: '托管服务 2026年7月结算',
        month: '2026-07',
        order_count: 214,
        unit_price: '80.00',
        cost_amount: '12980.00',
        voucher: voucher('ghj-wallet-nur-2'),
        create_time: '2026-08-02 11:35:00',
    }),
    buildBusinessWallet({
        id: 3,
        title: '托管服务 2026年6月结算',
        month: '2026-06',
        order_count: 132,
        unit_price: '90.00',
        cost_amount: '8640.00',
        voucher: voucher('ghj-wallet-nur-3'),
        create_time: '2026-07-02 10:45:00',
    }),
]

export const walletMeal = [
    buildBusinessWallet({
        id: 1,
        title: '膳食服务 2026年8月结算',
        month: '2026-08',
        order_count: 465,
        unit_price: '32.00',
        cost_amount: '11620.00',
        voucher: voucher('ghj-wallet-meal-1'),
        create_time: '2026-09-02 15:10:00',
    }),
    buildBusinessWallet({
        id: 2,
        title: '膳食服务 2026年7月结算',
        month: '2026-07',
        order_count: 508,
        unit_price: '32.00',
        cost_amount: '12700.00',
        voucher: voucher('ghj-wallet-meal-2'),
        create_time: '2026-08-02 15:25:00',
    }),
    buildBusinessWallet({
        id: 3,
        title: '膳食服务 2026年6月结算',
        month: '2026-06',
        order_count: 396,
        unit_price: '30.00',
        cost_amount: '9500.00',
        voucher: voucher('ghj-wallet-meal-3'),
        create_time: '2026-07-02 16:00:00',
    }),
]

// ==================== 收益配置 ====================
/**
 * 员工收益计算规则
 * 托管接送：每完成一趟按 nursing_price 计算，单次收益受 nursing_min / nursing_max 限制
 * 膳食配送：每完成一趟按 meal_price 计算
 * 陪诊接送：每完成一趟按 escort_price 计算
 */
export const profitConfig = reactive({
    /** 托管接送（元/趟） */
    nursing_price: '15.00',
    /** 单次最低收益金额 */
    nursing_min: '10.00',
    /** 单次最高收益金额 */
    nursing_max: '30.00',
    /** 膳食配送（元/趟） */
    meal_price: '8.00',
    /** 陪诊接送（元/趟） */
    escort_price: '25.00',
})

// ==================== 员工收益 ====================
/** 员工已完成订单数（按结算类型拆分）：托管趟次 / 配送趟次 / 陪诊趟次 */
const earningBase: { staff_id: number; nursing_count: number; delivery_count: number; escort_count: number }[] = [
    { staff_id: 1, nursing_count: 42, delivery_count: 0, escort_count: 0 },
    { staff_id: 2, nursing_count: 0, delivery_count: 156, escort_count: 0 },
    { staff_id: 3, nursing_count: 0, delivery_count: 0, escort_count: 38 },
    { staff_id: 4, nursing_count: 0, delivery_count: 0, escort_count: 0 },
    { staff_id: 5, nursing_count: 58, delivery_count: 0, escort_count: 0 },
    { staff_id: 6, nursing_count: 27, delivery_count: 0, escort_count: 0 },
    { staff_id: 7, nursing_count: 21, delivery_count: 0, escort_count: 0 },
    { staff_id: 8, nursing_count: 0, delivery_count: 93, escort_count: 0 },
    { staff_id: 9, nursing_count: 0, delivery_count: 74, escort_count: 0 },
    { staff_id: 10, nursing_count: 0, delivery_count: 0, escort_count: 29 },
    { staff_id: 11, nursing_count: 0, delivery_count: 0, escort_count: 22 },
]

/** 员工收益基础数据：收益金额由「收益配置金额 × 已完成订单数」自动计算，此处仅提供已完成单量 */
export const staffEarningRows = staffList.map((item: any) => {
    const base = earningBase.find((b) => b.staff_id === item.id) || {
        nursing_count: 0,
        delivery_count: 0,
        escort_count: 0,
    }
    return {
        id: item.id,
        staff_id: item.id,
        name: item.name,
        avatar: item.avatar,
        mobile: item.mobile,
        role: item.role,
        role_id: item.role_id,
        nursing_count: base.nursing_count,
        delivery_count: base.delivery_count,
        escort_count: base.escort_count,
        create_time: item.create_time,
    }
})
