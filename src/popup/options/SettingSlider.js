import {SuperContainer} from "../../lib/objects/SuperContainer";
import {Slider} from "../../lib/Slider";
import {Rectangle} from "pixi.js";
import {SOUNDS} from "../../constants/sounds";
import services from "../../ServiceLocator";

export class SettingSlider extends SuperContainer {
    constructor({title, value, onChanged}) {
        super();

        this.onChangedCallback = onChanged;

        this.title = this.addObject('Text', {text: title, style: 'SettingSliderTitle'}, {anchor: {y: 0.5}})
        this.addChild(this.title);

        this.bg = this.addObject('loader_progress_bg' , {}, {x: 350, anchor: {y: 0.5}});
        this.slider = new Slider({
            bg: 'ProgressBG',
            fill: 'loader_progress_fill',
            slider: new SliderPoint(),
            progress: value
        });

        this.slider.x =  this.bg.x + 20;
        this.slider.y = this.bg.height / 2 -( this.slider.height - 5);
        this.addChild( this.slider );

        this.value = this.addObject('Text', {text: `${value}%`, style: 'SettingSliderValue'});
        this.value.anchor.set(0.5);
        this.value.x = this.bg.x + this.bg.width + 80;

        this.setValue(value);
        this.slider.on('change', this.onChanged.bind(this));
    }

    setValue(value) {
        this.slider.value = value;
        this.setValueText(value);
    }

    setValueText(value) {
        this.value.text = `${value}%`;
    }

    onChanged(value) {
        this.setValueText(value);
        this.onChangedCallback(value);
    }
}

// export class Slider extends SuperContainer {
//
// }

class SliderPoint extends SuperContainer {
    constructor() {
        super();
        this.bg = this.addObject('SliderButton', {}, {x: 0, anchor: 0.5});
        this.hitArea = new Rectangle(-50, -50, 100, 100);
        this.on('ponterdown', () => services.audio.playSfx(SOUNDS.ui.click));
        this.on('pointerover', () => services.audio.playSfx(SOUNDS.ui.hover));

    }
}
