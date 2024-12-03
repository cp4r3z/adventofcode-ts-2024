function parse(input: string) {

    const toNumberArray = (s: string): number[] => {
        const re: RegExp = /(-?\d+)/g;
        const matches = s.match(re);
        const numbers = matches.map(sm => parseInt(sm));
        return numbers;
    };

    return input
        .split('\n')
        .map(toNumberArray);
};

function isSafe(numArray: number[], tolerance: number = 0): boolean {
    let badRemaining = tolerance;
    let sign = null;
    for (let i = 1; i < numArray.length; i++) {
        let safe = true;
        let diff = numArray[i] - numArray[i - 1];
        const diffSign = Math.sign(diff);
        if (!sign) {
            sign = Math.sign(diff);
        } else if (diffSign !== sign) {
            safe = false;
        }
        diff = Math.abs(diff);
        if (diff < 1 || diff > 3) {
            safe = false;
        }
        if (!safe) {
            if (badRemaining === 0) {
                return false;
            }

            // Part 2: Remove i or i-1 and try again
            let removeFirst = [...numArray]
            removeFirst.splice(i, 1);
            let removeSecond = [...numArray];
            removeSecond.splice(i - 1, 1);
            return isSafe(removeFirst) || isSafe(removeSecond);
        }
    }
    return true;
}

export const part1 = async (input: string): Promise<number | string> => {
    const levels = parse(input);
    const solution = levels.filter(l => isSafe(l)).length;
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const levels = parse(input);
    const solution = levels.filter(l => isSafe(l, 1)).length;
    return solution;
};
