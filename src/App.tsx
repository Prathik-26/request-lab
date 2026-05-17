import { useEffect } from "react";
import { useTabStore } from "./store/tabs";
import { useCollectionStore } from "./store/collections";
import { useActiveRequestStore } from "./store/activeRequest";
import { useResponseStore } from "./store/response";
import { sendRequest } from "./lib/requester";
import CollectionTree from "./components/Sidebar/CollectionTree";
import TabBar from "./components/Sidebar/TabBar";
import ResponsePanel from "./components/Response/ResponsePanel";
import RequestPanel from "./components/Requests/RequestPanel";

export default function App() {
  const loadTabs = useTabStore((s) => s.loadTabs);
  const loadAll = useCollectionStore((s) => s.loadAll);
  const saveRequest = useCollectionStore((s) => s.saveRequest);
  const request = useActiveRequestStore((s) => s.request);
  const { setResponse, setLoading, setError } = useResponseStore();
  const tabs = useTabStore((s) => s.tabs);

  useEffect(() => {
    loadTabs();
    loadAll();
  }, []);

  // Ctrl+Enter to send
  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        if (!request?.url) return;
        setLoading(true);
        const updated = { ...request, updatedAt: Date.now() };
        await saveRequest(updated);
        try {
          const res = await sendRequest(
            request.url,
            request.method,
            request.headers,
            request.body,
          );
          setResponse(res);
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : "Request failed");
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [request]);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <aside className="w-64 min-w-64 bg-zinc-900 border-r border-zinc-800 overflow-hidden flex flex-col">
        <CollectionTree />
      </aside>
      <main className="flex flex-col flex-1 overflow-hidden">
        <TabBar />
        {tabs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-zinc-500 text-sm">No request open</p>
            <p className="text-zinc-600 text-xs">
              Create a collection in the sidebar
              <br />
              and add a request to get started
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-hidden border-b border-zinc-800">
              <RequestPanel />
            </div>
            <div className="flex-1 overflow-hidden">
              <ResponsePanel />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
