import {Service} from "./Service";
import {Signal} from "typed-signals";
import {BonusItemStatus} from "./GameLogic";

export class BonusesService extends Service {
    constructor(parameters) {
        super(parameters);

        this.api = parameters.services.get('api');
        this.data = parameters.services.get('data');
        this.session = parameters.services.get('session');
        this.onError = new Signal();

        /**
         * @type {Record<string, any>}
         */
        this.bonuses = {};
    }

    get gameLogic() {
        return this.services.get('gameLogic');
    }

    get balance() {
        return this.data.balance;
    }

    set balance(value) {
        this.data.balance = value;
    }

    /**
     * @returns {*[]}
     */
    getActive() {
        const activeBonuses = [];

        for (const alias in this.bonuses) {
            const bonus = this.bonuses[alias];
            const isActive = this.isActiveItem(alias);

            if (isActive) {
                const {count, total} = bonus.active[0];

                activeBonuses.push({ alias, count, total });
            }
        }

        return activeBonuses;
    }

    /**
     * @param {Record<string, any>} bonuses
     */
    setItems({bonuses}) {
        bonuses.forEach((bonus) => {
            this.bonuses[bonus.alias] = bonus;

            if (bonus.active.length) {
                bonus.active = bonus.active.filter((item) => item.active === 1);
            }
        });
    }

    filterActiveBonuses() {
        for (const alias in this.bonuses) {
            const bonus = this.bonuses[alias];

            if (bonus.active.length) {
                bonus.active = bonus.active.filter((item) => item.active === 1);
            }
        }
    }

    /**
     * @param {string} alias
     * @returns {Promise<any>}
     */
    async buyBonus(alias) {
        if (this.canBuy(alias) && !this.isPurchasedItem(alias)) {
            const item = this.getItem(alias);

            this.balance -= item.price;

            const result = await this.api.buyBonus({...this.getDefaultPostParams()}, item);

            if (result.error) {
                this.balance += item.price;

                this.onError.emit( {
                    status: 'error',
                    error: result.error,
                });
            }

            if (result.status === 'success' && result.item && item) {
                item.purchased.push(result.item);
            }

            return result;
        }activateBonus
    }

    /**
     * @param {string} alias
     * @returns {Promise<any>}
     */
    async activateBonus(alias) {
        if (this.isPurchasedItem(alias)) {
            const item = this.getItem(alias);
            const bonus = item.purchased.pop();
            const result = await this.api.activateBonus({ ...this.getDefaultPostParams(), hash: bonus.bonus_hash }, item);
            const {freeSpins = []} = result;

            if (result.error) {
                this.balance += item.price;

                this.onError.emit( {
                    status: 'error',
                    error: result.error,
                });
            }

            if (result.status === 'success') {
                bonus.active = 1;

                item.active.push(bonus);

                if (freeSpins.length) {
                    this.gameLogic.freeSpins.addFreeSpins(freeSpins);
                }
            }

            return result;
        }
    }

    /**
     * @param {string} alias
     * @returns {string}
     */
    getBonusItemStatus(alias) {
        const isPurhused = this.bonuses[alias].purchased.length > 0;
        const isActive = this.bonuses[alias].active.length > 0;

        if (isActive) {
            return BonusItemStatus.ACTIVATED
        } else if (isPurhused) {
            return BonusItemStatus.PURCHASED;
        } else {
            return BonusItemStatus.DEFAULT;
        }
    }

    /**
     * @param {string} alias
     * @returns {any}
     */
    getItem(alias) {
        return this.bonuses[alias];
    }

    /**
     * @param {string} alias
     * @returns {boolean}
     */
    isPurchasedItem(alias) {
        return ((this.getItem(alias).purchased || []).length) > 0;
    }

    /**
     * @param {string} alias
     * @returns {boolean}
     */
    isActiveItem(alias) {
        return ((this.getItem(alias).active || []).length) > 0;
    }

    /**
     * @param {string} alias
     * @returns {boolean}
     */
    canBuy(alias) {
        return this.balance >= this.getItem(alias).price && !this.isPurchasedItem(alias) && !this.isActiveItem(alias);
    }

    getDefaultPostParams() {
        return {
            balance: this.balance,
        };
    }
}
