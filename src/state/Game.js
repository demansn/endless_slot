import gsap from "gsap";
import {services} from "../ServiceLocator";
import {Reels} from "../game/Reels";
import {ReelsSymbols} from "../game/ReelsSymbols";
import {SuperContainer} from "../lib/objects/SuperContainer";
import {Graphics} from "pixi.js";
import {PayLinesAnimationsPlayer} from "../PayLinesAnimationsPlayer";
import {Features} from "../constants";
import {SOUNDS} from "../constants/sounds";

export class TotalWin extends SuperContainer {
    constructor() {
        super();

        this.multiplierBg = this.addObject('MultiBG', {}, {anchor: 0.5, x: -3.5});
        this.multiplierText = this.addObject('Text', {text: '0', style: 'MultiplierWinText'}, {anchor: 0.5});
        this.totalWinText = this.addObject('Text', {text: '0', style: 'TotalWinText'}, {anchor: 0.5, y: 54});
    }

    show(value, multiplier) {
        if (multiplier > 1) {
            this.multiplierBg.visible = true;
            this.multiplierText.visible = true;
            this.multiplierText.text = `X${multiplier}`;
        } else {
            this.multiplierBg.visible = false;
            this.multiplierText.visible = false;
        }

        this.totalWinText.visible = true;
        this.totalWinText.text = `   ${value}   `;
    }

    hide() {
        this.multiplierBg.visible = false;
        this.multiplierText.visible = false;
        this.totalWinText.visible = false;
    }
}

export default class Game extends SuperContainer {
    state = null;

    constructor({hud}) {
        super();

        this.hud = hud;
        const gameConfig = services.gameConfig;

        this.options = {
            ...gameConfig
        };

        this.frameContainer = this.addObject('SuperContainer', {}, {x: -470, y: -220});
        this.frame = this.frameContainer.addObject('frame');
        this.frames = {
            [Features.MAIN_GAME]: this.frameContainer.addObject('SuperContainer'),
            [Features.FREE_SPINS]: this.frameContainer.addObject('SuperContainer', {}, {alpha: 0}),
            [Features.FULL_PLEASURE]: this.frameContainer.addObject('SuperContainer', {}, {alpha: 0}),
            [Features.DOUBLE_LECHERY]: this.frameContainer.addObject('SuperContainer', {}, {alpha: 0}),
        };
        this.frames[Features.MAIN_GAME].addObject('mainGameLogo', {}, {anchor: 0.5, y: 0, x:  this.frame.width / 2});
        this.frames[Features.FREE_SPINS].addObject('mainGameLogo', {}, {anchor: 0.5, y: 0, x:  this.frame.width / 2});
        this.frames[Features.FULL_PLEASURE].addObject('FullPleasuerLogo', {}, {anchor: 0.5, y: 40, x:  this.frame.width / 2});
        this.frames[Features.DOUBLE_LECHERY].addObject('doubleLecheryLogo', {}, {anchor: 0.5, y: 40, x:  this.frame.width / 2});
        this.currentFrame = this.frames[Features.MAIN_GAME];

        this.resultAnimationTimeLine = null;

        this.reels = new Reels(
            {
                columns:  this.options.columns,
                rows:  this.options.rows,
                symbolWidth: this.options.symbolWidth,
                reelWidth: this.options.symbolWidth + 20,
                reelHeight: this.options.symbolHeight * this.options.rows,
                symbolHeight: this.options.symbolHeight,
                reelsWidth: this.options.symbolWidth * this.options.columns,
                reelsHeight: this.options.symbolHeight * this.options.rows,
                reelsSymbols: new ReelsSymbols(this.options.symbols),
            }
        );

        this.shadow = this.reels.addChild(new Graphics());
        this.shadow.beginFill(0x000000, 0.6);
        this.shadow.drawRect(-180, -142, this.reels.width + 180, this.reels.height + 142);
        this.shadow.endFill();
        this.shadow.alpha = 0;
        this.addChild(this.reels);

        this.paylines = this.addObject(PayLinesAnimationsPlayer, {payLines: services.gameMath.payLines, ...this.options, symbolWidth: 205, reels: this.reels}, {layer: 'paylineLayer'});
        this.totalWin = this.addObject(TotalWin, {}, {x: 478, y: 203, 'layer': 'hud'});
        this.totalWin.hide();
        // this.paylines.playPayLine(6);
        // this.paylines.playPayLine(7);
        // this.paylines.playPayLine(8);
        // this.paylines.playPayLine(9);
        // this.paylines.playPayLine(16);
        // this.paylines.playPayLine(17);
        // this.paylines.playPayLine(4);
    }

