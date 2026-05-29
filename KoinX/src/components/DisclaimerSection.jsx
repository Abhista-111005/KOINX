import { useState } from "react";

const disclaimers = [
  "Tax-loss harvesting is currently not allowed under Indian tax regulations. Please consult your tax advisor before making any decisions.",
  "Tax harvesting does not apply to derivatives or futures. These are handled separately as business income under tax rules.",
  "Price and market value data is fetched from Coingecko, not from individual exchanges. As a result, values may slightly differ from the ones on your exchange.",
  "Some countries do not have a short-term / long-term bifurcation. For now, we are calculating everything as long-term.",
  "Only realized losses are considered for harvesting. Unrealized losses in held assets are not counted.",
];

export default function DisclaimerSection() {
  const [open, setOpen] = useState(false);

  return (
    <div className="disclaimer-strip mb-6 rounded-xl border border-blue-500/25 bg-blue-950/20 overflow-hidden transition-all duration-300">
      <button
        id="disclaimer-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">
            i
          </span>
          <span className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">
            Important Notes and Disclaimers
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pb-4">
          <ul className="space-y-2">
            {disclaimers.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-gray-300 leading-relaxed">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
