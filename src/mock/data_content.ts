/**
 * 内容管理模块 Mock 数据
 * 人力资源认证 / 人才库 / 人才订单 / 精彩内容 / 社区通知 / 社区活动 / Banner 图
 * 页面内的增删改直接操作以下数组
 * 图片统一使用 picsum 按业务场景 seed 生成虚拟图片
 */

/** 日期辅助：基于当前时间往前推 n 天 */
function daysAgo(n: number, time = ' 10:30:00') {
    const d = new Date()
    d.setDate(d.getDate() - n)
    const pad = (v: number) => String(v).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}${time}`
}

/** 日期辅助：基于当前时间往后推 n 天 */
function daysLater(n: number, time = ' 10:30:00') {
    return daysAgo(-n, time)
}

/** 仅日期部分 */
function dayAfter(n: number) {
    return daysLater(n).slice(0, 10)
}
function dayBefore(n: number) {
    return daysAgo(n).slice(0, 10)
}

const userImg = (n: number) => `https://picsum.photos/seed/ghj-user-${n}/100/100`
const certImg = (n: number) => `https://picsum.photos/seed/ghj-cert-${n}/400/300`
const talentImg = (n: number) => `https://picsum.photos/seed/ghj-talent-${n}/100/100`
const helperImg = (n: number) => `https://picsum.photos/seed/ghj-helper-${n}/400/300`
const wonderfulImg = (n: number) => `https://picsum.photos/seed/ghj-wonderful-${n}/400/300`
const activityImg = (n: number) => `https://picsum.photos/seed/ghj-activity-${n}/400/300`
const bannerImg = (n: number) => `https://picsum.photos/seed/ghj-banner-${n}/400/300`

// ==================== 生活帮手服务类目枚举 ====================
/** 人才「可服务类目」与「关联服务」共用 */
export const helperCategories = ['家电维修', '管道疏通', '开锁换锁', '保洁清洗', '代买代办', '居家照护', '其他']

/** 人才订单状态：0 待支付 1 待派单 2 服务中 3 已完成 4 已取消 */
export const talentOrderStatus: Record<number, string> = {
    0: '待支付',
    1: '待派单',
    2: '服务中',
    3: '已完成',
    4: '已取消'
}

// ==================== 人力资源：用户技能认证申请 ====================
/** 审核状态：0 待审核 1 已通过（进入人才库） 2 已驳回 */
export interface HrCertItem {
    id: number
    /** 认证技能标题 */
    title: string
    avatar: string
    nickname: string
    mobile: string
    /** 认证凭证图片 */
    cert_images: string[]
    /** 技能信息 */
    skill: string
    /** 详情描述 */
    detail: string
    status: number
    /** 驳回备注 */
    audit_reason: string
    submit_time: string
    audit_time: string
}

