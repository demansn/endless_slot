import {services} from "../ServiceLocator";
import gsap from "gsap";
import {MoneyBar} from "../game/ui/MoneyBar";
import {ProgressButton} from "../game/ui/ProgressButton";
import {SuperContainer} from "../lib/objects/SuperContainer";
import { LevelBar } from "../game/ui/LevelBar";
import {Bonuses} from "../game/ui/Bonuses";
import {FreeSpinsCounter} from "../gameObjects/hud/FreeSpinsCounter";
import {FREE_SPINS_TYPES} from "../service/api/OfflineAPI";
import {MobileHUD} from "../game/MobileHUD";
import {HUDScene} from "../game/HUDScene";

export default class HUD extends SuperContainer {
    /**
     *
     * @type {InlineBlock}
     * @private
     */
    bottomPanel = null;
    /**
     *
     * @type {MoneyBar}
     */
    balanceField = null;
    /**
     *
     * @type {MoneyBar}
     */
    winField = null;
    /**
     *
     * @type {ProgressButton}
     */
    autoSpinButton = null;
    /**
     *
     * @type {SpinButton}
     */
    spinButton = null;
    /**
     *
     * @type {ProgressButton}
     * @private
     */
    betButton = null;
    constructor({onSpin, bet, bets, levels, level}) {
        super();
        this.currencyFormatter = services.currencyFormatter;

        this.totalWinText = this.addObject('Text', {text: ' 100 ', style: 'TotalWinValue'}, {x: 's50%', y: 's50%', anchor: 0.5, alpha: 0});

        this.scene = this.addObject(services.app.isMobileDevice ? MobileHUD : HUDScene, {balance: 1000, levels, level}, {});
        this.doubleLecheryWin = this.scene.getObjectByName('DoubleLecheryWin');
        this.spinButton = this.scene.getObjectByName('SpinButton');
        this.betButton = this.scene.getObjectByName('BetButton');

        this.betButton.on('clicked', this.onBetClicked, this);
        this.betButton.setProgress( 0.5 );
        this.spinButton.on('clicked', onSpin);
        this.autoSpinButton = this.scene.getObjectByName('AutoSpinButton');
        this.autoSpinButton.on('clicked', this._onAutoBtn_Click, this);
        this.balanceField = this.scene.getObjectByName('BalanceField');

        this.accountButton = this.scene.getObjectByName('AccountButton');
        this.accountButton.on('clicked', this.onClickAccount, this);

        this.buyBonus = this.scene.getObjectByName('BonusButton');
        this.buyBonus.on('clicked', this.onClickBuyBonus, this);

        this.freeSpinsCount =  this.scene.getObjectByName('FreeSpinsCounter');

        this.winField =  this.scene.getObjectByName('WinField');
        this.winField.set(0);

        this.data.on('bet', (bet) => {
            this.betButton.setTitle(bet);
        });

        this.betButton.setProgress( (bets.indexOf(bet) + 1) / bets.length );
        this.betButton.setTitle(bet);

        this.levelBar = this.getObjectByName('LevelBar');
        this.bonusBar = this.scene.getObjectByName('Bonuses');
        this.naughtyXPLogo = this.scene.getObjectByName('NaughtyXPLogo');
        this.xpCounter = this.scene.getObjectByName('XP');
        this.xpCounter.set(level.xp);

        this.speedButton = this.scene.getObjectByName('AnimationSpeedButton');
        this.speedButton.on('switch', this.switchAnimationSpeed.bind(this));

        this.optionsButton = this.scene.getObjectByName('OptionsButton');
        this.optionsButton.on('clicked', this._onOptionsBtn_Click.bind(this));

        this.infoButton = this.scene.getObjectByName('InfoButton');
        this.infoButton.on('clicked', this._onInfoBtn_Click.bind(this));

        this.soundSwitch = this.scene.getObjectByName('SoundSwitch');
        this.soundSwitch.on('switch', this.onSwitchSound.bind(this));

        this.homeButton = this.scene.getObjectByName('HomeButton');
        this.homeButton.on('clicked', this.onHomeClicked.bind(this));

        this.winFrame = services.app.isMobileDevice ? new SuperContainer(): this.scene.getObjectByName('WinFrame');
    }

    onHomeClicked() {
        console.log( "SessionExpiredPopup.js | postMessage: goToHomePage#" + services.config.homeLink );
        if(window.parent.postMessage) window.parent.postMessage( "goToHomePage#" + services.config.homeLink, "*" );
    }