    switchFrame(name) {
        const from = this.currentFrame;
        const to = this.frames[name];
        const duration = 0.5;

        this.currentFrame = to;

        gsap.timeline()
            .add([
                gsap.to(to, {alpha: 1, duration}),
                gsap.to(from, {alpha: 0, duration})
            ])
    }

    update( dt ) {
        this.reels.update( dt );
    }

    spin(result = {}, onlySymbols = []) {
        const tl = gsap.timeline();

        this.reels.goToIdle();

        tl.add(this.reels.spin(result, onlySymbols), '<=+0.05');

        return tl;
    }

    stop(result) {
        const tl = gsap.timeline();

        tl.add(this.reels.stop(result.matrix), '<=+0.05');

        return tl;
    }

    reSpin(result) {
        const timeline = gsap.timeline();

        timeline
            .add([
                this.reels.spin(result),
                () => {
                    services.audio.playSfx(SOUNDS.respin.long);
                }
            ])
            .add(this.reels.stop(result.matrix), '+=2')
            .call(() => {
                this.reels.unblockSymbols();
                this.reels.unblockReels();
            });

        return timeline;
    }

    skipReSpin(result) {
        const {matrix} = result;

        if (this.resultAnimationTimeLine) {
            this.resultAnimationTimeLine.kill();
            this.resultAnimationTimeLine = null;
        }

        this.reels.stop(matrix, true);
        this.reels.unblockSymbols();
        this.shadow.alpha = 0;
    }

    playWinAnimation(result) {
        this.resultAnimationTimeLine = this.getWinAnimationTimeline(result);

        return this.resultAnimationTimeLine;
    }

    playWinAnimationsByPositions(positions, sfx) {
        const tl = this.timeline({paused: false});

        tl.add(this.fadeIn());
        tl.add(() => services.audio.playSfx(sfx));
        tl.add(this.reels.playWinAnimationsByPositions(positions));
        tl.add(this.fadeOut());

        return tl;
    }

    getWinAnimationTimeline(result) {
        const timeline = gsap.timeline({paused: false});
        const {paylines, beforeMatrix, bonusSymbol} = result;
        const repeat = this.data.isSpeedAnimation ? 1 : 2;
        const paylineAnimation = this.data.isWinAnimation;
        const isElementAnimation = this.data.isElementAnimation;
        const isShort = this.data.isSpeedAnimation ? 1 : 2;
        const sfx = isShort ? SOUNDS.win.short : SOUNDS.win.long;

        this.reels.replaceSymbols(beforeMatrix, true);

        if (paylineAnimation || isElementAnimation) {
            timeline.add(this.fadeIn());

            for (let i = 0; i < paylines.length; i++) {
                const {pattern, line, win, multiplier, symbols, patternDefinition} = paylines[i];
                const paylineSymbol = symbols[0];
                const animations = [
                    () => this.hud.addWin(win),
                    () => this.totalWin.show(win, multiplier)
                ];

                if (paylineAnimation) {
                    animations.push(() => this.paylines.playPayLine(patternDefinition));

                    if (!isElementAnimation) {
                        animations.push(gsap.to({}, {duration: 1 / 100 *  (100 - this.data.animationSpeed)}));
                    }
                }

                if (isElementAnimation) {
                    animations.push(() => services.audio.playSfx( sfx));
                    animations.push(this.reels.playWinAnimation(pattern, repeat));
                }

                timeline.add(animations);

                timeline.add([
                    () => this.paylines.stopAllPayLines(),
                    () => this.totalWin.hide()
                ]);
            }

            timeline.add(this.fadeOut());
        } else {
            timeline.add(this.fadeIn());
            timeline.add([
                () => this.hud.setWin(result.totalWin),
                () => this.totalWin.show(result.totalWin),
                gsap.to({}, {duration: 0.75}),
            ])

            timeline.add([
                () => this.totalWin.hide()
            ]);
            timeline.add(this.fadeOut());
        }

        return timeline;
    }

    fadeIn() {
        return gsap.to(this.shadow, {alpha: 1, duration: 0.1});
    }

    fadeOut() {
        return gsap.to(this.shadow, {alpha: 0, duration: 0.2});
    }

    playIdleAnimation() {
        return this.reels.playIdleAnimation();
    }

    skipWin(result) {
        const {beforeMatrix} = result;

        this.goToIdle();

        this.reels.replaceSymbols(beforeMatrix, true);
    }

    goToIdle() {
        gsap.killTweensOf(this.shadow);
        this.shadow.alpha = 0;
        this.totalWin.hide();
        this.paylines.stopAllPayLines();
        this.reels.goToIdle();
    }
}
