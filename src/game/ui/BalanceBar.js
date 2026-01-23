import * as PIXI from "pixi.js";
import {LabelValue} from "./LabelValue";
import {WinValueCounter} from "../../lib/WinValueCounter";

export default class BalanceBar extends PIXI.Container
{
    _balanceWrapper = null;
    _balance = null;
    _balanceValue = null;

    _winWrapper = null;
    _win = null;
    _winValue = null;

    get winValue() { return this._winValue; }

    constructor()
    {
        super();
    }

    init()
    {
        this._winValue = 0;

        this._balance = new LabelValue('Balance:', 0);
        this.addChild(this._balance);

        /**
         * @type {WinValueCounter}
         * @private
         */
        this._balanceCounter = new WinValueCounter({
            title: this._balance,
            value: 0,
            maxWidth: 200
        })

        this._win = new LabelValue('Win:', 0);
        this.addChild(this._win);
        /**
         * @type {WinValueCounter}
         * @private
         */
        this._winCounter = new WinValueCounter({
            title: this._win,
            value: 0,
            maxWidth: 200
        });
    }

    end() {
    }
    update( dt ) {}

    setBalance( balance ) {
       this._balanceCounter.setWin(balance);
    }

    animBalance( to ) {
        this._balanceCounter.addWin(to);
    }

    setWin( win )
    {
        this._winCounter.setWin( win );
    }

    addWin( win )
    {
        this._winCounter.addWin( win );
    }
}
