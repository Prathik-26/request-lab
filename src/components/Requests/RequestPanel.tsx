import { useState } from "react";
import UrlBar from "./UrlBar";
import HeadersEditor from "./HeadersEditor";
import BodyEditor from "./BodyEditor";

const TABS = ["Headers", "Body"] as const;
type TabType = (typeof TABS)[number];

export default function RequestPanel() {
  const [activeTab, setActiveTab] = useState<TabType>("Headers");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <UrlBar />

      {/* Sub-tabs */}
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

      {/* Tab content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "Headers" && <HeadersEditor />}
        {activeTab === "Body" && <BodyEditor />}
      </div>
    </div>
  );
}
