
import { Direction, Grid2D, GridOptions, GridPoint, String2DOptions } from "../common/grids/grid";
import { XY, IPoint2D, XYZ } from "../common/base/points";
import { Ray3 } from "../common/base/lines";
import { Vector3 } from "../common/base/vectors";
import { Rectangle } from "../common/base/shapes";

function parse(input: string) {
    const toNumberArray = (s: string): number[] => {
        const re: RegExp = /(-?\d+)/g;
        const matches = s.match(re);
        const numbers = matches.map(sm => parseInt(sm));
        return numbers;
    };

    const toRay = (n: number[]): Ray3 => {
        const origin: XYZ = new XYZ(n[0], n[1], n[2]);
        const direction: Vector3 = new Vector3(n[3], n[4], n[5]);
        return new Ray3(origin, direction);
    };

    return input
        .split('\n')
        .map(toNumberArray)
        .map(toRay);
};

export const part1 = async (input: string): Promise<number | string> => {
   return 0;
};

export const part2 = async (input: string, bounds: Rectangle): Promise<number | string> => {
    return 0;
};
