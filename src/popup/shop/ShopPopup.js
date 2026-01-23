import {BasePopup} from "../BasePopup";
import {SuperContainer} from "../../lib/objects/SuperContainer";
import services from "../../ServiceLocator";
import {ActivateShopItem, ShopItem} from "./ShopItem";
import {SuccessfulPurchase} from "./SuccessfulPurchase";
import {ShopTabList} from "./ShopTabList";
import {SOUNDS} from "../../constants/sounds";
import { FrameLayoutConfig } from "../../lib/FrameLayout";
import { BonusesService } from "../../service/ShopService";

export class ShopPopup extends BasePopup {
    create({items, isShop}) {
        this.items = items;
        this.closeButton.position.set(1631, 162);
        this.bg = this.addObject('PopupBG', {}, {anchor: 0.5, x: 's50%', y: 's50%'});
        this.title = this.addObject('Text', {text: 'ACCOUNT', style: 'PopupTitle'}, {y: 155, x: 's50%', anchor: 0.5});
        this.topPanel = this.addObject(ShopTabList, {onSelect: (i) => this.setCurrentPage(i)}, {y: 250, x: 's50%'});
        this.topPanel.x -= this.topPanel.width / 2;

        /**
         * @type {FrameLayoutConfig}
         */
        const layout = {
            width: 1150,
            wrap: true,
            elementsMargin: {left: 0, top: 0, right: 0, bottom: -20},
        };

        this.shopItemsCotainer = this.addObject(SuperContainer, {layout}, {name: 'content', y: 370, x: 's50%'});
        this.activateItemsContainer = this.addObject(SuperContainer, {layout},{name: 'content', y: 370, x: 's50%', visible: false});

        /**
         * @type {BonusesService}
         */
        this.shop = services.get('shop');

        this.shopItems = this.items.map((data) => {
            return this.shopItemsCotainer.addChild(new ShopItem( {...data, action: data.price, onClickAction: this.buyBonus.bind(this)}));
        });

        this.shopItemsCotainer.x -= this.shopItemsCotainer.width / 2;

        this.activateItems = this.items.map((data) => {
            return this.activateItemsContainer.addChild(new ActivateShopItem( {...data, action: 'Activate',  onClickAction: this.activateBonus.bind(this)}));
        });

        this.activateItemsContainer.x -= this.activateItemsContainer.width / 2;

        this.currentItemId = -1;
        this.updateItems();
        this.currentPageIndex = 0;
        this.pages = [this.shopItemsCotainer, this.activateItemsContainer];

        this._switchNextBtn = this.addObject('ArrowButton', {}, {x: 1710, y: 's55%', anchor: 0.5, scale: {x:-1}});
        this._switchNextBtn.on("clicked", this._onSwitchNextScreen, this);

        this._switchPrevBtn = this.addObject('ArrowButton', {}, {x: 200, y: 's55%', anchor: 0.5});
        this._switchPrevBtn.on("clicked", this._onSwitchPrevScreen, this);

        this.setCurrentPage(isShop ? 0 : 1);
    }

    setCurrentPage(index) {
        this.pages[this.currentPageIndex].visible = false;
        this.currentPageIndex = index;
        this.pages[this.currentPageIndex].visible = true;
        this.topPanel.setActive(index);
        this._switchPrevBtn.enabled = this.currentPageIndex > 0;
        this._switchNextBtn.enabled = this.currentPageIndex < this.pages.length - 1;
    }

    _onSwitchPrevScreen() {
        if (this.currentPageIndex <= 0) return;

        this.setCurrentPage(this.currentPageIndex - 1);
    }

    _onSwitchNextScreen() {
        if (this.currentPageIndex >= this.pages.length - 1) return;

        this.setCurrentPage(this.currentPageIndex + 1);
    }

    showSuccessfulPurchase(alias) {
        const {icon} = this.items.find((item) => item.alias === alias);
        const onClose = () => {
            this.successfulPurchasePopup.destroy();
        };
        const onActivate = async () => {
            const result = await this.activateBonus(alias);
            this.successfulPurchasePopup.destroy();
        };

        this.updateItems();
        this.successfulPurchasePopup = this.addObject(SuccessfulPurchase, {icon, onClose, onActivate});
    }

    updateItems() {
        this.shopItems.forEach((item) => {
            item.setActive(this.shop.canBuy(item.alias));
        });

        this.activateItems.forEach((item) => {
            const status = this.shop.getBonusItemStatus(item.alias);

            item.update(status, this.shop.getItem(item.alias));
        });
    }

    async activateBonus(alias) {
        this.interactive = false;
        this.interactiveChildren = false;
        services.audio.playSfx(SOUNDS.special.activate);
        const {error} = await this.shop.activateBonus(alias);

        if (error) {
            this.interactive = true;
            this.interactiveChildren = true;
            return;
        }

        this.updateItems();

        this.interactive = true;
        this.interactiveChildren = true;
    }

    async buyBonus(alias) {
        this.interactive = false;
        this.interactiveChildren = false;
        services.audio.playSfx(SOUNDS.special.buy);
        const result = await this.shop.buyBonus(alias);

        if (result.error) {
           return;
        }

        this.updateItems();
        this.showSuccessfulPurchase(alias);
        this.interactive = true;
        this.interactiveChildren = true;
    }

    currentItemId = -1;
}



