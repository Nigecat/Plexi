# Adding a new command
To add a new command first create a file in `src/commands/public/<commandName>ts`.  
The name of the file will be treated as the command name.  
Copy and paste the following code into the file as the basic command structure:  
```typescript
import { Message } from "discord.js";

export default {
    description: "This is a sample command",
    call (message: Message) {
    
    }
}
```

If the command requires user permissions to run, add a `perms` field with an array of all the required permissions.
```typescript
import { Message } from "discord.js";

export default {
    perms: ["ADMINISTRATOR"],
    description: "This is a sample command",
    call (message: Message) {

   }
}
```

If the command requires args, add a args property to the export, if the number of args is limited, make this an array. The command helper will enforce that the correct number of args are supplied by the user. Ensure that any arg that must be a mention is prefixed with an @ (eg. @user). If the args is set to a string then any number of args will be allowed, and they will be passed as a string to the command when it is run.
```typescript
import { Message } from "discord.js";

export default {
    args: ["@user", "number"],
    description: "This is a sample command",
    call (message: Message) {
    
    }
}
```

The call property will be passed 4 parameters, only accept the ones you need.
```typescript
import { Message, Client } from "discord.js";
import Database from "../../util/Database.js";

export default {
    perms: ["ADMINISTRATOR"],
    description: "This is a sample command",
    call (message: Message, args: (string | string[]), database: Database, client: Client) {
    
    }
}
```
The args will be the same type (array or string) as the args property of the export.

If the call function export is async and has a Promise return type, the command handler will automatically set the bot to a `typing` state while the command is executing.

# More information
See the [DiscordJS docs](https://discord.js.org/#/docs/main/stable/general/welcome) for more information on interacting with discord from the [Message](https://discord.js.org/#/docs/main/stable/class/Message) or [Client](https://discord.js.org/#/docs/main/stable/class/Client) objects.  
See the [permission flags](https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS) for a list of valid permissions.
