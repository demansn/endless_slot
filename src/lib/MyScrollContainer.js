import * as PIXI from "pixi.js";
import {services} from "../ServiceLocator";


export default class MyScrollContainer {
	constructor(x, y, width, height, itemHeight) {
		this.po = new PIXI.Container();
		this.scrollContainer = new PIXI.Container();
		this.po.addChild(this.scrollContainer);
		this.items = [];
		this.x = x;
		this.y = y;

		this.scrollContainer.x = x;
		this.scrollContainer.y = y;
		this.height = height;
		this.itemHeight = itemHeight;

		this.scroll = new PIXI.Sprite(services.resources.bet("scroll"));
		this.scrollMask = new PIXI.Graphics().beginFill(0xffffff).drawRoundedRect(0,0, this.scroll.width, this.scroll.height, 11).endFill();
		this.scroll.mask = this.scrollMask;
		this.scroll.addChild(this.scrollMask);
		//this.scroll.anchor.set(1.0, 0.0);
		this.scroll.position.set(width-this.scroll.width, 0);

		this.po.addChild(this.scroll);

		this.scrollBg = new PIXI.Sprite(services.resources.get("scroll_bg"));
		this.scrollBg.anchor.set(1.0, 0.0);
		this.scrollBg.position.set(width, 0);
		this.po.addChild(this.scrollBg);

		this.mask = new PIXI.Graphics();
		this.mask
			.beginFill(0xFFFFFF)
			.drawRect(x, y, width, height)
			.endFill();

		this.po.addChild(this.mask);
		this.scrollContainer.mask = this.mask;

		this.mousedown = false;
		this.lastPos = null;
		this.lastDiff = null;

		this.po.interactive = true;
		this.po.mousemove = e => this.onmousemove(e);
		this.po.mousedown = e => this.onmousedown(e);
		this.po.mouseup = e => this.onmouseup(e);
		this.po.mouseupoutside = e => this.onmouseup(e);
		this.po.touchmove = e => this.onmousemove(e);
		this.po.touchstart = e => this.onmousedown(e);
		this.po.touchend = e => this.onmouseup(e);
		this.po.touchendoutside = e => this.onmouseup(e);

		this._wheelListener = (e) => this._onMouseWheel(e);
		document.addEventListener( "wheel", this._wheelListener);
	}

	end()
	{
		document.removeEventListener("wheel", this._wheelListener);
	}

	clamp(n, min, max) { return Math.min(Math.max(n, min), max); }

	onmousemove(e) {
		const { originalEvent } = e.data;
		var clientY = !originalEvent.touches ? originalEvent.clientY : originalEvent.touches[0].clientY;

		if (this.mousedown) {
			this.lastDiff = clientY - this.lastPos.y;
			this.lastPos.y = clientY;

			this.scrollContainer.y += this.lastDiff;
			this.scrollContainer.y = this.clamp(this.scrollContainer.y, Math.max(0, this.scrollContainer.height - this.height) * -1, 0);

			let progress = this.scrollContainer.y / (Math.max(0, this.scrollContainer.height - this.height) * -1);
			if(progress > 1) progress = 1;
			this.scroll.position.y = (this.scrollBg.height - this.scroll.height) * progress;
		}
	}

	onmousedown(e) {
		const { originalEvent } = e.data;
		const clientY = !originalEvent.touches ? originalEvent.clientY : originalEvent.touches[0].clientY;
		this.mousedown = true;

		this.lastPos = {
			y: clientY
		};
	}

	onmouseup() {
		if (this.lastDiff) {
			let goY = this.scrollContainer.y + this.lastDiff * 10;

			if (goY < -this.items.length * this.itemHeight + this.height + this.y) {
				goY = -this.items.length * this.itemHeight + this.height + this.y;
			}
			if (goY > this.y) {
				goY = this.y;
			}

			this.scrollContainer.y = goY;
		}

		this.mousedown = false;
		this.lastPos = null;
		this.lastDiff = null;
	}

	_onMouseWheel( event )
	{
		const kCursorPos = services.app.renderer.plugins.interaction.eventData.data.global;
		let hit = services.app.renderer.plugins.interaction.hitTest( kCursorPos );
		if ( hit == this.po )
		{
			let scrollIndex = event.deltaY > 0 ? 1 : -1;

			let lastDiff = -scrollIndex * 80;

			this.scrollContainer.y += lastDiff;
			this.scrollContainer.y = this.clamp(this.scrollContainer.y, Math.max(0, this.scrollContainer.height - this.height) * -1, 0);

			let progress = this.scrollContainer.y / (Math.max(0, this.scrollContainer.height - this.height) * -1);
			if(progress > 1) progress = 1;
			this.scroll.position.y = (this.scrollBg.height - this.scroll.height) * progress;
		}
	}

	// This should be called every tick. Use only for scrolling containers with lots of elements for performance.
	hideOffscreenElements() {
		const startIndex = Math.floor(-(this.scrollContainer.y - this.y) / this.itemHeight);
		const endIndex = Math.floor(startIndex + (this.height / this.itemHeight));
		for (let i = 0; i < this.items.length; i++) {
			const item = this.items[i];
			item.visible = false;
			if (i >= startIndex && i <= endIndex + 1) {
				item.visible = true;
			}
		}
	}

	addItem(item) {
		this.scrollContainer.addChild(item);
		this.items.push(item);
		item.y = (this.items.length - 1) * this.itemHeight;
	}
}
