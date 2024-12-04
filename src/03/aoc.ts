function parse(input: string) {

    const re: RegExp = /mul\((\d+),(\d+)\)/g; // get the mul(x,y) string
    const reDigits: RegExp = /(-?\d+)/g; // get just the digits
    const mulMatches = input.match(re);

    return mulMatches.map((mul: string) => {
        return mul
            .match(reDigits)
            .map(s => parseInt(s));
    });
};

export const part1 = async (input: string): Promise<number | string> => {
    const numberPairs = parse(input);
    const solution = numberPairs.reduce((total: number, pair: number[]) => total + pair[0] * pair[1], 0);
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const reDontDo: RegExp = /don\'t\(\).+?do\(\)/g; //(.*?) lazy match
    const reDontEnd: RegExp = /don\'t\(\).*?$/g; // remove last bit
    input = input
        .replace(/\n|\r/g, "") // remove all line endings
        .replace(reDontDo, "")
        .replace(reDontEnd, "");

    const numberPairs = parse(input);
    const solution = numberPairs.reduce((total: number, pair: number[]) => total + pair[0] * pair[1], 0);
    return solution;
};
