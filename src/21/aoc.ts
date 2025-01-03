import { Direction, Grid2D, GridPoint } from "../common/grids/grid";
import { IPoint2D, XY } from "../common/base/points";

// #region GLOBALS
const numericKeypadLayout = '789\n456\n123\n_0A';
const directionalKeypadLayout = '_^A\n<v>';
const directionCardinalMap = new Map<Direction.Cardinal, string>([
    [Direction.Cardinal.North, '^'],
    [Direction.Cardinal.South, 'v'],
    [Direction.Cardinal.West, '<'],
    [Direction.Cardinal.East, '>']
]);
// #endregion

function parse(input: string) {
    // const toNumberArray = (s: string): number[] => {
    //     const re: RegExp = /(-?\d+)/g;
    //     const matches = s.match(re) || [];
    //     const numbers = matches.map(sm => parseInt(sm));
    //     return numbers;
    // };

    return input
        .split('\n');
    //.map(s => s.split(''));
};

type PointInDirection = {
    point: GridPoint,
    direction: Direction.Cardinal
}

class Keypad extends Grid2D {

    private _keyMap: Map<string, Direction.Cardinal[]>; // key: two string for each numeric key, value: path between
    //private _start: GridPoint;

    constructor(layout: string) {
        super({ setOnGet: false, defaultValue: ' ' });
        this.setFromString2D(layout);
        // Delete the _ filler space
        const blank = this.getValueArray().find(gp => gp.Value === '_');
        this.delete(Grid2D.HashPointToKey(blank));

        //this._initKeyMap();

        // find start (A)
        //this._start=this.getValueArray().find(gp=>gp.Value==='A');        
    }

    // public getSequenceLength(sequence: string): number {
    //     return this._keyMap.get(sequence).length;
    // }

    public getPresses2(sequence: string): string {
        const cardinals = this._keyMap.get(sequence);
        return cardinals.map(c => directionCardinalMap.get(c)).join('');
    }

    // Takes a sequence (the code for example) and generates all the presses
    public getPresses(sequence: string): string {
        const presses = [];
        let current = 'A'; //this._start;

        for (const button of sequence) {
            // Move to the button if necessary
            if (current !== button) {
                // move
                const key = current + button;
                const cardinals = this._keyMap.get(key);
                const asDirections = cardinals.map(c => directionCardinalMap.get(c)).join('');
                presses.push(...asDirections);
            }
            // Press A
            presses.push('A');
            // Current is now the button
            current = button;
        }

        return presses.join('');


        // const cardinals = this._keyMap.get(sequence);
        // return cardinals.map(c => directionCardinalMap.get(c)).join('');
    }

    // This is somewhat wasteful to generate all possibilities
    public initKeyMap(directional?: Keypad) {
        this._keyMap = new Map();
        const values = this.getValueArray();
        for (let i = 0; i < values.length; i++) {
            //if (values[i].Value === '_') continue;
            //this._flood(values[i]);
            this._floodDFS(values[i], directional);
        }
    }

    private _getNeighborInfo(point: GridPoint): PointInDirection[] {
        const neighbors = [];

        for (const c of Direction.Cardinals) {
            const xy: IPoint2D = Direction.CardinalToXY.get(c);
            const neighbor: IPoint2D = point.copy().move(xy);
            const p = this.getPoint(neighbor); // Warning! Is setOnGet true?
            if (!p) continue;
            if (!this.bounds.hasPoint(p)) continue;
            if (p.Value === '_')
                continue; // Specific to this puzzle
            neighbors.push({
                point: p,
                direction: c
            });
        }

        return neighbors;
    }

