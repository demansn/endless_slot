import {SubGameState} from "./SubGameState";
import GameStates from "../GameStates";
import {SHOP_ITEMS} from "../../../service/api/OfflineAPI";
import { BonusesService } from "../../../service/ShopService";

const ItemsMetadata = [
    {alias: SHOP_ITEMS.DOUBLE_LECHERY, icon: 'doubleLecheryBonus', description: 'Double Lechery'},
    {alias: SHOP_ITEMS.WHEEL, icon: 'rouletteBonus', description: 'x5 wheel of pleasure for the next 50 spins'},
    {alias: SHOP_ITEMS.SCATTER, icon: 'scatterBonus_[SexualOrientation]', description: 'x5 scatter for the next 50 spins'},
    {alias: SHOP_ITEMS.WILD, icon: 'wildBonus_[SexualOrientation]', description: 'x5 wild for the next 50 spins'},
    {alias: SHOP_ITEMS.FREE_SPINS_10, icon: 'freespin10Bonus', description: '10 freespins'},
    {alias: SHOP_ITEMS.FREE_SPINS_20, icon: 'freespin20Bonus', description: '20 freespins'},
    {alias: SHOP_ITEMS.FREE_SPINS_50, icon: 'freespin50Bonus', description: '50 freespins'},
];

export class ShopState extends SubGameState {
    constructor(parameters) {
        super(parameters);

        /**
         * @type {BonusesService}
         */
        this.bonues = parameters.dependencies.get('shop');
    }

    enter({isShop = true}) {
        this.showPopup(isShop);
    }

    exit() {
    }

    /**
     * @param {boolean} isShop
     */
    async showPopup(isShop) {
        try {
            const items = this.getShopItems();

            await this.popups.showPopup('ShopPopup', {items, isShop});

            this.hud.setBalance(this.gameLogic.balance);
            this.hud.updateAdditionalBonuses(this.bonues.getActive());

            this.owner.goTo(GameStates.IDLE);
        } catch (e) {
            this.gameState.goTo(GameStates.ERROR, e);
        }
    }

    getShopItems() {
        return ItemsMetadata.map((data) => {
            const icon = data.icon.replace('[SexualOrientation]', this.data.sexualOrientation);
            const price = this.bonues.getItem(data.alias).price.toString();
            return {...data, icon, price}
        });
    }
}
