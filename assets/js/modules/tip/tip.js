export function initTipCalculator() {
    const container = document.getElementById('tip-calculator-container');
    if (!container) return;

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Left Inputs -->
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Bill Amount ($)</label>
                    <input type="number" id="tipBill" value="150" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Select Tip Percentage</label>
                    <div class="grid grid-cols-5 gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl text-center">
                        <button type="button" onclick="setTipPct(10)" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800">10%</button>
                        <button type="button" onclick="setTipPct(15)" class="py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm" id="tip-btn-15">15%</button>
                        <button type="button" onclick="setTipPct(18)" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800">18%</button>
                        <button type="button" onclick="setTipPct(20)" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800">20%</button>
                        <button type="button" onclick="setTipPct(25)" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800">25%</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Custom Tip (%)</label>
                        <input type="number" id="tipCustom" value="15" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Number of People</label>
                        <input type="number" id="tipPeople" value="2" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>

                <button type="button" onclick="calculateTip()" class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm">
                    Calculate Split
                </button>
            </div>

            <!-- Right POS Receipt Column -->
            <div id="print-section-tip" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Tip & Split Bill Receipt</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-tip"></p>
                    </div>

                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Parameters & Breakdown</div>

                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between">
                            <span class="text-slate-400">Bill Subtotal:</span>
                            <span id="receiptTipBill" class="font-bold text-slate-700 dark:text-slate-300">$150.00</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Tip Percentage:</span>
                            <span id="receiptTipPct" class="font-bold text-slate-700 dark:text-slate-300">15%</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Split Between:</span>
                            <span id="receiptTipPeople" class="font-bold text-slate-700 dark:text-slate-300">2 Persons</span>
                        </div>
                    </div>

                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs">
                        <div class="flex justify-between font-bold">
                            <span class="text-slate-400">Calculated Tip</span>
                            <span id="tipAmountText" class="text-blue-600">$22.50</span>
                        </div>
                        <div class="flex justify-between font-bold">
                            <span class="text-slate-400">Total Bill Amount</span>
                            <span id="tipTotalText" class="text-slate-800 dark:text-white">$172.50</span>
                        </div>
                        <div class="flex justify-between font-bold border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs">
                            <span class="text-slate-500">PER PERSON SHARE</span>
                            <span id="tipPerPersonText" class="text-purple-600 dark:text-purple-400 text-sm font-black">$86.25</span>
                        </div>
                    </div>

                    <div class="mt-4 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <p class="text-[9px] text-slate-400 tracking-wider">THANK YOU FOR DINING</p>
                        <p class="text-[9px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">*** SECURE RECEIPT ***</p>
                    </div>
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center">
                        Print Receipt
                    </button>
                    <button type="button" onclick="shareCalculation('tip')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 font-bold text-xs rounded-xl transition-all flex items-center justify-center">
                        Share Receipt
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('receipt-date-tip').textContent = new Date().toLocaleString();
    setupTipListeners();
    calculateTip();
}

window.setTipPct = function(pct) {
    document.getElementById('tipCustom').value = pct;
    calculateTip();
};

function setupTipListeners() {
    ['tipBill', 'tipCustom', 'tipPeople'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateTip);
    });
}

window.calculateTip = function() {
    const bill = parseFloat(document.getElementById('tipBill').value) || 0;
    const pct = parseFloat(document.getElementById('tipCustom').value) || 0;
    const people = parseInt(document.getElementById('tipPeople').value) || 1;

    const tipAmt = bill * (pct / 100);
    const total = bill + tipAmt;
    const perPerson = total / (people > 0 ? people : 1);

    document.getElementById('receiptTipBill').textContent = '$' + bill.toFixed(2);
    document.getElementById('receiptTipPct').textContent = pct + '%';
    document.getElementById('receiptTipPeople').textContent = people + ' Persons';

    document.getElementById('tipAmountText').textContent = '$' + tipAmt.toFixed(2);
    document.getElementById('tipTotalText').textContent = '$' + total.toFixed(2);
    document.getElementById('tipPerPersonText').textContent = '$' + perPerson.toFixed(2);
};
