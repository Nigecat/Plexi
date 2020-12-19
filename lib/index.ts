export interface lib {
    manipulate_image: (input: string, output: string, contrast: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lib: lib = require("./build/Release/lib");

const start = process.hrtime();
lib.manipulate_image("W:/Meme-Formats/stonks.png", "stonks.jpg", 300);
const end = process.hrtime();
console.log(`${end[0] - start[0]}.${end[1] - start[1]}`);

export default lib;
