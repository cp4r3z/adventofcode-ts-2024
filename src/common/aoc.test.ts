import * as Shape from './base/shapes';
import * as Point from './base/points';
import * as QuadTree from './quadtree';
import * as Interval from './intervals/interval';
import MultiParentTree, { IMultiParentNode } from './trees/multiparent';
//import { GridOfGrid2D, GridOfGrid2DOptions } from './grids/gridofgrid';
import { GridPoint, Grid2D } from './grids/grid';

describe('Common Tests: Shape.Rectangle', () => {
    const r_x0y0 = new Point.XY(-1, -1);
    const r_x1y1 = new Point.XY(1, 1);
    const rTest = new Shape.Rectangle(r_x0y0, r_x1y1);

    it('Construct Point', async () => {
        const r = new Shape.Rectangle(r_x0y0, r_x0y0);
        expect(r.isPoint(r_x0y0)).toBe(true);
        expect(r.area()).toBe(0);
        expect(r.area(true)).toBe(1);
    });

    it('Construct Line', async () => {
        const r = new Shape.Rectangle(r_x0y0, new Point.XY(r_x0y0.x, r_x0y0.y + 1));
        expect(r.area()).toBe(0);
        expect(r.area(true)).toBe(2);
    });

    it('Construct Using Various Vectors', async () => {
        const reversed = new Shape.Rectangle(r_x1y1, r_x0y0);
        expect(reversed.minX).toBe(r_x0y0.x);
        expect(reversed.maxX).toBe(r_x1y1.x);
        expect(reversed.minY).toBe(r_x0y0.y);
        expect(reversed.maxY).toBe(r_x1y1.y);
        expect(() => new Shape.Rectangle(new Point.XY(0, 0), new Point.XY(1, -1))).toThrow();
        expect(() => new Shape.Rectangle(new Point.XY(1, -1), new Point.XY(0, 0))).toThrow();
        expect(() => new Shape.Rectangle(new Point.XY(0, 0), new Point.XY(-1, 1))).toThrow();
        expect(() => new Shape.Rectangle(new Point.XY(-1, 1), new Point.XY(0, 0))).toThrow();
    });

    it('Area', async () => {
        expect(rTest.area()).toBe(4);
        expect(rTest.area(true)).toBe(9);
    });

    it('Intersects', async () => {
        const intersecting = [
            new Shape.Rectangle(new Point.XY(-1, -1), new Point.XY(1, 1)), // Same
            rTest.copy(), //Same
            new Shape.Rectangle(new Point.XY(-1, -1), new Point.XY(-1, -1)), // Point
            new Shape.Rectangle(new Point.XY(-1, -1), new Point.XY(0, 0)),
            new Shape.Rectangle(new Point.XY(-2, -2), new Point.XY(-1, -1)), // Touching corner
            new Shape.Rectangle(new Point.XY(1, 1), new Point.XY(2, 2)), // Touching corner
            new Shape.Rectangle(new Point.XY(1, -1), new Point.XY(2, 1)),
            new Shape.Rectangle(new Point.XY(-10, -10), new Point.XY(10, 10))
        ];

        intersecting.forEach(r => {
            expect(rTest.intersects(r)).toBe(true);
        });

        const notIntersecting = [
            new Shape.Rectangle(new Point.XY(-3, -3), new Point.XY(-2, -2)),
            new Shape.Rectangle(new Point.XY(1, 2), new Point.XY(1, 3)),
        ];

        notIntersecting.forEach(r => {
            expect(rTest.intersects(r)).toBe(false);
        });

    });

});

