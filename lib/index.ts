export interface lib {
    fn: () => string;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const lib: lib = require("./build/Release/lib");

lib.fn();

export default lib;
