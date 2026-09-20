# 顾好家物业管理后台 - 项目记忆

## 项目基本信息
- 项目：1530-01 顾好家-社区服务APP 物业管理后台
- 技术栈：Vue3 + Vite + TypeScript + Element Plus + Pinia + ECharts + wangEditor
- GitHub 仓库：https://github.com/hzhou1734-pixel/153001-wydpc-ue（public，main 分支）
- 远程地址：https://github.com/hzhou1734-pixel/153001-wydpc-ue.git
- **工作分支（2026-09-19 起，用户要求）**：`dev`（从 main v1.0.56 分出）。后续所有改动默认提交到 dev 分支；main/EdgeOne 线上保持 v1.0.56 状态，用户要求合并时再合

## Git 提交约定（用户明确要求）
- **每次功能修改后必须自动执行**：git add → commit → 递增版本号 tag → push（当前均提交到 dev 分支）
- commit 信息格式：`v1.0.X: <描述>`
- 版本号 tag：v1.0.X 递增（当前 v1.0.0）
- 推送方式：token 存于 ~/.ghj_publish_token，使用 `git -c http.extraHeader="Authorization: Basic $(echo -n "x-access-token:$TOKEN" | base64)" push`（避免环境变量被安全过滤）；shell PATH 损坏时 git 用绝对路径；base64 用 node -e 生成；推送被代理 502 阻塞时本地积压（commit+tag 均安全），代理恢复后 `push origin dev --tags` 一次性补推
- ⚠️ 推送坑（2026-09-19）：PortableGit 的 mingw64/libexec/git-core 缺失时 push 报 `remote-https is not a git command` → 解决：`git.exe --exec-path="<PortableGit>/mingw64/bin" push ...`（git-remote-https.exe 在 bin 下）；另 PS 5.1 下 `2>&1 |` 管道会中断 vite 构建，直接用 node 运行 node_modules/vite/bin/vite.js 最稳
- git 身份：hzhou1734-pixel / hzhou1734-pixel@users.noreply.github.com（用 -c 参数传入）

## 项目结构要点
- src/views 主要模块：workbench（工作台）、consumer（消费者）、finance（财务：余额明细/充值记录/退款记录）、organization（部门/岗位）、user、article、material、setting、permission 等
- scripts/release.mjs：build 后将 dist 复制到 ../server/public/admin
- .gitignore 已排除 node_modules、dist、.env.* 等

## Mock 数据一致性约定（扩充数据时必须遵守）
- `roomList.certified === 1` ⟺ `certifyList.status === 1`（已通过）；`certified 0` ⟺ `status 0`（待审核）或无记录；`consumerList.certified` 需同步
- 同一业主在 consumerList / roomList / certifyList 三张表中手机号必须完全一致
- **无「单元」层级（v1.0.51 起，以需求文档为准）**：buildingTree 只有楼栋一级（无 children/units），roomList 不再有 unit_id，房号直接在楼栋下编号为 101/102/103…，地址一律「X栋XXX」不再出现「单元」；certifyList 也无 unit 字段
- 手机号一律完整显示，禁止 **** 脱敏（v1.0.23 起）
- 页数/栋数等统计值一律由 mock 数据实时计算，不硬编码（v1.0.19 起）

## 线上部署（EdgeOne）
- 部署域名：https://1530-01-wyd.admin.ue.ehaiba.net （用户通过 EdgeOne 关联 GitHub 仓库自动构建）
- EdgeOne 构建配置：安装 `npm install`、构建命令 `npm run build`、输出目录 `dist`、Node ≥ 18
- **构建基路径（v1.0.29 起）**：`vite.config.ts` 中 `base: process.env.VITE_PUBLIC_PATH || '/'`，面向域名根部署
  - 若需部署到子目录 `/admin/`：用 `npm run build:release`（= `vite build --base=/admin/ && node scripts/release.mjs`，产物复制到 ../server/public/admin）
  - ⚠️ 历史坑：base 为 `/admin/` 而站点部署在根时，EdgeOne 会把 `/admin/assets/xx.js` 回退返回 index.html（text/html），module 脚本 MIME 不匹配 → 页面全白
