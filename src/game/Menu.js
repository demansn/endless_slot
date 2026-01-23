import {SuperContainer} from "../lib/objects/SuperContainer";
import services from "../ServiceLocator";

export class Menu extends SuperContainer {
    constructor() {
        super();
        this.fill = this.addObject('Fill');
        this.bg = this.addObject('MenuBG', {}, {x: 's50%', y: 's50%', anchor: 0.5});
        this.buttons = this.addObject('InlineBlock', {gap: 8}, {x: 's50%', y: 's50%', sortChildren: true, zIndex: 10});
        this.buttons.addObject('SoundSwitch', {}, { zIndex: 10});
        this.buttons.addObject('OptionsButton', {}, {});
        this.buttons.addObject('InfoButton', {}, {zIndex: 10});
        this.buttons.addObject('HomeButton', {}, { zIndex: 10, visible: Boolean(services.config.homeLink)});
        this.buttons.x -= this.buttons.width / 2;
        this.buttons.y -=20;
        this.visible = false;

        this.fill.interactive = true;
        this.fill.on('pointerdown', () => this.hide());
    }

    toggle() {
        this.visible ? this.hide() : this.show();
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }
}
