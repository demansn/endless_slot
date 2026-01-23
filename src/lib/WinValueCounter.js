import gsap from "gsap";
import {services} from "../ServiceLocator";

/**
 * @class WinValueCounter
 */
export class WinValueCounter {
    /**
     * @param {object} param
     * @param {number} param.value
     * @param {number} param.duration
     * @param {PIXI.Text | PIXI.Text[]} param.text
     * @param {function} param.format
     */
    constructor({value, duration, text, format = this.valueToText.bind(this), onEnd, onStart}) {
        this.value = value;
        this.duration = duration;
        this.text = text;
        this.timeline = new gsap.core.Timeline();
        this.format = format;
        this.onEnd = onEnd;
        this.onStart = onStart;
    }

    setWin(win) {
        this.timeline.clear();
        this.value = win;
        this.setTextValue(this.value);
    }

    addWin(win) {
        this.countTo( this.value + win );
    }

    countTo(to) {
        this.timeline.clear();

        return this.timeline.to(
            this, {
                value: to,
                duration: this.duration,
                onUpdate: (value) => {
                    this.setTextValue(this.value);
                },
                onComplete: () => {
                    if (this.onEnd) {
                        this.onEnd();
                    }
                },
                onStart: () => {
                    if (this.onStart) {
                        this.onStart();
                    }
                },
                ease: "linear.inOut"
            } );
    }

    setTextValue(value) {
        if (this.text instanceof Array) {
            this.text.forEach((text) => {
                text.text = this.format(value);
            });
        } else {
            this.text.text = this.format(value);
        }
    }

    valueToText(value) {
        const text = services.currencyFormatter.formatValue(value);

        return ` ${text} `;
    }

    stop(value) {
        this.timeline.kill();
        this.value = value;
        this.setTextValue(this.value);
    }
}
