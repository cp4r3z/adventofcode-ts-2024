import { part1, part2 } from './aoc';
import * as Input from '../common/input';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tinput = await Input.tinput(__dirname);
const tinput2 = await Input.tinput2(__dirname);
const input = await Input.input(__dirname);

describe(`Day 17`, () => {
    it('Part 1', async () => {
        const solution = await part1(tinput);
        expect(solution).toBe("4,2,5,6,7,7,7,7,3,1,0");
    });

    it('Part 1 (Test Input 2', async () => {
        const solution = await part1(tinput2);
        expect(solution).toBe("");
    });

    xit('Part 1 (Real Input)', async () => {
        const solution = await part1(input);
        console.log('Part 1 (Real Input)');
        console.log(solution);
    });

    xit('Part 2 (Test Input)', async () => {
        const solution = await part2(tinput);
        expect(solution).toBe(45);
    });

    xit('Part 2 (Test Input 2', async () => {
        const solution = await part2(tinput2);
        expect(solution).toBe(64);
    });

    xit('Part 2 (Real Input)', async () => {
        const solution = await part2(input);
        console.log('Part 2 (Real Input)');
        console.log(solution);
    });
});
