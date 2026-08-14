export function initHealthCalculator() {
    const container = document.getElementById('panel-health');
    if (!container) return;

    // Render module UI if not already populated
    if (!container.innerHTML.trim()) {
        container.innerHTML = `
            <div class="max-w-4xl mx-auto space-y-6">
                <!-- Input Card -->
                <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-purple-500/5">
                    <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                        <i data-lucide="activity" class="w-5 h-5 text-purple-600"></i>
                        Body Metrics & Calorie Calculator
                    </h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Gender</label>
                            <select id="health-gender" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Age (years)</label>
                            <input type="number" id="health-age" value="25" min="10" max="120" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Weight (kg)</label>
                            <input type="number" id="health-weight" value="70" min="20" max="300" step="0.1" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600">
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Height (cm)</label>
                            <input type="number" id="health-height" value="175" min="50" max="250" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600">
                        </div>
                        <div class="md:col-span-2">
                            <label class="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Activity Level</label>
                            <select id="health-activity" class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600">
                                <option value="1.2">Sedentary (little or no exercise)</option>
                                <option value="1.375">Lightly active (light exercise/sports 1-3 days/week)</option>
                                <option value="1.55" selected>Moderately active (moderate exercise/sports 3-5 days/week)</option>
                                <option value="1.725">Very active (hard exercise/sports 6-7 days a week)</option>
                                <option value="1.9">Extra active (very hard exercise/physical job)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Results Section -->
                <div id="print-section-health" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl shadow-purple-500/5 space-y-6">
                    <h3 class="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                        <span>Health Metrics Summary</span>
                        <button onclick="shareCalculation('health')" class="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-purple-600/30">
                            <i data-lucide="share-2" class="w-4 h-4"></i>Share Receipt
                        </button>
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 text-center">
                            <span class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">BMI</span>
                            <span id="res-bmi" class="text-2xl font-black text-purple-600 dark:text-purple-400">0.0</span>
                            <span id="res-bmi-category" class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">-</span>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 text-center">
                            <span class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">BMR (Calories)</span>
                            <span id="res-bmr" class="text-2xl font-black text-purple-600 dark:text-purple-400">0</span>
                            <span class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">Basal Metabolic Rate</span>
                        </div>
                        <div class="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-2xl p-4 text-center">
                            <span class="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Daily Maintenance</span>
                            <span id="res-tdee" class="text-2xl font-black text-purple-600 dark:text-purple-400">0</span>
                            <span class="block text-xs font-semibold text-slate-600 dark:text-slate-300 mt-1">Calories / Day (TDEE)</span>
                        </div>
                    </div>

                    <div class="space-y-3 pt-2">
                        <h4 class="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Goal Calorie Breakdown</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div class="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-2xl text-center">
                                <span class="block text-xs font-bold text-blue-600 dark:text-blue-400">Weight Loss</span>
                                <span id="res-loss" class="text-lg font-black text-blue-700 dark:text-blue-300">0 kcal</span>
                            </div>
                            <div class="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl text-center">
                                <span class="block text-xs font-bold text-emerald-600 dark:text-emerald-400">Maintain Weight</span>
                                <span id="res-maintain" class="text-lg font-black text-emerald-700 dark:text-emerald-300">0 kcal</span>
                            </div>
                            <div class="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-center">
                                <span class="block text-xs font-bold text-amber-600 dark:text-amber-400">Muscle Gain</span>
                                <span id="res-gain" class="text-lg font-black text-amber-700 dark:text-amber-300">0 kcal</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Attach event listeners
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('input', calculateHealth);
        });

        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }

    calculateHealth();
}

function calculateHealth() {
    const gender = document.getElementById('health-gender')?.value || 'male';
    const age = parseFloat(document.getElementById('health-age')?.value) || 25;
    const weight = parseFloat(document.getElementById('health-weight')?.value) || 70;
    const height = parseFloat(document.getElementById('health-height')?.value) || 175;
    const activity = parseFloat(document.getElementById('health-activity')?.value) || 1.2;

    // BMI calculation
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    let bmiCategory = 'Normal weight';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
    else if (bmi >= 30) bmiCategory = 'Obese';

    // BMR calculation (Mifflin-St Jeor Equation)
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += gender === 'male' ? 5 : -161;

    // TDEE calculation
    const tdee = Math.round(bmr * activity);

    // Update UI elements
    const bmiEl = document.getElementById('res-bmi');
    const bmiCatEl = document.getElementById('res-bmi-category');
    const bmrEl = document.getElementById('res-bmr');
    const tdeeEl = document.getElementById('res-tdee');
    const lossEl = document.getElementById('res-loss');
    const maintainEl = document.getElementById('res-maintain');
    const gainEl = document.getElementById('res-gain');

    if (bmiEl) bmiEl.textContent = bmi.toFixed(1);
    if (bmiCatEl) bmiCatEl.textContent = bmiCategory;
    if (bmrEl) bmrEl.textContent = Math.round(bmr);
    if (tdeeEl) tdeeEl.textContent = tdee;
    if (lossEl) lossEl.textContent = `${Math.max(1200, tdee - 500)} kcal`;
    if (maintainEl) maintainEl.textContent = `${tdee} kcal`;
    if (gainEl) gainEl.textContent = `${tdee + 500} kcal`;
}
