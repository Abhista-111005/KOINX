import { useTheme } from "../context/ThemeContext";

// Sun icon (light mode indicator)
function SunIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

// Moon icon (dark mode indicator)
function MoonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        relative flex items-center justify-center
        w-9 h-9 rounded-full border transition-all duration-300
        cursor-pointer overflow-hidden
        ${
          isDark
            ? "border-gray-600 bg-gray-800/60 text-yellow-300 hover:border-yellow-400 hover:bg-gray-700"
            : "border-blue-200 bg-blue-50 text-blue-600 hover:border-blue-400 hover:bg-blue-100"
        }
      `}
    >
      {/* Animated icon swap */}
      <span
        className="transition-all duration-300"
        style={{
          transform: isDark ? "rotate(0deg) scale(1)" : "rotate(180deg) scale(0.9)",
          opacity: isDark ? 1 : 0,
          position: isDark ? "static" : "absolute",
        }}
      >
        <SunIcon />
      </span>
      <span
        className="transition-all duration-300"
        style={{
          transform: !isDark ? "rotate(0deg) scale(1)" : "rotate(-180deg) scale(0.9)",
          opacity: !isDark ? 1 : 0,
          position: !isDark ? "static" : "absolute",
        }}
      >
        <MoonIcon />
      </span>
    </button>
  );
}
