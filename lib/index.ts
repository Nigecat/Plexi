/* eslint-disable */

import { manipulateImage } from "../src/utils/image";

export interface lib {
    manipulateImage: (input: string, output: string, contrast: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lib: lib = require("./build/Release/lib");

(async () => {
    const start = process.hrtime.bigint();
    lib.manipulateImage("W:/Meme-Formats/stonks.png", "stonks.jpg", 300);
    //await manipulateImage("https://cdn.discordapp.com/attachments/587782757824987141/789710109755572224/unknown.png", 1, 0.3);
    const end = process.hrtime.bigint();
    console.log(`\n\nProcess took ${(end - start) / 1_000_000n}ms`);
})();

export default lib;
