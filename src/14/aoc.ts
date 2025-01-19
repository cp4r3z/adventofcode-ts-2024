import { XY } from "../common/base/points";
import { Rectangle } from "../common/base/shapes";
import { Grid2D } from "../common/grids/grid";
import { ChineseRemainder } from "../common/math/arithmetic";

class Robot {
    constructor(public pos: XY, public vel: XY) { }

    /// x = width, y= height, s = seconds
    simulate(x: number, y: number, s: number) {
        let x2 = this.pos.x + this.vel.x * s;
        x2 = x2 % x;
        if (x2 < 0) x2 += x;
        let y2 = this.pos.y + this.vel.y * s;
        y2 = y2 % y;
        if (y2 < 0) y2 += y;
        this.pos.x = x2;
        this.pos.y = y2;
    }
}

class Bathroom {

    private _areas: Robot[][];
    constructor(public x: number, public y: number) { }

    addRobots(robots: Robot[]) {

        /**
        * 01
        * 23
        */

        this._areas = Array.from(Array(4), () => new Array());

        const midY = (this.y - 1) / 2;
        const midX = (this.x - 1) / 2;
        let area = -1;
        for (const r of robots) {
            if (r.pos.y < midY) {
                // Is Area 0 or 1
                if (r.pos.x < midX) {
                    area = 0;
                } else if (r.pos.x > midX) {
                    area = 1;
                }
            } else if (r.pos.y > midY) {
                // Is Area 2 or 3
                if (r.pos.x < midX) {
                    area = 2;
                } else if (r.pos.x > midX) {
                    area = 3;
                }
            }
            if (area > -1) {
                this._areas[area].push(r);
            }
            area = -1;
        }
    }

    public get safetyFactor(): number {
        return this._areas.reduce((total, cur) => total * cur.length, 1);
    }
}

function printRobots(robots: Robot[], x: number, y: number) {
    const grid = new Grid2D({
        setOnGet: false,
        defaultValue: '.'
    });
    grid.setBounds(new Rectangle(new XY(), new XY(x - 1, y - 1)));
    for (const r of robots) {
        grid.setPoint(r.pos, "X");
    }
    grid.print();
    console.log('');
}

function parse(input: string) {
    const toNumberArray = (s: string): number[] => {
        const re: RegExp = /(-?\d+)/g;
        const matches = s.match(re) || [];
        const numbers = matches.map(Number);
        return numbers;
    };

    const toRobot = (n: number[]): Robot => {
        return new Robot(new XY(n[0], n[1]), new XY(n[2], n[3]));
    }

    return input
        .split('\n')
        .map(toNumberArray)
        .map(toRobot);
};

export const part1 = async (input: string, x: number, y: number, s: number): Promise<number | string> => {
    const robots = parse(input);
    for (const r of robots) {
        r.simulate(x, y, s)
    }
    const bathroom = new Bathroom(x, y);
    bathroom.addRobots(robots);
    const solution = bathroom.safetyFactor;
    return solution;
};

export const part2 = async (input: string, x: number, y: number, s: number): Promise<number | string> => {
    const robots = parse(input);

    // Use this to find "patterns" in the noise:

    /*
     let seconds = 0;
     while (seconds < 200) {
         seconds++;
         for (const r of robots) {
             r.simulate(x, y, 1);
         }
         const bathroom = new Bathroom(x, y);
         bathroom.addRobots(robots);
         console.log('---')
         console.log(`Seconds = ${seconds}`);
         //printRobots(robots, x, y);
     }
    */

    const num = [101, 103];
    const rem = [12, 88];
    const k = num.length;
    const merge = ChineseRemainder(num, rem, k);

    for (const r of robots) {
        r.simulate(x, y, merge);
    }
    const bathroom = new Bathroom(x, y);
    bathroom.addRobots(robots);
    printRobots(robots, x, y);

    const solution = merge;
    return solution;
};
