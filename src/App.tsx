import { useEffect } from "react";
import { useTabStore } from "./store/tabs";
import { useCollectionStore } from "./store/collections";

export default function App() {
  const loadTabs = useTabStore((s) => s.loadTabs);
  const loadAll = useCollectionStore((s) => s.loadAll);

  useEffect(() => {
    loadTabs();
    loadAll();
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <aside className="w-64 min-w-64 bg-zinc-900 border-r border-zinc-800 overflow-y-auto p-3">
        <p className="text-sm text-zinc-400">Sidebar</p>
      </aside>
      <main className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 border-b border-zinc-800 p-4 overflow-y-auto">
          <p className="text-sm text-zinc-400">Request builder</p>
        </div>
        <div className="flex-1 bg-zinc-950 p-4 overflow-y-auto">
          <p className="text-sm text-zinc-400">Response viewer</p>
        </div>
      </main>
    </div>
  );
}
