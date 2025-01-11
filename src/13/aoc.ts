import { XY } from "../common/base/points";

type Buttons = {
    A: number;
    B: number;
}

class Machine {
    constructor(public aButton: XY, public bButton: XY, public prize: XY) { }

    minTokens(): Buttons {
        // ok , let's start with the cheap one (b)
        let bPressesToBeyondX = Math.ceil(this.prize.x / this.bButton.x);
        let bPressesToBeyondY = Math.ceil(this.prize.y / this.bButton.y);
        let bPresses = Math.max(bPressesToBeyondX, bPressesToBeyondY);
        let aPresses = 0;

        let point = new XY(this.bButton.x * bPresses, this.bButton.y * bPresses);
        const aN = new XY(-this.aButton.x, -this.aButton.y);
        const bN = new XY(-this.bButton.x, -this.bButton.y);

        const isFar = (): boolean => {
            // Note: This could return true if we're at the prize
            return point.x >= this.prize.x && point.y >= this.prize.y;
        }

        if (!isFar()){
             // Should not happen
            return null;
        }

        while (bPresses >= 0) {
            if (point.equals(this.prize)) {
                break; // Note: I'm not sure how we get here logically, but we do.
            }

            while (isFar()) {
                // Decrement B Presses while we're "far"
                point.move(bN);
                bPresses--;
                if (point.equals(this.prize)){
                    break;
                }
            }

            while (!isFar()) {
                // Increment A Presses until we're "far" again
                point.move(this.aButton);
                aPresses++;
                if (point.equals(this.prize)){
                    break;
                }
            }

        }

        if (bPresses <= 0) {
            return null;
        }

        if (aPresses > 100 || bPresses > 100) {
            // Should not happen
            return null;
        }

        return {
            A: aPresses,
            B: bPresses
        }

    }
}

function parse(input: string) {
    const toNumberArray = (s: string): number[] => {
        const re: RegExp = /(-?\d+)/g;
        const matches = s.match(re) || [];
        const numbers = matches.map(Number);
        return numbers;
    };

    const toMachine = (group: string): Machine => {
        const lines = group.split('\n').map(toNumberArray);
        const a: XY = new XY(lines[0][0], lines[0][1]);
        const b: XY = new XY(lines[1][0], lines[1][1]);
        const p: XY = new XY(lines[2][0], lines[2][1]);
        return new Machine(a, b, p);
    };

    return input
        .split('\n\n')
        .map(toMachine);
};

const toCost = (presses: Buttons): number => {
    if (!presses) {
        // This should have been filtered out
        debugger;
    }
    // A = 3 tokens | B = 1 token
    return presses.A * 3 + presses.B;
}

export const part1 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    const t = parsed[1].minTokens();
    const t2 = parsed
        .map(machine => machine.minTokens());
    const solution = parsed
        .map(machine => machine.minTokens())
        .filter(presses => !!presses)
        .map(toCost)
        .reduce((sum, cur) => sum + cur, 0);
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const parsed = parse(input); const solution = 0;
    return solution;
};
