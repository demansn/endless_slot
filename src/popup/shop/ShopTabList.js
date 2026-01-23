import {InlineBlock} from "../../lib/objects/InlineBlock";
import {ShopTab} from "./ShopTab";

export class ShopTabList extends InlineBlock {
    constructor({onSelect}) {
        super({gap: 10});

        this.labels = [
            this.addObject(ShopTab, {title: 'BONUS SHOP', isActive: true}),
            this.addObject(ShopTab, {title: 'ACTIVATE BONUSES', isActive: false}),
        ];

        this.labels.forEach((label, i) => {
            label.on('clicked', () => onSelect(i));
        });
    }

    setActive(index) {
        this.labels.forEach((label, i) => {
            label.setActive(i === index);
        });
    }
}
