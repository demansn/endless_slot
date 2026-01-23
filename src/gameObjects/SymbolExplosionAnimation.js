import {Container} from "pixi.js";
import {services} from "../ServiceLocator";
import gsap from "gsap";

export class SymbolExplosionAnimation extends Container {
    constructor() {
        super();

        this.spine = new Spine(services.resources.get("Effects").spineData);
        this.spine.scale.set(0.95);
        this.addChild(this.spine);

        this.duration = 0;

        const a = this.spine.spineData.findAnimation("Win_Elements/Emergence").duration;
        const b = this.spine.spineData.findAnimation("Win_Elements/Blast").duration;

        this.spine.stateData.setMix("Win_Elements/Emergence", "Win_Elements/Blast", 0.9);

        this.duration = 1;
    }

    play(onComplete = () => {}) {
        return gsap.timeline().to(this.spine, {
            duration: this.duration,
            onStart: () => {
                this.spine.state.clearListeners();
                this.spine.state.clearTracks();
                this.spine.state.setAnimation(0, "Win_Elements/Emergence", false);
                this.spine.state.addAnimation(0,  "Win_Elements/Blast", false);
            },
            onComplete
        });
    }
}
