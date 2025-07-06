export interface INode {
    // print function?
    equals(other: INode): boolean;
}

export interface IGraph {
    start: INode;
    end: INode;
    getNeighbors(node: INode): INode[];
    getWeight(from: INode, to: INode): number; // aka Edge length
    //forEach(callbackfn: (value: INode, key: string, map: Map<string, INode>) => void, thisArg?: any): void;
    forEach(callbackfn: (value: INode) => void, thisArg?: any): void;
    print(); // Why is this part of the interface?
}

export interface IPoint extends INode {
    copy: Function,
    move: Function
};

export type PathfinderResult = {
    path: INode[],
    cost: number
};