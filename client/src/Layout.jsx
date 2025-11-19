import React, { useState } from "react";
import App from "./App";
import PostmanGeneratorFull from "./PostmanGeneratorFull";
import useDarkMode from "./useDarkMode";
import { Moon, Sun } from "lucide-react"; // optional icons

export default function Layout() {
  const [view, setView] = useState("agent");
  const [darkMode, setDarkMode] = useDarkMode();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* Header */}
      <header className="w-full bg-white dark:bg-gray-800 shadow px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">QA Engineering Toolkit</h1>

        <div className="flex items-center gap-4">
          {/* Navigation */}
          <nav className="flex gap-3">
            <button
              onClick={() => setView("agent")}
              className={`px-3 py-1 rounded ${
                view === "agent"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              AI QA Agent
            </button>

            <button
              onClick={() => setView("api")}
              className={`px-3 py-1 rounded ${
                view === "api"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              API Test Generator
            </button>
          </nav>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            aria-label="Toggle Dark Mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      <main className="p-6">
        {view === "agent" ? <App /> : <PostmanGeneratorFull />}
      </main>
    </div>
  );
}
