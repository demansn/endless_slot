import {InlineBlock} from "./objects/InlineBlock";
import * as PIXI from "pixi.js";

export class TimeView extends InlineBlock {
    constructor() {
        super({gap: 16});

        this.addObject('clock', {}, {anchor: {y:0.5}});

        this._time = this.addObject('Text', {text: '0:00', style: 'TimeStyle'}, {resolution: 2, anchor: {y: 0.5}});

        PIXI.Ticker.shared.add(this.update.bind(this));
    }

    update() {
        const today = new Date();

        if (today.getHours() !== this._prevHours || today.getMinutes() !== this._prevMinutes) {
            this._prevHours = today.getHours();
            this._prevMinutes = today.getMinutes();

            this._time.text = today.getHours().toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false
                })
                + ":"
                + today.getMinutes().toLocaleString("en-US", {
                    minimumIntegerDigits: 2,
                    useGrouping: false
                });
        }
    }
}
