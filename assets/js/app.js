// Inline Sub-module Initializers for Direct File System (file://) Compatibility

// 1. Unit Converter
const UNIT_DATA = {
    length: { m: { name: 'Meter (m)', ratio: 1, label: 'Meters' }, ft: { name: 'Foot (ft)', ratio: 0.3048, label: 'Feet' }, in: { name: 'Inch (in)', ratio: 0.0254, label: 'Inches' }, km: { name: 'Kilometer (km)', ratio: 1000, label: 'Kilometers' }, mi: { name: 'Mile (mi)', ratio: 1609.344, label: 'Miles' }, cm: { name: 'Centimeter (cm)', ratio: 0.01, label: 'Centimeters' }, mm: { name: 'Millimeter (mm)', ratio: 0.001, label: 'Millimeters' }, yd: { name: 'Yard (yd)', ratio: 0.9144, label: 'Yards' } },
    weight: { kg: { name: 'Kilogram (kg)', ratio: 1, label: 'Kilograms' }, lb: { name: 'Pound (lb)', ratio: 0.45359237, label: 'Pounds' }, g: { name: 'Gram (g)', ratio: 0.001, label: 'Grams' }, oz: { name: 'Ounce (oz)', ratio: 0.028349523125, label: 'Ounces' }, mg: { name: 'Milligram (mg)', ratio: 0.000001, label: 'Milligrams' }, t: { name: 'Metric Ton (t)', ratio: 1000, label: 'Metric Tons' } },
    area: { sqm: { name: 'Square Meter (m²)', ratio: 1, label: 'Square Meters' }, sqft: { name: 'Square Foot (ft²)', ratio: 0.092903, label: 'Square Feet' }, acre: { name: 'Acre (ac)', ratio: 4046.86, label: 'Acres' }, ha: { name: 'Hectare (ha)', ratio: 10000, label: 'Hectares' }, sqkm: { name: 'Square Km (km²)', ratio: 1000000, label: 'Square Kilometers' }, sqmi: { name: 'Square Mile (mi²)', ratio: 2589988.11, label: 'Square Miles' } },
    volume: { l: { name: 'Liter (L)', ratio: 1, label: 'Liters' }, ml: { name: 'Milliliter (mL)', ratio: 0.001, label: 'Milliliters' }, gal: { name: 'Gallon (US)', ratio: 3.78541, label: 'Gallons' }, c: { name: 'Cup (US)', ratio: 0.236588, label: 'Cups' }, floz: { name: 'Fluid Ounce (fl oz)', ratio: 0.0295735, label: 'Fluid Ounces' }, m3: { name: 'Cubic Meter (m³)', ratio: 1000, label: 'Cubic Meters' } },
    temperature: { c: { name: 'Celsius (°C)', label: 'Celsius' }, f: { name: 'Fahrenheit (°F)', label: 'Fahrenheit' }, k: { name: 'Kelvin (K)', label: 'Kelvin' } },
    speed: { kmh: { name: 'Km / Hour (km/h)', ratio: 1, label: 'Km/h' }, mph: { name: 'Miles / Hour (mph)', ratio: 1.60934, label: 'mph' }, ms: { name: 'Meter / Sec (m/s)', ratio: 3.6, label: 'm/s' }, knot: { name: 'Knot (kn)', ratio: 1.852, label: 'Knots' } },
    storage: { mb: { name: 'Megabyte (MB)', ratio: 1, label: 'Megabytes' }, kb: { name: 'Kilobyte (KB)', ratio: 0.001, label: 'Kilobytes' }, gb: { name: 'Gigabyte (GB)', ratio: 1000, label: 'Gigabytes' }, tb: { name: 'Terabyte (TB)', ratio: 1000000, label: 'Terabytes' }, b: { name: 'Byte (B)', ratio: 0.000001, label: 'Bytes' } },
    time: { s: { name: 'Second (s)', ratio: 1, label: 'Seconds' }, min: { name: 'Minute (min)', ratio: 60, label: 'Minutes' }, h: { name: 'Hour (h)', ratio: 3600, label: 'Hours' }, d: { name: 'Day (d)', ratio: 86400, label: 'Days' }, wk: { name: 'Week (wk)', ratio: 604800, label: 'Weeks' }, yr: { name: 'Year (yr)', ratio: 31536000, label: 'Years' } },
    pressure: { bar: { name: 'Bar', ratio: 1, label: 'Bars' }, psi: { name: 'PSI (lb/in²)', ratio: 0.0689476, label: 'PSI' }, pa: { name: 'Pascal (Pa)', ratio: 0.00001, label: 'Pascals' }, atm: { name: 'Atmosphere (atm)', ratio: 1.01325, label: 'Atmospheres' } },
    power: { kw: { name: 'Kilowatt (kW)', ratio: 1, label: 'Kilowatts' }, w: { name: 'Watt (W)', ratio: 0.001, label: 'Watts' }, hp: { name: 'Horsepower (hp)', ratio: 0.7457, label: 'Horsepower' } }
};

function convertTemp(val, fromKey, toKey) {
    let baseInC = val;
    if (fromKey === 'f') baseInC = (val - 32) * (5 / 9);
    else if (fromKey === 'k') baseInC = val - 273.15;
    if (toKey === 'c') return baseInC;
    if (toKey === 'f') return (baseInC * 9 / 5) + 32;
    if (toKey === 'k') return baseInC + 273.15;
    return baseInC;
}

function initUnitConverter() {
    const categoryEl = document.getElementById('unitCategory');
    const fromValEl = document.getElementById('unitFromVal');
    const toValEl = document.getElementById('unitToVal');
    const fromSelectEl = document.getElementById('unitFromSelect');
    const toSelectEl = document.getElementById('unitToSelect');
    const swapBtn = document.getElementById('unitSwapBtn');

    if (!categoryEl || !fromValEl) return;

    function populateSelects(category) {
        const units = UNIT_DATA[category] || UNIT_DATA.length;
        const keys = Object.keys(units);
        fromSelectEl.innerHTML = keys.map(k => `<option value="${k}">${units[k].name}</option>`).join('');
        toSelectEl.innerHTML = keys.map(k => `<option value="${k}">${units[k].name}</option>`).join('');
        if (keys.length > 1) toSelectEl.selectedIndex = 1;
    }

    function updateBreakdown(category, currentVal, currentFromKey) {
        const breakdownEl = document.getElementById('unitResults');
        const units = UNIT_DATA[category];
        if (!breakdownEl || !units) return;
        let html = '';
        for (const key in units) {
            const u = units[key];
            let val = category === 'temperature' ? convertTemp(currentVal, currentFromKey, key) : (currentVal * units[currentFromKey].ratio) / u.ratio;
            const formattedVal = Math.abs(val) < 0.01 && val !== 0 ? val.toFixed(6) : val.toFixed(2);
            html += `<div class="flex justify-between items-center border-b border-purple-100/60 dark:border-purple-900/30 pb-1.5 last:border-none">
                <span class="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">${u.label}:</span>
                <span class="font-mono text-slate-900 dark:text-slate-100 font-bold">${formattedVal} ${key}</span>
            </div>`;
        }
        breakdownEl.innerHTML = html;
    }

    function convert(direction = 'from') {
        const category = categoryEl.value;
        const fromKey = fromSelectEl.value;
        const toKey = toSelectEl.value;
        const units = UNIT_DATA[category];
        if (!units || !units[fromKey] || !units[toKey]) return;
        let fromVal = parseFloat(fromValEl.value) || 0;
        let toVal = parseFloat(toValEl.value) || 0;

        if (category === 'temperature') {
            if (direction === 'from') toValEl.value = Number(convertTemp(fromVal, fromKey, toKey).toFixed(2));
            else fromValEl.value = Number(convertTemp(toVal, toKey, fromKey).toFixed(2));
            const formulaEl = document.getElementById('unitFormula');
            if (formulaEl) formulaEl.textContent = `${fromVal} ${units[fromKey].label} = ${toValEl.value} ${units[toKey].label}`;
            updateBreakdown(category, parseFloat(fromValEl.value) || 0, fromKey);
            return;
        }

        if (direction === 'from') toValEl.value = Number(((fromVal * units[fromKey].ratio) / units[toKey].ratio).toFixed(6));
        else fromValEl.value = Number(((toVal * units[toKey].ratio) / units[fromKey].ratio).toFixed(6));

        const formulaEl = document.getElementById('unitFormula');
        if (formulaEl) formulaEl.textContent = `1 ${units[fromKey].label.slice(0, -1)} = ${(units[fromKey].ratio / units[toKey].ratio).toFixed(6)} ${units[toKey].label}`;
        updateBreakdown(category, parseFloat(fromValEl.value) || 0, fromKey);
    }

    categoryEl.addEventListener('change', (e) => { populateSelects(e.target.value); convert('from'); });
    fromValEl.addEventListener('input', () => convert('from'));
    toValEl.addEventListener('input', () => convert('to'));
    fromSelectEl.addEventListener('change', () => convert('from'));
    toSelectEl.addEventListener('change', () => convert('from'));
    swapBtn?.addEventListener('click', () => {
        const temp = fromSelectEl.value;
        fromSelectEl.value = toSelectEl.value;
        toSelectEl.value = temp;
        convert('from');
    });

    populateSelects(categoryEl.value);
    convert('from');
}

