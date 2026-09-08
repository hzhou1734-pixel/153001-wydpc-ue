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

## 工作方式
- 用户通过问答方式提出功能修改需求，AI 执行修改后自动提交推送
