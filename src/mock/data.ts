/**
 * 公共业务模拟数据
 * 所有列表接口返回 { count, lists, extend } 结构（usePaging 约定）
 * 图片统一使用 picsum 按业务场景 seed 生成虚拟图片
 */

/** 日期辅助：基于当前时间往前推 n 天 */
function daysAgo(n: number, time = ' 10:30:00') {
    const d = new Date()
    d.setDate(d.getDate() - n)
    const pad = (v: number) => String(v).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}${time}`
}

// ==================== 小区 ====================
export const communityList = [
    { id: 1, name: '颐景园·江南里', address: '杭州市西湖区文一西路 128 号', cover: 'https://picsum.photos/seed/ghj-community-1/400/300', buildings: 12, houses: 1286, certified: 986, users: 1523, staff_count: 42, tuoguan_orders: 36, shanshi_orders: 58, peizhen_orders: 24, status: 1, create_time: daysAgo(320) },
    { id: 2, name: '绿城·桂语江南', address: '杭州市滨江区江南大道 88 号', cover: 'https://picsum.photos/seed/ghj-community-2/400/300', buildings: 9, houses: 968, certified: 742, users: 1105, staff_count: 28, tuoguan_orders: 22, shanshi_orders: 41, peizhen_orders: 15, status: 1, create_time: daysAgo(280) },
    { id: 3, name: '保利·天悦湾', address: '杭州市拱墅区祥园路 56 号', cover: 'https://picsum.photos/seed/ghj-community-3/400/300', buildings: 15, houses: 1740, certified: 1210, users: 1892, staff_count: 55, tuoguan_orders: 48, shanshi_orders: 76, peizhen_orders: 33, status: 1, create_time: daysAgo(240) },
    { id: 4, name: '万科·未来城三期', address: '杭州市余杭区未来科技城海曙路 8 号', cover: 'https://picsum.photos/seed/ghj-community-4/400/300', buildings: 18, houses: 2106, certified: 1580, users: 2247, staff_count: 68, tuoguan_orders: 65, shanshi_orders: 92, peizhen_orders: 47, status: 1, create_time: daysAgo(200) },
    { id: 5, name: '融创·金成府', address: '杭州市萧山区博学路 66 号', cover: 'https://picsum.photos/seed/ghj-community-5/400/300', buildings: 7, houses: 642, certified: 415, users: 688, staff_count: 16, tuoguan_orders: 8, shanshi_orders: 12, peizhen_orders: 5, status: 0, create_time: daysAgo(150) },
]

// ==================== 楼栋房号（二级树） ====================
export const buildingTree = [
    {
        id: 1, name: '1栋', community_id: 1,
        children: [
            { id: 101, name: '1单元', parent_id: 1, type: 'unit' },
            { id: 102, name: '2单元', parent_id: 1, type: 'unit' },
        ],
    },
    {
        id: 2, name: '2栋', community_id: 1,
        children: [
            { id: 201, name: '1单元', parent_id: 2, type: 'unit' },
            { id: 202, name: '2单元', parent_id: 2, type: 'unit' },
        ],
    },
    {
        id: 3, name: '3栋', community_id: 1,
        children: [{ id: 301, name: '1单元', parent_id: 3, type: 'unit' }],
    },
]

export const roomList = [
    { id: 1, name: '101', unit_id: 101, building_id: 1, owner: '张伟', phone: '138****1001', certified: 0 },
    { id: 2, name: '102', unit_id: 101, building_id: 1, owner: '李娜', phone: '138****1002', certified: 1 },
    { id: 3, name: '201', unit_id: 101, building_id: 1, owner: '王强', phone: '138****1003', certified: 0 },
    { id: 4, name: '101', unit_id: 102, building_id: 1, owner: '赵敏', phone: '138****1004', certified: 0 },
    { id: 5, name: '201', unit_id: 201, building_id: 2, owner: '陈晨', phone: '138****1005', certified: 1 },
]

// ==================== 认证列表（仅业主认证，家属/租户不做认证） ====================
export const certifyList = [
    { id: 1, user_id: 1, nickname: '张伟', mobile: '138****1001', community: '颐景园·江南里', building: '1栋', unit: '1单元', room: '101', type: '业主', status: 0, create_time: daysAgo(1) },
    { id: 2, user_id: 2, nickname: '李娜', mobile: '138****1002', community: '颐景园·江南里', building: '1栋', unit: '1单元', room: '102', type: '业主', status: 1, create_time: daysAgo(3) },
    { id: 3, user_id: 5, nickname: '陈晨', mobile: '138****1005', community: '保利·天悦湾', building: '3栋', unit: '2单元', room: '502', type: '业主', status: 1, create_time: daysAgo(7) },
]

// ==================== 用户 ====================
export const consumerList = [
    { id: 1, nickname: '张伟', avatar: 'https://picsum.photos/seed/ghj-user-1/100/100', mobile: '138****1001', community: '颐景园·江南里', room: '1栋1单元101', certified: 1, balance: '1286.00', orders: 23, status: 1, create_time: daysAgo(180) },
    { id: 2, nickname: '李娜', avatar: 'https://picsum.photos/seed/ghj-user-2/100/100', mobile: '138****1002', community: '颐景园·江南里', room: '1栋1单元102', certified: 1, balance: '356.50', orders: 15, status: 1, create_time: daysAgo(165) },
    { id: 3, nickname: '王强', avatar: 'https://picsum.photos/seed/ghj-user-3/100/100', mobile: '138****1003', community: '颐景园·江南里', room: '1栋1单元201', certified: 1, balance: '0.00', orders: 8, status: 1, create_time: daysAgo(120) },
    { id: 4, nickname: '赵敏', avatar: 'https://picsum.photos/seed/ghj-user-4/100/100', mobile: '138****1004', community: '绿城·桂语江南', room: '2栋1单元301', certified: 0, balance: '58.00', orders: 3, status: 1, create_time: daysAgo(90) },
    { id: 5, nickname: '陈晨', avatar: 'https://picsum.photos/seed/ghj-user-5/100/100', mobile: '138****1005', community: '保利·天悦湾', room: '3栋2单元502', certified: 1, balance: '2680.00', orders: 46, status: 0, create_time: daysAgo(60) },
    { id: 6, nickname: '刘洋', avatar: 'https://picsum.photos/seed/ghj-user-6/100/100', mobile: '138****1006', community: '万科·未来城三期', room: '5栋1单元1103', certified: 1, balance: '92.30', orders: 12, status: 1, create_time: daysAgo(30) },
]

// ==================== 员工 ====================
export const staffList = [
    { id: 1, name: '周建国', avatar: 'https://picsum.photos/seed/ghj-staff-1/100/100', mobile: '139****2001', role: '托管员', role_id: 1, community: '颐景园·江南里', buildings: '1栋、2栋', orders: 156, earnings: '8632.00', status: 1, create_time: daysAgo(200) },
    { id: 2, name: '吴秀兰', avatar: 'https://picsum.photos/seed/ghj-staff-2/100/100', mobile: '139****2002', role: '配送员', role_id: 2, community: '颐景园·江南里', buildings: '-', orders: 342, earnings: '10240.50', status: 1, create_time: daysAgo(190) },
    { id: 3, name: '郑海涛', avatar: 'https://picsum.photos/seed/ghj-staff-3/100/100', mobile: '139****2003', role: '陪诊员', role_id: 3, community: '绿城·桂语江南', buildings: '-', orders: 87, earnings: '6976.00', status: 1, create_time: daysAgo(150) },
    { id: 4, name: '孙丽华', avatar: 'https://picsum.photos/seed/ghj-staff-4/100/100', mobile: '139****2004', role: '楼栋管理员', role_id: 4, community: '保利·天悦湾', buildings: '3栋', orders: 0, earnings: '4200.00', status: 1, create_time: daysAgo(100) },
    { id: 5, name: '马长顺', avatar: 'https://picsum.photos/seed/ghj-staff-5/100/100', mobile: '139****2005', role: '托管员', role_id: 1, community: '万科·未来城三期', buildings: '5栋、6栋', orders: 203, earnings: '11218.00', status: 0, create_time: daysAgo(80) },
]

// ==================== 服务 ====================
export const nursingServices = [
    { id: 1, type: '半日托管', name: '半日托管（上午）', price: '80.00', unit: '次', duration: '4小时', desc: '上午 8:00-12:00，含午餐配送', cover: 'https://picsum.photos/seed/ghj-nursing-1/400/300', status: 1, sort: 1 },
    { id: 2, type: '全日托管', name: '全日托管', price: '150.00', unit: '次', duration: '8小时', desc: '8:00-18:00，含午餐、午休看护', cover: 'https://picsum.photos/seed/ghj-nursing-2/400/300', status: 1, sort: 2 },
    { id: 3, type: '包月托管', name: '包月托管（工作日）', price: '2600.00', unit: '月', duration: '22天', desc: '工作日全日托管，含每日午餐', cover: 'https://picsum.photos/seed/ghj-nursing-3/400/300', status: 1, sort: 3 },
]

export const escortServices = [
    { id: 1, name: '普通门诊陪诊（时价）', price: '120.00', unit: '小时', desc: '陪同挂号、候诊、取药、记录医嘱', cover: 'https://picsum.photos/seed/ghj-escort-1/400/300', status: 1, sort: 1 },
    { id: 2, name: '专家门诊陪诊（时价）', price: '180.00', unit: '小时', desc: '专家号预约协助 + 全程陪诊', cover: 'https://picsum.photos/seed/ghj-escort-2/400/300', status: 1, sort: 2 },
    { id: 3, name: '住院陪护（时价）', price: '200.00', unit: '小时', desc: '住院期间生活照料与陪护', cover: 'https://picsum.photos/seed/ghj-escort-3/400/300', status: 0, sort: 3 },
]

export const mealServices = [
    { id: 1, name: '红烧狮子头套餐', category: '午餐', price: '22.00', spec: '两荤一素一汤', vendor: '颐和中央厨房', cover: 'https://picsum.photos/seed/ghj-meal-1/400/300', status: 1, sort: 1 },
    { id: 2, name: '清蒸鲈鱼套餐', category: '午餐', price: '28.00', spec: '一荤两素一汤', vendor: '颐和中央厨房', cover: 'https://picsum.photos/seed/ghj-meal-2/400/300', status: 1, sort: 2 },
    { id: 3, name: '香菇滑鸡粥', category: '晚餐', price: '15.00', spec: '粥品 + 小菜', vendor: '社区食堂', cover: 'https://picsum.photos/seed/ghj-meal-3/400/300', status: 1, sort: 3 },
    { id: 4, name: '杂粮饭套餐', category: '晚餐', price: '18.00', spec: '两荤一素', vendor: '社区食堂', cover: 'https://picsum.photos/seed/ghj-meal-4/400/300', status: 1, sort: 4 },
    { id: 5, name: '低糖营养早餐', category: '早餐', price: '10.00', spec: '豆浆 + 包子 + 鸡蛋', vendor: '社区食堂', cover: 'https://picsum.photos/seed/ghj-meal-5/400/300', status: 0, sort: 5 },
]

// ==================== 订单 ====================
export const nursingOrders = [
    { id: 1001, sn: 'TG20260908001', user: '张伟', community: '颐景园·江南里', service: '全日托管', staff: '周建国', amount: '150.00', pay_status: 1, status: 2, create_time: daysAgo(0, ' 09:12:00') },
    { id: 1002, sn: 'TG20260907002', user: '李娜', community: '颐景园·江南里', service: '半日托管（上午）', staff: '周建国', amount: '80.00', pay_status: 1, status: 3, create_time: daysAgo(1, ' 08:40:00') },
    { id: 1003, sn: 'TG20260906003', user: '陈晨', community: '保利·天悦湾', service: '包月托管（工作日）', staff: '孙丽华', amount: '2600.00', pay_status: 1, status: 2, create_time: daysAgo(2, ' 16:05:00') },
    { id: 1004, sn: 'TG20260905004', user: '刘洋', community: '万科·未来城三期', service: '全日托管', staff: '马长顺', amount: '150.00', pay_status: 0, status: 0, create_time: daysAgo(3, ' 11:30:00') },
    { id: 1005, sn: 'TG20260904005', user: '王强', community: '颐景园·江南里', service: '半日托管（上午）', staff: '-', amount: '80.00', pay_status: 1, status: 1, create_time: daysAgo(4, ' 10:00:00') },
]

export const mealOrders = [
    { id: 2001, sn: 'SC20260908001', user: '张伟', community: '颐景园·江南里', service: '红烧狮子头套餐×2', staff: '吴秀兰', amount: '44.00', pay_status: 1, status: 2, create_time: daysAgo(0, ' 10:45:00') },
    { id: 2002, sn: 'SC20260907002', user: '李娜', community: '颐景园·江南里', service: '清蒸鲈鱼套餐×1', staff: '吴秀兰', amount: '28.00', pay_status: 1, status: 3, create_time: daysAgo(1, ' 11:20:00') },
    { id: 2003, sn: 'SC20260906003', user: '赵敏', community: '绿城·桂语江南', service: '香菇滑鸡粥×1', staff: '-', amount: '15.00', pay_status: 1, status: 1, create_time: daysAgo(2, ' 17:35:00') },
    { id: 2004, sn: 'SC20260905004', user: '陈晨', community: '保利·天悦湾', service: '杂粮饭套餐×3', staff: '吴秀兰', amount: '54.00', pay_status: 1, status: 3, create_time: daysAgo(3, ' 12:00:00') },
    { id: 2005, sn: 'SC20260904005', user: '刘洋', community: '万科·未来城三期', service: '低糖营养早餐×2', staff: '-', amount: '20.00', pay_status: 0, status: 0, create_time: daysAgo(4, ' 07:50:00') },
]

export const escortOrders = [
    { id: 3001, sn: 'PZ20260908001', user: '陈晨', community: '保利·天悦湾', service: '专家门诊陪诊（时价）', staff: '郑海涛', hours: 3, amount: '540.00', pay_status: 1, status: 2, create_time: daysAgo(0, ' 08:00:00') },
    { id: 3002, sn: 'PZ20260907002', user: '张伟', community: '颐景园·江南里', service: '普通门诊陪诊（时价）', staff: '郑海涛', hours: 2, amount: '240.00', pay_status: 1, status: 3, create_time: daysAgo(1, ' 09:15:00') },
    { id: 3003, sn: 'PZ20260906003', user: '李娜', community: '颐景园·江南里', service: '普通门诊陪诊（时价）', staff: '-', hours: 0, amount: '240.00', pay_status: 1, status: 1, create_time: daysAgo(2, ' 14:40:00') },
    { id: 3004, sn: 'PZ20260905004', user: '王强', community: '颐景园·江南里', service: '住院陪护（时价）', staff: '郑海涛', hours: 8, amount: '1600.00', pay_status: 1, status: 3, create_time: daysAgo(5, ' 19:00:00') },
    { id: 3005, sn: 'PZ20260904005', user: '赵敏', community: '绿城·桂语江南', service: '专家门诊陪诊（时价）', staff: '-', hours: 0, amount: '540.00', pay_status: 0, status: 0, create_time: daysAgo(6, ' 20:10:00') },
]

// ==================== 内容管理 ====================
export const hrList = [
    { id: 1, title: '急聘社区托管员（颐景园）', type: '招聘', salary: '4500-6000元/月', company: '顾好家物业', contact: '周经理', status: 1, create_time: daysAgo(2) },
    { id: 2, title: '求职：有经验的住家保姆', type: '求职', salary: '期望6000元/月', company: '个人-刘阿姨', contact: '刘阿姨', status: 1, create_time: daysAgo(4) },
    { id: 3, title: '社区食堂招配菜员2名', type: '招聘', salary: '3800元/月', company: '社区食堂', contact: '孙店长', status: 0, create_time: daysAgo(6) },
]

export const barList = [
    { id: 1, title: '小区门口的路灯坏了三天了，谁来管管？', author: '张伟', community: '颐景园·江南里', views: 356, replies: 28, cover: 'https://picsum.photos/seed/ghj-bar-1/400/300', status: 1, create_time: daysAgo(1) },
    { id: 2, title: '周末亲子活动照片分享，孩子们玩得很开心！', author: '李娜', community: '颐景园·江南里', views: 892, replies: 65, cover: 'https://picsum.photos/seed/ghj-bar-2/400/300', status: 1, create_time: daysAgo(3) },
    { id: 3, title: '求推荐靠谱的家政保洁阿姨', author: '赵敏', community: '绿城·桂语江南', views: 234, replies: 41, cover: 'https://picsum.photos/seed/ghj-bar-3/400/300', status: 0, create_time: daysAgo(2) },
]

export const wonderfulList = [
    { id: 1, title: '社区重阳节敬老活动圆满举办', author: '物业宣传部', cover: 'https://picsum.photos/seed/ghj-wonderful-1/400/300', views: 1520, likes: 236, status: 1, create_time: daysAgo(5) },
    { id: 2, title: '业主才艺大赛精彩回顾', author: '物业宣传部', cover: 'https://picsum.photos/seed/ghj-wonderful-2/400/300', views: 980, likes: 158, status: 1, create_time: daysAgo(10) },
    { id: 3, title: '托管班孩子们的绘画作品展示', author: '周建国', cover: 'https://picsum.photos/seed/ghj-wonderful-3/400/300', views: 645, likes: 98, status: 0, create_time: daysAgo(15) },
]

export const noticeList = [
    { id: 1, title: '关于9月10日小区停水检修的通知', type: '物业通知', is_top: 1, views: 2103, status: 1, create_time: daysAgo(1) },
    { id: 2, title: '中秋节社区游园活动报名开始', type: '活动通知', is_top: 0, views: 876, status: 1, create_time: daysAgo(2) },
    { id: 3, title: '台风预警温馨提示', type: '安全提示', is_top: 1, views: 3421, status: 1, create_time: daysAgo(3) },
]

export const activityList = [
    { id: 1, title: '中秋游园会·猜灯谜赢好礼', cover: 'https://picsum.photos/seed/ghj-activity-1/400/300', signup: 186, limit: 300, start_time: daysAgo(-5), address: '小区中心广场', status: 1, create_time: daysAgo(3) },
    { id: 2, title: '老年健康义诊进社区', cover: 'https://picsum.photos/seed/ghj-activity-2/400/300', signup: 92, limit: 150, start_time: daysAgo(-10), address: '社区服务站', status: 1, create_time: daysAgo(5) },
    { id: 3, title: '周末亲子手工课（第12期）', cover: 'https://picsum.photos/seed/ghj-activity-3/400/300', signup: 40, limit: 40, start_time: daysAgo(2), address: '托管活动室', status: 0, create_time: daysAgo(20) },
]

export const helperList = [
    { id: 1, title: '家电维修-老李家电服务部', category: '家电维修', contact: '李师傅', phone: '137****3001', cover: 'https://picsum.photos/seed/ghj-helper-1/400/300', status: 1, create_time: daysAgo(30) },
    { id: 2, title: '开锁换锁-安心锁业', category: '开锁换锁', contact: '王师傅', phone: '137****3002', cover: 'https://picsum.photos/seed/ghj-helper-2/400/300', status: 1, create_time: daysAgo(28) },
    { id: 3, title: '管道疏通-快速到家服务', category: '管道疏通', contact: '赵师傅', phone: '137****3003', cover: 'https://picsum.photos/seed/ghj-helper-3/400/300', status: 0, create_time: daysAgo(25) },
]

export const bannerList = [
    { id: 1, name: '首页-中秋活动推广', image: 'https://picsum.photos/seed/ghj-banner-1/750/300', link: '/pages/activity/detail?id=1', sort: 1, status: 1, create_time: daysAgo(2) },
    { id: 2, name: '首页-膳食服务上新', image: 'https://picsum.photos/seed/ghj-banner-2/750/300', link: '/pages/meal/index', sort: 2, status: 1, create_time: daysAgo(8) },
    { id: 3, name: '首页-陪诊服务宣传', image: 'https://picsum.photos/seed/ghj-banner-3/750/300', link: '/pages/escort/index', sort: 3, status: 0, create_time: daysAgo(15) },
]

// ==================== 财务 ====================
export const financeOverview = {
    today_income: '12680.50',
    month_income: '286450.00',
    total_income: '1863290.00',
    today_refund: '150.00',
    month_refund: '4820.00',
    total_refund: '32680.00',
    month_settle: '152300.00',
    total_settle: '986500.00',
    balance: '844110.00',
}

export const financeFlow = [
    { id: 1, sn: 'FL20260908001', type: '服务收入', from: '张伟-全日托管', amount: '+150.00', pay_type: '微信支付', create_time: daysAgo(0, ' 09:15:00') },
    { id: 2, sn: 'FL20260908002', type: '服务收入', from: '陈晨-专家门诊陪诊', amount: '+540.00', pay_type: '微信支付', create_time: daysAgo(0, ' 08:10:00') },
    { id: 3, sn: 'FL20260907003', type: '退款支出', from: '刘洋-全日托管', amount: '-150.00', pay_type: '原路退回', create_time: daysAgo(1, ' 15:30:00') },
    { id: 4, sn: 'FL20260907004', type: '服务收入', from: '李娜-清蒸鲈鱼套餐', amount: '+28.00', pay_type: '余额支付', create_time: daysAgo(1, ' 11:25:00') },
    { id: 5, sn: 'FL20260906005', type: '员工结算', from: '周建国-8月收益', amount: '-8632.00', pay_type: '银行转账', create_time: daysAgo(2, ' 10:00:00') },
]

export const financeBill = [
    { id: 1, sn: 'JS20260901001', community: '颐景园·江南里', income: '86230.00', refund: '320.00', settle: '76580.00', status: 1, bill_time: '2026-08-01 ~ 2026-08-31', create_time: daysAgo(8) },
    { id: 2, sn: 'JS20260901002', community: '绿城·桂语江南', income: '52100.00', refund: '0.00', settle: '46890.00', status: 1, bill_time: '2026-08-01 ~ 2026-08-31', create_time: daysAgo(8) },
    { id: 3, sn: 'JS20260901003', community: '保利·天悦湾', income: '73450.00', refund: '150.00', settle: '63105.00', status: 0, bill_time: '2026-09-01 ~ 2026-09-30', create_time: daysAgo(0) },
]

export const staffEarnings = [
    { id: 1, staff: '周建国', role: '托管员', orders: 156, income: '11218.00', settled: '8632.00', un_settled: '2586.00', month: '2026-08' },
    { id: 2, staff: '吴秀兰', role: '配送员', orders: 342, income: '13650.00', settled: '10240.50', un_settled: '3409.50', month: '2026-08' },
    { id: 3, staff: '郑海涛', role: '陪诊员', orders: 87, income: '9300.00', settled: '6976.00', un_settled: '2324.00', month: '2026-08' },
    { id: 4, staff: '孙丽华', role: '楼栋管理员', orders: 0, income: '4200.00', settled: '4200.00', un_settled: '0.00', month: '2026-08' },
]

// ==================== 系统设置 ====================
export const propertyInfo = {
    name: '顾好家物业服务集团有限公司',
    short_name: '顾好家物业',
    contact: '周经理',
    mobile: '0571-88886666',
    address: '杭州市西湖区文一西路 128 号顾好家大厦 12F',
    license: 'https://picsum.photos/seed/ghj-license/600/400',
    create_time: '2026-01-01 09:00:00',
}

export const roleList = [
    { id: 1, name: '超级管理员', desc: '拥有系统全部权限', members: 1, create_time: daysAgo(300) },
    { id: 2, name: '物业经理', desc: '小区、用户、订单、内容管理', members: 3, create_time: daysAgo(260) },
    { id: 3, name: '财务专员', desc: '财务管理相关权限', members: 2, create_time: daysAgo(200) },
    { id: 4, name: '楼栋管理员', desc: '指定楼栋的托管与配送管理', members: 5, create_time: daysAgo(120) },
]

export const adminList = [
    { id: 1, username: 'admin', nickname: '物业管理员', role: '超级管理员', mobile: '13800138000', last_login: daysAgo(0, ' 08:30:00'), status: 1, create_time: daysAgo(300) },
    { id: 2, username: 'jingli01', nickname: '王经理', role: '物业经理', mobile: '138****0002', last_login: daysAgo(1, ' 18:20:00'), status: 1, create_time: daysAgo(250) },
    { id: 3, username: 'caiwu01', nickname: '钱会计', role: '财务专员', mobile: '138****0003', last_login: daysAgo(2, ' 09:00:00'), status: 1, create_time: daysAgo(180) },
    { id: 4, username: 'loudong01', nickname: '孙丽华', role: '楼栋管理员', mobile: '138****0004', last_login: daysAgo(3, ' 14:45:00'), status: 0, create_time: daysAgo(90) },
]

// ==================== 数据台 ====================
export const dashboardStats = {
    community: { today: 0, month: 1, total: 5 },
    user: { today: 12, month: 186, total: 7555 },
    order: { today: 23, month: 512, total: 8630 },
    trade: { today: '12680.50', month: '286450.00', total: '1863290.00' },
    settle: { today: '8632.00', month: '152300.00', total: '986500.00' },
}

export const dashboardBusiness = {
    escort: [
        { date: '2026-09-08', orders: 3, amount: '1320.00', users: 3 },
        { date: '2026-09-07', orders: 2, amount: '840.00', users: 2 },
        { date: '2026-09-06', orders: 1, amount: '240.00', users: 1 },
        { date: '2026-09-05', orders: 4, amount: '2980.00', users: 4 },
        { date: '2026-09-04', orders: 2, amount: '480.00', users: 2 },
    ],
    nursing: [
        { date: '2026-09-08', orders: 5, amount: '1110.00', users: 5 },
        { date: '2026-09-07', orders: 4, amount: '530.00', users: 4 },
        { date: '2026-09-06', orders: 6, amount: '1180.00', users: 6 },
        { date: '2026-09-05', orders: 3, amount: '310.00', users: 3 },
        { date: '2026-09-04', orders: 5, amount: '860.00', users: 5 },
    ],
    meal: [
        { date: '2026-09-08', orders: 12, amount: '326.00', users: 9 },
        { date: '2026-09-07', orders: 15, amount: '402.00', users: 11 },
        { date: '2026-09-06', orders: 11, amount: '288.00', users: 8 },
        { date: '2026-09-05', orders: 14, amount: '376.00', users: 10 },
        { date: '2026-09-04', orders: 10, amount: '254.00', users: 7 },
    ],
}

export const dashboardTodo = [
    { id: 1, name: '待审核认证申请', count: 1, path: '/community/certify', perms: 'community.certify/lists' },
    { id: 2, name: '待派单托管订单', count: 1, path: '/order/nursing', perms: 'order.nursing/lists' },
    { id: 3, name: '待派单膳食订单', count: 2, path: '/order/meal', perms: 'order.meal/lists' },
    { id: 4, name: '待派单陪诊订单', count: 2, path: '/order/escort', perms: 'order.escort/lists' },
    { id: 5, name: '待结算账单', count: 1, path: '/finance/bill', perms: 'finance.bill/lists' },
    { id: 6, name: '待处理退款申请', count: 1, path: '/finance/flow', perms: 'finance.flow/lists' },
    { id: 7, name: '待审核帖子', count: 1, path: '/article/bar', perms: 'article.bar/lists' },
    { id: 8, name: '待上线活动', count: 1, path: '/article/activity', perms: 'article.activity/lists' },
]

/** 分页辅助：模拟 usePaging 需要的 { count, lists } 返回 */
export function paginate<T>(lists: T[], page_no = 1, page_size = 20) {
    const start = (page_no - 1) * page_size
    return {
        count: lists.length,
        lists: lists.slice(start, start + page_size),
        extend: {},
    }
}
