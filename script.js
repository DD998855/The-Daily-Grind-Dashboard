// ========== DATA ==========

// Single source of truth for all dashboard data
const DATA = {
    today: {
        revenue: 1789.50,
        expenses: 622.75,
        netProfit: 1166.75,
        orders: 119,
        avgOrder: 15.04
    },
    yesterday: {
        revenue: 1634.25,
        expenses: 569.25,
        netProfit: 1065.00,
        orders: 109,
        avgOrder: 14.99
    },
    targets: {
        revenue: 1800,
        expenses: 650,
        netProfit: 1150,
        orders: 120,
        avgOrder: 15.00
    },
    statuses: {
        revenue: 'On Track',
        expenses: 'Good',
        netProfit: 'Excellent',
        orders: 'On Track',
        avgOrder: 'Good'
    },
    changes: {
        revenue: 9.5,
        expenses: 9.4,
        netProfit: 9.6,
        orders: 9.2,
        avgOrder: 0.3
    },
    weeklyRevenue: [1567.85, 1623.40, 1689.75, 1734.60, 1789.90, 1823.75, 1756.40],
    topProducts: [
        { product: 'Latte', unitsSold: 52, revenue: 273.00, profitMargin: 76.2 },
        { product: 'Espresso', unitsSold: 45, revenue: 157.50, profitMargin: 75.7 },
        { product: 'Cappuccino', unitsSold: 41, revenue: 194.75, profitMargin: 75.8 },
        { product: 'Americano', unitsSold: 38, revenue: 152.00, profitMargin: 76.3 },
        { product: 'Cold Brew', unitsSold: 33, revenue: 148.50, profitMargin: 76.7 },
        { product: 'Mocha', unitsSold: 29, revenue: 166.75, profitMargin: 74.9 },
        { product: 'Sandwich', unitsSold: 24, revenue: 180.00, profitMargin: 70.0 },
        { product: 'Muffin', unitsSold: 28, revenue: 105.00, profitMargin: 72.0 }
    ].sort((a, b) => b.unitsSold - a.unitsSold),
    inventoryAlerts: [
        { item: 'Coffee Beans Arabica', current: 18, reorder: 20, daysLeft: 1.5, status: 'Critical', action: 'Order Today' },
        { item: 'Sugar Brown', current: 12, reorder: 15, daysLeft: 1.5, status: 'Critical', action: 'Order Today' },
        { item: 'Milk Whole', current: 32, reorder: 30, daysLeft: 0.9, status: 'Low', action: 'Order Tomorrow' },
        { item: 'Butter', current: 8, reorder: 10, daysLeft: 1.3, status: 'Low', action: 'Order Tomorrow' },
        { item: 'Paper Cup', current: 485, reorder: 500, daysLeft: 2.7, status: 'Watch', action: 'Monitor' }
    ].sort((a, b) => {
        const priority = { 'Critical': 1, 'Low': 2, 'Watch': 3 };
        return priority[a.status] - priority[b.status];
    }),
    payments: [
        { method: 'Credit Card', amount: 757.60, percentage: 42.3, transactions: 48 },
        { method: 'Cash', amount: 438.55, percentage: 24.5, transactions: 28 },
        { method: 'Debit Card', amount: 334.76, percentage: 18.7, transactions: 21 },
        { method: 'Mobile Pay', amount: 216.59, percentage: 12.1, transactions: 14 },
        { method: 'Gift Card', amount: 42.00, percentage: 2.4, transactions: 3 }
    ]
};

// Current selected day
let currentDay = 'today';

// ========== UTILITY FUNCTIONS ==========

