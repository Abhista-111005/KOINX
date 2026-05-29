import { useState } from "react";

const INITIAL_ROWS = 4;

function SortIcon({ column, sortConfig }) {
  const isActive = sortConfig.key === column;
  const isAsc = isActive && sortConfig.dir === "asc";
  const isDesc = isActive && sortConfig.dir === "desc";

  return (
    <span className="inline-flex flex-col gap-[2px] ml-1 align-middle">
      <span
        className={`sort-up ${isAsc ? "text-blue-400" : "text-gray-500"}`}
        style={{ display: "block", width: 0, height: 0,
          borderLeft: "4px solid transparent", borderRight: "4px solid transparent",
          borderBottom: isAsc ? "5px solid #60a5fa" : "5px solid #6b7280"
        }}
      />
      <span
        className={`sort-down ${isDesc ? "text-blue-400" : "text-gray-500"}`}
        style={{ display: "block", width: 0, height: 0,
          borderLeft: "4px solid transparent", borderRight: "4px solid transparent",
          borderTop: isDesc ? "5px solid #60a5fa" : "5px solid #6b7280"
        }}
      />
    </span>
  );
}

function CoinIcon({ icon, iconColor, iconBg }) {
  return (
    <span
      className="w-8 h-8 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0"
      style={{ background: iconBg, color: iconColor, border: `1.5px solid ${iconColor}30` }}
    >
      {icon}
    </span>
  );
}

export default function HoldingsTable({ holdings, selectedIds, onToggle }) {
  const [showAll, setShowAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, dir: "asc" });
  const [allChecked, setAllChecked] = useState(false);

  function handleSort(key) {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, dir: prev.dir === "asc" ? "desc" : "asc" };
      }
      return { key, dir: "asc" };
    });
  }

  function handleAllCheck() {
    if (allChecked) {
      // Deselect all
      holdings.forEach((h) => {
        if (selectedIds.has(h.id)) onToggle(h);
      });
      setAllChecked(false);
    } else {
      // Select all
      holdings.forEach((h) => {
        if (!selectedIds.has(h.id)) onToggle(h);
      });
      setAllChecked(true);
    }
  }

  // Sort
  let sorted = [...holdings];
  if (sortConfig.key) {
    sorted.sort((a, b) => {
      const va = a[sortConfig.key];
      const vb = b[sortConfig.key];
      return sortConfig.dir === "asc" ? va - vb : vb - va;
    });
  }

  const displayed = showAll ? sorted : sorted.slice(0, INITIAL_ROWS);

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-5 pb-0">
        <h2 className="text-base font-bold text-white mb-4">Holdings</h2>
      </div>

      {/* Table Scroll Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="px-5 py-3 text-left w-10">
                <input
                  type="checkbox"
                  className="checkbox-custom"
                  checked={allChecked}
                  onChange={handleAllCheck}
                  id="select-all-checkbox"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Asset
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                <div className="flex flex-col items-end">
                  <span>Holdings</span>
                  <span className="text-[10px] text-gray-500 font-normal normal-case">Current Market Rate</span>
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Total Current Value
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer select-none hover:text-white transition-colors"
                onClick={() => handleSort("shortTerm")}
                id="sort-short-term-btn"
              >
                <div className="inline-flex items-center gap-1 justify-end">
                  Short-term
                  <SortIcon column="shortTerm" sortConfig={sortConfig} />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide cursor-pointer select-none hover:text-white transition-colors"
                onClick={() => handleSort("longTerm")}
                id="sort-long-term-btn"
              >
                <div className="inline-flex items-center gap-1 justify-end">
                  Long-Term
                  <SortIcon column="longTerm" sortConfig={sortConfig} />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Amount to Sell
              </th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((asset, idx) => {
              const isChecked = selectedIds.has(asset.id);
              return (
                <tr
                  key={asset.id}
                  className={`border-b border-white/5 transition-colors duration-150 cursor-pointer
                    ${isChecked ? "bg-blue-900/15" : "hover:bg-white/[0.02]"}`}
                  onClick={() => onToggle(asset)}
                  id={`holding-row-${asset.id}`}
                >
                  {/* Checkbox */}
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="checkbox-custom"
                      checked={isChecked}
                      onChange={() => onToggle(asset)}
                      id={`checkbox-${asset.id}`}
                    />
                  </td>

                  {/* Asset Name */}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <CoinIcon icon={asset.icon} iconColor={asset.iconColor} iconBg={asset.iconBg} />
                      <div>
                        <div className="font-semibold text-white text-sm">{asset.name}</div>
                        <div className="text-xs text-gray-500">{asset.symbol}</div>
                      </div>
                    </div>
                  </td>

                  {/* Holdings */}
                  <td className="px-4 py-4 text-right">
                    <div className="text-white font-medium text-sm">
                      {asset.holdings.toLocaleString("en-US", { maximumFractionDigits: 5 })} {asset.symbol}
                    </div>
                    <div className="text-xs text-gray-500">
                      ${asset.avgBuyPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}/{asset.symbol}
                    </div>
                  </td>

                  {/* Total Current Value */}
                  <td className="px-4 py-4 text-right">
                    <div className="text-white font-medium text-sm">
                      ${asset.totalCurrentValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </td>

                  {/* Short-Term */}
                  <td className="px-4 py-4 text-right">
                    <div className={`font-semibold text-sm ${asset.shortTerm >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {asset.shortTerm >= 0 ? "+" : ""}
                      ${Math.abs(asset.shortTerm).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500">{asset.shortTermAmount}</div>
                  </td>

                  {/* Long-Term */}
                  <td className="px-4 py-4 text-right">
                    <div className={`font-semibold text-sm ${asset.longTerm >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {asset.longTerm >= 0 ? "+" : ""}
                      ${Math.abs(asset.longTerm).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500">{asset.longTermAmount}</div>
                  </td>

                  {/* Amount to Sell */}
                  <td className="px-4 py-4 text-right">
                    {isChecked && asset.amountToSell ? (
                      <span className="text-sm font-semibold text-white">
                        {asset.amountToSell} {asset.symbol}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-600">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* View All / Show Less */}
      {holdings.length > INITIAL_ROWS && (
        <div className="px-5 py-4 border-t border-white/5">
          <button
            id="view-all-btn"
            onClick={() => setShowAll((v) => !v)}
            className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors underline decoration-dashed underline-offset-2"
          >
            {showAll ? "Show Less ▲" : `View All (${holdings.length}) ▼`}
          </button>
        </div>
      )}
    </div>
  );
}
