import {SuperContainer} from "../lib/objects/SuperContainer";

export class Multiplier extends SuperContainer {
    constructor() {
        super();

        this.bg = this.addObject('MultiplierBG', {}, {anchor: 0.5});
        this.addChild(this.bg);

        this.value = this.addObject('Text', {text: 'x3', style: 'LabelValue'});
        this.value.resolution = 2;
        this.value.anchor.set(0.5);
    }

    setValue(val) {
        this.value.text = val !== undefined ? `x${val}` : '';
    }
}
