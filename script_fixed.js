// ========== DATA ==========

const PERFORMANCE_DATA = [
    { metric: "Revenue", today: 1789.50, yesterday: 1634.25, change_pct: 9.5, target: 1800, status: "On Track", icon: "💰" },
    { metric: "Expenses", today: 622.75, yesterday: 569.25, change_pct: 9.4, target: 650, status: "Good", icon: "💸" },
    { metric: "Net Profit", today: 1166.75, yesterday: 1065.00, change_pct: 9.6, target: 1150, status: "Excellent", icon: "📈" },
    { metric: "Orders", today: 119, yesterday: 109, change_pct: 9.2, target: 120, status: "On Track", icon: "📦" },
    { metric: "Avg Order", today: 15.04, yesterday: 14.99, change_pct: 0.3, target: 15.00, status: "Good", icon: "🎯" }
];

const WEEKLY_DATA = [
    { day: "Monday", revenue: 1567.85, expenses: 546.75, profit: 1021.10 },
    { day: "Tuesday", revenue: 1623.40, expenses: 564.90, profit: 1058.50 },
    { day: "Wednesday", revenue: 1689.75, expenses: 587.40, profit: 1102.35 },
    { day: "Thursday", revenue: 1734.60, expenses: 603.45, profit: 1131.15 },
    { day: "Friday", revenue: 1789.90, expenses: 622.75, profit: 1167.15 },
    { day: "Saturday", revenue: 1823.75, expenses: 634.85, profit: 1188.90 },
    { day: "Sunday", revenue: 1756.40, expenses: 611.70, profit: 1144.70 }
];

const TOP_PRODUCTS = [
    { product: "Latte", units_sold: 52, revenue: 273.00, profit_margin: 76.2 },
    { product: "Espresso", units_sold: 45, revenue: 157.50, profit_margin: 75.7 },
    { product: "Cappuccino", units_sold: 41, revenue: 194.75, profit_margin: 75.8 },
    { product: "Americano", units_sold: 38, revenue: 152.00, profit_margin: 76.3 },
    { product: "Cold Brew", units_sold: 33, revenue: 148.50, profit_margin: 76.7 },
    { product: "Mocha", units_sold: 29, revenue: 166.75, profit_margin: 74.9 },
    { product: "Sandwich", units_sold: 24, revenue: 180.00, profit_margin: 70.0 },
    { product: "Muffin", units_sold: 28, revenue: 105.00, profit_margin: 72.0 }
];

const INVENTORY_ALERTS = [
    { item: "Coffee Beans Arabica", current_stock: 18, reorder_point: 20, days_left: 1.5, status: "Critical", action_needed: "Order Today" },
    { item: "Sugar Brown", current_stock: 12, reorder_point: 15, days_left: 1.5, status: "Critical", action_needed: "Order Today" },
    { item: "Milk Whole", current_stock: 32, reorder_point: 30, days_left: 0.9, status: "Low", action_needed: "Order Tomorrow" },
    { item: "Butter", current_stock: 8, reorder_point: 10, days_left: 1.3, status: "Low", action_needed: "Order Tomorrow" },
    { item: "Paper Cup", current_stock: 485, reorder_point: 500, days_left: 2.7, status: "Watch", action_needed: "Monitor" }
];

let currentView = 'today';

// ========== UTILITY FUNCTIONS ==========

