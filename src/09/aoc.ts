function parse(input: string) {
    const numberArray = input.split('').map(sm => parseInt(sm));
    return numberArray;
};

function toDisk(numberArray: number[]) {
    const disk = [];
    let id = 0;
    for (let i = 0; i < numberArray.length; i++) {
        const isNull = i % 2 !== 0;
        const blockValue = isNull ? null : id;
        if (isNull) id++;
        const size = numberArray[i];
        for (let j = 0; j < size; j++) {
            disk.push(blockValue);
        }
    }
    return disk;
}

type File = {
    size: number;
    diskStart: number;
}

function toFiles(numberArray: number[]) {
    let diskStart = 0;
    const files: File[] = []; // store size and disk start index
    let id = 0;
    for (let i = 0; i < numberArray.length; i++) {
        const isNull = i % 2 !== 0;
        const blockValue = isNull ? null : id;
        if (isNull) id++;
        const size = numberArray[i];
        if (!isNull) {
            files.push({ size, diskStart });
        }
        for (let j = 0; j < size; j++) {
            diskStart++;
        }

    }
    return files;
}

function defragment(disk: number[]) {
    let iTarget = 0;
    let iSource = disk.length - 1;
    while (iSource > iTarget) {
        // Find next target
        while (disk[iTarget] !== null) {
            iTarget++;
        }
        // Find next source
        while (disk[iSource] === null) {
            iSource--;
        }
        // Set target to source
        if (disk[iTarget] === null && iSource > iTarget) {
            //console.log(`Setting ${iTarget} (${disk[iTarget]}) to ${iSource} (${disk[iSource]})`);
            disk[iTarget] = disk[iSource];
            disk[iSource] = null;
        }
    }
}

function defragment2(disk: number[], files: File[]) {

    const isGap = (index: number, size: number) => {
        for (let i = 0; i < size; i++) {
            if (disk[index + i] !== null) {
                return false;
            }
        }
        return true;
    };

    let iTarget = 0;

    for (let i = files.length - 1; i >= 0; i--) {
        const file = files[i];
        const iSource = file.diskStart;
        let iTarget = 0;
        while (iTarget < iSource) {
            // Find a suitably large null gap in the disk
            if (isGap(iTarget, file.size)) { break; }
            iTarget++;
        }
        // Move the file to the target
        if (iTarget < iSource) {
            for (let j = 0; j < file.size; j++) {
                disk[iTarget + j] = disk[iSource + j];
                disk[iSource + j] = null;
            }
        }
    }
}

function checksum(disk: number[]) {
    let sum = 0;
    for (let i = 0; i < disk.length; i++) {
        if (disk[i]) {
            sum += i * disk[i];
        }
    }
    return sum;
}

export const part1 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    const disk = toDisk(parsed);
    defragment(disk);
    const solution = checksum(disk);
    return solution;
};

export const part2 = async (input: string): Promise<number | string> => {
    const parsed = parse(input);
    const disk = toDisk(parsed);
    const files = toFiles(parsed);
    defragment2(disk, files);
    const solution = checksum(disk);
    return solution;
};
