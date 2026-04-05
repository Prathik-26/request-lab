import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  Pencil,
  MoreHorizontal,
} from "lucide-react";
import { useCollectionStore } from "@/store/collections";
import { useTabStore } from "@/store/tabs";
import { createNewRequest } from "@/lib/newRequest";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActiveRequestStore } from "@/store/activeRequest";
import { Input } from "@/components/ui/input";
import type { Collection } from "@/types";

function CollectionItem({ collection }: { collection: Collection }) {
  const [open, setOpen] = useState(true);
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(collection.name);

  const allRequests = useCollectionStore((s) => s.requests);
  const setRequest = useActiveRequestStore((s) => s.setRequest);

  const requests = allRequests.filter((r) => r.collectionId === collection.id);
  const { renameCollection, deleteCollection, saveRequest } =
    useCollectionStore();
  const { openTab, setActive } = useTabStore();

  const handleRename = async () => {
    if (renameValue.trim())
      await renameCollection(collection.id, renameValue.trim());
    setRenaming(false);
  };

  const handleAddRequest = async () => {
    const req = createNewRequest(collection.id);
    await saveRequest(req);
    await openTab(req.id);
    setOpen(true);
  };

  const handleOpenRequest = async (requestId: string) => {
    const req = requests.find((r) => r.id === requestId);
    await openTab(requestId);
    setActive(requestId);
    if (req) setRequest(req);
  };

  return (
    <div className="mb-1">
      {/* Collection header */}
      <div className="flex items-center gap-1 group rounded-md px-1 py-1 hover:bg-zinc-800">
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-zinc-400 hover:text-zinc-100"
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        {renaming ? (
          <Input
            autoFocus
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="h-5 text-xs px-1 py-0 bg-zinc-700 border-zinc-600"
          />
        ) : (
          <span
            className="flex-1 text-xs font-medium text-zinc-300 truncate cursor-pointer"
            onClick={() => setOpen((o) => !o)}
          >
            {collection.name}
          </span>
        )}

        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={handleAddRequest}
          >
            <Plus size={12} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-5 w-5">
                <MoreHorizontal size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem
                onClick={() => {
                  setRenaming(true);
                  setRenameValue(collection.name);
                }}
              >
                <Pencil size={12} className="mr-2" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400 focus:text-red-400"
                onClick={() => deleteCollection(collection.id)}
              >
                <Trash2 size={12} className="mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Requests list */}
      {open && (
        <div className="ml-4 border-l border-zinc-800 pl-2 mt-0.5">
          {requests.length === 0 && (
            <p className="text-xs text-zinc-600 py-1 px-1">No requests yet</p>
          )}
          {requests.map((req) => (
            <button
              key={req.id}
              onClick={() => handleOpenRequest(req.id)}
              className="w-full flex items-center gap-2 px-1 py-1 rounded-md hover:bg-zinc-800 group"
            >
              <span
                className={`text-[10px] font-bold w-10 shrink-0 ${methodColor(req.method)}`}
              >
                {req.method}
              </span>
              <span className="text-xs text-zinc-300 truncate">{req.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function methodColor(method: string) {
  switch (method) {
    case "GET":
      return "text-green-400";
    case "POST":
      return "text-yellow-400";
    case "PUT":
      return "text-blue-400";
    case "PATCH":
      return "text-orange-400";
    case "DELETE":
      return "text-red-400";
    default:
      return "text-zinc-400";
  }
}

export default function CollectionTree() {
  const collections = useCollectionStore((s) => s.collections);
  const addCollection = useCollectionStore((s) => s.addCollection);

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-zinc-800 mb-2">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Collections
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => addCollection("New Collection")}
        >
          <Plus size={14} />
        </Button>
      </div>

      {/* Collection list */}
      <div className="flex-1 overflow-y-auto px-1">
        {collections.length === 0 && (
          <p className="text-xs text-zinc-600 text-center mt-8">
            No collections yet.
            <br />
            Click + to create one.
          </p>
        )}
        {collections.map((col) => (
          <CollectionItem key={col.id} collection={col} />
        ))}
      </div>
    </div>
  );
}
