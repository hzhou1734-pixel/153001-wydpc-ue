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
    // 颐景园·江南里
    {
        id: 1, name: '1栋', community_id: 1, community_name: '颐景园·江南里',
        children: [
            { id: 101, name: '1单元', parent_id: 1, type: 'unit' },
            { id: 102, name: '2单元', parent_id: 1, type: 'unit' },
        ],
    },
    {
        id: 2, name: '2栋', community_id: 1, community_name: '颐景园·江南里',
        children: [
            { id: 201, name: '1单元', parent_id: 2, type: 'unit' },
            { id: 202, name: '2单元', parent_id: 2, type: 'unit' },
        ],
    },
    {
        id: 3, name: '3栋', community_id: 1, community_name: '颐景园·江南里',
        children: [{ id: 301, name: '1单元', parent_id: 3, type: 'unit' }],
    },
    // 绿城·桂语江南
    {
        id: 11, name: '1栋', community_id: 2, community_name: '绿城·桂语江南',
        children: [
            { id: 1101, name: '1单元', parent_id: 11, type: 'unit' },
            { id: 1102, name: '2单元', parent_id: 11, type: 'unit' },
        ],
    },
    {
        id: 12, name: '2栋', community_id: 2, community_name: '绿城·桂语江南',
        children: [
            { id: 1201, name: '1单元', parent_id: 12, type: 'unit' },
            { id: 1202, name: '2单元', parent_id: 12, type: 'unit' },
        ],
    },
    // 保利·天悦湾
    {
        id: 21, name: '1栋', community_id: 3, community_name: '保利·天悦湾',
        children: [{ id: 2101, name: '1单元', parent_id: 21, type: 'unit' }],
    },
    {
        id: 22, name: '2栋', community_id: 3, community_name: '保利·天悦湾',
        children: [
            { id: 2201, name: '1单元', parent_id: 22, type: 'unit' },
            { id: 2202, name: '2单元', parent_id: 22, type: 'unit' },
        ],
    },
    {
        id: 23, name: '3栋', community_id: 3, community_name: '保利·天悦湾',
        children: [
            { id: 2301, name: '1单元', parent_id: 23, type: 'unit' },
            { id: 2302, name: '2单元', parent_id: 23, type: 'unit' },
        ],
    },
    // 万科·未来城三期
    {
        id: 35, name: '5栋', community_id: 4, community_name: '万科·未来城三期',
        children: [
            { id: 3501, name: '1单元', parent_id: 35, type: 'unit' },
            { id: 3502, name: '2单元', parent_id: 35, type: 'unit' },
        ],
    },
    {
        id: 36, name: '6栋', community_id: 4, community_name: '万科·未来城三期',
        children: [{ id: 3601, name: '1单元', parent_id: 36, type: 'unit' }],
    },
    // 融创·金成府
    {
        id: 41, name: '1栋', community_id: 5, community_name: '融创·金成府',
        children: [
            { id: 4101, name: '1单元', parent_id: 41, type: 'unit' },
            { id: 4102, name: '2单元', parent_id: 41, type: 'unit' },
        ],
    },
    {
        id: 42, name: '2栋', community_id: 5, community_name: '融创·金成府',
        children: [{ id: 4201, name: '1单元', parent_id: 42, type: 'unit' }],
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
    { id: 1, title: '小区门口的路灯坏了三天了，谁来管管？', author: '张伟', community: '颐景园·江南里', views: 356, replies: 28, cover: 'https://picsum.photos/seed/ghj-bar-1/400/300', status: 1, create_time: daysAgo(1), audit: 0, audit_reason: '', audit_time: '', content: '小区南门口的三盏路灯从上周五开始就不亮了，晚上回家那段路完全漆黑，已经有老人在台阶上差点摔倒。家里老人小孩每天出入都很不安全，希望物业尽快安排维修，也请大家留意出行安全。附上现场照片，位置就在南门岗亭到3号楼之间的路段。' },
    { id: 2, title: '周末亲子活动照片分享，孩子们玩得很开心！', author: '李娜', community: '颐景园·江南里', views: 892, replies: 65, cover: 'https://picsum.photos/seed/ghj-bar-2/400/300', status: 1, create_time: daysAgo(3), audit: 1, audit_reason: '', audit_time: daysAgo(3), content: '上周六物业组织的亲子运动会太有意思了！拔河、两人三足、套圈圈，孩子们玩得不亦乐乎，我家娃回家路上一直念叨下次还要参加。感谢物业的精心组织，也谢谢各位志愿者业主的帮忙，照片分享给大家，欢迎下期多多报名~' },
    { id: 3, title: '求推荐靠谱的家政保洁阿姨', author: '赵敏', community: '绿城·桂语江南', views: 234, replies: 41, cover: 'https://picsum.photos/seed/ghj-bar-3/400/300', status: 0, create_time: daysAgo(2), audit: 2, audit_reason: '内容涉及外部广告联系方式，不符合社区发帖规范', audit_time: daysAgo(2), content: '最近工作太忙，想找一位固定的家政保洁阿姨，每周来打扫两到三次，最好有经验、手脚麻利的。有推荐的朋友可以联系我，微信在此……' },
    { id: 4, title: '5号楼电梯按钮面板脱落，已拍照报修', author: '王强', community: '颐景园·江南里', views: 128, replies: 12, cover: 'https://picsum.photos/seed/ghj-bar-4/400/300', status: 1, create_time: daysAgo(0), audit: 0, audit_reason: '', audit_time: '', content: '今天早上发现5号楼2单元的电梯按钮面板整个脱落挂在半空，小孩路过容易碰到，比较危险。已经拍照发到了物业报修群，请物业尽快派人来处理，也提醒邻居们乘坐电梯时注意安全。' },
    { id: 5, title: '转让九成新婴儿床，同小区自提', author: '陈晓', community: '绿城·桂语江南', views: 86, replies: 9, cover: 'https://picsum.photos/seed/ghj-bar-5/400/300', status: 1, create_time: daysAgo(0), audit: 0, audit_reason: '', audit_time: '', content: '孩子长大了用不上，出一台九成新实木婴儿床，带床垫和蚊帐，原价1200元现400元转让，仅限同小区业主自提，可以先上门看货。有意向的邻居评论区留言或私信我。' },
]