export const hrCertList: HrCertItem[] = [
    {
        id: 6001,
        title: '8年经验住家保姆',
        avatar: userImg(11),
        nickname: '张桂芳',
        mobile: '13812341011',
        cert_images: [certImg(1), certImg(2)],
        skill: '住家保姆',
        detail:
            '从事住家保姆工作8年，擅长老人日常照料、三餐营养搭配与家居清洁；持有健康证与家政服务员（中级）职业资格证书，可住家也可白班，服务过6个社区家庭。',
        status: 0,
        audit_reason: '',
        submit_time: daysAgo(0, ' 09:12:00'),
        audit_time: ''
    },
    {
        id: 6002,
        title: '12年经验家电维修师傅',
        avatar: talentImg(1),
        nickname: '钱志明',
        mobile: '13912343001',
        cert_images: [certImg(3), certImg(4), certImg(5)],
        skill: '家电维修',
        detail:
            '专注空调、冰箱、洗衣机等家用电器维修12年，持有制冷设备维修中级证与电工证，可上门检修、加氟、清洗保养，覆盖颐景园周边3公里社区。',
        status: 1,
        audit_reason: '',
        submit_time: daysAgo(6, ' 14:20:00'),
        audit_time: daysAgo(5, ' 10:05:00')
    },
    {
        id: 6003,
        title: '专业管道疏通（含高压清洗）',
        avatar: talentImg(3),
        nickname: '赵有发',
        mobile: '13912343003',
        cert_images: [certImg(6), certImg(7)],
        skill: '管道疏通',
        detail:
            '市政排水疏通从业9年，配备高压清洗机与管道内窥镜，可处理马桶、地漏、厨房主管道堵塞，30分钟快速响应，疏通不干净不收费。',
        status: 0,
        audit_reason: '',
        submit_time: daysAgo(1, ' 16:48:00'),
        audit_time: ''
    },
    {
        id: 6004,
        title: '高级母婴护理师（月嫂）',
        avatar: userImg(14),
        nickname: '孙丽华',
        mobile: '13812341014',
        cert_images: [certImg(8)],
        skill: '母婴护理',
        detail:
            '高级母婴护理师，持证（人社部育婴员高级），服务过28个新生儿家庭，擅长产妇月子餐、新生儿黄疸观察与科学喂养指导，可提供24小时住家服务。',
        status: 2,
        audit_reason: '上传的资格证书照片模糊无法辨认，且健康证已过期，请重新提交清晰证件照片。',
        submit_time: daysAgo(9, ' 11:02:00'),
        audit_time: daysAgo(8, ' 15:30:00')
    },
    {
        id: 6005,
        title: '持证开锁换锁（公安备案）',
        avatar: talentImg(4),
        nickname: '蒋伟',
        mobile: '13912343004',
        cert_images: [certImg(9), certImg(10)],
        skill: '开锁换锁',
        detail:
            '公安备案开锁技师，从业15年，持有锁具修理服务备案登记证，可提供紧急开锁、锁芯更换、智能锁安装服务，夜间30分钟上门。',
        status: 1,
        audit_reason: '',
        submit_time: daysAgo(12, ' 20:15:00'),
        audit_time: daysAgo(11, ' 09:40:00')
    },
    {
        id: 6006,
        title: '6年经验深度保洁阿姨',
        avatar: talentImg(2),
        nickname: '王晓梅',
        mobile: '13912343002',
        cert_images: [certImg(11), certImg(12)],
        skill: '保洁清洗',
        detail:
            '专注家庭深度保洁6年，擅长开荒保洁、厨房重油污清理与抽油烟机拆洗，自带全套清洁工具与环保清洁剂，可按次或按小时计费。',
        status: 0,
        audit_reason: '',
        submit_time: daysAgo(2, ' 08:36:00'),
        audit_time: ''
    },
    {
        id: 6007,
        title: '居家养老照护护理员',
        avatar: talentImg(5),
        nickname: '何秀娟',
        mobile: '13912343005',
        cert_images: [certImg(13), certImg(14)],
        skill: '居家照护',
        detail:
            '养老护理员（中级）持证，8年失能与半失能老人照护经验，可提供翻身拍背、鼻饲护理、康复按摩与陪诊服务，性格耐心细致。',
        status: 1,
        audit_reason: '',
        submit_time: daysAgo(16, ' 13:22:00'),
        audit_time: daysAgo(15, ' 10:18:00')
    },
    {
        id: 6008,
        title: '社区代买代办跑腿（兼职）',
        avatar: userImg(18),
        nickname: '周凯',
        mobile: '13812341018',
        cert_images: [certImg(15)],
        skill: '代买代办',
        detail: '本人为小区业主，工作之余可帮忙代买菜、代取快递、代排队缴费，熟悉周边商超与菜市场，随叫随到。',
        status: 2,
        audit_reason: '暂不收录兼职人员，需提供有效的健康证明与社区居住证明后再申请。',
        submit_time: daysAgo(4, ' 19:05:00'),
        audit_time: daysAgo(3, ' 09:26:00')
    },
    {
        id: 6009,
        title: '社区跑腿代买代取（全职）',
        avatar: talentImg(6),
        nickname: '罗小川',
        mobile: '13912343006',
        cert_images: [certImg(16), certImg(17)],
        skill: '代买代办',
        detail:
            '本职物流配送，业余时间全职承接社区跑腿服务，熟悉小区周边商超、菜市场与快递驿站，可代买菜、代取件、代排队缴费，自备保温箱与折叠拖车，全程拍照留证。',
        status: 1,
        audit_reason: '',
        submit_time: daysAgo(150, ' 11:20:00'),
        audit_time: daysAgo(149, ' 09:10:00')
    },
    {
        id: 6010,
        title: '家庭保洁与家电清洗（双技能）',
        avatar: talentImg(7),
        nickname: '孙丽',
        mobile: '13912343007',
        cert_images: [certImg(18)],
        skill: '保洁清洗',
        detail:
            '持家政服务员（四级）证书，同时提供家庭日常保洁与家电清洗服务，擅长玻璃清洁、油烟机与空调深度清洗，自带专业清洗设备，可按次或按小时计费。',
        status: 1,
        audit_reason: '',
        submit_time: daysAgo(126, ' 15:40:00'),
        audit_time: daysAgo(125, ' 10:26:00')
    },
    {
        id: 6011,
        title: '家具安装与墙面修补',
        avatar: talentImg(8),
        nickname: '邓国平',
        mobile: '13912343008',
        cert_images: [certImg(19), certImg(20)],
        skill: '其他',
        detail:
            '从事家具安装与墙面修补行业5年，可安装衣柜、晾衣架、窗帘杆等各类家居用品，修补墙面孔洞与裂缝，工具齐全，收费透明，支持周末上门服务。',
        status: 1,
        audit_reason: '',
        submit_time: daysAgo(96, ' 09:55:00'),
        audit_time: daysAgo(95, ' 14:12:00')
    }
]

