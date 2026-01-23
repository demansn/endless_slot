import {SuperContainer} from "../../lib/objects/SuperContainer";
import {CheckBox} from "@pixi/ui";
import services from "../../ServiceLocator";
import {SOUNDS} from "../../constants/sounds";

export class CheckBoxWithLabel extends SuperContainer {
    constructor({onChange, label, value}) {
        super();
        this.title = this.addObject( 'Text', { text: label, style: 'CheckBoxWithLabel' }, {
            interactive: true,
            buttonMode: true,
            anchor: {y: 0.5},
        });

        this.checkBox = new CheckBox({
            style: {
                unchecked: `switch_checkbox_off`,
                checked: `switch_checkbox_on`,
            },
            checked: value,
        });
        this.checkBox.y = -this.checkBox.height / 2;
        this.checkBox.x = this.title.width + 10;
        this.addChild(this.checkBox);

        this.checkBox.onChange.connect( () => {
            services.audio.playSfx(SOUNDS.ui.click);
            onChange( this.checkBox.checked );
        });

        this.checkBox.innerView.on('pointerover', () => services.audio.playSfx(SOUNDS.ui.hover));
        // this.checkBox.setChecked( value );
    }

    #toggle() {
        services.audio.playSfx(SOUNDS.ui.click);
        this.checkBox.toggle();
    }

    setChecked(value) {
        this.checkBox.setChecked(value);
    }
}