    private _floodDFS(from: GridPoint, directional?: Keypad) {
        //const path = [from];
        let current: GridPoint = from;
        const directionPath: Direction.Cardinal[] = [];

        const isBetter = (base: Direction.Cardinal[], candidate: Direction.Cardinal[]): boolean => {
            if (!base && candidate) return true;
            if (candidate.length < base.length) return true;
            if (candidate.length === base.length) {
                // count consecutive
                let consecutiveBase = 0;
                let consecutiveCandidate = 0;
                for (let i = 1; i < base.length; i++) {
                    if (base[i] === base[i - 1]) consecutiveBase++;
                    if (candidate[i] === candidate[i - 1]) consecutiveCandidate++;
                }
                if (consecutiveCandidate > consecutiveBase) return true;
                if (consecutiveCandidate === consecutiveBase && !!directional) {
                    console.log('MORE PROCESSING! Simulate clicks');
                    let baseAsDirections = base.map(c => directionCardinalMap.get(c)).join('') + 'A';
                    //baseAsDirections += 'A';
                    const baseDirectionalPresses = directional.getPresses(baseAsDirections);
                    const baseDirectional2Presses = directional.getPresses(baseDirectionalPresses);
                    
                    let candidateAsDirections = candidate.map(c => directionCardinalMap.get(c)).join('') + 'A';
                    const candidateDirectionalPresses = directional.getPresses(candidateAsDirections);
                    const candidateDirectional2Presses = directional.getPresses(candidateDirectionalPresses);

                    if (candidateDirectional2Presses.length<baseDirectional2Presses.length){
                        return true;
                    }
                }
            }
            return false;
        };

        const isBetter2 = (base: Direction.Cardinal[], candidate: Direction.Cardinal[]): boolean => {
            if (!base && candidate) return true;
            if (candidate.length < base.length) return true;
            if (candidate.length > base.length) return false;
            // candidate.length === base.length
            // count consecutive
            let consecutiveBase = 0;
            let consecutiveCandidate = 0;
            for (let i = 1; i < base.length; i++) {
                if (base[i] === base[i - 1]) consecutiveBase++;
                if (candidate[i] === candidate[i - 1]) consecutiveCandidate++;
            }
            if (consecutiveCandidate > consecutiveBase) return true;

            return false;
        };

        const dfs = () => {
            // pop last off path
            //const current = path[path.length-1];
            // get neighbors
            const neighbors: PointInDirection[] = this._getNeighborInfo(current);
            // for each neighbor, branch off
            for (const neighbor of neighbors) {
                if (neighbor.point === from) {
                    continue;
                }
                // path so far
                directionPath.push(neighbor.direction);
                const previous = current;

                const key = from.Value + neighbor.point.Value;
                //console.log(key);
               
                const known = this._keyMap.get(key);
                if (key === '37'){
                   // debugger;
                }

                // decide to keep going?

                let keepGoing = !known || directionPath.length <=known.length// isBetter(known, directionPath);// known.length>= directionPath.length;

                // if (known) {
                //     // is path better?
                //     if (directionPath.length < known.length) {
                //         this._keyMap.set(key, [...directionPath]);
                //         keepGoing = true;
                //     }
                // } else {
                //     this._keyMap.set(key, [...directionPath]);
                //     keepGoing = true;
                // }

                if (keepGoing) {
                    if ( isBetter(known, directionPath)){
                        this._keyMap.set(key, [...directionPath]);
                    }
                    //this._keyMap.set(key, [...directionPath]);
                    // const reversed = [...directionPath];
                    // reversed.reverse();
                    // this._keyMap.set(key, reversed);
                    current = neighbor.point;
                    dfs();
                }

                directionPath.pop();
                current = previous;
            }
        };

        dfs();
    }

    private _flood(from: GridPoint) {
        function getPath(to: GridPoint): Direction.Cardinal[] {
            const path = [];
            let current = to;
            while (current !== from) {
                const prev = history.get(current);
                path.push(prev.direction);
                current = prev.point;
            }
            return path.reverse(); //.sort(); Can't simply sort
        }

        // prev map (stores previous node - and direction maybe?) // similar to Dijkstra
        const history = new Map<GridPoint, PointInDirection>();
        let nextPoints: Set<GridPoint> = new Set([from]);
        let currentPoints: Set<GridPoint> = new Set();

        while (nextPoints.size > 0) {
            currentPoints = nextPoints;
            nextPoints = new Set();
            for (const current of currentPoints) {
                const neighbors: PointInDirection[] = this._getNeighborInfo(current);
                for (const neighbor of neighbors) {
                    if (neighbor.point === from) continue;

                    // TODO: A better path is one that has repeated commands
                    // which means I think we cannot use flood. ugh.

                    if (!history.has(neighbor.point)) {
                        // build history
                        history.set(neighbor.point, {
                            point: current,
                            direction: neighbor.direction
                        });
                        const key = from.Value + neighbor.point.Value;
                        const value = getPath(neighbor.point);
                        this._keyMap.set(key, value);
                        nextPoints.add(neighbor.point);
                    }
                }
            }
        }
    }
}

