import {SuperContainer} from "../lib/objects/SuperContainer";
import Settings from "./ui/Settings";
import {CurrentXPInfo} from "../gameObjects/CurrentXPInfo";
import services from "../ServiceLocator";

export class HUDScene extends SuperContainer {
    constructor({balance, levels, level}) {
        super();

        this.hudPanel = this.addObject('SuperContainer', {}, {x: 374, y: 912});
        this.bg = this.hudPanel.addObject('hudPanel', {});
        this.hudPanel.addObject('BalanceField', {}, {x: 164, y: 41});
        this.hudPanel.addObject('WinField', {format: b =>services.currencyFormatter.formatValue(b)},  {x: 1135, y: 41, visible: true});
        this.hudPanel.addObject('WinFrame', {}, {x: 1136, y: 99, anchor: 0.5, visible: false});
        this.hudPanel.addObject('DoubleLecheryWin', {format: b =>services.currencyFormatter.formatValue(b)}, {x: 1135, y: 41, visible: false});
        this.hudPanel.addObject(Settings, {}, { x: 332, y: 64});
        this.hudPanel.addObject('SpinButton', {}, {x: 556, y: -13});

        this.bottomPanel = this.hudPanel.addObject('InlineBlock', {gap: -10, horizontalAlign: "center", verticalAlign: "middle"}, {name: 'bottomPanel', x: 737, y: 54});
        this.bottomPanel.addObject('AutoSpinButton');
        this.bottomPanel.addObject('AnimationSpeedButton', {value: this.data.isSpeedAnimation});
        this.bottomPanel.addObject('BetButton', {value: 0});

        this.addObject('TimeView', {}, {x: 1800, y: 25});
        this.addObject('AccountButton', {}, {x: 1796, y: 57});
        this.addObject('FreeSpinsCounter', {value: 0}, {x: 24, y: 66, visible: false});
        this.addObject("BonusButton", {}, {x: 1690, y: "s10%", scale: 0.7});
        this.addObject('Text', {text: ' 100 ', style: 'TotalWinValue'}, {name: 'TotalWinValue', x: 's50%', y: 's50%', layer: 'hud', anchor: 0.5, alpha: 0});
        this.addObject('Bonuses', {}, {x: 1190, y: 35});
        this.addObject('NaughtyXPLogo', {}, {x: 118, y: 0});
        this.addObject(CurrentXPInfo, {value: level.xp}, {name: 'XP', x: 186, y: 880});
        this.addObject('LevelBar', {levels, level}, {x: 215, y: 118});
    }
}