// 2. Currency Converter
const currencies = [
    { code: 'USD', country: 'us', name: 'USD - US Dollar' },
    { code: 'INR', country: 'in', name: 'INR - Indian Rupee' },
    { code: 'EUR', country: 'eu', name: 'EUR - Euro' },
    { code: 'GBP', country: 'gb', name: 'GBP - British Pound' },
    { code: 'CAD', country: 'ca', name: 'CAD - Canadian Dollar' },
    { code: 'AUD', country: 'au', name: 'AUD - Australian Dollar' },
    { code: 'AED', country: 'ae', name: 'AED - UAE Dirham' },
    { code: 'SGD', country: 'sg', name: 'SGD - Singapore Dollar' }
];

function initCurrencyConverter() {
    const fromSelect = document.getElementById('currFrom');
    const toSelect = document.getElementById('currTo');
    const amtInput = document.getElementById('currAmt');
    const swapBtn = document.getElementById('currSwapBtn');

    if (!fromSelect || !toSelect) return;

    currencies.forEach(c => {
        fromSelect.appendChild(new Option(c.name, c.code));
        toSelect.appendChild(new Option(c.name, c.code));
    });

    fromSelect.value = 'USD';
    toSelect.value = 'INR';

    amtInput?.addEventListener('input', calculate);
    fromSelect?.addEventListener('change', () => { updateFlags(); calculate(); });
    toSelect?.addEventListener('change', () => { updateFlags(); calculate(); });
    swapBtn?.addEventListener('click', () => {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        updateFlags();
        calculate();
    });

    updateFlags();
    calculate();

    function updateFlags() {
        const fromCurr = currencies.find(c => c.code === fromSelect.value);
        const toCurr = currencies.find(c => c.code === toSelect.value);
        if (fromCurr) document.getElementById('currFromFlag').src = `https://flagcdn.com/w40/${fromCurr.country}.png`;
        if (toCurr) document.getElementById('currToFlag').src = `https://flagcdn.com/w40/${toCurr.country}.png`;
    }

    async function calculate() {
        const amt = parseFloat(amtInput.value) || 0;
        const from = fromSelect.value;
        const to = toSelect.value;
        const output = document.getElementById('currOutput');
        const status = document.getElementById('currStatus');

        try {
            if (status) status.textContent = 'Updating exchange rates...';
            const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
            const data = await res.json();
            if (data && data.rates && data.rates[to]) {
                const rate = data.rates[to];
                if (output) output.textContent = `${to} ${(amt * rate).toFixed(2)}`;
                if (status) status.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
                if (document.getElementById('receiptCurrInput')) document.getElementById('receiptCurrInput').textContent = `${amt} ${from}`;
                if (document.getElementById('receiptCurrTarget')) document.getElementById('receiptCurrTarget').textContent = `${to}`;
                if (document.getElementById('receiptCurrRate')) document.getElementById('receiptCurrRate').textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
            }
        } catch (err) {
            if (output) output.textContent = 'Error';
            if (status) status.textContent = 'Connection failed';
        }
    }
}

// 3. EMI Calculator
let currentCategory = 'home';
let currentFrequency = 'monthly';
let currentCurrency = '$';
let currentTenureUnit = 'years';

function initEmiCalculator() {
    const amountInput = document.getElementById('emiAmount');
    const rateInput = document.getElementById('emiRate');
    const tenureInput = document.getElementById('emiTenure');
    if (!amountInput) return;

    [amountInput, rateInput, tenureInput].forEach(input => {
        if (input) input.addEventListener('input', calculateEmi);
    });

    const dateEl = document.getElementById('receipt-date-emi');
    if (dateEl) dateEl.textContent = new Date().toLocaleString();
    calculateEmi();
}

window.setLoanCategory = function(cat) {
    currentCategory = cat;
    ['home', 'car', 'other'].forEach(c => {
        const btn = document.getElementById(`cat-${c}`);
        if (btn) btn.className = c === cat ? 'py-2.5 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm' : 'py-2.5 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400';
    });
    const rateInput = document.getElementById('emiRate');
    if (rateInput) {
        if (cat === 'home') rateInput.value = 8.5;
        if (cat === 'car') rateInput.value = 9.2;
        if (cat === 'other') rateInput.value = 11.5;
    }
    calculateEmi();
};

function calculateEmi() {
    const p = parseFloat(document.getElementById('emiAmount')?.value) || 0;
    const annualRate = parseFloat(document.getElementById('emiRate')?.value) || 0;
    const rawTenure = parseFloat(document.getElementById('emiTenure')?.value) || 0;
    const totalYears = currentTenureUnit === 'months' ? rawTenure / 12 : rawTenure;
    let periodsPerYear = 12;

    if (currentFrequency === 'biweekly') periodsPerYear = 26;
    else if (currentFrequency === 'weekly') periodsPerYear = 52;

    const totalPeriods = totalYears * periodsPerYear;
    let periodicRate = (annualRate / 100) / periodsPerYear;
    let periodicPayment = 0;
    let totalPayable = 0;
    let totalInterest = 0;

    if (periodicRate > 0 && totalPeriods > 0) {
        periodicPayment = (p * periodicRate * Math.pow(1 + periodicRate, totalPeriods)) / (Math.pow(1 + periodicRate, totalPeriods) - 1);
        totalPayable = periodicPayment * totalPeriods;
        totalInterest = totalPayable - p;
    } else {
        periodicPayment = totalPeriods > 0 ? p / totalPeriods : 0;
        totalPayable = p;
    }

    const emiEl = document.getElementById('emiOutput');
    const princEl = document.getElementById('emiPrincipalText');
    const intEl = document.getElementById('emiInterestText');
    const totEl = document.getElementById('emiTotalText');

    if (emiEl) emiEl.textContent = `${currentCurrency}${Math.round(periodicPayment).toLocaleString()}`;
    if (princEl) princEl.textContent = `${currentCurrency}${Math.round(p).toLocaleString()}`;
    if (intEl) intEl.textContent = `${currentCurrency}${Math.round(totalInterest).toLocaleString()}`;
    if (totEl) totEl.textContent = `${currentCurrency}${Math.round(totalPayable).toLocaleString()}`;

    if (document.getElementById('receiptEmiCat')) document.getElementById('receiptEmiCat').textContent = currentCategory.toUpperCase() + ' LOAN';
    if (document.getElementById('receiptEmiRate')) document.getElementById('receiptEmiRate').textContent = annualRate + '% p.a.';
    if (document.getElementById('receiptEmiTenure')) document.getElementById('receiptEmiTenure').textContent = rawTenure + ' ' + currentTenureUnit;
}

