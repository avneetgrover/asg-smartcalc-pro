export function initTipCalculator() {
    const container = document.getElementById('tip-calculator-container');
    if (!container) return;

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2 bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
                <h3 class="font-bold text-slate-900 dark:text-white text-lg">Tip & Split Bill Calculator</h3>
                
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">Bill Amount ($)</label>
                        <input type="number" id="tip-bill" value="120" oninput="calculateTip()" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">Tip Percentage (%)</label>
                        <div class="grid grid-cols-4 gap-2 mb-2">
                            <button onclick="setTipPct(10)" class="py-2 bg-slate-100 dark:bg-slate-700 rounded-xl font-bold text-xs text-slate-700 dark:text-white">10%</button>
                            <button onclick="setTipPct(15)" class="py-2 bg-purple-600 text-white rounded-xl font-bold text-xs">15%</button>
                            <button onclick="setTipPct(18)" class="py-2 bg-slate-100 dark:bg-slate-700 rounded-xl font-bold text-xs text-slate-700 dark:text-white">18%</button>
                            <button onclick="setTipPct(20)" class="py-2 bg-slate-100 dark:bg-slate-700 rounded-xl font-bold text-xs text-slate-700 dark:text-white">20%</button>
                        </div>
                        <input type="number" id="tip-pct" value="15" oninput="calculateTip()" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 mb-1">Number of People</label>
                        <input type="number" id="tip-split" value="2" min="1" oninput="calculateTip()" class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-900 dark:text-white">
                    </div>
                </div>
            </div>

            <div id="print-section-tip" class="bg-white dark:bg-slate-800/80 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                    <div class="text-[10px] tracking-wider uppercase font-bold text-purple-600 dark:text-purple-400">ASG SmartCalc Pro</div>
                    <h4 class="font-bold text-slate-900 dark:text-white text-sm mb-4">Split Breakdown</h4>
                    
                    <div class="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700/60">
                        <div>
                            <span class="text-xs text-slate-500">Tip Amount</span>
                            <div id="res-tipamount" class="text-lg font-black text-slate-900 dark:text-white">$0</div>
                        </div>
                        <div>
                            <span class="text-xs text-slate-500">Total Bill with Tip</span>
                            <div id="res-tiptotal" class="text-lg font-black text-slate-900 dark:text-white">$0</div>
                        </div>
                        <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                            <span class="text-xs text-slate-500">Per Person Total</span>
                            <div id="res-tipperperson" class="text-2xl font-black text-purple-600 dark:text-purple-400">$0</div>
                        </div>
                    </div>
                </div>

                <button onclick="shareCalculation('tip')" class="w-full py-3 bg-slate-100 dark:bg-slate-700/50 hover:bg-slate-200 text-slate-800 dark:text-white font-bold text-xs rounded-2xl transition-all">Share Receipt</button>
            </div>
        </div>
    `;

    window.setTipPct = function(val) {
        document.getElementById('tip-pct').value = val;
        calculateTip();
    };

    window.calculateTip = function() {
        const bill = parseFloat(document.getElementById('tip-bill').value) || 0;
        const pct = parseFloat(document.getElementById('tip-pct').value) || 0;
        const split = parseInt(document.getElementById('tip-split').value) || 1;

        const tipAmount = (bill * pct) / 100;
        const total = bill + tipAmount;
        const perPerson = total / Math.max(split, 1);

        document.getElementById('res-tipamount').textContent = `$${tipAmount.toFixed(2)}`;
        document.getElementById('res-tiptotal').textContent = `$${total.toFixed(2)}`;
        document.getElementById('res-tipperperson').textContent = `$${perPerson.toFixed(2)}`;
    };

    calculateTip();
}