function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(value) {
    return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getChangeClass(change) {
    return change >= 0 ? 'change-positive' : 'change-negative';
}

function getChangeSign(change) {
    if (change >= 0) {
        return '↑ +';
    } else {
        return '↓ ';
    }
}

function calculatePercentChange(todayValue, yesterdayValue, currentView) {
    if (currentView === 'today') {
        // Today vs Yesterday: (today - yesterday) / yesterday
        return ((todayValue - yesterdayValue) / yesterdayValue) * 100;
    } else {
        // Yesterday vs Today: (yesterday - today) / today
        return ((yesterdayValue - todayValue) / todayValue) * 100;
    }
}

// ========== RENDER PERFORMANCE SUMMARY ==========

function renderPerformanceSummary() {
    const netProfitData = PERFORMANCE_DATA.find(d => d.metric === "Net Profit");
    const smallKpiData = PERFORMANCE_DATA.filter(d => d.metric !== "Net Profit");
    
    // Render Big Net Profit Card
    const netProfitCard = document.getElementById('netProfitCard');
    const value = currentView === 'today' ? netProfitData.today : netProfitData.yesterday;
    const progressPercent = Math.min((value / netProfitData.target) * 100, 100);
    const percentChange = calculatePercentChange(netProfitData.today, netProfitData.yesterday, currentView);
    
    netProfitCard.innerHTML = `
        <div class="big-kpi-header">
            <span class="big-kpi-icon">${netProfitData.icon}</span>
            <span class="big-kpi-label">${netProfitData.metric}</span>
        </div>
        <div class="big-kpi-value">${formatCurrency(value)}</div>
        <div class="big-kpi-target">Target: ${formatCurrency(netProfitData.target)}</div>
        <div class="big-kpi-progress">
            <div class="big-kpi-progress-fill" style="width: ${progressPercent}%"></div>
        </div>
        <div class="big-kpi-change ${getChangeClass(percentChange)}">
            ${getChangeSign(percentChange)}${percentChange.toFixed(1)}% vs ${currentView === 'today' ? 'yesterday' : 'today'}
        </div>
    `;
    
    // Render Small KPI Cards
    const smallKpiGrid = document.getElementById('smallKpiGrid');
    smallKpiGrid.innerHTML = smallKpiData.map(kpi => {
        const value = currentView === 'today' ? kpi.today : kpi.yesterday;
        const progressPercent = Math.min((value / kpi.target) * 100, 100);
        const isCurrency = kpi.metric !== "Orders";
        const formattedValue = isCurrency ? formatCurrency(value) : formatNumber(value);
        const percentChange = calculatePercentChange(kpi.today, kpi.yesterday, currentView);
        
        return `
            <div class="small-kpi-card">
                <div class="small-kpi-header">
                    <span class="small-kpi-icon">${kpi.icon}</span>
                    <span class="small-kpi-label">${kpi.metric}</span>
                </div>
                <div class="small-kpi-value">${formattedValue}</div>
                <div class="small-kpi-progress">
                    <div class="small-kpi-progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="small-kpi-change ${getChangeClass(percentChange)}">
                    ${getChangeSign(percentChange)}${percentChange.toFixed(1)}%
                </div>
            </div>
        `;
    }).join('');
}

// ========== RENDER TOP PRODUCTS ==========

function renderTopProducts() {
    const medals = ['🥇', '🥈', '🥉'];
    const rankClasses = ['rank-1', 'rank-2', 'rank-3'];
    
    // Render Products Table with separate rank column
    const tableBody = document.getElementById('productsTableBody');
    tableBody.innerHTML = TOP_PRODUCTS.map((product, index) => {
        const isTop3 = index < 3;
        const rankNumber = index + 1;
        
        // Rank column content
        let rankContent;
        if (isTop3) {
            // Top 3: medal badge
            rankContent = `
                <div class="rank-badge ${rankClasses[index]}">
                    <span class="rank-number">#${rankNumber}</span>
                    <span class="rank-medal">${medals[index]}</span>
                </div>
            `;
        } else {
            // Rank 4+: circular badge
            rankContent = `
                <div class="rank-circle">
                    <span class="rank-number">${rankNumber}</span>
                </div>
            `;
        }
        
        return `
            <tr class="${isTop3 ? 'top-3' : ''}">
                <td class="rank-col">${rankContent}</td>
                <td><strong>${product.product}</strong></td>
                <td>${product.units_sold}</td>
                <td>${formatCurrency(product.revenue)}</td>
                <td>${product.profit_margin}%</td>
            </tr>
        `;
    }).join('');
}

// ========== RENDER INVENTORY ALERTS ==========

function renderInventoryAlerts() {
    const tableBody = document.getElementById('inventoryTableBody');
    
    tableBody.innerHTML = INVENTORY_ALERTS.map(item => {
        const statusClass = item.status.toLowerCase();
        let actionClass = '';
        if (item.action_needed === 'Order Today') actionClass = 'order-today';
        else if (item.action_needed === 'Order Tomorrow') actionClass = 'order-tomorrow';
        else actionClass = 'monitor';
        
        // Calculate progress percentage (cap at 100%)
        const progressPercent = Math.min((item.current_stock / item.reorder_point) * 100, 100);
        
        return `
            <tr>
                <td class="status-col">
                    <div class="status-ring ${statusClass}">
                        <div class="status-dot"></div>
                    </div>
                </td>
                <td><strong>${item.item}</strong></td>
                <td class="stock-col">
                    <div class="stock-progress">
                        <div class="stock-progress-fill ${statusClass}" style="width: ${progressPercent}%"></div>
                        <div class="stock-progress-label">${item.current_stock} / ${item.reorder_point}</div>
                    </div>
                </td>
                <td>${item.days_left} days</td>
                <td><span class="action-pill ${actionClass}">${item.action_needed}</span></td>
            </tr>
        `;
    }).join('');
}

// ========== RENDER WEEKLY REVENUE TREND (LINE CHART) ==========

function renderWeeklyRevenue() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 45, left: 65 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Data
    const days = WEEKLY_DATA.map(d => d.day.substring(0, 3)); // Mon, Tue, etc.
    const revenues = WEEKLY_DATA.map(d => d.revenue);
    const maxRevenue = Math.max(...revenues);
    const minRevenue = Math.min(...revenues);
    const revenueRange = maxRevenue - minRevenue;
    
    // Helper functions
    const getX = (index) => padding.left + (index / (days.length - 1)) * chartWidth;
    const getY = (value) => padding.top + chartHeight - ((value - minRevenue + revenueRange * 0.1) / (revenueRange * 1.2)) * chartHeight;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw gridlines
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartWidth, y);
        ctx.stroke();
    }
    
    // Get theme colors from CSS variables (read fresh each render)
    const styles = getComputedStyle(document.documentElement);
    const accentColor = styles.getPropertyValue('--accent-color').trim();
    const accentFill = styles.getPropertyValue('--accent-fill').trim();
    
    // Draw area fill (theme-aware pastel)
    ctx.fillStyle = accentFill;
    ctx.beginPath();
    ctx.moveTo(getX(0), padding.top + chartHeight);
    revenues.forEach((revenue, i) => {
        ctx.lineTo(getX(i), getY(revenue));
    });
    ctx.lineTo(getX(revenues.length - 1), padding.top + chartHeight);
    ctx.closePath();
    ctx.fill();
    
    // Draw line (theme-aware)
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    revenues.forEach((revenue, i) => {
        if (i === 0) {
            ctx.moveTo(getX(i), getY(revenue));
        } else {
            ctx.lineTo(getX(i), getY(revenue));
        }
    });
    ctx.stroke();
    ctx.globalAlpha = 1.0;
    
    // Draw points
    const pointColor = styles.getPropertyValue('--accent-color').trim();
    
    revenues.forEach((revenue, i) => {
        const x = getX(i);
        const y = getY(revenue);
        
        // Outer circle (white)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Inner circle (theme-aware)
        ctx.fillStyle = pointColor;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw x-axis labels
    ctx.fillStyle = '#666';
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'center';
    days.forEach((day, i) => {
        ctx.fillText(day, getX(i), padding.top + chartHeight + 20);
    });
    
    // Draw y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = minRevenue + (revenueRange / 5) * (5 - i);
        const y = padding.top + (chartHeight / 5) * i;
        ctx.fillText('$' + (value / 1000).toFixed(1) + 'k', padding.left - 10, y + 4);
    }
}

// ========== EVENT LISTENERS ==========

// Theme Selector
const themeSelector = document.getElementById('themeSelector');
themeSelector.addEventListener('change', (e) => {
    if (e.target.value === 'blue') {
        document.documentElement.setAttribute('data-theme', 'blue');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
    // Re-render chart with new theme colors
    renderWeeklyRevenue();
});

// Date Selector
const dateSelector = document.getElementById('dateSelector');
const showingText = document.getElementById('showingText');

dateSelector.addEventListener('change', (e) => {
    currentView = e.target.value;
    showingText.textContent = currentView === 'today' ? 'Today' : 'Yesterday';
    renderPerformanceSummary();
});

// Search Box (basic functionality)
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    // Simple search highlighting could be added here
    console.log('Search query:', query);
});

// Window resize handler for chart
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        renderWeeklyRevenue();
    }, 250);
});

// ========== INITIAL RENDER ==========

function init() {
    renderPerformanceSummary();
    renderTopProducts();
    renderInventoryAlerts();
    renderWeeklyRevenue();
}

// Run on page load
document.addEventListener('DOMContentLoaded', init);
