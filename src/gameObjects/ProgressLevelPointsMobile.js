import {VerticalBlock} from "../lib/objects/VerticalBlock";
import {Container} from "pixi.js";
import {SuperContainer} from "../lib/objects/SuperContainer";

export class ProgressLevelPointsMobile extends VerticalBlock {
    constructor({levels, currentLevel,}) {
        super({gap: 10, horizontalAlign: 'right', blockWidth: 170});

        this.levels = levels.reverse();

        const points = levels.map(({level, xp}, index) => {
            const type = currentLevel  === level ? ProgressLevelPointMobile.TYPE.NEXT : currentLevel > level ? ProgressLevelPointMobile.TYPE.PASSED : ProgressLevelPointMobile.TYPE.NOT_ACTIVE;
            return {type, xp, level};
        });

        points.forEach(point => {
            this.addObject(ProgressLevelPointMobile, point);
        })
    }

    update({current}) {
        const points = this.levels.map(({level, xp}, index) => {
            const type = current === level ? ProgressLevelPointMobile.TYPE.NEXT : current > level ? ProgressLevelPointMobile.TYPE.PASSED : ProgressLevelPointMobile.TYPE.NOT_ACTIVE;
            return {type, xp, level};
        });

        this.children.forEach((child, index) => {
            child.update(points[index]);
        });

        this.layout();
    }
}

export class ProgressLevelPointMobile extends SuperContainer {
    static TYPE = {
        PASSED: 'passed',
        NEXT: 'next',
        NOT_ACTIVE: 'notActive',
    };

    constructor(data) {
        super();

        this.create(data);
    }

    update(data) {
        this.removeChildren();
        this.create(data);
    }

    create({type, xp, level}) {
        const isNotPassed = type !== ProgressLevelPointMobile.TYPE.PASSED;

        this.icon = this.addObject('SuperContainer');
        this.iconBg =  this.icon.addObject(`ProgressLevelPoint_${type}`, {}, {scale: 1.2});

        if (isNotPassed) {
            this.icon.addObject('Text', {text: level, style: `ProgressLevelPointLevelMobile`}, {anchor: 0.5, x: this.iconBg.width / 2, y: this.iconBg.height * 0.4});
        }

        if (type === ProgressLevelPointMobile.TYPE.NOT_ACTIVE) {
            this.addObject('Text', {text: `${xp} XP`, style: 'ProgressLevelPointXPMobile'}, {anchor: {x: 0.5}, x: this.width / 2, y: -25});
        }

        this.alpha = 0.8;
    }
}
