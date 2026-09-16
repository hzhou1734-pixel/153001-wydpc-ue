/**
 * 数据台模块 Mock 补充数据
 *
 * 说明：小区 / 用户 / 订单 / 业主认证等主数据统一取自 @/mock/data 并按业务规则实时统计，
 * 本文件仅补充主数据表暂缺、无法支撑「数据台」统计演示的部分：
 * 1. recentUsers       近期新增用户（主用户表注册时间较早，补齐近 30 天新注册记录）
 * 2. settleRecords     平台结算流水（今日 / 本月 / 累计结算额统计）
 * 3. pendingPosts      待审核帖子发布
 * 4. pendingResources  待审核资源大厅发布
 * 5. pendingHelpers    待查看生活帮手
 * 6. escortAfterSaleIds 售后陪诊单待审核（陪诊订单已完成且用户已发起售后的订单 id）
 */

/** 日期辅助：基于当前时间往前推 n 天（正数为更早） */
function daysAgo(n: number, time = ' 10:30:00') {
    const d = new Date()
    d.setDate(d.getDate() - n)
    const pad = (v: number) => String(v).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}${time}`
}

// ==================== 近期新增用户（近 30 天注册） ====================
export const recentUsers = [
    { id: 101, nickname: '林静姝', mobile: '13812341101', community: '颐景园·江南里', room: '3栋2单元601', certified: 1, status: 1, create_time: daysAgo(0, ' 09:05:12') },
    { id: 102, nickname: '高宇轩', mobile: '13812341102', community: '保利·天悦湾', room: '1栋1单元1802', certified: 0, status: 1, create_time: daysAgo(0, ' 14:26:40') },
    { id: 103, nickname: '宋佳怡', mobile: '13812341103', community: '绿城·桂语江南', room: '2栋1单元302', certified: 1, status: 1, create_time: daysAgo(0, ' 20:11:08') },
    { id: 104, nickname: '谢文韬', mobile: '13812341104', community: '万科·未来城三期', room: '6栋2单元903', certified: 0, status: 1, create_time: daysAgo(1, ' 10:42:30') },
    { id: 105, nickname: '毕若涵', mobile: '13812341105', community: '颐景园·江南里', room: '2栋1单元202', certified: 1, status: 1, create_time: daysAgo(1, ' 16:38:05') },
    { id: 106, nickname: '范逸辰', mobile: '13812341106', community: '融创·金成府', room: '2栋1单元201', certified: 0, status: 1, create_time: daysAgo(2, ' 11:20:44') },
    { id: 107, nickname: '罗婉清', mobile: '13812341107', community: '保利·天悦湾', room: '3栋2单元701', certified: 1, status: 1, create_time: daysAgo(3, ' 09:47:16') },
    { id: 108, nickname: '崔嘉树', mobile: '13812341108', community: '绿城·桂语江南', room: '1栋1单元502', certified: 0, status: 1, create_time: daysAgo(4, ' 15:12:33') },
    { id: 109, nickname: '施念安', mobile: '13812341109', community: '万科·未来城三期', room: '5栋1单元1206', certified: 1, status: 1, create_time: daysAgo(6, ' 19:03:57') },
    { id: 110, nickname: '常思远', mobile: '13812341110', community: '颐景园·江南里', room: '1栋2单元402', certified: 0, status: 1, create_time: daysAgo(8, ' 08:25:10') },
    { id: 111, nickname: '虞书宁', mobile: '13812341111', community: '保利·天悦湾', room: '4栋1单元303', certified: 1, status: 1, create_time: daysAgo(11, ' 13:41:28') },
    { id: 112, nickname: '云志远', mobile: '13812341112', community: '融创·金成府', room: '1栋1单元102', certified: 0, status: 1, create_time: daysAgo(14, ' 17:09:36') },
    { id: 113, nickname: '盛予怀', mobile: '13812341113', community: '绿城·桂语江南', room: '3栋1单元101', certified: 1, status: 1, create_time: daysAgo(18, ' 10:55:02') },
    { id: 114, nickname: '柯晚晴', mobile: '13812341114', community: '万科·未来城三期', room: '7栋1单元1801', certified: 0, status: 1, create_time: daysAgo(22, ' 20:31:44') },
    { id: 115, nickname: '简弘毅', mobile: '13812341115', community: '颐景园·江南里', room: '4栋1单元801', certified: 1, status: 1, create_time: daysAgo(27, ' 09:18:21') },
]

// ==================== 平台结算流水（今日 / 本月 / 累计结算额统计） ====================
/** status：1=已结算 0=结算中（结算中不计入结算额） */
export const settleRecords = [
    { id: 1, settle_sn: 'JS20260916001', order_sn: 'TG20260915011', order_type: '托管服务', nickname: '张伟', mobile: '13812341001', amount: '1080.00', status: 1, settle_time: daysAgo(0, ' 10:20:00') },
    { id: 2, settle_sn: 'JS20260916002', order_sn: 'SC20260915012', order_type: '膳食服务', nickname: '李娜', mobile: '13812341002', amount: '326.00', status: 1, settle_time: daysAgo(0, ' 11:05:00') },
    { id: 3, settle_sn: 'JS20260916003', order_sn: 'PZ20260915013', order_type: '陪诊服务', nickname: '陈晨', mobile: '13812341005', amount: '540.00', status: 1, settle_time: daysAgo(0, ' 15:32:00') },
    { id: 4, settle_sn: 'JS20260915004', order_sn: 'TG20260914014', order_type: '托管服务', nickname: '王强', mobile: '13812341003', amount: '2400.00', status: 1, settle_time: daysAgo(1, ' 09:40:00') },
    { id: 5, settle_sn: 'JS20260914005', order_sn: 'PZ20260913015', order_type: '陪诊服务', nickname: '赵敏', mobile: '13812341004', amount: '1600.00', status: 1, settle_time: daysAgo(2, ' 14:18:00') },
    { id: 6, settle_sn: 'JS20260913006', order_sn: 'SC20260912016', order_type: '膳食服务', nickname: '刘洋', mobile: '13812341006', amount: '468.00', status: 1, settle_time: daysAgo(3, ' 10:26:00') },
    { id: 7, settle_sn: 'JS20260911007', order_sn: 'TG20260910017', order_type: '托管服务', nickname: '张伟', mobile: '13812341001', amount: '860.00', status: 1, settle_time: daysAgo(5, ' 16:44:00') },
    { id: 8, settle_sn: 'JS20260910008', order_sn: 'PZ20260909018', order_type: '陪诊服务', nickname: '李娜', mobile: '13812341002', amount: '720.00', status: 1, settle_time: daysAgo(6, ' 09:52:00') },
    { id: 9, settle_sn: 'JS20260907009', order_sn: 'SC20260906019', order_type: '膳食服务', nickname: '陈晨', mobile: '13812341005', amount: '612.00', status: 1, settle_time: daysAgo(9, ' 11:30:00') },
    { id: 10, settle_sn: 'JS20260904010', order_sn: 'TG20260903020', order_type: '托管服务', nickname: '王强', mobile: '13812341003', amount: '1200.00', status: 1, settle_time: daysAgo(12, ' 15:05:00') },
    { id: 11, settle_sn: 'JS20260831011', order_sn: 'PZ20260830021', order_type: '陪诊服务', nickname: '赵敏', mobile: '13812341004', amount: '1800.00', status: 1, settle_time: daysAgo(16, ' 10:15:00') },
    { id: 12, settle_sn: 'JS20260828012', order_sn: 'SC20260827022', order_type: '膳食服务', nickname: '刘洋', mobile: '13812341006', amount: '526.00', status: 1, settle_time: daysAgo(19, ' 17:22:00') },
    { id: 13, settle_sn: 'JS20260825013', order_sn: 'TG20260824023', order_type: '托管服务', nickname: '张伟', mobile: '13812341001', amount: '2600.00', status: 1, settle_time: daysAgo(22, ' 09:38:00') },
    { id: 14, settle_sn: 'JS20260731014', order_sn: 'PZ20260730024', order_type: '陪诊服务', nickname: '陈晨', mobile: '13812341005', amount: '2540.00', status: 1, settle_time: daysAgo(45, ' 14:10:00') },
    { id: 15, settle_sn: 'JS20260916015', order_sn: 'SC20260915025', order_type: '膳食服务', nickname: '王强', mobile: '13812341003', amount: '288.00', status: 0, settle_time: '' },
]

// ==================== 待审核帖子发布 ====================
/** status：0=待审核 1=已通过 2=已驳回（此处仅存放待审核数据） */
export const pendingPosts = [
    { id: 1, title: '小区南门早市摆摊越来越挤，建议划出行人通道', author: '林静姝', mobile: '13812341101', community: '颐景园·江南里', category: '邻里互助', create_time: daysAgo(0, ' 08:12:00'), status: 0 },
    { id: 2, title: '9 月社区亲子运动会招募志愿者啦', author: '宋佳怡', mobile: '13812341103', community: '绿城·桂语江南', category: '活动召集', create_time: daysAgo(0, ' 10:36:00'), status: 0 },
    { id: 3, title: '地下车库负二层照明有几处不亮，物业能看看吗', author: '谢文韬', mobile: '13812341104', community: '万科·未来城三期', category: '物业服务', create_time: daysAgo(1, ' 19:24:00'), status: 0 },
    { id: 4, title: '出闲置儿童安全座椅，适合 1-4 岁', author: '毕若涵', mobile: '13812341105', community: '颐景园·江南里', category: '闲置转让', create_time: daysAgo(1, ' 21:05:00'), status: 0 },
    { id: 5, title: '老年大学书法班下周开课，还有名额', author: '罗婉清', mobile: '13812341107', community: '保利·天悦湾', category: '课程报名', create_time: daysAgo(2, ' 15:48:00'), status: 0 },
    { id: 6, title: '求助：有没有靠谱的开锁师傅推荐', author: '施念安', mobile: '13812341109', community: '万科·未来城三期', category: '生活求助', create_time: daysAgo(3, ' 09:03:00'), status: 0 },
]

// ==================== 待审核资源大厅发布 ====================
/** status：0=待审核 1=已通过 2=已驳回（此处仅存放待审核数据） */
export const pendingResources = [
    { id: 1, title: '小区门口便利店招聘夜班店员一名', category: '岗位招聘', price: '面议', author: '张伟', mobile: '13812341001', community: '颐景园·江南里', create_time: daysAgo(0, ' 09:40:00'), status: 0 },
    { id: 2, title: '专业育儿嫂，带娃 6 年经验可试工', category: '家政服务', price: '180.00', author: '李娜', mobile: '13812341002', community: '颐景园·江南里', create_time: daysAgo(0, ' 16:22:00'), status: 0 },
    { id: 3, title: '转让闲置电动缝纫机，九成新', category: '闲置转让', price: '320.00', author: '赵敏', mobile: '13812341004', community: '绿城·桂语江南', create_time: daysAgo(1, ' 11:15:00'), status: 0 },
    { id: 4, title: '工作日早高峰拼车前往未来科技城', category: '拼车出行', price: '35.00', author: '刘洋', mobile: '13812341006', community: '万科·未来城三期', create_time: daysAgo(2, ' 07:50:00'), status: 0 },
    { id: 5, title: '钢琴十级老师一对一上门授课', category: '技能培训', price: '200.00', author: '陈晨', mobile: '13812341005', community: '保利·天悦湾', create_time: daysAgo(4, ' 20:08:00'), status: 0 },
]

// ==================== 待查看生活帮手 ====================
/** status：0=待处理 1=已处理（此处仅存放待查看数据） */
export const pendingHelpers = [
    { id: 1, type: '家电维修', name: '空调不制冷上门检修', nickname: '张伟', mobile: '13812341001', community: '颐景园·江南里', building: '1栋1单元101', create_time: daysAgo(0, ' 08:35:00'), status: 0 },
    { id: 2, type: '管道疏通', name: '厨房下水道堵塞疏通', nickname: '王强', mobile: '13812341003', community: '颐景园·江南里', building: '1栋1单元201', create_time: daysAgo(0, ' 12:18:00'), status: 0 },
    { id: 3, type: '家政保洁', name: '三室一厅深度保洁', nickname: '赵敏', mobile: '13812341004', community: '绿城·桂语江南', building: '2栋1单元301', create_time: daysAgo(1, ' 09:26:00'), status: 0 },
    { id: 4, type: '开锁换锁', name: '入户门锁芯更换', nickname: '陈晨', mobile: '13812341005', community: '保利·天悦湾', building: '3栋2单元502', create_time: daysAgo(1, ' 18:44:00'), status: 0 },
    { id: 5, type: '家具安装', name: '衣柜拆装与五金件更换', nickname: '刘洋', mobile: '13812341006', community: '万科·未来城三期', building: '5栋1单元1103', create_time: daysAgo(2, ' 15:36:00'), status: 0 },
    { id: 6, type: '家电清洗', name: '油烟机深度拆洗', nickname: '李娜', mobile: '13812341002', community: '颐景园·江南里', building: '1栋1单元102', create_time: daysAgo(3, ' 10:52:00'), status: 0 },
]

/**
 * 售后陪诊单待审核：陪诊订单已完成（status===3）且用户已发起售后申请的订单 id
 * 对应 order.escort/lists 中标记的 after_sale: 1 记录
 */
export const escortAfterSaleIds = [3002, 3004]
