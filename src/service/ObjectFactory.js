import {Sprite, Text} from "pixi.js";
import {services} from "../ServiceLocator";
import {getFontStyle} from "../configs/fontStyles.config";

export class ObjectFactory {
    constructor() {
        this.objects = {};
    }

    registerObjectFactory(objectName, objectClass) {
        this.objects[objectName] = objectClass;
    }

    create(objectName, ...args) {
        return this.objects[objectName](...args);
    }

    static createText(value, style = {}) {
        const text =  new Text(value, typeof style === 'string' ? getFontStyle(style) : style);

        text.resolution = 2;

        return text;
    }

    static createSprite(textureName) {
        return new Sprite(getResourceByName(textureName).texture);
    }

    static createSpine(spineName) {
        return new Spine(getResourceByName(spineName).spineData);
    }
}

function getResourceByName(name) {
    return services.resources.get(name);
}
