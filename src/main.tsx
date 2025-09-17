import { createRoot } from "react-dom/client";
import { LanguageProvider } from './contexts/LanguageContext';
import App from "./App.tsx";
import "./index.css";

// Apply initial theme before React renders to avoid flash of wrong theme
(() => {
  try {
    const key = 'ks-theme';
    const stored = localStorage.getItem(key);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = stored ? stored === 'dark' : prefersDark;
    const root = document.documentElement;
    if (shouldBeDark) root.classList.add('dark'); else root.classList.remove('dark');
  } catch {
    // no-op
  }
})();

createRoot(document.getElementById("root")!).render(
  <LanguageProvider>
    <App />
  </LanguageProvider>
);
