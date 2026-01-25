
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <nav className="sticky top-0 z-40 w-full bg-card/80 backdrop-blur border-b border-border shadow-sm transition-colors">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold text-primary tracking-tight">
            CircuitAi
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/ai-assistbot" className="hover:text-primary transition-colors">AI Circuit Builder</Link>
          <Link href="/full-adder" className="hover:text-primary transition-colors">Examples</Link>
          <Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link>
          <button
            aria-label="Toggle dark mode"
            className="ml-4 rounded-full p-2 border border-border bg-muted hover:bg-accent transition-colors"
            onClick={() => setDark((d) => !d)}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.95 7.07l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
