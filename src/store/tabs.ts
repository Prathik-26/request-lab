import { create } from "zustand";
import type { Tab } from "../types";
import db from "../lib/db";

interface TabStore {
  tabs: Tab[];
  activeTabId: string | null;
  loadTabs: () => Promise<void>;
  openTab: (requestId: string) => Promise<void>;
  closeTab: (requestId: string) => Promise<void>;
  setActive: (requestId: string) => void;
}

export const useTabStore = create<TabStore>((set, get) => ({
  tabs: [],
  activeTabId: null,

  loadTabs: async () => {
    const tabs = await db.tabs.orderBy("order").toArray();
    set({ tabs, activeTabId: tabs[0]?.id ?? null });
  },

  openTab: async (requestId) => {
    const exists = get().tabs.find((t) => t.id === requestId);
    if (exists) {
      set({ activeTabId: requestId });
      return;
    }
    const newTab: Tab = {
      id: requestId,
      order: get().tabs.length,
      isDirty: false,
    };
    await db.tabs.add(newTab);
    set((s) => ({ tabs: [...s.tabs, newTab], activeTabId: requestId }));
  },

  closeTab: async (requestId) => {
    await db.tabs.delete(requestId);
    const remaining = get().tabs.filter((t) => t.id !== requestId);
    const activeTabId =
      get().activeTabId === requestId
        ? (remaining[remaining.length - 1]?.id ?? null)
        : get().activeTabId;
    set({ tabs: remaining, activeTabId });
  },

  setActive: (requestId) => set({ activeTabId: requestId }),
}));
