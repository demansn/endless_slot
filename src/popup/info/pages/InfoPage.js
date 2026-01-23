import {Container} from "pixi.js";
import * as PIXI from "pixi.js";
import {services} from "../../../ServiceLocator";
import {Scroll} from "../../../lib/Scroll";
import {SuperContainer} from "../../../lib/objects/SuperContainer";

export class InfoPage extends SuperContainer {
    constructor({name, config}, content = null, width = 1600, height = 900) {
        super();
        this.name = name;
        this.pageWidth = width;
        this.pageHeight = height;
        // this.contentMask = new PIXI.Graphics();
        // this.contentMask.beginFill(0x000000);
        // this.contentMask.drawRect(0, 0, width, height);
        // this.contentMask.endFill();
        // this.addChild(this.contentMask);

        this.contentContainer = new Container();
        // this.contentContainer.mask = this.contentMask;
        this.addChild(this.contentContainer);

        this.scroll = null;

        if (content) {
            this.addContent(content);
        } else {
            this.addContent(this.createContent(config));
        }

        this.visible = false;
    }

    createContent(config) {
        const content = new SuperContainer();
        if (config) {
            content.addObject(config.name, {}, config);
        }

        return content;
    }

    addContent(content) {
        if (this.content) {
            this.contentContainer.removeChild(this.content);
        }
        this.content = content;
        this.contentContainer.addChild(this.content);

        // if (this.content.height > this.pageHeight + 20) {
        //     this.scroll = new Scroll(this.contentContainer, this.pageHeight, 10);
        //     this.addChild(this.scroll);
        //     this.scroll.position.set(width + 10, 0);
        // }
    }
}
