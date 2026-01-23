import { test, describe, beforeEach, it,  } from "node:test"
import assert from "node:assert"
import {SlotMath} from "./SlotMath.js";
import {ReelsSymbols} from "../../game/ReelsSymbols.js";

describe('SlotMath', function() {
    let slotMath;
    const slotConfig = {
        rows: 3,
        columns: 5,
        symbols: [
            {name: 'A', id: 1, weight: 1,},
            {name: 'B', id: 2, weight: 1,},
            {name: 'C', id: 3, weight: 1},
            {name: 'D', id: 4, weight: 1},
            {name: 'E', id: 5, weight: 1},
            {name: 'wild', id: 5, weight: 1}
        ],
        paysLinesTable: [
            [
                [1, 0, 0, 0, 0],
                [0, 1, 0, 0, 0],
                [0, 0, 1, 0, 0],
             ],
            [
                [0, 0, 1, 0, 0],
                [0, 1, 0, 0, 0],
                [1, 0, 0, 0, 0],
            ],
            [
                [0, 0, 0, 0, 0],
                [1, 1, 1, 1, 1],
                [0, 0, 0, 0, 0],
            ],
        ],
        bonusElements: [{ name: 'bonus1' }, { name: 'bonus2' }]
    };

    beforeEach(function() {
        slotMath = new SlotMath(slotConfig);
    });

    it('should generate random spin elements', function() {
        const spinElements = slotMath.getRandomSpinElements();
        assert.strictEqual(spinElements.length, 3);
        spinElements.forEach(row => {
            assert.strictEqual(row.length, 5);
            row.forEach(symbol => {
                assert(slotConfig.symbols.map(({name}) => name).includes(symbol));
            });
        });
    });

    it('should return correct pay lines from spin elements', function() {
        const spinElements = [
            ['A', 'B', 'C', 'D', 'E'],
            ['A', 'A', 'C', 'D', 'E'],
            ['B', 'B', 'A', 'D', 'E']
        ];
        const payLines = slotMath.getPayLinesFromSpinElements(spinElements);
        assert.strictEqual(payLines.length, 1);
        assert.deepStrictEqual(payLines[0].pattern, [0, 1, 2]);
        assert.strictEqual(payLines[0].line, 0);
        assert.deepStrictEqual(payLines[0].symbols, ['A', 'A', 'A']);
        assert.deepStrictEqual(payLines[0].patternDefinition, [0, 1, 2]);
    });

    it('should return one pay lines if no matching symbols', function() {
        const spinElements = [
            ['A', 'B', 'C', 'D', 'E'],
            ['B', 'C', 'D', 'E', 'A'],
            ['A', 'D', 'E', 'A', 'B']
        ];
        const payLines = slotMath.getPayLinesFromSpinElements(spinElements);
        assert.strictEqual(payLines.length, 0);
    });

    it('should return correct pay lines from spin elements with wild', function() {
        const spinElements = [
            ['A', 'B', 'C', 'D', 'E'],
            ['A', 'wild', 'C', 'D', 'E'],
            ['B', 'B', 'A', 'D', 'E']
        ];
        const payLines = slotMath.getPayLinesFromSpinElements(spinElements);
        assert.strictEqual(payLines.length, 1);
        assert.deepStrictEqual(payLines[0].pattern, [0, 1, 2]);
        assert.strictEqual(payLines[0].line, 0);
        assert.deepStrictEqual(payLines[0].symbols, ['A', 'wild', 'A']);
        assert.deepStrictEqual(payLines[0].patternDefinition, [0, 1, 2]);
    });


    it('should return correct pay lines from spin elements with wild and line not complete', function() {
        const spinElements = [
            ['A', 'B', 'C', 'D', 'E'],
            ['A', 'wild', 'A', 'A', 'E'],
            ['B', 'B', 'C', 'D', 'E']
        ];
        const payLines = slotMath.getPayLinesFromSpinElements(spinElements);
        assert.strictEqual(payLines.length, 1);
        assert.deepStrictEqual(payLines[0].pattern, [1, 1, 1, 1]);
        assert.strictEqual(payLines[0].line, 2);
        assert.deepStrictEqual(payLines[0].symbols, ['A', 'wild', 'A', 'A']);
        assert.deepStrictEqual(payLines[0].patternDefinition, [1, 1, 1, 1, 1]);
    });

    it('should destroy positions and drop symbols correctly', () => {
        const spinElements = [
            ['A', 'B', 'C', 'D', 'E'],
            ['F', 'G', 'H', 'I', 'J'],
            ['K', 'L', 'M', 'N', 'O']
        ];
        const positions = [{ row: 0, column: 0 }, { row: 1, column: 1 }, { row: 2, column: 2 }];
        const result = slotMath.destroyPositionsAndDropSymbols(spinElements, positions);

        assert.strictEqual(result.length, 3);
        assert.strictEqual(result[0].length, 5);
        assert.strictEqual(result[1].length, 5);
        assert.strictEqual(result[2].length, 5);

        // Check that the specified positions have been destroyed and new symbols have dropped
        assert.notStrictEqual(result[0][0], 'A');
        assert.notStrictEqual(result[1][1], 'G');
        assert.notStrictEqual(result[2][2], 'M');
    });

    it('should return correct neighboring positions and symbols', function() {
        const rows = [
            ['A', 'B', 'C', 'D', 'E'],
            ['F', 'G', 'H', 'I', 'J'],
            ['K', 'L', 'M', 'N', 'O']
        ];
        const { positions, symbols } = slotMath.getNeighboringPositionsAround(rows, 1, 2);

        assert.deepStrictEqual(positions, [
            { row: 0, column: 1 },
            { row: 0, column: 2 },
            { row: 0, column: 3 },
            { row: 1, column: 1 },
            { row: 1, column: 3 },
            { row: 2, column: 1 },
            { row: 2, column: 2 },
            { row: 2, column: 3 }
        ]);
        assert.deepStrictEqual(symbols, ['B', 'C', 'D', 'G', 'I', 'L', 'M', 'N']);
    });

    it('should handle edge positions correctly', function() {
        const rows = [
            ['A', 'B', 'C', 'D', 'E'],
            ['F', 'G', 'H', 'I', 'J'],
            ['K', 'L', 'M', 'N', 'O']
        ];
        const { positions, symbols } = slotMath.getNeighboringPositionsAround(rows, 0, 0);

        assert.deepStrictEqual(positions, [
            { row: 0, column: 1 },
            { row: 1, column: 0 },
            { row: 1, column: 1 }
        ]);
        assert.deepStrictEqual(symbols, ['B', 'F', 'G']);
    });

    it('should return a spin with changed symbols', () => {
        const spinElements = [
            ['A', 'B', 'C', 'D', 'E'],
            ['F', 'G', 'H', 'I', 'J'],
            ['K', 'L', 'M', 'N', 'O']
        ];
        const changeTo = 'bonus1';
        const result = slotMath.getChangeSpin(spinElements, changeTo);

        assert.strictEqual(result.spin_elements.length, 3);
        assert.strictEqual(result.spin_elements[0].length, 5);
        assert.strictEqual(result.spin_elements[1].length, 5);
        assert.strictEqual(result.spin_elements[2].length, 5);

        // Check that the specified positions have been changed to the bonus symbol
        const changedPositions = result.positions;
        changedPositions.forEach(({ row, column }) => {
            assert.strictEqual(result.spin_elements[row][column], changeTo);
        });

        // Check that paylines are calculated
        assert.ok(result.paylines);
    });

    it('should change specified positions to the bonus symbol', () => {
        const spinElements = [
            ['A', 'B', 'C', 'D', 'E'],
            ['F', 'G', 'H', 'I', 'J'],
            ['K', 'L', 'M', 'N', 'O']
        ];
        const positions = [{ row: 0, column: 0 }, { row: 1, column: 1 }, { row: 2, column: 2 }];
        const bonusSymbol = 'bonus1';
        const result = slotMath.changeSymbolToBonusElement(spinElements, positions, bonusSymbol);

        assert.strictEqual(result[0][0], bonusSymbol);
        assert.strictEqual(result[1][1], bonusSymbol);
        assert.strictEqual(result[2][2], bonusSymbol);

        // Ensure other positions remain unchanged
        assert.strictEqual(result[0][1], 'B');
        assert.strictEqual(result[1][0], 'F');
        assert.strictEqual(result[2][3], 'N');
    });

    it('should return a new spin after destroying paylines', () => {
        const spinElements = [
            ['A', 'A', 'A', 'A', 'A'],
            ['B', 'B', 'B', 'B', 'B'],
            ['C', 'C', 'C', 'C', 'C']
        ];
        const payLines = [
            { pattern: [0, 0, 0, 0, 0 ]}
        ];
        const result = slotMath.getSpinAfterDestroyPayLines(spinElements, payLines);

        assert.strictEqual(result.spin_elements.length, 3);
        assert.strictEqual(result.spin_elements[0].length, 5);
        assert.strictEqual(result.spin_elements[1].length, 5);
        assert.strictEqual(result.spin_elements[2].length, 5);

        // Check that the specified positions have been destroyed and new symbols have dropped
        payLines[0].pattern.forEach((row, column ) => {
            assert.notStrictEqual(result.spin_elements[row][column], 'A');
        });

        // Check that paylines are calculated
        assert.ok(result.paylines);
    });
});
