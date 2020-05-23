import config from "../data/config.json";

export default function log(type: string, text: (string | Error)): void {
    if (config.debug.enabled) {
        if (config.debug.debug && type === "debug") {
            console.log(text);
        }

        else if (config.debug.database && type === "database") {
            logYellow(`[${type}] ${text}`);
        }

        else if (config.debug.ready && type === "ready") {
            logGreen(`[${type}] ${text}`);
        }

        else if (config.debug.status && type === "status") {
            logBlue(`[${type}] ${text}`);
        }

        else if (config.debug.database && type === "database") {
            logRed(`[${type}] ${text}`);
        }
    }
}



function logGreen(text: string): void {
    console.log("\x1b[32m%s\x1b[0m", text);
}

function logRed(text: string | Error): void {
    console.log("\x1b[31m%s\x1b[0m", text);
}

function logYellow(text: string): void {
    console.log("\x1b[33m%s\x1b[0m", text);
}

function logBlue(text: string): void {
    console.log("\x1b[34m%s\x1b[0m", text);
}