export const wonderfulList = [
    {
        id: 1,
        title: '社区重阳节敬老活动圆满举办',
        author: '物业宣传部',
        cover: 'https://picsum.photos/seed/ghj-wonderful-1/400/300',
        views: 1520,
        likes: 236,
        status: 1,
        create_time: daysAgo(5),
        content: `<h4>九九重阳，敬老情长</h4><p>10月11日上午，物业服务中心联合社区居委会在中心广场举办"重阳敬老·感恩相伴"主题活动，共有 120 余位老年业主参加。</p><p><img src="https://picsum.photos/seed/ghj-wonderful-1a/600/340" alt="重阳节敬老活动现场" style="max-width:100%;border-radius:8px;"/></p><h4>活动亮点回顾</h4><p>活动现场设置了免费健康义诊、理发服务、手工花艺三大体验区，社区文艺队为老人们带来了舞蹈《茉莉花》、戏曲联唱等精彩节目。</p><p>物业工作人员与志愿者一同为 30 位 80 岁以上老人送上重阳糕与鲜花，并入户走访慰问行动不便的高龄老人。</p><blockquote>尊老敬老是中华民族的传统美德，物业将把敬老活动做成常态，每月为老年业主提供一次便民服务日。</blockquote><p>感谢每一位参与活动的业主与志愿者，期待明年重阳再相聚！</p>`,
    },
    {
        id: 2,
        title: '业主才艺大赛精彩回顾',
        author: '物业宣传部',
        cover: 'https://picsum.photos/seed/ghj-wonderful-2/400/300',
        views: 980,
        likes: 158,
        status: 1,
        create_time: daysAgo(10),
        content: `<h4>舞台属于每一位邻居</h4><p>上周六晚，"邻里之星"业主才艺大赛决赛在中心广场圆满落幕，16 组选手登台献艺，现场观众超过 400 人。</p><p><img src="https://picsum.photos/seed/ghj-wonderful-2a/600/340" alt="才艺大赛决赛现场" style="max-width:100%;border-radius:8px;"/></p><h4>获奖名单</h4><p>经过评委打分与业主现场投票，最终评出：</p><ul><li>一等奖：3 栋 李阿姨 —— 葫芦丝独奏《月光下的凤尾竹》</li><li>二等奖：7 栋 小宇家庭 —— 亲子合唱《听妈妈的话》</li><li>三等奖：12 栋 王先生 —— 魔术表演《奇幻瞬间》</li></ul><h4>温馨致谢</h4><p>感谢社区文艺志愿者团队全程协办，也感谢物业客服中心提供的音响舞台支持。下一届才艺大赛预计明年春季举行，欢迎更多邻居报名参与！</p>`,
    },
    {
        id: 3,
        title: '托管班孩子们的绘画作品展示',
        author: '周建国',
        cover: 'https://picsum.photos/seed/ghj-wonderful-3/400/300',
        views: 645,
        likes: 98,
        status: 0,
        create_time: daysAgo(15),
        content: `<h4>童心绘世界</h4><p>本期社区四点半托管班以"我的小区我的家"为主题，组织孩子们开展绘画创作，共收到作品 28 幅。</p><p><img src="https://picsum.photos/seed/ghj-wonderful-3a/600/340" alt="托管班儿童绘画作品" style="max-width:100%;border-radius:8px;"/></p><p>孩子们用画笔描绘了小区的花园、滑梯和一起玩耍的小伙伴，稚嫩的笔触里满是对生活的观察与热爱。</p><p>作品已在社区活动中心一楼展出一周，欢迎各位家长带娃前往参观，为喜欢的小作者点赞投票。</p>`,
    },
]

