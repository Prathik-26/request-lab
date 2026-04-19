import { useResponseStore } from "@/store/response";

export default function ResponseHeaders() {
  const response = useResponseStore((s) => s.response);

  if (!response)
    return (
      <div className="p-3">
        <p className="text-xs text-zinc-600">No response yet</p>
      </div>
    );

  const entries = Object.entries(response.headers);

  return (
    <div className="p-3 flex flex-col gap-1">
      {entries.map(([key, value]) => (
        <div key={key} className="flex gap-2 text-xs font-mono">
          <span className="text-purple-400 shrink-0">{key}:</span>
          <span className="text-zinc-300 break-all">{value}</span>
        </div>
      ))}
    </div>
  );
}
