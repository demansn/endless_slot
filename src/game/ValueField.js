import {SuperContainer} from "../lib/objects/SuperContainer";
import gsap from "gsap";
import {roundEase} from "../animations/roundEase";

export class ValueField extends SuperContainer {
    constructor({value = 0, title = 'Value', format = (v) => v, valueStyle = 'ValueField', titleStyle = 'ValueFieldTitle', winFrame = false}) {
        super();

        this.format = format;
        this.bg = this.addObject('FieldBG', {}, {x: 0, y: 0});
        this.frame = this.addObject('WinFrame', {}, {name: 'ValueFieldWinFrame', x: 52, y: 44, visible: winFrame});

        this.valueText = this.addObject('Text', {text: value, style: valueStyle}, {anchor: 0.5, x: this.bg.width / 2, y: 92});

        this.addObject('Text', {text: title, style: titleStyle}, {anchor: 0.5, x: this.bg.width / 2, y: 32});
        this._timeline = gsap.timeline();
        this.value = value;
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = v;
        this.valueText.text = this.format(v);
    }

    set(value) {
        this._timeline.clear();

        this.value = value;

    }

    animTo(to) {
        if ( this.value === to ) { return; }
        this._timeline.clear();

        this._timeline.to(
            this,
            {
                duration: 1,
                value: to,
                ease: roundEase(to)
            });

        this.value = to;
    }

    add(add, noAnimation) {
        if ( noAnimation ) {
            this.set( this.value + add );
            return;
        }

        this.animTo( this.value + add );
    }
}
