# 🪙 KoinX — Tax Loss Harvesting Dashboard

A responsive, interactive **Tax Loss Harvesting** dashboard built with **React + Vite + Tailwind CSS v4**. It allows users to visualize their crypto capital gains and simulate how selling specific assets impacts their overall tax liability — with real-time updates and a dark/light theme toggle.

---


---

## ✨ Features

- **Pre Harvesting Card** — Displays static short-term and long-term profits, losses, and net capital gains
- **After Harvesting Card** — Dynamically updates when assets are selected in the holdings table
- **Dynamic Savings Alert** — Shows 🎉 *"You are going to save upto $X"* when tax savings are detected
- **Holdings Table** — Sortable by Short-term and Long-term columns (asc/desc)
- **Checkbox Selection** — Select/deselect assets to simulate harvesting losses or profits
- **View All / Show Less** — Shows 4 rows by default, expandable to all 8 assets
- **Dark / Light Theme Toggle** — Persists preference via `localStorage`
- **How it works? Tooltip** — Click-to-open info panel with click-outside dismiss
- **Important Notes & Disclaimers** — Animated collapsible section
- **Fully Responsive** — Works on mobile, tablet, and desktop
- **Custom KoinX Favicon** — Tab icon uses the KoinX brand logo

---

## 🚀 Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Abhista-111005/KOINX.git

# 2. Navigate into the project folder
cd KOINX/KoinX

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173/**

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

---

## 📁 Folder Structure

```
KoinX/
├── public/
│   ├── favicon.png              # KoinX brand favicon
│   ├── screenshot-dark.png      # Dark mode screenshot
│   └── screenshot-light.png     # Light mode screenshot
├── src/
│   ├── assets/
│   │   └── Screenshot...png     # Original logo asset
│   ├── components/
│   │   ├── AfterHarvestingCard.jsx   # Dynamic blue summary card
│   │   ├── DisclaimerSection.jsx     # Collapsible disclaimers
│   │   ├── HoldingsTable.jsx         # Sortable holdings table
│   │   ├── PreHarvestingCard.jsx     # Static summary card
│   │   ├── ThemeToggle.jsx           # Sun/moon theme toggle button
│   │   └── TooltipHowItWorks.jsx    # "How it works?" tooltip
│   ├── context/
│   │   └── ThemeContext.jsx          # Theme state + localStorage
│   ├── data/
│   │   └── mockData.js               # Mock JSON holdings + pre-harvest data
│   ├── App.jsx                       # Root component + state orchestration
│   ├── App.css                       # App-level styles
│   ├── index.css                     # Tailwind v4 + dark/light theme CSS
│   └── main.jsx                      # React DOM entry point
├── index.html                        # HTML template + meta tags + Google Fonts
├── vite.config.js                    # Vite + Tailwind v4 plugin config
├── package.json
└── README.md
```

---

## 🧠 Core Logic

### State Management
- `selectedIds` — A `Set` in `App.jsx` tracks which asset IDs are checked
- `afterHarvestingData` — Derived via `useMemo`, recomputes on every checkbox change
- Theme state is managed via React Context (`ThemeContext`) and applied as `data-theme` on `<html>`

### Harvesting Calculation
When an asset is selected:
- **Loss asset** (`shortTerm < 0`): Its value is **added to Losses** → Net Capital Gains decreases
- **Profit asset** (`shortTerm > 0`): Its value is **added to Profits** → Net Capital Gains increases
- Same logic applied independently for Long-term values
- **Effective Capital Gains** = Short-term Net + Long-term Net
- **Savings** = Pre-harvesting effective gains − After-harvesting effective gains (shown only when positive)

---

## ⚙️ Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Vite | 8 | Build tool + dev server |
| Tailwind CSS | 4 | Utility-first styling |
| @tailwindcss/vite | 4 | Tailwind v4 Vite plugin |
| Inter (Google Fonts) | — | Typography |

---

## 📝 Assumptions

1. **Tax rates are not applied** — The dashboard shows raw capital gain/loss values without applying any tax rate percentages. In a production scenario, short-term and long-term rates would differ by country.

2. **Mock data is static** — All asset holdings, prices, and gain/loss values are hardcoded in `src/data/mockData.js`. No live API integration is implemented.

3. **Short-term and Long-term are independent** — Selecting an asset updates both its short-term and long-term values simultaneously in the After Harvesting card.

4. **No partial harvesting** — When an asset is checked, its full short-term and long-term gain/loss values are applied. The "Amount to Sell" column is informational only.

5. **Savings alert threshold** — The 🎉 savings banner appears only when `afterEffectiveGains < preEffectiveGains` (i.e., savings are strictly positive).

6. **Theme defaults to dark** — If no `localStorage` preference is found, the app launches in dark mode.

7. **Realised Capital Gains** in the Pre Harvesting card is static (`$1,337`) for display purposes. In a real app this would be fetched from a backend.

---

## 📄 License

This project was built as part of a KoinX frontend assignment. All data shown is mock/illustrative.