describe('Common Tests: QuadTree', () => {
    const r2x2 = {
        x0y0: new Point.XY(0, 0),
        x1y1: new Point.XY(1, 1)
    };

    const r3x3 = {
        x0y0: new Point.XY(-1, -1),
        x1y1: new Point.XY(1, 1)
    };

    const r4x4 = {
        x0y0: new Point.XY(0, 0),
        x1y1: new Point.XY(3, 3)
    };

    const r1x4 = {
        x0y0: new Point.XY(0, 0),
        x1y1: new Point.XY(0, 3)
    };

    const r20x20 = {
        x0y0: new Point.XY(-10, -10),
        x1y1: new Point.XY(10, 10)
    };

    it('QuadTree.Rectangle', async () => {
        const b2x2 = new QuadTree.Rectangle(r2x2.x0y0, r2x2.x1y1, { isRoot: true });
        expect(b2x2.x0y0.x).toBe(0);
        expect(b2x2.x0y0.y).toBe(0);
        expect(b2x2.x1y1.x).toBe(1);
        expect(b2x2.x1y1.y).toBe(1);

        const b4x4 = new QuadTree.Rectangle(r4x4.x0y0, r4x4.x1y1, { isRoot: true });
        expect(b4x4.x0y0.x).toBe(0);
        expect(b4x4.x0y0.y).toBe(0);
        expect(b4x4.x1y1.x).toBe(3);
        expect(b4x4.x1y1.y).toBe(3);

        const b3x3 = new QuadTree.Rectangle(r3x3.x0y0, r3x3.x1y1, { isRoot: true });
        expect(b3x3.deltaX()).toBe(3);
        expect(b3x3.deltaY()).toBe(3);
        expect(b3x3.deltaX(true)).toBe(4);
        expect(b3x3.deltaY(true)).toBe(4);
        expect(b3x3.area(true)).toBe(16);

        const b1x4 = new QuadTree.Rectangle(r1x4.x0y0, r1x4.x1y1, { isRoot: true });
        expect(b1x4.x0y0.x).toBe(0);
        expect(b1x4.x0y0.y).toBe(0);
        expect(b1x4.x1y1.x).toBe(3);
        expect(b1x4.x1y1.y).toBe(3);
        expect(b1x4.area(true)).toBe(16);
        // TODO: ACTIVE AREA

        const b1x4Buffered = new QuadTree.Rectangle(r1x4.x0y0, r1x4.x1y1, { isRoot: true, buffer: .25 });
        expect(b1x4Buffered.x0y0.x).toBe(-1);
        expect(b1x4Buffered.x0y0.y).toBe(-1);
        expect(b1x4Buffered.x1y1.x).toBe(6);
        expect(b1x4Buffered.x1y1.y).toBe(6);
        expect(b1x4Buffered.deltaX(true)).toBe(8);
        expect(b1x4Buffered.deltaY(true)).toBe(8);
        expect(b1x4Buffered.area(true)).toBe(64);

        const b20x20 = new QuadTree.Rectangle(r20x20.x0y0, r20x20.x1y1, { isRoot: true });
        expect(b20x20.x0y0.x).toBe(-10);
        expect(b20x20.x0y0.y).toBe(-10);
        expect(b20x20.x1y1.x).toBe(21);
        expect(b20x20.x1y1.y).toBe(21);
        expect(b20x20.deltaX(true)).toBe(32);
        expect(b20x20.deltaY(true)).toBe(32);
        expect(b20x20.area(true)).toBe(1024);

        const b20x20Buffered = new QuadTree.Rectangle(r20x20.x0y0, r20x20.x1y1, { isRoot: true, buffer: .25 });
        expect(b20x20Buffered.x0y0.x).toBe(-13);
        expect(b20x20Buffered.x0y0.y).toBe(-13);
        expect(b20x20Buffered.x1y1.x).toBe(18);
        expect(b20x20Buffered.x1y1.y).toBe(18);
        expect(b20x20Buffered.deltaX(true)).toBe(32);
        expect(b20x20Buffered.deltaY(true)).toBe(32);
        expect(b20x20Buffered.area(true)).toBe(1024);
    });

    it('QuadTree', async () => {
        const b2x2 = new QuadTree.Rectangle(r2x2.x0y0, r2x2.x1y1, { isRoot: true });
        const qt2x2 = new QuadTree.QuadTree(b2x2);
        expect(qt2x2.area()).toBe(4);

        const b20x20Buffered = new QuadTree.Rectangle(r20x20.x0y0, r20x20.x1y1, { isRoot: true, buffer: .25 });
        const qt20x20Buffered = new QuadTree.QuadTree(b20x20Buffered);
        expect(qt20x20Buffered.area()).toBe(1024);
    });

    it('QuadTree Active State', async () => {
        const b20x20 = new QuadTree.Rectangle(r20x20.x0y0, r20x20.x1y1, { isRoot: true });
        const b20x20Buffered = new QuadTree.Rectangle(r20x20.x0y0, r20x20.x1y1, { isRoot: true, buffer: .25 });
        const qt20x20Buffered = new QuadTree.QuadTree(b20x20Buffered);
        expect(qt20x20Buffered.area()).toBe(1024);
        qt20x20Buffered.SetActive(b20x20, QuadTree.ActiveState.ACTIVE);
    });

    it('QuadTree Set/Get', async () => {
        const b2x2 = new QuadTree.Rectangle(r2x2.x0y0, r2x2.x1y1, { isRoot: true });
        const qt2x2 = new QuadTree.QuadTree<String>(b2x2);
        const b1x2 = new Shape.Rectangle(r2x2.x0y0, new Point.XY(0, 1));

        qt2x2.Set(b1x2, "TEST");
        const test = qt2x2.Get(new Shape.Rectangle(r2x2.x0y0, r2x2.x0y0));
        expect(test).toBe("TEST");
    });

    it('QuadTree Set/Get Large', async () => {
        const bLarge = new QuadTree.Rectangle(new Point.XY(-1e6, -1e6), new Point.XY(1e6, 1e6), { isRoot: true });
        const qtLarge = new QuadTree.QuadTree<string>(bLarge);
        const dataBounds = new Shape.Rectangle(new Point.XY(-1e3, -1e3), new Point.XY(1e3, 1e3));
        qtLarge.Set(dataBounds, "TEST");
        const test = qtLarge.Get(new Shape.Rectangle(new Point.XY(0, 0)));
        expect(test).toBe("TEST");
        const outside = qtLarge.Get(new Shape.Rectangle(new Point.XY(1e4, 0)));
        expect(outside).toBeNull();
        const outsidex0y0 = qtLarge.Get(new Shape.Rectangle(new Point.XY(-1e3 - 1)));
        expect(outsidex0y0).toBeNull();
        const outsidex1y1 = qtLarge.Get(new Shape.Rectangle(new Point.XY(1e3 + 1)));
        expect(outsidex1y1).toBeNull();
    });

    it('QuadTree Set/Get Large 2', async () => {
        const prime = 39916801; // This causes memory to blow
        const smallprime = 65537;
        const bLarge = new QuadTree.Rectangle(new Point.XY(0, 0), new Point.XY(smallprime, smallprime), { isRoot: true, buffer: .25 });
        const qtLarge = new QuadTree.QuadTree<string>(bLarge);
        const dataBounds = new Shape.Rectangle(new Point.XY(1, 1), new Point.XY(smallprime, smallprime));
        qtLarge.Set(dataBounds, "TEST");
        // const test = qtLarge.Get(new Shape.Rectangle(new Point.XY(0, 0)));
        // expect(test).toBe("TEST");
        // const outside = qtLarge.Get(new Shape.Rectangle(new Point.XY(1e4, 0)));
        // expect(outside).toBeNull();
        // const outsidex0y0 = qtLarge.Get(new Shape.Rectangle(new Point.XY(-1e3 - 1)));
        // expect(outsidex0y0).toBeNull();
        // const outsidex1y1 = qtLarge.Get(new Shape.Rectangle(new Point.XY(1e3 + 1)));
        // expect(outsidex1y1).toBeNull();
    });

    /**
     * After we fill an entire quad, it should "collapse" into it's parent  
     */
    it('QuadTree Set - Fill Quad with Same', async () => {
        const b = new QuadTree.Rectangle(new Point.XY(0, 0), new Point.XY(3, 3), { isRoot: true });
        const qt = new QuadTree.QuadTree<String>(b);
        const dataBounds1 = new Shape.Rectangle(new Point.XY(0, 0), new Point.XY(1, 3));
        qt.Set(dataBounds1, "TEST");
        const dataBounds2 = new Shape.Rectangle(new Point.XY(2, 0), new Point.XY(3, 3));
        qt.Set(dataBounds2, "TEST");
        const test = qt.Get(new Shape.Rectangle(r2x2.x0y0, r2x2.x0y0));
        expect(test).toBe("TEST");
    });
});

