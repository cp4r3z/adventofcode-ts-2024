function parse(input: string) {
    const left: number[] = [];
    const right: number[] = [];
    const toNumberArray = (s: string): void => {
        const re: RegExp = /(-?\d+)/g;
        const matches = s.match(re);
        const numbers = matches.map(sm => parseInt(sm));
        left.push(numbers[0]);
        right.push(numbers[1]);
    };

    input
        .split('\n')
        .forEach(toNumberArray);

    return {
        left,
        right
    }
};

export const part1 = async (input: string): Promise<number | string> => {
    const { left, right } = parse(input);
    left.sort();
    right.sort();
    const part1 = left.reduce((total, l, i) => total + Math.abs(l - right[i]), 0);
    return part1;
};

export const part2 = async (input: string): Promise<number | string> => {
    const { left, right } = parse(input);
    const part2 = left.reduce((total, l) => total + l * right.filter(r => r === l).length, 0);
    return part2;
};
