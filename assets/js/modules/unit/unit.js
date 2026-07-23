// Units Definition & Ratios
const UNIT_DATA = {
    length: {
        m: { name: 'Meter (m)', ratio: 1, label: 'Meters' },
        ft: { name: 'Foot (ft)', ratio: 0.3048, label: 'Feet' },
        in: { name: 'Inch (in)', ratio: 0.0254, label: 'Inches' },
        km: { name: 'Kilometer (km)', ratio: 1000, label: 'Kilometers' },
        mi: { name: 'Mile (mi)', ratio: 1609.344, label: 'Miles' },
        cm: { name: 'Centimeter (cm)', ratio: 0.01, label: 'Centimeters' },
        mm: { name: 'Millimeter (mm)', ratio: 0.001, label: 'Millimeters' }
    },
    weight: {
        kg: { name: 'Kilogram (kg)', ratio: 1, label: 'Kilograms' },
        lb: { name: 'Pound (lb)', ratio: 0.45359237, label: 'Pounds' },
        g: { name: 'Gram (g)', ratio: 0.001, label: 'Grams' },
        oz: { name: 'Ounce (oz)', ratio: 0.028349523125, label: 'Ounces' }
    }
};

export function initUnitConverter() {
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

    function updateBreakdown(baseValInMeters, category) {
        const breakdownEl = document.getElementById('unitResults');
        const units = UNIT_DATA[category];
        if (!breakdownEl || !units) return;

        let html = '';
        for (const key in units) {
            const u = units[key];
            const val = baseValInMeters / u.ratio;
            const formattedVal = val < 0.01 && val > 0 ? val.toFixed(6) : val.toFixed(2);
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

        let baseVal = 0;

        if (direction === 'from') {
            const val = parseFloat(fromValEl.value) || 0;
            baseVal = val * units[fromKey].ratio;
            const result = baseVal / units[toKey].ratio;
            toValEl.value = Number(result.toFixed(6));
        } else {
            const val = parseFloat(toValEl.value) || 0;
            baseVal = val * units[toKey].ratio;
            const result = baseVal / units[fromKey].ratio;
            fromValEl.value = Number(result.toFixed(6));
        }

        // Active Formula text
        const ratio = units[fromKey].ratio / units[toKey].ratio;
        const formulaEl = document.getElementById('unitFormula');
        if (formulaEl) {
            formulaEl.textContent = `1 ${units[fromKey].label.slice(0, -1)} = ${ratio.toFixed(6)} ${units[toKey].label}`;
        }

        updateBreakdown(baseVal, category);
    }

    // Attach Event Listeners
    categoryEl.addEventListener('change', (e) => {
        populateSelects(e.target.value);
        convert('from');
    });

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

    // Initialize
    populateSelects(categoryEl.value);
    convert('from');
}
