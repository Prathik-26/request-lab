import { useEffect } from "react";
import { useTabStore } from "./store/tabs";
import { useCollectionStore } from "./store/collections";
import CollectionTree from "./components/Sidebar/CollectionTree";
import TabBar from "./components/Sidebar/TabBar";
import RequestPanel from "./components/Requests/RequestPanel";

export default function App() {
  const loadTabs = useTabStore((s) => s.loadTabs);
  const loadAll = useCollectionStore((s) => s.loadAll);

  useEffect(() => {
    loadTabs();
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <aside className="w-64 min-w-64 bg-zinc-900 border-r border-zinc-800 overflow-hidden flex flex-col">
        <CollectionTree />
      </aside>
      <main className="flex flex-col flex-1 overflow-hidden">
        <TabBar />
        <div className="flex-1 overflow-hidden">
          <RequestPanel />
        </div>
        <div className="h-64 border-t border-zinc-800 p-4 bg-zinc-950">
          <p className="text-xs text-zinc-600">Response viewer — Week 4</p>
        </div>
      </main>
    </div>
  );
}