export const noticeList = [
    {
        id: 1,
        title: '关于9月10日小区停水检修的通知',
        type: '物业通知',
        is_top: 1,
        views: 2103,
        status: 1,
        create_time: daysAgo(1),
        content: '<h4>停水检修安排</h4><p>因市政供水管网升级改造，本小区将于 <strong>9月10日（周四）09:00—17:00</strong> 暂停供水，进行二次供水泵房检修及水箱清洗消毒作业。</p><ul><li><strong>停水范围：</strong>小区全部楼栋（含商铺）</li><li><strong>预计恢复：</strong>9月10日 17:00 前逐步恢复</li><li><strong>施工影响：</strong>恢复供水初期可能出现短时水浑现象，请先放水 1-2 分钟后再使用</li></ul><h4>温馨提示</h4><p>请各位业主提前储水，关闭家中用水设备，避免恢复供水时跑水。独居老人及行动不便的住户如有用水需求，可联系物业服务中心，我们将安排专人送水上门。</p><blockquote>物业服务热线：0731-8888 6666（24小时）</blockquote>',
    },
    {
        id: 2,
        title: '中秋节社区游园活动报名开始',
        type: '活动通知',
        is_top: 0,
        views: 876,
        status: 1,
        create_time: daysAgo(2),
        content: '<h4>月满中秋 · 情聚顾好家</h4><p>一年一度的中秋游园会来啦！物业服务中心联合社区居委会，为业主们准备了一场热闹纷呈的中秋游园活动，诚邀全体业主携家人共同参与。</p><ul><li><strong>活动时间：</strong>9月15日（中秋节）18:30—21:00</li><li><strong>活动地点：</strong>小区中心广场</li><li><strong>报名方式：</strong>APP「活动中心」在线报名，或至物业前台登记</li><li><strong>报名截止：</strong>9月14日 18:00</li></ul><h4>活动亮点</h4><p>猜灯谜赢好礼、DIY 冰皮月饼、儿童手绘灯笼、露天电影《月光宝盒》，还有中秋茶话会与抽奖环节，惊喜大奖为全年物业费 8 折券。</p><p><img src="https://picsum.photos/seed/ghj-notice-2a/600/340" alt="中秋游园会" style="max-width:100%;border-radius:8px;" /></p>',
    },
    {
        id: 3,
        title: '台风预警温馨提示',
        type: '安全提示',
        is_top: 1,
        views: 3421,
        status: 1,
        create_time: daysAgo(3),
        content: '<h4>台风动态</h4><p>据气象部门预报，今年第 14 号台风将于 9月6日至7日 影响本市，届时将出现<strong>大到暴雨，阵风 8-10 级</strong>。请各位业主提前做好防风防雨准备。</p><h4>防范措施</h4><ul><li>检查并关好门窗，收回阳台悬挂物、花盆及杂物，防止高空坠物</li><li>减少不必要的外出，远离广告牌、临时搭建物及大树</li><li>车辆请勿停放在低洼路段及大树旁，避免水淹与砸损</li><li>备好手电筒、饮用水等应急物品，谨防停水停电</li></ul><h4>物业值守</h4><p>台风期间物业将安排 24 小时应急值守，工程班组全员待命，如遇紧急情况请第一时间联系物业服务中心。</p><blockquote>应急值班电话：0731-8888 6666 转 9</blockquote>',
    },
]

