import { INode, IGraph, PathfinderResult } from "../../types";

/**
 * @class Dijkstra's Pathfinding Algorithm
 * @remarks IGraph Implementation Agnostic
 * Dijkstra's algorithm
 * https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
 */
export class Dijkstra {

    private _dist: Map<INode, number> = new Map();
    private _prev: Map<INode, INode> = new Map();

    //public get dist(): Map<INode, number> { return this._dist };
    //public get prev(): Map<INode, INode> { return this._prev }; 

    //private _Q: INode[] = [];
    private _Q: Set<INode> = new Set(); // TODO: This should be a priority Q. Research.
    // For now, we just buzz through using _distMin which is pretty fast - O(n)

    /**
     * @param graph 
     */
    constructor(protected graph: IGraph) {
        this.graph.forEach(node => {
            this._dist.set(node, Infinity);
            this._prev.set(node, null);
            this._Q.add(node);
        });

        this._dist.set(this.graph.start, 0);

        while (this._Q.size) {
            const u: INode = this._distMin();
            if (u === this.graph.end) {
                break; // Remove this if we want to search the entire graph
            }
            this._Q.delete(u);

            for (const v of this.graph.getNeighbors(u)) {
                const alt = this._dist.get(u) + this.graph.getWeight(u, v);
                if (alt < this._dist.get(v)) {
                    this._dist.set(v, alt);
                    this._prev.set(v, u);
                }
            }
        }
    }

    _distMin(): INode {
        const it: IterableIterator<INode> = this._Q.values();
        let result = it.next();
        let min: INode = result.value;
        let minDist = this._dist.get(min)
        while (!result.done) {
            const value: INode = result.value;
            const valueDist = this._dist.get(value);
            if (valueDist < minDist) {
                min = value;
                minDist = valueDist;
            }
            result = it.next();
        }
        return min;
    }

    findPath(start: INode, end: INode): PathfinderResult {

        const path = [];
        const cost = Infinity;

        // we need a 

        return { path, cost };

    }

}
