import {SuperContainer} from "../../lib/objects/SuperContainer";

export class ShopItemButtonUnchecked extends SuperContainer {
    constructor(text) {
        super();

        this.bg = this.addObject('buttonWithTextDisabled');
        this.text = this.addObject('Text', {text, style: 'ButtonWithTitleDisabled'}, {x: (this.bg.width / 2) - 6, y: (this.bg.height / 2) - 6, anchor: 0.5});
    }

    setText(text) {
        this.text.text = text;
    }
}
