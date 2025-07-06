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
    private _Q: INode[] = [];

    // Note: IGraph's have an "end" but we ignore it.
    constructor(protected graph: IGraph) {
        graph.forEach 

               // this.stack = [];
        // this._start = graph.start;
        // this._end = graph.end;

    }
    
    findPath(start: INode, end: INode): PathfinderResult {

        const path = [];
        const cost = Infinity;

        // we need a 

        return { path, cost };

    }

}
