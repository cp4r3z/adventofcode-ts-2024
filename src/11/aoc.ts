import { LinkedList, LinkedListElement } from "../common/lists/linkedlist";

class Stones extends LinkedList {
    blink(times: number) {
        //this.print();
        for (let i = 0; i < times; i++) {
           const arr = [...this];
            arr.forEach(stone => {
                if (stone.value === 0) {
                    stone.value = 1;
                } else if (stone.value.toString().length % 2 === 0) {
                    // Replace with 2 stones
                    // Split number in half
                    const strValue = stone.value.toString();
                    const mid = Math.floor(strValue.length / 2);
                    const firstHalf = parseInt(strValue.slice(0, mid), 10);
                    const secondHalf = parseInt(strValue.slice(mid), 10);
                    stone.value = secondHalf;
                    this.insertBefore(stone, new LinkedListElement(firstHalf));
                } else {
                    stone.value *= 2024;
                }
            });
            // console.log(`After ${i + 1} blink(s): ${this.size}`);
            //this.print();
        }
    }
}

class Stones2 extends Map {
    add(to, n: number) {
        // Add to count of *to* stones
        if (this.has(to)) {
            this.set(to, this.get(to) + n);
        } else {
            this.set(to, n);
        }
    }

    sum() {
        // Convert Map to an array of [key, value] pairs 
        const mapArray = Array.from(this);
        // Use reduce on the array 
        const sum = mapArray.reduce((total, [key, value]) => total + value, 0);
        return sum;
    }

    blink(times: number) {

        // @ts-ignore Something is wrong with how TS interprets the subclassed Map contructor.
        let working = new Stones2(this);
        this.clear();

        for (let i = 0; i < times; i++) {
            const next = new Stones2();
            for (const [stone, count] of working) {
                if (count === 0) {
                    continue;
                }
                if (stone === 0) {
                    // Change stones to 1
                    next.add(1, count);
                } else if (stone.toString().length % 2 === 0) {
                    // Replace with 2 stones
                    // Split number in half
                    const strValue = stone.toString();
                    const mid = strValue.length / 2;
                    const firstHalf = parseInt(strValue.slice(0, mid), 10);
                    const secondHalf = parseInt(strValue.slice(mid), 10);
                    next.add(firstHalf, count);
                    next.add(secondHalf, count);
                } else {
                    // Multiply by 2024
                    next.add(stone * 2024, count);
                }
            }
            working = next;
            // console.log(`After ${i + 1} blink(s): ${working.sum()}`);
        }
        for (const [stone, count] of working) {
            this.add(stone, count);
        }
    }
}

export const part1 = async (input: string): Promise<number | string> => {
    const parsed = input.split(' ').map(Number);
    const stones: Stones = (new Stones()).fromArray(parsed);
    stones.blink(25);
    return stones.size;
};

export const part2 = async (input: string): Promise<number | string> => {
    const parsed = input.split(' ').map(Number);
    const stones = new Stones2();
    parsed.forEach(s => {
        stones.add(s, 1);
    });
    stones.blink(75);
    return stones.sum();
};