// 4. Investment Calculator
function initInvestmentCalculator() {
    const container = document.getElementById('investment-calculator-container');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Calculation Type</label>
                    <div class="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl">
                        <button type="button" id="inv-mode-sip" onclick="setInvestmentMode('sip')" class="py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm">SIP Calculator</button>
                        <button type="button" id="inv-mode-compound" onclick="setInvestmentMode('compound')" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">Compound Interest</button>
                    </div>
                </div>
                <div id="inv-primary-label" class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Monthly Investment ($)</div>
                <input type="number" id="invAmount" value="5000" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:white outline-none focus:ring-2 focus:ring-purple-500">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Expected Return (%)</label>
                        <input type="number" step="0.1" id="invRate" value="12" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Tenure (Years)</label>
                        <input type="number" id="invYears" value="10" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
                <button type="button" onclick="calculateInvestment()" class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm">Calculate Returns</button>
            </div>
            <div id="print-section-investment" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Investment Growth Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-investment"></p>
                    </div>
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Parameters & Breakdown</div>
                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between"><span class="text-slate-400">Strategy:</span><span id="receiptInvMode" class="font-bold text-slate-700 dark:text-slate-300">SIP Calculator</span></div>
                        <div class="flex justify-between"><span id="receiptInvInputTitle" class="text-slate-400">Monthly Contribution:</span><span id="receiptInvInputVal" class="font-bold text-slate-700 dark:text-slate-300">$5,000</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Return Rate:</span><span id="receiptInvRate" class="font-bold text-slate-700 dark:text-slate-300">12% p.a.</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Tenure:</span><span id="receiptInvTenure" class="font-bold text-slate-700 dark:text-slate-300">10 Years</span></div>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs">
                        <div class="flex justify-between font-bold"><span class="text-slate-400">Total Invested</span><span id="invPrincipalText" class="text-slate-800 dark:text-white">$600,000</span></div>
                        <div class="flex justify-between font-bold"><span class="text-slate-400">Estimated Returns</span><span id="invReturnsText" class="text-emerald-600">$561,695</span></div>
                        <div class="flex justify-between font-bold border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">TOTAL VALUE</span><span id="invTotalText" class="text-purple-600 dark:text-purple-400 text-sm font-black">$1,161,695</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('investment')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-investment')) document.getElementById('receipt-date-investment').textContent = new Date().toLocaleString();
    ['invAmount', 'invRate', 'invYears'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateInvestment);
    });
    calculateInvestment();
}

let invMode = 'sip';
window.setInvestmentMode = function(mode) {
    invMode = mode;
    const btnSip = document.getElementById('inv-mode-sip');
    const btnComp = document.getElementById('inv-mode-compound');
    const label = document.getElementById('inv-primary-label');
    if (mode === 'sip') {
        if (btnSip) btnSip.className = "py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm";
        if (btnComp) btnComp.className = "py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400";
        if (label) label.textContent = "Monthly Investment ($)";
    } else {
        if (btnComp) btnComp.className = "py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm";
        if (btnSip) btnSip.className = "py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400";
        if (label) label.textContent = "Principal Amount ($)";
    }
    calculateInvestment();
};

window.calculateInvestment = function() {
    const p = parseFloat(document.getElementById('invAmount')?.value) || 0;
    const r = parseFloat(document.getElementById('invRate')?.value) || 0;
    const y = parseFloat(document.getElementById('invYears')?.value) || 0;
    let invested = 0, totalVal = 0;
    if (invMode === 'sip') {
        const i = r / 12 / 100, n = y * 12;
        invested = p * n;
        totalVal = i > 0 ? p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) : invested;
    } else {
        invested = p;
        totalVal = p * Math.pow(1 + (r / 100), y);
    }
    const returns = totalVal - invested;

    if (document.getElementById('receiptInvMode')) document.getElementById('receiptInvMode').textContent = invMode === 'sip' ? 'SIP Calculator' : 'Compound Interest';
    if (document.getElementById('receiptInvInputTitle')) document.getElementById('receiptInvInputTitle').textContent = invMode === 'sip' ? 'Monthly Contribution:' : 'Principal Amount:';
    if (document.getElementById('receiptInvInputVal')) document.getElementById('receiptInvInputVal').textContent = '$' + p.toLocaleString();
    if (document.getElementById('receiptInvRate')) document.getElementById('receiptInvRate').textContent = r + '% p.a.';
    if (document.getElementById('receiptInvTenure')) document.getElementById('receiptInvTenure').textContent = y + ' Years';

    if (document.getElementById('invPrincipalText')) document.getElementById('invPrincipalText').textContent = '$' + Math.round(invested).toLocaleString();
    if (document.getElementById('invReturnsText')) document.getElementById('invReturnsText').textContent = '$' + Math.round(returns > 0 ? returns : 0).toLocaleString();
    if (document.getElementById('invTotalText')) document.getElementById('invTotalText').textContent = '$' + Math.round(totalVal).toLocaleString();
};

// 5. Tax Calculator
function initTaxCalculator() {
    const container = document.getElementById('tax-calculator-container');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Base Amount ($)</label>
                        <input type="number" id="taxAmount" value="1000" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Tax Rate (%)</label>
                        <input type="number" step="0.1" id="taxRate" value="10" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            <div id="print-section-tax" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Tax Breakdown Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-tax"></p>
                    </div>
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Parameters & Breakdown</div>
                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between"><span class="text-slate-400">Base Input Amount:</span><span id="receiptTaxBase" class="font-bold text-slate-700 dark:text-slate-300">$1,000</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Applied Tax Rate:</span><span id="receiptTaxRate" class="font-bold text-slate-700 dark:text-slate-300">10%</span></div>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs font-bold">
                        <div class="flex justify-between"><span class="text-slate-400">Net Subtotal</span><span id="taxNetText" class="text-slate-800 dark:text-white">$1,000.00</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Tax Amount</span><span id="taxAmountText" class="text-amber-600">$100.00</span></div>
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">TOTAL GROSS</span><span id="taxGrossText" class="text-purple-600 dark:text-purple-400 text-sm font-black">$1,100.00</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('tax')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-tax')) document.getElementById('receipt-date-tax').textContent = new Date().toLocaleString();
    ['taxAmount', 'taxRate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateTax);
    });
    calculateTax();
}

window.calculateTax = function() {
    const amt = parseFloat(document.getElementById('taxAmount')?.value) || 0;
    const r = parseFloat(document.getElementById('taxRate')?.value) || 0;
    const taxVal = amt * (r / 100);
    const gross = amt + taxVal;
    if (document.getElementById('receiptTaxBase')) document.getElementById('receiptTaxBase').textContent = '$' + amt.toLocaleString();
    if (document.getElementById('receiptTaxRate')) document.getElementById('receiptTaxRate').textContent = r + '%';
    if (document.getElementById('taxNetText')) document.getElementById('taxNetText').textContent = '$' + amt.toFixed(2);
    if (document.getElementById('taxAmountText')) document.getElementById('taxAmountText').textContent = '$' + taxVal.toFixed(2);
    if (document.getElementById('taxGrossText')) document.getElementById('taxGrossText').textContent = '$' + gross.toFixed(2);
};

// 6. Tip Calculator
function initTipCalculator() {
    const container = document.getElementById('tip-calculator-container');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Bill Amount ($)</label>
                    <input type="number" id="tipBill" value="150" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Tip Percentage (%)</label>
                        <input type="number" id="tipCustom" value="15" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Number of People</label>
                        <input type="number" id="tipPeople" value="2" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            <div id="print-section-tip" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Tip & Split Bill Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-tip"></p>
                    </div>
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Parameters & Breakdown</div>
                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between"><span class="text-slate-400">Bill Subtotal:</span><span id="receiptTipBill" class="font-bold text-slate-700 dark:text-slate-300">$150.00</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Tip Percentage:</span><span id="receiptTipPct" class="font-bold text-slate-700 dark:text-slate-300">15%</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Split Between:</span><span id="receiptTipPeople" class="font-bold text-slate-700 dark:text-slate-300">2 Persons</span></div>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs font-bold">
                        <div class="flex justify-between"><span class="text-slate-400">Calculated Tip</span><span id="tipAmountText" class="text-blue-600">$22.50</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Total Bill</span><span id="tipTotalText" class="text-slate-800 dark:text-white">$172.50</span></div>
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">PER PERSON SHARE</span><span id="tipPerPersonText" class="text-purple-600 dark:text-purple-400 text-sm font-black">$86.25</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('tip')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-tip')) document.getElementById('receipt-date-tip').textContent = new Date().toLocaleString();
    ['tipBill', 'tipCustom', 'tipPeople'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateTip);
    });
    calculateTip();
}

