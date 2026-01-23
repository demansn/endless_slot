import {SuperContainer} from "../../lib/objects/SuperContainer";

export class FreeSpinsCounter extends SuperContainer {
    constructor({value = 0} = {}) {
        super();

        this.bg = this.addObject('ButtonWithTitle_btn_default', {}, {scale: 0.8});
        this.title = this.addObject('Text', {text: 'FREESPINS', style: 'FreeSpinsCounterTitle'}, {x: this.bg.width / 2, y: 25, anchor: 0.5});
        this.label = this.addObject('Text', {text: value, style: 'FreeSpinsCounter'}, {x: this.bg.width / 2, y: this.bg.height * 0.48, anchor: 0.5});
    }

    set value(value) {
        this.label.text = value;
    }

    get value () {
        return this.label.text;
    }
}
