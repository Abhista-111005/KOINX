import { useState, useMemo } from "react";
import { preHarvestingData, holdingsData } from "./data/mockData";
import TooltipHowItWorks from "./components/TooltipHowItWorks";
import DisclaimerSection from "./components/DisclaimerSection";
import PreHarvestingCard from "./components/PreHarvestingCard";
import AfterHarvestingCard from "./components/AfterHarvestingCard";
import HoldingsTable from "./components/HoldingsTable";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const [selectedIds, setSelectedIds] = useState(new Set());

  // Toggle a holding selection
  function toggleHolding(asset) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(asset.id)) {
        next.delete(asset.id);
      } else {
        next.add(asset.id);
      }
      return next;
    });
  }

  // Compute After Harvesting data dynamically
  const afterHarvestingData = useMemo(() => {
    // Start from pre-harvesting base values
    let stProfits = preHarvestingData.shortTerm.profits;
    let stLosses = preHarvestingData.shortTerm.losses;
    let ltProfits = preHarvestingData.longTerm.profits;
    let ltLosses = preHarvestingData.longTerm.losses;

    // Apply each selected holding
    for (const id of selectedIds) {
      const asset = holdingsData.find((h) => h.id === id);
      if (!asset) continue;

      // Short-term impact
      if (asset.shortTerm < 0) {
        // Loss → add absolute value to losses (make it more negative)
        stLosses += asset.shortTerm; // shortTerm is already negative
      } else if (asset.shortTerm > 0) {
        // Profit → add to profits
        stProfits += asset.shortTerm;
      }

      // Long-term impact
      if (asset.longTerm < 0) {
        ltLosses += asset.longTerm;
      } else if (asset.longTerm > 0) {
        ltProfits += asset.longTerm;
      }
    }

    const stNet = stProfits + stLosses;
    const ltNet = ltProfits + ltLosses;
    const effectiveCapitalGains = stNet + ltNet;

    return {
      shortTerm: {
        profits: stProfits,
        losses: stLosses,
        netCapitalGains: stNet,
      },
      longTerm: {
        profits: ltProfits,
        losses: ltLosses,
        netCapitalGains: ltNet,
      },
      effectiveCapitalGains,
    };
  }, [selectedIds]);

  // Pre-harvesting effective capital gains
  const preEffective =
    preHarvestingData.shortTerm.netCapitalGains +
    preHarvestingData.longTerm.netCapitalGains;

  // Savings = reduction in capital gains (positive means user saves)
  const savings = preEffective - afterHarvestingData.effectiveCapitalGains;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#0d1117] page-root">
        {/* Top Nav */}
        <header className="sticky top-0 z-40 bg-[#0d1117]/90 backdrop-blur-md border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tight">
                <span className="text-blue-400">Koin</span>
                <span className="text-white">X</span>
              </span>
              <span className="text-blue-400 text-xs font-bold align-super leading-none">®</span>
            </div>

            {/* Theme toggle + Hamburger */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                id="nav-menu-btn"
                className="flex flex-col gap-1.5 p-1 group"
                aria-label="Menu"
              >
                <span className="w-5 h-0.5 bg-gray-400 group-hover:bg-white transition-colors rounded-full" />
                <span className="w-5 h-0.5 bg-gray-400 group-hover:bg-white transition-colors rounded-full" />
                <span className="w-5 h-0.5 bg-gray-400 group-hover:bg-white transition-colors rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          {/* Page Title */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <h1 className="text-xl font-bold text-white">Tax Harvesting</h1>
            <TooltipHowItWorks />
          </div>

          {/* Disclaimers */}
          <DisclaimerSection />

          {/* Summary Cards Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <PreHarvestingCard data={preHarvestingData} />
            <AfterHarvestingCard data={afterHarvestingData} savings={savings} />
          </div>

          {/* Holdings Table */}
          <HoldingsTable
            holdings={holdingsData}
            selectedIds={selectedIds}
            onToggle={toggleHolding}
          />
        </main>

        {/* Footer */}
        <footer className="mt-12 border-t border-white/5 py-6 text-center">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} KoinX. All rights reserved. For informational purposes only.
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
}
