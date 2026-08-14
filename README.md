# asg_smartcalc-pro
# ASG SmartCalc Pro v1.2.2 🧮✨

![Project Version](https://img.shields.io/badge/version-1.2.2%20Pro-purple?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**ASG SmartCalc Pro** is a modern, all-in-one web calculator suite built for lightning-fast unit conversions, real-time currency exchange, and comprehensive loan amortization planning. Designed with a sleek, responsive glassmorphism UI, it features seamless Light/Dark mode switching and secure POS-style receipt sharing and printing.

---

## 🚀 Key Features

* **⚡ Module Selector Dashboard:** Quick-access overview cards to easily jump into any calculator.
* **📏 Unit Converter:** Convert across multiple categories including Length, Weight/Mass, Area, Volume, Temperature, Speed, Digital Storage, Time, Pressure, and Power with real-time formula breakdowns.
* **💱 Currency Exchange:** Real-time foreign exchange calculations complete with live flags, instant conversion updates, and a quick-swap layout.
* **🏠 Loan EMI Calculator:** Calculate accurate repayment schedules for Home Loans, Car Loans, and Personal Loans across multiple payment frequencies (Monthly, Bi-Weekly, Weekly) and currencies ($USD, €EUR, £GBP, ₹INR, CAD, AUD).
* **📄 POS Receipt Generation & Sharing:** Generate transaction summaries that can be printed natively or shared instantly as an image blob using the Web Share API (with automated fallback download).
* **📊 Amortization Schedules:** View, print, and export detailed period-by-period breakdown tables to PDF via `html2canvas` and `jsPDF`.
* **💻 Dynamic Theme Engine:** System, Light, and Dark mode preferences saved locally.

---

## 🛠️ Built With

* **HTML5 & CSS3** (Semantic markup & layout styling)
* **[Tailwind CSS](https://tailwindcss.com/)** (Utility-first styling framework with custom dark-mode support)
* **[Lucide Icons](https://lucide.dev/)** (Modern icon library)
* **[Chart.js](https://www.chartjs.org/)** (Data visualization support)
* **[html2canvas](https://html2canvas.hertzen.com/)** & **[jsPDF](https://github.com/parallax/jsPDF)** (Exporting tables and receipt visual canvases to PDF/PNG)
* **Vanilla JavaScript (ES Modules)** (Modular architecture separating state and UI logic)

---

## 📁 Project Structure

```text
asg-smartcalc-pro/
├── index.html               # Main application entry point
├── README.md                # Project documentation
└── assets/
    └── js/
        ├── app.js           # Core layout control, routing, and theme switcher
        └── modules/
            ├── unit/        # Unit conversion logic & configurations
            ├── currency/    # Currency exchange handlers
            └── emi/         # Loan EMI calculations & amortization tables
