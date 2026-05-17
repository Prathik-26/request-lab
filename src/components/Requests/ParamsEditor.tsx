import { Plus, Trash2 } from "lucide-react";
import { useActiveRequestStore } from "@/store/activeRequest";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function parseParams(
  url: string,
): { key: string; value: string; enabled: boolean }[] {
  try {
    const u = new URL(url);
    return Array.from(u.searchParams.entries()).map(([key, value]) => ({
      key,
      value,
      enabled: true,
    }));
  } catch {
    return [];
  }
}

function buildUrl(
  base: string,
  params: { key: string; value: string; enabled: boolean }[],
): string {
  try {
    const u = new URL(base);
    u.search = "";
    params
      .filter((p) => p.enabled && p.key)
      .forEach((p) => u.searchParams.append(p.key, p.value));
    return u.toString();
  } catch {
    return base;
  }
}

export default function ParamsEditor() {
  const { request, updateField } = useActiveRequestStore();

  if (!request) return null;

  const params = parseParams(request.url);

  const updateParams = (
    updated: { key: string; value: string; enabled: boolean }[],
  ) => {
    updateField("url", buildUrl(request.url, updated));
  };

  const addParam = () => {
    updateParams([...params, { key: "", value: "", enabled: true }]);
  };

  const updateParam = (
    index: number,
    field: "key" | "value" | "enabled",
    value: string | boolean,
  ) => {
    const updated = params.map((p, i) =>
      i === index ? { ...p, [field]: value } : p,
    );
    updateParams(updated);
  };

  const removeParam = (index: number) => {
    updateParams(params.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2 p-3">
      {params.length === 0 && (
        <p className="text-xs text-zinc-600">No query params.</p>
      )}
      {params.map((param, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={param.enabled}
            onChange={(e) => updateParam(index, "enabled", e.target.checked)}
            className="accent-green-500 shrink-0"
          />
          <Input
            value={param.key}
            onChange={(e) => updateParam(index, "key", e.target.value)}
            placeholder="Key"
            className="flex-1 bg-zinc-800 border-zinc-700 text-xs h-7 font-mono"
          />
          <Input
            value={param.value}
            onChange={(e) => updateParam(index, "value", e.target.value)}
            placeholder="Value"
            className="flex-1 bg-zinc-800 border-zinc-700 text-xs h-7 font-mono"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-zinc-500 hover:text-red-400"
            onClick={() => removeParam(index)}
          >
            <Trash2 size={12} />
          </Button>
        </div>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="w-fit text-xs text-zinc-400 hover:text-zinc-100 mt-1"
        onClick={addParam}
      >
        <Plus size={12} className="mr-1" /> Add Param
      </Button>
    </div>
  );
}
