# 顾好家物业管理后台 - 项目记忆

## 项目基本信息
- 项目：1530-01 顾好家-社区服务APP 物业管理后台
- 技术栈：Vue3 + Vite + TypeScript + Element Plus + Pinia + ECharts + wangEditor
- GitHub 仓库：https://github.com/hzhou1734-pixel/153001-wydpc-ue（public，main 分支）
- 远程地址：https://github.com/hzhou1734-pixel/153001-wydpc-ue.git

## Git 提交约定（用户明确要求）
- **每次功能修改后必须自动执行**：git add → commit → 递增版本号 tag → push
- commit 信息格式：`v1.0.X: <描述>`
- 版本号 tag：v1.0.X 递增（当前 v1.0.0）
- 推送方式：token 存于 ~/.ghj_publish_token，使用 `git -c http.extraHeader="Authorization: Basic $(echo -n "x-access-token:$TOKEN" | base64)" push`（避免环境变量被安全过滤）
- git 身份：hzhou1734-pixel / hzhou1734-pixel@users.noreply.github.com（用 -c 参数传入）

## 项目结构要点
- src/views 主要模块：workbench（工作台）、consumer（消费者）、finance（财务：余额明细/充值记录/退款记录）、organization（部门/岗位）、user、article、material、setting、permission 等
- scripts/release.mjs：build 后将 dist 复制到 ../server/public/admin
- .gitignore 已排除 node_modules、dist、.env.* 等

## Mock 数据一致性约定（扩充数据时必须遵守）
- `roomList.certified === 1` ⟺ `certifyList.status === 1`（已通过）；`certified 0` ⟺ `status 0`（待审核）或无记录；`consumerList.certified` 需同步
- 同一业主在 consumerList / roomList / certifyList 三张表中手机号必须完全一致
- 楼栋 id 与单元 id 全局唯一：单元 id = 楼栋 id × 100 + 序号；颐景园 11栋/12栋因绿城已占用 id 11/12，改用 id 13/14
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

## 业务约定
- 系统无「余额」概念：不得出现账户余额、余额支付、余额调整、余额明细等字段与功能（v1.0.33 起）
- 膳食服务计价模式：套餐组合固定价（不同菜品组合对应不同固定价格），非单品累加、非每日统一价（v1.0.35 用户确认）
- 托管类型固定：日托 / 学期每日托 / 学期周末托；托管状态：显示 / 隐藏（v1.0.34）
- 订单派单角色约定：托管订单→托管员(role_id=1，且订单需接送)、膳食订单→配送员(role_id=2，且需配送)、陪诊订单→陪诊员(role_id=3)（v1.0.36）
- 订单状态枚举：0待支付 1待派单 2服务中 3已完成 4已取消（v1.0.36）
- 内容管理模块约定(v1.0.37)：人力资源发布来源 source=1 物业后台(免审核/默认置顶/可编辑)、source=2 用户(需审核/不可编辑)；帖子/资源状态 0待审核 1已通过 2已驳回；社区活动状态由报名时间范围或「停止报名」推导(报名中/已结束)；生活帮手处理人必须是物业后台管理员账号
- 生活帮手类型暂定：家电维修、管道疏通、开锁换锁、保洁清洗、代买代办、居家照护、其他(待用户确认)
- 财务概况所有金额由订单数据实时计算，禁止硬编码统计值（v1.0.38）
- 订单金额口径(v1.0.38)：有效订单=已支付(pay_status=1)且未取消(status≠4)；待结算=有效且未完成；已结算=有效且已完成(status=3)
- 前端导出统一使用 src/utils/export.ts 的 exportCsv（CSV + BOM，兼容 Excel 中文）（v1.0.38）
- 权限配置约定(v1.0.39)：权限目录集中在 src/mock/perms.ts 的 permModules，页面节点=查看权限(perms/lists)，操作权限=perms/<action>；新增功能页面时必须同步在 permModules 中登记其实际操作
- 角色管理入口为 src/views/setting/role/index.vue（菜单 setting/role）；src/views/permission/* 为未接入菜单的旧代码，不可改动依赖
- 列表交互约定(v1.0.41)：显示/隐藏一律用状态列 el-switch 开关切换，操作栏不放文字切换按钮；新增列表页须遵循
- 列表样式约定(v1.0.42)：全局 .el-table .cell 强制 nowrap（EP 默认换行）；列宽口径：时间列 160、手机号 120、排序/ID 80、状态 90~100、操作列按按钮文本实算；长文本列须加 show-overflow-tooltip
