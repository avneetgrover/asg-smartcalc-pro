import { initUnitConverter } from './modules/unit/unit.js';
import { initCurrencyCalculator } from './modules/currency/currency.js';
import { initEmiCalculator } from './modules/emi/emi.js';
import { initSubmeterCalculator } from './modules/submeter/submeter.js';

const tabs = [
    { id: 'dashboard', name: 'Module Selector', desc: 'Select a tool to begin', icon: 'layout-grid', init: () => {} },
    { id: 'unit', name: 'Unit Converter', desc: 'Convert lengths, weights, and dimensions', icon: 'scale', init: initUnitConverter },
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

    switchTab('dashboard');
    lucide.createIcons();
    initThemeSwitcher();
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

window.switchTab = function(tabId) {
    // Hide all panels
    document.querySelectorAll('.calc-panel').forEach(p => p.classList.add('hidden'));

    // Show selected panel
    const targetPanel = document.getElementById(`panel-${tabId}`);
    if (targetPanel) {
        targetPanel.classList.remove('hidden');
    }

    // Update active state on sidebar buttons
    tabs.forEach(t => {
        const btn = document.getElementById(`nav-${t.id}`);
        if (btn) {
            if (t.id === tabId) {
                btn.className = 'w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 text-left bg-purple-600 text-white shadow-lg shadow-purple-600/30';
            } else {
                btn.className = 'w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 text-left text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60';
            }
        }
    });

    // Update mobile dropdown value if it exists
    const mobileSelect = document.getElementById('mobileTabSelect');
    if (mobileSelect) mobileSelect.value = tabId;

    // Update main header titles and run module initialization
    const tabData = tabs.find(t => t.id === tabId);
    if (tabData) {
        const titleEl = document.getElementById('currentTabTitle');
        const descEl = document.getElementById('currentTabDesc');
        if (titleEl) titleEl.textContent = tabData.name;
        if (descEl) descEl.textContent = tabData.desc;

        if (typeof tabData.init === 'function') {
            tabData.init();
        }
    }
};
function initThemeSwitcher() {
    const themeKey = 'asg_theme';
    const selects = [
        document.getElementById('themeSelectDesktop'),
        document.getElementById('themeSelectMobile')
    ].filter(Boolean);

    function applyTheme(theme) {
        const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', isDark);
        selects.forEach(s => s.value = theme);
    }

    const currentTheme = localStorage.getItem(themeKey) || 'system';
    applyTheme(currentTheme);

    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            const selected = e.target.value;
            localStorage.setItem(themeKey, selected);
            applyTheme(selected);
        });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if ((localStorage.getItem(themeKey) || 'system') === 'system') {
            applyTheme('system');
        }
    });
}
window.addEventListener('DOMContentLoaded', initApp);
