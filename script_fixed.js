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

let currentView = "today";

// ========== SCALE (整页等比缩小) ==========
const BASE_WIDTH = 1600;

function applyScale() {
  const stage = document.querySelector(".scale-stage");
  const viewport = document.querySelector(".scale-viewport");
  if (!stage || !viewport) return;

  // 预留 viewport padding（跟 CSS 里 scale-viewport padding 保持一致）
  const padding = 24; // 12px * 2
  const available = Math.max(320, window.innerWidth - padding);
  const scale = Math.min(1, available / BASE_WIDTH);

  // 优先 zoom（会影响布局尺寸，滚动更自然）
  stage.style.zoom = String(scale);

  // 备用：某些环境 zoom 不生效时，用 transform
  stage.style.transform = `scale(${scale})`;

  // 保证基准宽度始终固定
  stage.style.width = `${BASE_WIDTH}px`;
}

// ========== UTILITY FUNCTIONS ==========
function formatCurrency(value) {
  return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatNumber(value) {
  return value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
function getChangeClass(change) {
  return change >= 0 ? "change-positive" : "change-negative";
}
function getChangeSign(change) {
  return change >= 0 ? "↑ +" : "↓ ";
}
function calculatePercentChange(todayValue, yesterdayValue, view) {
  if (view === "today") return ((todayValue - yesterdayValue) / yesterdayValue) * 100;
  return ((yesterdayValue - todayValue) / todayValue) * 100;
}

// ========== RENDER PERFORMANCE SUMMARY ==========
function renderPerformanceSummary() {
  const netProfitData = PERFORMANCE_DATA.find(d => d.metric === "Net Profit");
  const smallKpiData = PERFORMANCE_DATA.filter(d => d.metric !== "Net Profit");

  const netProfitCard = document.getElementById("netProfitCard");
  const value = currentView === "today" ? netProfitData.today : netProfitData.yesterday;
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
      ${getChangeSign(percentChange)}${percentChange.toFixed(1)}% vs ${currentView === "today" ? "yesterday" : "today"}
    </div>
  `;

  const smallKpiGrid = document.getElementById("smallKpiGrid");
  smallKpiGrid.innerHTML = smallKpiData.map(kpi => {
    const v = currentView === "today" ? kpi.today : kpi.yesterday;
    const progress = Math.min((v / kpi.target) * 100, 100);
    const isCurrency = kpi.metric !== "Orders";
    const formattedValue = isCurrency ? formatCurrency(v) : formatNumber(v);
    const pct = calculatePercentChange(kpi.today, kpi.yesterday, currentView);

    return `
      <div class="small-kpi-card">
        <div class="small-kpi-header">
          <span class="small-kpi-icon">${kpi.icon}</span>
          <span class="small-kpi-label">${kpi.metric}</span>
        </div>
        <div class="small-kpi-value">${formattedValue}</div>
        <div class="small-kpi-progress">
          <div class="small-kpi-progress-fill" style="width: ${progress}%"></div>
        </div>
        <div class="small-kpi-change ${getChangeClass(pct)}">
          ${getChangeSign(pct)}${pct.toFixed(1)}%
        </div>
      </div>
    `;
  }).join("");
}

// ========== RENDER TOP PRODUCTS ==========
function renderTopProducts() {
  const medals = ["🥇", "🥈", "🥉"];
  const rankClasses = ["rank-1", "rank-2", "rank-3"];

  const tableBody = document.getElementById("productsTableBody");
  tableBody.innerHTML = TOP_PRODUCTS.map((product, index) => {
    const isTop3 = index < 3;
    const rankNumber = index + 1;

    const rankContent = isTop3
      ? `<div class="rank-badge ${rankClasses[index]}">
          <span class="rank-number">#${rankNumber}</span>
          <span class="rank-medal">${medals[index]}</span>
        </div>`
      : `<div class="rank-circle"><span class="rank-number">${rankNumber}</span></div>`;

    return `
      <tr class="${isTop3 ? "top-3" : ""}">
        <td class="rank-col">${rankContent}</td>
        <td><strong>${product.product}</strong></td>
        <td>${product.units_sold}</td>
        <td>${formatCurrency(product.revenue)}</td>
        <td>${product.profit_margin}%</td>
      </tr>
    `;
  }).join("");
}

// ========== RENDER INVENTORY ALERTS ==========
function renderInventoryAlerts() {
  const tableBody = document.getElementById("inventoryTableBody");

  tableBody.innerHTML = INVENTORY_ALERTS.map(item => {
    const statusClass = item.status.toLowerCase();
    let actionClass = "";
    if (item.action_needed === "Order Today") actionClass = "order-today";
    else if (item.action_needed === "Order Tomorrow") actionClass = "order-tomorrow";
    else actionClass = "monitor";

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
  }).join("");
}

// ========== RENDER WEEKLY REVENUE TREND (Chart.js) ==========
let revenueChartInstance = null;

function renderWeeklyRevenue() {
  const canvas = document.getElementById("revenueChart");
  if (!canvas) return;

  // Destroy previous chart instance
  if (revenueChartInstance) {
    revenueChartInstance.destroy();
    revenueChartInstance = null;
  }

  const ctx = canvas.getContext("2d");
  const days = WEEKLY_DATA.map(d => d.day.substring(0, 3));
  const revenues = WEEKLY_DATA.map(d => d.revenue);
  const expenses = WEEKLY_DATA.map(d => d.expenses);
  const profits = WEEKLY_DATA.map(d => d.profit);

  // Get theme color for Revenue
  const styles = getComputedStyle(document.documentElement);
  const accentColor = styles.getPropertyValue("--accent-color").trim();

  // Color configuration: Revenue=Pink, Expenses=Purple, Profit=Yellow
  const revenueColor = accentColor; // Pink theme color
  const expensesColor = "rgba(156, 39, 176, 0.9)"; // Purple
  const profitColor = "#f6c343"; // Yellow

  revenueChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: days,
      datasets: [
        {
          label: 'Revenue',
          data: revenues,
          borderColor: revenueColor,
          backgroundColor: accentColor.replace('1)', '0.15)'),
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#fff',
          pointBorderColor: revenueColor,
          pointBorderWidth: 2,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Expenses',
          data: expenses,
          borderColor: expensesColor,
          backgroundColor: 'rgba(156, 39, 176, 0.1)',
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#fff',
          pointBorderColor: expensesColor,
          pointBorderWidth: 2,
          fill: true,
          tension: 0.3
        },
        {
          label: 'Profit',
          data: profits,
          borderColor: profitColor,
          backgroundColor: 'rgba(246, 195, 67, 0.1)',
          borderWidth: 2.5,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: '#fff',
          pointBorderColor: profitColor,
          pointBorderWidth: 2,
          fill: true,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: {
          top: 10,
          right: 10,
          bottom: 5,
          left: 5
        }
      },
      interaction: {
        mode: 'point', // Only show tooltip for exact point
        intersect: true // Must be over the point
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end', // Right side
          labels: {
            usePointStyle: true,
            pointStyle: 'circle',
            font: {
              size: 11,
              weight: '600',
              family: 'Inter, sans-serif'
            },
            color: '#333',
            padding: 10,
            boxWidth: 10,
            boxHeight: 10
          }
        },
        tooltip: {
          enabled: false, // Disable default tooltip
          external: externalTooltipHandler // Use custom HTML tooltip
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11,
              family: 'Inter, sans-serif'
            },
            color: '#666'
          }
        },
        y: {
          beginAtZero: false,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            lineWidth: 1
          },
          ticks: {
            font: {
              size: 11,
              family: 'Inter, sans-serif'
            },
            color: '#666',
            callback: function(value) {
              return '$' + (value / 1000).toFixed(2) + 'k';
            }
          }
        }
      }
    }
  });
}

// Custom external tooltip handler for single-value display + accurate positioning
function externalTooltipHandler(context) {
  const { chart, tooltip } = context;
  const revenueCard = chart.canvas.closest('.revenue-card');
  
  // Get or create tooltip element
  let tooltipEl = document.getElementById('chartjs-tooltip');
  if (!tooltipEl) {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'chartjs-tooltip';
    tooltipEl.className = 'chart-tooltip';
    revenueCard.appendChild(tooltipEl);
  }

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.classList.remove('is-visible');
    return;
  }

  // Get the single datapoint (mode: 'point', intersect: true)
  if (tooltip.dataPoints && tooltip.dataPoints.length > 0) {
    const dataPoint = tooltip.dataPoints[0];
    const datasetLabel = dataPoint.dataset.label;
    const value = dataPoint.parsed.y;
    const dayLabel = WEEKLY_DATA[dataPoint.dataIndex].day;

    // Get dataset color
    const datasetColor = dataPoint.dataset.borderColor;

    // Build tooltip HTML - single value only
    tooltipEl.innerHTML = `
      <div class="chart-tooltip-day">${dayLabel}</div>
      <div style="font-size: 12px; font-weight: 700; color: ${datasetColor}; margin-top: 4px;">
        ${datasetLabel}: ${formatCurrency(value)}
      </div>
    `;
  }

  tooltipEl.classList.add('is-visible');

  // Position tooltip - accounting for scroll offset
  const canvasRect = chart.canvas.getBoundingClientRect();
  const cardRect = revenueCard.getBoundingClientRect();
  const scrollLeft = revenueCard.scrollLeft || 0;
  const scrollTop = revenueCard.scrollTop || 0;

  // Calculate absolute position relative to card
  const tooltipX = canvasRect.left - cardRect.left + tooltip.caretX + scrollLeft;
  const tooltipY = canvasRect.top - cardRect.top + tooltip.caretY + scrollTop;

  // Get tooltip dimensions
  const tooltipRect = tooltipEl.getBoundingClientRect();
  const tooltipWidth = tooltipRect.width;
  const tooltipHeight = tooltipRect.height;

  // Position: centered horizontally above the point
  let left = tooltipX - tooltipWidth / 2;
  let top = tooltipY - tooltipHeight - 10; // 10px above point

  // Keep within horizontal bounds
  left = Math.max(scrollLeft + 8, Math.min(left, scrollLeft + cardRect.width - tooltipWidth - 8));

  // If no room above, place below
  if (top < scrollTop + 8) {
    top = tooltipY + 10;
  }

  tooltipEl.style.left = left + 'px';
  tooltipEl.style.top = top + 'px';
  tooltipEl.style.transform = 'none';
}

// ========== SEARCH FUNCTIONALITY ==========
function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
function normalizeText(str) {
  return String(str).toLowerCase().trim();
}
function matchesQuery(text, query) {
  if (!query) return false;
  return normalizeText(text).includes(normalizeText(query));
}
function highlightText(text, query) {
  if (!query || !text) return escapeHTML(text);

  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  const index = normalizedText.indexOf(normalizedQuery);

  if (index === -1) return escapeHTML(text);

  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);

  return `${escapeHTML(before)}<span class="search-hit">${escapeHTML(match)}</span>${escapeHTML(after)}`;
}

function highlightDashboard(query) {
  const normalizedQuery = normalizeText(query);
  highlightInventoryAlerts(normalizedQuery);
  highlightTopProducts(normalizedQuery);
}

function highlightInventoryAlerts(query) {
  const tableBody = document.getElementById("inventoryTableBody");
  if (!tableBody) return;

  const rows = tableBody.querySelectorAll("tr");
  rows.forEach(row => {
    const itemCell = row.querySelector("td:nth-child(2)");
    if (!itemCell) return;

    if (!itemCell.dataset.originalText) itemCell.dataset.originalText = itemCell.textContent.trim();
    const originalText = itemCell.dataset.originalText;

    const daysCell = row.querySelector("td:nth-child(4)");
    const actionCell = row.querySelector("td:nth-child(5)");
    const searchableText = [originalText, daysCell?.textContent || "", actionCell?.textContent || ""].join(" ");

    const isMatch = query ? matchesQuery(searchableText, query) : false;

    if (isMatch) {
      row.classList.add("row-match");
      itemCell.innerHTML = `<strong>${highlightText(originalText, query)}</strong>`;
    } else {
      row.classList.remove("row-match");
      itemCell.innerHTML = `<strong>${escapeHTML(originalText)}</strong>`;
    }
  });
}

function highlightTopProducts(query) {
  const tableBody = document.getElementById("productsTableBody");
  if (!tableBody) return;

  const rows = tableBody.querySelectorAll("tr");
  rows.forEach(row => {
    const productCell = row.querySelector("td:nth-child(2)");
    if (!productCell) return;

    if (!productCell.dataset.originalText) productCell.dataset.originalText = productCell.textContent.trim();
    const originalText = productCell.dataset.originalText;

    const unitsCell = row.querySelector("td:nth-child(3)");
    const revenueCell = row.querySelector("td:nth-child(4)");
    const marginCell = row.querySelector("td:nth-child(5)");
    const searchableText = [originalText, unitsCell?.textContent || "", revenueCell?.textContent || "", marginCell?.textContent || ""].join(" ");

    const isMatch = query ? matchesQuery(searchableText, query) : false;

    if (isMatch) {
      row.classList.add("row-match");
      productCell.innerHTML = highlightText(originalText, query);
    } else {
      row.classList.remove("row-match");
      productCell.innerHTML = escapeHTML(originalText);
    }
  });
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ========== EVENT LISTENERS ==========
function bindUI() {
  const themeSelector = document.getElementById("themeSelector");
  const dateSelector = document.getElementById("dateSelector");
  const showingText = document.getElementById("showingText");
  const searchInput = document.getElementById("searchInput");

  if (themeSelector) {
    themeSelector.addEventListener("change", (e) => {
      if (e.target.value === "blue") document.documentElement.setAttribute("data-theme", "blue");
      else document.documentElement.removeAttribute("data-theme");
      renderWeeklyRevenue();
    });
  }

  if (dateSelector) {
    dateSelector.addEventListener("change", (e) => {
      currentView = e.target.value;
      showingText.textContent = currentView === "today" ? "Today" : "Yesterday";
      renderPerformanceSummary();
    });
  }

  if (searchInput) {
    const debouncedHighlight = debounce(highlightDashboard, 150);
    searchInput.addEventListener("input", (e) => debouncedHighlight(e.target.value));
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        searchInput.value = "";
        highlightDashboard("");
        searchInput.blur();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      const searchInput2 = document.getElementById("searchInput");
      if (!searchInput2) return;
      e.preventDefault();
      searchInput2.focus();
      searchInput2.select();
    }
  });
}

// Resize: scale + chart re-render
let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    applyScale();
    renderWeeklyRevenue();
  }, 200);
});

// ========== INITIAL RENDER ==========
function init() {
  applyScale();
  renderPerformanceSummary();
  renderTopProducts();
  renderInventoryAlerts();
  renderWeeklyRevenue();
  bindUI();
}

document.addEventListener("DOMContentLoaded", init);