// ==================== 人才库 ====================
/** 人才状态：1 启用 0 禁用（禁用后无法进行订单关联） */
export interface TalentItem {
    id: number
    avatar: string
    nickname: string
    mobile: string
    /** 所属小区 */
    community: string
    /** 认证技能 */
    skill: string
    /** 可服务类目 */
    categories: string[]
    order_total: number
    processing: number
    done: number
    canceled: number
    /** 已完成订单总金额 */
    done_amount: number
    status: number
    create_time: string
}

export const talentList: TalentItem[] = [
    {
        id: 1,
        avatar: talentImg(1),
        nickname: '钱志明',
        mobile: '13912343001',
        community: '颐景园·江南里',
        skill: '家电维修',
        categories: ['家电维修', '其他'],
        order_total: 128,
        processing: 3,
        done: 121,
        canceled: 4,
        done_amount: 15360,
        status: 1,
        create_time: daysAgo(210)
    },
    {
        id: 2,
        avatar: talentImg(2),
        nickname: '王晓梅',
        mobile: '13912343002',
        community: '颐景园·江南里',
        skill: '保洁清洗',
        categories: ['保洁清洗'],
        order_total: 203,
        processing: 2,
        done: 196,
        canceled: 5,
        done_amount: 21560,
        status: 1,
        create_time: daysAgo(196)
    },
    {
        id: 3,
        avatar: talentImg(3),
        nickname: '赵有发',
        mobile: '13912343003',
        community: '绿城·桂语江南',
        skill: '管道疏通',
        categories: ['管道疏通', '其他'],
        order_total: 176,
        processing: 1,
        done: 170,
        canceled: 5,
        done_amount: 14280,
        status: 1,
        create_time: daysAgo(188)
    },
    {
        id: 4,
        avatar: talentImg(4),
        nickname: '蒋伟',
        mobile: '13912343004',
        community: '万科·未来城三期',
        skill: '开锁换锁',
        categories: ['开锁换锁'],
        order_total: 96,
        processing: 0,
        done: 92,
        canceled: 4,
        done_amount: 15640,
        status: 1,
        create_time: daysAgo(175)
    },
    {
        id: 5,
        avatar: talentImg(5),
        nickname: '何秀娟',
        mobile: '13912343005',
        community: '保利·天悦湾',
        skill: '居家照护',
        categories: ['居家照护', '代买代办'],
        order_total: 142,
        processing: 4,
        done: 133,
        canceled: 5,
        done_amount: 34580,
        status: 1,
        create_time: daysAgo(160)
    },
    {
        id: 6,
        avatar: talentImg(6),
        nickname: '罗小川',
        mobile: '13912343006',
        community: '万科·未来城三期',
        skill: '代买代办',
        categories: ['代买代办', '其他'],
        order_total: 87,
        processing: 2,
        done: 80,
        canceled: 5,
        done_amount: 5680,
        status: 1,
        create_time: daysAgo(145)
    },
    {
        id: 7,
        avatar: talentImg(7),
        nickname: '孙丽',
        mobile: '13912343007',
        community: '保利·天悦湾',
        skill: '保洁清洗',
        categories: ['保洁清洗', '家电维修'],
        order_total: 65,
        processing: 1,
        done: 60,
        canceled: 4,
        done_amount: 7320,
        status: 0,
        create_time: daysAgo(120)
    },
    {
        id: 8,
        avatar: talentImg(8),
        nickname: '邓国平',
        mobile: '13912343008',
        community: '绿城·桂语江南',
        skill: '其他',
        categories: ['其他'],
        order_total: 38,
        processing: 0,
        done: 35,
        canceled: 3,
        done_amount: 4260,
        status: 0,
        create_time: daysAgo(90)
    }
]

// ==================== 人才订单 ====================
/** 人才库用户关联的生活帮手订单 */
export interface TalentOrderItem {
    id: number
    talent_id: number
    cover: string
    title: string
    amount: string
    /** 下单用户 */
    buyer: string
    status: number
    /** 订单评价：星级 + 评语 */
    score: { stars: number; content: string }
    submit_time: string
    finish_time: string
}

