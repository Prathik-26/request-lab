import { useState } from "react";
import StatusBar from "./StatusBar";
import ResponseBody from "./ResponseBody";
import ResponseHeaders from "./ResponseHeaders";

const TABS = ["Body", "Headers"] as const;
type TabType = (typeof TABS)[number];

export default function ResponsePanel() {
  const [activeTab, setActiveTab] = useState<TabType>("Body");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <StatusBar />

      <div className="flex border-b border-zinc-800 px-3 shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors
              ${
                activeTab === tab
                  ? "border-green-500 text-green-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "Body" && <ResponseBody />}
        {activeTab === "Headers" && <ResponseHeaders />}
      </div>
    </div>
  );
}
