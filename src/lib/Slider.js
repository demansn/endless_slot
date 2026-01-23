import * as PIXI from "pixi.js";
import {services} from "../ServiceLocator";
import {SuperContainer} from "./objects/SuperContainer";
import {SOUNDS} from "../constants/sounds";

export class Slider extends SuperContainer {
    _button = null;
    _bar = null;
    _barMask = null;
    _buttonDownX = null;

    constructor({bg, fill, slider, fillPaddings = {top: 0, left: 0}}) {
        super();

        this._base = this.addObject(bg);
        this._base.anchor.y = 0.5;

        this._bar = this.addObject(fill);
        this._bar.anchor.y = 0.5;
        this._bar.x = fillPaddings.left;
        this._bar.y = fillPaddings.top;

        this._barMask = new PIXI.Graphics();
        this._barMask.beginFill(0xffffff, 1);
        this._barMask.drawRect(this._bar.x, -this._bar.height * 0.5, this._bar.width, this._bar.height);
        this._barMask.endFill();
        this.addChild(this._barMask);
        this._barMask.isMask = true;
        this._bar.mask = this._barMask;

        this._button = this.addChild(slider);
        this._button.interactive = true;
        this._button.cursor = "pointer";
        this._button.buttonMode = true;

        // this._button.anchor.set(0.5);
        // this._button.scale.set(50 / this._button.height);
        // this.addChild(this._button);
        this._button.on("pointerdown", this._onButton_PointerDown, this);
        this._button.on("pointerover", this.onHover, this);
    }

    onHover() {
        services.audio.playSfx('Hover');
    }

    _base = null;

    get base() {
        return this._base;
    }

    _value = null;

    set value(value) {
        this._value = value;
        this.update();
    }

    get value() {
        return this._value;
    }

    _onChanged = null;

    get onChanged() {
        return this._onChanged;
    }

    _onButton_PointerDown(e) {
        services.audio.playSfx(SOUNDS.ui.click);

        this._button.once("pointerup", this._onButton_PointerUp, this);
        this._button.once("pointerupoutside", this._onButton_PointerUpOutside, this);
        this._button.on("pointermove", this._onButton_PointerMove, this);

        this._buttonDownX = this._bar.toLocal(e.global).x;
    }

    _onButton_PointerUp() {
        this._buttonDownX = null;

        this._button.off("pointermove");
    }

    _onButton_PointerUpOutside() {
        this._onButton_PointerUp();
    }

    _onButton_PointerMove(e) {
        const kLocal = this._bar.toLocal(e.global);
        this._button.x += (kLocal.x - this._buttonDownX);
        this._buttonDownX = kLocal.x;
        if (this._button.x < this._bar.x) {
            this._button.x = this._bar.x;
        } else if (this._button.x > this._bar.x + this._bar.width) {
            this._button.x = this._bar.x + this._bar.width;
        }

        this._value = Math.round((this._button.x - this._bar.x) / this._bar.width * 100);
        if (this._value < 0) {
            this._value = 0;
        } else if (this._value > 100) {
            this._value = 100;
        }

        this._barMask.scale.x = this._value / 100;

        this.emit('change', this._value);
    }

    update() {
        this._button.x = this._bar.x + this._bar.width * this._value / 100;
        this._barMask.scale.x = this._value / 100;
    }
}
