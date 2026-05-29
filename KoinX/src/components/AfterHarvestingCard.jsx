function fmt(val) {
  const abs = Math.abs(val);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return val < 0 ? `- $${formatted}` : `$${formatted}`;
}

function fmtSigned(val) {
  const abs = Math.abs(val);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  return val < 0 ? `- $${formatted}` : `$${formatted}`;
}

function Row({ label, shortTerm, longTerm, isHeader }) {
  if (isHeader) {
    return (
      <div className="grid grid-cols-3 pb-2 mb-1 border-b border-white/20">
        <div />
        <div className="text-xs font-semibold text-blue-100 text-right pr-4">Short-term</div>
        <div className="text-xs font-semibold text-blue-100 text-right">Long-term</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 py-2.5 items-center">
      <div className="text-sm text-blue-100">{label}</div>
      <div className="text-sm text-right pr-4 text-white font-medium">{fmt(shortTerm)}</div>
      <div className="text-sm text-right text-white font-medium">{fmt(longTerm)}</div>
    </div>
  );
}

export default function AfterHarvestingCard({ data, savings }) {
  const { shortTerm, longTerm, effectiveCapitalGains } = data;
  const hasSavings = savings > 0;

  return (
    <div className="after-card p-5 flex-1 min-w-0 shadow-2xl shadow-blue-900/40">
      <h2 className="text-base font-bold text-white mb-4">After Harvesting</h2>

      <Row isHeader />

      <Row label="Profits" shortTerm={shortTerm.profits} longTerm={longTerm.profits} />
      <div className="border-t border-white/15" />
      <Row label="Losses" shortTerm={shortTerm.losses} longTerm={longTerm.losses} />
      <div className="border-t border-white/15" />
      <Row
        label="Net Capital Gains"
        shortTerm={shortTerm.netCapitalGains}
        longTerm={longTerm.netCapitalGains}
      />

      {/* Effective Capital Gains */}
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="text-sm font-bold text-white">Effective Capital Gains:</span>
          <span
            className={`text-xl font-bold ${
              effectiveCapitalGains < 0 ? "text-white" : "text-white"
            }`}
          >
            {fmtSigned(effectiveCapitalGains)}
          </span>
        </div>
      </div>

      {/* Savings Alert */}
      {hasSavings && (
        <div className="mt-3 flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-lg px-3 py-2.5">
          <span className="text-base">🎉</span>
          <span className="text-sm text-white font-medium">
            You are going to save upto{" "}
            <span className="font-bold">
              ${savings.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
