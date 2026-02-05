# ✅ 图表修复验收清单

## 🎯 立即验证（在浏览器中打开 index.html）

### 1️⃣ 标题显示测试
- [ ] 打开页面后，"📊 Weekly Revenue Trend (Mon–Sun)" 标题完整可见
- [ ] 标题没有被任何元素遮挡
- [ ] 标题与上方图例有明显间距

### 2️⃣ Legend 位置测试
- [ ] Revenue/Expenses/Profit 图例显示在图表右上角
- [ ] 图例不与标题重叠
- [ ] 图例使用横线图标（不是方块）
- [ ] 点击图例可以隐藏/显示对应线条

### 3️⃣ 颜色验证
- [ ] **Revenue 线条 = 粉色**（或蓝色，取决于主题）
- [ ] **Expenses 线条 = 紫色**
- [ ] **Profit 线条 = 绿色**
- [ ] 切换主题时，Expenses 和 Profit 颜色保持不变

### 4️⃣ 单值 Tooltip 测试
**操作步骤：**
1. 鼠标悬停在 **Revenue 线的某个点**上
   - [ ] Tooltip 只显示 "Monday" + "Revenue: $1,567.85"
   - [ ] **不显示** Expenses 和 Profit 的值

2. 移动到 **Expenses 线的点**上
   - [ ] Tooltip 只显示 "Expenses: $XXX"
   - [ ] **不显示** Revenue 和 Profit

3. 移动到 **Profit 线的点**上
   - [ ] Tooltip 只显示 "Profit: $XXX"
   - [ ] **不显示** Revenue 和 Expenses

### 5️⃣ Tooltip 定位测试（桌面端）
- [ ] Tooltip 显示在点的**正上方**
- [ ] Tooltip 与点的距离很近（约 10px）
- [ ] Tooltip 不会超出卡片边界
- [ ] 如果上方空间不足，Tooltip 会显示在点下方

### 6️⃣ 横向滚动测试（移动端 ≤768px）

**操作步骤：**
1. 调整浏览器宽度到 700px（或使用开发者工具模拟手机）
2. 图表卡片出现横向滚动条
3. 向右滚动图表
4. 悬停在某个数据点上
   - [ ] Tooltip 依然准确显示在点上方
   - [ ] **Tooltip 没有向左或向右偏移**
   - [ ] 滚动时 Tooltip 会自动隐藏（避免错位）

### 7️⃣ 响应式测试

**桌面端（>1024px）：**
- [ ] 图表占用完整宽度
- [ ] 图表高度自适应（不超出卡片）

**平板端（768px - 1024px）：**
- [ ] 图表正常显示
- [ ] Legend 仍在右上角

**移动端（<768px）：**
- [ ] 图表卡片可以横向滚动
- [ ] 滚动条样式美观（浅灰色）
- [ ] 图表不会被压缩变形

### 8️⃣ Y 轴刻度测试
- [ ] Y 轴刻度显示为 "$1.57k", "$1.69k" 等格式
- [ ] 没有重复的刻度值
- [ ] 刻度间距均匀

### 9️⃣ 交互流畅性测试
- [ ] 鼠标移动时 Tooltip 切换流畅（无闪烁）
- [ ] 点击图例时线条隐藏/显示有动画
- [ ] 窗口 resize 时图表自动调整大小

### 🔟 主题切换测试
1. 点击右上角 Theme 切换到 "Blue"
   - [ ] Revenue 线条变为蓝色
   - [ ] Expenses 保持紫色
   - [ ] Profit 保持绿色
   - [ ] 背景渐变色切换为蓝色系

2. 切换回 "Pink"
   - [ ] Revenue 线条恢复粉色

---

## 🐛 已知问题排查

### 问题 1: Chart.js 未加载
**症状：** 控制台报错 `Chart is not defined`  
**解决：** 检查网络连接，确保 CDN 可访问

### 问题 2: Tooltip 不显示
**症状：** 悬停在点上没有反应  
**排查：**
1. 打开开发者工具，检查是否有 JS 错误
2. 确认 `#chartjs-tooltip` 元素存在
3. 检查 `.is-visible` 类是否被添加

### 问题 3: 横向滚动后 Tooltip 偏移
**症状：** 滚动后 Tooltip 位置错误  
**排查：**
1. 检查 `revenueCard.scrollLeft` 是否正确获取
2. 确认 CSS 中 `.revenue-card` 有 `overflow-x: auto`
3. 查看 `externalTooltipHandler` 中的坐标计算

### 问题 4: 移动端图表不能滚动
**症状：** 移动端图表宽度被压缩  
**解决：** 检查 CSS 媒体查询是否生效

---

## 📊 数据验证

### Revenue 数据（粉色线）
```
Mon: $1,567.85
Tue: $1,623.40
Wed: $1,689.75
Thu: $1,734.60
Fri: $1,789.90
Sat: $1,823.75
Sun: $1,756.40
```

### Expenses 数据（紫色线）
```
Mon: $546.75
Tue: $564.90
Wed: $587.40
Thu: $603.45
Fri: $622.75
Sat: $634.85
Sun: $611.70
```

### Profit 数据（绿色线）
```
Mon: $1,021.10
Tue: $1,058.50
Wed: $1,102.35
Thu: $1,131.15
Fri: $1,167.15
Sat: $1,188.90
Sun: $1,144.70
```

---

## 🎉 全部通过后

恭喜！所有修复已成功实施：

✅ 标题不被遮挡  
✅ Legend 在右上角  
✅ 单值 Tooltip  
✅ Tooltip 紧贴点  
✅ 滚动不偏移  
✅ 颜色正确

**技术文档：** 查看 [CHARTJS_FIX_TECHNICAL_NOTES.md](CHARTJS_FIX_TECHNICAL_NOTES.md) 了解实现细节

---

**验收日期：** 2026-02-05  
**版本：** Chart.js v3.0
