import { Grid2D, GridPoint } from "../common/grids/grid";

type MapStats = {
    score: number,
    rating: number
}

class TopographicMap extends Grid2D {
    getTrailheads() {
        const traiheads = this.getValueArray().filter(v => v.Value === 0);
        return traiheads;
    }

    getStats(trailhead: GridPoint): MapStats {
        const path = [trailhead];

        const nines = new Set<string>();
        let rating = 0;

        const dfs = (point: GridPoint) => {
            const last = path[path.length - 1];
            if (last.Value === 9) {
                // End of the path
                nines.add(Grid2D.HashPointToKey(last));
                rating++;
                return;
            }
            const neighbors = this.getNeighbors(point)
                .filter(p => p && p.Value === point.Value + 1)
                .filter(p => !path.includes(p));

            for (const neighbor of neighbors) {
                path.push(neighbor);
                dfs(neighbor);
                path.pop();
            }
        };

        dfs(trailhead);

        return {
            score: nines.size,
            rating
        }
    }
}

export const part1 = async (input: string): Promise<number | string> => {
    const map = new TopographicMap();
    map.setFromString2D(input, { parseInt: true });
    return map.getTrailheads()
        .map(th => map.getStats(th))
        .reduce((acc, cur) => acc + cur.score, 0);
};

export const part2 = async (input: string): Promise<number | string> => {
    const map = new TopographicMap();
    map.setFromString2D(input, { parseInt: true });
    const solution = map.getTrailheads()
        .map(th => map.getStats(th))
        .reduce((acc, cur) => acc + cur.rating, 0);
    return solution;
};
