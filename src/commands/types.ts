const argumentTypes: ArgumentTypes = {
    string: {
        validate: (): boolean => true,
        parse: (val: string): string => val,
    },
};

export default argumentTypes;

export interface ArgumentTypes {
    [type: string]: {
        validate: (val: string) => boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parse: (val: string) => any;
    };
}
