import {SuperContainer} from "../lib/objects/SuperContainer";
import {ProgressBar} from "@pixi/ui";

export class PreloaderLoadingBar extends SuperContainer {
    constructor({fillPaddings = {}} = {}) {
        super();

        this._bar =this.addObject(ProgressBar, {
            bg: 'loader_progress_bg',
            fill: 'loader_progress_fill',
            progress: 0,
            fillPaddings,
            anchor: 0.5,
        }, {
            x: '-50%',
            y: '-50%',
        });
    }

    setProgress(progress) {
        this._bar.progress = progress * 100;
    }
}
