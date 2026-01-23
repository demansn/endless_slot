import * as PIXI from "pixi.js";
import {services} from "../ServiceLocator";
import Utils from "../Utils";

export default class MyExButton extends PIXI.Sprite
{
	_resPath = null;

	_isPressed = false;
	_isOver = false;
	_isActive = false;

	_enabledFilterEvents = false;

	_text = null;

	get isActive() { return this._isActive; }
	get isEnabled() { return this.buttonMode; }


	constructor( resPathTemplate, text=undefined, textStyle=undefined, enableFilterEvents=false )
	{
		super();
		this._enabledFilterEvents = enableFilterEvents;

		let resPath = Utils.convertTemplateToResPath(resPathTemplate);
		this._resPath = resPath;

		this.buttonMode = true;
		this.interactive = true;
		this.eventMode = 'static';
		this.cursor = 'pointer';

		this.texture = services.resources.get( resPath.on);

		// Listen to events.
		if ( resPath.hover )
		{
			this.on( "pointerover", this.onPointer_Over, this );
		}
		if ( resPath.pressed || resPath.sfx && resPath.sfx.click )
		{
			this.on( "pointerdown", this.onPointer_Down, this );
			this.on( "pointerup", this.onPointer_Up, this );
			this.on( "pointerupoutside", this.onPointer_Up, this );
		}
		if ( resPath.hover || resPath.pressed )
		{
			this.on( "pointerout", this.onPointer_Out, this );
		}

		//extension
		if(text && textStyle)
		{
			this._text = new PIXI.Text( text, textStyle );
			this._text.resolution = 2;
			this._text.anchor.set( 0.55 );
			this.addChild( this._text );
			this._text.position.set(this.width/2, this.height/2);
		}
	}

	on(eventName, callback, thisPtr)
	{
		let hooked = null;
		if(this._enabledFilterEvents && eventName.startsWith("pointer"))
		{
			hooked = () =>
			{
				if(!this.isEnabled) return;
				if(!thisPtr) callback();
				else callback.bind(thisPtr)();
			};
		}

		if(hooked) super.on(eventName, hooked, thisPtr);
		else super.on(eventName, callback, thisPtr);
	}

	setTexturesByTemplate(resPathTemplate)
	{
		this.setTextures(Utils.convertTemplateToResPath(resPathTemplate));
	}

	setTitle(text)
	{
		this._text.text = text;
	}

	setEnabled( isEnabled )
	{
		this.buttonMode = isEnabled;

		this._isPressed = false;
		this._isOver = false;
		this._isActive = false;

		if ( this._resPath.off )
		{
			this.texture = services.resources.get( isEnabled ? this._resPath.on : this._resPath.off );
		}
		else
		{
			if ( !isEnabled )
			{
				this.texture = services.resources.get( this._resPath.on );
			}
			else
			{
				this.texture = services.resources.get( this._isOver ? this._resPath.hover : this._resPath.on );
			}
			this.alpha = isEnabled ? 1 : 0.5;
		}
	}

	reset()
	{
		this.texture = services.resources.get( this._resPath.on );
		this._isPressed = false;
		this._isOver = false;
		this._isActive = false;
	}

		onPointer_Over()
		{
			if(!this.buttonMode) return;

			if ( !this._isPressed )
			{
				if ( this._resPath.sfx && this._resPath.sfx.hover )
				{
					services.audio.playSfx( this._resPath.sfx.hover );
				}
				else
				{
					services.audio.playSfx( "4.0_ver_3" );
				}

				this.texture = services.resources.get( this._resPath.hover );
			}

			this._isOver = true;
		}

		onPointer_Out()
		{
			if(!this.buttonMode) return;

			if ( !this._isPressed )
			{
				this.texture = services.resources.get( this._isActive ? this._resPath.active : this._resPath.on );
			}

			this._isOver = false;
		}

		onPointer_Down()
		{
			if(!this.buttonMode) return;

			if ( this._resPath.sfx && this._resPath.sfx.click )
			{
				services.audio.playSfx( this._resPath.sfx.click );
			}
			else
			{
				services.audio.playSfx( "3.0_ver_2" );
			}

			if ( this._resPath.pressed )
			{
				this.texture = services.resources.get( this._isActive ? this._resPath.active : this._resPath.pressed );
			}

			this._isPressed = true;
		}

		onPointer_Up()
		{
			if(!this.buttonMode) return;

			this.texture = services.resources.get( this._isOver ? this._resPath.hover : ( this._isActive ? this._resPath.active : this._resPath.on ) );

			this._isPressed = false;
		}

	setEnabled( isEnabled )
	{
		this.buttonMode = isEnabled;

		if ( this._resPath.off )
		{
			this.texture = services.resources.get( isEnabled ? this._resPath.on : this._resPath.off );
		}
		else
		{
			if ( !isEnabled )
			{
				this.texture = services.resources.get( this._resPath.on );
			}
			else
			{
				this.texture = services.resources.get( this._isOver ? this._resPath.hover : this._resPath.on );
			}
			this.alpha = isEnabled ? 1 : 0.5;
		}
	}

	setActive( isActive )
	{
		this._isActive = isActive;

		if ( isActive )
		{
			this.texture = services.resources.get( this._resPath.active );
		}
		else
		{
			this.texture = services.resources.get( this._isOver ? this._resPath.hover : this._resPath.on );
		}
	}

	setTextures( resPath )
	{
		this._resPath = resPath;

		if ( !this.buttonMode && this._resPath.off )
		{
			this.texture = services.resources.get( this._resPath.off );
		}
		else
		{
			this.texture = services.resources.get( this._isOver ? this._resPath.hover : this._resPath.on );
		}
	}

}

/*export interface IButtonResPath
{
    on: string;
    pressed?: string;
    hover?: string;
    off?: string;
    active?: string;
}*/
