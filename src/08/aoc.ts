import { XY } from '../common/base/points';
import { Grid2D, GridPoint } from '../common/grids/grid';

class City extends Grid2D {
    findAntennaGroups(): Map<string, GridPoint[]> {
        const antennae = this.getValueArray();
        const pairMap = new Map<string, GridPoint[]>();
        for (const antenna of antennae) {
            if (pairMap.has(antenna.Value)) {
                pairMap.get(antenna.Value).push(antenna);
            } else {
                pairMap.set(antenna.Value, [antenna]);
            }
        }
        return pairMap;
    }

    findAntenodes(pair: GridPoint[], resonate = false) {
        const antenodes = [];
        const diff0 = XY.Diff(pair[0], pair[1]);
        const diff1 = XY.Diff(pair[1], pair[0]);
        const antenode0 = pair[0].copy().move(diff0);
        if (this.inBounds(antenode0)) {
            antenodes.push(antenode0);
            if (resonate) {
                while (true) {
                    const next = antenodes[antenodes.length - 1].copy().move(diff0);
                    if (this.inBounds(next)) {
                        antenodes.push(next);
                    } else {
                        break;
                    }
                }
            }
        }
        const antenode1 = pair[1].copy().move(diff1);
        if (this.inBounds(antenode1)) {
            antenodes.push(antenode1);
            if (resonate) {
                while (true) {
                    const next = antenodes[antenodes.length - 1].copy().move(diff1);
                    if (this.inBounds(next)) {
                        antenodes.push(next);
                    } else {
                        break;
                    }
                }
            }
        }
        return antenodes;
    }
}

const toAntennaPairs = (group: GridPoint[]): GridPoint[][] => {
    const pairs = [];
    for (let i = 0; i < group.length; i++) {
        for (let j = i + 1; j < group.length; j++) {
            pairs.push([group[i], group[j]]);
        }
    }
    return pairs;
}

export const part1 = async (input: string): Promise<number | string> => {
    const city = new City({
        setOnGet: false,
        defaultValue: '.'
    });
    city.setFromString2D(input);
    //city.print();
    const groups = city.findAntennaGroups();
    const groupsValues = [...groups].map(([key, value]) => value);
    const pairs = groupsValues.map(toAntennaPairs);
    const flattenedPairs = pairs.flat();
    const validAntenodeSet = new Set<string>();
    for (const pair of flattenedPairs) {
        const antenodes = city.findAntenodes(pair);
        for (const antenode of antenodes) {
            validAntenodeSet.add(Grid2D.HashPointToKey(antenode));
        }
    }
    const solution = validAntenodeSet.size;
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const city = new City({
        setOnGet: false,
        defaultValue: '.'
    });
    city.setFromString2D(input);
    //city.print();
    const groups = city.findAntennaGroups();
    const groupsValues = [...groups].map(([key, value]) => value);
    const pairs = groupsValues.map(toAntennaPairs);
    const flattenedPairs = pairs.flat();
    const validAntenodeSet = new Set<string>();
    for (const pair of flattenedPairs) {
        const antenodes = city.findAntenodes(pair, true);
        for (const antenode of antenodes) {
            validAntenodeSet.add(Grid2D.HashPointToKey(antenode));
        }
    }
    // Add antennae to the set
    const antennae = city.getValueArray();
    for (const antenna of antennae) {
        validAntenodeSet.add(Grid2D.HashPointToKey(antenna));
    }

    const solution = validAntenodeSet.size;
    return solution;
};
