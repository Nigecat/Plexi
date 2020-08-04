import * as DBL from "dblapi.js";
import { Plexi } from "./src/Plexi";
import { version } from "./package.json";
import { config as loadEnv } from "dotenv";
import { existsSync, mkdirSync } from "fs";
import { createLogger, format, transports } from "winston";

// Create the bot
const client = new Plexi({
    client: {
        allowedMentions: { roles: [], users: [] },
        presence: {
            status: "online",
            activity: {
                type: "PLAYING",
                name: "$help",
            },
        },
    },
    plexi: {
        supportServer: "https://discord.gg/ZbaXJDF",
        owner: "307429254017056769",
        databasePath: "./data/data.sqlite",
        prefix: "$",
        version: version,
    },
});

// Load any environment variables into process.env
loadEnv();

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
logger.error = (err: any): any => {
    if (err instanceof Error) {
        logger.log({ level: "error", message: `${err.stack || err}` });
    } else {
        logger.log({ level: "error", message: err });
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
