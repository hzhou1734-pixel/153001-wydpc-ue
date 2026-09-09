/**
 * Mock 站点配置数据
 * 对应接口 /config/getConfig
 */
export function mockConfig() {
    return Promise.resolve({
        web_name: '顾好家物业管理后台',
        web_favicon: 'https://picsum.photos/seed/ghj-favicon/64/64',
        web_logo: 'https://picsum.photos/seed/ghj-logo/200/60',
        login_logo: 'https://picsum.photos/seed/ghj-login/200/60',
        login_image: 'https://picsum.photos/seed/ghj-login-banner/800/800',
        copyright: '顾好家物业服务集团有限公司',
    })
}

/**
 * Mock 字典数据
 * 对应接口 /config/dict
 */
export function mockDictData(type: string) {
    const dictMap: Record<string, any[]> = {
        order_status: [
            { name: '待支付', value: 0 },
            { name: '待派单', value: 1 },
            { name: '服务中', value: 2 },
            { name: '已完成', value: 3 },
            { name: '已取消', value: 4 },
        ],
        pay_status: [
            { name: '未支付', value: 0 },
            { name: '已支付', value: 1 },
            { name: '已退款', value: 2 },
        ],
        audit_status: [
            { name: '待审核', value: 0 },
            { name: '已通过', value: 1 },
            { name: '已驳回', value: 2 },
        ],
        staff_role: [
            { name: '托管员', value: 1 },
            { name: '配送员', value: 2 },
            { name: '陪诊员', value: 3 },
            { name: '楼栋管理员', value: 4 },
        ],
    }
    return Promise.resolve(dictMap[type] || [])
}
