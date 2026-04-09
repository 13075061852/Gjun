# 广俊新材料项目 — 长期记忆

## 项目概况
- **类型**: 工程塑料改性制造商企业官网（B2B）
- **设计风格**: 参考 Stripe 精密金融美学，白色画布 + 深海蓝标题 + 工业橙强调色
- **技术栈**: 纯 HTML/CSS/JS，无框架依赖
- **关键特性**: 全屏翻页滚动系统（JS实现 easeInOutCubic 缓动动画）、右侧侧边导航点、移动端自然滚动

## 文件结构
- `index.html` — 主页面
- `assets/css/base.css` — 基础样式/变量/container/section全屏约束
- `assets/css/components.css` — 组件样式(按钮/卡片/表单/badge/side-nav等)
- `assets/css/layout.css` — 导航/Hero/Footer布局
- `assets/css/sections.css` — 各区块内容样式(About/Products/Applications/Cases/Tech/Certifications/News/Contact/CTA)
- `assets/css/responsive.css` — 响应式断点(1024px/768px/480px)
- `assets/js/app.js` — 导航/翻页滚动/动画/表单等全部交互逻辑

## 重要技术决策
1. **全屏翻页**: CSS scroll-snap 被弃用（太生硬），改用 JS `requestAnimationFrame` + easeInOutCubic 900ms 动画
2. **产品中心**: 横向滚动卡片(flex:0 0 300px)替代Grid，解决100vh溢出问题
3. **认证页面**: 左右分栏(cert-layout grid 340px+1fr)，左侧品质承诺视觉区+右侧认证卡片网格
4. **移动端(≤1024px)**: 禁用翻页滚动恢复自然流式

## 注意事项
- 项目曾遭遇 git 合并冲突导致多个文件被污染（app.js, responsive.css, sections.css）
- 响应式文件必须与当前HTML结构匹配，不能混入其他项目的类名
