/**
 * @typedef {Object} ActiveBonusInstance
 * @property {string} alias
 * @property {string} bonus_name
 * @property {string} bonus_type
 * @property {number} bonus_duration
 * @property {number} total
 * @property {number} count
 */

/**
 * @typedef {Object} ShopItemDefinition
 * @property {number} id
 * @property {string} alias
 * @property {string} bonus_name
 * @property {string} bonus_description
 * @property {number} bonus_price
 * @property {number} price
 * @property {number} bonus_duration
 * @property {string} bonus_type
 * @property {ActiveBonusInstance[]} active
 * @property {ShopItemDefinition[]} purchased
 */

/**
 * Manages shop bonuses: purchase, activation, expiration, and filtering.
 */
export default class BonusManager {
    /**
     * @param {Object.<string, ShopItemDefinition>} shopItems
     */
    constructor(shopItems) {
        this.shopItems = shopItems;
    }

    /**
     * Purchase the bonus with given alias.
     * @param {string} alias
     */
    purchase(alias) {
        /** @type {ShopItemDefinition} */
        const {active, purchased, ...item} = this.shopItems[alias];
        if (!item) throw new Error('Bonus not found');
        this.shopItems[alias].purchased.push(item);
    }

    /**
     * Activate one purchased bonus instance.
     * @param {string} alias
     * @returns {Object} Active bonus instance.
     */
    activate(alias) {
        /** @type {ShopItemDefinition} */
        const item = this.shopItems[alias];
        if (!item || item.purchased.length === 0) throw new Error('Bonus not available');
        /** @type {any} */
        const purchasedInstance = item.purchased.shift();
        if (!purchasedInstance) throw new Error('Unexpected missing purchased instance');
        const {active, purchased, ...activeItem} =this.getActiveBonuse(purchasedInstance);

        item.active.push(activeItem);
        return activeItem;
    }

    /**
     * @param {ShopItemDefinition} item
     * @returns {ActiveBonusInstance}
     */
    getActiveBonuse(item) {
        const { alias: iAlias, bonus_name, bonus_type, bonus_duration } = item;
        const activeItem = {
            alias: iAlias,
            bonus_name,
            bonus_type,
            bonus_duration,
            total: bonus_duration,
            count: bonus_duration
        };

        return activeItem;
    }

    /**
     * Decrement active bonuses counters and remove expired ones.
     */
    decrement() {
        Object.values(this.shopItems).forEach(
            /** @param {ShopItemDefinition} item */
            item => {
                item.active.forEach(active => active.count--);
                item.active = item.active.filter(active => active.count > 0);
            }
        );
    }

    /**
     * Get raw shop item objects including active and purchased lists.
     * @returns {ShopItemDefinition[]}
     */
    getRawItems() {
        return Object.values(this.shopItems);
    }
}
