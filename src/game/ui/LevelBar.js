import {SuperContainer} from "../../lib/objects/SuperContainer";
import {gsap} from "gsap";
import {ProgressLevelPoints} from "../../gameObjects/ProgressLevelPoints";
import services from "../../ServiceLocator";
import {ProgressLevelPointsMobile} from "../../gameObjects/ProgressLevelPointsMobile";

export class LevelBar extends SuperContainer {
    constructor({levels = [], level = {current: 1, progress: 0, xp: 0}}) {
        super();

        this.progressBar = this.addObject(LevelProgressBar, {progress: level.progress}, {x: 0, y: 0});
        this.progressLevelPoints = this.addObject(services.app.isMobileDevice ? ProgressLevelPointsMobile : ProgressLevelPoints, {levels, currentLevel: level.current}, {x: -160, y: 78});
    }

    setLevel({current, progress, xp}) {
        this.progressBar.setProgress(progress);
        this.progressLevelPoints.update({currentLevel: current});
    }

    animateTo({current, progress, xp}) {
        const tl = gsap.timeline();

        tl.add(this.progressBar.animateTo(progress));
        tl.add(() => this.progressLevelPoints.update({current}));

        return tl;
    }
}

export class LevelProgressBar extends SuperContainer {
    constructor({progress = 0}) {
        super();

        this.container = this.addObject('SuperContainer', {}, {x: 18, y: 53,angle: -90});
        this.container.addObject('ProgressBarBG');
        this.lvl = this.container.addObject('SpineAnimation', {spine: 'lvl', animation: 'loop', autoPlay: true, loop: true}, {x: 26, y: 45, pivot: {y: 180}, angle: 90});
        this.lvl.scale.y = 0.025;
        // this.addObject('progressBarPoints', {}, {x: 9, y: 53});
        this.container.addObject('ProgressBarFrame', {}, {x: -13, y: -20});
        this.container.y = this.container.width;

        this.progress = progress;
    }

    set progress(progress) {
        this.lvl.scale.y =(2.10 / 100 *  progress) + 0.025;
        this._progress = progress;
    }

    get progress() {
        return this._progress;
    }

    setProgress(progress) {
        this.progress = progress;
    }

    animateTo(progress) {
        return gsap.to(this, {progress, duration: 0.5});
    }
}
