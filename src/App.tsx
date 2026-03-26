import { useEffect } from "react";
import { useTabStore } from "./store/tabs";
import { useCollectionStore } from "./store/collections";
import "./App.css";

export default function App() {
  const loadTabs = useTabStore((s) => s.loadTabs);
  const loadAll = useCollectionStore((s) => s.loadAll);

  useEffect(() => {
    loadTabs();
    loadAll();
  }, []);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <p>Sidebar</p>
      </aside>
      <main className="main-panel">
        <div className="request-panel">
          <p>Request builder</p>
        </div>
        <div className="response-panel">
          <p>Response viewer</p>
        </div>
      </main>
    </div>
  );
}