function formatCurrency(value) {
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatNumber(value) {
    return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.toString().replace(regex, '<mark>$1</mark>');
}

// ========== KPI RENDERING ==========

function renderKPIs(day) {
    const metrics = [
        { key: 'revenue', label: 'Revenue', isCurrency: true, index: 0 },
        { key: 'expenses', label: 'Expenses', isCurrency: true, index: 1 },
        { key: 'netProfit', label: 'Net Profit', isCurrency: true, index: 2 },
        { key: 'orders', label: 'Orders', isCurrency: false, index: 3 },
        { key: 'avgOrder', label: 'Avg Order', isCurrency: true, index: 4 }
    ];

    metrics.forEach(metric => {
        const cards = document.querySelectorAll('.kpi-card');
        const card = cards[metric.index];
        if (!card) return;

        const mainValue = DATA[day][metric.key];
        const otherDay = day === 'today' ? 'yesterday' : 'today';
        const otherValue = DATA[otherDay][metric.key];
        const target = DATA.targets[metric.key];
        const status = DATA.statuses[metric.key];

        let changePercent;
        let changeClass = '';
        
        if (day === 'today') {
            changePercent = DATA.changes[metric.key];
            changeClass = 'positive';
        } else {
            // Yesterday vs Today (will be negative)
            changePercent = ((mainValue - otherValue) / otherValue * 100).toFixed(1);
            changeClass = parseFloat(changePercent) >= 0 ? 'positive' : '';
        }

        const mainValueFormatted = metric.isCurrency ? formatCurrency(mainValue) : formatNumber(mainValue);
        const otherValueFormatted = metric.isCurrency ? formatCurrency(otherValue) : formatNumber(otherValue);
        const targetFormatted = metric.isCurrency ? formatCurrency(target) : formatNumber(target);
        
        const comparisonLabel = day === 'today' ? 'Yesterday' : 'Compared to Today';
        const changeSign = parseFloat(changePercent) >= 0 ? '+' : '';

        card.innerHTML = `
            <h3>${metric.label}</h3>
            <div class="kpi-value">${mainValueFormatted}</div>
            <div class="kpi-details">${comparisonLabel}: ${otherValueFormatted}</div>
            <div class="kpi-details">Target: ${targetFormatted}</div>
            <div class="kpi-change ${changeClass}">${changeSign}${changePercent}%</div>
            <div class="kpi-status status-${status.toLowerCase().replace(' ', '-')}">${status}</div>
        `;
    });
}

// ========== RENDER FUNCTIONS ==========

function renderTopProducts(query = '') {
    const tbody = document.getElementById('topProductsBody');
    tbody.innerHTML = '';
    
    let hasMatch = false;
    const searchText = query.toLowerCase();

    DATA.topProducts.forEach(product => {
        const productText = product.product.toLowerCase();
        const unitsText = product.unitsSold.toString();
        const revenueText = product.revenue.toFixed(2);
        const marginText = product.profitMargin.toString();
        
        const isMatch = productText.includes(searchText) || 
                       unitsText.includes(searchText) || 
                       revenueText.includes(searchText) || 
                       marginText.includes(searchText);

        if (isMatch && query) hasMatch = true;

        const row = document.createElement('tr');
        if (isMatch && query) {
            row.classList.add('row-highlight');
        }
        row.innerHTML = `
            <td>${highlightText(product.product, query)}</td>
            <td>${highlightText(product.unitsSold.toString(), query)}</td>
            <td>${highlightText('$' + product.revenue.toFixed(2), query)}</td>
            <td>${highlightText(product.profitMargin + '%', query)}</td>
        `;
        tbody.appendChild(row);
    });

    return hasMatch;
}

function renderInventory(query = '') {
    const tbody = document.getElementById('inventoryBody');
    tbody.innerHTML = '';
    
    let hasMatch = false;
    const searchText = query.toLowerCase();

    DATA.inventoryAlerts.forEach(item => {
        const itemText = item.item.toLowerCase();
        const statusText = item.status.toLowerCase();
        const actionText = item.action.toLowerCase();
        
        const isMatch = itemText.includes(searchText) || 
                       statusText.includes(searchText) || 
                       actionText.includes(searchText) ||
                       item.current.toString().includes(searchText) ||
                       item.reorder.toString().includes(searchText) ||
                       item.daysLeft.toString().includes(searchText);

        if (isMatch && query) hasMatch = true;

        const row = document.createElement('tr');
        if (isMatch && query) {
            row.classList.add('row-highlight');
        }
        const statusClass = `status-${item.status.toLowerCase()}`;
        row.innerHTML = `
            <td><span class="status-dot ${statusClass}"></span>${highlightText(item.item, query)}</td>
            <td>${highlightText(item.current.toString(), query)}</td>
            <td>${highlightText(item.reorder.toString(), query)}</td>
            <td>${highlightText(item.daysLeft.toString(), query)}</td>
            <td>${highlightText(item.action, query)}</td>
        `;
        tbody.appendChild(row);
    });

    return hasMatch;
}

function renderPayments(query = '') {
    const tbody = document.querySelector('.payment-table tbody');
    if (!tbody) return false;

    tbody.innerHTML = '';
    
    let hasMatch = false;
    const searchText = query.toLowerCase();

    DATA.payments.forEach(payment => {
        const methodText = payment.method.toLowerCase();
        
        const isMatch = methodText.includes(searchText) ||
                       payment.amount.toString().includes(searchText) ||
                       payment.percentage.toString().includes(searchText) ||
                       payment.transactions.toString().includes(searchText);

        if (isMatch && query) hasMatch = true;

        const row = document.createElement('tr');
        if (isMatch && query) {
            row.classList.add('row-highlight');
        }
        row.innerHTML = `
            <td>${highlightText(payment.method, query)}</td>
            <td>${highlightText('$' + payment.amount.toFixed(2), query)}</td>
            <td>${highlightText(payment.percentage + '%', query)}</td>
            <td>${highlightText(payment.transactions.toString(), query)}</td>
        `;
        tbody.appendChild(row);
    });

    return hasMatch;
}

// ========== CHART SETUP ==========

// Weekly Revenue Chart
const weeklyRevenueCtx = document.getElementById('weeklyRevenueChart').getContext('2d');
const weeklyRevenueChart = new Chart(weeklyRevenueCtx, {
    type: 'bar',
    data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Revenue',
            data: DATA.weeklyRevenue,
            backgroundColor: 'rgba(255, 155, 186, 0.7)',
            borderColor: 'rgba(255, 155, 186, 1)',
            borderWidth: 2,
            borderRadius: 8
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
            duration: 0 // Disable initial animation for better hover performance
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return '$' + context.parsed.y.toFixed(2);
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '$' + value;
                    }
                }
            }
        },
        onHover: (event, activeElements) => {
            const chart = weeklyRevenueChart;
            const dataset = chart.data.datasets[0];
            
            if (activeElements.length > 0) {
                const hoveredIndex = activeElements[0].index;
                
                // Reset all bars to default
                dataset.backgroundColor = DATA.weeklyRevenue.map((_, i) => 
                    i === hoveredIndex ? 'rgba(255, 155, 186, 0.95)' : 'rgba(255, 155, 186, 0.7)'
                );
                
                // Animate the hovered bar with scale effect
                const meta = chart.getDatasetMeta(0);
                DATA.weeklyRevenue.forEach((value, i) => {
                    const bar = meta.data[i];
                    if (i === hoveredIndex) {
                        // Scale up the hovered bar smoothly
                        const originalHeight = bar.height;
                        bar.height = originalHeight * 1.08;
                    }
                });
                
                chart.update('none'); // Update without animation for smooth effect
            } else {
                // Reset all bars when not hovering
                dataset.backgroundColor = 'rgba(255, 155, 186, 0.7)';
                chart.update('none');
            }
            
            event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
        }
    }
});