describe('Common Tests: Intervals', () => {
    /**
     *    -10123456789
     * A      {     }   <- A
     * B
     * 0.0 |            <- highInterval length is 1
     * 0.1 [ ]
     * 0.2 [  ]
     * 0.3 [   ]
     * 1.0    |
     * 1.1    []
     * 1.2    [     ]   <- Equal
     * 2.0     |
     * 2.1     []
     * 2.2     [    ]
     * 3.0          |    <- highInterval length is 1
     * 3.1          [ ]
     * 4.0           []
     */

    const A = new Interval.Interval(2, 8);

    it('0.0', async () => {
        const b = new Interval.Interval(-1, -1);
        const result = A.IntersectWith(b);
        expect(
            result.get(Interval.In.This)[0]
                .Equals(new Interval.Interval(2, 8))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.That)[0]
                .Equals(new Interval.Interval(-1, -1))
        ).toBeTruthy();
    });

    it('0.1', async () => {
        const b = new Interval.Interval(-1, 1);
        const result = A.IntersectWith(b);
        expect(
            result.get(Interval.In.This)[0]
                .Equals(new Interval.Interval(2, 8))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.That)[0]
                .Equals(new Interval.Interval(-1, 1))
        ).toBeTruthy();
    });

    it('0.2', async () => {
        const b = new Interval.Interval(-1, 2);
        const result = A.IntersectWith(b);
        expect(
            result.get(Interval.In.This)[0]
                .Equals(new Interval.Interval(3, 8))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.This | Interval.In.That)[0]
                .Equals(new Interval.Interval(2, 2))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.That)[0]
                .Equals(new Interval.Interval(-1, 1))
        ).toBeTruthy();
    });

    it('0.3', async () => {
        const b = new Interval.Interval(-1, 3);
        const result = A.IntersectWith(b);
        expect(
            result.get(Interval.In.This)[0]
                .Equals(new Interval.Interval(4, 8))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.This | Interval.In.That)[0]
                .Equals(new Interval.Interval(2, 3))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.That)[0]
                .Equals(new Interval.Interval(-1, 1))
        ).toBeTruthy();
    });

    it('1.0', async () => {
        const b = new Interval.Interval(2, 2);
        const result = A.IntersectWith(b);
        expect(
            result.get(Interval.In.This)[0]
                .Equals(new Interval.Interval(3, 8))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.This | Interval.In.That)[0]
                .Equals(new Interval.Interval(2, 2))
        ).toBeTruthy();
    });

    it('1.1', async () => {
        const b = new Interval.Interval(2, 3);
        const result = A.IntersectWith(b);
        expect(
            result.get(Interval.In.This)[0]
                .Equals(new Interval.Interval(4, 8))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.This | Interval.In.That)[0]
                .Equals(new Interval.Interval(2, 3))
        ).toBeTruthy();
    });

    it('1.2', async () => {
        const b = new Interval.Interval(2, 8);
        const result = A.IntersectWith(b);
        expect(
            result.get(Interval.In.This | Interval.In.That)[0]
                .Equals(new Interval.Interval(2, 8))
        ).toBeTruthy();
    });

    it('2.0', async () => {
        const b = new Interval.Interval(3, 3);
        const result = A.IntersectWith(b);
        expect(
            result.get(Interval.In.This)[0]
                .Equals(new Interval.Interval(2, 2))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.This)[1]
                .Equals(new Interval.Interval(4, 8))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.This | Interval.In.That)[0]
                .Equals(new Interval.Interval(3, 3))
        ).toBeTruthy();
    });

    it('2.1', async () => {
        const b = new Interval.Interval(3, 4);
        const result = A.IntersectWith(b);
        expect(
            result.get(Interval.In.This)[0]
                .Equals(new Interval.Interval(2, 2))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.This)[1]
                .Equals(new Interval.Interval(5, 8))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.This | Interval.In.That)[0]
                .Equals(new Interval.Interval(3, 4))
        ).toBeTruthy();
    });

    it('3.0', async () => {
        const b = new Interval.Interval(8, 8);
        const result = A.IntersectWith(b);
        expect(
            result.get(Interval.In.This)[0]
                .Equals(new Interval.Interval(2, 7))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.This | Interval.In.That)[0]
                .Equals(new Interval.Interval(8, 8))
        ).toBeTruthy();
    });

    it('4.0', async () => {
        const b = new Interval.Interval(9, 10);
        const result = A.IntersectWith(b);
        expect(
            result.get(Interval.In.This)[0]
                .Equals(new Interval.Interval(2, 8))
        ).toBeTruthy();
        expect(
            result.get(Interval.In.That)[0]
                .Equals(new Interval.Interval(9, 10))
        ).toBeTruthy();
    });

});

