import gsap from "gsap";
import {Container, Graphics} from "pixi.js";
import {SuperContainer} from "../lib/objects/SuperContainer";

export class PayLineAnimation extends SuperContainer {
    constructor({payLine, symbolWidth, symbolHeight, reels, line}) {
        super();

        this.payLine = payLine;
        this.symbolWidth = symbolWidth;
        this.symbolHeight = symbolHeight;

        this.spineAnimations = [];

        const polygonPositions = [];

        for (let i = 0; i < payLine.length; i++) {
            const {row, column} = payLine[i];
            /**
             *
             * @type {Container}
             */
            const symbol = reels.getSymbolByPosition({row, column});
            // symbols global position to local
            const position = symbol.getBounds();
            const p = {x: position.x + symbol.width / 2, y: position.y + symbol.height / 2};
            const x = Math.floor(p.x);
            const y = Math.floor(p.y);

            polygonPositions.push({x, y, column, row});
        }

        // if (line === 17) {
        //     debugger;
        // }


        for (let i = 0; i < polygonPositions.length - 1; i++) {
            const {x: x1, y: y1} = polygonPositions[i];
            const {x: x2, y: y2} = polygonPositions[i + 1];


            const v2 = y1 - y2;
            const v1 = x1 - x2;
            const rotation = v2 && v1 ? Math.atan2(y1 - y2, x1 - x2) : 0;
            const spineConfig = rotation ? {spine: 'payLine', animation: 'Loop'} : {spine: 'payLine', animation: 'Loop'}
            const spine = this.addObject('SpineAnimation', spineConfig, {scale: 1});
            const size = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
            const isHorizontal = polygonPositions[i].row === polygonPositions[i + 1].row;

            if (!isHorizontal) {
                const scaleFactor = ((size - 40 )/ (spine.width) )+ 1;

                spine.scale.set(scaleFactor);
                spine.pivot.x = 108;
            } else {
                const scaleFactor = ( spine.width - 220) / size;
                spine.scale.set(scaleFactor);
                spine.pivot.x = spine.width * 0.25;
            }

            spine.x = x1;
            spine.y = y1;
            spine.rotation = Math.atan2(y1 - y2, x1 - x2);

            this.addChild(spine);
            this.spineAnimations.push(spine);
        }

        this.visible = false;
    }

    play() {
        this.visible = true;

        return this.playSpineAnimation();
    }
    //
    playSpineAnimation() {
        const timeline = gsap.timeline({});

        // timeline.add(() => {
        //     services.audio.playSfx('payline')
        // });

        this.spineAnimations.forEach(spineAnimation => {
            spineAnimation.alpha = 0;
            spineAnimation.play(true);
            timeline
                .add([
                    gsap.to(spineAnimation, {delay: 0.3, alpha: 1, duration: 0.1}),
                    spineAnimation.play(true),
                ], 0)
        });

        return timeline;
    }

    stop() {
        this.visible = false;
        this.stopSpineAnimation();
    }

    stopSpineAnimation() {
        this.spineAnimations.forEach(spineAnimation => {
            spineAnimation.stop();
        });
    }
}