window.calculateTip = function() {
    const bill = parseFloat(document.getElementById('tipBill')?.value) || 0;
    const pct = parseFloat(document.getElementById('tipCustom')?.value) || 0;
    const people = parseInt(document.getElementById('tipPeople')?.value) || 1;
    const tipAmt = bill * (pct / 100);
    const total = bill + tipAmt;
    const perPerson = total / (people > 0 ? people : 1);
    if (document.getElementById('receiptTipBill')) document.getElementById('receiptTipBill').textContent = '$' + bill.toFixed(2);
    if (document.getElementById('receiptTipPct')) document.getElementById('receiptTipPct').textContent = pct + '%';
    if (document.getElementById('receiptTipPeople')) document.getElementById('receiptTipPeople').textContent = people + ' Persons';
    if (document.getElementById('tipAmountText')) document.getElementById('tipAmountText').textContent = '$' + tipAmt.toFixed(2);
    if (document.getElementById('tipTotalText')) document.getElementById('tipTotalText').textContent = '$' + total.toFixed(2);
    if (document.getElementById('tipPerPersonText')) document.getElementById('tipPerPersonText').textContent = '$' + perPerson.toFixed(2);
};

// 7. Health Calculator
function initHealthCalculator() {
    const container = document.getElementById('panel-health');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Body Metrics Input</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Weight (kg)</label>
                        <input type="number" id="health-weight" value="70" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Height (cm)</label>
                        <input type="number" id="health-height" value="175" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Age (Years)</label>
                        <input type="number" id="health-age" value="25" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            <div id="print-section-health" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Health Metrics Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-health"></p>
                    </div>
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Input Parameters</div>
                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between"><span class="text-slate-400">Weight & Height:</span><span id="receiptHealthInput" class="font-bold text-slate-700 dark:text-slate-300">70 kg • 175 cm</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Age:</span><span id="receiptHealthAge" class="font-bold text-slate-700 dark:text-slate-300">25 Years</span></div>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs font-bold">
                        <div class="flex justify-between"><span class="text-slate-400">BMI Index:</span><span id="res-bmi" class="text-purple-600 dark:text-purple-400 font-bold">22.9</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">BMR (Calories):</span><span id="res-bmr" class="text-slate-800 dark:text-slate-200">1725 kcal</span></div>
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">DAILY MAINTENANCE</span><span id="res-tdee" class="text-purple-600 dark:text-purple-400 text-sm font-black">2070 kcal</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('health')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-health')) document.getElementById('receipt-date-health').textContent = new Date().toLocaleString();
    const inputs = container.querySelectorAll('input');
    inputs.forEach(i => i.addEventListener('input', calculateHealth));
    calculateHealth();
}

function calculateHealth() {
    const weight = parseFloat(document.getElementById('health-weight')?.value) || 70;
    const height = parseFloat(document.getElementById('health-height')?.value) || 175;
    const age = parseFloat(document.getElementById('health-age')?.value) || 25;
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    let bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
    const tdee = Math.round(bmr * 1.2);
    if (document.getElementById('receiptHealthInput')) document.getElementById('receiptHealthInput').textContent = `${weight} kg • ${height} cm`;
    if (document.getElementById('receiptHealthAge')) document.getElementById('receiptHealthAge').textContent = `${age} Years`;
    if (document.getElementById('res-bmi')) document.getElementById('res-bmi').textContent = bmi.toFixed(1);
    if (document.getElementById('res-bmr')) document.getElementById('res-bmr').textContent = Math.round(bmr) + ' kcal';
    if (document.getElementById('res-tdee')) document.getElementById('res-tdee').textContent = tdee + ' kcal';
}

// 8. Discount & Sale Calculator
function initDiscountCalculator() {
    const container = document.getElementById('panel-discount');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Discount & Savings Parameters</h3>
                <div>
                    <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Original Price ($)</label>
                    <input type="number" id="discPrice" value="120" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Discount (%)</label>
                        <input type="number" id="discPct" value="25" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Tax Rate (%)</label>
                        <input type="number" id="discTax" value="8" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            <div id="print-section-discount" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Discount & Sale Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-discount"></p>
                    </div>
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Breakdown</div>
                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between"><span class="text-slate-400">Original Price:</span><span id="receiptDiscOrig" class="font-bold text-slate-700 dark:text-slate-300">$120.00</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Discount Offered:</span><span id="receiptDiscRate" class="font-bold text-emerald-600">25% OFF</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">You Save:</span><span id="receiptDiscSaved" class="font-bold text-emerald-600">$30.00</span></div>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs font-bold">
                        <div class="flex justify-between"><span class="text-slate-400">Discounted Price:</span><span id="discFinalPreTax" class="text-slate-800 dark:text-slate-200">$90.00</span></div>
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">FINAL TOTAL (INC. TAX)</span><span id="discFinalTotal" class="text-purple-600 dark:border-purple-400 text-sm font-black">$97.20</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('discount')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-discount')) document.getElementById('receipt-date-discount').textContent = new Date().toLocaleString();
    ['discPrice', 'discPct', 'discTax'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateDiscount);
    });
    calculateDiscount();
}

function calculateDiscount() {
    const orig = parseFloat(document.getElementById('discPrice')?.value) || 0;
    const pct = parseFloat(document.getElementById('discPct')?.value) || 0;
    const tax = parseFloat(document.getElementById('discTax')?.value) || 0;

    const saved = orig * (pct / 100);
    const discounted = orig - saved;
    const finalTotal = discounted * (1 + (tax / 100));

    if (document.getElementById('receiptDiscOrig')) document.getElementById('receiptDiscOrig').textContent = '$' + orig.toFixed(2);
    if (document.getElementById('receiptDiscRate')) document.getElementById('receiptDiscRate').textContent = pct + '% OFF';
    if (document.getElementById('receiptDiscSaved')) document.getElementById('receiptDiscSaved').textContent = '$' + saved.toFixed(2);
    if (document.getElementById('discFinalPreTax')) document.getElementById('discFinalPreTax').textContent = '$' + discounted.toFixed(2);
    if (document.getElementById('discFinalTotal')) document.getElementById('discFinalTotal').textContent = '$' + finalTotal.toFixed(2);
}

// 9. Date & Age Calculator
function initDateAgeCalculator() {
    const container = document.getElementById('panel-dateage');
    if (!container) return;
    const todayStr = new Date().toISOString().split('T')[0];
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Date & Age Interval</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Start Date / Birthdate</label>
                        <input type="date" id="dateStart" value="2000-01-01" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">End Date / Today</label>
                        <input type="date" id="dateEnd" value="${todayStr}" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            <div id="print-section-dateage" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Age & Date Interval Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-dateage"></p>
                    </div>
                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Age Breakdown</div>
                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between"><span class="text-slate-400">Total Days:</span><span id="dateTotalDays" class="font-bold text-slate-700 dark:text-slate-300">0 Days</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Total Weeks:</span><span id="dateTotalWeeks" class="font-bold text-slate-700 dark:text-slate-300">0 Weeks</span></div>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs font-bold">
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">EXACT AGE</span><span id="dateExactAge" class="text-purple-600 dark:border-purple-400 text-sm font-black">0 Yrs, 0 Mos</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('dateage')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-dateage')) document.getElementById('receipt-date-dateage').textContent = new Date().toLocaleString();
    ['dateStart', 'dateEnd'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateDateAge);
    });
    calculateDateAge();
}

