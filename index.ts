import { Plexi } from "./src/Plexi";
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
        supportServer: "621181741972979722",
        owner: "307429254017056769",
        databasePath: "./data/data.sqlite",
        prefix: "$",
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
} else {
    // Only block all errors in production
    process.on("uncaughtException", (reason) => logger.error(reason));
    process.on("unhandledRejection", (reason) => logger.error(reason));
    client.on("error", (data) => logger.error(data));
}

// eslint-disable-next-line no-console
client.on("ready", () => console.log(`Logged in as ${client.user.tag}`));
client.on("debug", (data) => logger.info(data));

client.login(process.env.DISCORD_TOKEN);
