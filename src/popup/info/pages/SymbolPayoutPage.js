import {services} from "../../../ServiceLocator";
import {Container, Graphics, Sprite} from "pixi.js";
import {InfoPage} from "./InfoPage";
import {VerticalBlock} from "../../../lib/objects/VerticalBlock";
import {InlineBlock} from "../../../lib/objects/InlineBlock";
import {SuperContainer} from "../../../lib/objects/SuperContainer";
import {List} from "@pixi/ui";
import {SEXUAL_ORIENTATION} from "../../../constants";

export class SymbolPayoutPage extends InfoPage {
    constructor() {
        super({name: 'SYMBOL PAYOUT', config: {name: 'paytablePage', x: 0, y: -190, anchor: {x: 0.5} }});
        this.loadPage();
    }

    async loadPage() {
        try {
            const content = new VerticalBlock({horizontalAlign: 'center', verticalAlign: 'middle', gap: 15});
            const data = await services.gameLogic.getPayTable();

            content.addChild(new SymbolsPayTable(data));

            if (this.data.sexualOrientation === SEXUAL_ORIENTATION.GUY) {
                content.addObject('guyPaytableWildInfo');
            } else if (this.data.sexualOrientation === SEXUAL_ORIENTATION.LESB) {
                content.addObject('lesbPaytableWildInfo');
            } else {
                content.addObject('geteroPaytableWildInfo');
            }

            content.x -= 633;
            content.y = 50;
            this.contentContainer.addChild(content);
        } catch (e) {
            console.log('Error loading paytable', e);
        }
    }
}

class SymbolsPayTable extends List {
    constructor(data) {
        super({rightPadding: 1200, elementsMargin:15});
        const items = [];

        for (let symbol in data.paytables) {
            if (symbol === 'wild' || symbol === 'scatter') {
                continue;
            }

            items.push(new SymbolInfo(symbol, data.paytables[symbol]));
        }

        this.addChild(...items);
    }
}

class SymbolInfo extends SuperContainer {
    constructor(name, data) {
        super();

        this.bg = this.addObject('symbolsBg');
        this.content = this.addObject('InlineBlock', {verticalAlign: 'middle', horizontalAlign: 'center', gap: 10, lineWidth: this.bg.width, lineHeight: this.bg.height});
        this.content.addObject(`Symbol_${name}`, {}, {scale: 0.5});

        this.symbolPayout = new VerticalBlock({direction: 'vertical', gap: 0});

        for (let numbers in data) {
            const symbolPayoutInfo = new SymbolPayoutInfo(numbers, data[numbers]);
            this.symbolPayout.addChild(symbolPayoutInfo);
        }

        this.content.addChild(this.symbolPayout);
    }
}

export class SymbolPayoutInfo extends InlineBlock {
    constructor(symbolNumbers, payout) {
        super({gap: 2, horizontalAlign: 'left', verticalAlign: 'middle'});

        this.symbolNumbers = this.addObject('Text', {text: `x${symbolNumbers} -`, style: 'SymbolPayoutInfoNumbers'});
       this.reward = this.addObject('Text',
            {text: services.currencyFormatter.formatValue(payout), style: 'SymbolPayoutInfoPayout'}
        );
    }
}

export class SpecialSymbolInfo extends SuperContainer {
    constructor(icon, text) {
        super();

        this.icon = this.addObject(icon);
        this.description = this.addObject('Text', {text, style: 'SpecialSymbolDescription'}, {x: this.icon.width - 20, y: this.icon.height / 2, anchor: {y: 0.5}});
    }
}

