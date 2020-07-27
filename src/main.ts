import { CommandClient } from "eris";
import auth from "./config/auth.json";
import config from "./config/config.json";
import package_json from "../package.json";

// Wrap our code in an async functinon so we can use await
(async() => {
    const client = new CommandClient(auth.token, {}, { prefix: config.prefix, description: package_json.description, owner: `<@${config.owner}>` })

    client.on("ready", () => {
        console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
        client.editStatus("online", { name: "Visual Studio Code", type: 0 });
    });

    client.connect();
})();