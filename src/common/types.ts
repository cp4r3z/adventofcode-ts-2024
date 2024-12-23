export interface INode {
    // print function?
    equals(other: INode): boolean;
}

export interface IGraph {
    getNeighbors(node: INode): INode[];
    getWeight(from: INode, to: INode): number; // aka Edge length
    print(); // Why is this part of the interface?
}

export interface IPoint extends INode {
    copy: Function,
    move: Function
};