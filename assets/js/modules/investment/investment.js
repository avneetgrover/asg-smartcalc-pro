export function initInvestmentCalculator() {
    const container = document.getElementById('investment-calculator-container');
    if (!container) return;

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Left Inputs -->
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Calculation Type</label>
                    <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl">
                        <button type="button" id="inv-mode-sip" onclick="setInvestmentMode('sip')" class="py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm">SIP Calculator</button>
                        <button type="button" id="inv-mode-compound" onclick="setInvestmentMode('compound')" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">Compound Interest</button>
                    </div>
                </div>

                <div id="inv-primary-label" class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Monthly Investment ($)</div>
                <input type="number" id="invAmount" value="5000" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Expected Annual Return Rate (%)</label>
                        <input type="number" step="0.1" id="invRate" value="12" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Time Period (Years)</label>
                        <input type="number" id="invYears" value="10" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>

                <button type="button" onclick="calculateInvestment()" class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm">
                    Calculate Returns
                </button>
            </div>

            <!-- Right POS Receipt Column -->
            <div id="print-section-investment" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Investment Growth Receipt</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-investment"></p>
                    </div>

                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Parameters & Breakdown</div>

                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between">
                            <span class="text-slate-400">Strategy:</span>
                            <span id="receiptInvMode" class="font-bold text-slate-700 dark:text-slate-300">SIP Calculator</span>
                        </div>
                        <div class="flex justify-between">
                            <span id="receiptInvInputTitle" class="text-slate-400">Monthly Contribution:</span>
                            <span id="receiptInvInputVal" class="font-bold text-slate-700 dark:text-slate-300">$5,000</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Return Rate:</span>
                            <span id="receiptInvRate" class="font-bold text-slate-700 dark:text-slate-300">12% p.a.</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Tenure:</span>
                            <span id="receiptInvTenure" class="font-bold text-slate-700 dark:text-slate-300">10 Years</span>
                        </div>
                    </div>

                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs">
                        <div class="flex justify-between font-bold">
                            <span class="text-slate-400">Total Invested</span>
                            <span id="invPrincipalText" class="text-slate-800 dark:text-white">$600,000</span>
                        </div>
                        <div class="flex justify-between font-bold">
                            <span class="text-slate-400">Estimated Returns</span>
                            <span id="invReturnsText" class="text-emerald-600">$561,695</span>
                        </div>
                        <div class="flex justify-between font-bold border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs">
                            <span class="text-slate-500">TOTAL VALUE</span>
                            <span id="invTotalText" class="text-purple-600 dark:text-purple-400 text-sm font-black">$1,161,695</span>
                        </div>
                    </div>

                    <div class="mt-4 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <p class="text-[9px] text-slate-400 tracking-wider">GROW YOUR WEALTH WISELY</p>
                        <p class="text-[9px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">*** SECURE RECEIPT ***</p>
                    </div>
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center">
                        Print Receipt
                    </button>
                    <button type="button" onclick="shareCalculation('investment')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 font-bold text-xs rounded-xl transition-all flex items-center justify-center">
                        Share Receipt
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('receipt-date-investment').textContent = new Date().toLocaleString();
    setupInvestmentListeners();
    calculateInvestment();
}

let invMode = 'sip';

window.setInvestmentMode = function(mode) {
    invMode = mode;
    const btnSip = document.getElementById('inv-mode-sip');
    const btnComp = document.getElementById('inv-mode-compound');
    const label = document.getElementById('inv-primary-label');

    if (mode === 'sip') {
        btnSip.className = "py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm";
        btnComp.className = "py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400";
        label.textContent = "Monthly Investment ($)";
    } else {
        btnComp.className = "py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm";
        btnSip.className = "py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400";
        label.textContent = "Principal Amount ($)";
    }
    calculateInvestment();
};

function setupInvestmentListeners() {
    ['invAmount', 'invRate', 'invYears'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateInvestment);
    });
}

window.calculateInvestment = function() {
    const p = parseFloat(document.getElementById('invAmount').value) || 0;
    const r = parseFloat(document.getElementById('invRate').value) || 0;
    const y = parseFloat(document.getElementById('invYears').value) || 0;

    let invested = 0;
    let totalVal = 0;

    if (invMode === 'sip') {
        const i = r / 12 / 100;
        const n = y * 12;
        invested = p * n;
        if (i > 0) {
            totalVal = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        } else {
            totalVal = invested;
        }
    } else {
        invested = p;
        totalVal = p * Math.pow(1 + (r / 100), y);
    }

    const returns = totalVal - invested;

    document.getElementById('receiptInvMode').textContent = invMode === 'sip' ? 'SIP Calculator' : 'Compound Interest';
    document.getElementById('receiptInvInputTitle').textContent = invMode === 'sip' ? 'Monthly Investment:' : 'Principal Amount:';
    document.getElementById('receiptInvInputVal').textContent = '$' + p.toLocaleString();
    document.getElementById('receiptInvRate').textContent = r + '% p.a.';
    document.getElementById('receiptInvTenure').textContent = y + ' Years';

    document.getElementById('invPrincipalText').textContent = '$' + Math.round(invested).toLocaleString();
    document.getElementById('invReturnsText').textContent = '$' + Math.round(returns > 0 ? returns : 0).toLocaleString();
    document.getElementById('invTotalText').textContent = '$' + Math.round(totalVal).toLocaleString();
};