export const talentOrderList: TalentOrderItem[] = [
    {
        id: 4001,
        talent_id: 1,
        cover: helperImg(1),
        title: '空调维修加氟',
        amount: '120.00',
        buyer: '张伟',
        status: 2,
        score: { stars: 0, content: '' },
        submit_time: daysAgo(0, ' 09:40:00'),
        finish_time: ''
    },
    {
        id: 4002,
        talent_id: 1,
        cover: helperImg(1),
        title: '洗衣机不脱水检修',
        amount: '100.00',
        buyer: '刘洋',
        status: 3,
        score: { stars: 5, content: '师傅上门很准时，半小时就修好了，收费透明。' },
        submit_time: daysAgo(3, ' 15:12:00'),
        finish_time: daysAgo(3, ' 17:40:00')
    },
    {
        id: 4003,
        talent_id: 2,
        cover: helperImg(4),
        title: '两室一厅日常保洁',
        amount: '160.00',
        buyer: '赵敏',
        status: 3,
        score: { stars: 5, content: '打扫得很干净，厨房油污都清掉了，下次还找她。' },
        submit_time: daysAgo(2, ' 10:05:00'),
        finish_time: daysAgo(2, ' 12:30:00')
    },
    {
        id: 4004,
        talent_id: 2,
        cover: helperImg(4),
        title: '抽油烟机深度拆洗',
        amount: '150.00',
        buyer: '张伟',
        status: 4,
        score: { stars: 0, content: '' },
        submit_time: daysAgo(5, ' 09:20:00'),
        finish_time: ''
    },
    {
        id: 4005,
        talent_id: 3,
        cover: helperImg(2),
        title: '马桶堵塞疏通',
        amount: '80.00',
        buyer: '李娜',
        status: 3,
        score: { stars: 5, content: '十几分钟就通好了，还顺手把地面清理干净。' },
        submit_time: daysAgo(1, ' 15:20:00'),
        finish_time: daysAgo(1, ' 16:05:00')
    },
    {
        id: 4006,
        talent_id: 3,
        cover: helperImg(2),
        title: '厨房主管道高压清洗',
        amount: '260.00',
        buyer: '陈晨',
        status: 3,
        score: { stars: 4, content: '设备很专业，堵塞问题解决彻底，就是等待时间稍长。' },
        submit_time: daysAgo(8, ' 11:30:00'),
        finish_time: daysAgo(8, ' 14:10:00')
    },
    {
        id: 4007,
        talent_id: 4,
        cover: helperImg(3),
        title: '更换防盗门锁芯',
        amount: '160.00',
        buyer: '陈晨',
        status: 3,
        score: { stars: 5, content: '晚上十点多求助也上门了，收费没有额外加价。' },
        submit_time: daysAgo(6, ' 21:40:00'),
        finish_time: daysAgo(6, ' 22:35:00')
    },
    {
        id: 4008,
        talent_id: 5,
        cover: helperImg(6),
        title: '半天陪护照料',
        amount: '260.00',
        buyer: '刘洋',
        status: 2,
        score: { stars: 0, content: '' },
        submit_time: daysAgo(1, ' 08:15:00'),
        finish_time: ''
    },
    {
        id: 4009,
        talent_id: 5,
        cover: helperImg(6),
        title: '术后居家照护3天',
        amount: '780.00',
        buyer: '王强',
        status: 3,
        score: { stars: 5, content: '照护人员很有耐心，还会帮忙做康复按摩，家人放心。' },
        submit_time: daysAgo(11, ' 09:00:00'),
        finish_time: daysAgo(8, ' 18:00:00')
    },
    {
        id: 4010,
        talent_id: 6,
        cover: helperImg(5),
        title: '超市代买配送到家',
        amount: '30.00',
        buyer: '周杰',
        status: 3,
        score: { stars: 4, content: '东西买得很齐全，配送也快，就是少拿了一样小东西。' },
        submit_time: daysAgo(4, ' 16:22:00'),
        finish_time: daysAgo(4, ' 17:10:00')
    }
]

