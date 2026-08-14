/**
 * Market & Crypto Live Calculator Module
 */
export function initMarketCalculator() {
    const container = document.getElementById('market-calculator-container');
    if (!container) return;

    // Render basic UI layout matching standard app components
    container.innerHTML = `
        <div class="card market-card">
            <h3>🌍 Global Market & Crypto Converter</h3>
            <div class="form-grid">
                <div class="form-group">
                    <label for="market-amount">Amount</label>
                    <input type="number" id="market-amount" value="1" min="0" step="any">
                </div>
                <div class="form-group">
                    <label for="market-base">From Asset / Currency</label>
                    <select id="market-base">
                        <optgroup label="Fiat Currencies">
                            <option value="USD" selected>USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="JPY">JPY - Japanese Yen</option>
                        </optgroup>
                        <optgroup label="Cryptocurrencies">
                            <option value="bitcoin">BTC - Bitcoin</option>
                            <option value="ethereum">ETH - Ethereum</option>
                            <option value="solana">SOL - Solana</option>
                        </optgroup>
                    </select>
                </div>
            </div>
            
            <div class="market-results-box" style="margin-top: 20px;">
                <h4>Converted Values</h4>
                <ul id="market-output-list" style="list-style: none; padding: 0;">
                    <li>Loading live market rates...</li>
                </ul>
            </div>
            <button id="market-refresh-btn" class="btn-secondary" style="margin-top: 10px;">Refresh Rates</button>
        </div>
    `;

    const amountInput = container.querySelector('#market-amount');
    const baseSelect = container.querySelector('#market-base');
    const outputList = container.querySelector('#market-output-list');
    const refreshBtn = container.querySelector('#market-refresh-btn');

    let cachedRates = { fiat: {}, crypto: {} };

    async function fetchRates() {
        outputList.innerHTML = `<li>Fetching live rates...</li>`;
        try {
            // 1. Fetch Fiat rates (Free endpoint, no key needed)
            const fiatRes = await fetch('https://open.er-api.com/v6/latest/USD');
            const fiatData = await fiatRes.json();
            
            // 2. Fetch Crypto prices in USD (CoinGecko free tier)
            const cryptoRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd');
            const cryptoData = await cryptoRes.json();

            cachedRates.fiat = fiatData.rates;
            cachedRates.crypto = {
                bitcoin: cryptoData.bitcoin.usd,
                ethereum: cryptoData.ethereum.usd,
                solana: cryptoData.solana.usd
            };

            calculateConversions();
        } catch (error) {
            outputList.innerHTML = `<li style="color: red;">Failed to fetch live market data. Check connection.</li>`;
        }
    }

    function calculateConversions() {
        const amount = parseFloat(amountInput.value) || 0;
        const base = baseSelect.value;

        let valueInUSD = 0;

        // Convert input base to USD standard first
        if (['bitcoin', 'ethereum', 'solana'].includes(base)) {
            const cryptoUSD = cachedRates.crypto[base] || 0;
            valueInUSD = amount * cryptoUSD;
        } else {
            const rateToUSD = cachedRates.fiat[base] || 1;
            valueInUSD = amount / rateToUSD;
        }

        // Render target values
        const targetFiats = ['USD', 'EUR', 'GBP', 'INR', 'JPY'];
        const targetCryptos = [
            { id: 'bitcoin', symbol: 'BTC' },
            { id: 'ethereum', symbol: 'ETH' },
            { id: 'solana', symbol: 'SOL' }
        ];

        let html = '';

        // Display Fiat equivalents
        targetFiats.forEach(fiat => {
            const rate = cachedRates.fiat[fiat] || 1;
            const converted = valueInUSD * rate;
            html += `<li><strong>${fiat}:</strong> ${converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</li>`;
        });

        html += `<hr style="margin: 8px 0; border:0; border-top:1px solid #ddd;">`;

        // Display Crypto equivalents
        targetCryptos.forEach(crypto => {
            const priceUSD = cachedRates.crypto[crypto.id] || 1;
            const converted = valueInUSD / priceUSD;
            html += `<li><strong>${crypto.symbol}:</strong> ${converted.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 6 })}</li>`;
        });

        outputList.innerHTML = html;
    }

    amountInput.addEventListener('input', calculateConversions);
    baseSelect.addEventListener('change', calculateConversions);
    refreshBtn.addEventListener('click', fetchRates);

    // Initial load
    fetchRates();
}
