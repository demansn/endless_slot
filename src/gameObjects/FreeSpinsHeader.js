import {SuperContainer} from "../lib/objects/SuperContainer";

export class FreeSpinsHeader extends SuperContainer {
    constructor() {
        super();

        this.bg = this.addObject('freeSpinsHeader');
        this.content = this.addObject('InlineBlock', {gap: 4, horizontalAlign: "center", verticalAlign: "middle", lineWidth: this.bg.width, lineHeight: this.bg.height});

        this._text = this.content.addObject('Text', {text: 'Freespins: ', style: 'FreeSpinsHeaderTitle'});
        this._count = this.content.addObject('Text', {text: '0: ', style: 'FreeSpinsHeaderCount'});
    }

    show() {
        this.visible = true;
    }

    hide() {
        this.visible = false;
    }

    setCount(count) {
        this._count.text = count;
        this.content.layout();
    }
}
