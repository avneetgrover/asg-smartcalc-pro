let currentCategory = 'home';
let currentInterestType = 'fixed';
let currentCurrency = '$';

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

window.setInterestType = function(type) {
    currentInterestType = type;
    ['fixed', 'variable'].forEach(t => {
        const btn = document.getElementById(`int-${t}`);
        if (btn) {
            if (t === type) {
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

window.toggleScheduleModal = function() {
    const modal = document.getElementById('schedule-modal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
};

function calculateEmi() {
    const p = parseFloat(document.getElementById('emiAmount')?.value) || 0;
    const annualRate = parseFloat(document.getElementById('emiRate')?.value) || 0;
    const years = parseFloat(document.getElementById('emiTenure')?.value) || 0;
    const months = years * 12;
    
    let monthlyRate = annualRate / 12 / 100;
    let emi = 0;
    let totalPayable = 0;
    let totalInterest = 0;
    let scheduleHtml = '';
    let balance = p;

    if (currentInterestType === 'fixed') {
        totalInterest = (p * annualRate * years) / 100;
        totalPayable = p + totalInterest;
        emi = months > 0 ? totalPayable / months : 0;
        
        let monthlyPrincipal = months > 0 ? p / months : 0;
        let monthlyInt = months > 0 ? totalInterest / months : 0;

        for (let i = 1; i <= Math.min(months, 120); i++) {
            balance -= monthlyPrincipal;
            scheduleHtml += `
                <tr>
                    <td class="p-2 font-bold">Month ${i}</td>
                    <td class="p-2">${currentCurrency}${monthlyPrincipal.toFixed(2)}</td>
                    <td class="p-2">${currentCurrency}${monthlyInt.toFixed(2)}</td>
                    <td class="p-2">${currentCurrency}${Math.max(0, balance).toFixed(2)}</td>
                </tr>
            `;
        }
    } else {
        if (monthlyRate > 0 && months > 0) {
            emi = (p * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
            totalPayable = emi * months;
            totalInterest = totalPayable - p;
        } else {
            emi = months > 0 ? p / months : 0;
            totalPayable = p;
        }

        for (let i = 1; i <= Math.min(months, 120); i++) {
            let interestComponent = balance * monthlyRate;
            let principalComponent = emi - interestComponent;
            balance -= principalComponent;

            scheduleHtml += `
                <tr>
                    <td class="p-2 font-bold">Month ${i}</td>
                    <td class="p-2">${currentCurrency}${Math.max(0, principalComponent).toFixed(2)}</td>
                    <td class="p-2">${currentCurrency}${Math.max(0, interestComponent).toFixed(2)}</td>
                    <td class="p-2">${currentCurrency}${Math.max(0, balance).toFixed(2)}</td>
                </tr>
            `;
        }
    }

    const emiEl = document.getElementById('emiOutput');
    const princEl = document.getElementById('emiPrincipalText');
    const intEl = document.getElementById('emiInterestText');
    const totEl = document.getElementById('emiTotalText');
    const tbody = document.getElementById('schedule-table-body');

    if (emiEl) emiEl.textContent = `${currentCurrency}${Math.round(emi).toLocaleString()}`;
    if (princEl) princEl.textContent = `${currentCurrency}${Math.round(p).toLocaleString()}`;
    if (intEl) intEl.textContent = `${currentCurrency}${Math.round(totalInterest).toLocaleString()}`;
    if (totEl) totEl.textContent = `${currentCurrency}${Math.round(totalPayable).toLocaleString()}`;
    if (tbody) tbody.innerHTML = scheduleHtml;
}
