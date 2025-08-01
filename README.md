# Advent of Code 2024
https://adventofcode.com/2024

[![Build Status](https://github.com/cp4r3z/adventofcode-ts-2024/actions/workflows/node.js.yml/badge.svg)](https://github.com/cp4r3z/adventofcode-ts-2024/actions)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/cp4r3z/adventofcode-ts-2024/main/LICENSE)

# Notables / Spoilers

## Day 01
First Day

## Day 03
RegEx, where we learn about how to truly remove line endings and "lazy" matching

## Day 04
Grid word search. Interesting use of Array's every() method

## Day 05
Custom sort. Again used that every() method.

## Day 06
**Grid** problem. Part 2 involves running the simulation many times, and is a good candidate for worker threads.

## Day 07
**Permutations** and function pointers. The solution runs very slow (50s). A lot of Copilot was used here with impressive results.

## Day 08
**Grid**

## Day 10
**Grid** and **DFS**

## Day 11
**Linked List** to model the actual behavior but unacceptable for Part 2. Remodeled as a **Map** after some internet help.

## Day 13
Solve intersection of two lines in point slope form. Part 2 introduces some serious **floating point error** that needs to be dealt with.

## Day 14
This is the day where you have to find a picture of a tree in the output.

## Day 16
This is the day where I needed a break. Essentially a **pathfinding** puzzle I realized that I never had a proper Dijkstra's algorithm with weighted nodes. Also, with the new "Oriented" Grid, we treat each "orientation" in a grid tile as a separate node in the graph.
My solution is still a bit slow for the input, taking perhaps 10s.

# Setup

## Building

```
npm install -g typescript
```

**Ctrl+Shift+B**, tsc: build or tsc: watch

https://code.visualstudio.com/docs/typescript/typescript-compiling

## Running Unit Tests

*All Tests*
```shell
npm test
```
*Specific Day's Tests*
```shell
npm test 01
```

TODO: Consider https://nodejs.org/docs/latest-v20.x/api/test.html

## Debugging

In VSCode, enable "Auto Attach" and run the script with the --inspect flag.

https://code.visualstudio.com/docs/nodejs/nodejs-debugging

### npm run test (node-terminal)

The `launch.json` file is setup so you can run/debug the unit test of *the currently open* .ts file by simply hitting F5. 

* If you hit F5 from a top-level file (like this one!) all unit tests will be run.
* You'll have to hit Shift+F5 to stop the debugger and clear the terminal.
