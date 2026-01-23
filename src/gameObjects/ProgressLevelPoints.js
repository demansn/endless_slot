import {VerticalBlock} from "../lib/objects/VerticalBlock";
import {InlineBlock} from "../lib/objects/InlineBlock";

export class ProgressLevelPoints extends VerticalBlock {
    constructor({levels, currentLevel,}) {
        super({gap: 46, horizontalAlign: 'right', blockWidth: 170});

        this.levels = levels.reverse();

        const points = levels.map(({level, xp}, index) => {
            const type = currentLevel  === level ? ProgressLevelPoint.TYPE.NEXT : currentLevel > level ? ProgressLevelPoint.TYPE.PASSED : ProgressLevelPoint.TYPE.NOT_ACTIVE;
            return {type, xp, level};
        });

        points.forEach(point => {
            this.addObject(ProgressLevelPoint, point);
        })
    }

    update({current}) {
        const points = this.levels.map(({level, xp}, index) => {
            const type = current === level ? ProgressLevelPoint.TYPE.NEXT : current > level ? ProgressLevelPoint.TYPE.PASSED : ProgressLevelPoint.TYPE.NOT_ACTIVE;
            return {type, xp, level};
        });

        this.children.forEach((child, index) => {
            child.update(points[index]);
        });

        this.layout();
    }
}

export class ProgressLevelPoint extends InlineBlock {
    static TYPE = {
        PASSED: 'passed',
        NEXT: 'next',
        NOT_ACTIVE: 'notActive',
    };

    constructor(data) {
        super({gap: 8, horizontalAlign: 'right', verticalAlign: 'middle'});

        this.create(data);
    }

    update(data) {
        this.removeChildren();
        this.create(data);
    }

    create({type, xp, level}) {
        const isNotPassed = type !== ProgressLevelPoint.TYPE.PASSED;

        if (type === ProgressLevelPoint.TYPE.NOT_ACTIVE) {
            this.addObject('Text', {text: `${xp}\nXP`, style: 'ProgressLevelPointXP'});
        }

        this.icon = this.addObject('SuperContainer');
        this.iconBg =  this.icon.addObject(`ProgressLevelPoint_${type}`);

        if (isNotPassed) {
            this.icon.addObject('Text', {text: level, style: `ProgressLevelPointLevel`}, {anchor: 0.5, x: this.iconBg.width / 2, y: this.iconBg.height * 0.4});
        }

        this.alpha = 0.8;

        this.layout();
    }
}
