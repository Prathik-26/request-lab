import { create } from "zustand";
import type { ApiRequest } from "../types";

interface ActiveRequestStore {
  request: ApiRequest | null;
  setRequest: (req: ApiRequest) => void;
  updateField: <K extends keyof ApiRequest>(
    field: K,
    value: ApiRequest[K],
  ) => void;
}

export const useActiveRequestStore = create<ActiveRequestStore>((set) => ({
  request: null,

  setRequest: (req) => set({ request: req }),

  updateField: (field, value) =>
    set((s) =>
      s.request ? { request: { ...s.request, [field]: value } } : {},
    ),
}));
