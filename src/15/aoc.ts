import { XY } from "../common/base/points";
import { Grid2D, GridOptions, GridPoint, PrintOptions, String2DOptions } from "../common/grids/grid";
import { Direction } from '../common/grids/Direction';

class WarehousePoint extends GridPoint {
    public type = 'Wall';
    public sibling: WarehousePoint;
}
class Warehouse extends Grid2D {

    public robot: WarehousePoint;
    public boxes: WarehousePoint[] = [];

    private _SToXY: Map<string, XY> = new Map<string, XY>();
    private _isWide: boolean;

    constructor(options?: GridOptions, isWide?: boolean) {
        super(options);
        this._SToXY.set('^', new XY(0, -1));
        this._SToXY.set('v', new XY(0, 1));
        this._SToXY.set('<', new XY(-1, 0));
        this._SToXY.set('>', new XY(1, 0));
        this._isWide = isWide;
    }

    override setFromString2D = (input: string, options?: String2DOptions) => {
        if (this._isWide) {
            input = input.replaceAll('#', '##');
            input = input.replaceAll('O', '[]');
            input = input.replaceAll('.', '..');
            input = input.replaceAll('@', '@.');
        }
        input
            .split('\n')
            .forEach((row, y) => {
                row.split('').forEach((s, x) => {
                    if (s === '.') {
                        return;
                    }
                    const wp = new WarehousePoint(x, y, s);
                    if (s === '@') {
                        wp.type = 'Robot';
                        this.robot = wp;
                    } else if (s === 'O') {
                        wp.type = 'Box';
                        this.boxes.push(wp);
                    } else if (s === '[') {
                        wp.type = 'BoxR';
                        const wpL = new WarehousePoint(x + 1, y, ']');
                        wpL.type = 'BoxL';
                        wp.sibling = wpL;
                        wpL.sibling = wp;
                        this.boxes.push(wp);
                        this.setGridPoint(wpL);
                    } else if (s === ']') {
                        return;
                    }
                    this.setGridPoint(wp);
                });
            });
    };

    move(direction: string) {
        const xy = this._SToXY.get(direction);
        // start building a list of things to move
        let next: WarehousePoint[] = [this.robot];
        const toMoves: WarehousePoint[] = [this.robot];
        let canMove = false;
        let wall = false;
        while (!wall && next.length > 0) {
            const current: WarehousePoint[] = [...next];
            next = [];
            canMove = true;
            for (const cur of current) {
                const neighborKey = Grid2D.HashXYToKey(cur.x + xy.x, cur.y + xy.y);
                const neighbor: WarehousePoint = this.get(neighborKey) as WarehousePoint;
                if (!neighbor) { // ALL of the neighbors need to be empty in Part 2
                    continue;
                }
                if (neighbor === cur.sibling) {
                    continue;
                }
                if (neighbor.type === 'Wall') {
                    canMove = false;
                    wall = true;
                } else if (neighbor.type.includes('Box')) {
                    // In Part 2 there are BoxL and BoxR
                    next.push(neighbor);
                    if (!toMoves.includes(neighbor)) {
                        toMoves.push(neighbor);
                    }

                    if (neighbor.type !== 'Box') {
                        next.push(neighbor.sibling);
                        if (!toMoves.includes(neighbor.sibling)) {
                            toMoves.push(neighbor.sibling);
                        }
                    }
                } else {
                    console.warn('Unknown WarehousePoint');
                }
            }
        }

        if (canMove) {
            for (const toMove of toMoves) {
                this.deletePoint(toMove);
            }
            for (const toMove of toMoves) {
                toMove.move(xy);
                this.setGridPoint(toMove);
            }
        }
    }

    coordinateSum() {
        return this.boxes.reduce((sum, box) => sum + box.x + 100 * box.y, 0);
    }
}

function parse(input: string, part2: boolean = false) {
    const parts = input.split('\n\n');
    const warehouse = new Warehouse({
        setOnGet: false,
        defaultValue: '.'
    }, part2);
    
    warehouse.setFromString2D(parts[0]);
    const moves = parts[1].replaceAll('\n', '').split('');

    return {
        warehouse, moves
    };
};

export const part1 = async (input: string): Promise<number | string> => {
    const { warehouse, moves } = parse(input);
    // warehouse.print();
    for (const move of moves) {
        // console.log(move);
        warehouse.move(move);
        // warehouse.print();
    }
    const solution = warehouse.coordinateSum();
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const { warehouse, moves } = parse(input, true);
    // warehouse.print();
    for (const move of moves) {
        // console.log(move);
        warehouse.move(move);
        // warehouse.print();
    }
    const solution = warehouse.coordinateSum();
    return solution;
};
