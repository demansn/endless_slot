import {SuperContainer} from "../lib/objects/SuperContainer";

export class SelectSexualOrientationInfo extends SuperContainer {
    constructor() {
        super();

        this.addObject('Fill');
        this.block = this.addObject('VerticalBlock', {gap: 56, verticalAlign: 'middle', horizontalAlign: 'center'}, {x: 's50%', y: 's50%'});
        this.block .addObject('Text', {style: 'SelectSexualOrientationInfo', text: 'Please select your gender and the character you want to play with before you start.'.toUpperCase()}, {});
        this.block .addObject('Button', {template: 'ok_btn_[ButtonState]', onClick: () => this.emit('ok')}, {});
        this.block.pivot.set(this.block.width / 2, this.block.height / 2);
    }
}
