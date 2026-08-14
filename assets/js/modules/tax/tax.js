export function initTaxCalculator() {
    const container = document.getElementById('tax-calculator-container');
    if (!container) return;

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
                <h3 class="font-bold text-slate-900 dark:text-white text-lg">Tax Calculator (GST / HST / Combined)</h3>
                
                <div class="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-900/50 rounded-2xl">
                    <button id="tax-tab-gst" onclick="switchTaxMode('gst')" class="py-2.5 rounded-xl font-bold text-xs bg-purple-600 text-white shadow">GST</button>
                    <button id="tax-tab-hst" onclick="switchTaxMode('hst')" class="py-2.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-400">HST</button>
                    <button id="tax-tab-comb" onclick="switchTaxMode('combined')" class="py-2.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-400">Combined</button>
                </div>

                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">Amount ($)</label>
                        <input type="number" id="tax-amount" value="1000" oninput="calculateTax()" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                    <div id="tax-rate-wrapper">
                        <label class="block text-xs font-bold text-slate-500 mb-1">Tax Rate (%)</label>
                        <input type="number" id="tax-rate" value="18" step="0.1" oninput="calculateTax()" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                    <div id="tax-rate2-wrapper" class="hidden">
                        <label class="block text-xs font-bold text-slate-500 mb-1">Secondary Tax Rate (%)</label>
                        <input type="number" id="tax-rate2" value="5" step="0.1" oninput="calculateTax()" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                </div>
            </div>

            <div id="print-section-tax" class="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                    <div class="text-[10px] tracking-wider uppercase font-bold text-purple-600 dark:text-purple-400">ASG SmartCalc Pro</div>
                    <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-4">Tax Breakdown</h4>
                    
                    <div class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                        <div>
                            <span class="text-xs text-slate-500">Net Amount</span>
                            <div id="res-net" class="text-lg font-black text-slate-900 dark:text-white">$0</div>
                        </div>
                        <div>
                            <span class="text-xs text-slate-500">Total Tax Amount</span>
                            <div id="res-taxtotal" class="text-lg font-black text-amber-600 dark:text-amber-400">$0</div>
                        </div>
                        <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                            <span class="text-xs text-slate-500">Gross Total</span>
                            <div id="res-gross" class="text-2xl font-black text-purple-600 dark:text-purple-400">$0</div>
                        </div>
                    </div>
                </div>

                <button onclick="shareCalculation('tax')" class="w-full py-3 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs rounded-2xl transition-all">Share Receipt</button>
            </div>
        </div>
    `;

    window.currentTaxMode = 'gst';
    window.switchTaxMode = function(mode) {
        window.currentTaxMode = mode;
        ['gst', 'hst', 'comb'].forEach(m => {
            const btn = document.getElementById(`tax-tab-${m}`);
            if (m === (mode === 'combined' ? 'comb' : mode)) {
                btn.className = 'py-2.5 rounded-xl font-bold text-xs bg-purple-600 text-white shadow';
            } else {
                btn.className = 'py-2.5 rounded-xl font-bold text-xs text-slate-600 dark:text-slate-400';
            }
        });

        const rate2Wrapper = document.getElementById('tax-rate2-wrapper');
        const rateInput = document.getElementById('tax-rate');
        if (mode === 'hst') {
            rate2Wrapper.classList.add('hidden');
            rateInput.value = '13';
        } else if (mode === 'combined') {
            rate2Wrapper.classList.remove('hidden');
            rateInput.value = '8';
        } else {
            rate2Wrapper.classList.add('hidden');
            rateInput.value = '18';
        }
        calculateTax();
    };

    window.calculateTax = function() {
        const amount = parseFloat(document.getElementById('tax-amount').value) || 0;
        const rate1 = parseFloat(document.getElementById('tax-rate').value) || 0;
        let tax = (amount * rate1) / 100;

        if (window.currentTaxMode === 'combined') {
            const rate2 = parseFloat(document.getElementById('tax-rate2').value) || 0;
            tax += (amount * rate2) / 100;
        }

        const gross = amount + tax;
        document.getElementById('res-net').textContent = `$${amount.toFixed(2)}`;
        document.getElementById('res-taxtotal').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('res-gross').textContent = `$${gross.toFixed(2)}`;
    };

    calculateTax();
}
