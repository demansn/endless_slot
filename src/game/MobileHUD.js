import {Ticker} from "pixi.js";
import {SuperContainer} from "../lib/objects/SuperContainer";
import {Menu} from "./Menu";
import services from "../ServiceLocator";

export class MobileHUD extends SuperContainer {
    constructor({bet = 0, balance, levels, level}) {
        super();

        this.sortableChildren = true;

        const MAX_WIDTH = Math.min(services.app.renderer.width, 2600);
        const dx = (MAX_WIDTH - services.app.gameSize.width) / 2;
        const LEFT = 0 - dx;
        const RIGHT = MAX_WIDTH;
        const ScreenOffsetX = Math.max(0, (services.app.renderer.width - services.app.gameSize.width) / 2);

        this.addObject('FreeSpinsCounter', {}, {x: 290, y: 25, visible: false});

        this.fields = this.addObject('InlineBlock', {gap: 12, horizontalAlign: 'right', lineWidth: 990}, {x: 80, y: 's100%'});
        this.fields.addObject('XPFieldMobile', {value: level.xp, titleStyle: 'XPFieldTitle'}, {name: 'XP'});
        this.fields.addObject('BalanceFieldMobile', {value: balance, format: b => services.currencyFormatter.format(b)}, {name: 'BalanceField'});
        this.fields.addObject('WinFieldMobile', {value: 0, format: b =>services.currencyFormatter.formatValue(b)}, {name: 'WinField'});
        this.fields.addObject('DoubleLecheryWinMobile', {value: 0, format: b =>services.currencyFormatter.formatValue(b)}, {name: 'DoubleLecheryWin', visible: false});
        this.fields.layout()
        this.fields.y -= this.fields.height;

        this.rightPanel = this.addObject('InlineBlock', {gap: -24}, {x: 1060, y: 's100%'});
        this.rightPanel.addObject('AutoSpinButton', {}, {scale: 2});
        this.rightPanel.addObject('AnimationSpeedButton', {value: this.data.isSpeedAnimation}, {scale: 2});
        this.rightPanel.addObject('BetButton', {value: bet}, {scale: 2});
        this.rightPanel.y -= this.rightPanel.height;

        this.addObject('Bonuses', {}, {x: 1150, y: 35});
        this.addObject('SpinButton', {}, {x: 1448, y: 815, scale: 1.5});

        this.menuBtn = this.addObject('MenuButton', {}, {x: LEFT + 20, y: 20, zIndex: 10});
        this.menuBtn.on('clicked', this.onClickedMenu, this);

        let btn =  this.addObject('AccountButton', {}, {scale: 1.5, x: RIGHT - dx - 20, y: 20});
        btn.x -= btn.width;
        btn = this.addObject('BonusButton', {}, {scale: 0.8,  x: RIGHT - dx, y: 230});
        btn.x -= btn.width / 2;

        this.menu = this.addObject(Menu, {}, {zIndex:  9});
        this.addObject('TimeView', {}, {x: LEFT + 200 , y: 50, zIndex: 10});
        this.addObject('LevelBar', {levels, level}, {x: 162, y: 118});

        Ticker.shared.add(this.update, this);
        this.dirtLayout = this.getLayoutStatus();
    }

    getLayoutStatus() {
        return this.fields.children.map(({visible}) => String(visible)).join('');
    }

    update() {
        if (this.dirtLayout !== this.getLayoutStatus()) {
            this.dirtLayout = this.getLayoutStatus();
            this.fields.layout();
        }
    }

    onClickedMenu() {
        this.menu.toggle();
    }

    getObjectByName(name) {
        const obj = super.getObjectByName(name);

        if (!obj) {
            return this.addObject(name, {}, {x: 1000000});
        }

        return obj;
    }
}
