import { initUnitConverter } from './modules/unit/unit.js';
import { initCurrencyCalculator } from './modules/currency/currency.js';
import { initEmiCalculator } from './modules/emi/emi.js';
import { initInvestmentCalculator } from './modules/investment/investment.js';
import { initTaxCalculator } from './modules/tax/tax.js';
import { initTipCalculator } from './modules/tip/tip.js';

const tabs = [
    { id: 'dashboard', name: 'Module Selector', desc: 'Select a tool to begin', icon: 'layout-grid', init: () => {} },
    { id: 'unit', name: 'Unit Converter', desc: 'Convert lengths, weights, and dimensions', icon: 'scale', init: initUnitConverter },
    { id: 'currency', name: 'Currency Exchange', desc: 'Live exchange conversion with swap toggle', icon: 'coins', init: initCurrencyCalculator },
    { id: 'emi', name: 'Loan EMI Calc', desc: 'Amortization, principal & interest breakdown', icon: 'landmark', init: initEmiCalculator },
    { id: 'investment', name: 'Investment & SIP', desc: 'Compound interest, SIP projections, and returns', icon: 'trending-up', init: initInvestmentCalculator },
    { id: 'tax', name: 'Tax Calculator', desc: 'GST, HST, and combined sales tax breakdown', icon: 'receipt', init: initTaxCalculator },
    { id: 'tip', name: 'Tip & Split Bill', desc: 'Calculate tips and divide bills easily', icon: 'users', init: initTipCalculator },
];

function initApp() {
    const footerYear = document.getElementById('footerYear');
    if (footerYear) footerYear.textContent = new Date().getFullYear();
    
    populateNavigation();
    
    tabs.forEach(tab => {
        if (typeof tab.init === 'function') tab.init();
    });

    switchTab('dashboard');
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
    initThemeSwitcher();
}

function populateNavigation() {
    const sidebar = document.getElementById('desktopSidebar');
    const mobileSelect = document.getElementById('mobileTabSelect');
    
    if (sidebar) sidebar.innerHTML = '';
    if (mobileSelect) mobileSelect.innerHTML = '';

    tabs.forEach(t => {
        if (sidebar) {
            const btn = document.createElement('button');
            btn.id = `nav-${t.id}`;
            btn.onclick = () => switchTab(t.id);
            btn.className = `w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 text-left`;
            btn.innerHTML = `<i data-lucide="${t.icon}" class="w-4 h-4"></i><span>${t.name}</span>`;
            sidebar.appendChild(btn);
        }

        if (mobileSelect) {
            const opt = document.createElement('option');
            opt.value = t.id;
            opt.textContent = t.name;
            mobileSelect.appendChild(opt);
        }
    });

    if (mobileSelect) {
        mobileSelect.addEventListener('change', (e) => switchTab(e.target.value));
    }
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

window.shareCalculation = async function(type) {
    const sectionId = type === 'emi' ? 'print-section' : `print-section-${type}`;
    const element = document.getElementById(sectionId);

    if (!element) {
        console.error("Receipt section not found for type:", type);
        return;
    }

    try {
        const canvas = await html2canvas(element, {
            backgroundColor: document.documentElement.classList.contains('dark') ? '#0f172a' : '#ffffff',
            scale: 2,
            useCORS: true
        });

        canvas.toBlob(async (blob) => {
            const file = new File([blob], `asg-smartcalc-${type}-receipt.png`, { type: 'image/png' });
            
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'ASG SmartCalc Pro Receipt',
                        text: 'Here is my calculation receipt.',
                        files: [file]
                    });
                } catch (err) {
                    if (err.name !== 'AbortError') console.error(err);
                }
            } else {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `asg-smartcalc-${type}-receipt.png`;
                link.click();
            }
        });
    } catch (error) {
        console.error("Error generating receipt image:", error);
    }
};

window.addEventListener('DOMContentLoaded', initApp);
