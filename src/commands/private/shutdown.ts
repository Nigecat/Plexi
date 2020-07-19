import { CommandData } from "../../types.js";

export default async function({ database }: CommandData) {
    await database.close();
    process.exit();
}