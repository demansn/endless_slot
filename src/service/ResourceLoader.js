import * as PIXI from "pixi.js";
import {Service} from "./Service";
import {Assets} from "pixi.js";

export class ResourceLoader extends Service {
    async init() {
        this.resources = {};
        this.loader = Assets;
        this.manifest = this.options.manifest;

        await this.loader .init({ manifest:  this.manifest });
       await this.load('logo');
    }

    get(name) {
        return this.loader.get(name);
    }

    async load(bundleName, {
        onLoaded = () => {},
        onProgress = () => {}
    } = {}) {

        await this.loader.loadBundle(bundleName, onProgress);

        onLoaded();
    }
}
