import {SuperContainer} from "../lib/objects/SuperContainer";
import {Graphics} from "pixi.js";
import services from "../ServiceLocator";

export class Fill extends SuperContainer {
    constructor({color = 0x000000, alpha = 0.8} = {}) {
        super();

        const dx = services.app.renderer.width - this.screenSize.width;
        const dy = services.app.renderer.height - this.screenSize.height;

        this.graphics = this.addChild(new Graphics());
        this.graphics.beginFill(color, alpha);
        this.graphics.drawRect(-dx / 2, -dy / 2, services.app.renderer.width, services.app.renderer.height);
        this.graphics.endFill();
    }
}
