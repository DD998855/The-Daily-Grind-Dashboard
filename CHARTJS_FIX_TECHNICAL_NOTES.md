# 📊 Chart.js 图表修复 - 技术说明

## ✅ 修复内容概览

| 问题 | 解决方案 | 状态 |
|------|---------|------|
| 标题被 legend 遮挡 | 使用 Chart.js legend.position: 'top', align: 'end' 将 legend 放在右上角 | ✅ |
| legend 位置不对 | 配置 legend 在右上角，不与标题重叠 | ✅ |
| tooltip 显示多个值 | 使用 interaction.mode: 'point', intersect: true + external tooltip | ✅ |
| tooltip 距离点太远 | 自定义 external tooltip，精确定位在点上方 10px | ✅ |
| 横向滚动时 tooltip 偏移 | 使用 getBoundingClientRect() + scrollLeft 计算偏移量 | ✅ |
| 颜色要求 | Revenue=粉色, Expenses=紫色, Profit=绿色 | ✅ |

---

## 🔧 核心技术改动

### 1. **引入 Chart.js 库**

```html
<!-- index.html -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
```

**为什么：** 从自绘 Canvas 切换到 Chart.js，获得更强大的配置能力和响应式支持。

---

### 2. **Legend 配置：右上角布局**

```javascript
plugins: {
  legend: {
    display: true,
    position: 'top',      // 顶部
    align: 'end',         // 右对齐（右上角）
    labels: {
      usePointStyle: true,
      pointStyle: 'line',
      font: { size: 11, weight: '600' },
      padding: 10,
      boxWidth: 20,
      boxHeight: 3
    }
  }
}
```

**效果：**
- ✅ Legend 在图表顶部右侧
- ✅ 不与标题 "📊 Weekly Revenue Trend (Mon–Sun)" 重叠
- ✅ 小图标样式为横线（line），更美观

**CSS 配合：**
```css
.revenue-card h2 {
    margin-bottom: 12px;  /* 增加间距，确保标题不被遮挡 */
    position: relative;
    z-index: 1;           /* 确保标题在上层 */
}
```

---

### 3. **单值 Tooltip：点哪个显示哪个**

#### 关键配置：

```javascript
interaction: {
  mode: 'point',      // 只响应精确点击点
  intersect: true     // 必须在点上才显示 tooltip
}
```

**Chart.js 默认行为：**
- `mode: 'index'` → 显示同一 X 轴上所有 dataset 的值
- `mode: 'point'` → 只显示鼠标悬停的那个点

**结果：**
- ✅ 点击 Revenue 的点 → 只显示 Revenue: $1,689.75
- ✅ 点击 Expenses 的点 → 只显示 Expenses: $587.40
- ✅ 点击 Profit 的点 → 只显示 Profit: $1,102.35

---

### 4. **External Tooltip：精确定位 + 滚动适配**

#### 为什么需要 External Tooltip？

Chart.js 默认 tooltip 使用 `position: absolute`，在横向滚动容器中会错位。

#### 实现原理：

```javascript
function externalTooltipHandler(context) {
  const { chart, tooltip } = context;
  const revenueCard = chart.canvas.closest('.revenue-card');
  
  // 计算绝对位置（考虑滚动偏移）
  const canvasRect = chart.canvas.getBoundingClientRect();
  const cardRect = revenueCard.getBoundingClientRect();
  const scrollLeft = revenueCard.scrollLeft || 0;
  const scrollTop = revenueCard.scrollTop || 0;

  // 关键：加上滚动偏移量
  const tooltipX = canvasRect.left - cardRect.left + tooltip.caretX + scrollLeft;
  const tooltipY = canvasRect.top - cardRect.top + tooltip.caretY + scrollTop;

  // 定位在点上方 10px
  let top = tooltipY - tooltipHeight - 10;
}
```

**关键点：**
1. **`tooltip.caretX/caretY`** - Chart.js 提供的点坐标
2. **`+ scrollLeft/scrollTop`** - 补偿滚动偏移
3. **`-10px`** - 距离点更近（原来是 -12px）

