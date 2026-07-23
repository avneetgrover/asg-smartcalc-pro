import { initUnitConverter } from './modules/unit/unit.js';
import { initCbmCalculator } from './modules/cbm/cbm.js';
import { initCurrencyCalculator } from './modules/currency/currency.js';
import { initEmiCalculator } from './modules/emi/emi.js';

const tabs = [
    { id: 'unit', name: 'Unit Converter', desc: 'Convert lengths, weights, and dimensions', icon: 'scale', init: initUnitConverter },
    { id: 'cbm', name: 'Volume & CBM', desc: 'Calculate shipping volume & cargo weight', icon: 'box', init: initCbmCalculator },
    { id: 'currency', name: 'Currency Exchange', desc: 'Live exchange conversion with swap toggle', icon: 'coins', init: initCurrencyCalculator },
    { id: 'emi', name: 'Loan EMI Calc', desc: 'Amortization, principal & interest breakdown', icon: 'landmark', init: initEmiCalculator }
];

function initApp() {
    document.getElementById('footerYear').textContent = new Date().getFullYear();
    populateNavigation();
    
    tabs.forEach(tab => {
        if (typeof tab.init === 'function') tab.init();
    });

    switchTab('unit');
    lucide.createIcons();
}

function populateNavigation() {
    const sidebar = document.getElementById('desktopSidebar');
    const mobileSelect = document.getElementById('mobileTabSelect');
    
    sidebar.innerHTML = '';
    mobileSelect.innerHTML = '';

    tabs.forEach(t => {
        const btn = document.createElement('button');
        btn.id = `nav-${t.id}`;
        btn.onclick = () => switchTab(t.id);
        btn.className = `w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 text-left`;
        btn.innerHTML = `<i data-lucide="${t.icon}" class="w-4 h-4"></i><span>${t.name}</span>`;
        sidebar.appendChild(btn);

        const opt = document.createElement('option');
        opt.value = t.id;
        opt.textContent = t.name;
        mobileSelect.appendChild(opt);
    });

    mobileSelect.addEventListener('change', (e) => switchTab(e.target.value));
}

function switchTab(tabId) {
    document.querySelectorAll('.calc-panel').forEach(p => p.classList.add('hidden'));
    
    const targetPanel = document.getElementById(`panel-${tabId}`);
    if (targetPanel) targetPanel.classList.remove('hidden');

    tabs.forEach(t => {
        const btn = document.getElementById(`nav-${t.id}`);
        if (!btn) return;
        if (t.id === tabId) {
            btn.className = `w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 text-left bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20`;
        } else {
            btn.className = `w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 text-left text-slate-600 hover:bg-slate-200/60 hover:text-slate-900`;
        }
    });

    const active = tabs.find(t => t.id === tabId);
    if (active) {
        document.getElementById('currentTabTitle').textContent = active.name;
        document.getElementById('currentTabDesc').textContent = active.desc;
        document.getElementById('mobileTabSelect').value = tabId;
    }
}

window.addEventListener('DOMContentLoaded', initApp);

/* ==========================================
   MODULE 5: Submeter Calc
   ========================================== */
