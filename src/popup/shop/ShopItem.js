import {SuperContainer} from "../../lib/objects/SuperContainer";
import {BonusItemStatus} from "../../service/GameLogic";

export class ShopItem extends SuperContainer {
    constructor({icon, action = 'Action', description, id, alias, onClickAction}) {
        super();

        this.id = id;
        this.alias = alias;
        this.bg = this.addObject('ShopItemBG');
        this.icon = this.addObject(icon, {}, {x: this.bg.width / 2, y: 0, anchor: {x: 0.5, y: 0.3}, scale: 0.9});
        this.description = this.addObject('Text', {text: description, style: 'ShopItemDescription'}, {x: this.bg.width / 2, y: 133, anchor: 0.5});
        this.actionButton = this.addObject('ButtonWithTitle' ,{title: action, onClick: () => onClickAction(alias)}, {x: this.bg.width / 2, y: this.bg.height - 10, scale: 0.6});
    }

    setText(text) {
        this.actionButton.setTitle(text);
    }

    setActive(isActive) {
        this.actionButton.enabled = isActive;
    }
}

export class ActivateShopItem extends ShopItem {
    update(status) {
        switch (status) {
            case BonusItemStatus.PURCHASED:
                this.setText('ACTIVATE');
                this.setActive(true);
                break;
            case BonusItemStatus.ACTIVATED:
                this.setText('ACTIVE');
                this.setActive(false)
                this.actionButton.setState('hover', true);
                break;
            case BonusItemStatus.DEFAULT:
                this.setActive(false)
                this.setText('ACTIVATE');
                break;
        }
    }
}
