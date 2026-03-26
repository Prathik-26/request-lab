export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface Collection {
  id: string;
  name: string;
  createdAt: number;
}

export interface ApiRequest {
  id: string;
  collectionId: string;
  name: string;
  method: HttpMethod;
  url: string;
  headers: { key: string; value: string; enabled: boolean }[];
  body: string;
  createdAt: number;
  updatedAt: number;
}

export interface Tab {
  id: string;
  order: number;
  isDirty: boolean;
}