const SubmeterCalcModule = (function () {
    const STORAGE_KEYS = {
        netBill: 'asg_submeter_netBill',
        totalUnits: 'asg_submeter_totalUnits',
        oldReading: 'asg_submeter_oldReading',
        newReading: 'asg_submeter_newReading'
    };

    function getTemplate() {
        return `
        <style>
            .submeter-card {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 20px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
                width: 100%;
                max-width: 440px;
                margin: 0 auto;
                padding: 28px 24px 20px 24px;
                position: relative;
                overflow: hidden;
                box-sizing: border-box;
            }

            .submeter-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 6px;
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #d946ef 100%);
            }

            .submeter-header {
                margin-bottom: 24px;
                text-align: center;
            }

            .submeter-header h2 {
                font-size: 1.4rem;
                font-weight: 800;
                letter-spacing: -0.025em;
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #d946ef 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                display: inline-block;
                margin: 0;
            }

            .submeter-header p {
                font-size: 0.85rem;
                color: #64748b;
                margin-top: 4px;
                font-weight: 500;
            }

            .submeter-section-tag {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 0.72rem;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.06em;
                color: #6366f1;
                margin-bottom: 12px;
            }

            .submeter-section-tag::after {
                content: '';
                flex: 1;
                height: 1px;
                background-color: #e2e8f0;
            }

            .submeter-input-group {
                margin-bottom: 16px;
            }

            .submeter-input-group label {
                display: block;
                font-size: 0.82rem;
                font-weight: 600;
                color: #0f172a;
                margin-bottom: 6px;
            }

            .submeter-input-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            .submeter-input-wrapper span {
                position: absolute;
                left: 14px;
                font-size: 0.9rem;
                color: #64748b;
                font-weight: 600;
                pointer-events: none;
            }

            .submeter-input-wrapper input {
                width: 100%;
                padding: 12px 14px 12px 38px;
                border: 1px solid #e2e8f0;
                border-radius: 12px;
                background-color: #f8fafc;
                font-size: 1rem;
                font-weight: 600;
                color: #0f172a;
                outline: none;
                transition: all 0.2s ease;
                box-sizing: border-box;
            }

            .submeter-input-wrapper input:focus {
                border-color: #6366f1;
                background-color: #ffffff;
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
            }

            .submeter-divider {
                height: 1px;
                background-color: #e2e8f0;
                margin: 20px 0;
            }

            .submeter-result-box {
                background-color: #f5f3ff;
                border: 1px solid #ddd6fe;
                border-radius: 14px;
                padding: 18px;
                margin-top: 20px;
            }

            .submeter-result-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.85rem;
                color: #64748b;
                font-weight: 500;
                margin-bottom: 10px;
            }

            .submeter-result-row .value {
                font-weight: 700;
                color: #0f172a;
                font-size: 0.95rem;
            }

            .submeter-result-row.total {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px dashed #ddd6fe;
                color: #0f172a;
                font-weight: 700;
                font-size: 1rem;
                margin-bottom: 0;
            }

            .submeter-result-row.total .value {
                background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #d946ef 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                font-size: 1.35rem;
                font-weight: 800;
            }

            .submeter-footer {
                margin-top: 20px;
                padding-top: 14px;
                border-top: 1px solid #e2e8f0;
                text-align: center;
                font-size: 0.75rem;
                color: #64748b;
                font-weight: 500;
            }

            .submeter-footer span {
                font-weight: 700;
                color: #6366f1;
            }
        </style>

        <div class="submeter-card">
            <div class="submeter-header">
                <h2>Submeter Invoice Generator</h2>
                <p>Instant Electricity Bill Allocation</p>
            </div>

            <div class="submeter-section-tag">1. Main Bill Summary</div>
            
            <div class="submeter-input-group">
                <label for="submeter_netBill">Net Bill Payable Amount</label>
                <div class="submeter-input-wrapper">
                    <span>₹</span>
                    <input type="number" id="submeter_netBill" value="56700" step="any" inputmode="decimal">
                </div>
            </div>

            <div class="submeter-input-group">
                <label for="submeter_totalUnits">Main Meter Consumed Units</label>
                <div class="submeter-input-wrapper">
                    <span>⚡</span>
                    <input type="number" id="submeter_totalUnits" value="6950.1" step="any" inputmode="decimal">
                </div>
            </div>

            <div class="submeter-divider"></div>

            <div class="submeter-section-tag">2. Submeter Readings</div>

            <div class="submeter-input-group">
                <label for="submeter_oldReading">OLD Submeter Reading (KWh)</label>
                <div class="submeter-input-wrapper">
                    <span>📊</span>
                    <input type="number" id="submeter_oldReading" value="7921" step="any" inputmode="decimal">
                </div>
            </div>

            <div class="submeter-input-group">
                <label for="submeter_newReading">NEW Submeter Reading (KWh)</label>
                <div class="submeter-input-wrapper">
                    <span>📊</span>
                    <input type="number" id="submeter_newReading" value="10529" step="any" inputmode="decimal">
                </div>
            </div>

            <div class="submeter-result-box">
                <div class="submeter-result-row">
                    <span>Cost Per Unit:</span>
                    <span class="value" id="submeter_costPerUnitDisplay">₹ 0.00</span>
                </div>
                <div class="submeter-result-row">
                    <span>Submeter Units Consumed:</span>
                    <span class="value" id="submeter_subUnitsDisplay">0 KWh</span>
                </div>
                <div class="submeter-result-row total">
                    <span>Amount To Pay:</span>
                    <span class="value" id="submeter_amountToPayDisplay">₹ 0.00</span>
                </div>
            </div>

            <div class="submeter-footer">
                © ${new Date().getFullYear()} | Built by <span>/\\/ Designz</span>
            </div>
        </div>
        `;
    }

    function loadSavedValues(container) {
        const netBill = localStorage.getItem(STORAGE_KEYS.netBill);
        const totalUnits = localStorage.getItem(STORAGE_KEYS.totalUnits);
        const oldReading = localStorage.getItem(STORAGE_KEYS.oldReading);
        const newReading = localStorage.getItem(STORAGE_KEYS.newReading);

        if (netBill !== null) container.querySelector('#submeter_netBill').value = netBill;
        if (totalUnits !== null) container.querySelector('#submeter_totalUnits').value = totalUnits;
        if (oldReading !== null) container.querySelector('#submeter_oldReading').value = oldReading;
        if (newReading !== null) container.querySelector('#submeter_newReading').value = newReading;
    }

    function calculate(container) {
        const netBillInput = container.querySelector('#submeter_netBill');
        const totalUnitsInput = container.querySelector('#submeter_totalUnits');
        const oldReadingInput = container.querySelector('#submeter_oldReading');
        const newReadingInput = container.querySelector('#submeter_newReading');

        const netBill = parseFloat(netBillInput.value) || 0;
        const totalUnits = parseFloat(totalUnitsInput.value) || 0;
        const oldReading = parseFloat(oldReadingInput.value) || 0;
        const newReading = parseFloat(newReadingInput.value) || 0;

        localStorage.setItem(STORAGE_KEYS.netBill, netBillInput.value);
        localStorage.setItem(STORAGE_KEYS.totalUnits, totalUnitsInput.value);
        localStorage.setItem(STORAGE_KEYS.oldReading, oldReadingInput.value);
        localStorage.setItem(STORAGE_KEYS.newReading, newReadingInput.value);

        const rawCostPerUnit = totalUnits > 0 ? (netBill / totalUnits) : 0;
        const costPerUnit = Math.round(rawCostPerUnit * 100) / 100;

        const subUnits = newReading - oldReading;
        const amountToPay = subUnits * costPerUnit;

        container.querySelector('#submeter_costPerUnitDisplay').textContent = "₹ " + costPerUnit.toFixed(2);

        if (subUnits >= 0) {
            container.querySelector('#submeter_subUnitsDisplay').textContent = subUnits.toFixed(2) + " KWh";
            container.querySelector('#submeter_amountToPayDisplay').textContent = "₹ " + (amountToPay >= 0 ? amountToPay.toFixed(2) : "0.00");
        } else {
            container.querySelector('#submeter_subUnitsDisplay').textContent = "Invalid (New < Old)";
            container.querySelector('#submeter_amountToPayDisplay').textContent = "₹ 0.00";
        }
    }

    return {
        id: 'submeter-calc',
        name: 'Submeter Calc',
        icon: '⚡',
        render: function (targetElement) {
            targetElement.innerHTML = getTemplate();
            loadSavedValues(targetElement);

            const inputs = targetElement.querySelectorAll('input');
            inputs.forEach(input => {
                input.addEventListener('input', () => calculate(targetElement));
            });

            calculate(targetElement);
        }
    };
})();
