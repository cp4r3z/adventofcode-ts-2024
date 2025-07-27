class Computer {
    public Registers = {
        A: 2024, B: 0, C: 0
    }
    protected opcode = new Array<Function>(8);
    protected instructionIndex: number = 0;
    public output = [];

    constructor(protected program: number[]) {

        //adv
        this.opcode[0] = function (operand: number): void {
            const opvalue = this._getOperandValue(operand);
            const numerator = this.Registers.A;
            const denominator = Math.pow(2, opvalue);
            const divide = Math.trunc(numerator / denominator);
            this.Registers.A = divide;
            this.instructionIndex += 2;
        }
        //bdv
        this.opcode[6] = function (operand: number): void {
            const opvalue = this._getOperandValue(operand);
            const numerator = this.Registers.A;
            const denominator = Math.pow(2, opvalue);
            const divide = Math.trunc(numerator / denominator);
            this.Registers.B = divide;
            this.instructionIndex += 2;
        }
        //cdv
        this.opcode[7] = function (operand: number): void {
            const opvalue = this._getOperandValue(operand);
            const numerator = this.Registers.A;
            const denominator = Math.pow(2, opvalue);
            const divide = Math.trunc(numerator / denominator);
            this.Registers.C = divide;
            this.instructionIndex += 2;
        }
        //bxl
        this.opcode[1] = function (operand: number): void {
            const opvalue = operand;
            const xor = this.Registers.B ^ opvalue;
            this.Registers.B = xor;
            this.instructionIndex += 2;
        }
        //bst
        this.opcode[2] = function (operand: number): void {
            const opvalue = this._getOperandValue(operand);
            const mod = opvalue % 8;
            this.Registers.B = mod;
            this.instructionIndex += 2;
        }
        //bxc
        this.opcode[4] = function (operand: number): void {
            const xor = this.Registers.B ^ this.Registers.C;
            this.Registers.B = xor;
            this.instructionIndex += 2;
        }
        //jnz
        this.opcode[3] = function (operand: number): void {
            if (this.Registers.A === 0) {
                this.instructionIndex += 2;
                return;
            }
            this.instructionIndex = operand;
            // Do not increment
        }
        //out
        this.opcode[5] = function (operand: number): void {
            const opvalue = this._getOperandValue(operand);
            this.output.push(opvalue % 8);
            this.instructionIndex += 2;
        }
    }

    // Combo Operand
    private _getOperandValue(operand: number): number {
        if (operand <= 3) return operand;
        if (operand === 4) return this.Registers.A;
        if (operand === 5) return this.Registers.B;
        if (operand === 6) return this.Registers.C;
        if (operand === 7) {
            console.warn('Reserved');
        }
        return -1;
    }

    run(): string {
        while (this.instructionIndex < this.program.length) {
            const opcodeIndex = this.program[this.instructionIndex];
            const op = this.opcode[opcodeIndex];
            const operand = this.program[this.instructionIndex + 1];
            op.bind(this)(operand);
        }
        return this.output.join(',');
    }
}

function parse(input: string) {
    const toNumberArray = (s: string): number[] => {
        const re: RegExp = /(-?\d+)/g;
        const matches = s.match(re);
        const numbers = matches.map(sm => parseInt(sm));
        return numbers;
    };

    const RP = input
        .split('\n\n');

        const registers = toNumberArray( RP[0]);
           const program = toNumberArray( RP[1]);
    return {
        registers,program
    }
};

export const part1 = async (input: string): Promise<number | string> => {
    const parsedInput = parse(input);
    const computer = new Computer(parsedInput.program);
    computer.Registers.A = parsedInput.registers[0];
    computer.Registers.B = parsedInput.registers[1];
    computer.Registers.C = parsedInput.registers[2];
    const output = computer.run();
    const solution = output;
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {

    const solution = 0;
    return solution;
};