export const activityList = [
    {
        id: 1,
        title: '中秋游园会·猜灯谜赢好礼',
        cover: 'https://picsum.photos/seed/ghj-activity-1/400/300',
        signup: 186,
        limit: 300,
        start_time: daysAgo(-5),
        address: '小区中心广场',
        status: 1,
        create_time: daysAgo(3),
        content: '<h4>活动介绍</h4><p>花好月圆人团圆！中秋佳节来临之际，物业服务中心特举办<strong>「中秋游园会」</strong>主题活动，诚邀全体业主携家人朋友共度佳节，猜灯谜、赢好礼、赏明月！</p><h4>活动安排</h4><ul><li><strong>活动时间：</strong>本周六 18:30 - 21:00</li><li><strong>活动地点：</strong>小区中心广场（雨天移至架空层）</li><li><strong>报名方式：</strong>APP 内本页直接报名，或至物业服务中心前台登记</li><li><strong>报名截止：</strong>活动开始前 2 小时</li></ul><h4>活动亮点</h4><ul><li><strong>猜灯谜赢好礼：</strong>现场 200 条灯谜，猜中即可兑换月饼、毛巾、洗衣液等精美礼品</li><li><strong>亲子灯笼 DIY：</strong>免费提供手工材料，和孩子一起制作专属花灯</li><li><strong>中秋茶话会：</strong>品月饼、饮清茶，邻里相聚话家常</li><li><strong>幸运大抽奖：</strong>报名业主均可参与抽奖，一等奖为智能电饭煲一台</li></ul><h4>温馨提示</h4><p>现场设有签到处，请报名成功的业主凭<strong>报名成功截图</strong>签到领取号码牌；请照看好随行儿童，不要在人群密集处追逐打闹。</p><p style="text-align:center;"><img src="https://picsum.photos/seed/ghj-activity-1a/600/340" alt="中秋游园会" style="max-width:100%;border-radius:8px;" /></p><blockquote>咨询热线：0731-8888 6666（物业服务中心）</blockquote>',
    },
    {
        id: 2,
        title: '老年健康义诊进社区',
        cover: 'https://picsum.photos/seed/ghj-activity-2/400/300',
        signup: 92,
        limit: 150,
        start_time: daysAgo(-10),
        address: '社区服务站',
        status: 1,
        create_time: daysAgo(5),
        content: '<h4>活动背景</h4><p>为提升社区老年居民的健康意识，物业联合<strong>市第三人民医院</strong>开展「健康义诊进社区」公益活动，多名资深医师现场坐诊，为业主提供免费健康咨询服务。</p><h4>义诊项目</h4><ul><li><strong>基础体检：</strong>血压、血糖、心率测量，建立个人健康档案</li><li><strong>内科问诊：</strong>常见慢性病（高血压、糖尿病等）用药咨询与调理建议</li><li><strong>骨科咨询：</strong>颈肩腰腿痛、骨质疏松等老年常见骨病问诊</li><li><strong>中医理疗：</strong>穴位贴敷、艾灸体验，中医体质辨识</li></ul><h4>参与须知</h4><ul><li>活动时间：下周三上午 8:30 - 11:30</li><li>活动地点：社区服务站一楼大厅</li><li>请携带身份证或医保卡，便于建档</li><li>建议空腹前往，可免费测量空腹血糖</li><li>65 岁以上老人可优先就诊，行动不便者可联系物业安排志愿者陪同</li></ul><p>名额有限（150 人），报满即止，请尽快通过 APP 报名。</p><blockquote>咨询电话：0731-8888 6666 转 3（社区服务站）</blockquote>',
    },
    {
        id: 3,
        title: '周末亲子手工课（第12期）',
        cover: 'https://picsum.photos/seed/ghj-activity-3/400/300',
        signup: 40,
        limit: 40,
        start_time: daysAgo(2),
        address: '托管活动室',
        status: 0,
        create_time: daysAgo(20),
        content: '<h4>课程介绍</h4><p>「周末亲子手工课」是社区四点半课堂系列品牌活动，本期为<strong>第 12 期</strong>，主题为「非遗竹编小船」，由专业手工老师带领孩子们感受传统竹编技艺的魅力。</p><h4>课程安排</h4><ul><li><strong>上课时间：</strong>周六下午 14:30 - 16:00</li><li><strong>上课地点：</strong>托管活动室（3 栋架空层）</li><li><strong>适合年龄：</strong>4 - 10 岁儿童，须家长陪同</li><li><strong>材料费用：</strong>免费（由社区活动经费支持）</li></ul><h4>课堂流程</h4><ul><li>14:30 - 14:45 签到入场，领取材料包</li><li>14:45 - 15:30 老师示范竹编技法，亲子协作制作</li><li>15:30 - 15:50 作品展示与合影</li><li>15:50 - 16:00 整理收纳，颁发「小小手艺人」贴纸</li></ul><h4>温馨提示</h4><p>本期名额已报满，感谢大家的热情参与！后续将继续开设新一期课程，请关注 APP 首页活动预告。已报名家庭如无法到场，请提前在 APP 取消报名，将名额留给其他家庭。</p><p style="text-align:center;"><img src="https://picsum.photos/seed/ghj-activity-3a/600/340" alt="亲子手工课" style="max-width:100%;border-radius:8px;" /></p><blockquote>课程咨询：0731-8888 6666 转 5（四点半课堂）</blockquote>',
    },
]

