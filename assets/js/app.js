import { initUnitConverter } from './modules/unit/unit.js';
import { initCbmCalculator } from './modules/cbm/cbm.js';
import { initCurrencyCalculator } from './modules/currency/currency.js';
import { initEmiCalculator } from './modules/emi/emi.js';
import { initSubmeterCalculator } from './modules/submeter/submeter.js';

const tabs = [
    { id: 'unit', name: 'Unit Converter', desc: 'Convert lengths, weights, and dimensions', icon: 'scale', init: initUnitConverter },
    { id: 'cbm', name: 'Volume & CBM', desc: 'Calculate shipping volume & cargo weight', icon: 'box', init: initCbmCalculator },
    { id: 'currency', name: 'Currency Exchange', desc: 'Live exchange conversion with swap toggle', icon: 'coins', init: initCurrencyCalculator },
    { id: 'emi', name: 'Loan EMI Calc', desc: 'Amortization, principal & interest breakdown', icon: 'landmark', init: initEmiCalculator },
    { id: 'submeter', name: 'Electric Submeter', desc: 'Calculate submeter units & split bill amount', icon: 'zap', init: initSubmeterCalculator }
];

// ... rest of app.js stays unchanged ...

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
