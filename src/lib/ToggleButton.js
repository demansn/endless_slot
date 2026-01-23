import * as PIXI from "pixi.js";
import {services} from "../ServiceLocator";
import MyButton from "./MyButton";
import MyExButton from "./MyExButton";
import Utils from "../Utils";


export default class ToggleButton extends MyExButton
{
	_resPath2 = null;
	_toggle = false;

	get isToggle() { return this._toggle; }

	constructor( resPathTemplate, resPathTemplate2)
	{
		super(resPathTemplate);

		let resPath = this._resPath;
		let resPath2 = Utils.convertTemplateToResPath(resPathTemplate2);

		this._resPath2 = resPath2;
		this._toggle = false;
	}

	setToggle(toggle)
	{
		if(this._toggle != toggle)
		{
			let exchange = this._resPath;
			this.setTextures(this._resPath2);
			this._resPath2 = exchange;
			this._toggle = toggle;
		}
	}

	setProgress( progress )
	{
		if ( progress == 0 )
		{
			this.setToggle(false);
		}
		else if ( progress == 1)
		{
			this.setToggle(true);
		}
	}
}
