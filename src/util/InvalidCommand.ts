
export default class InvalidCommand extends Error {
    public name: string;
    constructor(message: string) {
        super(message);
        this.name = "InvalidCommand";
    }
}