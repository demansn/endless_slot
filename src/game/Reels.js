import gsap from "gsap";
import {Reel} from "./Reel";
import services from "../ServiceLocator";
import {SuperContainer} from "../lib/objects/SuperContainer";
import {SOUNDS} from "../constants/sounds";

export class Reels extends SuperContainer {
    constructor(data) {
        super();
        this.symbolWidth = data.symbolWidth;
        this.symbolHeight = data.symbolHeight;
        this.reelWidth = data.reelWidth;
        this.rows = data.rows;
        this.columns = data.columns;

        this.onlyLowSymbols = false;

        /**
         *
         * @type {Reel[]}
         */
        this.reels = [];
        this.frames = [];

        const positions = [0, 240, 480, 720, 960];

        for (let column = 0; column < this.columns; column++) {
                const reel = new Reel({index: column, ...data});

                reel.x = positions[column];
                reel.y = 0;
                this.reels.push(reel);
                this.addChild(reel);

                const frame  =  this.addObject('SpineAnimation', {spine: 'symbols', animation: 'Fixation', loop: true}, {alpha: 0, x: positions[column], y: 217});
                this.frames.push(frame);
        }

        this.mask = this.addObject('ReelMask', {}, {x:  -this.symbolWidth, y: -126, width: this.reelWidth * (this.columns + 1)});
        this.mask.height += 5;
    }

    showFixation(column, force = false) {
        const tl = gsap.timeline();
        const frame = this.frames[column];

        if (force) {
            gsap.killTweensOf(frame);
            frame.play(true);
            frame.alpha = 1;
            return;
        }

        tl  .add(() => frame.play(true))
            .to(frame, {alpha: 1, duration: 0.15});

        return tl;
    }

    hideFixation(reel, force = true) {
        const tl = gsap.timeline();
        const frame = this.frames[reel];

        if (force) {
            gsap.killTweensOf(frame);
            frame.stop();
            frame.alpha = 0;
            return;
        }

        tl.to(frame, {alpha: 0, duration: 0.15})
            .add(() => frame.stop());

        return tl;
    }

    spin({blockedSymbols, blockedReels} = {}, onlySymbols) {
        const timeline = gsap.timeline();
        const fixations = [];

        if (blockedReels && blockedReels.length > 0) {
            this.blockReels(blockedReels);
        }

        if(blockedSymbols && blockedSymbols.length > 0) {
            this.blockSymbols(blockedSymbols);
        }

        for (let column = 0; column < this.columns; column++) {
            const delay = 0.1 * column;

            if (this.reels[column].block) {
                fixations.push(this.showFixation(column));
            }
        }

        timeline.add(fixations);

        let startIndex = 0;

        for (let column = 0; column < this.columns; column++) {
            const delay = 0.1 * startIndex;

            if (this.reels[column].block) {
                continue;
            }

            timeline.add(this.reels[column].startSpin(onlySymbols), delay);
            startIndex += 1;
        }

        return timeline;
    }

    blockReels(reels) {
        this.reels.forEach((reel, i) => {
            reel.block = reels.includes(i);
        });
    }

    unblockReels() {
        this.reels.forEach(reel => {
            reel.block = false;
        });
    }

    blockSymbols(symbolsPositions = []) {
        if (symbolsPositions.length === 0) {
            return;
        }
        const positionsByReel = {};

        symbolsPositions.forEach(({row, column}) => {
            if (!positionsByReel[column]) {
                positionsByReel[column] = [];
            }

            positionsByReel[column].push({row, column});
        });

        this.reels.forEach(reel => {
            reel.blockSymbols(positionsByReel[reel.column] || []);
        });
    }

    unblockSymbols() {
        this.reels.forEach(reel => {
            reel.unblockSymbols();
            this.hideFixation(reel.column, true);
        });
    }

    stop(matrix, force = false) {
        if (force) {
            gsap.killTweensOf(this);
            this.reels.forEach(reel => {
                reel.stop(matrix, force);
                this.hideFixation(reel.column, true);
            });

            return;
        }

        const timeline = gsap.timeline();
        const fixations = [];

        timeline.add(() => {
            const isSpeed = this.data.isSpeedAnimation;
           services.audio.playSfx(isSpeed ?  SOUNDS.spin.fast: SOUNDS.spin.slow);
        })

        this.reels.forEach((reel, i) => {
            if(reel.block) {
                return;
            }

            timeline.add(reel.stop(matrix), '<=+0.05');
        });

        this.reels.forEach((reel, i) => {
            if(reel.block) {
                fixations.push(() => this.hideFixation(i));
            }
        });

        timeline.add(fixations);

        timeline.add(() => {
            this.unblockReels();
            this.unblockSymbols();
        })

        return timeline;
    }

    update(dt) {
        this.reels.forEach(reel => {
            reel.update(dt);
        });
    }

    replaceSymbols(matrix, onlyNewSymbols = false) {
        for (let i = 0; i < this.reels.length; i++) {
            this.reels[i].replaceSymbols(matrix, onlyNewSymbols);
        }
    }

    playWinAnimation(pattern, repeat) {
        const timeline = gsap.timeline();
            const getSymbolWinAnimation = (row, column) => {
                return this.getSymbolByPosition({row, column}).playWinAnimation(repeat);
            };

        timeline.add(pattern.map(getSymbolWinAnimation));

        return timeline;
    }

    playWinAnimationsByPositions(positions) {
        const timeline = gsap.timeline();
        const getSymbolWinAnimation = ({row, column}) => {
            return this.getSymbolByPosition({row, column}).playWinAnimation();
        };
        timeline.add(positions.map(getSymbolWinAnimation));

        return timeline;
    }

    goToIdle() {
        this.reels.forEach(reel => {
            reel.goToIdle();
            this.hideFixation(reel.column, true);
        });
    }

    moveSymbolsDown(symbolsToMove) {
        const timeline = gsap.timeline();
        const symbolsToMoveByReel = {};

        symbolsToMove.forEach(sm => {
            const {position} = sm;

            if (!symbolsToMoveByReel[position.column]) {
                symbolsToMoveByReel[position.column] = [];
            }

            symbolsToMoveByReel[position.column].push(sm);
        });

        for (let column = 0; column < this.columns; column++) {
            const move = symbolsToMoveByReel[column];

            if (!move || move.length === 0) {
                continue;
            }

            timeline.add([
                () =>   services.audio.playSfx('Spin_Fin_1'),
                this.reels[column].moveSymbolsDown(move)
            ], '<=+0.05');
        }

        return timeline;
    }

    /**
     *
     * @returns {ReelSymbol}
     */
    getSymbolByPosition({row, column}) {
        return this.reels[column].getSymbolByRow(row);
    }
}
