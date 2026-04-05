import { X } from "lucide-react";
import { useTabStore } from "@/store/tabs";
import { useCollectionStore } from "@/store/collections";
import { useActiveRequestStore } from "@/store/activeRequest";

export default function TabBar() {
  const { tabs, activeTabId, setActive, closeTab } = useTabStore();
  const requests = useCollectionStore((s) => s.requests);
  const setRequest = useActiveRequestStore((s) => s.setRequest);

  const handleSelect = (tabId: string) => {
    setActive(tabId);
    const req = requests.find((r) => r.id === tabId);
    if (req) setRequest(req);
  };

  if (tabs.length === 0)
    return (
      <div className="h-9 border-b border-zinc-800 flex items-center px-4">
        <span className="text-xs text-zinc-600">No open tabs</span>
      </div>
    );

  return (
    <div className="h-9 border-b border-zinc-800 flex items-center overflow-x-auto shrink-0">
      {tabs.map((tab) => {
        const req = requests.find((r) => r.id === tab.id);
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => handleSelect(tab.id)}
            className={`flex items-center gap-2 px-3 h-full border-r border-zinc-800 cursor-pointer shrink-0 min-w-0 max-w-45 group
              ${isActive ? "bg-zinc-950 text-zinc-100" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
          >
            <span
              className={`text-[10px] font-bold shrink-0 ${methodColor(req?.method ?? "GET")}`}
            >
              {req?.method ?? "GET"}
            </span>
            <span className="text-xs truncate flex-1">
              {req?.name ?? "Untitled"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="shrink-0 opacity-0 group-hover:opacity-100 hover:text-zinc-100 transition-opacity"
            >
              <X size={11} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function methodColor(method: string) {
  switch (method) {
    case "GET":
      return "text-green-400";
    case "POST":
      return "text-yellow-400";
    case "PUT":
      return "text-blue-400";
    case "PATCH":
      return "text-orange-400";
    case "DELETE":
      return "text-red-400";
    default:
      return "text-zinc-400";
  }
}
