import { Direction } from "../common/grids/Direction";
import { Dijkstra } from "../common/graphs/pathfinding/dijkstra";
import { Grid2D as OrientedGrid, GridPoint as OrientedGridPoint, ParseOptions } from "../common/grids/oriented/Grid2D";

const getPathFinder = (input: string): Dijkstra => {

    const parseOptions: ParseOptions = {
        parseInt: false,
        startString: 'S',
        startOrientation: Direction.Cardinal.East,
        endString: 'E',
        ignoreStrings: ['#'],
        gridOptions: {
            setOnGet: false,
            defaultValue: '.'
        }
    };

    // Parse the input into an OrientedGrid
    const grid = OrientedGrid.parse(input, parseOptions);
    grid.getWeight = function (from: OrientedGridPoint, to: OrientedGridPoint): number {
        return from.orientation === to.orientation ? 1 : 1001; // 1000 for changing direction + 1 for moving in the same direction
    }

    // Create a Dijkstra pathfinder instance
    return new Dijkstra(grid);
}

export const part1 = async (input: string): Promise<number | string> => {

    const pathfinder = getPathFinder(input);

    let tile = pathfinder.ends.values().next().value; // Get the first end tile
    let points = 0;

    while (tile) {
        const prev = pathfinder.prev.get(tile)[0]; // Get the first previous point
        if (!prev) {
            break; // No previous point, exit the loop
        }
        points += pathfinder.graph.getWeight(tile, prev); // Add the weight of the edge to the total points
        tile = prev; // Move to the next point
    }

    const solution = points;
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {

    const pathfinder = getPathFinder(input);

    // Walk the grid to find all the shortest paths from the start point to all reachable tiles
    const S: Set<string> = new Set();
    const P: Set<OrientedGridPoint> = new Set(); // Previous points, to avoid cycles

    pathfinder.ends.forEach((end: OrientedGridPoint) => {
        const dfsPath = (target: OrientedGridPoint) => {
            if (P.has(target)) {
                return; // Already visited this point
            }
            P.add(target); // Mark this point as visited
            const s: string = `${target.x},${target.y}`;
            S.add(s); // Add the end node (just a position string) to the set

            pathfinder.prev.get(target) // OrientedGridPoint[]
                .forEach(dfsPath); // Recursion               
        }
        dfsPath(end);
    });

    const solution = S.size;
    return solution;
};