function calculateDateAge() {
    const sVal = document.getElementById('dateStart')?.value;
    const eVal = document.getElementById('dateEnd')?.value;
    if (!sVal || !eVal) return;

    const d1 = new Date(sVal);
    const d2 = new Date(eVal);
    const diffMs = d2 - d1;
    const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const diffWeeks = (diffDays / 7).toFixed(1);

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
        months -= 1;
        days += 30;
    }
    if (months < 0) {
        years -= 1;
        months += 12;
    }

    if (document.getElementById('dateTotalDays')) document.getElementById('dateTotalDays').textContent = diffDays.toLocaleString() + ' Days';
    if (document.getElementById('dateTotalWeeks')) document.getElementById('dateTotalWeeks').textContent = diffWeeks.toLocaleString() + ' Weeks';
    if (document.getElementById('dateExactAge')) document.getElementById('dateExactAge').textContent = `${Math.max(0, years)} Yrs, ${Math.max(0, months)} Mos, ${Math.max(0, days)} Days`;
}

// 10. Salary Calculator
function initSalaryCalculator() {
    const container = document.getElementById('panel-salary');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary & Compensation Input</h3>
                <div>
                    <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Gross Annual Salary ($)</label>
                    <input type="number" id="salGross" value="75000" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Est. Tax Rate (%)</label>
                        <input type="number" id="salTax" value="22" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">401k / Deductions (%)</label>
                        <input type="number" id="salDed" value="5" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            <div id="print-section-salary" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Take-Home Pay Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-salary"></p>
                    </div>
                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between"><span class="text-slate-400">Gross Annual:</span><span id="salGrossText" class="font-bold text-slate-700 dark:text-slate-300">$75,000</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Total Deductions:</span><span id="salTaxText" class="font-bold text-amber-600">27%</span></div>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs font-bold">
                        <div class="flex justify-between"><span class="text-slate-400">Net Annual Pay:</span><span id="salNetAnnual" class="text-slate-800 dark:text-slate-200">$54,750</span></div>
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">MONTHLY TAKE-HOME</span><span id="salMonthly" class="text-purple-600 dark:border-purple-400 text-sm font-black">$4,562</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('salary')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-salary')) document.getElementById('receipt-date-salary').textContent = new Date().toLocaleString();
    ['salGross', 'salTax', 'salDed'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateSalary);
    });
    calculateSalary();
}

function calculateSalary() {
    const gross = parseFloat(document.getElementById('salGross')?.value) || 0;
    const tax = parseFloat(document.getElementById('salTax')?.value) || 0;
    const ded = parseFloat(document.getElementById('salDed')?.value) || 0;

    const totalRate = tax + ded;
    const netAnnual = gross * (1 - (totalRate / 100));
    const monthly = netAnnual / 12;

    if (document.getElementById('salGrossText')) document.getElementById('salGrossText').textContent = '$' + gross.toLocaleString();
    if (document.getElementById('salTaxText')) document.getElementById('salTaxText').textContent = totalRate + '%';
    if (document.getElementById('salNetAnnual')) document.getElementById('salNetAnnual').textContent = '$' + Math.round(netAnnual).toLocaleString();
    if (document.getElementById('salMonthly')) document.getElementById('salMonthly').textContent = '$' + Math.round(monthly).toLocaleString();
}

// 11. Inflation Calculator
function initInflationCalculator() {
    const container = document.getElementById('panel-inflation');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Purchasing Power Input</h3>
                <div>
                    <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Current Amount ($)</label>
                    <input type="number" id="infAmt" value="10000" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Inflation Rate (%)</label>
                        <input type="number" step="0.1" id="infRate" value="3.5" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Years</label>
                        <input type="number" id="infYears" value="10" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            <div id="print-section-inflation" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Purchasing Power Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-inflation"></p>
                    </div>
                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between"><span class="text-slate-400">Current Amount:</span><span id="infAmtText" class="font-bold text-slate-700 dark:text-slate-300">$10,000</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Inflation Rate:</span><span id="infRateText" class="font-bold text-slate-700 dark:text-slate-300">3.5%</span></div>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs font-bold">
                        <div class="flex justify-between"><span class="text-slate-400">Future Cost Equivalent:</span><span id="infFutureCost" class="text-slate-800 dark:text-slate-200">$14,106</span></div>
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">FUTURE PURCHASING POWER</span><span id="infPower" class="text-purple-600 dark:border-purple-400 text-sm font-black">$7,089</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('inflation')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-inflation')) document.getElementById('receipt-date-inflation').textContent = new Date().toLocaleString();
    ['infAmt', 'infRate', 'infYears'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateInflation);
    });
    calculateInflation();
}

function calculateInflation() {
    const amt = parseFloat(document.getElementById('infAmt')?.value) || 0;
    const r = parseFloat(document.getElementById('infRate')?.value) || 0;
    const y = parseFloat(document.getElementById('infYears')?.value) || 0;

    const futureCost = amt * Math.pow(1 + (r / 100), y);
    const power = amt / Math.pow(1 + (r / 100), y);

    if (document.getElementById('infAmtText')) document.getElementById('infAmtText').textContent = '$' + amt.toLocaleString();
    if (document.getElementById('infRateText')) document.getElementById('infRateText').textContent = r + '%';
    if (document.getElementById('infFutureCost')) document.getElementById('infFutureCost').textContent = '$' + Math.round(futureCost).toLocaleString();
    if (document.getElementById('infPower')) document.getElementById('infPower').textContent = '$' + Math.round(power).toLocaleString();
}

// 12. Fuel & Trip Cost Splitter
function initFuelCalculator() {
    const container = document.getElementById('panel-fuel');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Trip Parameters</h3>
                <div>
                    <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Distance (km)</label>
                    <input type="number" id="fuelDist" value="350" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                <div class="grid grid-cols-3 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Efficiency (km/L)</label>
                        <input type="number" step="0.1" id="fuelEff" value="15" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Fuel Price ($/L)</label>
                        <input type="number" step="0.01" id="fuelPrice" value="1.50" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Passengers</label>
                        <input type="number" id="fuelPeople" value="4" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            <div id="print-section-fuel" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Trip Fuel Cost Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-fuel"></p>
                    </div>
                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div class="flex justify-between"><span class="text-slate-400">Total Distance:</span><span id="fuelDistText" class="font-bold text-slate-700 dark:text-slate-300">350 km</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Fuel Needed:</span><span id="fuelLitresText" class="font-bold text-slate-700 dark:text-slate-300">23.3 Litres</span></div>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs font-bold">
                        <div class="flex justify-between"><span class="text-slate-400">Total Fuel Cost:</span><span id="fuelTotalCost" class="text-slate-800 dark:text-slate-200">$35.00</span></div>
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">COST PER PASSENGER</span><span id="fuelPerPerson" class="text-purple-600 dark:border-purple-400 text-sm font-black">$8.75</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('fuel')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-fuel')) document.getElementById('receipt-date-fuel').textContent = new Date().toLocaleString();
    ['fuelDist', 'fuelEff', 'fuelPrice', 'fuelPeople'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', calculateFuel);
    });
    calculateFuel();
}

function calculateFuel() {
    const dist = parseFloat(document.getElementById('fuelDist')?.value) || 0;
    const eff = parseFloat(document.getElementById('fuelEff')?.value) || 1;
    const price = parseFloat(document.getElementById('fuelPrice')?.value) || 0;
    const people = parseInt(document.getElementById('fuelPeople')?.value) || 1;

    const litres = dist / (eff > 0 ? eff : 1);
    const totalCost = litres * price;
    const perPerson = totalCost / (people > 0 ? people : 1);

    if (document.getElementById('fuelDistText')) document.getElementById('fuelDistText').textContent = dist + ' km';
    if (document.getElementById('fuelLitresText')) document.getElementById('fuelLitresText').textContent = litres.toFixed(1) + ' Litres';
    if (document.getElementById('fuelTotalCost')) document.getElementById('fuelTotalCost').textContent = '$' + totalCost.toFixed(2);
    if (document.getElementById('fuelPerPerson')) document.getElementById('fuelPerPerson').textContent = '$' + perPerson.toFixed(2);
}