// ==================== 生活帮手（用户提交的生活帮助表单） ====================
export const helperList = [
    {
        id: 1,
        type: '家电维修',
        avatar: 'https://picsum.photos/seed/ghj-user-1/100/100',
        nickname: '张伟',
        phone: '138****1001',
        building: '1栋1单元101',
        status: 0,
        handler: '',
        create_time: daysAgo(1, ' 09:15:00'),
        handle_time: '',
        images: ['https://picsum.photos/seed/ghj-helper-1a/600/400', 'https://picsum.photos/seed/ghj-helper-1b/600/400'],
        content: '<h4>求助描述</h4><p>家里客厅空调最近制冷效果很差，开机运行半小时出风口只有自然风，遥控器调到 16 度也没有变化。空调是格力挂机，购于 2019 年，平时使用正常，怀疑缺氟或者滤网堵塞，希望师傅尽快上门检查。</p><h4>期望上门时间</h4><p>工作日晚上 18:00 以后，或周末全天均可。</p><h4>备注</h4><p>家中有 3 岁小孩，天气热实在扛不住，麻烦物业尽快安排，谢谢！</p>',
    },
    {
        id: 2,
        type: '管道疏通',
        avatar: 'https://picsum.photos/seed/ghj-user-2/100/100',
        nickname: '李娜',
        phone: '138****1002',
        building: '1栋1单元102',
        status: 1,
        handler: '管理员·陈晓',
        create_time: daysAgo(3, ' 14:40:00'),
        handle_time: daysAgo(2, ' 16:20:00'),
        images: ['https://picsum.photos/seed/ghj-helper-2a/600/400'],
        content: '<h4>求助描述</h4><p>厨房下水道排水非常缓慢，洗菜盆积水下不去，还往上返味。已经尝试用管道疏通剂没有效果，怀疑主管道有油污堆积，需要专业师傅上门疏通。</p><h4>期望上门时间</h4><p>明天上午 9:00 - 11:00 之间。</p><h4>处理情况</h4><p>已联系物业安排疏通师傅上门处理，更换了存水弯并清理主管油污，排水恢复正常。</p>',
    },
    {
        id: 3,
        type: '开锁换锁',
        avatar: 'https://picsum.photos/seed/ghj-user-3/100/100',
        nickname: '王强',
        phone: '138****1003',
        building: '1栋1单元201',
        status: 1,
        handler: '楼管·刘敏',
        create_time: daysAgo(5, ' 20:05:00'),
        handle_time: daysAgo(5, ' 21:10:00'),
        images: [],
        content: '<h4>求助描述</h4><p>晚上回家发现入户门智能锁没电了，机械钥匙也一时找不到，被锁在门外。着急求助物业协调开锁师傅，本人可以提供房产证明和身份证核验身份。</p><h4>期望上门时间</h4><p>越快越好，人正在楼道里等。</p><h4>处理情况</h4><p>物业核实业主身份后联系合作开锁公司，师傅 40 分钟内到场开锁，已完成。</p>',
    },
    {
        id: 4,
        type: '保洁清洗',
        avatar: 'https://picsum.photos/seed/ghj-user-4/100/100',
        nickname: '赵敏',
        phone: '138****1004',
        building: '2栋1单元301',
        status: 0,
        handler: '',
        create_time: daysAgo(2, ' 11:30:00'),
        handle_time: '',
        images: ['https://picsum.photos/seed/ghj-helper-4a/600/400'],
        content: '<h4>求助描述</h4><p>想预约一次家里的深度保洁，重点清洁厨房重油污（灶台、油烟机）和卫生间水垢，三室两厅约 120 平，家里常驻 4 口人，希望安排 2 位保洁阿姨，一次做完。</p><h4>期望上门时间</h4><p>本周六或周日，上午开始。</p><h4>备注</h4><p>如价格合适，后续想固定每两周一次日常保洁。</p>',
    },
    {
        id: 5,
        type: '代买代办',
        avatar: 'https://picsum.photos/seed/ghj-user-5/100/100',
        nickname: '陈晨',
        phone: '138****1005',
        building: '3栋2单元502',
        status: 1,
        handler: '管理员·陈晓',
        create_time: daysAgo(7, ' 08:50:00'),
        handle_time: daysAgo(7, ' 10:05:00'),
        images: ['https://picsum.photos/seed/ghj-helper-5a/600/400'],
        content: '<h4>求助描述</h4><p>家中老人刚出院行动不便，需要帮忙去社区卫生服务中心代取慢性病药品（有处方单），并顺路在超市代买一些生活用品，费用可以线上支付或货到付款。</p><h4>期望上门时间</h4><p>今天下午 14:00 之后送到即可。</p><h4>处理情况</h4><p>已安排管家上门取处方单并代取代送，药品与生活用品已送达，费用已结算。</p>',
    },
    {
        id: 6,
        type: '家电维修',
        avatar: 'https://picsum.photos/seed/ghj-user-6/100/100',
        nickname: '刘洋',
        phone: '138****1006',
        building: '5栋1单元1103',
        status: 0,
        handler: '',
        create_time: daysAgo(1, ' 19:20:00'),
        handle_time: '',
        images: ['https://picsum.photos/seed/ghj-helper-6a/600/400', 'https://picsum.photos/seed/ghj-helper-6b/600/400'],
        content: '<h4>求助描述</h4><p>洗衣机脱水时噪音巨大且机身剧烈晃动，怀疑是减震器坏了或者衣物放置不平衡。已经重新放置衣物试过两次，问题依旧，需要师傅上门检修，可能需要更换配件。</p><h4>期望上门时间</h4><p>工作日白天都可以在家。</p><h4>备注</h4><p>洗衣机是小天鹅滚筒 10KG，购买超过 3 年，已过保。</p>',
    },
    {
        id: 7,
        type: '其他',
        avatar: 'https://picsum.photos/seed/ghj-user-7/100/100',
        nickname: '孙悦',
        phone: '138****1007',
        building: '2栋2单元801',
        status: 0,
        handler: '',
        create_time: daysAgo(1, ' 21:45:00'),
        handle_time: '',
        images: ['https://picsum.photos/seed/ghj-helper-7a/600/400'],
        content: '<h4>求助描述</h4><p>晚上发现阳台窗户密封条老化脱落，下雨天往屋里渗水，窗框边缘墙面已经出现水渍。自己暂时用胶带应急封堵，但担心周末有台风降雨，需要物业安排维修师傅更换密封条。</p><h4>期望上门时间</h4><p>本周内任何时间，越早越好。</p>',
    },
    {
        id: 8,
        type: '管道疏通',
        avatar: 'https://picsum.photos/seed/ghj-user-8/100/100',
        nickname: '周杰',
        phone: '138****1008',
        building: '3栋1单元404',
        status: 1,
        handler: '楼管·刘敏',
        create_time: daysAgo(10, ' 16:10:00'),
        handle_time: daysAgo(9, ' 11:30:00'),
        images: ['https://picsum.photos/seed/ghj-helper-8a/600/400'],
        content: '<h4>求助描述</h4><p>卫生间地漏下水缓慢，淋浴时积水没过脚踝，浴缸排水同样不畅，判断可能是毛发堵塞。家里有老人，希望尽快处理避免滑倒风险。</p><h4>期望上门时间</h4><p>上午或傍晚均可，提前电话联系。</p><h4>处理情况</h4><p>师傅上门清理地漏与浴缸下水毛发堆积，并做了管道养护，排水已恢复通畅。</p>',
    },
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
