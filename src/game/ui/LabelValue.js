import {SuperContainer} from "../../lib/objects/SuperContainer";

export class LabelValue extends SuperContainer {
    constructor({title, value, maxWidth = 200}) {
        super();

        this.name = title;

        this.bg = this.addObject(SuperContainer)
        this.content = this.addObject("VerticalBlock", {gap: 22, verticalAlign: "middle"}, {y: -4});
        this.title = this.content.addObject('Text', {text: title, style: 'LabelValueTitle'}, {anchor: {x: 0.5}});
        this.valueText = this.content.addObject('Text', {text: value, style: 'LabelValue'}, {anchor: {x: 0.5}});
        this.content.layout();

        this._value = value;
        this.resize();
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = v;
        this.valueText.text = v
        this.resize();
    }

    resize() {
        const maxWidth = 300;

        if (this.valueText.width > maxWidth) {
            this.valueText.scale.set(maxWidth / this.valueText.width);
        }

        this.content.layout();
    }
}
