function fmt(val) {
  const abs = Math.abs(val);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return val < 0 ? `- $${formatted}` : `$${formatted}`;
}

function Row({ label, shortTerm, longTerm, isHeader, isBold, className = "" }) {
  if (isHeader) {
    return (
      <div className="grid grid-cols-3 pb-2 mb-1 border-b border-white/10">
        <div />
        <div className="text-xs font-semibold text-gray-300 text-right pr-4">Short-term</div>
        <div className="text-xs font-semibold text-gray-300 text-right">Long-term</div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-3 py-2.5 items-center ${className}`}>
      <div className={`text-sm ${isBold ? "font-bold text-white" : "text-gray-300"}`}>{label}</div>
      <div className={`text-sm text-right pr-4 ${isBold ? "font-bold text-white" : "text-gray-100"}`}>
        {fmt(shortTerm)}
      </div>
      <div className={`text-sm text-right ${isBold ? "font-bold text-white" : "text-gray-100"}`}>
        {fmt(longTerm)}
      </div>
    </div>
  );
}

export default function PreHarvestingCard({ data }) {
  const { shortTerm, longTerm, realisedCapitalGains } = data;

  return (
    <div className="glass-card p-5 flex-1 min-w-0">
      <h2 className="text-base font-bold text-white mb-4">Pre Harvesting</h2>

      <Row isHeader />

      <Row label="Profits" shortTerm={shortTerm.profits} longTerm={longTerm.profits} />
      <div className="border-t border-white/5" />
      <Row label="Losses" shortTerm={shortTerm.losses} longTerm={longTerm.losses} />
      <div className="border-t border-white/5" />
      <Row
        label="Net Capital Gains"
        shortTerm={shortTerm.netCapitalGains}
        longTerm={longTerm.netCapitalGains}
        isBold
      />

      <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-baseline gap-2">
        <span className="text-sm text-gray-300">Realised Capital Gains:</span>
        <span className="text-xl font-bold text-white">
          ${realisedCapitalGains.toLocaleString("en-US")}
        </span>
      </div>
    </div>
  );
}
