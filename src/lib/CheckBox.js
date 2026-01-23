import * as PIXI from "pixi.js";
import signals from "signals";
import {services} from "../ServiceLocator";
import {SOUNDS} from "../constants/sounds";

export default class CheckBox extends PIXI.Container
{
    _button = null;

    _isChecked = null;

    _onChanged = null;
    _onHoverStarted = null;
    _onHoverEnded = null;


    get isChecked() { return this._isChecked; }

    get onChanged() { return this._onChanged; }
    get onHoverStarted() { return this._onHoverStarted; }
    get onHoverEnded() { return this._onHoverEnded; }


    constructor()
    {
        super();
    }

    init()
    {
        this._onChanged = new signals.Signal();
        this._onHoverStarted = new signals.Signal();
        this._onHoverEnded = new signals.Signal();

        this._button = new PIXI.Sprite( services.resources.checkbox_on );
        this._button.interactive = true;
        this._button.buttonMode = true;
        this._button.anchor.set( 0.5 );
        this.addChild( this._button );
        this._button.on( "pointertap", this._onButton_Click, this );
        this._button.on( "pointerover", this._onButton_PointerOver, this );
        this._button.on( "pointerout", this._onButton_PointerOut, this );
    }

        _onButton_Click()
        {
            services.audio.playSfx(SOUNDS.ui.click);

            this._isChecked = !this._isChecked;
            this._button.texture = services.resources.get( this._isChecked ? "options_checkbox_on_btn" : "options_checkbox_off_btn" );

            this._onChanged.dispatch( this._isChecked );
        }

        _onButton_PointerOver()
        {
            services.audio.playSfx(SOUNDS.ui.hover);

            this._onHoverStarted.dispatch();
        }

        _onButton_PointerOut()
        {
            this._onHoverEnded.dispatch();
        }

    end()
    {
        this._onChanged.dispose();
        this._onChanged = null;

        this._onHoverStarted.dispose();
        this._onHoverEnded.dispose();

        this.off( "pointertap", this._onButton_Click, this );
        this.off( "pointerover", this._onButton_PointerOver, this );
        this.off( "pointerout", this._onButton_PointerOut, this );
    }

    setChecked( isChecked )
    {
        this._isChecked = isChecked;

        this._button.texture = services.resources.get( isChecked ? "options_checkbox_on_btn" : "options_checkbox_off_btn" );
    }

    toggle()
    {
        this._onButton_Click();
    }
}