// Payment Methods Pie Chart
const paymentCtx = document.getElementById('paymentMethodsChart').getContext('2d');
const paymentChart = new Chart(paymentCtx, {
    type: 'pie',
    data: {
        labels: DATA.payments.map(p => p.method),
        datasets: [{
            data: DATA.payments.map(p => p.percentage),
            backgroundColor: [
                'rgba(255, 155, 186, 0.8)',
                'rgba(179, 157, 219, 0.8)',
                'rgba(159, 207, 255, 0.8)',
                'rgba(255, 214, 165, 0.8)',
                'rgba(255, 183, 197, 0.8)'
            ],
            borderColor: '#fff',
            borderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const index = context.dataIndex;
                        const payment = DATA.payments[index];
                        return [
                            payment.method + ': ' + payment.percentage + '%',
                            'Amount: $' + payment.amount.toFixed(2),
                            'Transactions: ' + payment.transactions
                        ];
                    }
                }
            }
        }
    }
});

// ========== EVENT LISTENERS ==========

// Theme switcher with localStorage
const themeSelector = document.getElementById('themeSelector');
const savedTheme = localStorage.getItem('dashboardTheme') || 'pink';
document.body.setAttribute('data-theme', savedTheme);
themeSelector.value = savedTheme;

themeSelector.addEventListener('change', function(e) {
    const theme = e.target.value;
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('dashboardTheme', theme);
});

// Date selector
document.getElementById('dateSelector').addEventListener('change', function(e) {
    const value = e.target.value;
    currentDay = value.toLowerCase();
    document.getElementById('showingText').textContent = value;
    renderKPIs(currentDay);
});

// Search functionality with highlighting (not filtering)
const searchInput = document.getElementById('searchInput');
const searchClearBtn = document.getElementById('searchClearBtn');
const searchMessage = document.getElementById('searchMessage');

searchInput.addEventListener('input', function(e) {
    const query = e.target.value;
    
    // Show/hide clear button
    if (query) {
        searchClearBtn.classList.add('visible');
    } else {
        searchClearBtn.classList.remove('visible');
        searchMessage.classList.remove('visible');
    }
    
    // Render all tables with highlighting (not filtering)
    const hasProductMatch = renderTopProducts(query);
    const hasInventoryMatch = renderInventory(query);
    const hasPaymentMatch = renderPayments(query);
    
    // Show message only if searching and no matches found
    if (query && !hasProductMatch && !hasInventoryMatch && !hasPaymentMatch) {
        searchMessage.classList.add('visible');
    } else {
        searchMessage.classList.remove('visible');
    }
    
    // Scroll to first highlighted row if found
    if (query && (hasProductMatch || hasInventoryMatch || hasPaymentMatch)) {
        setTimeout(() => {
            const firstHighlight = document.querySelector('.row-highlight');
            if (firstHighlight) {
                firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }
});

// Clear button click
searchClearBtn.addEventListener('click', function() {
    searchInput.value = '';
    searchClearBtn.classList.remove('visible');
    searchMessage.classList.remove('visible');
    renderTopProducts();
    renderInventory();
    renderPayments();
});

// ========== INITIAL RENDER ==========
renderKPIs(currentDay);
renderTopProducts();
renderInventory();
renderPayments();

