import { part1, part2 } from './aoc';
import * as Input from '../common/input';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tinput = await Input.tinput(__dirname);
const tinput2 = await Input.tinput2(__dirname);
const input = await Input.input(__dirname);

describe(`Day 16`, () => {
    it('Part 1', async () => {
        const solution = await part1(tinput);
        expect(solution).toBe(7036);
    });

    it('Part 1 (Test Input 2', async () => {
        const solution = await part1(tinput2);
        expect(solution).toBe(11048);
    });

    xit('Part 1 (Real Input)', async () => {
        const solution = await part1(input);
        console.log('Part 1 (Real Input)');
        console.log(solution);
    });

    it('Part 2 (Test Input)', async () => {
        const solution = await part2(tinput);
        expect(solution).toBe(45);
    });

    it('Part 2 (Test Input 2', async () => {
        const solution = await part2(tinput2);
        expect(solution).toBe(64);
    });

    xit('Part 2 (Real Input)', async () => {
        const solution = await part2(input);
        console.log('Part 2 (Real Input)');
        console.log(solution);
    });
});
