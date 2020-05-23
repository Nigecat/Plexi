# Adding a new command
To add a new command first create a file in `src/commands/public/<commandName>ts`.  
The name of the file will be treated as the command name.  
Create a default export of a Command interface object, one can be created using `Command.create`. See `src/util/Command.ts` for available properties.
```typescript
import { Message } from "discord.js";
import Command from "../../util/Command.js";

export default Command.create({
    description: "sample command",
    call (message: Message): void {

    }
});

```
Ensure that any arguments that require a ping are labelled `@role/@user`, these will be enforced by the helper. If an argument can take multiple string for argument, seperate them with a `|` eg. `set|clear`. 
If the number of arguments is unlimited set args to be a string, not an array.

If the call function export is async and has a Promise return type, the command handler will automatically set the bot to a `typing` state while the command is executing.

# More information
See the [DiscordJS docs](https://discord.js.org/#/docs/main/stable/general/welcome) for more information on interacting with discord from the [Message](https://discord.js.org/#/docs/main/stable/class/Message) or [Client](https://discord.js.org/#/docs/main/stable/class/Client) objects.  
See the [permission flags](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS) for a list of valid permissions.
