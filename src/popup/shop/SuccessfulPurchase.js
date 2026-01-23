import {SuperContainer} from "../../lib/objects/SuperContainer";
import {Graphics} from "pixi.js";

export class SuccessfulPurchase extends SuperContainer {
    constructor({icon, onClose, onActivate}) {
        super();

        this.zIndex = 2;
        this.zOrder = 2;
        this.bg = new Graphics();
        this.bg.beginFill(0x000000, 0.8);
        this.bg.drawRect(0, 0, this.screenSize.width, this.screenSize.height);
        this.bg.endFill();
        this.addChild(this.bg);
        this.addObject('Button', {template: 'close_btn_[ButtonState]', onClick: onClose}, {y: 300, x: 1400, anchor: 0.5, scale: 0.5});

        this.content = this.addObject('VerticalBlock', {gap: 20, verticalAlign: 'middle', horizontalAlign: 'center'}, {x: 's50%', y: 's50%'});
        this.content.addObject(icon);
        this.content.addObject('Text', {text: 'CONGRATULATIONS ON YOUR PURCHASE!', style: 'SuccessfulPurchaseTitle'});
        this.content.addObject('Text', {text: 'NOW YOU CAN ACTIVATE THE FEATURE', style: 'SuccessfulPurchaseSubTitle'});
        this.content.addObject('ButtonWithTitle', {title: 'ACTIVATE', onClick: onActivate}, {offset: {x: '50%', y: '50%'}});

        this.content.x -= this.content.width / 2;
        this.content.y -= this.content.height / 2;
    }
}
