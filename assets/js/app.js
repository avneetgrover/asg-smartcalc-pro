<!DOCTYPE html>
<html lang="en" class="h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ASG SmartCalc Pro v1.2.2</title>
    <script>
        const theme = localStorage.getItem('asg_theme') || 'system';
        if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    </script>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237c3aed' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect width='16' height='20' x='4' y='2' rx='2'/><line x1='8' x2='16' y1='6' y2='6'/><line x1='16' x2='16' y1='14' y2='18'/><path d='M16 10h.01'/><path d='M12 10h.01'/><path d='M8 10h.01'/><path d='M12 14h.01'/><path d='M8 14h.01'/><path d='M12 18h.01'/><path d='M8 18h.01'/></svg>">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class'
        }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
</head>
<body class="h-full text-slate-800 dark:text-slate-200 flex flex-col md:flex-row antialiased font-sans p-2 md:p-6 gap-4 overflow-hidden">

    <div class="w-full h-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden">
        
        <!-- MOBILE TOP NAV -->
        <div class="md:hidden flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div class="flex items-center gap-2">
                <div class="p-2 bg-gradient-to-tr from-violet-600 to-indigo-500 text-white rounded-xl shadow-md">
                    <i data-lucide="calculator" class="w-5 h-5"></i>
                </div>
                <div>
                    <span class="font-bold text-base tracking-wide text-slate-900 dark:text-white block">ASG SmartCalc</span>
                    <span class="text-[10px] text-purple-600 dark:text-purple-400 font-semibold tracking-tight block -mt-1">All in one calculator</span>
                </div>
            </div>
            
            <div class="flex items-center gap-2">
                <select id="mobileTabSelect" class="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-500">
                </select>
                <select id="themeSelectMobile" class="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl px-2.5 py-1.5 outline-none shadow-sm focus:ring-2 focus:ring-purple-500">
                    <option value="system">💻 System</option>
                    <option value="light">☀️ Light</option>
                    <option value="dark">🌙 Dark</option>
                </select>
            </div>
        </div>

        <!-- DESKTOP SIDEBAR -->
        <aside class="hidden md:flex flex-col w-72 bg-slate-50/80 dark:bg-slate-900/60 border-r border-slate-200/80 dark:border-slate-800 shrink-0">
            <div class="p-6 flex items-center gap-3">
                <div class="p-3 bg-gradient-to-tr from-violet-600 to-indigo-500 text-white rounded-2xl shadow-lg shadow-indigo-500/30">
                    <i data-lucide="calculator" class="w-6 h-6"></i>
                </div>
                <div>
                    <h1 class="font-extrabold tracking-tight text-slate-900 dark:text-white text-lg leading-tight">ASG SmartCalc</h1>
                    <p class="text-xs font-bold text-purple-600 dark:text-purple-400">All in one calculator</p>
                </div>
            </div>

            <nav id="desktopSidebar" class="flex-1 overflow-y-auto px-4 py-2 space-y-1.5">
            </nav>

            <div class="px-4 pb-3">
                <label class="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Theme</label>
                <select id="themeSelectDesktop" class="w-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 outline-none focus:ring-2 focus:ring-purple-500 transition">
                    <option value="system">💻 System</option>
                    <option value="light">☀️ Light</option>
                    <option value="dark">🌙 Dark</option>
                </select>
            </div>

            <div class="p-5 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500 flex justify-between items-center font-medium">
                <span class="font-mono bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full font-bold">v1.2.2 Pro</span>
                <i data-lucide="shield-check" class="w-5 h-5 text-emerald-500"></i>
            </div>
        </aside>

        <!-- MAIN CONTENT AREA -->
        <main class="flex-1 h-full overflow-hidden p-4 md:p-6 bg-slate-50/40 dark:bg-slate-900/40 flex flex-col justify-between">
            <div class="max-w-5xl w-full h-full mx-auto flex flex-col overflow-hidden space-y-4">
                
                <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 shrink-0">
                    <div>
                        <h2 id="currentTabTitle" class="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Utility Deck</h2>
                        <p id="currentTabDesc" class="text-[11px] md:text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Select a tool to begin.</p>
                    </div>
                </div>

                <div id="calculatorPanels" class="flex-1 overflow-y-auto pr-1">
                    
                    <!-- DASHBOARD / UTILITY DECK PANEL -->
                    <div id="panel-dashboard" class="calc-panel space-y-6">
                        <div class="text-center py-4">
                            <h3 class="text-xl md:text-2xl font-black text-slate-900 dark:text-white">Utility Deck</h3>
                            <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">Select any calculator or converter below to begin.</p>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            <!-- Unit Converter Card -->
                            <button onclick="switchTab('unit')" class="p-6 bg-white dark:bg-slate-800/80 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl text-left transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group">
                                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <i data-lucide="arrow-left-right" class="w-6 h-6"></i>
                                </div>
                                <h4 class="font-bold text-slate-900 dark:text-white text-base">Unit Converter</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Convert length, weight, area, volume, speed, temperature & more.</p>
                            </button>

                            <!-- Currency Exchange Card -->
                            <button onclick="switchTab('currency')" class="p-6 bg-white dark:bg-slate-800/80 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl text-left transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group">
                                <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <i data-lucide="banknote" class="w-6 h-6"></i>
                                </div>
                                <h4 class="font-bold text-slate-900 dark:text-white text-base">Currency Exchange</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Convert foreign currencies with quick rate comparisons.</p>
                            </button>

                            <!-- Loan EMI Card -->
                            <button onclick="switchTab('emi')" class="p-6 bg-white dark:bg-slate-800/80 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl text-left transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group">
                                <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <i data-lucide="landmark" class="w-6 h-6"></i>
                                </div>
                                <h4 class="font-bold text-slate-900 dark:text-white text-base">Loan EMI Calc</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Estimate monthly EMI repayments and total interest payable.</p>
                            </button>

                            <!-- Investment & SIP Card -->
                            <button onclick="switchTab('investment')" class="p-6 bg-white dark:bg-slate-800/80 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl text-left transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group">
                                <div class="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <i data-lucide="trending-up" class="w-6 h-6"></i>
                                </div>
                                <h4 class="font-bold text-slate-900 dark:text-white text-base">Investment & SIP</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Compound interest, SIP projections, and returns.</p>
                            </button>

                            <!-- Tax Calculator Card -->
                            <button onclick="switchTab('tax')" class="p-6 bg-white dark:bg-slate-800/80 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl text-left transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group">
                                <div class="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <i data-lucide="receipt" class="w-6 h-6"></i>
                                </div>
                                <h4 class="font-bold text-slate-900 dark:text-white text-base">Tax Calculator</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">GST, HST, and combined sales tax breakdown.</p>
                            </button>

                            <!-- Tip & Split Bill Card -->
                            <button onclick="switchTab('tip')" class="p-6 bg-white dark:bg-slate-800/80 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl text-left transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group">
                                <div class="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <i data-lucide="users" class="w-6 h-6"></i>
                                </div>
                                <h4 class="font-bold text-slate-900 dark:text-white text-base">Tip & Split Bill</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">Calculate tips and divide bills easily.</p>
                            </button>

                            <!-- Health & Fitness Calc Card -->
                            <button onclick="switchTab('health')" class="p-6 bg-white dark:bg-slate-800/80 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 border border-slate-200/80 dark:border-slate-700/80 rounded-3xl text-left transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 group">
                                <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <i data-lucide="activity" class="w-6 h-6"></i>
                                </div>
                                <h4 class="font-bold text-slate-900 dark:text-white text-base">Health Fitness Calc</h4>
                                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">BMI, body fat, TDEE, and daily calorie metrics.</p>
                            </button>
                        </div>
                    </div>

                    <!-- UNIT CONVERTER PANEL -->
                    <div id="panel-unit" class="calc-panel hidden">
                        <div class="grid md:grid-cols-12 gap-6 items-start">
                            <div class="md:col-span-7 bg-white dark:bg-slate-800/80 p-5 md:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                                <div>
                                    <label class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Category</label>
                                    <select id="unitCategory" class="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-slate-900 dark:text-slate-100 font-semibold outline-none focus:ring-2 focus:ring-purple-500 transition text-xs">
                                        <option value="length">Length</option>
                                        <option value="weight">Weight / Mass</option>
                                        <option value="area">Area</option>
                                        <option value="volume">Volume / Capacity</option>
                                        <option value="temperature">Temperature</option>
                                        <option value="speed">Speed</option>
                                        <option value="storage">Digital Storage</option>
                                        <option value="time">Time</option>
                                        <option value="pressure">Pressure</option>
                                        <option value="power">Power</option>
                                    </select>
                                </div>

                                <div class="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center">
                                    <div class="sm:col-span-5 space-y-1.5">
                                        <input type="number" id="unitFromVal" value="1" class="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-lg text-slate-900 dark:text-slate-100 font-bold font-mono outline-none focus:ring-2 focus:ring-purple-500 transition">
                                        <select id="unitFromSelect" class="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-semibold outline-none focus:ring-2 focus:ring-purple-500 transition">
                                        </select>
                                    </div>

                                    <div class="sm:col-span-1 flex justify-center py-1 sm:py-0">
                                        <button type="button" id="unitSwapBtn" class="w-9 h-9 flex items-center justify-center bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-600 text-purple-700 dark:text-purple-300 hover:text-white rounded-2xl transition-all duration-300 active:scale-90 shadow-sm group">
                                            <i data-lucide="arrow-left-right" class="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"></i>
                                        </button>
                                    </div>

                                    <div class="sm:col-span-5 space-y-1.5">
                                        <input type="number" id="unitToVal" value="1" class="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-2.5 text-lg text-slate-900 dark:text-slate-100 font-bold font-mono outline-none focus:ring-2 focus:ring-purple-500 transition">
                                        <select id="unitToSelect" class="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 font-semibold outline-none focus:ring-2 focus:ring-purple-500 transition">
                                        </select>
                                    </div>
                                </div>

                                <div class="bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 rounded-2xl p-2.5 text-center">
                                    <span class="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider block mb-0.5">Active Formula</span>
                                    <div id="unitFormula" class="text-xs font-semibold text-slate-700 dark:text-slate-300 font-mono">1 Meter = 3.28084 Feet</div>
                                </div>
                            </div>

                            <div id="print-section-unit" class="md:col-span-5 bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                                <div>
                                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Unit Conversion Receipt</p>
                                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-unit"></p>
                                    </div>

                                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Conversion Breakdown</div>
                                    <div id="unitResults" class="text-xs font-semibold space-y-2 text-slate-800 dark:text-slate-200 mb-4"></div>
                                </div>

                                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans">
                                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5">
                                        Print Receipt
                                    </button>
                                    <button type="button" onclick="shareCalculation('unit')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5">
                                        Share Receipt
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- CURRENCY EXCHANGE PANEL -->
                    <div id="panel-currency" class="calc-panel hidden">
                        <div class="grid md:grid-cols-12 gap-6 items-start">
                            <div class="md:col-span-7 bg-white dark:bg-slate-800/80 p-5 md:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                                <div>
                                    <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Amount</label>
                                    <input type="number" id="currAmt" value="1" class="w-full bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 text-slate-900 dark:text-slate-100 font-bold mt-1 outline-none focus:ring-2 focus:ring-purple-500 text-sm">
                                </div>
                                <div class="flex items-center gap-2">
                                    <div class="flex-1">
                                        <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">From</label>
                                        <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-purple-500">
                                            <img id="currFromFlag" src="https://flagcdn.com/w40/us.png" class="w-6 h-4 rounded object-cover border border-slate-200 shrink-0">
                                            <select id="currFrom" class="w-full bg-transparent text-slate-900 dark:text-slate-100 font-semibold outline-none py-1 text-xs"></select>
                                        </div>
                                    </div>
                                    <div class="pt-5 shrink-0">
                                        <button type="button" id="currSwapBtn" class="w-9 h-9 flex items-center justify-center bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-600 text-purple-700 dark:text-purple-300 hover:text-white rounded-2xl transition-all duration-300 active:scale-90 shadow-sm group">
                                            <i data-lucide="arrow-left-right" class="w-4 h-4 transition-transform duration-300 group-hover:rotate-180"></i>
                                        </button>
                                    </div>
                                    <div class="flex-1">
                                        <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1 block">To</label>
                                        <div class="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-purple-500">
                                            <img id="currToFlag" src="https://flagcdn.com/w40/in.png" class="w-6 h-4 rounded object-cover border border-slate-200 shrink-0">
                                            <select id="currTo" class="w-full bg-transparent text-slate-900 dark:text-slate-100 font-semibold outline-none py-1 text-xs"></select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="print-section-currency" class="md:col-span-5 bg-white dark:bg-slate-900 p-5 md:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                                <div>
                                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Foreign Exchange Receipt</p>
                                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date-currency"></p>
                                    </div>

                                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Exchange Breakdown</div>
                                    
                                    <div class="mb-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                                        <span class="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">CONVERTED VALUE</span>
                                        <div id="currOutput" class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">--</div>
                                        <div id="currStatus" class="text-[10px] text-slate-400 mt-0.5">Fetching live rates...</div>
                                    </div>

                                    <div id="currResults" class="text-xs font-semibold space-y-1.5 text-slate-800 dark:text-slate-200 mb-4"></div>
                                </div>

                                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans">
                                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5">
                                        Print Receipt
                                    </button>
                                    <button type="button" onclick="shareCalculation('currency')" class="flex-1 py-2 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5">
                                        Share Receipt
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- LOAN EMI CALCULATOR PANEL -->
                    <div id="panel-emi" class="calc-panel hidden">
                        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                            
                            <!-- Left Column: Inputs & Options -->
                            <div class="lg:col-span-7 bg-white dark:bg-slate-800/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
                                
                                <!-- Currency Selector -->
                                <div>
                                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Currency</label>
                                    <div class="grid grid-cols-6 gap-1 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl text-center">
                                        <button type="button" id="curr-USD" onclick="setEmiCurrency('$')" class="py-1.5 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm">USD ($)</button>
                                        <button type="button" id="curr-EUR" onclick="setEmiCurrency('€')" class="py-1.5 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">EUR (€)</button>
                                        <button type="button" id="curr-GBP" onclick="setEmiCurrency('£')" class="py-1.5 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">GBP (£)</button>
                                        <button type="button" id="curr-INR" onclick="setEmiCurrency('₹')" class="py-1.5 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">INR (₹)</button>
                                        <button type="button" id="curr-CAD" onclick="setEmiCurrency('C$')" class="py-1.5 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">CAD</button>
                                        <button type="button" id="curr-AUD" onclick="setEmiCurrency('A$')" class="py-1.5 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">AUD</button>
                                    </div>
                                </div>

                                <!-- Payment Frequency Selector -->
                                <div>
                                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Payment Frequency</label>
                                    <div class="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl">
                                        <button type="button" id="freq-monthly" onclick="setPaymentFrequency('monthly')" class="py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm">Monthly</button>
                                        <button type="button" id="freq-biweekly" onclick="setPaymentFrequency('biweekly')" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">Bi-Weekly</button>
                                        <button type="button" id="freq-weekly" onclick="setPaymentFrequency('weekly')" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">Weekly</button>
                                    </div>
                                </div>

                                <!-- Loan Category Selector -->
                                <div>
                                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Loan Category</label>
                                    <div class="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-2xl">
                                        <button type="button" id="cat-home" onclick="setLoanCategory('home')" class="py-2 text-xs font-bold rounded-xl transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm">Home Loan</button>
                                        <button type="button" id="cat-car" onclick="setLoanCategory('car')" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">Car Loan</button>
                                        <button type="button" id="cat-other" onclick="setLoanCategory('other')" class="py-2 text-xs font-bold rounded-xl transition-all text-slate-600 dark:text-slate-400">Other Loan</button>
                                    </div>
                                </div>

                                <!-- Input Fields (Defaulted to 0) -->
                                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Loan Amount</label>
                                        <input type="number" id="emiAmount" value="0" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Interest Rate (% p.a.)</label>
                                        <input type="number" step="0.1" id="emiRate" value="0" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    </div>
                                    <div>
                                        <div class="flex justify-between items-center mb-1">
                                            <label id="tenure-label-text" class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">TENURE (YEARS)</label>
                                            <div class="flex bg-slate-100 dark:bg-slate-900/80 p-0.5 rounded-xl">
                                                <button type="button" id="tenure-unit-years" onclick="setTenureUnit('years')" class="px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all bg-white dark:bg-slate-800 text-purple-600 shadow-sm">Yrs</button>
                                                <button type="button" id="tenure-unit-months" onclick="setTenureUnit('months')" class="px-2 py-0.5 text-[10px] font-bold rounded-lg transition-all text-slate-500 dark:text-slate-400">Mos</button>
                                            </div>
                                        </div>
                                        <input type="number" id="emiTenure" value="0" class="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                                    </div>
                                </div>

                                <!-- Action Buttons: Calculate, Reset, and View Schedule Table -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                    <button type="button" onclick="calculateEmi()" class="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-sm">
                                        Calculate EMI
                                    </button>
                                    <button type="button" onclick="resetEmiCalculator()" class="w-full py-2.5 bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all">
                                        Reset to Default
                                    </button>
                                </div>
                                <div class="pt-1">
                                    <button type="button" onclick="toggleScheduleModal()" class="w-full py-2.5 bg-slate-100 dark:bg-slate-900/80 hover:bg-slate-200 text-purple-700 dark:text-purple-300 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all border border-purple-200 dark:border-purple-900/40">
                                        View Schedule Table
                                    </button>
                                </div>
                            </div>

                            <!-- Right Column: Modern POS Receipt Layout -->
                            <div id="print-section" class="lg:col-span-5 bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between font-mono relative overflow-hidden">
                                <div>
                                    <div class="text-center pb-3 mb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                                        <h3 class="text-xs font-bold tracking-widest text-slate-900 dark:text-white uppercase">ASG SMARTCALC PRO</h3>
                                        <p class="text-[10px] tracking-wider text-slate-400 mt-0.5 uppercase">Loan EMI Transaction Receipt</p>
                                        <p class="text-[9px] text-slate-400 mt-0.5" id="receipt-date"></p>
                                    </div>

                                    <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Parameters & Breakdown</div>

                                    <!-- Full Input Parameters Summary -->
                                    <div class="space-y-1.5 mb-3 text-xs bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Category:</span>
                                            <span id="receiptCategory" class="font-bold text-slate-700 dark:text-slate-300">Home Loan</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Frequency:</span>
                                            <span id="receiptFrequency" class="font-bold text-slate-700 dark:text-slate-300">Monthly</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Interest Rate:</span>
                                            <span id="receiptRate" class="font-bold text-slate-700 dark:text-slate-300">0% p.a.</span>
                                        </div>
                                        <div class="flex justify-between">
                                            <span class="text-slate-400">Tenure:</span>
                                            <span id="receiptTenure" class="font-bold text-slate-700 dark:text-slate-300">0 Years</span>
                                        </div>
                                    </div>

                                    <div class="mb-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-2xl text-center border border-slate-100 dark:border-slate-800">
                                        <span id="emiLabelText" class="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">MONTHLY PAYMENT</span>
                                        <div id="emiOutput" class="text-2xl font-black text-purple-600 dark:text-purple-400 mt-0.5">$0</div>
                                    </div>

                                    <div class="space-y-2 border-t border-dashed border-slate-200 dark:border-slate-800 pt-2.5 text-xs">
                                        <div class="flex justify-between font-bold">
                                            <span class="text-slate-400">Principal Loan</span>
                                            <span id="emiPrincipalText" class="text-slate-800 dark:text-white">$0</span>
                                        </div>
                                        <div class="flex justify-between font-bold">
                                            <span class="text-slate-400">Total Interest</span>
                                            <span id="emiInterestText" class="text-purple-600">$0</span>
                                        </div>
                                        <div class="flex justify-between font-bold border-t border-dashed border-slate-200 dark:border-slate-800 pt-2 text-xs">
                                            <span class="text-slate-500">TOTAL PAYABLE</span>
                                            <span id="emiTotalText" class="text-slate-900 dark:text-white">$0</span>
                                        </div>
                                    </div>

                                    <div class="mt-4 pt-2 border-t border-dashed border-slate-200 dark:border-slate-800 text-center">
                                        <p class="text-[9px] text-slate-400 tracking-wider">THANK YOU FOR CALCULATING</p>
                                        <p class="text-[9px] text-purple-600 dark:text-purple-400 font-bold mt-0.5">*** SECURE RECEIPT ***</p>
                                    </div>
                                </div>

                                <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 font-sans">
                                    <button type="button" onclick="window.print()" class="flex-1 py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5">
                                        Print Receipt
                                    </button>
                                    <button type="button" onclick="shareCalculation('emi')" class="flex-1 py-2 px-3 bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 text-purple-600 dark:text-purple-300 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5">
                                        Share Receipt
                                    </button>
                                </div>
                            </div>

                        </div>

                        <!-- Amortization Schedule Table Container -->
                        <div id="schedule-modal" class="hidden mt-4 bg-white dark:bg-slate-800/90 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl">
                            <div class="flex justify-between items-center mb-3">
                                <h3 class="font-bold text-xs text-slate-900 dark:text-white">Amortization & Repayment Schedule</h3>
                                <div class="flex items-center gap-2">
                                    <button onclick="printScheduleTable()" class="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1">
                                        <i data-lucide="printer" class="w-3.5 h-3.5"></i> Print
                                    </button>
                                    <button onclick="downloadSchedulePDF()" class="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[11px] rounded-lg transition-all flex items-center gap-1 shadow-sm">
                                        <i data-lucide="file-text" class="w-3.5 h-3.5"></i> PDF / Canvas
                                    </button>
                                    <button onclick="toggleScheduleModal()" class="text-xs font-bold text-purple-600 hover:underline ml-2">Close</button>
                                </div>
                            </div>
                            <div id="schedule-table-printable" class="max-h-48 overflow-y-auto">
                                <table class="w-full text-left text-xs">
                                    <thead class="bg-slate-50 dark:bg-slate-900 text-slate-400 uppercase">
                                        <tr>
                                            <th class="p-2">Period</th>
                                            <th class="p-2">Principal</th>
                                            <th class="p-2">Interest</th>
                                            <th class="p-2">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody id="schedule-table-body" class="divide-y divide-slate-100 dark:divide-slate-700">
                                        <!-- Dynamic Rows -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- INVESTMENT & SIP CALCULATOR PANEL -->
                    <div id="panel-investment" class="calc-panel hidden">
                        <div id="investment-calculator-container">
                            <!-- Injected dynamically by investment.js -->
                        </div>
                    </div>

                    <!-- TAX CALCULATOR PANEL -->
                    <div id="panel-tax" class="calc-panel hidden">
                        <div id="tax-calculator-container">
                            <!-- Injected dynamically by tax.js -->
                        </div>
                    </div>

                    <!-- TIP & SPLIT BILL CALCULATOR PANEL -->
                    <div id="panel-tip" class="calc-panel hidden">
                        <div id="tip-calculator-container">
                            <!-- Injected dynamically by tip.js -->
                        </div>
                    </div>

                    <!-- HEALTH & FITNESS CALCULATOR PANEL -->
                    <div id="panel-health" class="calc-panel hidden">
                        <!-- Injected dynamically by health.js -->
                    </div>

                </div>

                <footer class="pt-2 text-center text-[11px] text-slate-400 dark:text-slate-500 font-medium shrink-0">
                    ASG SmartCalc Pro &copy;<span id="footerYear"></span>. Built by /\\/ Designz. All-in-one Web Application
                </footer>
            </div>
        </main>
    </div>

    <!-- Additional JavaScript helpers for schedule print/PDF download using jsPDF -->
    <script>
        function printScheduleTable() {
            const printContent = document.getElementById('schedule-table-printable').innerHTML;
            const originalContent = document.body.innerHTML;
            
            document.body.innerHTML = `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 4px;">ASG SmartCalc Pro - Amortization Schedule</h2>
                    <p style="font-size: 12px; color: #666; margin-bottom: 16px;">Generated on: ${new Date().toLocaleString()}</p>
                    ${printContent}
                </div>
            `;
            window.print();
            document.body.innerHTML = originalContent;
            window.location.reload();
        }

        function downloadSchedulePDF() {
            const originalElement = document.getElementById('schedule-table-printable');
            if (typeof html2canvas !== 'undefined' && typeof window.jspdf !== 'undefined') {
                const clone = originalElement.cloneNode(true);
                clone.style.maxHeight = 'none';
                clone.style.height = 'auto';
                clone.style.overflow = 'visible';
                clone.style.position = 'absolute';
                clone.style.left = '-9999px';
                clone.style.top = '0';
                clone.style.width = originalElement.offsetWidth + 'px';
                document.body.appendChild(clone);

                html2canvas(clone, { scale: 2, useCORS: true }).then(canvas => {
                    document.body.removeChild(clone);
                    const imgData = canvas.toDataURL('image/png');
                    const { jsPDF } = window.jspdf;
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    
                    const imgWidth = 190;
                    const pageHeight = 295; 
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    let heightLeft = imgHeight;
                    let position = 10;

                    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;

                    while (heightLeft >= 0) {
                        position = heightLeft - imgHeight;
                        pdf.addPage();
                        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                        heightLeft -= pageHeight;
                    }

                    pdf.save('amortization-schedule.pdf');
                }).catch(err => {
                    if (document.body.contains(clone)) {
                        document.body.removeChild(clone);
                    }
                    console.error(err);
                });
            } else {
                window.print();
            }
        }
    </script>

    <script type="module" src="./assets/js/app.js"></script>
</body>
</html>
