import request from '@/utils/request'

// 充值记录
export function rechargeLists(params?: any) {
    return request.get({ url: '/recharge.recharge/lists', params }, { ignoreCancelToken: true })
}

//退款
export function refund(params?: any) {
    return request.post({ url: '/recharge.recharge/refund', params })
}

//重新退款
export function refundAgain(params?: any) {
    return request.post({ url: '/recharge.recharge/refundAgain', params })
}

//退款记录
export function refundRecord(params?: any) {
    return request.get({ url: '/finance.refund/record', params })
}

//退款日志
export function refundLog(params?: any) {
    return request.get({ url: '/finance.refund/log', params })
}

//退款统计
export function refundStat(params?: any) {
    return request.get({ url: '/finance.refund/stat', params })
}
