let currentCategory = 'home';
let currentFrequency = 'monthly';
let currentCurrency = '$';
let currentTenureUnit = 'years';

export function initEmiCalculator() {
    const amountInput = document.getElementById('emiAmount');
    const rateInput = document.getElementById('emiRate');
    const tenureInput = document.getElementById('emiTenure');

    if (!amountInput) return;

    [amountInput, rateInput, tenureInput].forEach(input => {
        if (input) {
            input.addEventListener('input', calculateEmi);
        }
    });

    calculateEmi();
}

window.setLoanCategory = function(cat) {
    currentCategory = cat;
    ['home', 'car', 'other'].forEach(c => {
        const btn = document.getElementById(`cat-${c}`);
        if (btn) {
            if (c === cat) {
                btn.className = 'py-2.5 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm';
            } else {
                btn.className = 'py-2.5 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400';
            }
        }
    });

    const rateInput = document.getElementById('emiRate');
    if (rateInput) {
        if (cat === 'home') rateInput.value = 8.5;
        if (cat === 'car') rateInput.value = 9.2;
        if (cat === 'other') rateInput.value = 11.5;
    }
    calculateEmi();
};

window.setPaymentFrequency = function(freq) {
    currentFrequency = freq;
    ['monthly', 'biweekly', 'weekly'].forEach(f => {
        const btn = document.getElementById(`freq-${f}`);
        if (btn) {
            if (f === freq) {
                btn.className = 'py-2.5 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm';
            } else {
                btn.className = 'py-2.5 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400';
            }
        }
    });
    calculateEmi();
};

window.setEmiCurrency = function(symbol) {
    currentCurrency = symbol;
    ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'].forEach(cur => {
        const btn = document.getElementById(`curr-${cur}`);
        if (btn) {
            const symMap = { 'USD': '$', 'EUR': '€', 'GBP': '£', 'INR': '₹', 'CAD': 'C$', 'AUD': 'A$' };
            if (symMap[cur] === symbol) {
                btn.className = 'py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm';
            } else {
                btn.className = 'py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400';
            }
        }
    });
    calculateEmi();
};

window.setTenureUnit = function(unit) {
    currentTenureUnit = unit;
    const btnYears = document.getElementById('tenure-unit-years');
    const btnMonths = document.getElementById('tenure-unit-months');
    const label = document.getElementById('tenure-label-text');
    const tenureInput = document.getElementById('emiTenure');

    if (unit === 'years') {
        if (btnYears) btnYears.className = 'px-3 py-1 text-xs font-bold rounded-lg transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm';
        if (btnMonths) btnMonths.className = 'px-3 py-1 text-xs font-bold rounded-lg transition-all text-slate-500 dark:text-slate-400';
        if (label) label.textContent = 'TENURE (YEARS)';
        if (tenureInput && tenureInput.value > 60) tenureInput.value = Math.round(tenureInput.value / 12);
    } else {
        if (btnMonths) btnMonths.className = 'px-3 py-1 text-xs font-bold rounded-lg transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm';
        if (btnYears) btnYears.className = 'px-3 py-1 text-xs font-bold rounded-lg transition-all text-slate-500 dark:text-slate-400';
        if (label) label.textContent = 'TENURE (MONTHS)';
        if (tenureInput && tenureInput.value <= 40) tenureInput.value = tenureInput.value * 12;
    }
    calculateEmi();
};

window.resetEmiCalculator = function() {
    const amountInput = document.getElementById('emiAmount');
    const rateInput = document.getElementById('emiRate');
    const tenureInput = document.getElementById('emiTenure');

    if (amountInput) amountInput.value = '0';
    if (rateInput) rateInput.value = '0';
    if (tenureInput) tenureInput.value = '0';

    calculateEmi();
};

window.toggleScheduleModal = function() {
    const modal = document.getElementById('schedule-modal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
};

function calculateEmi() {
    const p = parseFloat(document.getElementById('emiAmount')?.value) || 0;
    const annualRate = parseFloat(document.getElementById('emiRate')?.value) || 0;
    const rawTenure = parseFloat(document.getElementById('emiTenure')?.value) || 0;
    
    // Convert tenure to total years based on selected unit
    const totalYears = currentTenureUnit === 'months' ? rawTenure / 12 : rawTenure;

    let periodsPerYear = 12;
    let periodName = 'Month';
    if (currentFrequency === 'biweekly') {
        periodsPerYear = 26;
        periodName = 'Bi-Week';
    } else if (currentFrequency === 'weekly') {
        periodsPerYear = 52;
        periodName = 'Week';
    }

    const totalPeriods = totalYears * periodsPerYear;
    let periodicRate = (annualRate / 100) / periodsPerYear;
    
    let periodicPayment = 0;
    let totalPayable = 0;
    let totalInterest = 0;
    let scheduleHtml = '';
    let balance = p;

    if (periodicRate > 0 && totalPeriods > 0) {
        periodicPayment = (p * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) / (Math.pow(1 + periodicRate, totalPeriods) - 1);
        totalPayable = periodicPayment * totalPeriods;
        totalInterest = totalPayable - p;
    } else {
        periodicPayment = totalPeriods > 0 ? p / totalPeriods : 0;
        totalPayable = p;
    }

    for (let i = 1; i <= Math.min(totalPeriods, 150); i++) {
        let interestComponent = balance * periodicRate;
        let principalComponent = periodicPayment - interestComponent;
        balance -= principalComponent;

        scheduleHtml += `
            <tr>
                <td class="p-2 font-bold">${periodName} ${i}</td>
                <td class="p-2">${currentCurrency}${Math.max(0, principalComponent).toFixed(2)}</td>
                <td class="p-2">${currentCurrency}${Math.max(0, interestComponent).toFixed(2)}</td>
                <td class="p-2">${currentCurrency}${Math.max(0, balance).toFixed(2)}</td>
            </tr>
        `;
    }

    const emiEl = document.getElementById('emiOutput');
    const emiLabel = document.getElementById('emiLabelText');
    const princEl = document.getElementById('emiPrincipalText');
    const intEl = document.getElementById('emiInterestText');
    const totEl = document.getElementById('emiTotalText');
    const tbody = document.getElementById('schedule-table-body');

    if (emiEl) emiEl.textContent = `${currentCurrency}${Math.round(periodicPayment).toLocaleString()}`;
    if (emiLabel) emiLabel.textContent = `${currentFrequency.toUpperCase()} PAYMENT`;
    if (princEl) princEl.textContent = `${currentCurrency}${Math.round(p).toLocaleString()}`;
    if (intEl) intEl.textContent = `${currentCurrency}${Math.round(totalInterest).toLocaleString()}`;
    if (totEl) totEl.textContent = `${currentCurrency}${Math.round(totalPayable).toLocaleString()}`;
    if (tbody) tbody.innerHTML = scheduleHtml;
}
