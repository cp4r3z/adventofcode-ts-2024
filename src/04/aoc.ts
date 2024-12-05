import { XY } from "../common/base/points";
import { Direction, Grid2D, GridPoint } from "../common/grids/grid";

const AllDirections = [...Direction.Cardinals, ...Direction.Ordinals];

class WordSearch extends Grid2D {

    // Modified getNeighbor
    getNeighborInDirection(point: GridPoint, direction: Direction.Cardinal): GridPoint {
        const xy: XY = Direction.CardinalToXY.get(direction);
        const neighbor: XY = point.copy().move(xy);
        const neighboringGridPoint: GridPoint = this.getPoint(neighbor);
        if (!neighboringGridPoint) return null;
        if (!this.bounds.hasPoint(neighboringGridPoint)) return null;
        return neighboringGridPoint;
    }
}

export const part1 = async (input: string): Promise<number | string> => {
    const wordSearch = new WordSearch();
    wordSearch.setFromString2D(input);

    // Find all Xs

    const xs: GridPoint[] = [];
    wordSearch.forEach((gp: GridPoint) => {
        if (gp.Value === 'X') {
            xs.push(gp);
        }
    });

    // Find MASes emanating from it, basically what a human would do

    const mas: string[] = 'MAS'.split('');
    let xmasesFound = 0;
    xs.forEach(x => {
        AllDirections.forEach((dir: Direction.Cardinal) => {
            let current = x;
            const masFound = mas.every((s: string) => {
                current = wordSearch.getNeighborInDirection(current, dir);
                return current?.Value === s;
            });

            if (masFound) {
                xmasesFound++;
            }
        });
    });

    return xmasesFound;
};

export const part2 = async (input: string): Promise<number | string> => {
    const wordSearch = new WordSearch();
    wordSearch.setFromString2D(input);

    // This time we only need Direction.Ordinals

    const xDirPairs: Direction.Cardinal[][] = [
        [
            Direction.Cardinal.NorthWest,
            Direction.Cardinal.SouthEast
        ], [
            Direction.Cardinal.NorthEast,
            Direction.Cardinal.SouthWest,
        ]];

    // Find all As

    const as: GridPoint[] = [];
    wordSearch.forEach((gp: GridPoint) => {
        if (gp.Value === 'A') {
            as.push(gp);
        }
    });

    //then test that both "Xs" spell MAS or SAM

    let xmasesFound = 0;
    as.forEach((a: GridPoint) => {
        const masFound = xDirPairs.every((xDirPair: Direction.Cardinal[]) => {
            const xDir0 = wordSearch.getNeighborInDirection(a, xDirPair[0]);
            const xDir1 = wordSearch.getNeighborInDirection(a, xDirPair[1]);
            const xValPair = [xDir0?.Value, xDir1?.Value].sort().join('');
            return xValPair === 'MS';
        });

        if (masFound) {
            xmasesFound++;
        }
    });

    return xmasesFound;
};
