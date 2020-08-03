import { Options } from "../Plexi";

const CONFIG: Options = {
    client: {
        allowedMentions: { roles: [], users: [] },
    },
    plexi: {
        supportServer: "621181741972979722",
        owner: "307429254017056769",
        databasePath: "./src/data/data.sqlite",
        prefix: "$",
    },
};

export default CONFIG;
