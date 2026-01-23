import {Graphics} from "pixi.js";
import * as PIXI from "pixi.js";
import {services} from "../../ServiceLocator";
import {getFontStyle} from "../../configs/fontStyles.config";
import {SuperContainer} from "../../lib/objects/SuperContainer";
import {FancyButton} from "@pixi/ui";
import {SOUNDS} from "../../constants/sounds";

export class ProgressButton extends SuperContainer {
    constructor({title, titleFormat = (value) => value}) {
        super();

        this.titleFormat = titleFormat;
        this.bg = this.addObject('progress_btn_default');
        this.bg.visible = false;

        this.button = this.addObject(FancyButton, {
            defaultView: 'progress_btn_default',
            hoverView: 'progress_btn_hover',
            pressedView: 'progress_btn_pressed',
            disabledView: 'progress_btn_disabled',
        });

        this.progressBar = this.addObject('progress_btn_fill');
        this.progressBar.x = this.bg.width * 0.445;
        this.progressBar.y = this.bg.height * 0.46;
        this.progressBar.anchor.set(0.5);

        this.progressBarMask = this.addChild(new Graphics());
        this.progressBarMask.x = this.progressBar.x;
        this.progressBarMask.y =  this.progressBar.y;
        this.progressBar.mask = this.progressBarMask;

        this.title = this.addObject("Text",{text: title, style: 'ProgressButtonTitleDefault'});
        this.title.x =  this.bg.width / 2;
        this.title.y =  this.bg.height * 0.4;
        this.title.anchor.set(0.5, 0.5);
        this.title.alpha = 0.78;

        this.setProgress(1);

        this.interactive = true;
        // this.interactiveChildren = true;
        this.buttonMode = true;
        this.isEnabled = true;
        this.eventMode = 'static';
        this.cursor = 'pointer';

        //
        this.title.eventMode = 'none';
        // this.title.buttonMode = true;
        // this.title.cursor = 'pointer';
        // this.title.on("pointerover", this.onPointerOver, this);
        // this.title.on("pointerdown", this.onPointerDown, this);
        // this.title.on("pointerup", this.onPointerUp, this);
        // this.title.on("pointerupoutside", this.onPointerUp, this);
        // this.title.on("pointerout", this.onPointerOut, this);

        this.on("pointerover", this.onPointerOver, this);
        this.on("pointerdown", this.onPointerDown, this);
        this.on("pointerup", this.onPointerUp, this);
        this.on("pointerupoutside", this.onPointerUp, this);
        this.on("pointerout", this.onPointerOut, this);
    }

    reset() {
        this.title.style = getFontStyle('ProgressButtonTitleDefault');
        this._isPressed = false;
        this._isOver = false;
        this._isActive = false;
    }

    onPointerOver() {
        if (!this._isPressed) {
            services.audio.playSfx(SOUNDS.ui.hover);
            this.title.style = getFontStyle('ProgressButtonTitleHover');
        }

        this._isOver = true;
    }

    onPointerOut() {
        if (!this._isPressed) {
            this.title.style = getFontStyle('ProgressButtonTitleDefault');
        }

        this._isOver = false;
    }

    onPointerDown() {
        this.title.style = getFontStyle('ProgressButtonTitlePressed');
        this._isPressed = true;
    }

    onPointerUp() {
        this.title.style = getFontStyle(this._isOver ? 'ProgressButtonTitleHover' : 'ProgressButtonTitleDefault');
        this._isPressed = false;

        if (this._isOver && this.isEnabled) {
            services.audio.playSfx(SOUNDS.ui.click);
            this.emit('clicked');
        }
    }

    setEnabled(isEnabled) {
        this.buttonMode = isEnabled;
        this.interactive = isEnabled;
        this.isEnabled = isEnabled;
        this.interactiveChildren = isEnabled;
        this.title.interactive = isEnabled;

        if (!isEnabled) {
            this.progressBar.visible = false;
            this.bg.texture = services.resources.get('progress_btn_disabled');
        } else {
            this.progressBar.visible = true;
            this.bg.texture = services.resources.get('progress_btn_default');
            this.title.style = getFontStyle('ProgressButtonTitleDefault')
        }
    }

    setTitle(title) {
        this.title.text = this.titleFormat(title);
    }

    setProgress(progress) {
        const kStartAngle = -Math.PI * 0.5;
        const kTo = 2 * Math.PI * progress;

        this.progressBarMask.clear();
        this.progressBarMask.lineStyle( { width: 7, cap: PIXI.LINE_CAP.ROUND, color: 0x000000} );
        this.progressBarMask.arc( 0, 0, 35, kStartAngle, kStartAngle + kTo );
    }
}