// 13. Macro & Nutrition Calculator
function initMacroCalculator() {
    const container = document.getElementById('panel-macros');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Macronutrient Preferences</h3>
                <div>
                    <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Daily Calorie Goal (kcal)</label>
                    <input type="number" id="macroCals" value="2200" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Fitness Goal</label>
                        <select id="macroGoal" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="lose">Weight Loss (High Protein)</option>
                            <option value="maintain" selected>Maintain Weight (Balanced)</option>
                            <option value="gain">Muscle Gain (High Carb)</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Diet Style</label>
                        <select id="macroDiet" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="balanced" selected>Standard (30P / 40C / 30F)</option>
                            <option value="highprotein">High Protein (40P / 35C / 25F)</option>
                            <option value="lowcarb">Low Carb (40P / 20C / 40F)</option>
                        </select>
                    </div>
                </div>
            </div>
            <div id="print-section-macros" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Macro Nutrition Breakdown</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-macros"></p>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs font-bold">
                        <div class="flex justify-between"><span class="text-slate-400">Protein (4 kcal/g):</span><span id="macroProtein" class="text-purple-600 dark:text-purple-400">165g (660 kcal)</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Carbs (4 kcal/g):</span><span id="macroCarbs" class="text-blue-600">220g (880 kcal)</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Fats (9 kcal/g):</span><span id="macroFats" class="text-amber-600">73g (660 kcal)</span></div>
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">TOTAL TARGET CALORIES</span><span id="macroTotalCals" class="text-purple-600 dark:text-purple-400 text-sm font-black">2,200 kcal</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('macros')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-macros')) document.getElementById('receipt-date-macros').textContent = new Date().toLocaleString();
    ['macroCals', 'macroGoal', 'macroDiet'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', calculateMacros);
        if (el) el.addEventListener('input', calculateMacros);
    });
    calculateMacros();
}

function calculateMacros() {
    const cals = parseFloat(document.getElementById('macroCals')?.value) || 2000;
    const diet = document.getElementById('macroDiet')?.value || 'balanced';

    let pRatio = 0.3, cRatio = 0.4, fRatio = 0.3;
    if (diet === 'highprotein') { pRatio = 0.4; cRatio = 0.35; fRatio = 0.25; }
    else if (diet === 'lowcarb') { pRatio = 0.4; cRatio = 0.20; fRatio = 0.40; }

    const pGrams = Math.round((cals * pRatio) / 4);
    const cGrams = Math.round((cals * cRatio) / 4);
    const fGrams = Math.round((cals * fRatio) / 9);

    if (document.getElementById('macroProtein')) document.getElementById('macroProtein').textContent = `${pGrams}g (${Math.round(cals * pRatio)} kcal)`;
    if (document.getElementById('macroCarbs')) document.getElementById('macroCarbs').textContent = `${cGrams}g (${Math.round(cals * cRatio)} kcal)`;
    if (document.getElementById('macroFats')) document.getElementById('macroFats').textContent = `${fGrams}g (${Math.round(cals * fRatio)} kcal)`;
    if (document.getElementById('macroTotalCals')) document.getElementById('macroTotalCals').textContent = `${Math.round(cals).toLocaleString()} kcal`;
}

// 14. Ideal Body Weight Calculator
function initIdealWeightCalculator() {
    const container = document.getElementById('panel-idealweight');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Body Profile Input</h3>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Gender</label>
                        <select id="ibwGender" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="male" selected>Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Height (cm)</label>
                        <input type="number" id="ibwHeight" value="175" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            <div id="print-section-idealweight" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Ideal Body Weight Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-idealweight"></p>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs font-bold">
                        <div class="flex justify-between"><span class="text-slate-400">Devine Formula:</span><span id="ibwDevine" class="text-slate-800 dark:text-slate-200">70.3 kg</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Robinson Formula:</span><span id="ibwRobinson" class="text-slate-800 dark:text-slate-200">68.5 kg</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Miller Formula:</span><span id="ibwMiller" class="text-slate-800 dark:text-slate-200">67.1 kg</span></div>
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">RECOMMENDED TARGET RANGE</span><span id="ibwRange" class="text-purple-600 dark:text-purple-400 text-sm font-black">63.0 - 74.0 kg</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('idealweight')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-idealweight')) document.getElementById('receipt-date-idealweight').textContent = new Date().toLocaleString();
    ['ibwGender', 'ibwHeight'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', calculateIdealWeight);
        if (el) el.addEventListener('input', calculateIdealWeight);
    });
    calculateIdealWeight();
}

function calculateIdealWeight() {
    const gender = document.getElementById('ibwGender')?.value || 'male';
    const hCm = parseFloat(document.getElementById('ibwHeight')?.value) || 175;
    const hInches = hCm / 2.54;
    const inchesOver5ft = Math.max(0, hInches - 60);

    let devine = 0, robinson = 0, miller = 0;
    if (gender === 'male') {
        devine = 50 + (2.3 * inchesOver5ft);
        robinson = 52 + (1.9 * inchesOver5ft);
        miller = 56.2 + (1.41 * inchesOver5ft);
    } else {
        devine = 45.5 + (2.3 * inchesOver5ft);
        robinson = 49 + (1.7 * inchesOver5ft);
        miller = 53.1 + (1.36 * inchesOver5ft);
    }

    const minW = Math.min(devine, robinson, miller);
    const maxW = Math.max(devine, robinson, miller);

    if (document.getElementById('ibwDevine')) document.getElementById('ibwDevine').textContent = devine.toFixed(1) + ' kg (' + Math.round(devine * 2.20462) + ' lbs)';
    if (document.getElementById('ibwRobinson')) document.getElementById('ibwRobinson').textContent = robinson.toFixed(1) + ' kg (' + Math.round(robinson * 2.20462) + ' lbs)';
    if (document.getElementById('ibwMiller')) document.getElementById('ibwMiller').textContent = miller.toFixed(1) + ' kg (' + Math.round(miller * 2.20462) + ' lbs)';
    if (document.getElementById('ibwRange')) document.getElementById('ibwRange').textContent = `${(minW * 0.95).toFixed(1)} - ${(maxW * 1.05).toFixed(1)} kg`;
}

// 15. Daily Water Intake Calculator
function initWaterCalculator() {
    const container = document.getElementById('panel-water');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Hydration Parameters</h3>
                <div>
                    <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Body Weight (kg)</label>
                    <input type="number" id="waterWeight" value="70" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Daily Exercise (Mins)</label>
                        <input type="number" id="waterExercise" value="45" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Climate</label>
                        <select id="waterClimate" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="normal" selected>Normal / Moderate</option>
                            <option value="hot">Hot / Humid (+0.5L)</option>
                        </select>
                    </div>
                </div>
            </div>
            <div id="print-section-water" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Daily Hydration Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-water"></p>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs font-bold">
                        <div class="flex justify-between"><span class="text-slate-400">Baseline Requirement:</span><span id="waterBaseline" class="text-slate-800 dark:text-slate-200">2.45 Liters</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Exercise Offset:</span><span id="waterExOffset" class="text-blue-600">+0.53 Liters</span></div>
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">DAILY WATER TARGET</span><span id="waterTarget" class="text-purple-600 dark:text-purple-400 text-sm font-black">2.98 Liters (12 Glasses)</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('water')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-water')) document.getElementById('receipt-date-water').textContent = new Date().toLocaleString();
    ['waterWeight', 'waterExercise', 'waterClimate'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', calculateWater);
        if (el) el.addEventListener('input', calculateWater);
    });
    calculateWater();
}

