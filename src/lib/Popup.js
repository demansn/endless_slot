import * as PIXI from "pixi.js";
import {services} from "../ServiceLocator";
import signals from "signals";
import MyButton from "./MyButton";
import gsap from "gsap";
import {SpineAnimation} from "../gameObjects/SpineAnimation";
import {SuperContainer} from "./objects/SuperContainer";

export default class Popup extends SuperContainer {
    _root = null;
    _window = null;
    _disabledBg = null;
    _closeBtn = null;
    _onClosed = null;

    constructor({autoClose = false} = {}) {
        super();
        this._autoClose = autoClose;
    }

    addChildToRoot(child) {
        this._root.addChild(child);
    }

    get onClosed() {
        return this._onClosed;
    }

    init(parametrs = {}) {
        if (parametrs.autoClose !== undefined) {
            this._autoClose = parametrs.autoClose;
        }

        this._onClosed = new signals.Signal();

        this._disabledBg = this.create.graphics();
        this._disabledBg.beginFill(0x000000, 0.6);
        this._disabledBg.drawRect(-services.app.fullscreenBgWidth, 0, services.app.width + services.app.fullscreenBgWidth * 2, services.app.height);
        this._disabledBg.endFill();
        this._disabledBg.interactive = true;

        this._root = this.create.container();

        this._closeBtn = new MyButton({on: "close_btn_default", hover: "close_btn_hover", pressed: "close_btn_pressed"});
        this._closeBtn.anchor.set(0.5);

        if (parametrs.closeButton !== undefined) {

        }

        // close by click on background
        //
        // this.interactive = true;
        // this.on('pointertap', () => {
        //     this._onClosed.dispatch();
        // });

        // close by click on close button
        this._closeBtn.on("pointertap", () => {
            this._onClosed.dispatch(this);
        });

        // close by keyboard button
        this._bfKeyDown = this._onDocument_KeyDown.bind(this);
        document.addEventListener("keydown", this._bfKeyDown);

        // close by timeout
        if (this._autoClose) {
            gsap.delayedCall(2, () => {
                this._onClosed.dispatch(this);
            }, [], this);
        }

        if (parametrs.spine) {
            this._animation =  this._root.create.object('SpineAnimation', {...parametrs, x: 's50%', y: 's50%'});

            if (parametrs.attachments) {
                for (let name in parametrs.attachments) {
                    let attachment = parametrs.attachments[name];

                    this[name] = this._root.create.object(attachment.type, attachment);

                    this._animation.addObjectToSlot(attachment.slot, this[name]);
                }
            }
        }
    }

    _onDocument_KeyDown(event) {
        if (event.code == "Space") {
            this._onClosed.dispatch();
        }
    }

    show(parametrs) {
        this.init(parametrs);
    }

    end() {
        this._onClosed.dispose();
        this._onClosed = null;

        document.removeEventListener("keydown", this._bfKeyDown);
        this._bfKeyDown = null;
    }

    closedPromise() {
        return new Promise((resolve) => {
            this._onClosed.addOnce(resolve);
        });
    }

    update(dt) {
    }
}
