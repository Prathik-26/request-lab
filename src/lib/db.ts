import Dexie, { type EntityTable } from "dexie";
import type { Collection, ApiRequest, Tab } from "../types";

const db = new Dexie("apiclient") as Dexie & {
  collections: EntityTable<Collection, "id">;
  requests: EntityTable<ApiRequest, "id">;
  tabs: EntityTable<Tab, "id">;
};

db.version(1).stores({
  collections: "id, name",
  requests: "id, collectionId, updatedAt",
  tabs: "id, order",
});

export default db;
