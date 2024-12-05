function parse(input: string) {
    const toNumberArray = (s: string): number[] => {
        const re: RegExp = /(-?\d+)/g;
        const matches = s.match(re) || [];
        const numbers = matches.map(sm => parseInt(sm));
        return numbers;
    };

    const sections = input
        .split('\n\n');

    const rules = sections[0].split('\n').map(toNumberArray);
    const updates = sections[1].split('\n').map(toNumberArray);
    return { rules, updates };
};

let RULES = []; // cheeky global

// Takes in an update and processes all rules
const isRightOrder = (pages: number[]): boolean => {
    const right = RULES.every(rule => {
        // find index of both pages in rule
        const first = pages.indexOf(rule[0]);
        if (first === -1) return true;
        const second = pages.indexOf(rule[1]);
        if (second === -1) return true;
        return first < second;
    });
    return right;
};

// Adds the middle index value to an running total
const middleSum = (sum: number, update: number[]): number => {
    const middle = update[(update.length - 1) / 2];
    return sum + middle;
};

export const part1 = async (input: string): Promise<number | string> => {
    const { rules, updates } = parse(input);
    RULES = rules;

    const solution = updates
        .filter(isRightOrder)
        .reduce(middleSum, 0);

    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const { rules, updates } = parse(input);
    RULES = rules;

    // Custom sort
    const byRule = (pageA: number, pageB: number) => {
        const right = RULES.every(rule => {
            // find index of both pages in rule
            const a = rule.indexOf(pageA);
            if (a === -1) return true;
            const b = rule.indexOf(pageB);
            if (b === -1) return true;
            return a < b;
        });
        return right ? -1 : 1;
    };

    const solution = updates
        .filter(pages => !isRightOrder(pages))
        .map((update: number[]) => update.sort(byRule))
        .reduce(middleSum, 0);

    return solution;
};
