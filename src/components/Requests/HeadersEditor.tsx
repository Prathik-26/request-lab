import { Plus, Trash2 } from "lucide-react";
import { useActiveRequestStore } from "@/store/activeRequest";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HeadersEditor() {
  const { request, updateField } = useActiveRequestStore();

  if (!request) return null;

  const headers = request.headers;

  const addHeader = () => {
    updateField("headers", [...headers, { key: "", value: "", enabled: true }]);
  };

  const updateHeader = (
    index: number,
    field: "key" | "value" | "enabled",
    value: string | boolean,
  ) => {
    const updated = headers.map((h, i) =>
      i === index ? { ...h, [field]: value } : h,
    );
    updateField("headers", updated);
  };

  const removeHeader = (index: number) => {
    updateField(
      "headers",
      headers.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="flex flex-col gap-2 p-3">
      {headers.length === 0 && (
        <p className="text-xs text-zinc-600">No headers added.</p>
      )}
      {headers.map((header, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={header.enabled}
            onChange={(e) => updateHeader(index, "enabled", e.target.checked)}
            className="accent-green-500 shrink-0"
          />
          <Input
            value={header.key}
            onChange={(e) => updateHeader(index, "key", e.target.value)}
            placeholder="Key"
            className="flex-1 bg-zinc-800 border-zinc-700 text-xs h-7 font-mono"
          />
          <Input
            value={header.value}
            onChange={(e) => updateHeader(index, "value", e.target.value)}
            placeholder="Value"
            className="flex-1 bg-zinc-800 border-zinc-700 text-xs h-7 font-mono"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-zinc-500 hover:text-red-400"
            onClick={() => removeHeader(index)}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="w-fit text-xs text-zinc-400 hover:text-zinc-100 mt-1"
        onClick={addHeader}
      >
        <Plus size={12} className="mr-1" /> Add Header
      </Button>
    </div>
  );
}
