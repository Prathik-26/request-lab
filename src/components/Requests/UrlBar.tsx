import { useActiveRequestStore } from "@/store/activeRequest";
import { useCollectionStore } from "@/store/collections";
import { useResponseStore } from "@/store/response";
import { sendRequest } from "@/lib/requester";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { HttpMethod } from "@/types";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const methodColor: Record<HttpMethod, string> = {
  GET: "text-green-400",
  POST: "text-yellow-400",
  PUT: "text-blue-400",
  PATCH: "text-orange-400",
  DELETE: "text-red-400",
};

export default function UrlBar() {
  const { request, updateField } = useActiveRequestStore();
  const saveRequest = useCollectionStore((s) => s.saveRequest);
  const { setResponse, setLoading, setError, loading } = useResponseStore();

  if (!request)
    return (
      <div className="flex items-center gap-2 p-3 border-b border-zinc-800">
        <span className="text-xs text-zinc-600">
          Open a request to start editing
        </span>
      </div>
    );

  const handleSend = async () => {
    if (!request.url) return;
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
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Request failed");
    }
  };

  return (
    <div className="flex items-center gap-2 p-3 border-b border-zinc-800">
      <select
        value={request.method}
        onChange={(e) => updateField("method", e.target.value as HttpMethod)}
        className={`bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-xs font-bold focus:outline-none cursor-pointer ${methodColor[request.method]}`}
      >
        {METHODS.map((m) => (
          <option key={m} value={m} className="text-zinc-100">
            {m}
          </option>
        ))}
      </select>

      <Input
        value={request.url}
        onChange={(e) => updateField("url", e.target.value)}
        placeholder="https://api.example.com/endpoint"
        className="flex-1 bg-zinc-800 border-zinc-700 text-sm h-8 font-mono"
      />

      <Button
        onClick={handleSend}
        size="sm"
        disabled={loading || !request.url}
        className="bg-green-600 hover:bg-green-500 text-white shrink-0 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send"}
      </Button>
    </div>
  );
}
