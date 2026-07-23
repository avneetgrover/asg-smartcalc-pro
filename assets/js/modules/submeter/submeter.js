const STORAGE_KEY = 'asg_submeter_data';

export function initSubmeterCalculator() {
    const netBillInput = document.getElementById('subNetBill');
    const mainUnitsInput = document.getElementById('subMainUnits');
    const oldReadingInput = document.getElementById('subOldReading');
    const newReadingInput = document.getElementById('subNewReading');

    if (!netBillInput) return;

    // Load saved data from localStorage if available
    loadSavedData();

    // Attach real-time event listeners
    [netBillInput, mainUnitsInput, oldReadingInput, newReadingInput].forEach(inp => {
        inp.addEventListener('input', () => {
            calculate();
            saveData();
        });
    });

    calculate();

    function calculate() {
        const netBill = parseFloat(netBillInput.value) || 0;
        const mainUnits = parseFloat(mainUnitsInput.value) || 0;
        const oldReading = parseFloat(oldReadingInput.value) || 0;
        const newReading = parseFloat(newReadingInput.value) || 0;

        const rateContainer = document.getElementById('subRateResult');
        const unitsContainer = document.getElementById('subUnitsResult');
        const amountContainer = document.getElementById('subAmountResult');
        const errorContainer = document.getElementById('subErrorMsg');

        // Reset error message
        errorContainer.classList.add('hidden');
        errorContainer.textContent = '';

        // 1. Cost Per Unit Calculation (Safe against Zero Division)
        const costPerUnit = mainUnits > 0 ? (netBill / mainUnits) : 0;
        const roundedRate = Math.round(costPerUnit * 100) / 100;

        // 2. Submeter Units Consumed & Edge Case Handling
        let consumedUnits = 0;
        let isInvalid = false;

        if (newReading < oldReading) {
            isInvalid = true;
            errorContainer.textContent = 'Invalid: New Reading cannot be less than Old Reading.';
            errorContainer.classList.remove('hidden');
        } else {
            consumedUnits = newReading - oldReading;
        }

        // 3. Submeter Payable Amount
        const amountToPay = isInvalid ? 0 : (consumedUnits * roundedRate);

        // Update UI
        rateContainer.textContent = `₹ ${roundedRate.toFixed(2)} / unit`;
        unitsContainer.textContent = isInvalid ? 'Invalid' : `${consumedUnits.toLocaleString()} kWh`;
        amountContainer.textContent = `₹ ${amountToPay.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    function saveData() {
        const data = {
            netBill: netBillInput.value,
            mainUnits: mainUnitsInput.value,
            oldReading: oldReadingInput.value,
            newReading: newReadingInput.value
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function loadSavedData() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;
        try {
            const data = JSON.parse(saved);
            if (data.netBill !== undefined) netBillInput.value = data.netBill;
            if (data.mainUnits !== undefined) mainUnitsInput.value = data.mainUnits;
            if (data.oldReading !== undefined) oldReadingInput.value = data.oldReading;
            if (data.newReading !== undefined) newReadingInput.value = data.newReading;
        } catch (e) {
            console.error('Failed to parse saved submeter data', e);
        }
    }
}