describe('Common Tests: Trees', () => {
    it('Construct MultiParentTree with N Leaves', async () => {
        class Node implements IMultiParentNode {
            public Left: Node;
            public Right: Node;
            public LeftParent: Node;
            public RightParent: Node;

            constructor(public Data: any = null) { }
        }

        const tree = MultiParentTree.CreateLevels<Node>(Node, 5, 0);
        const numbers = [-2, -1, 0, 1, 2];
        for (let i = 0; i < numbers.length; i++) {
            const number = numbers[i];
            tree.Leaves[i].Data = number;
        }
        expect(tree.Root.Data).toBe(0);
        expect(tree.Root.Left.Left.Left.Left.Data).toBe(-2);
        expect(tree.Leaves[0].RightParent.Right.Data).toBe(-1);
        expect(tree.Leaves[4].LeftParent.Left.Data).toBe(1);
        expect(tree.LevelCount()).toBe(5);
    });
});

// describe('Common Tests: Grids', () => {
//     describe('Grid2DInfinite', () => {
        
//         let gog: GridOfGrid2D<Grid2D>; // Common Test Object
        
//         beforeAll(() => {
//             const subGridBounds = new Shape.Rectangle(new Point.XY(0, 0), new Point.XY(3, 3)); // 4x4
//             gog = new GridOfGrid2D(subGridBounds);
//             for (let y = -4; y < 4; y++) {
//                 for (let x = -4; x < 4; x++) {
//                     let signX = (x > -1) ? ' ' : '';
//                     let signY = (y > -1) ? ' ' : '';
//                     const point = new GridPoint(x, y, `${signX}${x},${signY}${y} `);
//                     gog.setGridPoint(point);
//                 }
//             }
//         });

//         it('Print', async () => {
//             //gog.print();
//         });

//         it('Bounds', async () => {
//             const bounds: Shape.Rectangle = gog.getBounds();
//             expect(Point.XY.AreEqual(bounds.x0y0, new Point.XY(-4, -4))).toBeTruthy();
//             expect(Point.XY.AreEqual(bounds.x1y1, new Point.XY(3, 3))).toBeTruthy();
//         });

//         it('Point', async () => {
//             const point: GridPoint = gog.getPoint(new Point.XY(3, 3));
//             expect(point.Value).toBe(' 3, 3 ');
//         });
//     });
// });
