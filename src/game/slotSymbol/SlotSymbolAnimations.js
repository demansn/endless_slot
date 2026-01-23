import gsap from "gsap";

export class SlotSymbolAnimations {
    /**
     *
     * @param {ReelSymbol} slotSymbol
     */
    constructor(slotSymbol) {
    }

    getWinAnimation(options) {
        this.spine.setAnimation(this.data.win.animation);
        const duration = this.spine.getAnimationDuration();
        const tl = gsap.timeline();

        tl.add(() => this.frame.play(true))
        tl.to(this.frame, {alpha: 1, duration: 0.25})
        tl.to(this.frame, {alpha: 0, duration: 0.25}, `+=${duration - 0.5}`);

        return tl.to(this.spine, {
            duration,
            onStart: () => {
                this.parentLayer = services.layers.symbolsAnimationLayer;
                this.spine.play();
            },
            onComplete: () => {
                if (this.frame) {
                    this.frame.stop();
                }
                this.parentLayer = null;
            }
        }, 0);
    }
}
