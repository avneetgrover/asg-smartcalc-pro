export function initInvestmentCalculator() {
    const container = document.getElementById('investment-calculator-container');
    if (!container) return;

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Inputs -->
            <div class="lg:col-span-2 bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
                <h3 class="font-bold text-slate-900 dark:text-white text-lg">Investment & SIP Calculator</h3>
                
                <div class="flex gap-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl">
                    <button id="inv-tab-sip" onclick="switchInvMode('sip')" class="flex-1 py-2.5 rounded-xl font-bold text-xs bg-purple-600 text-white shadow">SIP Calculator</button>
                    <button id="inv-tab-compound" onclick="switchInvMode('compound')" class="flex-1 py-2.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-400">Compound Interest</button>
                </div>

                <!-- SIP Fields -->
                <div id="inv-fields-sip" class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">Monthly Investment ($)</label>
                        <input type="number" id="sip-amount" value="5000" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">Expected Annual Return Rate (%)</label>
                        <input type="number" id="sip-rate" value="12" step="0.1" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">Time Period (Years)</label>
                        <input type="number" id="sip-years" value="10" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                </div>

                <!-- Compound Interest Fields (Hidden by default) -->
                <div id="inv-fields-compound" class="space-y-4 hidden">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">Principal Amount ($)</label>
                        <input type="number" id="ci-principal" value="50000" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">Annual Interest Rate (%)</label>
                        <input type="number" id="ci-rate" value="8" step="0.1" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">Time Period (Years)</label>
                        <input type="number" id="ci-years" value="5" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                </div>

                <button onclick="calculateInvestment()" class="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-600/30 transition-all">Calculate Returns</button>
            </div>

            <!-- Right Receipt/Breakdown Box -->
            <div id="print-section-investment" class="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                    <div class="text-[10px] tracking-wider uppercase font-bold text-purple-600 dark:text-purple-400">ASG SmartCalc Pro</div>
                    <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-4">Investment Summary</h4>
                    
                    <div class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                        <div>
                            <span class="text-xs text-slate-500">Invested Amount</span>
                            <div id="res-invested" class="text-lg font-black text-slate-900 dark:text-white">$0</div>
                        </div>
                        <div>
                            <span class="text-xs text-slate-500">Estimated Returns</span>
                            <div id="res-returns" class="text-lg font-black text-emerald-600 dark:text-emerald-400">$0</div>
                        </div>
                        <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                            <span class="text-xs text-slate-500">Total Value</span>
                            <div id="res-total" class="text-2xl font-black text-purple-600 dark:text-purple-400">$0</div>
                        </div>
                    </div>
                </div>

                <button onclick="shareCalculation('investment')" class="w-full py-3 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs rounded-2xl transition-all">Share Receipt</button>
            </div>
        </div>
    `;

    window.currentInvMode = 'sip';
    window.switchInvMode = function(mode) {
        window.currentInvMode = mode;
        const sipTab = document.getElementById('inv-tab-sip');
        const ciTab = document.getElementById('inv-tab-compound');
        const sipFields = document.getElementById('inv-fields-sip');
        const ciFields = document.getElementById('inv-fields-compound');

        if (mode === 'sip') {
            sipTab.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs bg-purple-600 text-white shadow';
            ciTab.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-400';
            sipFields.classList.remove('hidden');
            ciFields.classList.add('hidden');
        } else {
            ciTab.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs bg-purple-600 text-white shadow';
            sipTab.className = 'flex-1 py-2.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-400';
            ciFields.classList.remove('hidden');
            sipFields.classList.add('hidden');
        }
        calculateInvestment();
    };

    window.calculateInvestment = function() {
        if (window.currentInvMode === 'sip') {
            const P = parseFloat(document.getElementById('sip-amount').value) || 0;
            const annualRate = parseFloat(document.getElementById('sip-rate').value) || 0;
            const years = parseFloat(document.getElementById('sip-years').value) || 0;

            const i = annualRate / 12 / 100;
            const n = years * 12;
            const totalInvested = P * n;
            const maturityValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
            const returns = maturityValue - totalInvested;

            document.getElementById('res-invested').textContent = `$${totalInvested.toFixed(2)}`;
            document.getElementById('res-returns').textContent = `$${returns > 0 ? returns.toFixed(2) : '0.00'}`;
            document.getElementById('res-total').textContent = `$${maturityValue > 0 ? maturityValue.toFixed(2) : '0.00'}`;
        } else {
            const P = parseFloat(document.getElementById('ci-principal').value) || 0;
            const r = parseFloat(document.getElementById('ci-rate').value) || 0;
            const t = parseFloat(document.getElementById('ci-years').value) || 0;

            const maturityValue = P * Math.pow((1 + r / 100), t);
            const returns = maturityValue - P;

            document.getElementById('res-invested').textContent = `$${P.toFixed(2)}`;
            document.getElementById('res-returns').textContent = `$${returns > 0 ? returns.toFixed(2) : '0.00'}`;
            document.getElementById('res-total').textContent = `$${maturityValue > 0 ? maturityValue.toFixed(2) : '0.00'}`;
        }
    };

    calculateInvestment();
}
