import {gsap} from "gsap";
import {SuperContainer} from "../../lib/objects/SuperContainer";
import {BLEND_MODES} from "pixi.js";
import SpinButton from "../SpinButton";
import services from "../../ServiceLocator";
import {SOUNDS} from "../../constants/sounds";

export class RouletteScene extends SuperContainer {
    constructor() {
        super();

        this.wheelContainer = new SuperContainer();

        this.bg = this.addObject('SpineAnimation', {spine: 'Background', animation: 'Background6', autoPlay: false, loop: true,
            slotObjects: {
                BG_6:  this.wheelContainer
        }}, {x: 's50%', y: 's50%'});

        this.wheel = this.wheelContainer.addObject(RouletteWheel, {}, {});
        this.wheel.x -= 443;
        this.wheel.y -= 398;

        this.addObject('naughtyCharacterLogo', {}, {x: 754, y: -64});
        this.spinButton = this.addObject(SpinButton, {}, {x: 792, y: 806, scale: 1.5});
        this.spinButton.on('clicked', () => {
            this.emit('spin');
            // this.fakeSpin();
        });
        this.currentSpin = 0;
    }

    show() {
        this.visible = true;
        this.alpha = 0;
        this.spinButton.setEnabled(true);
        this.bg.play(true);
        return gsap.to(this, {alpha: 1, duration: 0.25});
    }

    disabledSpinButton() {
        this.spinButton.setEnabled(false);
    }

    spin(multiplier) {
        return this.wheel.spin(multiplier);
    }

    hide() {

        return gsap.to(this, {alpha: 0, duration: 0.25, onComplete: () => {
            this.visible = false;
                this.bg.stop();
            this.wheel.reset();
        }});
    }

    fakeSpin() {
        const multipliers = [1, 100, 5, 0, 50, 2, 10];
        const randomIndex = Math.floor(Math.random() * multipliers.length);
        const randomMultiplier = multipliers[randomIndex];
        const tl = gsap.timeline();

        tl.add(this.spin(randomMultiplier))
            .add(() => this.wheel.reset());
    }
}

export class RouletteWheel extends SuperContainer {

    multipliers = [1, 100, 5, 0, '', 50, 2, 10];
    constructor() {
        super();

        this.bg = this.addObject('roulleteWheel');
        this.sectorsContainer = this.addObject('SuperContainer', {}, {x: this.bg.width  / 2, y: this.bg.height / 2});
        this.sectors = [
            this.sectorsContainer.addObject('roulleteCursor', {}, {alpha: 0, angle: -90.5, anchor: {y: 0.448, blendMode: BLEND_MODES.ADD_NPM}}), // 1
            this.sectorsContainer.addObject('roulleteCursor', {}, {alpha: 0, angle:  -46, anchor: {y: 0.448, blendMode: BLEND_MODES.ADD_NPM}}), //2
            this.sectorsContainer.addObject('roulleteCursor', {}, {alpha: 0, angle: -1.5, anchor: {y: 0.448}, blendMode: BLEND_MODES.ADD_NPM}), // 3
            this.sectorsContainer.addObject('roulleteCursor', {}, {alpha: 0,angle: -316.5, anchor: {y: 0.448}, blendMode: BLEND_MODES.ADD_NPM}), // 4
            this.sectorsContainer.addObject('roulleteCursor', {}, {alpha: 0, angle: -271.5, anchor: {y: 0.448}, blendMode: BLEND_MODES.ADD_NPM}),//5
            this.sectorsContainer.addObject('roulleteCursor', {}, {alpha: 0, angle:  -225, anchor: {y: 0.448}, blendMode: BLEND_MODES.ADD_NPM}), //6
            this.sectorsContainer.addObject('roulleteCursor', {}, {alpha: 0, angle: -180.5, anchor: {y: 0.448, blendMode: BLEND_MODES.ADD_NPM}}), //7
            this.sectorsContainer.addObject('roulleteCursor', {}, {alpha: 0, angle:  -135, anchor: {y: 0.448, blendMode: BLEND_MODES.ADD_NPM}}),//8,
        ];

        this.bottle = this.addObject('Bottle', {}, {x: this.bg.width / 2, y: this.bg.height / 2, anchor: 0.5});
        this.createSectorsValues();
    }

    createSectorsValues() {
        const centerX = this.bg.width  / 2;
        const centerY = this.bg.height / 2;
        const totalSectors = 8;
        const sectorAngle = (Math.PI * 2) / totalSectors; // 360 / 8 = 45° в радианах
        const labels = this.multipliers.map(m => m === '' ? '' : `X${m}`);
        const textRadius = 350;

        for (let i = 0; i < totalSectors; i++) {
            const angle = -Math.PI / 2 + i * sectorAngle;
            const props = {
                x: centerX + textRadius * Math.cos(angle),
                y: centerY + textRadius * Math.sin(angle),
                rotation: [3, 4, 5].includes(i) ? angle + Math.PI / 2 + Math.PI : angle + Math.PI / 2,
                anchor: 0.5
            };

            this.addObject('Text', {text: labels[i], style: 'RouletteWheelText'}, props);
        }
    }

    reset() {
        this.sectors.forEach(s => {
            s.alpha = 0;
        });

        this.bottle.angle = 0;
    }

    spin(multiplier, complete = () => {}) {
        const tl = gsap.timeline();
        const targetSectorIndex = this.multipliers.indexOf(multiplier);

        this.sectors.forEach(s => {
            s.alpha = 0;
        })

        tl.add(this.spinBottle(targetSectorIndex));
        tl.add(this.hilightSector(targetSectorIndex), '-=0.25');
        tl.add(complete);

        return tl;
    }

    hilightSector(sector) {
        return gsap.to(this.sectors[sector], {alpha: 0.6, duration: 0.5});
    }

    spinBottle(targetSectorIndex, onComplete = () => {}) {
        const totalSectors = 8;
        this.bottle.angle = 0;
        this.bottle.rotation = 0;

        gsap.killTweensOf(this.bottle);

        const fullRotations = 6;
        const sectorAngle = 360 / totalSectors;
        const firstSectorAngle = sectorAngle * 6;
        const targetAngle = firstSectorAngle + (targetSectorIndex * sectorAngle);
        const startRotation =  this.bottle.angle;
        const finalRotation = startRotation + fullRotations * 360 + targetAngle;

        const tl = gsap.timeline({ onComplete });

        tl.add(() => {
            services.audio.playSfx(SOUNDS.special.bottle);
        });

        tl.to( this.bottle, {
            angle: finalRotation,
            duration: 6,
            ease: customEase
        });

        return tl;
    }
}

function customEase(t, {
    backwardTime = 0.05,    // первые 20% времени для "отхода назад"
    backwardAmount = 0.02,  // максимальное отклонение: -0.1
    easeOutExponent = 2  // экспонента для ease-out
} = {}) {
    if (t < backwardTime) {
        // Нормируем время для первого этапа: p от 0 до 1
        const p = t / backwardTime;
        // Квадратичная функция, которая при p = 0 => 0, при p = 0.5 => -backwardAmount, и при p = 1 => 0
        return -backwardAmount * 4 * p * (1 - p);
    } else {
        // Для оставшейся части времени нормируем t в диапазон [0, 1]
        const u = (t - backwardTime) / (1 - backwardTime);
        // Функция ease-out: быстрое ускорение и плавное замедление
        return 1 - Math.pow(1 - u, easeOutExponent);
    }
}
