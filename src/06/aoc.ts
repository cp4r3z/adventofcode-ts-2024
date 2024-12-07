import { XY } from "../common/base/points";
import { Direction, Grid2D, GridOptions, GridPoint } from "../common/grids/grid";

// class Queue extends Array {
//     private _maxLength: number;
//     constructor(max: number) {
//         super();
//         this._maxLength = max;
//     }
//     // shift will remove 0th element
//     enqueue(element: any) {
//         this.push(element);
//         if (this.length > this._maxLength) {
//             //  this.shift();
//         }
//     }
// }

class Guard extends GridPoint {

    private _xInitial: number;
    private _yInitial: number;
    private _vInitial: number;

    constructor(x: number, y: number, v: number) {
        super(x, y, v);
        this._xInitial = x;
        this._yInitial = y;
        this._vInitial = v; // This only works because it's a number. Objects wouldn't work
    }

    reset() {
        this.x = this._xInitial;
        this.y = this._yInitial;
        this.Value = this._vInitial;
    }

    // value is the index of Direction.Cardinals
    turn() {
        this.Value = this.right();
        // if (this.Value === Direction.Cardinals.length - 1) {
        //     this.Value = 0;
        // } else {
        //     this.Value++;
        // }
    }
    // Look Ahead
    look() {
        const cardinal = Direction.Cardinals[this.Value];
        const delta = Direction.CardinalToXY.get(cardinal);
        const next = this.copy().move(delta);
        // It can be nothing, an obstruction, or out of bounds
        return next;
    }
    // Returns an index of Direction.Cardinals
    right(): number {
        let dirIndex = this.Value;
        if (dirIndex === Direction.Cardinals.length - 1) {
            dirIndex = 0;
        } else {
            dirIndex++;
        }
        return dirIndex;
    }
    step() {
        const cardinal = Direction.Cardinals[this.Value];
        const delta = Direction.CardinalToXY.get(cardinal);
        return this.move(delta);
    }
    clone() {
        return new Guard(this.x, this.y, this.Value);
    }

    // TODO: override copy!
}

// Globals
const LabMapOptions: GridOptions = {
    setOnGet: false,
    defaultValue: '.'
}

class LabMap extends Grid2D {

    public guard: Guard;
    private _obstacleHistory: GridPoint[][];

    override setFromString2D = (input: string) => {
        input
            .split('\n')
            .forEach((row, y) => {
                row.split('').forEach((s, x) => {
                    const isObstruction = s === '#';
                    if (isObstruction) {
                        const point = new GridPoint(x, y, s);
                        this.setGridPoint(point);
                        return;
                    }
                    const isGuard = s === '^';
                    if (isGuard) {
                        this.guard = new Guard(x, y, 0); // 0 is the index of Direction.Cardinal.North
                        //this.setGridPoint(this.guard); We could...
                    }
                });
            });
    };

    public patrol() {

        //const obstacles = //new Map<Direction.Cardinal, GridPoint[]>(); // For Part 2
        this._obstacleHistory = Direction.Cardinals.map(v => []); // Just a simple 2D array

        const stepsTaken = new Set<string>();
        while (this.inBounds(this.guard)) {
            stepsTaken.add(Grid2D.HashPointToKey(this.guard));
            // Look
            const ahead = this.guard.look();
            const pointAhead: GridPoint = this.getPoint(ahead);
            if (pointAhead) {
                // Obstruction

                if (!this._obstacleHistory[this.guard.Value].includes(pointAhead)) {
                    this._obstacleHistory[this.guard.Value].push(pointAhead);
                }

                this.guard.turn();
            } else {
                // Step
                this.guard.step();
            }
        }

        return  stepsTaken.size;
    }

    public patrol2() {

        let stepsTaken = new Set<string>();
        const newObstaclePositions = new Set<string>();
        //const obstacleHistory = [];  // new Queue(3); // Remember the last three obstacles

        // TODO: OK, maybe we have to run the course once first.
        // Record the direction that we hit the obstacles
        // Create a map of direction -> obstacle[]

        while (this.inBounds(this.guard)) {
            stepsTaken.add(Grid2D.HashPointToKey(this.guard));
            // Look
            const ahead = this.guard.look();
            const pointAhead: GridPoint = this.getPoint(ahead);
            if (pointAhead) {
                // Obstruction
                this.guard.turn();
                //obstacleHistory.push(pointAhead);
            } else {
                // Before you step, look right. Do you have a clear path to the obstacle 3+4N turns back?
                //if (obstacleHistory.length >= 3) {
                // for (let i = obstacleHistory.length - 3; i >= 0; i = i - 4) {
                //     const behind3N = obstacleHistory[i];
                //     if (this.isPathClear(behind3N)) {
                //         newObstaclePositions.add(Grid2D.HashPointToKey(ahead));
                //     }
                // }
                const testright = this.guard.right();
                const testoh = this._obstacleHistory[this.guard.right()];
                if (this.guard.x === 4 && this.guard.y === 6) {
                    debugger;
                }
                this._obstacleHistory[this.guard.right()].forEach((gp: GridPoint) => {
                    if (this.isPathClear(gp)) {
                        newObstaclePositions.add(Grid2D.HashPointToKey(ahead));
                    }
                });
                //}
                // Step
                this.guard.step();
            }
        }

        return newObstaclePositions.size;
    }

    private isPathClear(target: GridPoint) {
        const rightGuard = this.guard.clone();
        rightGuard.turn();
        // step until you're out of bounds or you find the obstacle
        let clear = false;
        while (this.inBounds(rightGuard)) {
            if (this.getPoint(rightGuard) === target) {
                clear = true;
                break;
            }
            if (this.getPoint(rightGuard)) {
                break; // hit something
            }
            rightGuard.step();
        }
        return clear;
    }
}

export const part1 = async (input: string): Promise<number | string> => {
    const map = new LabMap(LabMapOptions);
    map.setFromString2D(input);
    //map.print();
    const solution = map.patrol();
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const map = new LabMap(LabMapOptions);
    map.setFromString2D(input);
    map.patrol();
    map.guard.reset();
    const solution = map.patrol2();
    //map.print();
    // const map2 = new LabMap(LabMapOptions);
    // map2.setFromString2D(input);
    // const solution = map2.patrol2(obstacleHistory);
    return solution;
};