**边界处理：**
```javascript
// 水平方向不超出卡片
left = Math.max(scrollLeft + 8, Math.min(left, scrollLeft + cardRect.width - tooltipWidth - 8));

// 垂直方向：上方放不下就放下方
if (top < scrollTop + 8) {
  top = tooltipY + 10;
}
```

---

### 5. **颜色配置**

```javascript
const revenueColor = accentColor;                    // 粉色（主题色）
const expensesColor = "rgba(156, 39, 176, 0.9)";    // 紫色
const profitColor = "rgba(76, 175, 80, 0.9)";       // 绿色

datasets: [
  {
    label: 'Revenue',
    borderColor: revenueColor,
    backgroundColor: accentColor.replace('1)', '0.15)'),  // 透明填充
    pointBorderColor: revenueColor,
    // ...
  },
  {
    label: 'Expenses',
    borderColor: expensesColor,
    backgroundColor: 'rgba(156, 39, 176, 0.1)',
    // ...
  },
  {
    label: 'Profit',
    borderColor: profitColor,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    // ...
  }
]
```

**颜色对比：**
- **Revenue:** `rgba(255, 100, 150, 1)` - 粉色（Pink 主题）
- **Expenses:** `rgba(156, 39, 176, 0.9)` - 紫色（Purple）
- **Profit:** `rgba(76, 175, 80, 0.9)` - 绿色（Green）

---

## 📐 布局优化

### 标题与 Legend 不重叠

**问题：** 之前自定义 legend 使用 `position: absolute; top: 14px; left: 50%`，会覆盖标题。

**解决：**
```css
.revenue-card h2 {
    margin-bottom: 12px;    /* 从 4px 增加到 12px */
    position: relative;
    z-index: 1;             /* 标题在上层 */
}

.chart-container {
    overflow: visible;       /* 允许 tooltip 超出 */
}
```

**Chart.js Layout Padding：**
```javascript
layout: {
  padding: {
    top: 10,    // 为 legend 留出空间
    right: 10,
    bottom: 5,
    left: 5
  }
}
```

---

## 🎯 响应式适配

### 桌面端（>768px）

```css
.chart-container {
    width: 100%;
    min-height: clamp(220px, 35vh, 320px);
    max-height: clamp(280px, 45vh, 450px);
}
```

### 移动端（<=768px）

```css
@media (max-width: 768px) {
    .revenue-card {
        overflow-x: auto !important;  /* 允许横向滚动 */
    }
    
    .chart-container {
        width: 100%;
        height: 280px;
    }
}
```

**Chart.js 响应式：**
```javascript
options: {
  responsive: true,
  maintainAspectRatio: false  // 使用固定高度
}
```

---

## 🔍 Tooltip 定位算法详解

### 问题场景：

```
[卡片容器 overflow-x: auto]
  └─ [Canvas 可能超出视口]
       └─ [点击某个数据点]
            └─ [Tooltip 需要显示在点上方]
```

### 坐标转换流程：

```javascript
// 1. 获取 Canvas 相对于视口的位置
const canvasRect = chart.canvas.getBoundingClientRect();
// → { left: 150, top: 300, ... }

// 2. 获取卡片相对于视口的位置
const cardRect = revenueCard.getBoundingClientRect();
// → { left: 100, top: 250, ... }

// 3. 获取当前滚动偏移
const scrollLeft = revenueCard.scrollLeft;  // 例如：120px（向右滚动了 120px）

// 4. 计算 tooltip 相对于卡片的绝对位置
const tooltipX = (canvasRect.left - cardRect.left) + tooltip.caretX + scrollLeft;
//              └────────────┬───────────┘   └──────┬─────┘   └───┬───┘
//                 Canvas 相对卡片偏移       点在 Canvas 内的 X    滚动补偿

// 5. 最终定位
tooltipEl.style.left = (tooltipX - tooltipWidth / 2) + 'px';  // 居中
tooltipEl.style.top = (tooltipY - tooltipHeight - 10) + 'px';  // 上方 10px
```

### 为什么加 `scrollLeft`？

**没有加 `scrollLeft` 时：**
```
用户向右滚动 100px
→ Canvas 向左移动 100px（相对于卡片）
→ Tooltip 位置没有更新
→ Tooltip 向右偏移 100px ❌
```

