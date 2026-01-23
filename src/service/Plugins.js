import {Service} from "./Service";
import gsap from "gsap";
import {CSSPlugin} from "gsap/CSSPlugin";
import {PixiPlugin} from "gsap/PixiPlugin";
import * as PIXI from "pixi.js";

export class Plugins extends Service {
    init() {
        gsap.registerPlugin(CSSPlugin);
        gsap.registerPlugin(PixiPlugin);

        PixiPlugin.registerPIXI(PIXI)


        // SpineParser.registerLoaderPlugin();
    }
}
