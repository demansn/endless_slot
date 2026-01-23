import gsap from "gsap";
import {services} from "../ServiceLocator";
import Game from "./Game";
import HUD from "./HUD";
import {GameStateBackground} from "./GameStateBackground";
import GameStates from "./game/GameStates";
import Autoplayer from "../game/Autoplayer";
import {BaseGameState} from "./BaseGameState";
import {AsyncActionsScenario} from "../AsyncActionsScenario";
import {DoubleLecheryScene} from "./scenes/DoubleLecheryScene";
import {RouletteScene} from "./scenes/RoulleteScene";
import {IntroPopup} from "../popup/IntroPopup";
import {Features} from "../constants";
import {SHOP_ITEMS} from "../service/api/OfflineAPI";
import {Gender} from "../constants";
import {SOUNDS} from "../constants/sounds";


export default class GameState extends BaseGameState {
    layers = null;
    /**
     *
     * @type {HUD}
     */
    hud = null;
    /**
     *
     * @type {Game}
     */
    game = null;
    spinMode = null;
    /**
    * @type {Autoplayer}
     */
    autoplayer = null;
    get isAutoplayer() {
        return this.autoplayer.isSpinning;
    };
    timeMult = null;
    /**
     * @type {PopupsManager}
     */
    popups = null;

    constructor(parameters) {
        super(parameters);

        this.bonuses = parameters.dependencies.get('shop');
    }

    playRandomAmbient() {
        const isFemale = !this.data.isManPreferences;
        const moans = isFemale ? SOUNDS.moans.female : SOUNDS.moans.male;

        const randomMoan = moans[Math.floor(Math.random() * moans.length)];

        services.audio.playAmbient(randomMoan, {
            onComplete: () => {
                window.setTimeout(() => this.playRandomAmbient(), Math.random() * 30000);
            }
        });
    }

    enter(params = null) {
        this.spinMode = spin_mode.BET;
        this.timeMult = 1;

        this.popups = services.get('popups');
        /**
         * @type {GameStateBackground}
         */
        this.bg = this.root.addObject(GameStateBackground, {level: this.gameLogic.getPlayerLevel().current});

        this.gameContainer = this.root.addObject('SuperContainer');
        this.hud = this.root.addObject(HUD,{
            bet: this.gameLogic.bet,
            bets: this.gameConfig.bets,
            onSpin: this.onSpin.bind(this),
            levels: this.gameLogic.levels,
            level: this.gameLogic.getPlayerLevel(),
        }, {layer: 'hud'});
        this.hud.setBalance(this.gameLogic.balance);

        this.game = this.gameContainer.addObject(Game, {hud: this.hud});
        this.game.position.set(563, 300);

        if (services.app.isMobileDevice) {
            this.game.x = 490;
        }

        this.autoplayer = new Autoplayer();

        this._bfKeyDown = this._onDocument_KeyDown.bind(this);
        document.addEventListener("keydown", this._bfKeyDown);

        if (services.app.isFullscreenBg) {
            services.app.onFullscreenBgUpdated.add(this._onFullscreenBg_Updated, this);
            this._onFullscreenBg_Updated(services.app.fullscreenBgWidth);
        }

        if (services.session.isError) {
            this.goTo(GameStates.ERROR, services.session.isError);
        } else {
            if (this.gameLogic.hasRestore()) {
                this.goTo(GameStates.RESTORE);
            } else {
                this.goTo(GameStates.IDLE);
            }
        }

        this.hud.on('clickBuyBonus', this.onClickBuyBonus, this);
        this.hud.on('clickAutoplay', this.onClickAutoplay, this);

        this.doubleLecheryScene = this.root.addObject(DoubleLecheryScene, {}, {layer: 'popups', visible: false});
        this.rouletteScene = this.root.addObject(RouletteScene, {}, {layer: 'popups', visible: false});

        window.setTimeout(this.playRandomAmbient.bind(this), Math.random() * 30000);
        this.playMainTheme();

        this.gameLogic.onError.connect(this.showErrorPopup.bind(this));
    }

    async showErrorPopup(error) {
        await this.popups.showPopup('error', {
            message: error.error,
        });
    }

    playMainTheme() {
        services.audio.playMusic(SOUNDS.mainTheme, {loop: true});
    }

    playBonusGameMusic() {
        services.audio.playMusic(SOUNDS.supergameTheme, {loop: true, volumeRatio: 1.3});
    }

