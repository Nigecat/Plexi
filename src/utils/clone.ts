/**
 * Clone an object
 * @param {T} value - The value to clone
 * @returns The cloned value
 */
export function clone<T>(value: T): T {
    return Object.assign({}, value);
}
