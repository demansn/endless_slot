import {FrameLayout, FrameLayoutConfig} from '../src/lib/FrameLayout.js';
import { strict as assert } from 'assert';
import {beforeEach, describe, it} from "node:test";

describe('FrameLayoutConfig', () => {
    it('creates with default values when no options provided', () => {
        const config = new FrameLayoutConfig();
        assert.equal(config.flexDirection, 'row');
        assert.equal(config.alignItems, 'start');
        assert.equal(config.justifyContent, 'start');
        assert.equal(config.wrap, false);
        assert.deepEqual(config.padding, {top: 0, right: 0, bottom: 0, left: 0});
    });

    it('creates with custom values when options provided', () => {
        const config = new FrameLayoutConfig({
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'end',
            wrap: true,
            padding: 5
        });
        assert.equal(config.flexDirection, 'column');
        assert.equal(config.alignItems, 'center');
        assert.equal(config.justifyContent, 'end');
        assert.equal(config.wrap, true);
        assert.deepEqual(config.padding, {top: 5, right: 5, bottom: 5, left: 5});
    });

    it('handles object padding correctly', () => {
        const config = new FrameLayoutConfig({
            padding: {top: 1, right: 2, bottom: 3, left: 4}
        });
        assert.deepEqual(config.padding, {top: 1, right: 2, bottom: 3, left: 4});
    });

    it('fills missing padding values with zeros', () => {
        const config = new FrameLayoutConfig({
            padding: {top: 5, right: 10}
        });
        assert.deepEqual(config.padding, {top: 5, right: 10, bottom: 0, left: 0});
    });

    it('handles zero padding value', () => {
        const config = new FrameLayoutConfig({padding: 0});
        assert.deepEqual(config.padding, {top: 0, right: 0, bottom: 0, left: 0});
    });

    describe('FrameLayout.applyLayout', () => {
        it('applies wrap when content exceeds container width', () => {
            const layout = new FrameLayout({wrap: true});
            const children = [
                {width: 100, height: 50, margin: 0, x: 0, y: 0},
                {width: 150, height: 50, margin: 0, x: 0, y: 0}
            ];

            const result = layout.applyLayout(children, 200, 100);

            assert.equal(children[0].x, 0);
            assert.equal(children[0].y, 0);
            assert.equal(children[1].x, 0);
            assert.equal(children[1].y, 50);
        });

        it('handles space-between justification in row direction', () => {
            const layout = new FrameLayout({justifyContent: 'space-between'});
            const children = [
                {width: 50, height: 50, margin: 0, x: 0, y: 0},
                {width: 50, height: 50, margin: 0, x: 0, y: 0}
            ];

            const result = layout.applyLayout(children, 200);

            assert.equal(children[0].x, 0);
            assert.equal(children[1].x, 150);
        });

        it('handles space-around justification in column direction', () => {
            const layout = new FrameLayout({
                flexDirection: 'column',
                justifyContent: 'space-around'
            });
            const children = [
                {width: 50, height: 50, margin: 0, x: 0, y: 0},
                {width: 50, height: 50, margin: 0, x: 0, y: 0}
            ];

            const result = layout.applyLayout(children, null, 200);

            assert.equal(children[0].y, 25);
            assert.equal(children[1].y, 125);
        });

        it('centers items along cross axis in row direction', () => {
            const layout = new FrameLayout({alignItems: 'center'});
            const children = [
                {width: 50, height: 50, margin: 0, x: 0, y: 0},
                {width: 50, height: 100, margin: 0, x: 0, y: 0}
            ];

            const result = layout.applyLayout(children, 200, 200);

            assert.equal(children[0].x, 0);
            assert.equal(children[1].x, 50);
        });

        it('respects container padding', () => {
            const layout = new FrameLayout({
                padding: {top: 10, right: 20, bottom: 10, left: 20}
            });
            const children = [
                {width: 100, height: 50, margin: 0, x: 0, y: 0}
            ];

            const result = layout.applyLayout(children);

            assert.equal(children[0].x, 20);
            assert.equal(children[0].y, 10);
            assert.equal(result.width, 140);
            assert.equal(result.height, 70);
        });
    });

    it('aligns items vertically center in row direction', () => {
        const layout = new FrameLayout({
            alignItems: 'center',
            height: 200
        });
        const children = [
            {width: 50, height: 50, margin: 0, x: 0, y: 0},
            {width: 50, height: 100, margin: 0, x: 50, y: 0}
        ];

        layout.applyLayout(children);

        assert.equal(children[0].y, 75);
        assert.equal(children[1].y, 50);
    });

    it('aligns items vertically end in row direction', () => {
        const layout = new FrameLayout({
            alignItems: 'end',
            height: 200
        });
        const children = [
            {width: 50, height: 50, margin: 0, x: 0, y: 0},
            {width: 50, height: 100, margin: 0, x: 50, y: 0}
        ];

        layout.applyLayout(children);

        assert.equal(children[0].y, 150);
        assert.equal(children[1].y, 100);
    });

    it('aligns items horizontally center in column direction', () => {
        const layout = new FrameLayout({
            flexDirection: 'column',
            alignItems: 'center',
            width: 200
        });
        const children = [
            {width: 50, height: 50, margin: 0, x: 0, y: 0},
            {width: 100, height: 50, margin: 0, x: 0, y: 50}
        ];

        layout.applyLayout(children);

        assert.equal(children[0].x, 75);
        assert.equal(children[1].x, 50);
    });

    it('aligns items horizontally end in column direction', () => {
        const layout = new FrameLayout({
            flexDirection: 'column',
            alignItems: 'end',
            width: 200
        });
        const children = [
            {width: 50, height: 50, margin: 0, x: 0, y: 0},
            {width: 100, height: 50, margin: 0, x: 0, y: 50}
        ];

        layout.applyLayout(children);

        assert.equal(children[0].x, 150);
        assert.equal(children[1].x, 100);
    });

    describe('FrameLayout with 3 children and wrap', () => {
        it('handles 3 children with wrap, alignItems=center, justifyContent=space-between in row direction', () => {
            const layout = new FrameLayout({
                wrap: true,
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
                width: 250,
                height: 200,
                elementsMargin: 0
            });

            const children = [
                {width: 100, height: 50, x: 0, y: 0},
                {width: 100, height: 70, x: 0, y: 0},
                {width: 100, height: 60, x: 0, y: 0}
            ];

            layout.applyLayout(children);

            assert.equal(children[0].x, 0);
            assert.equal(children[1].x, 150);
            assert.equal(children[0].y, 75);
            assert.equal(children[1].y, 65);
            assert.equal(children[2].x, 0);
            assert.equal(children[2].y, 140);
        });

        it('handles 3 children with wrap, alignItems=end, justifyContent=space-around in column direction', () => {
            const layout = new FrameLayout({
                wrap: true,
                alignItems: 'end',
                justifyContent: 'space-around',
                flexDirection: 'column',
                width: 300,
                height: 200,
                elementsMargin: 0
            });

            const children = [
                {width: 80, height: 50, x: 0, y: 0},
                {width: 100, height: 50, x: 0, y: 0},
                {width: 90, height: 50, x: 0, y: 0}
            ];

            layout.applyLayout(children);

            assert.equal(children[0].x, 220);
            assert.equal(children[1].x, 200);
            assert.equal(children[2].x, 210);

            const spaceAround = 200 / 3;
            assert.equal(children[0].y, spaceAround / 2);
            assert.equal(children[1].y, spaceAround + spaceAround / 2);
            assert.equal(children[2].y, 2 * spaceAround + spaceAround / 2);
        });

        it('handles 3 children with wrap and margins', () => {
            const layout = new FrameLayout({
                wrap: true,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                width: 300,
                height: 200,
                elementsMargin: 10
            });

            const children = [
                {width: 100, height: 50, x: 0, y: 0},
                {width: 100, height: 50, x: 0, y: 0},
                {width: 100, height: 50, x: 0, y: 0}
            ];

            layout.applyLayout(children);

            assert.equal(children[0].x, 35);
            assert.equal(children[1].x, 165);
            assert.equal(children[0].y, 75);
            assert.equal(children[1].y, 75);
            assert.equal(children[2].x, 100);
            assert.equal(children[2].y, 135);
        });
    });
});

