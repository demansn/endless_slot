import {Container} from "pixi.js";
import {ObjectFactory} from "../service/ObjectFactory";
import {services} from "../ServiceLocator";
import {getFontStyle} from "../configs/fontStyles.config";

export class CascadeValue extends Container {
    constructor(cascades) {
        super();

        this.cascades = cascades;
        this.bg = ObjectFactory.createSprite('cascade_bg_disabled');
        this.addChild(this.bg);
    }

    isWin(cascades) {
        return this.cascades <= cascades;
    }

    open() {
        this.bg.texture = services.resources.get('cascade_bg_enabled');
    }

    hide() {
        this.bg.texture = services.resources.get('cascade_bg_disabled');
    }
}

export class CascadeSpriteValue extends CascadeValue {
    constructor(cascades) {
        super(cascades);

        this.sprite = ObjectFactory.createSprite(`cascade_${cascades}`);
        this.sprite.anchor.set(0.5);
        this.sprite.position.set(this.bg.width / 2, this.bg.height / 2);
        this.addChild(this.sprite);
    }
}

export class CascadeTextValue extends CascadeValue {
    constructor(cascades, freeSpins) {
        super(cascades);

        this.text = ObjectFactory.createText(freeSpins);
        this.text.anchor.set(0.5);
        this.text.position.set(this.bg.width / 2, 38);
        this.addChild(this.text);

        this.title = ObjectFactory.createText('FREESPINS');
        this.title.anchor.set(0.5);
        this.title.position.set(this.bg.width / 2, 66);
        this.addChild(this.title);

        this.setStyle('Close');
    }

    open() {
        super.open();
        this.setStyle('Open');
    }

    hide() {
        super.hide();
        this.setStyle('Close');
    }

    setStyle(name) {
        this.title.style = getFontStyle(`CascadeValueTitle${name}`);
        this.text.style = getFontStyle(`CascadeValue${name}`);
    }
}

export class CascadesCounter extends Container {
    constructor() {
        super();

        this.cascades = [];
        this.cascades.push(new CascadeSpriteValue(1));
        this.cascades.push(new CascadeSpriteValue(2));
        this.cascades.push(new CascadeSpriteValue(3));
        this.cascades.push(new CascadeTextValue(4, 10));
        this.cascades.push(new CascadeTextValue(5, 20));
        this.cascades.push(new CascadeTextValue(6, 30));
        this.cascades.push(new CascadeTextValue(7, 50));

        this.cascades.forEach((cascade, index) => {
            cascade.position.set(0, index * (cascade.height + 4));
            this.addChild(cascade);
        });
    }

    hide() {
        this.cascades.forEach(cascade => cascade.hide());
    }

    async show(cascades, force = false) {
        // await asyncDelay(100);

        this.cascades.forEach(cascade => {
            if (cascade.isWin(cascades)) {
                cascade.open(force);
            }
        });

        // await asyncDelay(250);
    }
}
