import { part1, part2 } from './aoc';
import * as Input from '../common/input';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tinput = await Input.tinput(__dirname);
const tinput2 = await Input.tinput2(__dirname);
const input = await Input.input(__dirname);

describe(`Day 14`, () => {
    it('Part 1', async () => {
        const solution = await part1(tinput, 11, 7, 100);
        expect(solution).toBe(12);
    });

    xit('Part 1 (Real Input)', async () => {
        // "101 tiles wide and 103 tiles tall"
        const solution = await part1(input, 101, 103, 100);
        console.log('Part 1 (Real Input)');
        console.log(solution);
    });

    // No real test for Part 2
    xit('Part 2', async () => {
        const solution = await part2(tinput, 11, 7, 100);
        expect(solution).toBe(0);
    });

    xit('Part 2 (Real Input)', async () => {
        const solution = await part2(input, 101, 103, 100);
        console.log('Part 2 (Real Input)');
        console.log(solution);
    });
});
