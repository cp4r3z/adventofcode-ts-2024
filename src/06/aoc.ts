import { IPoint2D } from "../common/base/points";
import { Direction, Grid2D, GridOptions, GridPoint } from "../common/grids/grid";

type PatrolResult = {
    visited: Set<string>,
    looped: boolean,
    outOfBounds: boolean
};

// this.Value is the index of Direction.Cardinals
class Guard extends GridPoint {

    public visited: Set<string>;
    private _xInitial: number;
    private _yInitial: number;
    private _vInitial: number;
    private _map: LabMap;

    constructor(x: number, y: number, v: number, map: LabMap) {
        super(x, y, v);
        this._xInitial = x;
        this._yInitial = y;
        this._vInitial = v; // This only works because it's a number. Objects wouldn't work
        this._map = map;
        this.visited = new Set<string>();
    }

    isInitial(point: IPoint2D): boolean {
        return point.x === this._xInitial && point.y === this._yInitial;
    }

    // needed?
    reset() {
        this.x = this._xInitial;
        this.y = this._yInitial;
        this.Value = this._vInitial;
        this.visited = new Set<string>();
    }

    turn() {
        this.Value = this.right();
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
        return new Guard(this.x, this.y, this.Value, this._map);
    }

    patrol(): PatrolResult {

        const result: PatrolResult = {
            visited: this.visited,
            looped: false,
            outOfBounds: false
        }

        const loopSet = new Set<string>();
        while (this._map.inBounds(this)) {

            // Remember all visited points
            const pointKey = Grid2D.HashPointToKey(this);
            this.visited.add(pointKey);

            // Loop Detection
            const pointDirectionKey = `${pointKey}@${this.Value}`;
            if (loopSet.has(pointDirectionKey)) {
                result.looped = true;
                return result;
            }

            const ahead = this.look();
            const pointAhead: GridPoint = this._map.getPoint(ahead);

            if (pointAhead) {
                loopSet.add(pointDirectionKey);
                this.turn();
            } else {
                this.step();
            }
        }

        result.outOfBounds = true;
        return result;
    }
}

class LabMap extends Grid2D {

    public guard: Guard; // By having a single guard, we limit ourselves to a single thread

    override setFromString2D = (input: string) => {
        input.split('\n').forEach((row, y) => {
            row.split('').forEach((s, x) => {
            if (s === '#') {
                this.setGridPoint(new GridPoint(x, y, s));
            } else if (s === '^') {
                this.guard = new Guard(x, y, 0, this); // 0 is the index of Direction.Cardinal.North
            }
            });
        });
    };

    countLoopingObstacles(potentialObstacles: Set<string>): number {
        let loopCount = 0;
        for (const key of potentialObstacles.keys()) {
            const obstacle = Grid2D.HashKeyToXY(key);
            if (this.guard.isInitial(obstacle)) {
                continue;
            }

            // Place an obstacle temporarily
            const obstaclePoint = new GridPoint(obstacle.x, obstacle.y, 'O');
            this.setGridPoint(obstaclePoint);

            // Patrol
            this.guard.reset();
            const resultWithObstacle = this.guard.patrol();
            if (resultWithObstacle.looped) {
                loopCount++;
            }

            // Cleanup
            this.deletePoint(obstaclePoint);

        }
        return loopCount;
    }
}

export const part1 = async (input: string): Promise<number | string> => {
    const LabMapOptions: GridOptions = {
        setOnGet: false,
        defaultValue: '.'
    }
    const map = new LabMap(LabMapOptions);
    map.setFromString2D(input);
    //map.print();
    const result: PatrolResult = map.guard.patrol();
    return result.visited.size;
};

export const part2 = async (input: string): Promise<number | string> => {
    const LabMapOptions: GridOptions = {
        setOnGet: false,
        defaultValue: '.'
    }
    const map = new LabMap(LabMapOptions);
    map.setFromString2D(input);
    const result: PatrolResult = map.guard.patrol();
    const loopCount = map.countLoopingObstacles(result.visited);
    return loopCount;
};
