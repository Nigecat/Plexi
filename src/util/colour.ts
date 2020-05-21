
export function logGreen(text: string): void {
    console.log("\x1b[32m%s\x1b[0m", text);
}

export function logRed(text: string | Error): void {
    console.log("\x1b[31m%s\x1b[0m", text);
}

export function logYellow(text: string): void {
    console.log("\x1b[33m%s\x1b[0m", text);
}

export function logBlue(text: string): void {
    console.log("\x1b[34m%s\x1b[0m", text);
}