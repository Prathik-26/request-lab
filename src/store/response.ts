import { create } from "zustand";
import type { ResponseData } from "@/lib/requester";

interface ResponseStore {
  response: ResponseData | null;
  loading: boolean;
  error: string | null;
  setResponse: (res: ResponseData) => void;
  setLoading: (v: boolean) => void;
  setError: (e: string) => void;
  clear: () => void;
}

export const useResponseStore = create<ResponseStore>((set) => ({
  response: null,
  loading: false,
  error: null,
  setResponse: (response) => set({ response, loading: false, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),
  clear: () => set({ response: null, loading: false, error: null }),
}));
