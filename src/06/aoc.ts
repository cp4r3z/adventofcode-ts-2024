import { XY } from "../common/base/points";
import { Direction, Grid2D, GridOptions, GridPoint } from "../common/grids/grid";

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

    const solution = 0;
    return solution;
};
