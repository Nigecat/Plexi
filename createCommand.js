import { existsSync, writeFileSync } from "fs";

if (process.argv.length == 2) {
    console.error("You must specify the name of the command you want to make as an argument to this script!\nIf running through npm use -- to pass the arguments through. Ex   npm run create-command -- play   to create a command called play.");
    process.exit(1);
}

const name = process.argv[2];

if (existsSync(`./src/commands/public/${name}.ts`)) {
    console.error("That command already exists!");
    process.exit(1);
}

writeFileSync(`./src/commands/public/${name}.ts`, `import { Command, CommandData, InvalidArgument } from "../../types.js";

export default {
    description: "",
    args: [],
    call({ message, args }: CommandData) {

    }
} as Command
`);

console.log(`Command created at src/commands/public/${name}.ts`)