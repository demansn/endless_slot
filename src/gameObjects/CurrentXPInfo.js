import {SuperContainer} from "../lib/objects/SuperContainer";
import {gsap} from "gsap";

export class CurrentXPInfo extends SuperContainer {
    constructor({value = 0}) {
        super();

        this.bg = this.addObject('CurrentXPBG', {}, {x: 0, y: 0});
        this.addObject('Text', {text: 'XP', style: 'CurrentXPTitle'}, {anchor: {x: 0.5}, x: this.bg.width / 2, y: this.bg.height * 0.2});
        this.valueText = this.addObject('Text', {text: value, style: 'CurrentXPValue'}, {anchor: 0.5, x: this.bg.width / 2, y: this.bg.height * 0.55});
        this.value = value;
    }

    set(value) {
        this.valueText.text = value;
        this.value = value;
    }

    animTo(value, duration = 0.5) {
        return gsap.to(this, {value, duration, onUpdate: (v) => {
                this.valueText.text = Math.floor(this.value);
            }, onComplete: () =>{
                this.valueText.text = value;
                this.value = value;
            }});
    }
}
