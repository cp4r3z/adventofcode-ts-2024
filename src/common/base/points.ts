import { IPoint } from "../types";
import { Vector3 } from "./vectors";

export interface IPoint1D extends IPoint { x: number };
export interface IPoint2D extends IPoint { x: number, y: number };
export interface IPoint3D extends IPoint { x: number, y: number, z: number };

export class X implements IPoint1D {
    x: number;

    constructor(x?: number) {
        this.x = x ? x : 0;
    }
    equals(other: IPoint1D): boolean {
        throw new Error("Method not implemented.");
    }

    copy = () => new X(this.x);
    move = (delta: X) => { this.x += delta.x; }
}

export class XY implements IPoint2D {
    static ManhattanDistance(a: IPoint2D, b: IPoint2D): number {
        return Math.abs(b.x - a.x) + Math.abs(b.y - a.y);
    }

    static AreEqual(a: IPoint2D, b: IPoint2D): boolean {
        return a.x === b.x && a.y === b.y;
    }

    // a - b
    static Diff(a: IPoint2D, b: IPoint2D): XY {
        return new XY(a.x - b.x, a.y - b.y);
    }

    x: number;
    y: number;

    constructor(x?: number, y?: number) {
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }

    // INode Implementation
    equals(other: IPoint2D): boolean {
        return XY.AreEqual(this, other);
    }

    copy = () => new XY(this.x, this.y);

    /**
     * AKA "Add"
     */
    move = (delta: IPoint2D | null) => {
        if (delta) {
            this.x += delta.x;
            this.y += delta.y;
        }
        return this;
    };

    multiply = (scalar: number) => {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }

    unit = () => {
        const magnitude = Math.sqrt((this.x * this.x + this.y * this.y));
        this.x /= magnitude;
        this.y /= magnitude;
        return this;
    }

    toString = () => `x:${this.x}, y:${this.y}`;

    getNeighbors = () => {

    };
}

export class XYZ implements IPoint3D {
    // static SubtractToVector(a: IPoint3D, b: IPoint3D): Vector3 {
    //     return new Vector3(a.x - b.x, a.y - b.y, a.z-b.z);
    // }

    x: number;
    y: number;
    z: number;

    constructor(x?: number, y?: number, z?: number) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    equals(other: IPoint3D): boolean {
        throw new Error("Method not implemented.");
    }

    copy = () => new XYZ(this.x, this.y, this.z);

    /**
     * AKA "Add"
     */
    move = (delta: XYZ): XYZ => {
        this.x += delta.x;
        this.y += delta.y;
        this.z += delta.z;
        return this;
    }

}

// Interesting... what were we trying to do here?
class Point2DMap extends Map {
    constructor(x?: number, y?: number) {
        super();
        this.set('x', x ? x : 0);
        this.set('y', y ? y : 0);
    }
}