// ==================== 精彩内容 ====================
export const contentWonderfulList = [
    {
        id: 2001,
        cover: wonderfulImg(1),
        title: '邻里节圆满落幕：一场属于我们自己的社区狂欢',
        content:
            '<h4>邻里节精彩回顾</h4><p>9月12日下午，颐景园·江南里中心广场热闹非凡，第二届邻里节在业主们的欢声笑语中圆满落幕。现场设置了美食品鉴、亲子游戏、跳蚤市场三大区域，共吸引300余户家庭参与。</p><blockquote>“搬进来三年，第一次认识这么多邻居，孩子也玩得很开心。” —— 3栋业主李女士</blockquote><p>物业服务中心将持续组织此类社区活动，让邻里关系更紧密。</p>',
        status: 1,
        sort: 1,
        views: 1286,
        create_time: daysAgo(4, ' 17:20:00')
    },
    {
        id: 2002,
        cover: wonderfulImg(2),
        title: '社区养老服务再升级：日间照料中心正式开放',
        content:
            '<h4>日间照料中心开放</h4><p>位于会所一楼的日间照料中心已正式开放，内设休息区、康复区、阅读区与助浴室，由专业护理人员值守，为社区长者提供日托、助餐、康复训练等服务。</p><ul><li>开放时间：周一至周日 8:00-18:00</li><li>服务热线：0571-8888xxxx</li></ul>',
        status: 1,
        sort: 2,
        views: 968,
        create_time: daysAgo(7, ' 10:05:00')
    },
    {
        id: 2003,
        cover: wonderfulImg(3),
        title: '便民服务日：免费磨刀、理发、缝补一站式搞定',
        content:
            '<h4>每月便民服务日</h4><p>每月15日为社区便民服务日，物业联合志愿者团队为业主提供免费磨刀、理发、缝补、小家电检测等服务，累计服务业主超过1200人次。</p>',
        status: 1,
        sort: 3,
        views: 742,
        create_time: daysAgo(11, ' 15:40:00')
    },
    {
        id: 2004,
        cover: wonderfulImg(4),
        title: '消防安全演练进社区，这些逃生知识要记牢',
        content:
            '<h4>消防演练回顾</h4><p>为提升业主消防安全意识，物业联合消防中队开展了高层火灾逃生演练，现场讲解灭火器使用、浓烟环境逃生姿势与家庭消防隐患排查要点。</p>',
        status: 1,
        sort: 4,
        views: 615,
        create_time: daysAgo(15, ' 09:30:00')
    },
    {
        id: 2005,
        cover: wonderfulImg(5),
        title: '社区食堂上新：秋季养身餐正式供应',
        content:
            '<h4>秋季养身餐</h4><p>社区食堂本月推出秋季养身餐系列，包含山药排骨汤、百合银耳羹等12款餐品，低油低盐，支持线上预订与配送到家。</p>',
        status: 0,
        sort: 5,
        views: 388,
        create_time: daysAgo(19, ' 11:15:00')
    },
    {
        id: 2006,
        cover: wonderfulImg(6),
        title: '暑期公益课堂结课，孩子们收获满满',
        content:
            '<h4>公益课堂结课</h4><p>为期两周的暑期公益课堂顺利结课，共开设书法、绘画、围棋、少儿编程四门课程，服务社区儿童86名。</p>',
        status: 1,
        sort: 6,
        views: 523,
        create_time: daysAgo(24, ' 16:00:00')
    },
    {
        id: 2007,
        cover: wonderfulImg(7),
        title: '园区绿化改造完成，新增两处口袋花园',
        content:
            '<h4>绿化改造</h4><p>园区新增两处口袋花园，补植桂花、绣球等乔灌木300余株，新增休闲座椅12套，为业主提供更多休憩空间。</p>',
        status: 0,
        sort: 7,
        views: 302,
        create_time: daysAgo(28, ' 14:25:00')
    },
    {
        id: 2008,
        cover: wonderfulImg(8),
        title: '业主故事：退休教师组建社区合唱团',
        content:
            '<h4>业主故事</h4><p>退休音乐教师王阿姨牵头组建了社区合唱团，从最初的6人发展到如今的42人，每周三晚在会所排练。</p><blockquote>“唱歌让退休生活有了奔头。” —— 合唱团发起人王阿姨</blockquote>',
        status: 1,
        sort: 8,
        views: 861,
        create_time: daysAgo(33, ' 19:10:00')
    }
]

