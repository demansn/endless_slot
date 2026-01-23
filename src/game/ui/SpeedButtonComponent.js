import {SuperContainer} from "../../lib/objects/SuperContainer";

export class SpeedButtonComponent extends SuperContainer {
    constructor() {
        super();

        this.addObject('Button', {template: 'sound_[SwitchState]_btn_[ButtonState]', onClick: this.onClickSpeed.bind(this)}, {x: 0, y: 0});
    }

    onClickSpeed() {
    }

    onClickSlow() {
    }
}
