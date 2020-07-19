import Database from "./database.js";

export default async function Table(table: string, database: Database, id: string) {
    const data = await database.get(table, id);
    
    return new Proxy(data, {
        get: (target, prop) => {
            return Reflect.get(target, prop);
        },

        set: (target, prop, value) => {
            database.set(table, id, prop as string, value);
            return Reflect.set(target, prop, value);
        }
    });
}