// ==================== 社区通知 ====================
export const contentNoticeList = [
    {
        id: 3001,
        title: '关于中秋节期间社区活动安排的通知',
        content:
            '<p>各位业主：</p><p>中秋佳节将至，社区将于9月15日18:30-21:00在中心广场举办「月满邻里·中秋晚会」，现场设有猜灯谜、做月饼、赏月茶话等环节，欢迎广大业主携家人参加。</p><p>届时中心广场周边车位紧张，建议绿色出行。</p><p style="text-align:right">物业服务中心</p>',
        status: 1,
        sort: 1,
        views: 1024,
        create_time: daysAgo(2, ' 09:00:00')
    },
    {
        id: 3002,
        title: '停水通知：3栋、5栋将于本周三进行管道检修',
        content:
            '<p>各位业主：</p><p>因供水主管道阀门更换，3栋、5栋将于本周三（9月18日）9:00-16:00临时停水，请提前做好储水准备。复水后可能出现短暂水质浑浊，排放数分钟即可恢复正常。</p><p>给您带来不便，敬请谅解。</p>',
        status: 1,
        sort: 2,
        views: 863,
        create_time: daysAgo(3, ' 15:30:00')
    },
    {
        id: 3003,
        title: '电梯维保通知：1栋1单元电梯定期保养',
        content:
            '<p>各位业主：</p><p>为保障电梯运行安全，1栋1单元电梯将于9月20日 8:30-11:30进行例行保养，期间电梯暂停使用，请提前安排出行。</p>',
        status: 1,
        sort: 3,
        views: 512,
        create_time: daysAgo(6, ' 08:40:00')
    },
    {
        id: 3004,
        title: '关于规范电动车停放及充电的温馨提示',
        content:
            '<p>各位业主：</p><p>近期发现部分业主将电动车推入楼道或私拉电线充电，存在严重消防隐患。请各位业主将电动车停放至地下车库指定区域，使用小区集中充电设施。</p><p>物业将加大巡查力度，对违规停放车辆进行清理。</p>',
        status: 1,
        sort: 4,
        views: 1290,
        create_time: daysAgo(9, ' 17:20:00')
    },
    {
        id: 3005,
        title: '社区食堂国庆假期营业时间调整',
        content:
            '<p>各位业主：</p><p>国庆假期（10月1日-10月7日）社区食堂营业时间调整为 7:30-19:30，其中10月1日-10月2日仅供应午餐与晚餐，请合理安排就餐。</p>',
        status: 0,
        sort: 5,
        views: 246,
        create_time: daysAgo(13, ' 10:15:00')
    },
    {
        id: 3006,
        title: '关于开展2026年度业主满意度调查的通知',
        content:
            '<p>各位业主：</p><p>为持续提升服务品质，物业服务中心将于9月20日-9月30日开展2026年度业主满意度调查，问卷可通过APP首页入口填写，感谢您的支持与宝贵建议。</p>',
        status: 1,
        sort: 6,
        views: 438,
        create_time: daysAgo(17, ' 11:05:00')
    },
    {
        id: 3007,
        title: '冬季供暖试压通知：请注意家中留人',
        content:
            '<p>各位业主：</p><p>供暖季临近，物业将于11月5日-11月8日对供暖系统进行分栋试压，请家中务必留人观察，如发现管道渗漏请及时联系物业报修。</p>',
        status: 0,
        sort: 7,
        views: 189,
        create_time: daysAgo(21, ' 14:50:00')
    },
    {
        id: 3008,
        title: '关于清理楼道杂物的重要通知',
        content:
            '<p>各位业主：</p><p>为消除消防隐患、保障生命通道畅通，请于9月30日前自行清理堆放在楼道、管道井内的杂物。逾期未清理的，物业将联合社区进行统一清理。</p>',
        status: 1,
        sort: 8,
        views: 967,
        create_time: daysAgo(26, ' 09:35:00')
    }
]

