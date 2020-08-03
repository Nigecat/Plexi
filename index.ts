import { config } from "dotenv";
import { Plexi } from "./src/plexi";
import { existsSync, mkdirSync } from "fs";
import { createLogger, format, transports } from "winston";

// Load any environment variables into process.env
config();

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

const client = new Plexi();

client.on("ready", () => console.log(`Logged in as ${client.user.tag}`));
client.on("debug", (data) => logger.info(data));
client.on("error", (data) => logger.error(data));
process.on("uncaughtException", (data) => logger.error(data));
process.on("unhandledRejection", (data) => logger.error(data));

client.login(process.env.DISCORD_TOKEN);
