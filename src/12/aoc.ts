import { Grid2D, GridPoint } from "../common/grids/grid";
import { Direction } from '../common/grids/Direction';

class Region extends Set<GridPoint> {
    children: Region[] = [];
    fences: Set<GridPoint> = new Set<GridPoint>();
    // override toString = () =>`${this.values().next().value.Value}`; // seems fragile and doesn't even work properly

    getPerimeter() {
        return this.fences.size;
    }

    getArea() {
        return this.size;
    }

    getSides(): number {
        const findFence = (other: GridPoint): GridPoint => {
            return [...this.fences].find(f => f.x === other.x && f.y === other.y && f.Orientation === other.Orientation);
        }

        const sides = new Set(this.fences);

        // now we gradually remove gridpoints from sides.
        // what to remove? If it's "in line" with the side and has the same orientation

        for (const fence of this.fences) {
            if (!sides.has(fence)) {
                // Already removed
                continue;
            }
            let neighborFences = Direction.Cardinals.map(card => {
                return findFence(fence.clone().move(Direction.CardinalToXY.get(card)));
            });

            while (neighborFences.filter(f => !!f).length > 0) {
                if (fence.Orientation === Direction.Cardinal.North ||
                    fence.Orientation === Direction.Cardinal.South) {
                    neighborFences[0] = null;
                    neighborFences[2] = null;
                    sides.delete(neighborFences[1]);
                    sides.delete(neighborFences[3]);
                } else {
                    neighborFences[1] = null;
                    neighborFences[3] = null;
                    sides.delete(neighborFences[0]);
                    sides.delete(neighborFences[2]);
                }
                neighborFences = Direction.Cardinals.map((card, i) => {
                    if (!neighborFences[i]) return null;
                    return findFence(neighborFences[i].clone().move(Direction.CardinalToXY.get(card)));
                });
            }
        }

        return sides.size;
    }
}

class Farm extends Grid2D {
    regions: Region[] = [];

    findRegions() {
        const unevaluated = this.getValueArray();
        const evaluated = [];
        const regionMap = new Map<GridPoint, Region>();

        for (const point of unevaluated) {
            const plantType = point.Value;
            if (plantType === this.options.defaultValue) {
                continue; // Border
            }
            let region: Region;

            // #region Recursion
            const floodFill = (p: GridPoint) => {
                if (p.Value !== plantType || evaluated.includes(p)) {
                    return;
                }
                if (!region) region = new Region();
                region.add(p);
                regionMap.set(p, region);
                evaluated.push(p);
                const neighbors = this.getNeighbors(p);
                for (const neighbor of neighbors) {
                    floodFill(neighbor);
                }
            };
            floodFill(point);
            // #endregion

            if (region) this.regions.push(region);
        }

        // This repeats the flooding but for each region to find parents and perimeter

        for (const region of this.regions) {
            let perimeter = 0;
            let atEdge = false;
            let borderRegions = new Set<Region>();

            region.forEach((point: GridPoint) => {
                const neighbors = this.getNeighbors(point);

                for (let cardinalIndex = 0; cardinalIndex < neighbors.length; cardinalIndex++) {
                    const cardinal = Direction.Cardinals[cardinalIndex];
                    const neighbor = neighbors[cardinalIndex];
                    const neighborRegion = regionMap.get(neighbor);
                    if (!neighborRegion) {
                        // This will happen when the neighborRegion is the edge / border
                    }
                    if (neighborRegion !== region) {
                        borderRegions.add(neighborRegion);
                        perimeter++; // TODO: We don't need this anymore

                        const neighborFence = neighbor.clone();
                        neighborFence.Orientation = cardinal;
                        region.fences.add(neighborFence);
                    }
                }
            });

            if (!atEdge && borderRegions.size === 1) {
                borderRegions.values().next().value.children.push(region);
            }
        }
    }
}

export const part1 = async (input: string): Promise<number | string> => {
    const farm = new Farm({ setOnGet: false, defaultValue: '+' });
    farm.setFromString2D(input);
    farm.addBorder();
    farm.findRegions();
    const solution = farm.regions
        .map(r => r.getPerimeter() * r.getArea())
        .reduce((acc, cur) => acc + cur, 0);
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const farm = new Farm({ setOnGet: false, defaultValue: '+' });
    farm.setFromString2D(input);
    farm.addBorder();
    farm.findRegions();
    const solution = farm.regions
        .map(r => r.getSides() * r.getArea())
        .reduce((acc, cur) => acc + cur, 0);
    return solution;
};