// ==================== 社区活动 ====================
/** signup_status：1 正常报名 0 已手动停止报名 */
export const contentActivityList = [
    {
        id: 7001,
        title: '月满邻里·中秋晚会',
        cover: activityImg(1),
        activity_time: '9月15日（中秋节）18:30-21:00',
        signup_start: dayBefore(12),
        signup_end: dayAfter(5),
        address: '颐景园·江南里中心广场',
        signup: 86,
        sort: 1,
        status: 1,
        signup_status: 1,
        content:
            '<h4>活动详情</h4><p>中秋之夜，邻里同乐。现场设有猜灯谜、手工月饼DIY、亲子灯笼制作与赏月茶话四个区域，参与家庭均可领取中秋伴手礼一份。</p><ul><li>活动时间：9月15日 18:30-21:00</li><li>活动地点：中心广场</li><li>报名对象：社区全体业主</li></ul>',
        create_time: daysAgo(12, ' 10:00:00')
    },
    {
        id: 7002,
        title: '周末亲子烘焙课堂',
        cover: activityImg(2),
        activity_time: '9月21日（周六）10:00-11:30',
        signup_start: dayBefore(8),
        signup_end: dayAfter(3),
        address: '社区会所二楼烘焙室',
        signup: 24,
        sort: 2,
        status: 1,
        signup_status: 1,
        content:
            '<h4>活动详情</h4><p>专业烘焙师带队，家长与孩子共同完成6寸水果奶油蛋糕一个，材料由社区提供，成品可带走。</p><ul><li>适合年龄：4-12岁儿童（需一名家长陪同）</li><li>活动费用：材料费 39 元/组</li></ul>',
        create_time: daysAgo(8, ' 09:20:00')
    },
    {
        id: 7003,
        title: '社区健康义诊暨免费体检',
        cover: activityImg(3),
        activity_time: '9月25日（周三）8:30-11:30',
        signup_start: dayBefore(6),
        signup_end: dayAfter(6),
        address: '社区日间照料中心一楼',
        signup: 63,
        sort: 3,
        status: 1,
        signup_status: 1,
        content:
            '<h4>活动详情</h4><p>联合市三甲医院开展义诊，提供血压血糖检测、心电图、内科问诊与用药指导，60岁以上业主可免费领取健康礼包。</p>',
        create_time: daysAgo(6, ' 14:10:00')
    },
    {
        id: 7004,
        title: '业主羽毛球友谊赛',
        cover: activityImg(4),
        activity_time: '9月28日（周六）14:00-17:00',
        signup_start: dayBefore(10),
        signup_end: dayAfter(9),
        address: '社区体育馆羽毛球馆',
        signup: 32,
        sort: 4,
        status: 1,
        signup_status: 1,
        content:
            '<h4>活动详情</h4><p>设男单、女单、混双三个项目，采用小组循环+淘汰赛制，前三名可获得社区积分与实物奖励。</p>',
        create_time: daysAgo(10, ' 16:40:00')
    },
    {
        id: 7005,
        title: '重阳节敬老茶话会',
        cover: activityImg(5),
        activity_time: '10月11日（周五）9:30-11:00',
        signup_start: dayBefore(5),
        signup_end: dayAfter(20),
        address: '社区会所三楼多功能厅',
        signup: 45,
        sort: 5,
        status: 1,
        signup_status: 1,
        content:
            '<h4>活动详情</h4><p>邀请社区60岁以上长者可参加，现场提供茶饮点心、戏曲表演与免费理发，每位到场长者均可领取重阳糕礼盒。</p>',
        create_time: daysAgo(5, ' 11:30:00')
    },
    {
        id: 7006,
        title: '国庆邻里趣味运动会',
        cover: activityImg(6),
        activity_time: '10月2日（周三）9:00-12:00',
        signup_start: dayBefore(20),
        signup_end: dayBefore(4),
        address: '颐景园·江南里中心广场',
        signup: 118,
        sort: 6,
        status: 1,
        signup_status: 1,
        content:
            '<h4>活动详情</h4><p>设拔河、两人三足、投壶、跳绳接力等趣味项目，以楼栋为单位组队参赛，冠军队伍可获得社区积分奖励。</p>',
        create_time: daysAgo(20, ' 09:00:00')
    },
    {
        id: 7007,
        title: '社区跳蚤市场（旧物置换）',
        cover: activityImg(7),
        activity_time: '10月18日（周五）15:00-18:00',
        signup_start: dayBefore(15),
        signup_end: dayBefore(2),
        address: '小区南门商业街',
        signup: 56,
        sort: 7,
        status: 1,
        signup_status: 1,
        content:
            '<h4>活动详情</h4><p>鼓励业主将闲置物品带到现场进行置换或低价出售，摊位由物业统一安排，需提前报名申请摊号。</p>',
        create_time: daysAgo(15, ' 13:50:00')
    },
    {
        id: 7008,
        title: '亲子植树·园区绿化共建活动',
        cover: activityImg(8),
        activity_time: '3月12日（植树节）9:00-11:00',
        signup_start: dayBefore(120),
        signup_end: dayBefore(100),
        address: '园区东侧绿化带',
        signup: 40,
        sort: 8,
        status: 0,
        signup_status: 0,
        content:
            '<h4>活动详情</h4><p>以家庭为单位认领树苗，共同完成栽种并挂上专属认领牌，物业负责后期养护。</p>',
        create_time: daysAgo(120, ' 08:30:00')
    }
]

