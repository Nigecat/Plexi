export interface lib {
    fn: () => string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lib: lib = require("./build/Release/lib");

console.log(lib.fn());

export default lib;
