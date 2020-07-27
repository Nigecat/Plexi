var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CommandClient } from "eris";
import auth from "./config/auth.json";
import config from "./config/config.json";
import package_json from "../package.json";
(() => __awaiter(void 0, void 0, void 0, function* () {
    const client = new CommandClient(auth.token, {}, { prefix: config.prefix, description: package_json.description, owner: `<@${config.owner}>` });
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.username}#${client.user.discriminator}`);
        client.editStatus("online", { name: "Visual Studio Code", type: 0 });
    });
    client.connect();
}))();
//# sourceMappingURL=main.js.map