import {SuperContainer} from "../lib/objects/SuperContainer";
import {SEXUAL_ORIENTATION} from "../constants";

export class InfoPlayer extends SuperContainer {
    constructor() {
        super();

        this.setSexualOrientation(SEXUAL_ORIENTATION.NORMAL);
    }

    setSexualOrientation(orientation) {
        const prefixes = {
            [SEXUAL_ORIENTATION.NORMAL]: 'getero',
            [SEXUAL_ORIENTATION.GUY]: 'gay',
            [SEXUAL_ORIENTATION.LESB]: 'lesb',
        }
        const prefix = prefixes[orientation];

        this.removeChildren();

       this.addObject(`${prefix}WildInfo`, {}, {x: -17, y: 0});
       this.addObject('featuresInfo', {}, {x: 0, y: 426});
       this.addObject(`${prefix}ScatterInfo`, {}, {x: 773, y: 25});
       this.addObject(`bonusGameInfo`, {}, {x: 728, y: 426});

        this.pivot.set(this.width / 2, 0);
    }
}


