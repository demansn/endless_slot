import {Container, Point, Rectangle} from "pixi.js";
import signals from "signals";
import gsap from "gsap";
import {ObjectFactory} from "../service/ObjectFactory";
import {services} from "../ServiceLocator";
import {BonusTarget} from "../bonus/BonusTarget";
import {asyncDelay} from "../Utils";
import {Bear} from "./Bear";
import {SuperContainer} from "../lib/objects/SuperContainer";

export class BonusRoundsHud extends Container {
    constructor() {
        super();

        this.rounds = [];

        for (let i = 0; i < 3; i += 1) {
            const round = ObjectFactory.createSprite('bonus_round');
            round.position.set( i * (round.width + 20), 0);
            this.addChild(round);
            this.rounds.push(round);
        }

        // revers rounds
        this.rounds = this.rounds.reverse();
    }

    setRoundDisabled(roundNumber) {
        this.rounds.forEach((r, i) => {
            r.texture = i < roundNumber ? services.resources.get('bonus_round_disabled') : services.resources.bet('bonus_round');
        });
    }

    reset() {
        this.rounds.forEach(r => r.texture = services.resources.get("bonus_round"));
    }
}

export class BonusGame extends SuperContainer {
    constructor() {
        super();

        this.gameContainer = new SuperContainer();
        this.addChild(this.gameContainer);

        this.popupContainer = new Container();
        this.addChild(this.popupContainer);

        this.spine = this.gameContainer.addObject('SpineAnimation', {
            spine: 'Background', animation: 'Background_1', x: 's50%', y: 's50%',
            attachments: [
                // {slot: 'BG/BG1_4', object:  this.bg, notRemove: true}
            ]
        });

        this.spine.play(true);
        // this.spine.

        this.bear = new Bear({
            spine: 'ArcticFight',
            actions: ['Bear1/Idle2', 'Bear1/Idle3', 'Bear1/Idle4'],
            idle: 'Bear1/Idle1'
        });
        this.bear.scale.set(0.5);
        this.bear.play();
        this.bear.position.set(1836,  1060);
        this.gameContainer.addChild(this.bear);

        this.bg = ObjectFactory.createSpine('bonus_game');
        this.gameContainer.addChild(this.bg);

        this.targets = [];

        const slot = 10;

        for (let i = 0; i < 10; i += 1) {
            const slot = this.bg.skeleton.findSlot(`slot_v${i + 1}`);

            const target = slot.currentSprite.parent.addChild(new BonusTarget({
                id: i + 1,
                onClick: (id) => this.onClickTarget(id)
            }))

            slot.currentSprite.destroy();
            slot.currentSprite = target;

            this.targets.push(target);
        }

        this.onComplete = new signals.Signal();

        this.snowball = ObjectFactory.createSprite('snowball');
        this.snowball.anchor.set(0.5);
        this.snowball.visible = false;
        this.gameContainer.addChild(this.snowball);

        this.hud = new BonusRoundsHud();
        this.gameContainer.addChild(this.hud);
        this.hud.position.set(20, services.app.height - this.hud.height - 20);

        this.title = ObjectFactory.createText('Hit 3 targets and win prizes!', 'BonusGameTitle');
        this.title.anchor.set(0.5);
        this.title.position.set(services.app.width / 2, 100);
        this.gameContainer.addChild(this.title);

        this.hide();
    }

    async onClickTarget(id) {
        this.targets.forEach(t => t.disable());
        const value = this.result.variants.pop();
        const complete = this.result.variants.length === 0;
        const round = 3 - this.result.variants.length;

        await this.hitTarget(id);
        this.setTargetResult(id, value);
        this.hud.setRoundDisabled(round);

        if (!complete) {
            this.targets.forEach(t => {
                if (!t.isOpened) {
                    t.enable();
                }
            });
        } else {
            this.showResult(this.result.win, this.result.freespin, this.result.multiplier);
        }
    }

    /**
     * @param id
     * @param result {'X{number}', '{number}-freespins'}
     */
    setTargetResult(id, result) {
        let value = null;

        if (result.includes('freespins')) {
            value = {type: 'fs', value: result.replace('-freespins', '')};
        } else {
            value = {type: 'm', value: result.replace('X', '')};
        }

        this.targets[id - 1].setValue(value);
    }

    // create gsap animation, fly snowball to target
    async hitTarget(targetNumber) {
        const target = this.targets[targetNumber - 1];
        const targetPos = this.gameContainer.toLocal(target.position, target.parent);

        this.snowball.position.set(services.app.width / 2, services.app.height);
        this.snowball.visible = true;
        this.snowball.alpha = 1;
        this.snowball.scale.set(1);

        const duration = 0.3;

        return new Promise(r => {
            gsap.to(this.snowball.scale,  {
                duration,
                x: 0.2,
                y: 0.2
            });
            gsap.to(this.snowball,  {
                duration,
                x: targetPos.x,
                onComplete: () => {
                    this.snowball.visible = false;
                    r();
                },
            });

            gsap.to(this.snowball,  {
                duration,
                y: targetPos.y,
                onComplete: () => {
                    this.snowball.visible = false;
                    r();
                },
                ease: 'power3.out'
            });
        });
    }

    show() {
        this.visible = true;
        this.isStarted = false;
        this.isComplete = false;
    }

    hide() {
        this.visible = false;
    }

    play(hash) {
        this.bg.interactive = false;
        this.bg.interactiveChildren = false;
        this.startGame(hash);

        return new Promise( r => this.onComplete.addOnce(r));
    }

    async startGame(hash) {
        this.show();
        this.hud.reset();

        const start =  () => {
            if (this.isStarted) return;

            this.bg.interactive = true;
            this.bg.interactiveChildren = true;
            this.targets.forEach(t => t.enable());
            this.isStarted = true;
        };

        this.result = await services.gameLogic.superGame(hash);

        services.popupManager.showBonusGameIntro(start);
    }

    completeGame() {
        if (this.isComplete) return;

        this.isComplete = true;
        this.hide();
        this.onComplete.dispatch();
        this.targets.forEach(t => t.reset());
        gsap.killTweensOf(this);
    }

    async showResult(win, freeSpins, multiplier) {
        if (freeSpins > 0 || multiplier > 0) {

           await asyncDelay(0.5);

            if (multiplier > 0 && freeSpins > 0) {
                await services.popupManager.showGameTwoValuesPopup({multiplier, freeSpins});
            } else {
                await services.popupManager.showBonusGameWinOneValuePopup({value : multiplier > 0 ? multiplier : freeSpins, isFreeSpins: freeSpins > 0});
            }

            if (win > 0) {
                services.popupManager.showBonusGameWinPopup(win, () => this.completeGame());
            } else {
                this.completeGame();
            }
        } else {
             services.popupManager.showBonusGameLosePopup(() =>  this.completeGame());
        }
    }
}
