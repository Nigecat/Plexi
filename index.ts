import DBL from "dblapi.js";
import { Plexi } from "./src/Plexi";
import { Intents } from "discord.js";
import { version } from "./package.json";
import { existsSync, mkdirSync } from "fs";
import { createLogger, format, transports, Logger } from "winston";

// Create the bot
const client = new Plexi({
    client: {
        disableMentions: "everyone",
        allowedMentions: { roles: [], users: [] },
        fetchAllMembers: true,
        ws: {
            intents: Intents.NON_PRIVILEGED | Intents.FLAGS.GUILD_MEMBERS,
        },
        presence: {
            status: "online",
            activity: {
                type: "PLAYING",
                name: "$help",
            },
        },
    },
    plexi: {
        supportServer: "https://nigecat.github.io/Plexi/support",
        invite: "https://nigecat.github.io/Plexi/invite",
        owner: "307429254017056769",
        prefix: "$",
        version: version,
    },
});

// If our log output dir does not exist create it
if (!existsSync("logs")) {
    mkdirSync("logs");
}

// Create our logger
const logger = createLogger({
    level: "info",
    format: format.combine(format.timestamp(), format.json()),
    transports: [
        // Write all logs with level `error` and below to `error.log`
        new transports.File({ filename: "logs/error.log", level: "error" }),
        // Write all logs with level `info` and below to `combined.log`
        new transports.File({ filename: "logs/combined.log" }),
    ],
});

// If we're not in production then log to the console with the format:
// `${info.level}: ${info.message} ${JSON.stringify({ ...rest })} `
if (process.env.NODE_ENV !== "production") {
    logger.add(
        new transports.Console({
            format: format.simple(),
        }),
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
logger.error = (err: any): Logger => {
    if (err instanceof Error) {
        return logger.log({ level: "error", message: `${err.stack || err}` });
    } else {
        return logger.log({ level: "error", message: err });
    }
};

// eslint-disable-next-line no-console
client.on("ready", () => console.log(`Logged in as ${client.user.tag}`));
client.on("debug", (data) => logger.info(data));
client.on("error", (err) => logger.error(err));
process.on("uncaughtException", (reason) => logger.error(reason));
process.on("unhandledRejection", (reason) => logger.error(reason));

// Authenticate to the top.gg api if we are in production mode and have a token
if (process.env.NODE_ENV === "production" && process.env.TOPGG_TOKEN) {
    const dbl = new DBL(process.env.TOPGG_TOKEN, client);
    dbl.on("posted", () => logger.info("Server count posted!"));
    dbl.on("error", (err) => logger.error(err));
}

client.login(process.env.DISCORD_TOKEN);