// ==================== 社区活动报名记录 ====================
export const contentActivitySignupList = [
    { id: 1, activity_id: 7001, avatar: userImg(1), nickname: '张伟', phone: '13812341001', signup_time: daysAgo(11, ' 10:12:00') },
    { id: 2, activity_id: 7001, avatar: userImg(2), nickname: '李娜', phone: '13812341002', signup_time: daysAgo(11, ' 10:35:00') },
    { id: 3, activity_id: 7001, avatar: userImg(3), nickname: '王强', phone: '13812341003', signup_time: daysAgo(10, ' 08:40:00') },
    { id: 4, activity_id: 7001, avatar: userImg(4), nickname: '赵敏', phone: '13812341004', signup_time: daysAgo(9, ' 20:15:00') },
    { id: 5, activity_id: 7001, avatar: userImg(5), nickname: '陈晨', phone: '13812341005', signup_time: daysAgo(8, ' 12:05:00') },
    { id: 6, activity_id: 7002, avatar: userImg(2), nickname: '李娜', phone: '13812341002', signup_time: daysAgo(7, ' 09:22:00') },
    { id: 7, activity_id: 7002, avatar: userImg(6), nickname: '刘洋', phone: '13812341006', signup_time: daysAgo(7, ' 14:30:00') },
    { id: 8, activity_id: 7002, avatar: userImg(7), nickname: '周杰', phone: '13812341007', signup_time: daysAgo(6, ' 19:45:00') },
    { id: 9, activity_id: 7003, avatar: userImg(1), nickname: '张伟', phone: '13812341001', signup_time: daysAgo(5, ' 08:05:00') },
    { id: 10, activity_id: 7003, avatar: userImg(8), nickname: '吴芳', phone: '13812341008', signup_time: daysAgo(5, ' 09:18:00') },
    { id: 11, activity_id: 7004, avatar: userImg(3), nickname: '王强', phone: '13812341003', signup_time: daysAgo(9, ' 21:10:00') },
    { id: 12, activity_id: 7004, avatar: userImg(5), nickname: '陈晨', phone: '13812341005', signup_time: daysAgo(8, ' 11:00:00') },
    { id: 13, activity_id: 7005, avatar: userImg(4), nickname: '赵敏', phone: '13812341004', signup_time: daysAgo(4, ' 15:26:00') },
    { id: 14, activity_id: 7006, avatar: userImg(6), nickname: '刘洋', phone: '13812341006', signup_time: daysAgo(19, ' 10:40:00') },
    { id: 15, activity_id: 7006, avatar: userImg(7), nickname: '周杰', phone: '13812341007', signup_time: daysAgo(18, ' 16:12:00') },
    { id: 16, activity_id: 7007, avatar: userImg(8), nickname: '吴芳', phone: '13812341008', signup_time: daysAgo(14, ' 13:35:00') }
]

/** Banner 跳转：link_type 类目（nursing 托管 / escort 陪诊 / helper 生活帮手 / activity 活动 / wallet 钱袋子固定页 / wonderful 精彩内容 / notice 通知公告 / none 不跳转）+ link_id 具体内容 */
export const contentBannerList = [
    {
        id: 8001,
        name: '首页-中秋晚会活动推广',
        image: bannerImg(1),
        sort: 1,
        status: 1,
        link_type: 'activity',
        link_id: 7001,
        link: '/pages/activity/detail?id=7001',
        create_time: daysAgo(12, ' 09:00:00')
    },
    {
        id: 8002,
        name: '首页-社区养老服务宣传',
        image: bannerImg(2),
        sort: 2,
        status: 1,
        link_type: 'nursing',
        link_id: 1001,
        link: '/pages/nursing/detail?id=1001',
        create_time: daysAgo(20, ' 10:20:00')
    },
    {
        id: 8003,
        name: '首页-陪诊服务上线',
        image: bannerImg(3),
        sort: 3,
        status: 1,
        link_type: 'escort',
        link_id: 2001,
        link: '/pages/escort/detail?id=2001',
        create_time: daysAgo(26, ' 15:40:00')
    },
    {
        id: 8004,
        name: '首页-生活帮手新人立减',
        image: bannerImg(4),
        sort: 4,
        status: 1,
        link_type: 'helper',
        link_id: 4001,
        link: '/pages/helper/detail?id=4001',
        create_time: daysAgo(30, ' 11:10:00')
    },
    {
        id: 8005,
        name: '首页-钱袋子便捷缴费',
        image: bannerImg(5),
        sort: 5,
        status: 0,
        link_type: 'wallet',
        link_id: '',
        link: '/pages/wallet/index',
        create_time: daysAgo(35, ' 09:50:00')
    },
    {
        id: 8006,
        name: '首页-业主满意度调研',
        image: bannerImg(6),
        sort: 6,
        status: 0,
        link_type: 'none',
        link_id: '',
        link: '',
        create_time: daysAgo(40, ' 16:30:00')
    },
    {
        id: 8007,
        name: '首页-邻里节精彩回顾',
        image: bannerImg(7),
        sort: 7,
        status: 1,
        link_type: 'wonderful',
        link_id: 2001,
        link: '/pages/article/detail?id=2001',
        create_time: daysAgo(8, ' 14:20:00')
    },
    {
        id: 8008,
        name: '首页-中秋活动安排通知',
        image: bannerImg(8),
        sort: 8,
        status: 0,
        link_type: 'notice',
        link_id: 3001,
        link: '/pages/notice/detail?id=3001',
        create_time: daysAgo(6, ' 11:05:00')
    }
]
