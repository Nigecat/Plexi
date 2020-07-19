import Table from "./table.js";
import Database from "./database.js";

export default async (database: Database, id: string) => await Table("Server", database, id);