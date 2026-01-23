import {SuperContainer} from "../lib/objects/SuperContainer";
import {Graphics} from "pixi.js";

export class BasePopup extends SuperContainer {
    /**
     *
     * @type {Graphics}
     */
    fade = null;

    constructor(parameters) {
        super();

        this.parameters = parameters;
        this.sortableChildren = true;
        this.fade =  this.addObject('Fill');
        this.isShown = false;
        this.onClosed = parameters.onClosed;
        this.closeButton = this.addObject('Button', {template: 'close_btn_[ButtonState]', onClick: () => this.close()}, {y: 144, x: 1630, anchor: 0.5, zIndex: 1, zOrder: 1});

        this.create(parameters);
    }

    /**
     * @abstract
     * @param parameters
     */
    create(parameters) {
    }

    show(options) {
        this.isShown = true;
    }

    async close() {
        if (this.isShown) {
            await this.hide();
            this.onClosed && this.onClosed();
            this.emit('closed');
        }
    }

    async hide() {
    }
}
