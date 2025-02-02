import { XY } from "../common/base/points";
import { Direction } from "../common/grids/Direction";
import { Grid2D, GridPoint } from "../common/grids/grid";
import { DFS, PathfinderResult } from "../common/grids/pathfinding/dfs";

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
    // const parsed = parse(input);
    const solution = 0;
    return solution;
};
