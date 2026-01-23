import {SuperContainer} from "../../lib/objects/SuperContainer";
import {getFontStyle} from "../../configs/fontStyles.config";
import services from "../../ServiceLocator";
import {SOUNDS} from "../../constants/sounds";

export class SelectBet extends SuperContainer {
    constructor({value, onSelect, index}) {
        super();

        this.value = value;
        this.index = index;
        this.onSelectedCallback = onSelect;

        this.bg = this.addObject('ButtonWithTitle_btn_disabled', {}, {scale: 0.9});
        this.valueText = this.addObject('Text', {text: value.toString(), style: 'ButtonWithTitle_btn_disabled'}, {anchor: 0.5, position: {x: this.bg.width / 2, y: this.bg.height / 2 - 5}, alpha: 0.5});

        this.buttonMode = true;
        this.interactive = true;
        this.isSelected = false;
        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.on('pointertap', this.onSelect, this);
        this.on('pointerover', this.onHover, this);
        this.on('pointerout', this.onOut, this);

    }

    onHover() {
        services.audio.playSfx(SOUNDS.ui.hover);
    }

    onSelect() {
        this.select();
        services.audio.playSfx(SOUNDS.ui.click);
        this.onSelectedCallback(this.value, this.index);
    }

    onHover() {
        this.bg.texture = services.resources.get('ButtonWithTitle_btn_hover');
        this.valueText.style = getFontStyle('ButtonWithTitle_btn_hover');
        this.valueText.alpha = 1;
    }

    onOut() {
        if (!this.isSelected) {
            this.bg.texture = services.resources.get('ButtonWithTitle_btn_disabled');
            this.valueText.style = getFontStyle('ButtonWithTitle_btn_disabled');
            this.valueText.alpha = 0.5;
        } else {
            this.bg.texture = services.resources.get('ButtonWithTitle_btn_default');
            this.valueText.style = getFontStyle('ButtonWithTitle_btn_default');
            this.valueText.alpha = 1;
        }
    }

    unselect() {
        this.bg.texture = services.resources.get('ButtonWithTitle_btn_disabled');
        this.valueText.style = getFontStyle('ButtonWithTitle_btn_disabled');
        this.valueText.alpha = 0.5;
        this.isSelected = false;
    }

    select() {
        this.bg.texture = services.resources.get('ButtonWithTitle_btn_default');
        this.valueText.style = getFontStyle('ButtonWithTitle_btn_default');
        this.valueText.alpha = 1;
        this.isSelected = true;
    }

    setActive(isActive) {
        if (isActive) {
            this.select();
        } else {
            this.unselect();
        }
    }
}