describe('FrameLayout.alignByCrossAxis', () => {
    let layout;

    beforeEach(() => {
        layout = new FrameLayout();
    });

    it('does not change positions when alignItems=start', () => {
        layout = new FrameLayout({
            alignItems: 'start',
            width: 300,
            height: 200
        });

        const children = [
            {width: 50, height: 40, x: 10, y: 10},
            {width: 50, height: 40, x: 70, y: 10}
        ];

        layout.alignByCrossAxis(children, 300, 200);

        assert.equal(children[0].x, 10);
        assert.equal(children[0].y, 10);
        assert.equal(children[1].x, 70);
        assert.equal(children[1].y, 10);
    });

    describe('row direction', () => {
        beforeEach(() => {
            layout = new FrameLayout({
                flexDirection: 'row',
                width: 300,
                height: 200
            });
        });

        it('centers items vertically with alignItems=center', () => {
            layout.config.alignItems = 'center';
            const children = [
                {width: 50, height: 40, x: 10, y: 0},
                {width: 50, height: 60, x: 70, y: 0}
            ];

            layout.alignByCrossAxis(children, 300, 200);

            assert.equal(children[0].x, 10);
            assert.equal(children[0].y, 80);
            assert.equal(children[1].x, 70);
            assert.equal(children[1].y, 70);
        });

        it('aligns items to bottom with alignItems=end', () => {
            layout.config.alignItems = 'end';
            const children = [
                {width: 50, height: 40, x: 10, y: 0},
                {width: 50, height: 60, x: 70, y: 0}
            ];

            layout.alignByCrossAxis(children, 300, 200);

            assert.equal(children[0].x, 10);
            assert.equal(children[0].y, 160);
            assert.equal(children[1].x, 70);
            assert.equal(children[1].y, 140);
        });

        it('considers margins when centering', () => {
            layout = new FrameLayout({
                flexDirection: 'row',
                alignItems: 'center',
                width: 300,
                height: 200,
                elementsMargin: 10
            });

            const children = [
                {width: 50, height: 40, x: 10, y: 0},
                {width: 50, height: 60, x: 70, y: 0}
            ];

            layout.alignByCrossAxis(children, 300, 200);

            assert.equal(children[0].x, 10);
            assert.equal(children[0].y, 85);
            assert.equal(children[1].x, 70);
            assert.equal(children[1].y, 75);
        });
    });

    describe('column direction', () => {
        beforeEach(() => {
            layout = new FrameLayout({
                flexDirection: 'column',
                width: 300,
                height: 200
            });
        });

        it('centers items horizontally with alignItems=center', () => {
            layout.config.alignItems = 'center';
            const children = [
                {width: 50, height: 40, x: 0, y: 10},
                {width: 80, height: 40, x: 0, y: 60}
            ];

            layout.alignByCrossAxis(children, 300, 200);

            assert.equal(children[0].x, 125);
            assert.equal(children[0].y, 10);
            assert.equal(children[1].x, 110);
            assert.equal(children[1].y, 60);
        });

        it('aligns items to right with alignItems=end', () => {
            layout.config.alignItems = 'end';
            const children = [
                {width: 50, height: 40, x: 0, y: 10},
                {width: 80, height: 40, x: 0, y: 60}
            ];

            layout.alignByCrossAxis(children, 300, 200);

            assert.equal(children[0].x, 250);
            assert.equal(children[0].y, 10);
            assert.equal(children[1].x, 220);
            assert.equal(children[1].y, 60);
        });

        it('considers margins when centering', () => {
            layout = new FrameLayout({
                flexDirection: 'column',
                alignItems: 'center',
                width: 300,
                height: 200,
                elementsMargin: 10
            });

            const children = [
                {width: 50, height: 40, x: 0, y: 10},
                {width: 80, height: 40, x: 0, y: 60}
            ];

            layout.alignByCrossAxis(children, 300, 200);

            assert.equal(children[0].x, 130);
            assert.equal(children[0].y, 10);
            assert.equal(children[1].x, 115);
            assert.equal(children[1].y, 60);
        });
    });
});
