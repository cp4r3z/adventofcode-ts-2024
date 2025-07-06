import { XY } from "../common/base/points";
import { Direction } from "../common/grids/Direction";
import { Grid2D, GridPoint } from "../common/grids/grid";
import { DFS } from "../common/grids/pathfinding/dfs";
import { PathfinderResult } from "../common/types";

const pathCost = (path: GridPoint[]): number => {
    let cost = 0;
    let direction: XY = Direction.CardinalToXY.get(Direction.Cardinal.East);
    for (let i = 1; i < path.length; i++) {
        const gp: GridPoint = path[i];
        const gpLast: GridPoint = path[i - 1];
        const diff = XY.Diff(gp, gpLast);
        cost++;
        if (!XY.AreEqual(direction, diff)) {
            cost += 1000;
            direction = diff;
        }
    }

    return cost;
};

let END: GridPoint = null; // bad global
const neighborSort = (nodeA: GridPoint, nodeB: GridPoint) => {
    const manA = XY.ManhattanDistance(nodeA, END);
    const manB = XY.ManhattanDistance(nodeB, END);
    return manA - manB;

};

export const part1 = async (input: string): Promise<number | string> => {
    const grid = new Grid2D();
    grid.setFromString2D(input, {
        startString: 'S',
        endString: 'E'
    });
    //grid.print();
    END = grid.end;
    const pathfinder = new DFS(grid);
    pathfinder.neighborFilter = (gp: GridPoint) => !pathfinder.stack.includes(gp) && gp?.Value !== '#';
    pathfinder.pathCost = pathCost;
    //pathfinder.neighborSort = neighborSort;
    // pathfinder.bestCost = 109517; // This will be useful for Part 2.
    const { path, cost }: PathfinderResult = pathfinder.findPath();
    //grid.print({ path: path as GridPoint[] });
    const solution = cost;
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const grid = new Grid2D();
    grid.setFromString2D(input, {
        startString: 'S',
        endString: 'E'
    });
    //grid.print();
    END = grid.end;
    const pathfinder = new DFS(grid);
    pathfinder.neighborFilter = (gp: GridPoint) => !pathfinder.stack.includes(gp) && gp?.Value !== '#';
    pathfinder.pathCost = pathCost;
    //pathfinder.neighborSort = neighborSort;
    // pathfinder.bestCost = 109517; // This will be useful for Part 2.
    const { path, cost }: PathfinderResult = pathfinder.findPath();
    //grid.print({ path: path as GridPoint[] });

    // At this point, all reachable points have a value in the _nodeCostMap

    // Start at the "end", so the end is in "next steps"
    // go along the path, look at neighbors
    // Is the neighbor value -1 or -1000? << could we be sneaky and not even check direction?
    // If so, add to the "next steps" Set.
    // Do this until there are no steps in the next steps.

    const solution = cost;
    return solution;
};
