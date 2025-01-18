import { XY } from "../common/base/points";

type Buttons = {
    A: number;
    B: number;
}

class Machine {
    constructor(public aButton: XY, public bButton: XY, public prize: XY) { }

    convertUnits() {
        this.prize.move(new XY(1e13, 1e13));
        return this;
    }

    round(float: number): number | null {
        //const MAGIC_NUMBER = Math.sqrt( Number.EPSILON);
        const MAGIC_NUMBER = 1e-3; // ew

        const rounded = Math.round(float);
        const diff = Math.abs(rounded - float);
        if (diff < MAGIC_NUMBER) {
            return rounded;
        }
        return null;
    }

    minTokens(): Buttons {

        const mA = this.aButton.y / this.aButton.x;
        const mB = this.bButton.y / this.bButton.x;

        // Find the intersection of two lines.
        // (y-y1) = m*(x-x1)
        // This is after some substitution:
        const X = (this.prize.y - (this.prize.x * mB)) / (mA - mB);
        const Y = X * mA;

        const aPresses = X / this.aButton.x;
        const XtoP = this.prize.x - X;
        const bPresses = XtoP / this.bButton.x;

        // Find the number of presses. This should be an integer.
        // The trouble is that there is some floating point error that gets very magnified.
        const aPressesRounded = this.round(aPresses);
        const bPressesRounded = this.round(bPresses);

        if (!aPressesRounded || !bPressesRounded) {
            return null;
        }
        return {
            A: aPressesRounded,
            B: bPressesRounded
        };
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
    const solution = parsed
        .map(machine => machine.minTokens())
        .filter(presses => !!presses)
        .map(toCost)
        .reduce((sum, cur) => sum + cur, 0);
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    const solution = parsed
        .map(machine => machine.convertUnits()) // Part 2
        .map(machine => machine.minTokens())
        .filter(presses => !!presses)
        .map(toCost)
        .reduce((sum, cur) => sum + cur, 0);
    return solution;
};
