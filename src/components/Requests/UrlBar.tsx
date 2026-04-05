import { useActiveRequestStore } from "@/store/activeRequest";
import { useCollectionStore } from "@/store/collections";
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

  if (!request)
    return (
      <div className="flex items-center gap-2 p-3 border-b border-zinc-800">
        <span className="text-xs text-zinc-600">
          Open a request to start editing
        </span>
      </div>
    );

  const handleSend = async () => {
    const updated = { ...request, updatedAt: Date.now() };
    await saveRequest(updated);
  };

  return (
    <div className="flex items-center gap-2 p-3 border-b border-zinc-800">
      {/* Method selector */}
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

      {/* URL input */}
      <Input
        value={request.url}
        onChange={(e) => updateField("url", e.target.value)}
        placeholder="https://api.example.com/endpoint"
        className="flex-1 bg-zinc-800 border-zinc-700 text-sm h-8 font-mono"
      />

      {/* Send button */}
      <Button
        onClick={handleSend}
        size="sm"
        className="bg-green-600 hover:bg-green-500 text-white shrink-0"
      >
        Send
      </Button>
    </div>
  );
}
