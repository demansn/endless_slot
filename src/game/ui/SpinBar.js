import * as PIXI from "pixi.js";
import signals from "signals";
import MyButton from "../../lib/MyButton";
import AutoplayPopup from "../../popup/AutoplayPopup";
import {services} from "../../ServiceLocator";
import Utils from "../../Utils";
import Session from "../../service/Session";
import ToggleButton from "../../lib/ToggleButton";
import SpinButton from "../../state/SpinButton";
import MyExButton from "../../lib/MyExButton";


export class SpinBar extends PIXI.Container {
    _betBtn = null;

    _lastAnimSpeed = null;
    _betValue = null;
    _betIndex = null;

    _spinBtn = null;

    arrBets = [0.05, 0.25, 0.5, 1, 2, 2.5, 5, 7.5, 10, 25, 50, 100];

    get betBtn() {
        return this._betBtn;
    }

    init() {


        this._betValue = services.gameLogic.bet;
        this._betIndex = 2;

        this._betBtn = new MyExButton("bet_btn", this._betValue.toString(), Utils.createTextStyleLin1(28, "Montserrat", 600));
        // this._betBtn.position.set(this._betMinusBtn.x + this._betMinusBtn.width + 8, this._betMinusBtn.y - 3);
        this.addChild(this._betBtn);
        this._betBtn.on("pointertap", this._onBetBtn_Click, this);
        this.setBetUi(this._betValue);
    }





    end() {


        // TODO:
    }







    setBetEnabled(toggle) {
        this._betBtn.setEnabled(toggle);
        this._betBtn.children[1].setEnabled(toggle);
        this._betMinusBtn.setEnabled(toggle);
        this._betPlusBtn.setEnabled(toggle);
    }
}
