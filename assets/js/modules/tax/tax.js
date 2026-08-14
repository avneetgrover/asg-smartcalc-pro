export function initTaxCalculator() {
    const container = document.getElementById('tax-calculator-container');
    if (!container) return;

    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <!-- Left Inputs -->
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Tax System / Mode</label>
                    <div class="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl">
                        <button type="button" id="tax-mode-gst" onclick="setTaxMode('gst')" class="py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm">GST / VAT</button>
                        <button type="button" id="tax-mode-hst" onclick="setTaxMode('hst')" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">HST (Dual)</button>
                        <button type="button" id="tax-mode-sales" onclick="setTaxMode('sales')" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">Combined Sales</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Amount ($)</label>
                        <input type="number" id="taxAmount" value="1000" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label id="taxRateLabel" class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Tax Rate (%)</label>
                        <input type="number" step="0.1" id="taxRate" value="10" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>

                <div id="tax-secondary-container" class="hidden">
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Secondary / Provincial Tax Rate (%)</label>
                    <input type="number" step="0.1" id="taxRateSecondary" value="5" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <button type="button" onclick="setTaxAction('add')" id="tax-action-add" class="py-2 text-xs font-bold rounded-xl transition-all bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200">Add Tax (Exclusive)</button>
                    <button type="button" onclick="setTaxAction('remove')" id="tax-action-remove" class="py-2 text-xs font-bold rounded-xl transition-all bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400">Extract Tax (Inclusive)</button>
                </div>

                <button type="button" onclick="calculateTax()" class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm">
                    Calculate Tax
                </button>
            </div>

            <!-- Right POS Receipt Column -->
            <div id="print-section-tax" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Tax Breakdown Receipt</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-tax"></p>
                    </div>

                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Parameters & Breakdown</div>

                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between">
                            <span class="text-slate-400">System:</span>
                            <span id="receiptTaxMode" class="font-bold text-slate-700 dark:text-slate-300">GST / VAT</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Action:</span>
                            <span id="receiptTaxAction" class="font-bold text-slate-700 dark:text-slate-300">Exclusive (Add Tax)</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Base Amount:</span>
                            <span id="receiptTaxBase" class="font-bold text-slate-700 dark:text-slate-300">$1,000</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-slate-400">Tax Rates:</span>
                            <span id="receiptTaxRates" class="font-bold text-slate-700 dark:text-slate-300">10%</span>
                        </div>
                    </div>

                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs">
                        <div class="flex justify-between font-bold">
                            <span class="text-slate-400">Net Subtotal</span>
                            <span id="taxNetText" class="text-slate-800 dark:text-white">$1,000</span>
                        </div>
                        <div class="flex justify-between font-bold">
                            <span class="text-slate-400">Total Tax Amount</span>
                            <span id="taxAmountText" class="text-amber-600">$100</span>
                        </div>
                        <div class="flex justify-between font-bold border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs">
                            <span class="text-slate-500">TOTAL GROSS</span>
                            <span id="taxGrossText" class="text-purple-600 dark:text-purple-400 text-sm font-black">$1,100</span>
                        </div>
                    </div>

                    <div class="mt-4 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <p class="text-[9px] text-slate-400 tracking-wider">OFFICIAL TAX CALCULATION</p>
                        <p class="text-[9px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">*** SECURE RECEIPT ***</p>
                    </div>
                </div>

                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center">
                        Print Receipt
                    </button>
                    <button type="button" onclick="shareCalculation('tax')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 font-bold text-xs rounded-xl transition-all flex items-center justify-center">
                        Share Receipt
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('receipt-date-tax').textContent = new Date().toLocaleString();
    setupTaxListeners();
    calculateTax();
}

let taxMode = 'gst';
let taxAction = 'add';

window.setTaxMode = function(mode) {
    taxMode = mode;
    const bGst = document.getElementById('tax-mode-gst');
    const bHst = document.getElementById('tax-mode-hst');
    const bSales = document.getElementById('tax-mode-sales');
    const secContainer = document.getElementById('tax-secondary-container');

    [bGst, bHst, bSales].forEach(b => b.className = "py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400");

    if (mode === 'gst') {
        bGst.className = "py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm";
        secContainer.classList.add('hidden');
    } else if (mode === 'hst') {
        bHst.className = "py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm";
        secContainer.classList.remove('hidden');
    } else {
        bSales.className = "py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm";
        secContainer.classList.remove('hidden');
    }
    calculateTax();
};

window.setTaxAction = function(action) {
    taxAction = action;
    const addBtn = document.getElementById('tax-action-add');
    const remBtn = document.getElementById('tax-action-remove');

    if (action === 'add') {
        addBtn.className = "py-2 text-xs font-bold rounded-xl transition-all bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200";
        remBtn.className = "py-2 text-xs font-bold rounded-xl transition-all bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400";
    } else {
        remBtn.className = "py-2 text-xs font-bold rounded-xl transition-all bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200";
        addBtn.className = "py-2 text-xs font-bold rounded-xl transition-all bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400";
    }
    calculateTax();
};

function setupTaxListeners() {
    ['taxAmount', 'taxRate', 'taxRateSecondary'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateTax);
    });
}

window.calculateTax = function() {
    const amt = parseFloat(document.getElementById('taxAmount').value) || 0;
    const r1 = parseFloat(document.getElementById('taxRate').value) || 0;
    const r2 = parseFloat(document.getElementById('taxRateSecondary').value) || 0;

    let totalRate = r1 + (taxMode !== 'gst' ? r2 : 0);
    let net = 0, taxVal = 0, gross = 0;

    if (taxAction === 'add') {
        net = amt;
        taxVal = net * (totalRate / 100);
        gross = net + taxVal;
    } else {
        gross = amt;
        net = gross / (1 + (totalRate / 100));
        taxVal = gross - net;
    }

    document.getElementById('receiptTaxMode').textContent = taxMode === 'gst' ? 'GST / VAT' : (taxMode === 'hst' ? 'HST (Dual)' : 'Combined Sales');
    document.getElementById('receiptTaxAction').textContent = taxAction === 'add' ? 'Exclusive (Add Tax)' : 'Inclusive (Extract Tax)';
    document.getElementById('receiptTaxBase').textContent = '$' + amt.toLocaleString();
    document.getElementById('receiptTaxRates').textContent = taxMode === 'gst' ? `${r1}%` : `${r1}% + ${r2}%`;

    document.getElementById('taxNetText').textContent = '$' + net.toFixed(2);
    document.getElementById('taxAmountText').textContent = '$' + taxVal.toFixed(2);
    document.getElementById('taxGrossText').textContent = '$' + gross.toFixed(2);
};
