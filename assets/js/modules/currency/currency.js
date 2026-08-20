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

export function initCurrencyConverter() {
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
    swapBtn?.addEventListener('click', swap);

    updateFlags();
    calculate();

    function updateFlags() {
        const fromCurr = currencies.find(c => c.code === fromSelect.value);
        const toCurr = currencies.find(c => c.code === toSelect.value);

        if (fromCurr) document.getElementById('currFromFlag').src = `https://flagcdn.com/w40/${fromCurr.country}.png`;
        if (toCurr) document.getElementById('currToFlag').src = `https://flagcdn.com/w40/${toCurr.country}.png`;
    }

    function swap() {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;
        updateFlags();
        calculate();
    }

    async function calculate() {
        const amt = parseFloat(amtInput.value) || 0;
        const from = fromSelect.value;
        const to = toSelect.value;
        const output = document.getElementById('currOutput');
        const status = document.getElementById('currStatus');

        try {
            status.textContent = 'Updating exchange rates...';
            const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
            const data = await res.json();

            if (data && data.rates && data.rates[to]) {
                const rate = data.rates[to];
                output.textContent = `${to} ${(amt * rate).toFixed(2)}`;
                status.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
            }
        } catch (err) {
            output.textContent = 'Error';
            status.textContent = 'Connection failed';
        }
    }
}