import {SuperContainer} from "../../lib/objects/SuperContainer";
import services from "../../ServiceLocator";
import {SOUNDS} from "../../constants/sounds";

export class ShopTab extends SuperContainer {
    constructor({title, isActive}) {
        super();

        this.bg = this.addObject('ShopTitleBG', {});
        this.addObject('Text', {text: title, style: 'ShopTitle'}, {x: this.bg.width / 2, y: this.bg.height / 2, anchor: 0.5});

        this.setActive(isActive);
        this.interactive = true;
        this.buttonMode = true;
        this.cursor = 'pointer';
        this.on('pointerdown', () => {
            services.audio.playSfx(SOUNDS.ui.click);
            this.emit('clicked')
        });

        this.on('pointerover', () => {
            services.audio.playSfx(SOUNDS.ui.hover);
        });

    }

    setActive(isActive) {
        this.alpha = isActive ? 1 : 0.25;
    }
}
