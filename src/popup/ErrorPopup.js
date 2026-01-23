import {BasePopup} from "./BasePopup";

export class ErrorPopup extends BasePopup {
    create({custom_message, message}) {
        this.bg = this.addObject('OpsPopUp', {}, {x: 's50%', y: 's50%', anchor: 0.5});
        this.closeButton.position.set(1298, 303);
        this.closeButton.visible = false;

        this.addObject('Text', {text: custom_message || message, style: 'ErrorMessageTextStyle'}, {x: 's50%', y: 580, anchor: 0.5});
    }
}
