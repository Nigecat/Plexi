import { promises as fs } from "fs";
import InvalidCommand from "../util/InvalidCommand.js";

function verifyCommand(command: any, name: string): void {
    if (!command.hasOwnProperty("description")) {
        throw new InvalidCommand(`${name} Missing description!`);
    }
    if (!command.hasOwnProperty("call") || typeof command.call != "function") {
        throw new InvalidCommand(`${name} Missing call function!`);
    }
}

fs.readdir("./commands/public").then((files: string[]) => {
    files.forEach(async (file: string) => {
        if (file.endsWith(".js")) {
            const path: string = `../commands/public/${file}`;
            verifyCommand((await import(path)).default, file.replace(".js", ".ts"));
        }
    });
});