/**
 * ASG SmartCalc Pro v1.2.2 - Main Application Script
 */

import { initUnitConverter } from '../unit/unit.js';
import { initCurrencyConverter } from '../currency/currency.js';
import { initEmiCalculator } from '../emi/emi.js';
import { initInvestmentCalculator } from '../investment/investment.js';
import { initTaxCalculator } from '../tax/tax.js';
import { initTipCalculator } from '../tip/tip.js';
import { initHealthCalculator } from '../healthfit/healthfit.js';

// Global Tab Configuration
const TABS = [
    { id: 'dashboard', title: 'Utility Deck', desc: 'Select any calculator or converter below to begin.', icon: 'layout-dashboard' },
    { id: 'unit', title: 'Unit Converter', desc: 'Convert length, weight, area, volume, speed, temperature & more.', icon: 'arrow-left-right' },
    { id: 'currency', title: 'Currency Exchange', desc: 'Convert foreign currencies with quick rate comparisons.', icon: 'banknote' },
    { id: 'emi', title: 'Loan EMI Calc', desc: 'Estimate monthly EMI repayments and total interest payable.', icon: 'landmark' },
    { id: 'investment', title: 'Investment & SIP', desc: 'Compound interest, SIP projections, and returns.', icon: 'trending-up' },
    { id: 'tax', title: 'Tax Calculator', desc: 'GST, HST, and combined sales tax breakdown.', icon: 'receipt' },
    { id: 'tip', title: 'Tip & Split Bill', desc: 'Calculate tips and divide bills easily.', icon: 'users' },
    { id: 'health', title: 'Health Fitness Calc', desc: 'BMI, body fat, TDEE, and daily calorie metrics.', icon: 'activity' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Set Footer Year
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Initialize Navigation & Theme Handlers
    initNavigation();
    initThemeHandlers();

    // Initialize Sub-modules
    try { initUnitConverter(); } catch (e) { console.error('Unit module error:', e); }
    try { initCurrencyConverter(); } catch (e) { console.error('Currency module error:', e); }
    try { initEmiCalculator(); } catch (e) { console.error('EMI module error:', e); }
    try { initInvestmentCalculator(); } catch (e) { console.error('Investment module error:', e); }
    try { initTaxCalculator(); } catch (e) { console.error('Tax module error:', e); }
    try { initTipCalculator(); } catch (e) { console.error('Tip module error:', e); }
    try { initHealthCalculator(); } catch (e) { console.error('Health module error:', e); }

    // Render Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Navigation Switcher Logic
window.switchTab = function(tabId) {
    const panels = document.querySelectorAll('.calc-panel');
    panels.forEach(panel => {
        panel.classList.add('hidden');
    });

    const activePanel = document.getElementById(`panel-${tabId}`);
    if (activePanel) {
        activePanel.classList.remove('hidden');
    }

    const tabMeta = TABS.find(t => t.id === tabId);
    if (tabMeta) {
        const titleEl = document.getElementById('currentTabTitle');
        const descEl = document.getElementById('currentTabDesc');
        if (titleEl) titleEl.textContent = tabMeta.title;
        if (descEl) descEl.textContent = tabMeta.desc;
    }

    // Update Desktop Sidebar Active Styles
    document.querySelectorAll('.sidebar-nav-item').forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.className = 'sidebar-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all bg-purple-600 text-white shadow-md shadow-purple-500/20';
        } else {
            btn.className = 'sidebar-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60';
        }
    });

    const mobileSelect = document.getElementById('mobileTabSelect');
    if (mobileSelect) mobileSelect.value = tabId;

    // Refresh icons inside newly visible panel
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};

function initNavigation() {
    const desktopNav = document.getElementById('desktopSidebar');
    const mobileSelect = document.getElementById('mobileTabSelect');

    if (desktopNav) {
        desktopNav.innerHTML = '';
        TABS.forEach(tab => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.dataset.tab = tab.id;
            btn.className = tab.id === 'dashboard' 
                ? 'sidebar-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-bold text-xs transition-all bg-purple-600 text-white shadow-md shadow-purple-500/20'
                : 'sidebar-nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition-all text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60';
            
            btn.innerHTML = `<i data-lucide="${tab.icon}" class="w-4 h-4 shrink-0"></i><span>${tab.title}</span>`;
            btn.onclick = () => window.switchTab(tab.id);
            desktopNav.appendChild(btn);
        });
    }

    if (mobileSelect) {
        mobileSelect.innerHTML = '';
        TABS.forEach(tab => {
            const opt = document.createElement('option');
            opt.value = tab.id;
            opt.textContent = tab.title;
            mobileSelect.appendChild(opt);
        });
        mobileSelect.onchange = (e) => window.switchTab(e.target.value);
    }
}

function initThemeHandlers() {
    const currentTheme = localStorage.getItem('asg_theme') || 'system';
    
    const themeSelectDesktop = document.getElementById('themeSelectDesktop');
    const themeSelectMobile = document.getElementById('themeSelectMobile');

    if (themeSelectDesktop) themeSelectDesktop.value = currentTheme;
    if (themeSelectMobile) themeSelectMobile.value = currentTheme;

    const applyTheme = (val) => {
        localStorage.setItem('asg_theme', val);
        if (val === 'dark' || (val === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        if (themeSelectDesktop) themeSelectDesktop.value = val;
        if (themeSelectMobile) themeSelectMobile.value = val;
    };

    if (themeSelectDesktop) themeSelectDesktop.onchange = (e) => applyTheme(e.target.value);
    if (themeSelectMobile) themeSelectMobile.onchange = (e) => applyTheme(e.target.value);
}

// Universal Share Receipt Helper
window.shareCalculation = function(type) {
    const text = `Check out my calculation result on ASG SmartCalc Pro v1.2.2!`;
    if (navigator.share) {
        navigator.share({ title: 'ASG SmartCalc Pro Receipt', text: text, url: window.location.href }).catch(() => {});
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Calculation link/receipt copied to clipboard!');
    }
};
