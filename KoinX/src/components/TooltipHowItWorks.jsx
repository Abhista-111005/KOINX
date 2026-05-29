import { useState, useRef, useEffect } from "react";

const tooltipText =
  "Tax-loss harvesting is a strategy where you sell assets at a loss to offset capital gains and reduce your overall tax liability. This tool helps you simulate the potential tax savings before making any decisions.";

export default function TooltipHowItWorks() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm font-semibold text-blue-400 hover:text-blue-300 underline decoration-dashed underline-offset-2 transition-colors duration-200 cursor-pointer"
        id="how-it-works-btn"
      >
        How it works?
      </button>

      {open && (
        <div className="tooltip-panel absolute left-0 top-8 z-50 w-72 rounded-xl border border-blue-500/30 bg-[#0d1117] shadow-2xl shadow-blue-900/30 p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
              i
            </span>
            <div>
              <p className="text-xs text-gray-300 leading-relaxed">{tooltipText}</p>
              <a
                href="#"
                className="mt-2 inline-block text-xs text-blue-400 hover:text-blue-300 underline transition-colors"
              >
                Know More
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
