import {SuperContainer} from "../../lib/objects/SuperContainer";
import {CircularProgressBar} from "@pixi/ui";

export class BonusIcon extends SuperContainer {
    constructor({icon, progress = 0, isActive = true, title}) {
        super();

        this.icon = this.addObject(icon, {}, {x: 0, y: 0});
        this.progressBar = this.addChild(new CircularProgressBar({
            lineWidth: 8,
            fillColor:  '#FFB238',
            radius: 64,
            value: progress,
            fillAlpha: 1,
            cap: 'round'
        }));
        this.badge = this.addObject('CurrentXPBG', {}, {x: 0, y: 0, scale: 0.5});
        this.badgeText = this.addObject('Text', {text: 'X5', style: 'BonusIconBadge'}, {x: this.badge.x + this.badge.width / 2, y: this.badge.y + this.badge.height / 2, anchor: {x: 0.5, y: 0.5}});
        this.title = this.addObject('Text', {text: title, style: 'BonusIconTitle'}, {x: this.icon.width / 2, y: this.icon.height * 0.7, anchor: {x: 0.5, y: 0.5}});

        this.progressBar.x = this.icon.width / 2;
        this.progressBar.y = this.icon.height / 2 - 8;
    }

    setProgress(progress) {
        this.progressBar.progress = progress;
    }
}
