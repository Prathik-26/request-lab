import { create } from "zustand";
import type { Collection, ApiRequest } from "../types";
import db from "../lib/db";

interface CollectionStore {
  collections: Collection[];
  requests: ApiRequest[];
  loadAll: () => Promise<void>;
  addCollection: (name: string) => Promise<void>;
  renameCollection: (id: string, name: string) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
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

  addCollection: async (name) => {
    const { v4: uuidv4 } = await import("uuid");
    const collection: Collection = {
      id: uuidv4(),
      name,
      createdAt: Date.now(),
    };
    await db.collections.add(collection);
    set((s) => ({ collections: [...s.collections, collection] }));
  },

  renameCollection: async (id, name) => {
    await db.collections.update(id, { name });
    set((s) => ({
      collections: s.collections.map((c) => (c.id === id ? { ...c, name } : c)),
    }));
  },

  deleteCollection: async (id) => {
    await db.collections.delete(id);
    await db.requests.where("collectionId").equals(id).delete();
    set((s) => ({
      collections: s.collections.filter((c) => c.id !== id),
      requests: s.requests.filter((r) => r.collectionId !== id),
    }));
  },

  saveRequest: async (req) => {
    await db.requests.put(req);
    const exists = get().requests.find((r) => r.id === req.id);
    set((s) => ({
      requests: exists
        ? s.requests.map((r) => (r.id === req.id ? req : r))
        : [...s.requests, req],
    }));
  },

  deleteRequest: async (id) => {
    await db.requests.delete(id);
    set((s) => ({ requests: s.requests.filter((r) => r.id !== id) }));
  },
}));