- 路由 `createWebHistory(import.meta.env.BASE_URL)`，需平台侧开启 SPA 回退（未匹配路径返回 index.html）
- 接口基址 `.env.production` → `VITE_APP_BASE_URL=https://likeadmin.l.440.red:9443`（已验证连通）；登录走 src/mock/user.ts，业务页部分走 @/mock/api

## 工作方式
- 用户通过问答方式提出功能修改需求，AI 执行修改后自动提交推送
- **唯一需求基准（v1.0.51）**：`项目资料/1530-01-01 顾好家社区服务APP需求细化文档-物业端.docx`（提取文本 `项目资料/_wuyeduan_extract_full.txt`）。凡旧约定与该文档冲突，一律以文档为准（用户已确认「所有内容以文档为准」）

## 业务约定
- 支付/财务侧无「余额」概念：不得出现余额支付、余额调整、退款记录等（v1.0.33 起）；**例外**：用户详情「顾好家币」Tab（账户余额 + 账户明细）为文档明确模块，v1.0.51 起恢复
- 膳食服务计价模式：套餐组合固定价（不同菜品组合对应不同固定价格），非单品累加、非每日统一价（v1.0.35 用户确认）
- 托管类型固定：日托 / 学期每日托 / 学期周末托；托管状态：显示 / 隐藏（v1.0.34）
- **员工角色体系（v1.0.62，用户明确要求）**：仅 3 类——楼栋管理员(role_id=1)/保安(2)/保洁(3)，陪诊员/配送员/托管员已废止；只有楼栋管理员绑定楼栋（同一小区一个楼栋仅一名管理员）；staffList.staffEarnings 仅保留 total_income（api.ts 财务概况汇总同源）
- **托管服务计价（v1.0.64，用户明确要求）**：无「半天价格/整天价格」说法，单一 price 字段（NursingItem，取值原整天价）；**陪诊服务仍保留半天/整天价格**（预约口径为仅支持半天/整天预约）；data_service.ts 的 nursingServices 是托管服务页面数据源，data.ts 的 nursingServices 是旧接口数据（getNursingServiceList 无页面引用），两者同名不同文件
- **钱袋子计算口径（v1.0.65/66，用户明确要求）**：物业钱袋子——收入/支出/结余全部手工输入；托管/膳食钱袋子——订单数量/预收金额/成本手工输入，**每单单价自动计算 = 预收金额 ÷ 订单数量**（不允许手工输）
- **员工收益列表口径（v1.0.67，用户明确要求）**：无「单次收益总金额」列，改为「待结算总收益」（订单进行中趟次）+「已结算总收益」（订单已完成趟次），金额 = 趟次 × 收益配置单价（earningBase 按 done/pending 拆分）；财务概况员工收益总额 = 两者合计
- 添加/编辑员工弹窗（v1.0.63）：无「所属小区」字段，负责楼栋为按小区分组级联多选（值路径 [小区名, 楼栋名]），community 由所选楼栋推导
- 订单派单候选（v1.0.62，取代 v1.0.36 角色绑定约定）：托管/膳食/陪诊订单派单弹窗候选为**全部员工**，选项「姓名（角色 · 小区）」，label「指派员工」；仅需接送/需配送的订单才可派单的限制保留
- 订单状态枚举：0待支付 1待派单 2服务中 3已完成 4已取消（v1.0.36）
- 内容管理模块约定(v1.0.37)：帖子/资源状态 0待审核 1已通过 2已驳回；社区活动状态由报名时间范围或「停止报名」推导(报名中/已结束)；v1.0.51 起人力资源只保留用户提交技能认证的审核（通过后进入人才库）
- **社区活动无「报名总人数」概念（v1.0.70，用户明确要求）**：添加/编辑活动表单无 limit 设置项，列表只显示「报名人数」，contentActivityList 无 limit 字段（旧 data.ts activityList 未清理但无页面使用）
- **人才库-认证申请关联（v1.0.71，用户明确要求）**：人才详情抽屉含「认证申请信息」区块，按手机号从 hrCertList 匹配申请记录（可多条），展示申请表单全量内容（标题/类目/状态/时间/驳回备注/描述/凭证图）；hrCertList 与 talentList 同人手机号/头像必须一致（钱志明等 5 人用 1391234300x 号段 + talentImg 头像，非人才的申请者用 138123410xx 号段 + userImg 头像）
- **社区贴吧已整体删除（v1.0.51，文档无此模块）**：article/bar 页面、barList/barComments 数据、getBarList 接口全部移除
- **生活帮手 = 服务管理下的服务项（v1.0.51，文档为准）**：service/helper（封面/标题/多规格价格/销量/状态/排序）+ order/helper（生活帮手订单）；旧的「生活帮手工单」(article/helper、helperList) 已删除；人才库(article/talent)承接技能认证通过后的服务者，可关联生活帮手服务类目并派单
- 托管订单「托管类型」取值为：接 / 送 / 用餐 / 托管（文档口径）；托管服务「托管类型」仍为 日托/学期每日托/学期周末托
- 财务概况所有金额由订单数据实时计算，禁止硬编码统计值（v1.0.38）
- 订单金额口径(v1.0.38)：有效订单=已支付(pay_status=1)且未取消(status≠4)；待结算=有效且未完成；已结算=有效且已完成(status=3)
- **生活帮手单财务口径（v1.0.68，用户明确要求）**：平台不做支付，由用户线下支付——财务概况订单金额/结算金额表含「生活帮手单」行（带橙色「线下支付」标签），该类订单不校验 pay_status（helperOrders 无此字段），有效=未取消；计入顶部汇总（口径文案已注明），不计入员工收益
- 前端导出统一使用 src/utils/export.ts 的 exportCsv（CSV + BOM，兼容 Excel 中文）（v1.0.38）
- 权限配置约定(v1.0.39)：权限目录集中在 src/mock/perms.ts 的 permModules，页面节点=查看权限(perms/lists)，操作权限=perms/<action>；新增功能页面时必须同步在 permModules 中登记其实际操作
- 角色管理入口为 src/views/setting/role/index.vue（菜单 setting/role）；src/views/permission/* 为未接入菜单的旧代码，不可改动依赖
- 列表交互约定(v1.0.41)：显示/隐藏一律用状态列 el-switch 开关切换，操作栏不放文字切换按钮；新增列表页须遵循
- **订单评价显示/隐藏（v1.0.72，用户明确要求）**：orderEvaluations 有 status 字段（1 显示 0 隐藏），评价页状态列 el-switch 切换 + 「显示状态」筛选；默认隐藏差评（两星及以下可设 0）
- 列表样式约定(v1.0.42)：全局 .el-table .cell 强制 nowrap（EP 默认换行）；列宽口径：时间列 160、手机号 120、排序/ID 80、状态 90~100、操作列按按钮文本实算；长文本列须加 show-overflow-tooltip
- 图片上传约定(v1.0.43)：所有图片表单项一律使用 @/components/image-upload（本地 FileReader + base64，不依赖后端接口），禁止 el-input 输入图片链接；必填图片须在提交时校验「请上传XX图」，不得用 picsum 随机图兜底
- **Banner 跳转口径（v1.0.69，用户明确要求）**：article/banner 跳转=类目+具体内容二级选择——托管/陪诊/生活帮手/活动/钱袋子/精彩内容/通知公告 7 类目；钱袋子特殊为固定页 /pages/wallet/index 无二级选择；类目选项与对应管理页数据同源（nursingServices 1001+/escortServices 2001+/helperServices 4001+/contentActivityList 7001+/contentWonderfulList 2001+/contentNoticeList 3001+）；banner 记录存 link+link_type+link_id 三字段，编辑时 parseLink 反向回填；旧「内置页面/自定义链接」跳转类型已删除（类目体系无膳食类目）