    onSwitchSound(isEnabled) {
        this.data.isMute = isEnabled;
        services.audio.muteGlobal(isEnabled);
    }

    _onInfoBtn_Click() {
        services.get('popups').showPopup('info');
    }

    _onOptionsBtn_Click() {
        services.get('popups').showPopup('options');
    }

    switchAnimationSpeed(isSlow) {
        this.data.isSpeedAnimation = isSlow;
    }

    animateLevelTo(level) {
        const tl = gsap.timeline();

        tl.add([
            this.xpCounter.animTo(level.xp),
            this.levelBar.animateTo(level)
        ]);

        return tl;
    }

    setLevel(level) {
        this.xpCounter.set(level.xp);
        this.levelBar.setLevel(level);
    }

    updateAdditionalBonuses(activeBonuses) {
        this.bonusBar.updateBonuses(activeBonuses);
    }

    animateWin(value) {
        if (this.winField.visible) {
            this.winField.animTo(value);
        }

        if (this.doubleLecheryWin.visible) {
            this.doubleLecheryWin.animTo(value);
        }
    }

    onClickAccount() {
        this.emit('clickBuyBonus', false);
    }

    onClickBuyBonus() {
        this.emit('clickBuyBonus', true);
    }

    setFreeSpinState(value, totalWin = 0, type, bet) {
        this.freeSpinsCount.value = value;
        this.freeSpinsCount.visible = true;
        this.levelBar.visible = false;
        this.xpCounter.visible = false;
        this.betButton.setTitle(bet);

        if (this.naughtyXPLogo) {
            this.naughtyXPLogo.visible = false;
        }

        this.betButton.setEnabled(false);
        this.autoSpinButton.setEnabled(false);
        this.winField.set(totalWin);

        if (type === FREE_SPINS_TYPES.DOUBLE_LECHERY) {
            this.doubleLecheryWin.visible = true;
            this.winFrame.visible = true;
            this.winField.visible = false;
        } else {
            this.doubleLecheryWin.visible = false;
            this.winFrame.visible = false;
            this.winField.visible = true;
        }
    }

    setMainGameState() {
        this.freeSpinsCount.visible = false;
        this.xpCounter.visible = true;
        this.levelBar.visible = true;
        this.doubleLecheryWin.visible = false;
        this.winFrame.visible = false;
        this.winField.visible = true;
        this.betButton.setEnabled(true);
        this.betButton.setTitle(services.get('gameLogic').bet);
        this.autoSpinButton.setEnabled(true);
        
        if (this.naughtyXPLogo) {
            this.naughtyXPLogo.visible = true;
        }
    }

    setSpinButtonEnabled(value) {
        this.spinButton.setActive(value);
        this.spinButton.setEnabled(value);
    }

    isEnabledSpinButton() {
        return this.spinButton.isActive;
    }

    onBetClicked() {
        services.get('popups').showPopup('bets', {bet: services.get('gameLogic').bet , bets: services.get('gameConfig').bets, onBetChanged: this.onBetChanged.bind(this)});
    }

    update(dt) {}

    onBetChanged(bet) {
        const bets = services.get('gameConfig').bets;
        const betIndex = bets.indexOf(bet) + 1;

        this.data.bet = bet;
        services.get('gameLogic').bet = bet;
        this.betButton.setProgress( betIndex / bets.length );
        this.betButton.setTitle(bet);
    }

    updateAutoPlayProgress(progress) {
        this.autoSpinButton.setProgress( 1 - progress );
    }

    _onAutoBtn_Click() {
        this.emit('clickAutoplay');
    }

    setFreeSpinsCount(count) {
        this.freeSpinsCount.value = count;
    }

    setBalance(balance) {
        this.balanceField.set(balance);
    }

    setWin(win) {
        if (this.winField.visible) {
            this.winField.set(win);
        }

        if (this.doubleLecheryWin.visible) {
            this.doubleLecheryWin.set(win);
        }
    }

    addWin(win) {
         if (this.winField.visible) {
            this.winField.add(win, true);
        }

        if (this.doubleLecheryWin.visible) {
            this.doubleLecheryWin.add(win, true);
        }
    }

    enableBonusButtons() {
        this.buyBonus.enabled = true;
        this.accountButton.enabled = true;
    }

    disableBonusButtons() {
        this.buyBonus.enabled = false;
        this.accountButton.enabled = false;
    }
}
