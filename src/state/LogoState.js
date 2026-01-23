import * as PIXI from "pixi.js";
import gsap from "gsap";
import {services} from "../ServiceLocator";
import signals from "signals";
import {BaseState} from "../lib/stateMachine/BaseState";

export default class LogoState extends BaseState {
    _root = null;
    _titleEnd = null;
    _isLogoAnimCompleted = null;
    _isLoaderCompleted = null;
    _isPlayerData = null;
    _isSessionInitialized = false;
    _onComplete = new signals.Signal();

    get onComplete() {
        return this._onComplete;
    }

    enter() {
        this.gameLogic = services.get('gameLogic');
        this._isLogoAnimCompleted = false;
        this._isLoaderCompleted = false;

        this._root = new PIXI.Container();
        if (PIXI.utils.isMobile.any) {
            this._root.scale.set(2);
            this._root.position.set(-services.app.width * 0.5, -services.app.height * 0.5);
        }
        services.app.stage.addChild(this._root);

        let gameLogo = new PIXI.Sprite(services.resources.get('company_logo'));
        gameLogo.anchor.set(0.5);
        gameLogo.position.set(services.app.width * 0.5, services.app.height * 0.5); // new logo
        this._root.addChild(gameLogo);

        let titleStart = new PIXI.Sprite(services.resources.get('company_title_start'));
        titleStart.position.set(gameLogo.x + gameLogo.width * 0.5 + 45, gameLogo.y - gameLogo.height * 0.5);
        this._root.addChild(titleStart);

        this._titleEnd = new PIXI.Sprite(services.resources.get('company_title_end'));
        this._titleEnd.alpha = 0;
        this._titleEnd.position.set(titleStart.x + 8, titleStart.y + 8);
        this._root.addChild(this._titleEnd);
        gsap.to(this._titleEnd, {alpha: 1, duration: 2.5, ease: "sine.inOut", onComplete: this._onLogoAnim_Completed, callbackScope: this});

        services.get("resources").load('preloader', {
            onLoaded: this._onLoader_Complete.bind(this),
            onProgress: this._onLoader_Progress.bind(this),
        });

        this.initSession();
    }

    async initSession() {
        const result = await this.gameLogic.player();

        // TODO save error
        this._isSessionInitialized = true;
        this._checkStateCompleted();
    }

    _checkStateCompleted() {
        if (this._isLoaderCompleted && this._isLogoAnimCompleted && this._isSessionInitialized) {
            this.owner.goTo('PreloaderState');
        }
    }

    _onLogoAnim_Completed() {
        this._isLogoAnimCompleted = true;
        this._checkStateCompleted();
    }

    _onLoader_Complete() {
        this._isLoaderCompleted = true;
        this._checkStateCompleted();
    }

    exit() {
        super.exit();
        this._onComplete.removeAll();

        services.app.stage.removeChild(this._root);
        this._root.destroy({children: true});
        this._root = null;

        super.exit();
    }

    _onLoader_Progress(loader) {
        this._titleEnd.alpha = loader.progress / 100;
    }
}
