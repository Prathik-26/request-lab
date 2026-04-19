import { useEffect } from "react";
import { useTabStore } from "./store/tabs";
import { useCollectionStore } from "./store/collections";
import CollectionTree from "./components/Sidebar/CollectionTree";
import TabBar from "./components/Sidebar/TabBar";
import ResponsePanel from "./components/Response/ResponsePanel";
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
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-hidden border-b border-zinc-800">
            <RequestPanel />
          </div>
          <div className="flex-1 overflow-hidden">
            <ResponsePanel />
          </div>
        </div>
      </main>
    </div>
  );
}
