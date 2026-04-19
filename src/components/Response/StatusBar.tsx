import { useResponseStore } from "@/store/response";

function statusColor(status: number) {
  if (status < 300) return "text-green-400 bg-green-400/10 border-green-400/20";
  if (status < 400)
    return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
  return "text-red-400 bg-red-400/10 border-red-400/20";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export default function StatusBar() {
  const { response, loading, error } = useResponseStore();

  if (loading)
    return (
      <div className="flex items-center gap-3 px-3 py-2 border-b border-zinc-800">
        <span className="text-xs text-zinc-400 animate-pulse">
          Sending request...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center gap-3 px-3 py-2 border-b border-zinc-800">
        <span className="text-xs text-red-400">{error}</span>
      </div>
    );

  if (!response)
    return (
      <div className="flex items-center gap-3 px-3 py-2 border-b border-zinc-800">
        <span className="text-xs text-zinc-600">
          Hit Send to get a response
        </span>
      </div>
    );

  return (
    <div className="flex items-center gap-3 px-3 py-2 border-b border-zinc-800">
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded border ${statusColor(response.status)}`}
      >
        {response.status} {response.statusText}
      </span>
      <span className="text-xs text-zinc-500">{response.time} ms</span>
      <span className="text-xs text-zinc-500">{formatSize(response.size)}</span>
    </div>
  );
}
