import { INode, IGraph } from "../../types";

export type PathfinderResult = {
    path: INode[],
    cost: number
}

/**
 * @class Depth First Search Pathfinding Algorithm
 * @remarks IGraph Implementation Agnostic
 */
export class DFS {

    public stack: INode[]; // TODO: does this need to be public?    

    private _start: INode;
    private _end: INode;
    private _bestPath: INode[];

    constructor(protected graph: IGraph) {
        this.stack = [];

    }

    /**
     * Compare two paths
     * @remarks By default, it's just shorter = better
     */
    public pathComparator(current: INode[], candidate: INode[]): boolean {
        if (current === null) {
            return true;
        }
        return candidate.length < current.length;
    }

    // start by popping a node from the end of the stack. why pop though?

    // for a node, find neighbors.
    // if any of those neighbors is IN the stack, filter it    
    // if there is one neighbor, add to stack,
    // if more than one, branch.
    // - start by storing the last stack index
    // - then, for each, add that 

    findPath(start: INode, end: INode): PathfinderResult {
        this._start = start;
        this.stack = [this._start];
        this._end = end;
        this._bestPath = null;

        this._dfs();

        const path = this._bestPath;
        const cost = this._bestPath ? this._bestPath.length - 1 : Infinity;

        return { path, cost };


        // should return { path: null, cost: null };

    }

    private _dfs() {
        const startingStackLength = this.stack.length;
        let branch = false;
        let neighbors: INode[] = []
        while (!branch) {
            let current = this.stack[this.stack.length - 1];

            if (current === this._end) {
                // Is the current stack "better" than the current "best" path?
                if (this.pathComparator(this._bestPath, this.stack)) {
                    // Make a copy of the stack and return 
                    this._bestPath = [...this.stack];
                    console.log(`Better Path Found, Cost = ${this._bestPath.length - 1}`);

                    this.stack.length = startingStackLength; // Always do this before exiting function.
                    return;
                }
            }

            neighbors = this.graph
                .getNeighbors(current)
                .filter(n => !this.stack.includes(n));
            if (neighbors.length === 1) {
                // Only one option. No need to add to call stack.
                this.stack.push(neighbors[0]);
            } else if (neighbors.length > 1) {
                branch = true;
            } else {
                this.stack.length = startingStackLength;
                return;
            }
        }

        neighbors.forEach((neighbor: INode) => {
            this.stack.push(neighbor);
            this._dfs();
            this.stack.pop();
        });

        // Reset the stack length
        this.stack.length = startingStackLength; // This is an interesting way to do it
    }
}