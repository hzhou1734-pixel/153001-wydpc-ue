/**
 * 用户详情相关补充数据（顾好家币、结算明细、健康数据、报名记录）
 */
function daysAgo(n: number, time = ' 10:30:00') {
    const d = new Date()
    d.setDate(d.getDate() - n)
    const pad = (v: number) => String(v).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}${time}`
}

/** 顾好家币账户（按用户 ID） */
export const coinAccounts: Record<number, any> = {
    1: { balance: '268.50', total_recharge: '1200.00', total_consume: '931.50' },
    2: { balance: '96.00', total_recharge: '600.00', total_consume: '504.00' },
    3: { balance: '0.00', total_recharge: '100.00', total_consume: '100.00' },
    4: { balance: '512.00', total_recharge: '1000.00', total_consume: '488.00' },
    5: { balance: '38.80', total_recharge: '300.00', total_consume: '261.20' },
    6: { balance: '150.00', total_recharge: '500.00', total_consume: '350.00' },
}

/** 顾好家币明细：type 1=充值 2=消费 3=退款 4=赠送 */
export const coinLogs = [
    { id: 1, user_id: 1, type: 1, amount: '200.00', remark: '微信充值顾好家币', create_time: daysAgo(0, ' 09:20:00') },
    { id: 2, user_id: 1, type: 2, amount: '-55.00', remark: '膳食订单支付 SC20260908001', create_time: daysAgo(0, ' 10:46:08') },
    { id: 3, user_id: 1, type: 2, amount: '-80.00', remark: '托管订单支付 TG20260908001', create_time: daysAgo(1, ' 08:41:12') },
    { id: 4, user_id: 1, type: 3, amount: '+2400.00', remark: '托管订单取消退款 TG20260902007', create_time: daysAgo(5, ' 09:00:00') },
    { id: 5, user_id: 1, type: 4, amount: '+20.00', remark: '社区活动签到赠送', create_time: daysAgo(6, ' 18:30:00') },
    { id: 6, user_id: 2, type: 1, amount: '100.00', remark: '支付宝充值顾好家币', create_time: daysAgo(2, ' 12:10:00') },
    { id: 7, user_id: 2, type: 2, amount: '-45.00', remark: '膳食订单支付 SC20260907002', create_time: daysAgo(1, ' 11:21:33') },
    { id: 8, user_id: 2, type: 2, amount: '-29.00', remark: '膳食订单支付 SC20260903006', create_time: daysAgo(5, ' 20:16:22') },
    { id: 9, user_id: 4, type: 1, amount: '500.00', remark: '微信充值顾好家币', create_time: daysAgo(3, ' 15:00:00') },
    { id: 10, user_id: 4, type: 2, amount: '-28.00', remark: '膳食订单支付 SC20260906003', create_time: daysAgo(2, ' 17:36:10') },
    { id: 11, user_id: 5, type: 1, amount: '300.00', remark: '微信充值顾好家币', create_time: daysAgo(4, ' 09:05:00') },
    { id: 12, user_id: 5, type: 2, amount: '-540.00', remark: '陪诊订单支付 PZ20260908001', create_time: daysAgo(0, ' 08:01:25') },
    { id: 13, user_id: 6, type: 1, amount: '200.00', remark: '微信充值顾好家币', create_time: daysAgo(6, ' 20:00:00') },
    { id: 14, user_id: 6, type: 2, amount: '-165.00', remark: '膳食订单支付 SC20260902007', create_time: daysAgo(6, ' 11:02:40') },
    { id: 15, user_id: 3, type: 4, amount: '+50.00', remark: '新用户注册赠送', create_time: daysAgo(60, ' 10:00:00') },
]

/** 结算明细（按结算记录 ID 取） */
export const settleDetails: Record<string, any[]> = {
    '1': [
        { id: 1, sn: 'TG20260812001', type: '托管单', title: '日托·8月第一期', amount: '80.00', status: 3, create_time: '2026-08-12 09:20:00' },
        { id: 2, sn: 'TG20260820002', type: '托管单', title: '学期每日托·8月班', amount: '1200.00', status: 3, create_time: '2026-08-20 16:10:00' },
    ],
    '2': [
        { id: 3, sn: 'SC20260812002', type: '膳食单', title: 'ABC 经典午餐组合', amount: '55.00', status: 3, create_time: '2026-08-12 11:05:00' },
        { id: 4, sn: 'SC20260820003', type: '膳食单', title: '清淡养身晚餐组合', amount: '28.00', status: 3, create_time: '2026-08-20 17:40:00' },
        { id: 5, sn: 'SC20260828004', type: '膳食单', title: '早餐 + 午餐全天组合', amount: '382.00', status: 3, create_time: '2026-08-28 07:50:00' },
    ],
    '3': [
        { id: 6, sn: 'PZ20260809001', type: '陪诊单', title: '专家门诊陪诊（时价）', amount: '368.00', status: 3, create_time: '2026-08-09 08:30:00' },
    ],
    '4': [
        { id: 7, sn: 'TG20260815002', type: '托管单', title: '日托·8月第二期', amount: '960.00', status: 3, create_time: '2026-08-15 09:00:00' },
    ],
    '5': [
        { id: 8, sn: 'SC20260801001', type: '膳食单', title: '早餐 + 午餐全天组合', amount: '180.00', status: 3, create_time: '2026-08-01 07:50:00' },
    ],
    '6': [
        { id: 9, sn: 'SC20260718002', type: '膳食单', title: '双荤商务午餐组合', amount: '328.00', status: 3, create_time: '2026-07-18 11:30:00' },
    ],
    '7': [
        { id: 10, sn: 'TG20260822002', type: '托管单', title: '学期每日托·2026秋季', amount: '2160.00', status: 3, create_time: '2026-08-22 16:20:00' },
    ],
    '8': [
        { id: 11, sn: 'PZ20260825001', type: '陪诊单', title: '住院陪护（时价）', amount: '540.00', status: 2, create_time: '2026-08-25 19:00:00' },
    ],
    '9': [
        { id: 12, sn: 'SC20260811001', type: '膳食单', title: '全日三餐组合', amount: '150.00', status: 3, create_time: '2026-08-11 12:00:00' },
    ],
}

/** 健康手环检测数据（按用户 ID） */
export const healthData: Record<number, any[]> = {
    1: [
        { id: 1, type: '心率', value: '78 bpm', level: '正常', test_time: daysAgo(0, ' 07:30:00') },
        { id: 2, type: '血压', value: '126/82 mmHg', level: '正常', test_time: daysAgo(0, ' 07:32:00') },
        { id: 3, type: '血氧', value: '98%', level: '正常', test_time: daysAgo(1, ' 08:05:00') },
        { id: 4, type: '睡眠', value: '7 小时 12 分', level: '良好', test_time: daysAgo(1, ' 06:50:00') },
        { id: 5, type: '步数', value: '6820 步', level: '达标', test_time: daysAgo(1, ' 21:40:00') },
    ],
    2: [
        { id: 6, type: '心率', value: '82 bpm', level: '正常', test_time: daysAgo(0, ' 07:10:00') },
        { id: 7, type: '血压', value: '138/88 mmHg', level: '偏高', test_time: daysAgo(0, ' 07:12:00') },
        { id: 8, type: '血糖', value: '5.9 mmol/L', level: '正常', test_time: daysAgo(1, ' 07:00:00') },
    ],
    4: [
        { id: 9, type: '心率', value: '71 bpm', level: '正常', test_time: daysAgo(0, ' 06:50:00') },
        { id: 10, type: '血压', value: '118/76 mmHg', level: '正常', test_time: daysAgo(0, ' 06:52:00') },
        { id: 11, type: '体温', value: '36.6 ℃', level: '正常', test_time: daysAgo(1, ' 20:10:00') },
    ],
    5: [
        { id: 12, type: '心率', value: '88 bpm', level: '偏快', test_time: daysAgo(0, ' 08:00:00') },
        { id: 13, type: '血氧', value: '96%', level: '正常', test_time: daysAgo(0, ' 08:02:00') },
    ],
    6: [
        { id: 14, type: '心率', value: '75 bpm', level: '正常', test_time: daysAgo(0, ' 07:40:00') },
        { id: 15, type: '步数', value: '10240 步', level: '达标', test_time: daysAgo(0, ' 22:00:00') },
    ],
}
