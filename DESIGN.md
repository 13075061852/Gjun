# Design System: 广俊新材料

## 1. Visual Theme & Atmosphere

广俊新材料官网采用专业、可信的制造业企业形象设计。整体风格参考 Stripe 的精密金融美学 —— 干净、专业、数据驱动。白色画布搭配深海蓝标题和工业橙强调色，传达稳重、可靠、技术领先的 B2B 制造企业形象。

**核心特征：**
- 专业白色背景 (`#ffffff`) 搭配深海蓝标题 (`#0f172a`)
- 工业橙强调色 (`#ea580c`) —— 代表制造业的活力与精准
- 精密阴影系统：多层蓝色调阴影创造层次感
- 保守的圆角 (4px-8px) —— 专业、不轻浮
- 数据驱动的布局 —— 突出产能、认证、技术参数

## 2. Color Palette & Roles

### Primary
- **工业橙** (`#ea580c`): 主品牌色，CTA按钮，链接高亮
- **深海蓝** (`#0f172a`): 主标题色，导航文字
- **纯白** (`#ffffff`): 页面背景，卡片表面

### Brand & Dark
- **品牌深蓝** (`#1e293b`): 深色区块背景，页脚
- **深灰蓝** (`#334155`): 次级深色元素

### Accent Colors
- **亮橙** (`#f97316`): 悬停状态，高亮
- **柔橙** (`#fdba74`): 浅色背景，标签
- **橙透** (`rgba(234,88,12,0.1)`): 淡橙背景

### Neutral Scale
- **标题** (`#0f172a`): 主标题，导航文字
- **标签** (`#334155`): 表单标签，次级标题
- **正文** (`#64748b`): 描述文字，说明
- **弱化** (`#94a3b8`): 辅助信息，时间戳

### Surface & Borders
- **边框默认** (`#e2e8f0`): 标准边框
- **边框强调** (`#ea580c`): 激活状态边框
- **边框柔** (`#f1f5f9`): 淡色边框

### Shadow Colors
- **主阴影** (`rgba(15,23,42,0.08)`): 蓝色调主阴影
- **次阴影** (`rgba(0,0,0,0.04)`): 辅助阴影层
- **环境阴影** (`rgba(15,23,42,0.04)`): 环境光阴影

## 3. Typography Rules

### Font Family
- **Primary**: `Inter`, fallbacks: `system-ui, -apple-system, sans-serif`
- **Monospace**: `JetBrains Mono`, fallbacks: `ui-monospace, monospace`

### Hierarchy

| Role | Size | Weight | Line Height | Letter Spacing |
|------|------|--------|-------------|----------------|
| Display Hero | 56px | 600 | 1.1 | -0.02em |
| Display Large | 48px | 600 | 1.15 | -0.02em |
| Section Heading | 36px | 600 | 1.2 | -0.01em |
| Card Heading | 24px | 600 | 1.3 | -0.01em |
| Sub-heading | 20px | 600 | 1.4 | 0 |
| Body Large | 18px | 400 | 1.6 | 0 |
| Body | 16px | 400 | 1.6 | 0 |
| Caption | 14px | 500 | 1.5 | 0 |
| Small | 12px | 500 | 1.4 | 0.02em |

## 4. Component Stylings

### Buttons

**Primary**
- Background: `#ea580c`
- Text: `#ffffff`
- Padding: 12px 24px
- Radius: 6px
- Font: 16px weight 500
- Hover: `#f97316`

**Secondary / Ghost**
- Background: transparent
- Text: `#ea580c`
- Border: 1px solid `#ea580c`
- Padding: 12px 24px
- Radius: 6px
- Hover: `rgba(234,88,12,0.05)`

**Text Link**
- Background: transparent
- Text: `#ea580c`
- Padding: 0
- Hover: underline

### Cards
- Background: `#ffffff`
- Border: 1px solid `#e2e8f0`
- Radius: 8px
- Shadow: `0 4px 6px -1px rgba(15,23,42,0.05), 0 2px 4px -2px rgba(15,23,42,0.05)`
- Hover: shadow intensifies

### Inputs
- Border: 1px solid `#e2e8f0`
- Radius: 6px
- Padding: 12px 16px
- Focus: border-color `#ea580c`, ring `0 0 0 3px rgba(234,88,12,0.1)`

### Badges
- Background: `rgba(234,88,12,0.1)`
- Text: `#ea580c`
- Radius: 4px
- Padding: 4px 12px
- Font: 12px weight 500

## 5. Layout Principles

### Spacing System
- Base: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Container
- Max width: 1280px
- Padding: 24px (mobile), 48px (desktop)

### Section Spacing
- Between sections: 96px (desktop), 64px (mobile)

## 6. Depth & Elevation

| Level | Shadow |
|-------|--------|
| Flat | none |
| Subtle | `0 1px 2px rgba(15,23,42,0.05)` |
| Card | `0 4px 6px -1px rgba(15,23,42,0.05), 0 2px 4px -2px rgba(15,23,42,0.05)` |
| Elevated | `0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.05)` |
| Floating | `0 20px 25px -5px rgba(15,23,42,0.1), 0 8px 10px -6px rgba(15,23,42,0.05)` |

## 7. Do's and Don'ts

### Do
- 使用白色背景为主，深色区块交替创造节奏
- 使用工业橙 (`#ea580c`) 作为唯一强调色
- 保持 4px-8px 的保守圆角
- 使用多层阴影创造深度
- 数据展示使用等宽字体

### Don't
- 不要使用多种强调色
- 不要使用大圆角或胶囊形状
- 不要使用纯黑色文字，使用深海蓝
- 不要过度装饰，保持专业简洁
