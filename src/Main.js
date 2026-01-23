import * as PIXI from "pixi.js";
import  "@esotericsoftware/spine-pixi-v7"
import gsap from "gsap";
import WebFont from "webfontloader";
import {track_id} from "./service/AudioManager.js";
import PreloaderState from "./state/PreloaderState";
import {GameConfig} from "./configs/game.config";
import services, {ServiceLocator} from "./ServiceLocator";
import {StateMachine} from "./lib/stateMachine/StateMachine";
import {isClass} from "./lib/Utils";
import "./gameObjects/regiseter-objects.js";
import {SOUNDS} from "./constants/sounds";

export default class Main {
    _app = null;
    _ticker = null;
    _curState = null;
    _musicTrackIndex = null;

    constructor() {
        this.init();
    }

    async init() {
        for (const [name, {Service, options}] of Object.entries(GameConfig.services)) {
            let service = null;
            if (isClass(Service)) {
                service = new Service({
                    gameConfig: GameConfig,
                    services,
                    options,
                    name
                });

                if (service.init) {
                    await service.init(options);
                }
            } else if (typeof Service === 'function') {
                service = Service({
                    gameConfig: GameConfig,
                    services,
                    options,
                    name
                });
            } else {
                service = Service;
            }
            services.set(name, service);
        }

        /**
         * @type {StateMachine}
         */
        this.fsm = new StateMachine({
            dependencies: services,
            states: GameConfig.states
        });

        this._app = services.get('app');

        this._ticker = new PIXI.Ticker();
        this._ticker.add(this._onTick, this, PIXI.UPDATE_PRIORITY.LOW);
        this._ticker.start();

        window.popups = services.get('popups');

        this.fsm.goTo('LogoState');
        this._onPreloader_Complete();

        const data = services.get('data');

        if (data.isMute) {
            services.get('audio').muteGlobal(true);
        }
    }

    _onLogo_Complete() {
        this._curState.onLeave();

        let preloaderState = new PreloaderState();
        this._curState = preloaderState;
        this._curState.onEnter();
        preloaderState.onComplete.addOnce(this._onPreloader_Complete, this);

        if (PIXI.utils.isMobile.any) {
            services.app.setDeviceOrientationCheck(true);
        }
    }

    _onPreloader_Complete() {

        // Create sound load groups.
        const kArrSoundLoadGroup = [
            { // music.
                arrExtension: ["mp3"],
                trackId: track_id.MUSIC,
                basePath: "assets/sound/",
                arrName: [
                    SOUNDS.mainTheme,
                    SOUNDS.supergameTheme
                ]
            },
            { // ambient.
                arrExtension: ["mp3"],
                trackId: track_id.AMBIENT,
                basePath: "assets/sound/",
                arrName: [
                    // Стоны
                    ...SOUNDS.moans.female,
                    ...SOUNDS.moans.male
                ]
            },
            { // sfx.
                arrExtension: ["mp3"],
                trackId: track_id.SFX,
                basePath: "assets/sound/",
                arrName: [
                    // UI звуки
                    SOUNDS.ui.hover,
                    SOUNDS.ui.click,

                    // Звуки прокрутки
                    SOUNDS.spin.fast,
                    SOUNDS.spin.slow,
                    SOUNDS.spin.end,

                    // Респины
                    SOUNDS.respin.long,
                    SOUNDS.respin.short,

                    // Выигрыши
                    SOUNDS.win.long,
                    SOUNDS.win.short,

                    // Бонусные элементы
                    SOUNDS.bonus.elements,
                    SOUNDS.bonus.start,
                    SOUNDS.bonus.results,
                    SOUNDS.bonus.end,

                    // Левел
                    SOUNDS.level.up,
                    SOUNDS.level.popup,

                    // Деньги
                    SOUNDS.money.counting,

                    // Специальные звуки бонусных игр
                    SOUNDS.special.bottle,
                    SOUNDS.special.card,
                    SOUNDS.special.buy,
                    SOUNDS.special.activate,

                    // Большие выигрыши
                    SOUNDS.bigWins.big,
                    SOUNDS.bigWins.ultra,
                    SOUNDS.bigWins.jackpot,
                    SOUNDS.bigWins.mega
                ]
            }
        ];
        services.audio.load(kArrSoundLoadGroup);

        const data = services.data;
        services.audio.changeVolume(data.musicVolume / 100, track_id.MUSIC);
        services.audio.changeVolume(Math.min(100, data.musicVolume + 30) / 100, track_id.AMBIENT);
        services.audio.changeVolume(100, track_id.SFX);
    }

    _onTick() {
        let elapsedTimeInSeconds = this._ticker.deltaMS / 1000;
        if (elapsedTimeInSeconds > 1) {
            elapsedTimeInSeconds = 1;
        }

        const currentState = this.fsm.getCurrentState();

        if (currentState && currentState.update) {
            currentState.update(elapsedTimeInSeconds);
        }

        this._app.render();
    }
}

window.onload = () => {
    WebFont.load({
        google: {
            families: ['Croissant One']
        },
        active: function () {
            var main = new Main();
        }
    })
}
