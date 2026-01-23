import {SuperContainer} from "../lib/objects/SuperContainer";

export class PreloaderBackground extends SuperContainer {
    constructor() {
        super();

        this.addObject('prealoder_bg', {}, {
            anchor: 0.5,
            x: 's50%',
            y: 's50%'
        })
    }
}
