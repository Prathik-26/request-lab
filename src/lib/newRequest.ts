import { v4 as uuidv4 } from "uuid";
import type { ApiRequest } from "../types";

export function createNewRequest(collectionId: string): ApiRequest {
  return {
    id: uuidv4(),
    collectionId,
    name: "New Request",
    method: "GET",
    url: "",
    headers: [],
    body: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
