import { part1, part2 } from './aoc';
import * as Input from '../common/input';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Rectangle } from '../common/base/shapes';
import { XY } from '../common/base/points';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tinput = await Input.tinput(__dirname);
const tinput2 = await Input.tinput2(__dirname);
const input = await Input.input(__dirname);

describe(`Day 01`, () => {
    it('Part 1', async () => {
        const solution = await part1(tinput);
        expect(solution).toBe(0);
    });

    xit('Part 1 (Real Input)', async () => {
        const bounds = new Rectangle(new XY(2e14, 2e14), new XY(4e14, 4e14));
        const solution = await part1(tinput);
        console.log('Part 1 (Real Input)');
        console.log(solution);
    });

    xit('Part 2', async () => {
        const bounds = new Rectangle(new XY(7, 7), new XY(27, 27));
        const solution = await part2(tinput, bounds);
        expect(solution).toBe(0);
    });

    xit('Part 2 (Real Input)', async () => {
        const bounds = new Rectangle(new XY(7, 7), new XY(27, 27));
        const solution = await part2(input, bounds);
        console.log('Part 2 (Real Input)');
        console.log(solution);
    });
});
