import { create } from "zustand";
import type { Collection, ApiRequest } from "../types";
import db from "../lib/db";

interface CollectionStore {
  collections: Collection[];
  requests: ApiRequest[];
  loadAll: () => Promise<void>;
  saveRequest: (req: ApiRequest) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
}

export const useCollectionStore = create<CollectionStore>((set, get) => ({
  collections: [],
  requests: [],

  loadAll: async () => {
    const [collections, requests] = await Promise.all([
      db.collections.toArray(),
      db.requests.toArray(),
    ]);
    set({ collections, requests });
  },

  saveRequest: async (req) => {
    await db.requests.put(req);
    const requests = get().requests;
    const exists = requests.find((r) => r.id === req.id);
    set({
      requests: exists
        ? requests.map((r) => (r.id === req.id ? req : r))
        : [...requests, req],
    });
  },

  deleteRequest: async (id) => {
    await db.requests.delete(id);
    set((s) => ({ requests: s.requests.filter((r) => r.id !== id) }));
  },
}));