export const part1 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);

    // Get the numerical values
    const parsedAsNumbers = parsed.map(s => parseInt(s));

    const numeric: Keypad = new Keypad(numericKeypadLayout);
    const directional: Keypad = new Keypad(directionalKeypadLayout);
    directional.initKeyMap();
    numeric.initKeyMap(directional);

    const numericPresses = parsed.map(s => numeric.getPresses(s));
    const directional1Presses = numericPresses.map(s => directional.getPresses(s));
    const directional2Presses = directional1Presses.map(s => directional.getPresses(s));

    // const keyArrayToSubSequence = (keyArray) => {
    //     const subSequences = [];
    //     for (let i = 0; i < keyArray.length - 1; i++) {
    //         subSequences.push(keyArray[i] + keyArray[i + 1]);
    //     }
    //     return subSequences;
    // };

    // const subSequences = parsed.map(keyArrayToSubSequence);

    // const presses = subSequences.map(ss => ss.map(ssi => numeric.getPresses2(ssi)));
    // const pressesJoinedWithA = presses.map(ss => ss.join('A') + 'A');
    // //                                <A^A^^>AvvvA
    // //<A^A>^^AvvvA, <A^A^>^AvvvA, and <A^A^^>AvvvA.

    // const pressesKeyArrays = pressesJoinedWithA.map(s => s.split(''));
    // const pressesSS1 = pressesKeyArrays.map(keyArrayToSubSequence);

    // const directional1: Keypad = new Keypad(directionalKeypadLayout);

    // const pressesD1 = pressesSS1.map(ss => ss.map(ssi => directional1.getPresses2(ssi)));
    // const pressesD1JoinedWithA = pressesD1.map(ss => ss.join('A') + 'A');

    // const directional2: Keypad = new Keypad(directionalKeypadLayout);

    const lengths = directional2Presses.map((s, i) => s.length);

    //GOOD v<<A>>^A<A>AvA<^AA>A<vAAA>^A
    //BAD  v<<A>^>A<A>A<AA>vA^Av<AAA^>A
    //        <   A ^ A ^^  > A  vvv  A


    //GOOD <vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A
    //     v<A<AA>>^AvAA^<A>Av<<A>>^AvA^Av<<A>>^AAvA<A^>A<A>Av<A<A>>^AAA<A>vA^A
    //BAD  v<A<AA>^>AvA^<A>vA^Av<<A>^>AvA^Av<<A>^>AAvA<A^>A<A>Av<A<A>^>AAA<A>vA^A
    //BAD2 v<A<AA>^>AvA^<A>vA^Av<<A>^>AvA^Av<<A>^>AvA<A^>A<Av<A>^>AvA^Av<A<A>^>AAA<A>vA^A

    //379
    // debug           v<<A>>^AAv<A<A>>^AA
    //BAD  v<<A>>^AvA^Av<<A>>^AAv<A<A>>^AAvAA^<A>Av<A^>AA<A>Av<A<A>>^AAA<A>vA^A
    //        <   A > A   <   AA  v <   AA >>  ^ A
    //            ^   A       ^^        <<       A
    //                3                          7     
    // debug           v< A<  AA>>^AAvA^<A>AA
    //GOOD <v<A>>^AvA^A<v A<  AA>>^AAvA<^A>AAv A^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A
    //        <   A > A   v   <<   AA >  ^ AA  > A
    //            ^   A            <<      ^^    A
    //                3                          7
    const solution = directional2Presses.map((s, i) => s.length * parsedAsNumbers[i]).reduce((total, cur) => total + cur, 0);
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    const solution = 0;
    return solution;
};
