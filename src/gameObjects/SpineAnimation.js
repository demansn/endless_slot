import gsap from "gsap";
import {SuperContainer} from "../lib/objects/SuperContainer";
import {Spine} from "@esotericsoftware/spine-pixi-v7";

export class SpineAnimation extends SuperContainer {
    #spine;
    #animation;
    #attachments;
    isPlaying = false;

    constructor({spine, animation, skin, attachments, autoPlay = false, loop = false, slotObjects}) {
        super();

        this.name = spine;
        this.#animation = animation;
        this.#attachments = attachments;

        /**
         * @type {Spine}
         */
        this.#spine = Spine.from({
            skeleton: `${spine}Data`,
            atlas: `${spine}Atlas`,
            autoUpdate: true,
            debug: true
        });

        if (skin) {
            this.#spine.skeleton.setSkinByName(skin);
            this.#spine.skeleton.setSlotsToSetupPose();
        }

        this.addChild(this.#spine);
        this.goToStart();

        if (slotObjects) {
            for (let slot in slotObjects) {
                const object = slotObjects[slot];

                if (typeof object === 'string') {
                    this.#spine.addSlotObject(slot, this.addObject(object));
                } else {
                    this.#spine.addSlotObject(slot, object);
                }
            }
        }

        if (autoPlay) {
            this.play(loop);
        }
    }


    get spineObject() {
        return this.#spine;
    }

    #update(dl) {
        this.#spine.update(dl / 100);
    }

    goToProgress(progress) {
        const track = this.#spine.state.getCurrent(0);

        if (track) {
            track.trackTime = track.trackEnd / 100 *  progress;
            this.#spine.state.apply(this.#spine.skeleton);
        }
    }

    setTimeScale(scale) {
        this.#spine.state.timeScale = scale;
    }

    setAnimation(animation) {
        this.#animation = animation;
    }

    playWithOptions(options) {

    }

    /**
     * @param loop
     * @param onStart
     * @param onComplete
     * @param repeat
     * @returns {gsap.core.Timeline}
     */
    play(loop, onStart = () => {}, onComplete = () => {}, repeat = 1) {
        if (this.playTimeLine) {
            this.playTimeLine.kill();
            this.playTimeLine = null;
        }
        this.playTimeLine = gsap.timeline();

        const duration = repeat > 1 && !loop ? this.getAnimationDuration() * repeat : this.getAnimationDuration();

        // this.#spine.skeleton.setToSetupPose();

        this.playTimeLine.to(this.#spine, {
            duration: duration,
            onStart: () => {
                this.#spine.state.clearTracks();
                if (repeat > 1 && !loop) {
                    this.#spine.state.setAnimation(0, this.#animation, false);

                    repeat -=1;

                    for (let i = 0; i < repeat; i++) {
                        this.#spine.state.addAnimation(0, this.#animation, false);
                    }
                } else {
                    this.#spine.state.setAnimation(0, this.#animation, loop);
                }

                // this.#spine.skeleton.setToSetupPose();
                this.isPlaying = true;
                onStart && onStart();
            },
            onComplete: () => {
                this.isPlaying = false;
                onComplete  && onComplete();
            }
        });

        return this.playTimeLine;
    }

    gotToEnd() {
        this.#spine.state.setAnimation(0, this.#animation, false);
        this.#spine.state.update(1000000);
    }

    goToStart() {
        this.#spine.state.setAnimation(0, this.#animation, false);
        this.#spine.state.update(1000000);
    }

    stop() {
        gsap.killTweensOf(this.#spine);
        this.#spine.state.clearTracks();

        if (this.playTimeLine) {
            this.playTimeLine.kill();
            this.playTimeLine = null;
        }
        this.isPlaying = false;
    }

    getAnimationDuration() {
        return this.#spine.skeleton.data.findAnimation(this.#animation).duration / this.#spine.state.timeScale;
    }

    getAnimation() {
        return this.#animation;
    }

    destroy(_options) {
        super.destroy(_options);

        this.stop();
        gsap.killTweensOf(this);
        gsap.killTweensOf(this.#spine);
        this.#spine.destroy();
    }
}
