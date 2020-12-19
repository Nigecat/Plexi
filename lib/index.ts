export interface lib {
    manipulate_image: (input: string, output: string, contrast: number) => void;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lib: lib = require("./build/Release/lib");

lib.manipulate_image("W:/Meme-Formats/stonks.png", "stonks.jpg", 300);

export default lib;
