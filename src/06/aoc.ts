import { XY } from "../common/base/points";
import { Direction, Grid2D, GridOptions, GridPoint } from "../common/grids/grid";

class Queue extends Array {
    private _maxLength: number;
    constructor(max: number) {
        super();
        this._maxLength = max;
    }
    // shift will remove 0th element
    enqueue(element: any) {
        this.push(element);
        if (this.length > this._maxLength) {
          //  this.shift();
        }
    }
}

class Guard extends GridPoint {
    // value is the index of Direction.Cardinals
    turn() {
        if (this.Value === Direction.Cardinals.length - 1) {
            this.Value = 0;
        } else {
            this.Value++;
        }
    }
    // Look Ahead
    look() {
        const cardinal = Direction.Cardinals[this.Value];
        const delta = Direction.CardinalToXY.get(cardinal);
        const next = this.copy().move(delta);
        // It can be nothing, an obstruction, or out of bounds
        return next;
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

        let stepsTaken = new Set<string>();
        while (this.inBounds(this.guard)) {
            stepsTaken.add(Grid2D.HashPointToKey(this.guard));
            // Look
            const ahead = this.guard.look();
            if (this.getPoint(ahead)) {
                // Obstruction
                this.guard.turn();
            } else {
                // Step
                this.guard.step();
            }
        }

        return stepsTaken.size;
    }

    public patrol2() {

        let stepsTaken = new Set<string>();
        const newObstaclePositions = new Set<string>();
        const obstacleHistory = [];  // new Queue(3); // Remember the last three obstacles
        while (this.inBounds(this.guard)) {
            stepsTaken.add(Grid2D.HashPointToKey(this.guard));
            // Look
            const ahead = this.guard.look();
            const pointAhead: GridPoint = this.getPoint(ahead);
            if (pointAhead) {
                // Obstruction
                this.guard.turn();
                obstacleHistory.push(pointAhead);
            } else {
                // Before you step, look right. Do you have a clear path to the obstacle 3 turns back?
if (this.guard.x === 4 && this.guard.y ===8){
    debugger;
}
                /// TODO! You have to look back at every 3rd in the history
                if (obstacleHistory.length>=3){
                    for (let i = obstacleHistory.length-3; i >=0; i= i - 4) {
                        // const element = array[i];
                        const behind3N = obstacleHistory[i];
                        if ( this.isPathClear(behind3N)) {
                            newObstaclePositions.add(Grid2D.HashPointToKey(ahead));
                        }
                    }
                }
                

                // if (stepHistory.length===3 && this.isPathClear(stepHistory[0])) {
                //     newObstaclePositions.add(Grid2D.HashPointToKey(ahead));
                // }
                // Step
                this.guard.step();
            }
        }

        return newObstaclePositions.size; // missing 3,8
    }

    private isPathClear(target: GridPoint) {
        const rightGuard = this.guard.clone();
        rightGuard.turn();


        // step until you're out of bounds or you find the obstacle from 3 turns ago.
        let clear = false;
        while (this.inBounds(rightGuard)) {
            rightGuard.step();
            if (this.getPoint(rightGuard) === target) {
                clear = true;
                break;
            }
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
    map.print();

    const solution = map.patrol2();
    return solution;
};