function calculateWater() {
    const w = parseFloat(document.getElementById('waterWeight')?.value) || 70;
    const ex = parseFloat(document.getElementById('waterExercise')?.value) || 0;
    const climate = document.getElementById('waterClimate')?.value || 'normal';

    const base = w * 0.035;
    const exExtra = (ex / 30) * 0.35;
    const climateExtra = climate === 'hot' ? 0.5 : 0;
    const totalLiters = base + exExtra + climateExtra;
    const glasses = Math.round(totalLiters / 0.25);

    if (document.getElementById('waterBaseline')) document.getElementById('waterBaseline').textContent = base.toFixed(2) + ' Liters';
    if (document.getElementById('waterExOffset')) document.getElementById('waterExOffset').textContent = '+' + (exExtra + climateExtra).toFixed(2) + ' Liters';
    if (document.getElementById('waterTarget')) document.getElementById('waterTarget').textContent = `${totalLiters.toFixed(2)} Liters (${glasses} Glasses)`;
}

// 16. Body Fat Percentage Calculator (US Navy Method)
function initBodyFatCalculator() {
    const container = document.getElementById('panel-bodyfat');
    if (!container) return;
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider">US Navy Circumference Inputs</h3>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Gender</label>
                        <select id="bfGender" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                            <option value="male" selected>Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Weight (kg)</label>
                        <input type="number" id="bfWeight" value="75" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
                <div class="grid grid-cols-3 gap-3">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Height (cm)</label>
                        <input type="number" id="bfHeight" value="175" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Waist (cm)</label>
                        <input type="number" id="bfWaist" value="82" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Neck (cm)</label>
                        <input type="number" id="bfNeck" value="38" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500">
                    </div>
                </div>
            </div>
            <div id="print-section-bodyfat" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                <div>
                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Body Fat Composition Summary</p>
                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-bodyfat"></p>
                    </div>
                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs font-bold">
                        <div class="flex justify-between"><span class="text-slate-400">Fat Mass:</span><span id="bfFatMass" class="text-amber-600">12.8 kg</span></div>
                        <div class="flex justify-between"><span class="text-slate-400">Lean Mass:</span><span id="bfLeanMass" class="text-emerald-600">62.2 kg</span></div>
                        <div class="flex justify-between border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs"><span class="text-slate-500">ESTIMATED BODY FAT %</span><span id="bfResultPct" class="text-purple-600 dark:text-purple-400 text-sm font-black">17.0%</span></div>
                    </div>
                </div>
                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans mt-4">
                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Print Summary</button>
                    <button type="button" onclick="shareCalculation('bodyfat')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1">Share Summary</button>
                </div>
            </div>
        </div>
    `;
    if (document.getElementById('receipt-date-bodyfat')) document.getElementById('receipt-date-bodyfat').textContent = new Date().toLocaleString();
    ['bfGender', 'bfWeight', 'bfHeight', 'bfWaist', 'bfNeck'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', calculateBodyFat);
        if (el) el.addEventListener('input', calculateBodyFat);
    });
    calculateBodyFat();
}

function calculateBodyFat() {
    const gender = document.getElementById('bfGender')?.value || 'male';
    const weight = parseFloat(document.getElementById('bfWeight')?.value) || 75;
    const height = parseFloat(document.getElementById('bfHeight')?.value) || 175;
    const waist = parseFloat(document.getElementById('bfWaist')?.value) || 82;
    const neck = parseFloat(document.getElementById('bfNeck')?.value) || 38;

    let bodyFatPct = 15;
    if (gender === 'male') {
        const logVal = Math.log10(Math.max(1, waist - neck)) - Math.log10(height);
        bodyFatPct = 495 / (1.0324 - 0.19077 * logVal + 0.15456 * Math.log10(height)) - 450;
    } else {
        const logVal = Math.log10(Math.max(1, waist + 90 - neck)) - Math.log10(height);
        bodyFatPct = 495 / (1.29579 - 0.35004 * logVal + 0.22100 * Math.log10(height)) - 450;
    }

    bodyFatPct = Math.max(3, Math.min(50, bodyFatPct));
    const fatMass = weight * (bodyFatPct / 100);
    const leanMass = weight - fatMass;

    if (document.getElementById('bfFatMass')) document.getElementById('bfFatMass').textContent = fatMass.toFixed(1) + ' kg';
    if (document.getElementById('bfLeanMass')) document.getElementById('bfLeanMass').textContent = leanMass.toFixed(1) + ' kg';
    if (document.getElementById('bfResultPct')) document.getElementById('bfResultPct').textContent = bodyFatPct.toFixed(1) + '%';
}

// Categorized Tab Configuration
const TABS = [
    { id: 'dashboard', category: 'General', title: 'Utility Deck', desc: 'Select any calculator or converter below to begin.', icon: 'layout-dashboard' },
    
    // Everyday Essentials (Top Tier)
    { id: 'unit', category: '⚡ Everyday Essentials', title: 'Unit Converter', desc: 'Convert length, weight, area, volume, speed, temperature & more.', icon: 'arrow-left-right' },
    { id: 'currency', category: '⚡ Everyday Essentials', title: 'Currency Exchange', desc: 'Convert foreign currencies with live rates.', icon: 'banknote' },
    { id: 'discount', category: '⚡ Everyday Essentials', title: 'Discount & Sale Calc', desc: 'Calculate sale prices, percentage off, and total savings.', icon: 'tag' },
    { id: 'tip', category: '⚡ Everyday Essentials', title: 'Tip & Split Bill', desc: 'Calculate tips and divide bills easily.', icon: 'users' },
    { id: 'dateage', category: '⚡ Everyday Essentials', title: 'Date & Age Calc', desc: 'Calculate exact age and date differences.', icon: 'calendar' },

    // Finance, Tax & Wealth
    { id: 'emi', category: '💰 Finance & Tax', title: 'Loan EMI Calc', desc: 'Estimate monthly EMI repayments and total interest payable.', icon: 'landmark' },
    { id: 'investment', category: '💰 Finance & Tax', title: 'Investment & SIP', desc: 'Compound interest, SIP projections, and wealth returns.', icon: 'trending-up' },
    { id: 'tax', category: '💰 Finance & Tax', title: 'Tax Calculator', desc: 'GST, HST, and sales tax breakdown.', icon: 'receipt' },
    { id: 'salary', category: '💰 Finance & Tax', title: 'Salary & Take-Home', desc: 'Gross salary to net monthly take-home pay.', icon: 'wallet' },
    { id: 'inflation', category: '💰 Finance & Tax', title: 'Inflation & Purchasing', desc: 'Future value of money & purchasing power.', icon: 'line-chart' },

    // Health & Lifestyle
    { id: 'health', category: '🏃 Health & Lifestyle', title: 'Health Fitness Calc', desc: 'BMI, BMR, TDEE, and daily calorie targets.', icon: 'activity' },
    { id: 'macros', category: '🏃 Health & Lifestyle', title: 'Macro Nutrition', desc: 'Daily Protein, Carbs, and Fats split.', icon: 'pie-chart' },
    { id: 'idealweight', category: '🏃 Health & Lifestyle', title: 'Ideal Body Weight', desc: 'Devine & Robinson target weight range.', icon: 'scale' },
    { id: 'water', category: '🏃 Health & Lifestyle', title: 'Daily Water Intake', desc: 'Hydration goal based on weight & activity.', icon: 'droplet' },
    { id: 'bodyfat', category: '🏃 Health & Lifestyle', title: 'Body Fat Percentage', desc: 'US Navy circumference method.', icon: 'percent' },
    { id: 'fuel', category: '🏃 Health & Lifestyle', title: 'Fuel & Trip Splitter', desc: 'Fuel consumption cost & road trip bill split.', icon: 'car' }
];

// Global Tab Switcher Function
window.switchTab = function(tabId) {
    // Hide all calc panels
    const panels = document.querySelectorAll('.calc-panel');
    panels.forEach(panel => panel.classList.add('hidden'));

    // Show active panel
    const activePanel = document.getElementById(`panel-${tabId}`);
    if (activePanel) {
        activePanel.classList.remove('hidden');
    }

    // Update Header Titles
    const tabMeta = TABS.find(t => t.id === tabId);
    if (tabMeta) {
        const titleEl = document.getElementById('currentTabTitle');
        const descEl = document.getElementById('currentTabDesc');
        if (titleEl) titleEl.textContent = tabMeta.title;
        if (descEl) descEl.textContent = tabMeta.desc;
    }

    // Update Desktop Navigation Items
    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
        const isCollapsed = isSidebarCollapsed;
        const padClass = isCollapsed ? 'px-2 justify-center' : 'px-4 gap-3';
        if (btn.dataset.tab === tabId) {
            btn.className = `sidebar-nav-btn w-full flex items-center ${padClass} py-3 rounded-2xl font-bold text-xs transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 scale-[1.02]`;
        } else {
            btn.className = `sidebar-nav-btn w-full flex items-center ${padClass} py-3 rounded-2xl font-semibold text-xs transition-all text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-800/80 hover:text-purple-600 dark:hover:text-purple-400`;
        }
    });

    // Update Mobile Select Dropdown
    const mobileSelect = document.getElementById('mobileTabSelect');
    if (mobileSelect) mobileSelect.value = tabId;

    // Refresh Lucide Icons in the newly visible section
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

// Global Theme Switcher
window.setTheme = function(mode) {
    localStorage.setItem('asg_theme', mode);
    
    if (mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    // Sync button states
    ['system', 'light', 'dark'].forEach(m => {
        const btnDesktop = document.getElementById(`theme-btn-${m}-desktop`);
        const btnMobile = document.getElementById(`theme-btn-${m}-mobile`);
        
        const activeClass = 'bg-purple-600 text-white shadow-md font-bold';
        const inactiveClass = 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium';

        if (btnDesktop) btnDesktop.className = `px-3 py-1.5 rounded-xl text-xs transition-all ${m === mode ? activeClass : inactiveClass}`;
        if (btnMobile) btnMobile.className = `px-2.5 py-1 rounded-lg text-xs transition-all ${m === mode ? activeClass : inactiveClass}`;
    });
};

// Application Bootstrapper
document.addEventListener('DOMContentLoaded', () => {
    // 1. Set Footer Year
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // 2. Initialize Navigation Sidebar & Mobile Dropdown
    initNavigation();

    // 3. Initialize Theme
    const savedTheme = localStorage.getItem('asg_theme') || 'system';
    window.setTheme(savedTheme);

    // 4. Initialize Sub-modules
    try { initUnitConverter(); } catch (e) { console.error('Unit Converter init error:', e); }
    try { initCurrencyConverter(); } catch (e) { console.error('Currency Converter init error:', e); }
    try { initDiscountCalculator(); } catch (e) { console.error('Discount Calculator init error:', e); }
    try { initEmiCalculator(); } catch (e) { console.error('EMI Calculator init error:', e); }
    try { initInvestmentCalculator(); } catch (e) { console.error('Investment Calculator init error:', e); }
    try { initTaxCalculator(); } catch (e) { console.error('Tax Calculator init error:', e); }
    try { initTipCalculator(); } catch (e) { console.error('Tip Calculator init error:', e); }
    try { initDateAgeCalculator(); } catch (e) { console.error('Date/Age Calculator init error:', e); }
    try { initHealthCalculator(); } catch (e) { console.error('Health Calculator init error:', e); }
    try { initMacroCalculator(); } catch (e) { console.error('Macro Calculator init error:', e); }
    try { initIdealWeightCalculator(); } catch (e) { console.error('Ideal Weight Calculator init error:', e); }
    try { initWaterCalculator(); } catch (e) { console.error('Water Intake Calculator init error:', e); }
    try { initBodyFatCalculator(); } catch (e) { console.error('Body Fat Calculator init error:', e); }
    try { initFuelCalculator(); } catch (e) { console.error('Fuel Calculator init error:', e); }

    // 5. Initial Render of Lucide Icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }

    // 6. Listen for OS theme changes if theme is system
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if ((localStorage.getItem('asg_theme') || 'system') === 'system') {
            window.setTheme('system');
        }
    });
});

// Sidebar Toggle & Collapse Logic
let isSidebarCollapsed = localStorage.getItem('asg_sidebar_collapsed') === 'true';

window.toggleSidebar = function() {
    isSidebarCollapsed = !isSidebarCollapsed;
    localStorage.setItem('asg_sidebar_collapsed', isSidebarCollapsed);
    applySidebarState();
};

function applySidebarState() {
    const sidebar = document.getElementById('desktopSidebar');
    const toggleIcon = document.getElementById('sidebarToggleIcon');
    if (!sidebar) return;

    if (isSidebarCollapsed) {
        sidebar.classList.remove('w-72');
        sidebar.classList.add('w-20');
        if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'panel-left-open');
        document.querySelectorAll('.sidebar-text-content').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
            btn.classList.add('justify-center', 'px-2');
            btn.classList.remove('px-4', 'gap-3');
        });
        document.querySelectorAll('.sidebar-cat-header').forEach(el => el.classList.add('hidden'));
    } else {
        sidebar.classList.remove('w-20');
        sidebar.classList.add('w-72');
        if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'panel-left-close');
        document.querySelectorAll('.sidebar-text-content').forEach(el => el.classList.remove('hidden'));
        document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
            btn.classList.remove('justify-center', 'px-2');
            btn.classList.add('px-4', 'gap-3');
        });
        document.querySelectorAll('.sidebar-cat-header').forEach(el => el.classList.remove('hidden'));
    }

    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

function initNavigation() {
    const desktopSidebar = document.getElementById('desktopSidebarNav');
    const mobileSelect = document.getElementById('mobileTabSelect');

    if (desktopSidebar) {
        desktopSidebar.innerHTML = '';
        let lastCategory = '';

        TABS.forEach(tab => {
            if (tab.category !== 'General' && tab.category !== lastCategory) {
                lastCategory = tab.category;
                const catHeader = document.createElement('div');
                catHeader.className = 'sidebar-cat-header text-[10px] font-extrabold uppercase tracking-widest text-purple-600 dark:text-purple-400 pt-3 pb-1 px-3';
                catHeader.textContent = tab.category;
                desktopSidebar.appendChild(catHeader);
            }

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.tab = tab.id;
            btn.title = tab.title;
            btn.className = tab.id === 'dashboard'
                ? 'sidebar-nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-bold text-xs transition-all bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 scale-[1.02]'
                : 'sidebar-nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold text-xs transition-all text-slate-600 dark:text-slate-400 hover:bg-purple-50 dark:hover:bg-slate-800/80 hover:text-purple-600 dark:hover:text-purple-400';
            
            btn.innerHTML = `<i data-lucide="${tab.icon}" class="w-4 h-4 shrink-0"></i><span class="sidebar-text-content truncate">${tab.title}</span>`;
            btn.onclick = () => window.switchTab(tab.id);
            desktopSidebar.appendChild(btn);
        });

        applySidebarState();
    }

    if (mobileSelect) {
        mobileSelect.innerHTML = '';
        let currentGroup = null;

        TABS.forEach(tab => {
            if (tab.category === 'General') {
                const opt = document.createElement('option');
                opt.value = tab.id;
                opt.textContent = tab.title;
                mobileSelect.appendChild(opt);
            } else {
                if (!currentGroup || currentGroup.label !== tab.category) {
                    currentGroup = document.createElement('optgroup');
                    currentGroup.label = tab.category;
                    mobileSelect.appendChild(currentGroup);
                }
                const opt = document.createElement('option');
                opt.value = tab.id;
                opt.textContent = tab.title;
                currentGroup.appendChild(opt);
            }
        });
        mobileSelect.onchange = (e) => window.switchTab(e.target.value);
    }
}

// Universal Share Summary Helper
window.shareCalculation = function(type) {
    const text = `Check out my ${type.toUpperCase()} calculation summary on ASG SmartCalc Pro!`;
    if (navigator.share) {
        navigator.share({ title: 'ASG SmartCalc Pro Summary', text: text, url: window.location.href }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Calculation summary link copied to clipboard!');
    }
};