**加了 `scrollLeft` 后：**
```
用户向右滚动 100px
→ scrollLeft = 100
→ tooltipX 加上 100px
→ Tooltip 正确跟随点 ✅
```

---

## ⚙️ Chart.js 配置完整清单

```javascript
{
  type: 'line',
  data: { ... },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    
    // 布局：为 legend 留空间
    layout: {
      padding: { top: 10, right: 10, bottom: 5, left: 5 }
    },
    
    // 交互：只响应精确点击
    interaction: {
      mode: 'point',
      intersect: true
    },
    
    // 插件配置
    plugins: {
      // Legend：右上角
      legend: {
        position: 'top',
        align: 'end',
        labels: { ... }
      },
      
      // Tooltip：禁用默认，使用自定义
      tooltip: {
        enabled: false,
        external: externalTooltipHandler
      }
    },
    
    // 坐标轴
    scales: {
      x: { ... },
      y: {
        ticks: {
          callback: (value) => '$' + (value / 1000).toFixed(2) + 'k'
        }
      }
    }
  }
}
```

---

## 🎨 CSS 关键样式

### Tooltip 样式

```css
#chartjs-tooltip {
    position: absolute;
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    padding: 8px 12px;
    pointer-events: none;         /* 不阻挡鼠标事件 */
    z-index: 10000;               /* 确保在最上层 */
    opacity: 0;
    transition: opacity 0.2s ease;
}

#chartjs-tooltip.is-visible {
    opacity: 1;
}
```

### 卡片布局

```css
.revenue-card {
    position: relative;           /* tooltip 相对定位基准 */
    overflow: hidden;             /* 桌面端 */
}

@media (max-width: 768px) {
    .revenue-card {
        overflow-x: auto !important;  /* 移动端允许横向滚动 */
    }
}
```

---

## ✨ 最终效果

### ✅ 验收标准

| 验收项 | 结果 |
|--------|------|
| 标题永远完整可见，不被遮挡 | ✅ 通过 |
| Legend 在右上角，不挤标题 | ✅ 通过 |
| 点哪个线就只显示哪个值 | ✅ 通过 |
| Tooltip 紧贴点上方（10px） | ✅ 通过 |
| 横向滚动后 tooltip 不偏移 | ✅ 通过 |
| Revenue=粉色 | ✅ 通过 |
| Expenses=紫色 | ✅ 通过 |
| Profit=绿色 | ✅ 通过 |

### 交互演示

```
用户操作：
1. 鼠标悬停在 Revenue 线的某个点上
   → Tooltip 显示: "Monday / Revenue: $1,567.85"
   
2. 移动到 Expenses 线的点上
   → Tooltip 更新: "Monday / Expenses: $546.75"
   
3. 在移动端向右滚动图表
   → Tooltip 依然准确跟随点
   
4. 切换到蓝色主题
   → Revenue 线自动变为蓝色
   → Expenses 和 Profit 颜色保持不变
```

---

## 🚀 性能优化

### 1. 销毁旧实例

```javascript
let revenueChartInstance = null;

function renderWeeklyRevenue() {
  if (revenueChartInstance) {
    revenueChartInstance.destroy();  // 防止内存泄漏
  }
  revenueChartInstance = new Chart(...);
}
```

### 2. 响应式 Debounce

```javascript
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Chart.js 自动响应，无需手动 re-render
  }, 200);
});
```

---

## 📝 总结

### 技术栈

- **Chart.js 4.4.1** - 专业图表库
- **Custom External Tooltip** - 精确定位
- **CSS Media Queries** - 响应式适配

### 核心改进

1. **标准化：** 从自绘 Canvas 升级到 Chart.js
2. **精确性：** External tooltip + 滚动偏移计算
3. **可用性：** 单值 tooltip（点哪个显示哪个）
4. **美观性：** Legend 右上角 + 新颜色方案

### 代码质量

- ✅ 模块化设计
- ✅ 注释清晰
- ✅ 性能优化（实例销毁）
- ✅ 响应式适配
- ✅ 跨浏览器兼容

---

**修复完成时间：** 2026-02-05  
**工程师：** 资深前端工程师  
**版本：** v3.0 - Chart.js 标准化版本
