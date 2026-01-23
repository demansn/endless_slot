import {services} from "../../ServiceLocator";
import gsap from "gsap";
import {SpineAnimation} from "../../gameObjects/SpineAnimation";
import {SuperContainer} from "../../lib/objects/SuperContainer";
import {SEXUAL_ORIENTATION} from "../../constants";

export class ReelSymbol extends SuperContainer {
    static ID = 0;

    /**
     *
     * @type {SpineAnimation | null}
     */
    spine = null;

    constructor(data, parenReel) {
        super();
        this.config = data;
        this.parentReels = parenReel;
        this.ID = ReelSymbol.ID++;
        this.id = data.id;
        this.name = data.name;

        if (data.win) {
            this.spineLayer = this.addObject('SuperContainer');

            if (data.spineOffset) {
                this.spineLayer.position.set(0, data.spineOffset.y);
            }

            this.createSpine(data.win);
        } else if (data.sprite) {
            this.spirte = this.addObject(`symbol_${data.id}`, {}, {...data.sprite});
            // scale to 130 height
            this.spirte.scale.set(140 / this.spirte.height);
        }
    }

    createSpine(data) {
        if (this.spine) {
            this.spine.destroy();
        }

        const skin = this.config.skinByType && this.config.skinByType[this.data.sexualOrientation] ? this.config.skinByType[this.data.sexualOrientation] : data.skin;

        this.spine = this.spineLayer.addObject('SpineAnimation', {...data, skin}, { ...(data.parameters || {}), skin});
        this.spine.goToStart();

        if (data.spine.position) {
            this.spine.position.set(data.spine.position.x, data.spine.position.y);
        }
    }

    playFrame() {
        this.spine.setAnimation('Frame');
        this.spine.setTimeScale(1);
        this.parentLayer = services.layers.symbolsAnimationLayer;

        return  this.spine.play(true);
    }

    playWinAnimation(repeat = 1) {
        this.spine.setAnimation('Victory+Frame');
        this.spine.setTimeScale(1 + (2 / 100 * this.data.animationSpeed));

        const tl = gsap.timeline();
        const duration = this.spine.getAnimationDuration() * repeat;

        tl.add(() => {
            this.parentLayer = services.layers.symbolsAnimationLayer;
            this.spine.play(false, undefined, undefined, repeat);
        });

        tl.add(gsap.to({}, {duration}))
        tl.add(() => {
            this.parentLayer = null;
        });

        return tl;
    }
    gotToIdle() {
        this.alpha = 1;

        this.parentLayer = null;
        gsap.killTweensOf(this);
        gsap.killTweensOf(this.spine);

        const scale = this.config.win.parameters && this.config.win.parameters.scale || 1;

        this.spine.scale.set(scale);
        this.scale.set(1);

        if (this.spine.isPlaying || true) {
            this.spine.stop();
            this.spine.setAnimation(this.config.win.animation);
            this.spine.goToStart();
        }
    }

    getTopBounds() {
        if (!this.sprite) {
            return this.y;
        }

        return this.y + this.parentReels.symbolHeight / 2 - (this.sprite.height * this.sprite.anchor.y);
    }

    destroy(_options) {
        this.gotToIdle();
    }

    playIdleAnimation(delay) {
        this.spine.setAnimation(this.config.idle.animation);

        const tl = gsap.timeline({paused: true});

        tl.to(this, {duration: delay});
        tl.add([
            this.spine.play()
        ])
        tl.eventCallback('onStart', () => {
            this.parentLayer = services.layers.symbolsAnimationLayer;
        });

        tl.eventCallback('onComplete', () => {
            this.parentLayer = null;
        });

        return tl;
    }
}
