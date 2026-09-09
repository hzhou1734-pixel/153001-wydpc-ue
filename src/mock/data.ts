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

/** 日期辅助：基于当前时间偏移 n 天（正数为未来） */
function dateOffset(n: number) {
    const d = new Date()
    d.setDate(d.getDate() + n)
    const pad = (v: number) => String(v).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
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
    {
        id: 4, name: '4栋', community_id: 1, community_name: '颐景园·江南里',
        children: [
            { id: 401, name: '1单元', parent_id: 4, type: 'unit' },
            { id: 402, name: '2单元', parent_id: 4, type: 'unit' },
        ],
    },
    {
        id: 5, name: '5栋', community_id: 1, community_name: '颐景园·江南里',
        children: [
            { id: 501, name: '1单元', parent_id: 5, type: 'unit' },
            { id: 502, name: '2单元', parent_id: 5, type: 'unit' },
        ],
    },
    {
        id: 6, name: '6栋', community_id: 1, community_name: '颐景园·江南里',
        children: [
            { id: 601, name: '1单元', parent_id: 6, type: 'unit' },
            { id: 602, name: '2单元', parent_id: 6, type: 'unit' },
        ],
    },
    {
        id: 7, name: '7栋', community_id: 1, community_name: '颐景园·江南里',
        children: [
            { id: 701, name: '1单元', parent_id: 7, type: 'unit' },
            { id: 702, name: '2单元', parent_id: 7, type: 'unit' },
        ],
    },
    {
        id: 8, name: '8栋', community_id: 1, community_name: '颐景园·江南里',
        children: [
            { id: 801, name: '1单元', parent_id: 8, type: 'unit' },
            { id: 802, name: '2单元', parent_id: 8, type: 'unit' },
        ],
    },
    {
        id: 9, name: '9栋', community_id: 1, community_name: '颐景园·江南里',
        children: [
            { id: 901, name: '1单元', parent_id: 9, type: 'unit' },
            { id: 902, name: '2单元', parent_id: 9, type: 'unit' },
        ],
    },
    {
        id: 10, name: '10栋', community_id: 1, community_name: '颐景园·江南里',
        children: [
            { id: 1001, name: '1单元', parent_id: 10, type: 'unit' },
            { id: 1002, name: '2单元', parent_id: 10, type: 'unit' },
        ],
    },
    {
        id: 13, name: '11栋', community_id: 1, community_name: '颐景园·江南里',
        children: [
            { id: 1301, name: '1单元', parent_id: 13, type: 'unit' },
            { id: 1302, name: '2单元', parent_id: 13, type: 'unit' },
        ],
    },
    {
        id: 14, name: '12栋', community_id: 1, community_name: '颐景园·江南里',
        children: [
            { id: 1401, name: '1单元', parent_id: 14, type: 'unit' },
            { id: 1402, name: '2单元', parent_id: 14, type: 'unit' },
        ],
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

// 房号数据：覆盖 5 个小区，certified 与 certifyList 的认证审核状态保持一致
export const roomList = [
    // 颐景园·江南里 1栋（1单元 101 / 2单元 102）
    { id: 1, name: '101', unit_id: 101, building_id: 1, owner: '张伟', phone: '13812341001', certified: 0 },
    { id: 2, name: '102', unit_id: 101, building_id: 1, owner: '李娜', phone: '13812341002', certified: 1 },
    { id: 3, name: '201', unit_id: 101, building_id: 1, owner: '王强', phone: '13812341003', certified: 0 },
    { id: 6, name: '202', unit_id: 101, building_id: 1, owner: '周明华', phone: '13812341011', certified: 1 },
    { id: 7, name: '301', unit_id: 101, building_id: 1, owner: '吴桂英', phone: '13812341012', certified: 1 },
    { id: 8, name: '302', unit_id: 101, building_id: 1, owner: '郑国强', phone: '13812341013', certified: 0 },
    { id: 4, name: '101', unit_id: 102, building_id: 1, owner: '赵敏', phone: '13812341004', certified: 0 },
    { id: 9, name: '102', unit_id: 102, building_id: 1, owner: '冯淑华', phone: '13812341014', certified: 1 },
    { id: 10, name: '201', unit_id: 102, building_id: 1, owner: '蒋文斌', phone: '13812341015', certified: 1 },
    { id: 11, name: '301', unit_id: 102, building_id: 1, owner: '韩雪梅', phone: '13812341016', certified: 0 },
    // 颐景园·江南里 2栋（1单元 201 / 2单元 202）
    { id: 5, name: '201', unit_id: 201, building_id: 2, owner: '陈晨', phone: '13812341005', certified: 1 },
    { id: 12, name: '202', unit_id: 201, building_id: 2, owner: '沈国庆', phone: '13812341017', certified: 1 },
    { id: 13, name: '301', unit_id: 201, building_id: 2, owner: '曹丽萍', phone: '13812341018', certified: 0 },
    { id: 14, name: '101', unit_id: 202, building_id: 2, owner: '谢天华', phone: '13812341019', certified: 1 },
    { id: 15, name: '102', unit_id: 202, building_id: 2, owner: '罗建平', phone: '13812341020', certified: 1 },
    // 颐景园·江南里 3栋（1单元 301）
    { id: 16, name: '101', unit_id: 301, building_id: 3, owner: '高志远', phone: '13812341021', certified: 1 },
    { id: 17, name: '102', unit_id: 301, building_id: 3, owner: '林秀珍', phone: '13812341022', certified: 1 },
    { id: 18, name: '201', unit_id: 301, building_id: 3, owner: '何俊杰', phone: '13812341023', certified: 0 },
    // 颐景园·江南里 4栋（1单元 401 / 2单元 402）
    { id: 19, name: '101', unit_id: 401, building_id: 4, owner: '梁国庆', phone: '13812341024', certified: 1 },
    { id: 20, name: '102', unit_id: 401, building_id: 4, owner: '宋雅琴', phone: '13812341025', certified: 1 },
    { id: 21, name: '201', unit_id: 401, building_id: 4, owner: '唐建军', phone: '13812341026', certified: 0 },
    { id: 22, name: '101', unit_id: 402, building_id: 4, owner: '许桂兰', phone: '13812341027', certified: 1 },
    // 颐景园·江南里 5栋（1单元 501 / 2单元 502）
    { id: 23, name: '101', unit_id: 501, building_id: 5, owner: '邓世昌', phone: '13812341028', certified: 1 },
    { id: 24, name: '102', unit_id: 501, building_id: 5, owner: '萧慧敏', phone: '13812341029', certified: 0 },
    { id: 25, name: '201', unit_id: 501, building_id: 5, owner: '程志刚', phone: '13812341030', certified: 1 },
    { id: 26, name: '101', unit_id: 502, building_id: 5, owner: '侯丽娟', phone: '13812341031', certified: 1 },
    // 颐景园·江南里 6栋（1单元 601 / 2单元 602）
    { id: 27, name: '101', unit_id: 601, building_id: 6, owner: '白云飞', phone: '13812341032', certified: 1 },
    { id: 28, name: '102', unit_id: 601, building_id: 6, owner: '石秀英', phone: '13812341033', certified: 1 },
    { id: 29, name: '201', unit_id: 602, building_id: 6, owner: '姚建国', phone: '13812341034', certified: 0 },
    // 颐景园·江南里 7栋（1单元 701 / 2单元 702）
    { id: 30, name: '101', unit_id: 701, building_id: 7, owner: '贺永康', phone: '13812341035', certified: 1 },
    { id: 31, name: '102', unit_id: 701, building_id: 7, owner: '卢春花', phone: '13812341036', certified: 1 },
    { id: 32, name: '201', unit_id: 702, building_id: 7, owner: '钱进', phone: '13812341037', certified: 1 },
    // 颐景园·江南里 8栋（1单元 801 / 2单元 802）
    { id: 33, name: '101', unit_id: 801, building_id: 8, owner: '汪海洋', phone: '13812341038', certified: 1 },
    { id: 34, name: '102', unit_id: 801, building_id: 8, owner: '傅明霞', phone: '13812341039', certified: 0 },
    { id: 35, name: '101', unit_id: 802, building_id: 8, owner: '尹德海', phone: '13812341040', certified: 1 },
    // 颐景园·江南里 9栋（1单元 901 / 2单元 902）
    { id: 36, name: '101', unit_id: 901, building_id: 9, owner: '董国梁', phone: '13812341041', certified: 1 },
    { id: 37, name: '102', unit_id: 901, building_id: 9, owner: '潘丽华', phone: '13812341042', certified: 1 },
    { id: 38, name: '201', unit_id: 902, building_id: 9, owner: '万启明', phone: '13812341043', certified: 0 },
    // 颐景园·江南里 10栋（1单元 1001 / 2单元 1002）
    { id: 39, name: '101', unit_id: 1001, building_id: 10, owner: '杜文昌', phone: '13812341044', certified: 1 },
    { id: 40, name: '102', unit_id: 1001, building_id: 10, owner: '苏美玲', phone: '13812341045', certified: 1 },
    { id: 41, name: '101', unit_id: 1002, building_id: 10, owner: '丁秀兰', phone: '13812341046', certified: 1 },
    // 颐景园·江南里 11栋（1单元 1301 / 2单元 1302）
    { id: 42, name: '101', unit_id: 1301, building_id: 13, owner: '范长青', phone: '13812341047', certified: 1 },
    { id: 43, name: '102', unit_id: 1301, building_id: 13, owner: '曾丽珍', phone: '13812341048', certified: 1 },
    { id: 44, name: '101', unit_id: 1302, building_id: 13, owner: '彭思远', phone: '13812341049', certified: 0 },
    // 颐景园·江南里 12栋（1单元 1401 / 2单元 1402）
    { id: 45, name: '101', unit_id: 1401, building_id: 14, owner: '董雅静', phone: '13812341050', certified: 1 },
    { id: 46, name: '102', unit_id: 1401, building_id: 14, owner: '袁浩然', phone: '13812341051', certified: 1 },
    { id: 47, name: '101', unit_id: 1402, building_id: 14, owner: '蔡文静', phone: '13812341052', certified: 1 },
    // 绿城·桂语江南（1栋 1101/1102 单元，2栋 1201/1202 单元）
    { id: 48, name: '301', unit_id: 1201, building_id: 12, owner: '赵敏', phone: '13812341004', certified: 0 },
    { id: 49, name: '101', unit_id: 1101, building_id: 11, owner: '孙晓峰', phone: '13812341053', certified: 1 },
    { id: 50, name: '201', unit_id: 1101, building_id: 11, owner: '马春丽', phone: '13812341054', certified: 1 },
    { id: 51, name: '102', unit_id: 1102, building_id: 11, owner: '朱海涛', phone: '13812341055', certified: 1 },
    { id: 52, name: '201', unit_id: 1202, building_id: 12, owner: '胡佳琪', phone: '13812341056', certified: 0 },
    // 保利·天悦湾（1栋 2101、2栋 2201/2202、3栋 2301/2302 单元）
    { id: 53, name: '502', unit_id: 2302, building_id: 23, owner: '陈晨', phone: '13812341005', certified: 1 },
    { id: 54, name: '101', unit_id: 2101, building_id: 21, owner: '郭子豪', phone: '13812341057', certified: 1 },
    { id: 55, name: '102', unit_id: 2101, building_id: 21, owner: '邱美凤', phone: '13812341058', certified: 1 },
    { id: 56, name: '101', unit_id: 2201, building_id: 22, owner: '华志明', phone: '13812341059', certified: 0 },
    { id: 57, name: '201', unit_id: 2202, building_id: 22, owner: '金雅婷', phone: '13812341060', certified: 1 },
    { id: 58, name: '101', unit_id: 2301, building_id: 23, owner: '洪天佑', phone: '13812341061', certified: 1 },
    // 万科·未来城三期（5栋 3501/3502、6栋 3601 单元）
    { id: 59, name: '1103', unit_id: 3501, building_id: 35, owner: '刘洋', phone: '13812341006', certified: 1 },
    { id: 60, name: '101', unit_id: 3501, building_id: 35, owner: '秦晓东', phone: '13812341062', certified: 1 },
    { id: 61, name: '102', unit_id: 3502, building_id: 35, owner: '顾月华', phone: '13812341063', certified: 1 },
    { id: 62, name: '101', unit_id: 3601, building_id: 36, owner: '蓝天翔', phone: '13812341064', certified: 0 },
    // 融创·金成府（1栋 4101/4102、2栋 4201 单元）
    { id: 63, name: '101', unit_id: 4101, building_id: 41, owner: '葛志成', phone: '13812341065', certified: 1 },
    { id: 64, name: '102', unit_id: 4102, building_id: 41, owner: '章慧珍', phone: '13812341066', certified: 1 },
    { id: 65, name: '201', unit_id: 4201, building_id: 42, owner: '温子墨', phone: '13812341067', certified: 1 },
]

// ==================== 认证列表（仅业主认证，家属/租户不做认证） ====================
export const certifyList = [
    { id: 1, user_id: 1, nickname: '张伟', mobile: '13812341001', community: '颐景园·江南里', building: '1栋', unit: '1单元', room: '101', type: '业主', status: 0, create_time: daysAgo(1) },
    { id: 2, user_id: 2, nickname: '李娜', mobile: '13812341002', community: '颐景园·江南里', building: '1栋', unit: '1单元', room: '102', type: '业主', status: 1, create_time: daysAgo(3) },
    { id: 3, user_id: 5, nickname: '陈晨', mobile: '13812341005', community: '保利·天悦湾', building: '3栋', unit: '2单元', room: '502', type: '业主', status: 1, create_time: daysAgo(7) },
    { id: 4, user_id: 3, nickname: '王强', mobile: '13812341003', community: '颐景园·江南里', building: '1栋', unit: '1单元', room: '201', type: '业主', status: 0, create_time: daysAgo(2) },
    { id: 5, user_id: 11, nickname: '周明华', mobile: '13812341011', community: '颐景园·江南里', building: '1栋', unit: '1单元', room: '202', type: '业主', status: 1, create_time: daysAgo(20) },
    { id: 6, user_id: 12, nickname: '沈国庆', mobile: '13812341017', community: '颐景园·江南里', building: '2栋', unit: '1单元', room: '202', type: '业主', status: 1, create_time: daysAgo(25) },
    { id: 7, user_id: 13, nickname: '孙晓峰', mobile: '13812341053', community: '绿城·桂语江南', building: '1栋', unit: '1单元', room: '101', type: '业主', status: 1, create_time: daysAgo(30) },
    { id: 8, user_id: 4, nickname: '赵敏', mobile: '13812341004', community: '绿城·桂语江南', building: '2栋', unit: '1单元', room: '301', type: '业主', status: 0, create_time: daysAgo(4) },
    { id: 9, user_id: 14, nickname: '郭子豪', mobile: '13812341057', community: '保利·天悦湾', building: '1栋', unit: '1单元', room: '101', type: '业主', status: 1, create_time: daysAgo(30) },
    { id: 10, user_id: 6, nickname: '刘洋', mobile: '13812341006', community: '万科·未来城三期', building: '5栋', unit: '1单元', room: '1103', type: '业主', status: 1, create_time: daysAgo(12) },
    { id: 11, user_id: 15, nickname: '秦晓东', mobile: '13812341062', community: '万科·未来城三期', building: '5栋', unit: '1单元', room: '101', type: '业主', status: 1, create_time: daysAgo(45) },
    { id: 12, user_id: 16, nickname: '葛志成', mobile: '13812341065', community: '融创·金成府', building: '1栋', unit: '1单元', room: '101', type: '业主', status: 1, create_time: daysAgo(50) },
]

// ==================== 用户 ====================
export const consumerList = [
    { id: 1, nickname: '张伟', avatar: 'https://picsum.photos/seed/ghj-user-1/100/100', mobile: '13812341001', community: '颐景园·江南里', room: '1栋1单元101', certified: 0, orders: 23, unsettled_amount: '316.00', settled_amount: '18650.00', status: 1, create_time: daysAgo(180) },
    { id: 2, nickname: '李娜', avatar: 'https://picsum.photos/seed/ghj-user-2/100/100', mobile: '13812341002', community: '颐景园·江南里', room: '1栋1单元102', certified: 1, orders: 15, unsettled_amount: '28.00', settled_amount: '9420.00', status: 1, create_time: daysAgo(165) },
    { id: 3, nickname: '王强', avatar: 'https://picsum.photos/seed/ghj-user-3/100/100', mobile: '13812341003', community: '颐景园·江南里', room: '1栋1单元201', certified: 0, orders: 8, unsettled_amount: '0.00', settled_amount: '3280.00', status: 1, create_time: daysAgo(120) },
    { id: 4, nickname: '赵敏', avatar: 'https://picsum.photos/seed/ghj-user-4/100/100', mobile: '13812341004', community: '绿城·桂语江南', room: '2栋1单元301', certified: 0, orders: 3, unsettled_amount: '0.00', settled_amount: '1180.00', status: 1, create_time: daysAgo(90) },
    { id: 5, nickname: '陈晨', avatar: 'https://picsum.photos/seed/ghj-user-5/100/100', mobile: '13812341005', community: '保利·天悦湾', room: '3栋2单元502', certified: 1, orders: 46, unsettled_amount: '540.00', settled_amount: '32140.00', status: 0, create_time: daysAgo(60) },
    { id: 6, nickname: '刘洋', avatar: 'https://picsum.photos/seed/ghj-user-6/100/100', mobile: '13812341006', community: '万科·未来城三期', room: '5栋1单元1103', certified: 1, orders: 12, unsettled_amount: '150.00', settled_amount: '6890.00', status: 1, create_time: daysAgo(30) },
]

// ==================== 员工 ====================
export const staffList = [
    { id: 1, name: '周建国', avatar: 'https://picsum.photos/seed/ghj-staff-1/100/100', mobile: '13912342001', role: '托管员', role_id: 1, community: '颐景园·江南里', buildings: '1栋、2栋', orders: 156, earnings: '8632.00', status: 1, create_time: daysAgo(200) },
    { id: 2, name: '吴秀兰', avatar: 'https://picsum.photos/seed/ghj-staff-2/100/100', mobile: '13912342002', role: '配送员', role_id: 2, community: '颐景园·江南里', buildings: '-', orders: 342, earnings: '10240.50', status: 1, create_time: daysAgo(190) },
    { id: 3, name: '郑海涛', avatar: 'https://picsum.photos/seed/ghj-staff-3/100/100', mobile: '13912342003', role: '陪诊员', role_id: 3, community: '绿城·桂语江南', buildings: '-', orders: 87, earnings: '6976.00', status: 1, create_time: daysAgo(150) },
    { id: 4, name: '孙丽华', avatar: 'https://picsum.photos/seed/ghj-staff-4/100/100', mobile: '13912342004', role: '楼栋管理员', role_id: 4, community: '保利·天悦湾', buildings: '3栋', orders: 0, earnings: '4200.00', status: 1, create_time: daysAgo(100) },
    { id: 5, name: '马长顺', avatar: 'https://picsum.photos/seed/ghj-staff-5/100/100', mobile: '13912342005', role: '托管员', role_id: 1, community: '万科·未来城三期', buildings: '5栋、6栋', orders: 203, earnings: '11218.00', status: 0, create_time: daysAgo(80) },
    { id: 6, name: '陈美玲', avatar: 'https://picsum.photos/seed/ghj-staff-6/100/100', mobile: '13912342006', role: '托管员', role_id: 1, community: '保利·天悦湾', buildings: '3栋、4栋', orders: 96, earnings: '5480.00', status: 1, create_time: daysAgo(120) },
    { id: 7, name: '徐国强', avatar: 'https://picsum.photos/seed/ghj-staff-7/100/100', mobile: '13912342007', role: '托管员', role_id: 1, community: '绿城·桂语江南', buildings: '2栋', orders: 74, earnings: '4320.00', status: 1, create_time: daysAgo(95) },
    { id: 8, name: '何秀芳', avatar: 'https://picsum.photos/seed/ghj-staff-8/100/100', mobile: '13912342008', role: '配送员', role_id: 2, community: '保利·天悦湾', buildings: '-', orders: 210, earnings: '7320.00', status: 1, create_time: daysAgo(110) },
    { id: 9, name: '李文斌', avatar: 'https://picsum.photos/seed/ghj-staff-9/100/100', mobile: '13912342009', role: '配送员', role_id: 2, community: '万科·未来城三期', buildings: '-', orders: 168, earnings: '6210.00', status: 1, create_time: daysAgo(88) },
    { id: 10, name: '郭敏', avatar: 'https://picsum.photos/seed/ghj-staff-10/100/100', mobile: '13912342010', role: '陪诊员', role_id: 3, community: '万科·未来城三期', buildings: '-', orders: 65, earnings: '5200.00', status: 1, create_time: daysAgo(76) },
    { id: 11, name: '田雅静', avatar: 'https://picsum.photos/seed/ghj-staff-11/100/100', mobile: '13912342011', role: '陪诊员', role_id: 3, community: '保利·天悦湾', buildings: '-', orders: 48, earnings: '4320.00', status: 1, create_time: daysAgo(64) },
]

// ==================== 服务 ====================
export const nursingServices = [
    { id: 1, name: '日托·9月第一期', type: '日托', price: '80.00', start_time: '2026-09-01', end_time: '2026-09-30', signup_count: 26, status: 1, sort: 1, create_time: daysAgo(28, ' 09:20:00') },
    { id: 2, name: '日托·10月第二期', type: '日托', price: '80.00', start_time: '2026-10-01', end_time: '2026-10-31', signup_count: 12, status: 1, sort: 2, create_time: daysAgo(20, ' 14:05:00') },
    { id: 3, name: '日托·暑期托管班', type: '日托', price: '90.00', start_time: '2026-07-01', end_time: '2026-08-31', signup_count: 64, status: 1, sort: 3, create_time: daysAgo(70, ' 10:12:00') },
    { id: 4, name: '学期每日托·2026秋季', type: '学期每日托', price: '2600.00', start_time: '2026-09-01', end_time: '2027-01-20', signup_count: 38, status: 1, sort: 4, create_time: daysAgo(35, ' 08:40:00') },
    { id: 5, name: '学期每日托·江南里专属班', type: '学期每日托', price: '2400.00', start_time: '2026-09-05', end_time: '2027-01-15', signup_count: 15, status: 1, sort: 5, create_time: daysAgo(30, ' 16:22:00') },
    { id: 6, name: '学期每日托·2026春季', type: '学期每日托', price: '2600.00', start_time: '2026-02-20', end_time: '2026-07-05', signup_count: 52, status: 0, sort: 6, create_time: daysAgo(190, ' 09:00:00') },
    { id: 7, name: '学期周末托·周六班', type: '学期周末托', price: '1200.00', start_time: '2026-09-12', end_time: '2027-01-16', signup_count: 20, status: 1, sort: 7, create_time: daysAgo(24, ' 11:35:00') },
    { id: 8, name: '学期周末托·周日班', type: '学期周末托', price: '1200.00', start_time: '2026-09-13', end_time: '2027-01-17', signup_count: 9, status: 0, sort: 8, create_time: daysAgo(18, ' 15:48:00') },
]

/** 陪诊服务单价设置（按小时计费） */
export const escortPriceSetting = {
    hour_price: '120.00',
    min_hours: 2,
    remark: '不足 1 小时按 1 小时计费，超出部分按实际时长折算',
}

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

/** 膳食套餐组合：按组合固定价售卖（如选 ABC 一个价、选 BCD 另一个价） */
export const mealCombos = [
    { id: 1, name: 'ABC 经典午餐组合', dish_ids: [1, 2, 3], price: '55.00', status: 1, sort: 1, update_time: daysAgo(0, ' 07:30:00') },
    { id: 2, name: '双荤商务午餐组合', dish_ids: [1, 2], price: '45.00', status: 1, sort: 2, update_time: daysAgo(1, ' 07:10:00') },
    { id: 3, name: '清淡养身晚餐组合', dish_ids: [3, 4], price: '28.00', status: 1, sort: 3, update_time: daysAgo(1, ' 16:40:00') },
    { id: 4, name: '早餐 + 午餐全天组合', dish_ids: [5, 1], price: '29.00', status: 1, sort: 4, update_time: daysAgo(2, ' 06:50:00') },
    { id: 5, name: '全日三餐组合', dish_ids: [5, 2, 4], price: '52.00', status: 0, sort: 5, update_time: daysAgo(3, ' 08:20:00') },
    { id: 6, name: '低糖轻食组合', dish_ids: [4, 5], price: '24.00', status: 1, sort: 6, update_time: daysAgo(4, ' 09:05:00') },
]

/** 每日菜单：按日期配置当天供应的套餐组合 */
export const dailyMenus = [
    { date: dateOffset(0), combo_ids: [1, 2, 3] },
    { date: dateOffset(1), combo_ids: [1, 3, 4, 6] },
    { date: dateOffset(-1), combo_ids: [2, 3, 5] },
    { date: dateOffset(-2), combo_ids: [1, 4] },
]

// ==================== 订单 ====================
export const nursingOrders = [
    { id: 1001, sn: 'TG20260908001', service: '日托·9月第一期', type: '日托', price: '80.00', amount: '80.00', avatar: 'https://picsum.photos/seed/ghj-user-1/100/100', nickname: '张伟', mobile: '13812341001', community: '颐景园·江南里', building: '1栋1单元101', need_pickup: 1, pickup_time: '每日 08:00 上门接', contact_name: '张伟', contact_mobile: '13812341001', address: '颐景园·江南里 1栋1单元101', payer_name: '张伟', payer_mobile: '13812341001', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(0, ' 09:13:05'), status: 2, create_time: daysAgo(0, ' 09:12:00'), staff: '周建国', staff_id: 1, logs: [ { time: daysAgo(0, ' 09:12:00'), content: '用户提交托管订单', operator: '张伟' }, { time: daysAgo(0, ' 09:13:05'), content: '微信支付成功 ¥80.00', operator: '系统' }, { time: daysAgo(0, ' 09:25:00'), content: '已派单给托管员 周建国', operator: '物业管理员' } ] },
    { id: 1002, sn: 'TG20260907002', service: '日托·9月第一期', type: '日托', price: '80.00', amount: '80.00', avatar: 'https://picsum.photos/seed/ghj-user-2/100/100', nickname: '李娜', mobile: '13812341002', community: '颐景园·江南里', building: '1栋1单元102', need_pickup: 1, pickup_time: '每日 08:10 上门接', contact_name: '李娜', contact_mobile: '13812341002', address: '颐景园·江南里 1栋1单元102', payer_name: '李娜', payer_mobile: '13812341002', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(1, ' 08:41:12'), status: 3, create_time: daysAgo(1, ' 08:40:00'), staff: '周建国', staff_id: 1, logs: [ { time: daysAgo(1, ' 08:40:00'), content: '用户提交托管订单', operator: '李娜' }, { time: daysAgo(1, ' 08:41:12'), content: '微信支付成功 ¥80.00', operator: '系统' }, { time: daysAgo(1, ' 18:05:00'), content: '托管员 周建国 完成服务，订单完成', operator: '周建国' } ] },
    { id: 1003, sn: 'TG20260906003', service: '学期每日托·2026秋季', type: '学期每日托', price: '2600.00', amount: '2600.00', avatar: 'https://picsum.photos/seed/ghj-user-5/100/100', nickname: '陈晨', mobile: '13812341005', community: '保利·天悦湾', building: '3栋2单元502', need_pickup: 1, pickup_time: '工作日 07:40 上门接', contact_name: '陈晨', contact_mobile: '13812341005', address: '保利·天悦湾 3栋2单元502', payer_name: '陈晨', payer_mobile: '13812341005', payer_relation: '本人', pay_status: 1, pay_type: '支付宝', pay_time: daysAgo(2, ' 16:06:30'), status: 2, create_time: daysAgo(2, ' 16:05:00'), staff: '陈美玲', staff_id: 6, logs: [ { time: daysAgo(2, ' 16:05:00'), content: '用户提交托管订单', operator: '陈晨' }, { time: daysAgo(2, ' 16:06:30'), content: '支付宝支付成功 ¥2600.00', operator: '系统' }, { time: daysAgo(2, ' 16:30:00'), content: '已派单给托管员 陈美玲', operator: '物业管理员' } ] },
    { id: 1004, sn: 'TG20260905004', service: '日托·9月第一期', type: '日托', price: '80.00', amount: '80.00', avatar: 'https://picsum.photos/seed/ghj-user-6/100/100', nickname: '刘洋', mobile: '13812341006', community: '万科·未来城三期', building: '5栋1单元1103', need_pickup: 0, pickup_time: '', contact_name: '刘洋', contact_mobile: '13812341006', address: '万科·未来城三期 5栋1单元1103', payer_name: '刘洋', payer_mobile: '13812341006', payer_relation: '本人', pay_status: 0, pay_type: '', pay_time: '', status: 0, create_time: daysAgo(3, ' 11:30:00'), staff: '', staff_id: 0, logs: [ { time: daysAgo(3, ' 11:30:00'), content: '用户提交托管订单，等待支付', operator: '刘洋' } ] },
    { id: 1005, sn: 'TG20260904005', service: '学期周末托·周六班', type: '学期周末托', price: '1200.00', amount: '1200.00', avatar: 'https://picsum.photos/seed/ghj-user-3/100/100', nickname: '王强', mobile: '13812341003', community: '颐景园·江南里', building: '1栋1单元201', need_pickup: 1, pickup_time: '每周六 08:30 上门接', contact_name: '王强', contact_mobile: '13812341003', address: '颐景园·江南里 1栋1单元201', payer_name: '王强', payer_mobile: '13812341003', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(4, ' 10:01:20'), status: 1, create_time: daysAgo(4, ' 10:00:00'), staff: '', staff_id: 0, logs: [ { time: daysAgo(4, ' 10:00:00'), content: '用户提交托管订单', operator: '王强' }, { time: daysAgo(4, ' 10:01:20'), content: '微信支付成功 ¥1200.00', operator: '系统' } ] },
    { id: 1006, sn: 'TG20260903006', service: '日托·暑期托管班', type: '日托', price: '90.00', amount: '90.00', avatar: 'https://picsum.photos/seed/ghj-user-4/100/100', nickname: '赵敏', mobile: '13812341004', community: '绿城·桂语江南', building: '2栋1单元301', need_pickup: 0, pickup_time: '', contact_name: '赵敏', contact_mobile: '13812341004', address: '绿城·桂语江南 2栋1单元301', payer_name: '赵敏', payer_mobile: '13812341004', payer_relation: '本人', pay_status: 1, pay_type: '支付宝', pay_time: daysAgo(5, ' 09:05:10'), status: 3, create_time: daysAgo(5, ' 09:02:00'), staff: '徐国强', staff_id: 7, logs: [ { time: daysAgo(5, ' 09:02:00'), content: '用户提交托管订单', operator: '赵敏' }, { time: daysAgo(5, ' 09:05:10'), content: '支付宝支付成功 ¥90.00', operator: '系统' }, { time: daysAgo(5, ' 18:20:00'), content: '托管员 徐国强 完成服务，订单完成', operator: '徐国强' } ] },
    { id: 1007, sn: 'TG20260902007', service: '学期每日托·江南里专属班', type: '学期每日托', price: '2400.00', amount: '2400.00', avatar: 'https://picsum.photos/seed/ghj-user-1/100/100', nickname: '张伟', mobile: '13812341001', community: '颐景园·江南里', building: '1栋1单元101', need_pickup: 0, pickup_time: '', contact_name: '张伟', contact_mobile: '13812341001', address: '颐景园·江南里 1栋1单元101', payer_name: '张伟', payer_mobile: '13812341001', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(6, ' 20:12:00'), status: 4, create_time: daysAgo(6, ' 20:10:00'), staff: '', staff_id: 0, logs: [ { time: daysAgo(6, ' 20:10:00'), content: '用户提交托管订单', operator: '张伟' }, { time: daysAgo(6, ' 20:12:00'), content: '微信支付成功 ¥2400.00', operator: '系统' }, { time: daysAgo(5, ' 09:00:00'), content: '用户申请取消，费用已原路退回', operator: '物业管理员' } ] },
    { id: 1008, sn: 'TG20260901008', service: '学期周末托·周日班', type: '学期周末托', price: '1200.00', amount: '1200.00', avatar: 'https://picsum.photos/seed/ghj-user-2/100/100', nickname: '李娜', mobile: '13812341002', community: '颐景园·江南里', building: '1栋1单元102', need_pickup: 1, pickup_time: '每周日 08:30 上门接', contact_name: '李娜', contact_mobile: '13812341002', address: '颐景园·江南里 1栋1单元102', payer_name: '李娜', payer_mobile: '13812341002', payer_relation: '为家人下单', pay_status: 0, pay_type: '', pay_time: '', status: 0, create_time: daysAgo(7, ' 15:20:00'), staff: '', staff_id: 0, logs: [ { time: daysAgo(7, ' 15:20:00'), content: '用户提交托管订单，等待支付', operator: '李娜' } ] },
]

export const mealOrders = [
    { id: 2001, sn: 'SC20260908001', combo: 'ABC 经典午餐组合', dishes: '红烧狮子头套餐、清蒸鲈鱼套餐、香菇滑鸡粥', quantity: 1, price: '55.00', amount: '55.00', avatar: 'https://picsum.photos/seed/ghj-user-1/100/100', nickname: '张伟', mobile: '13812341001', community: '颐景园·江南里', building: '1栋1单元101', need_delivery: 1, delivery_time: '11:30 前送达', contact_name: '张伟', contact_mobile: '13812341001', address: '颐景园·江南里 1栋1单元101', payer_name: '张伟', payer_mobile: '13812341001', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(0, ' 10:46:08'), status: 2, create_time: daysAgo(0, ' 10:45:00'), staff: '吴秀兰', staff_id: 2, logs: [ { time: daysAgo(0, ' 10:45:00'), content: '用户提交膳食订单', operator: '张伟' }, { time: daysAgo(0, ' 10:46:08'), content: '微信支付成功 ¥55.00', operator: '系统' }, { time: daysAgo(0, ' 10:52:00'), content: '已派单给配送员 吴秀兰', operator: '物业管理员' } ] },
    { id: 2002, sn: 'SC20260907002', combo: '双荤商务午餐组合', dishes: '红烧狮子头套餐、清蒸鲈鱼套餐', quantity: 1, price: '45.00', amount: '45.00', avatar: 'https://picsum.photos/seed/ghj-user-2/100/100', nickname: '李娜', mobile: '13812341002', community: '颐景园·江南里', building: '1栋1单元102', need_delivery: 1, delivery_time: '11:45 前送达', contact_name: '李娜', contact_mobile: '13812341002', address: '颐景园·江南里 1栋1单元102', payer_name: '李娜', payer_mobile: '13812341002', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(1, ' 11:21:33'), status: 3, create_time: daysAgo(1, ' 11:20:00'), staff: '吴秀兰', staff_id: 2, logs: [ { time: daysAgo(1, ' 11:20:00'), content: '用户提交膳食订单', operator: '李娜' }, { time: daysAgo(1, ' 11:21:33'), content: '微信支付成功 ¥45.00', operator: '系统' }, { time: daysAgo(1, ' 11:48:00'), content: '配送员 吴秀兰 已送达，订单完成', operator: '吴秀兰' } ] },
    { id: 2003, sn: 'SC20260906003', combo: '清淡养身晚餐组合', dishes: '香菇滑鸡粥、杂粮饭套餐', quantity: 1, price: '28.00', amount: '28.00', avatar: 'https://picsum.photos/seed/ghj-user-4/100/100', nickname: '赵敏', mobile: '13812341004', community: '绿城·桂语江南', building: '2栋1单元301', need_delivery: 1, delivery_time: '17:50 前送达', contact_name: '赵敏', contact_mobile: '13812341004', address: '绿城·桂语江南 2栋1单元301', payer_name: '赵敏', payer_mobile: '13812341004', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(2, ' 17:36:10'), status: 1, create_time: daysAgo(2, ' 17:35:00'), staff: '', staff_id: 0, logs: [ { time: daysAgo(2, ' 17:35:00'), content: '用户提交膳食订单', operator: '赵敏' }, { time: daysAgo(2, ' 17:36:10'), content: '微信支付成功 ¥28.00', operator: '系统' } ] },
    { id: 2004, sn: 'SC20260905004', combo: '全日三餐组合', dishes: '低糖营养早餐、清蒸鲈鱼套餐、杂粮饭套餐', quantity: 1, price: '52.00', amount: '52.00', avatar: 'https://picsum.photos/seed/ghj-user-5/100/100', nickname: '陈晨', mobile: '13812341005', community: '保利·天悦湾', building: '3栋2单元502', need_delivery: 1, delivery_time: '按餐点分批送达', contact_name: '陈晨', contact_mobile: '13812341005', address: '保利·天悦湾 3栋2单元502', payer_name: '陈晨', payer_mobile: '13812341005', payer_relation: '本人', pay_status: 1, pay_type: '支付宝', pay_time: daysAgo(3, ' 12:01:45'), status: 3, create_time: daysAgo(3, ' 12:00:00'), staff: '何秀芳', staff_id: 8, logs: [ { time: daysAgo(3, ' 12:00:00'), content: '用户提交膳食订单', operator: '陈晨' }, { time: daysAgo(3, ' 12:01:45'), content: '支付宝支付成功 ¥52.00', operator: '系统' }, { time: daysAgo(3, ' 18:30:00'), content: '配送员 何秀芳 已送达，订单完成', operator: '何秀芳' } ] },
    { id: 2005, sn: 'SC20260904005', combo: '低糖轻食组合', dishes: '杂粮饭套餐、低糖营养早餐', quantity: 2, price: '24.00', amount: '48.00', avatar: 'https://picsum.photos/seed/ghj-user-6/100/100', nickname: '刘洋', mobile: '13812341006', community: '万科·未来城三期', building: '5栋1单元1103', need_delivery: 0, delivery_time: '到食堂自取', contact_name: '刘洋', contact_mobile: '13812341006', address: '万科·未来城三期 社区食堂自取点', payer_name: '刘洋', payer_mobile: '13812341006', payer_relation: '本人', pay_status: 0, pay_type: '', pay_time: '', status: 0, create_time: daysAgo(4, ' 07:50:00'), staff: '', staff_id: 0, logs: [ { time: daysAgo(4, ' 07:50:00'), content: '用户提交膳食订单，等待支付', operator: '刘洋' } ] },
    { id: 2006, sn: 'SC20260903006', combo: '早餐 + 午餐全天组合', dishes: '低糖营养早餐、红烧狮子头套餐', quantity: 1, price: '29.00', amount: '29.00', avatar: 'https://picsum.photos/seed/ghj-user-3/100/100', nickname: '王强', mobile: '13812341003', community: '颐景园·江南里', building: '1栋1单元201', need_delivery: 1, delivery_time: '07:20 早餐 / 11:40 午餐', contact_name: '王强', contact_mobile: '13812341003', address: '颐景园·江南里 1栋1单元201', payer_name: '王强', payer_mobile: '13812341003', payer_relation: '为家人下单', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(5, ' 20:16:22'), status: 2, create_time: daysAgo(5, ' 20:15:00'), staff: '吴秀兰', staff_id: 2, logs: [ { time: daysAgo(5, ' 20:15:00'), content: '用户提交膳食订单', operator: '王强' }, { time: daysAgo(5, ' 20:16:22'), content: '微信支付成功 ¥29.00', operator: '系统' }, { time: daysAgo(5, ' 20:30:00'), content: '已派单给配送员 吴秀兰', operator: '物业管理员' } ] },
    { id: 2007, sn: 'SC20260902007', combo: 'ABC 经典午餐组合', dishes: '红烧狮子头套餐、清蒸鲈鱼套餐、香菇滑鸡粥', quantity: 3, price: '55.00', amount: '165.00', avatar: 'https://picsum.photos/seed/ghj-user-5/100/100', nickname: '陈晨', mobile: '13812341005', community: '保利·天悦湾', building: '3栋2单元502', need_delivery: 0, delivery_time: '到食堂自取', contact_name: '陈晨', contact_mobile: '13812341005', address: '保利·天悦湾 社区食堂自取点', payer_name: '陈晨', payer_mobile: '13812341005', payer_relation: '本人', pay_status: 1, pay_type: '支付宝', pay_time: daysAgo(6, ' 11:02:40'), status: 4, create_time: daysAgo(6, ' 11:00:00'), staff: '', staff_id: 0, logs: [ { time: daysAgo(6, ' 11:00:00'), content: '用户提交膳食订单', operator: '陈晨' }, { time: daysAgo(6, ' 11:02:40'), content: '支付宝支付成功 ¥165.00', operator: '系统' }, { time: daysAgo(6, ' 14:20:00'), content: '用户申请取消，费用已原路退回', operator: '物业管理员' } ] },
    { id: 2008, sn: 'SC20260901008', combo: '清淡养身晚餐组合', dishes: '香菇滑鸡粥、杂粮饭套餐', quantity: 2, price: '28.00', amount: '56.00', avatar: 'https://picsum.photos/seed/ghj-user-4/100/100', nickname: '赵敏', mobile: '13812341004', community: '绿城·桂语江南', building: '2栋1单元301', need_delivery: 1, delivery_time: '18:00 前送达', contact_name: '赵敏', contact_mobile: '13812341004', address: '绿城·桂语江南 2栋1单元301', payer_name: '赵敏', payer_mobile: '13812341004', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(7, ' 16:41:05'), status: 3, create_time: daysAgo(7, ' 16:40:00'), staff: '李文斌', staff_id: 9, logs: [ { time: daysAgo(7, ' 16:40:00'), content: '用户提交膳食订单', operator: '赵敏' }, { time: daysAgo(7, ' 16:41:05'), content: '微信支付成功 ¥56.00', operator: '系统' }, { time: daysAgo(7, ' 17:55:00'), content: '配送员 李文斌 已送达，订单完成', operator: '李文斌' } ] },
]

export const escortOrders = [
    { id: 3001, sn: 'PZ20260908001', service: '专家门诊陪诊（时价）', hospital: '浙江大学医学院附属第二医院', department: '心血管内科', escort_date: '2026-09-09 09:00', hours: 3, hour_price: '180.00', amount: '540.00', avatar: 'https://picsum.photos/seed/ghj-user-5/100/100', nickname: '陈晨', mobile: '13812341005', community: '保利·天悦湾', patient_name: '陈晨', patient_mobile: '13812341005', payer_name: '陈晨', payer_mobile: '13812341005', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(0, ' 08:01:25'), status: 2, create_time: daysAgo(0, ' 08:00:00'), staff: '郑海涛', staff_id: 3, logs: [ { time: daysAgo(0, ' 08:00:00'), content: '用户提交陪诊订单', operator: '陈晨' }, { time: daysAgo(0, ' 08:01:25'), content: '微信支付成功 ¥540.00', operator: '系统' }, { time: daysAgo(0, ' 08:15:00'), content: '已派单给陪诊员 郑海涛', operator: '物业管理员' } ] },
    { id: 3002, sn: 'PZ20260907002', service: '普通门诊陪诊（时价）', hospital: '杭州市第一人民医院', department: '全科医学科', escort_date: '2026-09-08 09:30', hours: 2, hour_price: '120.00', amount: '240.00', avatar: 'https://picsum.photos/seed/ghj-user-1/100/100', nickname: '张伟', mobile: '13812341001', community: '颐景园·江南里', patient_name: '张伟', patient_mobile: '13812341001', payer_name: '张伟', payer_mobile: '13812341001', payer_relation: '本人', pay_status: 1, pay_type: '支付宝', pay_time: daysAgo(1, ' 09:16:40'), status: 3, create_time: daysAgo(1, ' 09:15:00'), staff: '郑海涛', staff_id: 3, logs: [ { time: daysAgo(1, ' 09:15:00'), content: '用户提交陪诊订单', operator: '张伟' }, { time: daysAgo(1, ' 09:16:40'), content: '支付宝支付成功 ¥240.00', operator: '系统' }, { time: daysAgo(1, ' 12:40:00'), content: '陪诊员 郑海涛 完成陪诊，订单完成', operator: '郑海涛' } ] },
    { id: 3003, sn: 'PZ20260906003', service: '普通门诊陪诊（时价）', hospital: '浙江省人民医院', department: '内分泌科', escort_date: '2026-09-10 14:00', hours: 2, hour_price: '120.00', amount: '240.00', avatar: 'https://picsum.photos/seed/ghj-user-2/100/100', nickname: '李娜', mobile: '13812341002', community: '颐景园·江南里', patient_name: '李娜', patient_mobile: '13812341002', payer_name: '李娜', payer_mobile: '13812341002', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(2, ' 14:41:15'), status: 1, create_time: daysAgo(2, ' 14:40:00'), staff: '', staff_id: 0, logs: [ { time: daysAgo(2, ' 14:40:00'), content: '用户提交陪诊订单', operator: '李娜' }, { time: daysAgo(2, ' 14:41:15'), content: '微信支付成功 ¥240.00', operator: '系统' } ] },
    { id: 3004, sn: 'PZ20260905004', service: '住院陪护（时价）', hospital: '浙江大学医学院附属邵逸夫医院', department: '骨科（住院部 8 楼）', escort_date: '2026-09-05 ~ 2026-09-08', hours: 8, hour_price: '200.00', amount: '1600.00', avatar: 'https://picsum.photos/seed/ghj-user-3/100/100', nickname: '王强', mobile: '13812341003', community: '颐景园·江南里', patient_name: '王强', patient_mobile: '13812341003', payer_name: '王强', payer_mobile: '13812341003', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(5, ' 19:01:02'), status: 3, create_time: daysAgo(5, ' 19:00:00'), staff: '郑海涛', staff_id: 3, logs: [ { time: daysAgo(5, ' 19:00:00'), content: '用户提交陪诊订单', operator: '王强' }, { time: daysAgo(5, ' 19:01:02'), content: '微信支付成功 ¥1600.00', operator: '系统' }, { time: daysAgo(1, ' 18:00:00'), content: '陪诊员 郑海涛 完成陪护，订单完成', operator: '郑海涛' } ] },
    { id: 3005, sn: 'PZ20260904005', service: '专家门诊陪诊（时价）', hospital: '杭州市中医院', department: '中医内科', escort_date: '2026-09-11 10:00', hours: 3, hour_price: '180.00', amount: '540.00', avatar: 'https://picsum.photos/seed/ghj-user-4/100/100', nickname: '赵敏', mobile: '13812341004', community: '绿城·桂语江南', patient_name: '赵敏', patient_mobile: '13812341004', payer_name: '赵敏', payer_mobile: '13812341004', payer_relation: '本人', pay_status: 0, pay_type: '', pay_time: '', status: 0, create_time: daysAgo(6, ' 20:10:00'), staff: '', staff_id: 0, logs: [ { time: daysAgo(6, ' 20:10:00'), content: '用户提交陪诊订单，等待支付', operator: '赵敏' } ] },
    { id: 3006, sn: 'PZ20260903006', service: '普通门诊陪诊（时价）', hospital: '万科社区医院', department: '全科门诊', escort_date: '2026-09-10 08:30', hours: 2, hour_price: '120.00', amount: '240.00', avatar: 'https://picsum.photos/seed/ghj-user-6/100/100', nickname: '刘洋', mobile: '13812341006', community: '万科·未来城三期', patient_name: '刘洋', patient_mobile: '13812341006', payer_name: '刘洋', payer_mobile: '13812341006', payer_relation: '为家人下单', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(7, ' 09:32:18'), status: 1, create_time: daysAgo(7, ' 09:30:00'), staff: '', staff_id: 0, logs: [ { time: daysAgo(7, ' 09:30:00'), content: '用户提交陪诊订单', operator: '刘洋' }, { time: daysAgo(7, ' 09:32:18'), content: '微信支付成功 ¥240.00', operator: '系统' } ] },
    { id: 3007, sn: 'PZ20260902007', service: '住院陪护（时价）', hospital: '浙江大学医学院附属第二医院', department: '神经内科（住院部 5 楼）', escort_date: '2026-09-06 ~ 2026-09-07', hours: 4, hour_price: '200.00', amount: '800.00', avatar: 'https://picsum.photos/seed/ghj-user-5/100/100', nickname: '陈晨', mobile: '13812341005', community: '保利·天悦湾', patient_name: '陈晨', patient_mobile: '13812341005', payer_name: '陈晨', payer_mobile: '13812341005', payer_relation: '本人', pay_status: 1, pay_type: '支付宝', pay_time: daysAgo(8, ' 15:12:30'), status: 4, create_time: daysAgo(8, ' 15:10:00'), staff: '', staff_id: 0, logs: [ { time: daysAgo(8, ' 15:10:00'), content: '用户提交陪诊订单', operator: '陈晨' }, { time: daysAgo(8, ' 15:12:30'), content: '支付宝支付成功 ¥800.00', operator: '系统' }, { time: daysAgo(7, ' 10:00:00'), content: '用户申请取消，费用已原路退回', operator: '物业管理员' } ] },
    { id: 3008, sn: 'PZ20260901008', service: '专家门诊陪诊（时价）', hospital: '浙江省人民医院', department: '呼吸内科', escort_date: '2026-09-09 15:00', hours: 3, hour_price: '180.00', amount: '540.00', avatar: 'https://picsum.photos/seed/ghj-user-3/100/100', nickname: '王强', mobile: '13812341003', community: '颐景园·江南里', patient_name: '王强', patient_mobile: '13812341003', payer_name: '王强', payer_mobile: '13812341003', payer_relation: '本人', pay_status: 1, pay_type: '微信支付', pay_time: daysAgo(9, ' 11:05:44'), status: 2, create_time: daysAgo(9, ' 11:04:00'), staff: '田雅静', staff_id: 11, logs: [ { time: daysAgo(9, ' 11:04:00'), content: '用户提交陪诊订单', operator: '王强' }, { time: daysAgo(9, ' 11:05:44'), content: '微信支付成功 ¥540.00', operator: '系统' }, { time: daysAgo(9, ' 11:20:00'), content: '已派单给陪诊员 田雅静', operator: '物业管理员' } ] },
]

// ==================== 内容管理 ====================
/**
 * 人力资源
 * source：1=物业后台发布（展示发布账号、免审核、发布时间=审核时间、默认置顶）；2=用户发布（需审核）
 * status 发布状态：0=待审核 1=已通过 2=已驳回
 * is_show：1=显示 0=隐藏
 */
export const hrList = [
    {
        id: 1, title: '急聘社区托管员（颐景园·江南里）', source: 1, account: 'admin', avatar: 'https://picsum.photos/seed/ghj-admin-logo/100/100',
        nickname: '物业管理员', mobile: '13800138000', status: 1, audit_reason: '', is_top: 1, is_show: 1, sort: 1,
        create_time: daysAgo(2, ' 09:10:00'), audit_time: daysAgo(2, ' 09:10:00'),
        content: '<h4>岗位职责</h4><p>负责社区四点半课堂、日托班儿童的看护与作业辅导，配合开展手工、绘画等兴趣活动。</p><ul><li>年龄 25-50 周岁，身体健康，有爱心耐心</li><li>有幼教、保育、托管从业经验者优先</li><li>工作时间：周一至周五 15:30-19:30</li><li>薪资：4500-6000 元/月，缴纳五险一金</li></ul><h4>报名方式</h4><p>请携带身份证及相关资格证书至颐景园物业服务中心面试，或致电 0731-8888 6666 转 2。</p>'
    },
    {
        id: 2, title: '社区食堂诚聘配菜员 2 名', source: 1, account: 'jingli01', avatar: 'https://picsum.photos/seed/ghj-admin-logo/100/100',
        nickname: '王经理', mobile: '13812340002', status: 1, audit_reason: '', is_top: 1, is_show: 1, sort: 2,
        create_time: daysAgo(6, ' 14:20:00'), audit_time: daysAgo(6, ' 14:20:00'),
        content: '<h4>岗位要求</h4><p>负责社区食堂食材择洗、切配与初加工，协助厨师完成出餐。</p><ul><li>有食堂或餐饮后厨工作经验，持健康证上岗</li><li>能适应早班（5:30-13:30）</li><li>薪资：3800 元/月 + 全勤奖</li></ul><p>工作地点：颐景园社区食堂（3 栋架空层旁）。</p>'
    },
    {
        id: 3, title: '招聘钟点保洁（可兼职）', source: 1, account: 'admin', avatar: 'https://picsum.photos/seed/ghj-admin-logo/100/100',
        nickname: '物业管理员', mobile: '13800138000', status: 1, audit_reason: '', is_top: 1, is_show: 0, sort: 3,
        create_time: daysAgo(12, ' 10:05:00'), audit_time: daysAgo(12, ' 10:05:00'),
        content: '<h4>工作内容</h4><p>负责小区公共区域楼道、电梯厅日常保洁，可按需承揽业主入户保洁订单。</p><ul><li>计件结算，多劳多得，日结</li><li>需自备基础清洁工具</li></ul>'
    },
    {
        id: 4, title: '求职：8 年经验住家保姆，可做家常菜', source: 2, account: '', avatar: 'https://picsum.photos/seed/ghj-user-11/100/100',
        nickname: '刘阿姨', mobile: '13912342011', status: 0, audit_reason: '', is_top: 0, is_show: 0, sort: 0,
        create_time: daysAgo(0, ' 09:35:00'), audit_time: '',
        content: '<h4>个人简介</h4><p>本人 48 岁，从事住家保姆 8 年，擅长家常菜、老人小孩照料，性格温和，不挑活。</p><ul><li>期望薪资：6000 元/月，月休 4 天</li><li>服务区域：颐景园及周边小区</li></ul>'
    },
    {
        id: 5, title: '求职：退休教师，可入户作业辅导', source: 2, account: '', avatar: 'https://picsum.photos/seed/ghj-user-12/100/100',
        nickname: '郑凯', mobile: '15812343856', status: 1, audit_reason: '', is_top: 0, is_show: 1, sort: 0,
        create_time: daysAgo(3, ' 16:40:00'), audit_time: daysAgo(3, ' 17:20:00'),
        content: '<h4>个人简介</h4><p>退休小学语文教师，从教 32 年，可上门辅导小学 1-6 年级语文、作文，也可接送托管。</p><ul><li>辅导时间：周一至周五晚间、周末全天</li><li>收费：80 元/小时</li></ul>'
    },
    {
        id: 6, title: '求职：水电维修师傅，可接小区零活', source: 2, account: '', avatar: 'https://picsum.photos/seed/ghj-user-13/100/100',
        nickname: '何雪', mobile: '15712346690', status: 2, audit_reason: '内容含外部联系方式与广告信息，不符合社区发布规范', is_top: 0, is_show: 0, sort: 0,
        create_time: daysAgo(2, ' 11:20:00'), audit_time: daysAgo(2, ' 15:05:00'),
        content: '<h4>个人简介</h4><p>专业水电维修 15 年，承接家庭水电改造、灯具安装、龙头更换，联系电话 1xxxxxxxxxx，随叫随到。</p>'
    },
    {
        id: 7, title: '求职：钟点工，可做饭保洁', source: 2, account: '', avatar: 'https://picsum.photos/seed/ghj-user-14/100/100',
        nickname: '罗文杰', mobile: '15612345033', status: 1, audit_reason: '', is_top: 0, is_show: 1, sort: 0,
        create_time: daysAgo(5, ' 08:50:00'), audit_time: daysAgo(5, ' 10:15:00'),
        content: '<h4>服务内容</h4><p>提供钟点保洁、买菜做饭服务，按小时计费 45 元/小时，服务颐景园、保利天悦湾片区。</p>'
    },
    {
        id: 8, title: '求职：可接送小孩上下学', source: 2, account: '', avatar: 'https://picsum.photos/seed/ghj-user-15/100/100',
        nickname: '孙悦', mobile: '13812341007', status: 0, audit_reason: '', is_top: 0, is_show: 0, sort: 0,
        create_time: daysAgo(1, ' 20:15:00'), audit_time: '',
        content: '<h4>服务说明</h4><p>本人住 2 栋，孩子在同校就读，可顺路接送 1-3 年级学生上下学，电动车已配儿童座椅。</p>'
    },
]

/**
 * 社区贴吧
 * audit 帖子状态：0=待审核 1=已通过 2=已驳回
 * status：1=显示 0=隐藏
 */
export const barList = [
    {
        id: 1001, title: '小区门口的路灯坏了三天了，谁来管管？', author: '张伟', avatar: 'https://picsum.photos/seed/ghj-user-1/100/100', mobile: '13812341001',
        community: '颐景园·江南里', views: 356, replies: 28, collects: 45, cover: 'https://picsum.photos/seed/ghj-bar-1/400/300',
        status: 1, create_time: daysAgo(1, ' 20:12:00'), audit: 0, audit_reason: '', audit_time: '',
        content: '小区南门口的三盏路灯从上周五开始就不亮了，晚上回家那段路完全漆黑，已经有老人在台阶上差点摔倒。家里老人小孩每天出入都很不安全，希望物业尽快安排维修，也请大家留意出行安全。附上现场照片，位置就在南门岗亭到3号楼之间的路段。',
        logs: [
            { time: daysAgo(1, ' 20:12:00'), content: '用户「张伟」发布帖子', operator: '张伟' },
            { time: daysAgo(1, ' 20:12:05'), content: '进入待审核队列，等待物业审核', operator: '系统' },
        ],
    },
    {
        id: 1002, title: '周末亲子活动照片分享，孩子们玩得很开心！', author: '李娜', avatar: 'https://picsum.photos/seed/ghj-user-2/100/100', mobile: '13812341002',
        community: '颐景园·江南里', views: 892, replies: 65, collects: 132, cover: 'https://picsum.photos/seed/ghj-bar-2/400/300',
        status: 1, create_time: daysAgo(3, ' 15:30:00'), audit: 1, audit_reason: '', audit_time: daysAgo(3, ' 16:05:00'),
        content: '上周六物业组织的亲子运动会太有意思了！拔河、两人三足、套圈圈，孩子们玩得不亦乐乎，我家娃回家路上一直念叨下次还要参加。感谢物业的精心组织，也谢谢各位志愿者业主的帮忙，照片分享给大家，欢迎下期多多报名~',
        logs: [
            { time: daysAgo(3, ' 15:30:00'), content: '用户「李娜」发布帖子', operator: '李娜' },
            { time: daysAgo(3, ' 16:05:00'), content: '物业审核通过，帖子对外展示', operator: 'admin' },
            { time: daysAgo(2, ' 09:20:00'), content: '帖子被 132 位邻居收藏', operator: '系统' },
        ],
    },
    {
        id: 1003, title: '求推荐靠谱的家政保洁阿姨', author: '赵敏', avatar: 'https://picsum.photos/seed/ghj-user-3/100/100', mobile: '13812341003',
        community: '绿城·桂语江南', views: 234, replies: 41, collects: 18, cover: 'https://picsum.photos/seed/ghj-bar-3/400/300',
        status: 0, create_time: daysAgo(2, ' 10:45:00'), audit: 2, audit_reason: '内容涉及外部广告联系方式，不符合社区发帖规范', audit_time: daysAgo(2, ' 14:20:00'),
        content: '最近工作太忙，想找一位固定的家政保洁阿姨，每周来打扫两到三次，最好有经验、手脚麻利的。有推荐的朋友可以联系我，微信在此……',
        logs: [
            { time: daysAgo(2, ' 10:45:00'), content: '用户「赵敏」发布帖子', operator: '赵敏' },
            { time: daysAgo(2, ' 14:20:00'), content: '物业审核驳回：内容涉及外部广告联系方式，不符合社区发帖规范', operator: 'admin' },
        ],
    },
    {
        id: 1004, title: '5号楼电梯按钮面板脱落，已拍照报修', author: '王强', avatar: 'https://picsum.photos/seed/ghj-user-4/100/100', mobile: '13812341004',
        community: '颐景园·江南里', views: 128, replies: 12, collects: 7, cover: 'https://picsum.photos/seed/ghj-bar-4/400/300',
        status: 1, create_time: daysAgo(0, ' 08:20:00'), audit: 0, audit_reason: '', audit_time: '',
        content: '今天早上发现5号楼2单元的电梯按钮面板整个脱落挂在半空，小孩路过容易碰到，比较危险。已经拍照发到了物业报修群，请物业尽快派人来处理，也提醒邻居们乘坐电梯时注意安全。',
        logs: [
            { time: daysAgo(0, ' 08:20:00'), content: '用户「王强」发布帖子', operator: '王强' },
            { time: daysAgo(0, ' 08:20:03'), content: '进入待审核队列，等待物业审核', operator: '系统' },
        ],
    },
    {
        id: 1005, title: '转让九成新婴儿床，同小区自提', author: '陈晨', avatar: 'https://picsum.photos/seed/ghj-user-5/100/100', mobile: '13812341005',
        community: '保利·天悦湾', views: 86, replies: 9, collects: 5, cover: 'https://picsum.photos/seed/ghj-bar-5/400/300',
        status: 1, create_time: daysAgo(0, ' 19:40:00'), audit: 0, audit_reason: '', audit_time: '',
        content: '孩子长大了用不上，出一台九成新实木婴儿床，带床垫和蚊帐，原价1200元现400元转让，仅限同小区业主自提，可以先上门看货。有意向的邻居评论区留言或私信我。',
        logs: [
            { time: daysAgo(0, ' 19:40:00'), content: '用户「陈晨」发布帖子', operator: '陈晨' },
        ],
    },
    {
        id: 1006, title: '地下车库充电桩建议增加两个', author: '刘洋', avatar: 'https://picsum.photos/seed/ghj-user-6/100/100', mobile: '13812341006',
        community: '万科·未来城三期', views: 312, replies: 37, collects: 66, cover: 'https://picsum.photos/seed/ghj-bar-6/400/300',
        status: 1, create_time: daysAgo(4, ' 12:10:00'), audit: 1, audit_reason: '', audit_time: daysAgo(4, ' 14:35:00'),
        content: '小区新能源车越来越多，地下车库现有 4 个充电桩经常排不上队，建议物业在 B1 层再增设 2 个快充桩，能够扫码支付最好。',
        logs: [
            { time: daysAgo(4, ' 12:10:00'), content: '用户「刘洋」发布帖子', operator: '刘洋' },
            { time: daysAgo(4, ' 14:35:00'), content: '物业审核通过，帖子对外展示', operator: 'jingli01' },
        ],
    },
    {
        id: 1007, title: '【拼团】阳澄湖大闸蟹团购，10 只 188 元', author: '周杰', avatar: 'https://picsum.photos/seed/ghj-user-8/100/100', mobile: '13812341008',
        community: '颐景园·江南里', views: 41, replies: 3, collects: 0, cover: 'https://picsum.photos/seed/ghj-bar-7/400/300',
        status: 0, create_time: daysAgo(1, ' 13:05:00'), audit: 2, audit_reason: '未经物业备案的商业团购推广，予以驳回', audit_time: daysAgo(1, ' 15:30:00'),
        content: '阳澄湖大闸蟹产地直发，4 对 8 只礼盒装只要 188 元，加微信 xxxx 下单，满 20 单发车。',
        logs: [
            { time: daysAgo(1, ' 13:05:00'), content: '用户「周杰」发布帖子', operator: '周杰' },
            { time: daysAgo(1, ' 15:30:00'), content: '物业审核驳回：未经物业备案的商业团购推广', operator: 'admin' },
        ],
    },
    {
        id: 1008, title: '感谢保洁阿姨帮我把掉落阳台的被子捡回来', author: '孙德福', avatar: 'https://picsum.photos/seed/ghj-user-7/100/100', mobile: '13312346612',
        community: '颐景园·江南里', views: 520, replies: 58, collects: 89, cover: 'https://picsum.photos/seed/ghj-bar-8/400/300',
        status: 1, create_time: daysAgo(6, ' 09:00:00'), audit: 1, audit_reason: '', audit_time: daysAgo(6, ' 10:20:00'),
        content: '昨天风大，晒在阳台的被子被吹到了楼下绿化带，3 栋的保洁吴阿姨看到后主动帮忙捡回来还送到家门口，真的非常感谢，为物业的贴心服务点赞！',
        logs: [
            { time: daysAgo(6, ' 09:00:00'), content: '用户「孙德福」发布帖子', operator: '孙德福' },
            { time: daysAgo(6, ' 10:20:00'), content: '物业审核通过，帖子对外展示', operator: 'admin' },
        ],
    },
]

/** 社区贴吧-帖子评论 */
export const barComments = [
    { id: 1, post_id: 1001, avatar: 'https://picsum.photos/seed/ghj-user-2/100/100', nickname: '李娜', content: '确实，我昨晚带娃走那边差点摔跤，希望能尽快修好。', create_time: daysAgo(1, ' 20:35:00') },
    { id: 2, post_id: 1001, avatar: 'https://picsum.photos/seed/ghj-user-4/100/100', nickname: '王强', content: '已经报修了，物业说明天上午安排电工来换灯管。', create_time: daysAgo(1, ' 21:02:00') },
    { id: 3, post_id: 1001, avatar: 'https://picsum.photos/seed/ghj-user-6/100/100', nickname: '刘洋', content: '南门那段路确实该加两盏灯了，建议一并反映。', create_time: daysAgo(0, ' 08:15:00') },
    { id: 4, post_id: 1002, avatar: 'https://picsum.photos/seed/ghj-user-1/100/100', nickname: '张伟', content: '照片拍得真好，我家娃也上镜啦！', create_time: daysAgo(3, ' 16:40:00') },
    { id: 5, post_id: 1002, avatar: 'https://picsum.photos/seed/ghj-user-5/100/100', nickname: '陈晨', content: '下期什么时候报名？我们也想参加。', create_time: daysAgo(2, ' 10:05:00') },
    { id: 6, post_id: 1002, avatar: 'https://picsum.photos/seed/ghj-user-7/100/100', nickname: '孙德福', content: '物业这次活动组织得很用心，点赞。', create_time: daysAgo(2, ' 11:30:00') },
    { id: 7, post_id: 1004, avatar: 'https://picsum.photos/seed/ghj-user-1/100/100', nickname: '张伟', content: '刚才经过看了一下，已经贴上警示胶带了。', create_time: daysAgo(0, ' 09:12:00') },
    { id: 8, post_id: 1006, avatar: 'https://picsum.photos/seed/ghj-user-3/100/100', nickname: '赵敏', content: '同意，B1 层空位还很多，装两个不难。', create_time: daysAgo(4, ' 13:20:00') },
    { id: 9, post_id: 1006, avatar: 'https://picsum.photos/seed/ghj-user-8/100/100', nickname: '周杰', content: '希望支持扫码支付，现在那个 APP 太难用了。', create_time: daysAgo(3, ' 19:45:00') },
    { id: 10, post_id: 1008, avatar: 'https://picsum.photos/seed/ghj-user-2/100/100', nickname: '李娜', content: '吴阿姨确实是热心人，上次也帮我收过快递。', create_time: daysAgo(6, ' 10:50:00') },
]

export const wonderfulList = [
    {
        id: 1,
        title: '社区重阳节敬老活动圆满举办',
        author: '物业宣传部',
        cover: 'https://picsum.photos/seed/ghj-wonderful-1/400/300',
        views: 1520,
        likes: 236,
        sort: 1,
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
        sort: 2,
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
        sort: 3,
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
        sort: 1,
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
        sort: 2,
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
        sort: 3,
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
        activity_time: '9月15日（中秋节）18:30-21:00',
        signup_start: dateOffset(-3),
        signup_end: dateOffset(4),
        address: '小区中心广场',
        status: 1,
        signup_status: 1,
        sort: 1,
        create_time: daysAgo(3),
        content: '<h4>活动介绍</h4><p>花好月圆人团圆！中秋佳节来临之际，物业服务中心特举办<strong>「中秋游园会」</strong>主题活动，诚邀全体业主携家人朋友共度佳节，猜灯谜、赢好礼、赏明月！</p><h4>活动安排</h4><ul><li><strong>活动时间：</strong>本周六 18:30 - 21:00</li><li><strong>活动地点：</strong>小区中心广场（雨天移至架空层）</li><li><strong>报名方式：</strong>APP 内本页直接报名，或至物业服务中心前台登记</li><li><strong>报名截止：</strong>活动开始前 2 小时</li></ul><h4>活动亮点</h4><ul><li><strong>猜灯谜赢好礼：</strong>现场 200 条灯谜，猜中即可兑换月饼、毛巾、洗衣液等精美礼品</li><li><strong>亲子灯笼 DIY：</strong>免费提供手工材料，和孩子一起制作专属花灯</li><li><strong>中秋茶话会：</strong>品月饼、饮清茶，邻里相聚话家常</li><li><strong>幸运大抽奖：</strong>报名业主均可参与抽奖，一等奖为智能电饭煲一台</li></ul><h4>温馨提示</h4><p>现场设有签到处，请报名成功的业主凭<strong>报名成功截图</strong>签到领取号码牌；请照看好随行儿童，不要在人群密集处追逐打闹。</p><p style="text-align:center;"><img src="https://picsum.photos/seed/ghj-activity-1a/600/340" alt="中秋游园会" style="max-width:100%;border-radius:8px;" /></p><blockquote>咨询热线：0731-8888 6666（物业服务中心）</blockquote>',
    },
    {
        id: 2,
        title: '老年健康义诊进社区',
        cover: 'https://picsum.photos/seed/ghj-activity-2/400/300',
        signup: 92,
        limit: 150,
        activity_time: '9月20日（周三）08:30-11:30',
        signup_start: dateOffset(-6),
        signup_end: dateOffset(2),
        address: '社区服务站',
        status: 1,
        signup_status: 1,
        sort: 2,
        create_time: daysAgo(5),
        content: '<h4>活动背景</h4><p>为提升社区老年居民的健康意识，物业联合<strong>市第三人民医院</strong>开展「健康义诊进社区」公益活动，多名资深医师现场坐诊，为业主提供免费健康咨询服务。</p><h4>义诊项目</h4><ul><li><strong>基础体检：</strong>血压、血糖、心率测量，建立个人健康档案</li><li><strong>内科问诊：</strong>常见慢性病（高血压、糖尿病等）用药咨询与调理建议</li><li><strong>骨科咨询：</strong>颈肩腰腿痛、骨质疏松等老年常见骨病问诊</li><li><strong>中医理疗：</strong>穴位贴敷、艾灸体验，中医体质辨识</li></ul><h4>参与须知</h4><ul><li>活动时间：下周三上午 8:30 - 11:30</li><li>活动地点：社区服务站一楼大厅</li><li>请携带身份证或医保卡，便于建档</li><li>建议空腹前往，可免费测量空腹血糖</li><li>65 岁以上老人可优先就诊，行动不便者可联系物业安排志愿者陪同</li></ul><p>名额有限（150 人），报满即止，请尽快通过 APP 报名。</p><blockquote>咨询电话：0731-8888 6666 转 3（社区服务站）</blockquote>',
    },
    {
        id: 3,
        title: '周末亲子手工课（第12期）',
        cover: 'https://picsum.photos/seed/ghj-activity-3/400/300',
        signup: 40,
        limit: 40,
        activity_time: '9月6日（周六）14:30-16:00',
        signup_start: dateOffset(-25),
        signup_end: dateOffset(-8),
        address: '托管活动室',
        status: 1,
        signup_status: 1,
        sort: 3,
        create_time: daysAgo(20),
        content: '<h4>课程介绍</h4><p>「周末亲子手工课」是社区四点半课堂系列品牌活动，本期为<strong>第 12 期</strong>，主题为「非遗竹编小船」，由专业手工老师带领孩子们感受传统竹编技艺的魅力。</p><h4>课程安排</h4><ul><li><strong>上课时间：</strong>周六下午 14:30 - 16:00</li><li><strong>上课地点：</strong>托管活动室（3 栋架空层）</li><li><strong>适合年龄：</strong>4 - 10 岁儿童，须家长陪同</li><li><strong>材料费用：</strong>免费（由社区活动经费支持）</li></ul><h4>课堂流程</h4><ul><li>14:30 - 14:45 签到入场，领取材料包</li><li>14:45 - 15:30 老师示范竹编技法，亲子协作制作</li><li>15:30 - 15:50 作品展示与合影</li><li>15:50 - 16:00 整理收纳，颁发「小小手艺人」贴纸</li></ul><h4>温馨提示</h4><p>本期名额已报满，感谢大家的热情参与！后续将继续开设新一期课程，请关注 APP 首页活动预告。已报名家庭如无法到场，请提前在 APP 取消报名，将名额留给其他家庭。</p><p style="text-align:center;"><img src="https://picsum.photos/seed/ghj-activity-3a/600/340" alt="亲子手工课" style="max-width:100%;border-radius:8px;" /></p><blockquote>课程咨询：0731-8888 6666 转 5（四点半课堂）</blockquote>',
    },
    {
        id: 4,
        title: '邻里跳蚤市场·闲置好物置换',
        cover: 'https://picsum.photos/seed/ghj-activity-4/400/300',
        signup: 68,
        limit: 80,
        activity_time: '9月18日（周日）09:00-12:00',
        signup_start: dateOffset(-5),
        signup_end: dateOffset(6),
        address: '中心广场东侧步道',
        status: 1,
        signup_status: 0,
        sort: 4,
        create_time: daysAgo(1),
        content: '<h4>活动介绍</h4><p>家里堆着的闲置物品别浪费！邻里跳蚤市场为大家提供线下置换摊位，书籍、玩具、小家电、母婴用品都可以拿来交换或低价转让。</p><h4>活动安排</h4><ul><li><strong>活动时间：</strong>9月18日（周日）09:00 - 12:00</li><li><strong>活动地点：</strong>中心广场东侧步道</li><li><strong>摊位数量：</strong>40 个（每个摊位免费提供一桌两椅）</li><li><strong>报名截止：</strong>9月17日 18:00</li></ul><blockquote>温馨提示：禁止销售食品、药品及三无产品，请邻里之间友好议价。</blockquote>',
    },
    {
        id: 5,
        title: '秋季业主羽毛球友谊赛',
        cover: 'https://picsum.photos/seed/ghj-activity-5/400/300',
        signup: 32,
        limit: 32,
        activity_time: '8月30日（周六）19:00-21:00',
        signup_start: dateOffset(-40),
        signup_end: dateOffset(-12),
        address: '小区羽毛球馆',
        status: 0,
        signup_status: 1,
        sort: 5,
        create_time: daysAgo(45),
        content: '<h4>赛事回顾</h4><p>本届友谊赛共 16 组选手参赛，经过小组循环与淘汰赛，最终由 5 栋代表队夺得冠军。</p><ul><li>冠军：5 栋代表队（奖品：羽毛球拍一套）</li><li>亚军：2 栋代表队</li><li>季军：3 栋代表队</li></ul><p>感谢各位业主的热情参与与志愿裁判的辛勤付出，明年春季赛再见！</p>',
    },
]

// ==================== 社区活动报名列表（按活动分组的报名用户） ====================
export const activitySignupList = [
    // 活动 1：中秋游园会
    { id: 101, activity_id: 1, avatar: 'https://picsum.photos/seed/ghj-user-1/100/100', nickname: '张伟', phone: '13812341001', room: '1栋1单元101', signup_count: 3, signup_time: daysAgo(2, ' 09:12:00'), remark: '一家三口参加' },
    { id: 102, activity_id: 1, avatar: 'https://picsum.photos/seed/ghj-user-2/100/100', nickname: '李娜', phone: '13812341002', room: '2栋1单元802', signup_count: 2, signup_time: daysAgo(2, ' 10:35:00'), remark: '' },
    { id: 103, activity_id: 1, avatar: 'https://picsum.photos/seed/ghj-user-3/100/100', nickname: '王强', phone: '13812341003', room: '1栋1单元201', signup_count: 4, signup_time: daysAgo(1, ' 14:20:00'), remark: '带父母一起参加' },
    { id: 104, activity_id: 1, avatar: 'https://picsum.photos/seed/ghj-user-4/100/100', nickname: '赵敏', phone: '13812341004', room: '2栋2单元1103', signup_count: 2, signup_time: daysAgo(1, ' 16:48:00'), remark: '' },
    { id: 105, activity_id: 1, avatar: 'https://picsum.photos/seed/ghj-user-5/100/100', nickname: '陈明辉', phone: '13512348890', room: '5栋1单元201', signup_count: 1, signup_time: daysAgo(0, ' 08:05:00'), remark: '' },
    { id: 106, activity_id: 1, avatar: 'https://picsum.photos/seed/ghj-user-6/100/100', nickname: '赵秀英', phone: '13412343327', room: '4栋2单元604', signup_count: 2, signup_time: daysAgo(0, ' 11:30:00'), remark: '希望安排靠前座位' },
    // 活动 2：老年健康义诊
    { id: 201, activity_id: 2, avatar: 'https://picsum.photos/seed/ghj-user-7/100/100', nickname: '孙德福', phone: '13312346612', room: '2栋1单元301', signup_count: 1, signup_time: daysAgo(4, ' 09:40:00'), remark: '68岁，需测血糖' },
    { id: 202, activity_id: 2, avatar: 'https://picsum.photos/seed/ghj-user-8/100/100', nickname: '周桂兰', phone: '13212349045', room: '3栋2单元1502', signup_count: 2, signup_time: daysAgo(4, ' 10:15:00'), remark: '' },
    { id: 203, activity_id: 2, avatar: 'https://picsum.photos/seed/ghj-user-5/100/100', nickname: '陈晨', phone: '13812341005', room: '3栋2单元502', signup_count: 1, signup_time: daysAgo(3, ' 15:22:00'), remark: '颈肩腰腿痛咨询' },
    { id: 204, activity_id: 2, avatar: 'https://picsum.photos/seed/ghj-user-10/100/100', nickname: '郑爽', phone: '13012342265', room: '5栋2单元903', signup_count: 3, signup_time: daysAgo(3, ' 17:50:00'), remark: '替父母报名' },
    // 活动 3：周末亲子手工课
    { id: 301, activity_id: 3, avatar: 'https://picsum.photos/seed/ghj-user-6/100/100', nickname: '刘洋', phone: '13812341006', room: '5栋1单元1103', signup_count: 2, signup_time: daysAgo(15, ' 20:10:00'), remark: '孩子5岁' },
    { id: 302, activity_id: 3, avatar: 'https://picsum.photos/seed/ghj-user-12/100/100', nickname: '郑凯', phone: '15812343856', room: '2栋2单元1104', signup_count: 2, signup_time: daysAgo(14, ' 12:45:00'), remark: '' },
    { id: 303, activity_id: 3, avatar: 'https://picsum.photos/seed/ghj-user-13/100/100', nickname: '何雪', phone: '15712346690', room: '4栋1单元702', signup_count: 1, signup_time: daysAgo(12, ' 18:30:00'), remark: '希望多开自然主题' },
    { id: 304, activity_id: 3, avatar: 'https://picsum.photos/seed/ghj-user-14/100/100', nickname: '罗文杰', phone: '15612345033', room: '6栋2单元1301', signup_count: 2, signup_time: daysAgo(10, ' 09:55:00'), remark: '' },
    // 活动 4：邻里跳蚤市场
    { id: 401, activity_id: 4, avatar: 'https://picsum.photos/seed/ghj-user-9/100/100', nickname: '吴秀兰', phone: '13912342218', room: '1栋2单元601', signup_count: 1, signup_time: daysAgo(1, ' 10:20:00'), remark: '转让儿童绘本' },
    { id: 402, activity_id: 4, avatar: 'https://picsum.photos/seed/ghj-user-10/100/100', nickname: '郑爽', phone: '13012342265', room: '5栋2单元903', signup_count: 2, signup_time: daysAgo(1, ' 15:40:00'), remark: '要一个靠边摊位' },
    { id: 403, activity_id: 4, avatar: 'https://picsum.photos/seed/ghj-user-11/100/100', nickname: '刘阿姨', phone: '13912342011', room: '3栋1单元202', signup_count: 1, signup_time: daysAgo(0, ' 09:05:00'), remark: '' },
    // 活动 5：羽毛球友谊赛
    { id: 501, activity_id: 5, avatar: 'https://picsum.photos/seed/ghj-user-13/100/100', nickname: '何雪', phone: '15712346690', room: '4栋1单元702', signup_count: 1, signup_time: daysAgo(38, ' 19:20:00'), remark: '混双报名' },
    { id: 502, activity_id: 5, avatar: 'https://picsum.photos/seed/ghj-user-15/100/100', nickname: '孙悦', phone: '13812341007', room: '2栋2单元801', signup_count: 2, signup_time: daysAgo(37, ' 20:05:00'), remark: '' },
]

// ==================== 生活帮手（用户提交的生活帮助表单） ====================
export const helperList = [
    {
        id: 1,
        type: '家电维修',
        avatar: 'https://picsum.photos/seed/ghj-user-1/100/100',
        nickname: '张伟',
        phone: '13812341001',
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
        phone: '13812341002',
        building: '1栋1单元102',
        status: 1,
        handler: 'admin（物业管理员）',
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
        phone: '13812341003',
        building: '1栋1单元201',
        status: 1,
        handler: 'jingli01（王经理）',
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
        phone: '13812341004',
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
        phone: '13812341005',
        building: '3栋2单元502',
        status: 1,
        handler: 'admin（物业管理员）',
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
        phone: '13812341006',
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
        phone: '13812341007',
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
        phone: '13812341008',
        building: '3栋1单元404',
        status: 1,
        handler: 'jingli01（王经理）',
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
}

export const financeFlow = [
    { id: 1, sn: 'FL20260908001', type: '服务收入', from: '张伟-全日托管', amount: '+150.00', pay_type: '微信支付', create_time: daysAgo(0, ' 09:15:00') },
    { id: 2, sn: 'FL20260908002', type: '服务收入', from: '陈晨-专家门诊陪诊', amount: '+540.00', pay_type: '微信支付', create_time: daysAgo(0, ' 08:10:00') },
    { id: 3, sn: 'FL20260907003', type: '退款支出', from: '刘洋-全日托管', amount: '-150.00', pay_type: '原路退回', create_time: daysAgo(1, ' 15:30:00') },
    { id: 4, sn: 'FL20260907004', type: '服务收入', from: '李娜-清蒸鲈鱼套餐', amount: '+28.00', pay_type: '微信支付', create_time: daysAgo(1, ' 11:25:00') },
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
    { id: 2, username: 'jingli01', nickname: '王经理', role: '物业经理', mobile: '13812340002', last_login: daysAgo(1, ' 18:20:00'), status: 1, create_time: daysAgo(250) },
    { id: 3, username: 'caiwu01', nickname: '钱会计', role: '财务专员', mobile: '13812340003', last_login: daysAgo(2, ' 09:00:00'), status: 1, create_time: daysAgo(180) },
    { id: 4, username: 'loudong01', nickname: '孙丽华', role: '楼栋管理员', mobile: '13812340004', last_login: daysAgo(3, ' 14:45:00'), status: 0, create_time: daysAgo(90) },
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
    { id: 1, name: '待审核认证申请', count: 3, path: '/community/certify', perms: 'community.certify/lists' },
    { id: 2, name: '待派单托管订单', count: 1, path: '/order/nursing', perms: 'order.nursing/lists' },
    { id: 3, name: '待派单膳食订单', count: 2, path: '/order/meal', perms: 'order.meal/lists' },
    { id: 4, name: '待派单陪诊订单', count: 2, path: '/order/escort', perms: 'order.escort/lists' },
    { id: 5, name: '待结算账单', count: 1, path: '/finance/bill', perms: 'finance.bill/lists' },
    { id: 6, name: '待处理退款申请', count: 1, path: '/finance/flow', perms: 'finance.flow/lists' },
    { id: 7, name: '待审核帖子', count: 3, path: '/article/bar', perms: 'article.bar/lists' },
    { id: 8, name: '待上线活动', count: 1, path: '/article/activity', perms: 'article.activity/lists' },
]

// ==================== 用户月度结算明细（用户详情-结算信息板块） ====================
export const userSettleList = [
    { id: 1, user_id: 1, settle_sn: 'JS20260901001', order_type: '托管服务', amount: '1280.00', status: 2, settle_time: daysAgo(8, ' 10:30:00'), create_time: daysAgo(9, ' 18:20:00'), remark: '8月托管服务费结算' },
    { id: 2, user_id: 1, settle_sn: 'JS20260901002', order_type: '膳食服务', amount: '465.00', status: 2, settle_time: daysAgo(8, ' 10:35:00'), create_time: daysAgo(9, ' 18:25:00'), remark: '' },
    { id: 3, user_id: 1, settle_sn: 'JS20260902001', order_type: '陪诊服务', amount: '368.00', status: 1, settle_time: '', create_time: daysAgo(7, ' 14:10:00'), remark: '服务确认后 T+7 结算' },
    { id: 4, user_id: 2, settle_sn: 'JS20260901003', order_type: '托管服务', amount: '960.00', status: 2, settle_time: daysAgo(8, ' 11:00:00'), create_time: daysAgo(9, ' 19:05:00'), remark: '' },
    { id: 5, user_id: 2, settle_sn: 'JS20260903001', order_type: '家政保洁', amount: '180.00', status: 1, settle_time: '', create_time: daysAgo(6, ' 09:40:00'), remark: '' },
    { id: 6, user_id: 3, settle_sn: 'JS20260801001', order_type: '膳食服务', amount: '328.00', status: 2, settle_time: daysAgo(38, ' 15:20:00'), create_time: daysAgo(39, ' 17:30:00'), remark: '7月膳食服务费结算' },
    { id: 7, user_id: 5, settle_sn: 'JS20260901004', order_type: '托管服务', amount: '2160.00', status: 2, settle_time: daysAgo(8, ' 11:30:00'), create_time: daysAgo(9, ' 20:15:00'), remark: '' },
    { id: 8, user_id: 5, settle_sn: 'JS20260904001', order_type: '陪诊服务', amount: '540.00', status: 0, settle_time: '', create_time: daysAgo(4, ' 13:25:00'), remark: '待服务完成确认' } as any,
    { id: 9, user_id: 6, settle_sn: 'JS20260902002', order_type: '家政保洁', amount: '150.00', status: 1, settle_time: '', create_time: daysAgo(7, ' 10:50:00'), remark: '' },
]

// ==================== 用户健康手环（用户详情-健康手环板块） ====================
export const healthBandList = [
    { id: 1, user_id: 1, nickname: '张伟', band_sn: 'BAND2026A08801', bind_time: daysAgo(90, ' 09:20:00'), status: 1, battery: 78, heart_rate: 76, steps: 8236, sleep: '7小时20分', last_sync: daysAgo(0, ' 07:45:00') },
    { id: 2, user_id: 1, nickname: '张伟', band_sn: 'BAND2026A08802', bind_time: daysAgo(30, ' 14:10:00'), status: 1, battery: 92, heart_rate: 72, steps: 6412, sleep: '6小时55分', last_sync: daysAgo(0, ' 08:02:00'), note: '为家中老人代绑' } as any,
    { id: 3, user_id: 2, nickname: '李娜', band_sn: 'BAND2026B11205', bind_time: daysAgo(60, ' 10:30:00'), status: 1, battery: 45, heart_rate: 81, steps: 10245, sleep: '7小时05分', last_sync: daysAgo(0, ' 07:30:00') },
    { id: 4, user_id: 3, nickname: '王强', band_sn: 'BAND2026C33018', bind_time: daysAgo(15, ' 16:45:00'), status: 1, battery: 88, heart_rate: 68, steps: 4530, sleep: '8小时10分', last_sync: daysAgo(0, ' 06:58:00') },
    { id: 5, user_id: 5, nickname: '陈晨', band_sn: 'BAND2026D55602', bind_time: daysAgo(45, ' 11:20:00'), status: 0, battery: 12, heart_rate: 0, steps: 0, sleep: '—', last_sync: daysAgo(5, ' 22:10:00'), note: '电量耗尽离线，已短信提醒' } as any,
    { id: 6, user_id: 6, nickname: '刘洋', band_sn: 'BAND2026E77811', bind_time: daysAgo(20, ' 09:05:00'), status: 1, battery: 66, heart_rate: 74, steps: 7310, sleep: '7小时40分', last_sync: daysAgo(0, ' 07:12:00') },
]

// ==================== 用户资源大厅发布记录（用户详情-资源大厅板块） ====================
export const resourceList = [
    { id: 1, user_id: 1, title: '转让九成新婴儿床，同小区自提', category: '闲置转让', price: '260.00', status: 1, views: 186, create_time: daysAgo(6, ' 20:15:00'), cover: 'https://picsum.photos/seed/ghj-resource-1a/300/200' },
    { id: 2, user_id: 2, title: '专业钢琴一对一陪练，可上门', category: '家政服务', price: '150.00', status: 1, views: 94, create_time: daysAgo(12, ' 14:30:00'), cover: 'https://picsum.photos/seed/ghj-resource-2a/300/200' },
    { id: 3, user_id: 3, title: '求购二手婴儿推车，九成新以上', category: '闲置求购', price: '面议', status: 1, views: 57, create_time: daysAgo(3, ' 09:20:00'), cover: 'https://picsum.photos/seed/ghj-resource-3a/300/200' },
    { id: 4, user_id: 4, title: '周末拼车往返机场，找同小区邻居', category: '拼车出行', price: '40.00', status: 0, views: 132, create_time: daysAgo(20, ' 18:40:00'), cover: 'https://picsum.photos/seed/ghj-resource-4a/300/200' },
    { id: 5, user_id: 5, title: '儿童绘本低价转，经典书单一次打包', category: '闲置转让', price: '80.00', status: 1, views: 45, create_time: daysAgo(9, ' 11:05:00'), cover: 'https://picsum.photos/seed/ghj-resource-5a/300/200' },
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