    async onClickAutoplay() {
        this.popups.showPopup('autoplay', {
            onStarted: this._onAutoplay_Started.bind(this),
        });
    }

    onClickBuyBonus(isShop) {
        if (this.isCurrentState(GameStates.IDLE)) {
            this.goTo(GameStates.ShopState, {isShop});
        }
    }

    updateBonusIcon() {
        this.hud.updateAdditionalBonuses(this.bonuses.getActive());
    }

    _onFullscreenBg_Updated(fullscreenBgWidth) {
        // this.bg.scale.set(fullscreenBgWidth / this._bg.texture.width);
    }

    onSpin() {
        if (this.currentState && this.currentState.spin) {
            this.currentState.spin();
        }
    }

    setFreeSpinsBackground(feature, force) {
        this.bg.toggleTo(feature, force);
        this.game.switchFrame(feature);
    }

    setMainGameBackground(force) {
        this.bg.toggleTo(Features.MAIN_GAME, force);
        this.game.switchFrame(Features.MAIN_GAME);
    }

    stopAutoplay() {
        if (this.isAutoplayer) {
            this.autoplayer.stop();
        }
    }

    _onAutoplay_Started(gameLimit, winLimit, lossLimit) {
        this.autoplayer.start(gameLimit, winLimit, lossLimit);
        this.hud.updateAutoPlayProgress(this.autoplayer.progress());
    }

    _onDocument_KeyDown(event) {
        if (event.code === "Space" && !this.hud.isEnabledSpinButton()) {
            this.onSpin();
        }
    }

    update(dt) {
        dt *= this.timeMult;

        this.game.update && this.game.update(dt);
        this.hud.update && this.hud.update(dt);

        super.update(dt);
    }

    reSpin(result) {
        return this.game.reSpin(result);
    }

    skipReSpin(result) {
        return this.game.skipReSpin(result);
    }

    stopReels(result) {
        services.audio.playSfx('Spin_Fin_all');

        return this.game.stop(result);
    }

    playIdleAnimation() {
        return this.game.playIdleAnimation();
    }

    showFreeSpinSymbols(result) {
        return this.game.playWinAnimationsByPositions(result.positions, SOUNDS.bonus.elements);
    }

    addXP({level}) {
        this.hud.animateLevelTo(level);
    }

    setXP({level}) {
        this.hud.setLevel(level);
    }

    makeResultPresentation(result) {
        const actions = [];
        const {results} =  result;

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            let { type, win } = result;

            if (type === 'stop') {
                actions.push({action: () => this.stopReels(result), skipDisabled: true});
                actions.push({action: () => this.delay(0.25)});
            }

            if (type === 'respin') {
                actions.push({action: () => this.reSpin(result), skipStep: true, skip: () => this.skipReSpin(result)});
            }

            if (type === 'payLines') {
                actions.push({guard: type === 'payLines', action: () => this.game.playWinAnimation(result), skip: () => this.game.skipWin(result), skipStep: true});
            }

            if (type === 'symbols') {
                actions.push({action: () => this.showFreeSpinSymbols(result), skipStep: true});
            }

            if (type === 'bigWin') {
                actions.push({action: () => this.showBigWinPopup(result), skipStep: true});
            }

            if (type === 'xp') {
                actions.push({action: () => this.addXP(result), skip: () => this.setXP(result), skipStep: true});
            }
        }

        actions.push({action: () => this.delay(0.25), skipDisabled: true});

        return new AsyncActionsScenario({actions});
    }

    startSuperGame() {
        return  this.popups.showPopup('IntroPopup', {type: IntroPopup.TYPE.NAUGHTY_CHARACTER})
            .then( () => this.rouletteScene.show())
    }

    levelUp(result) {
        this.bg.setCharacterLevel(result.next);
        services.audio.playSfx(SOUNDS.level.up);

        return this.popups.showPopup('LevelUpPopup', {
           ...result
        });
    }

    showBigWinPopup(result) {
        return this.popups.showPopup('win', result);
    }

    rejectSpin() {
        this.hud.setSpinButtonEnabled(true);
        this.game.stop({matrix: services.gameLogic.lastSpin});
        this.hud.setBalance(services.gameLogic.balance);
    }

    delay(time) {
        return new Promise(r => {
            gsap.delayedCall(time, r);
        })
    }
}

export const spin_mode = {BET: 0, ACTIVATED_FREESPIN: 2};
Object.freeze(spin_mode);
