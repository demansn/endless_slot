import {SuperContainer} from "../lib/objects/SuperContainer";

export class DoubleText extends SuperContainer {
    constructor({text, backStyle, frontStyle}) {
        super();

        this.backText = this.addObject('Text', {text, style: backStyle});
        this.frontText = this.addObject('Text', {text, style: frontStyle});
    }

    set text(value) {
        this.frontText.text = value;
        this.backText.text = value;
    }
}
