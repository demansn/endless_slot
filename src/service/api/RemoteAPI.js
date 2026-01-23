import {FREE_SPINS_TYPES, HIRES_SYMBOLS, SHOP_ITEMS, SYMBOLS} from "./OfflineAPI";

const ALIASES_BY_NAME = {
    "double-lechery7": SHOP_ITEMS.DOUBLE_LECHERY,
    "wheel50": SHOP_ITEMS.WHEEL,
    "scatter50": SHOP_ITEMS.SCATTER,
    "wild50": SHOP_ITEMS.WILD,
    "freespin10": SHOP_ITEMS.FREE_SPINS_10,
    "freespin20": SHOP_ITEMS.FREE_SPINS_20,
    "freespin50": SHOP_ITEMS.FREE_SPINS_50,
};

/**
 * RemoteAPI — реализация API для работы с реальным сервером Endless.
 * Интерфейс полностью совместим с OfflineAPI.
 * Все методы возвращают промисы с объектами в том же формате, что и OfflineAPI.
 */
export class RemoteAPI {
    /**
     * @param {GameMath} gameMath
     * @param {Object} gameConfig
     */
    constructor(gameMath, gameConfig) {
        this.baseUrl = 'https://api.endless.crazymonkey.club/api/v1/';
        this.session_uuid = null;
        this.player_id = null;
        this.gameMath = gameMath;
        this.gameConfig = gameConfig;
        this.bonuses = []
    }


    transformBonusesItems(bonuses) {
        const items = this.mapShopItems(bonuses?.shop || []);

        bonuses?.ready.forEach((item) => {
            const bonus = items.find(({ bonus_name }) => bonus_name === item.bonus_name);

            if (item.active) {
                bonus.active.push(item);
                item.total = bonus.bonus_duration;
                item.count = item.bonus_duration;
            } else {
                bonus.purchased.push(item);
            }
        });

        return items;
    }

    mapShopItems(items) {
        return items.map((item) => {
            return {
                alias: ALIASES_BY_NAME[item.bonus_name],
                price: item.bonus_price,
                ...item,
                purchased: [],
                active: [],
            }
        });
    }

    async get(path, parameters) {
        const response = await fetch(`${this.baseUrl}${path}?${new URLSearchParams(parameters)}`);

        return await response.json();
    }

    async post(path, parameters) {
        const response = await fetch(`${this.baseUrl}${path}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(parameters)
        });

        if (!response.ok) {
            return {error: 'Internal server error'};
        }

        return await response.json();
    }

    getSuperGameFromResponse(data) {
        const {naughty_character = []} = data;
        const superGames = [];

        if (naughty_character && naughty_character.length) {
            naughty_character.forEach((sg) => {
                const { naughty_character_hash: hash, naughty_character_total_win: totalWin, naughty_character_left: left, naughty_character_total: total, bet_level: bet } = sg;

                superGames.push({ totalWin, left, total, hash, bet });
            });
        }

        if (naughty_character && naughty_character.naughty_character) {
            const { naughty_character: left, naughty_character_total: total, naughty_character_hash: hash, naughty_character_bet_level: bet } = naughty_character;

            superGames.push({ totalWin: 0, left, total, hash, bet });
        }

        return superGames;
    }

    /**
     * Extracts all free spins from API response
     * @param {import('../../types/types').FreeSpinsResponse} data
     * @returns {import('../../types/types').FreeSpin[]}
     */
    getFreeSpinsFromResponse(data) {
        /**
         * Вспомогательная функция для парсинга разных типов фриспинов
         * @param {any[]|object|undefined} source
         * @param {any} type
         * @param {object} map
         * @returns {import('../../types/types').FreeSpin[]}
         */
        function parse(source, type, map) {
            const result = [];
            if (Array.isArray(source)) {
                for (const fs of source) {
                    result.push({
                        type,
                        totalWin: fs[map.totalWin] ?? 0,
                        left: fs[map.left] ?? fs[map.total] ?? 0,
                        total: fs[map.total] ?? 0,
                        hash: fs[map.hash] ?? null,
                        bet: fs['bet_level'] || (fs[map.bet] ?? 0),
                    });
                }
            } else if (source && typeof source === 'object' && source[map.total]) {
                result.push({
                    type,
                    totalWin: 0,
                    left: source[map.total] ?? 0,
                    total: source[map.total] ?? 0,
                    hash: source[map.hash] ?? null,
                    bet: source['bet_level'] || (source[map.bet] ?? 0),
                });
            }
            return result;
        }

        return [
            ...parse(data.freespin, FREE_SPINS_TYPES.NORMAL, {
                totalWin: 'freespin_total_win',
                left: 'freespin_left',
                total: 'freespin_total',
                hash: 'freespin_hash',
                bet: 'freespin_bet_level',
            }),
            ...parse(data.double_lechery, FREE_SPINS_TYPES.DOUBLE_LECHERY, {
                totalWin: 'double_lechery_total_win',
                left: 'double_lechery_left',
                total: 'double_lechery_total',
                hash: 'double_lechery_hash',
                bet: 'double_lechery_bet_level',
            }),
            ...parse(data.full_pleasure, FREE_SPINS_TYPES.FULL_PLEASURE, {
                totalWin: 'full_pleasure_total_win',
                left: 'full_pleasure_left',
                total: 'full_pleasure_total',
                hash: 'full_pleasure_hash',
                bet: 'full_pleasure_bet_level',
            }),
        ];
    }

    /**
     * Получить состояние игрока
     * @param {Object} parameters
     * @returns {Promise<Object>}
     */
    async player(parameters) {
        const data = await this.get('player', parameters);
        const levels = data.levels.map(({level, price}) => ({
            level,
            xp: price,
        }));

        const { xp, double_lechery_final } = data;
        const freeSpins = this.getFreeSpinsFromResponse(data);
        const bonuses = this.transformBonusesItems(data.bonuses);
        const superGames = this.getSuperGameFromResponse(data);

        this.bonuses = data.bonuses;

        const doubleLecheryFinals = [];

        if (double_lechery_final && double_lechery_final.length) {
            doubleLecheryFinals.push(...double_lechery_final.map(({ double_lechery_final_hash }) => double_lechery_final_hash))
        }

        // remove first level
        levels.shift();

        return {
            session_uuid: data.session_uuid,
            balance: data.last_balance,
            xp,
            level: data.level,
            levels,
            superGames,
            freeSpins,
            doubleLecheryFinals,
            bonuses,
            last_spin: this.mapSymbols(data.last_spin) || [],
            rewards: data.rewards || [],
        };
    }

    mapSymbols(spin_elements ) {
        return spin_elements.map(symbols => symbols.map(symbol => {
            const s = symbol.toLowerCase();

            if (s === 'pluck') {
                return 'plug';
            }

            return s;
        }));
    }

    /**
     * Обычный спин
     * @param {Object} parameters
     * @returns {Promise<Object>}
     */
    async spin(parameters) {
        const data = await this.post('spin', parameters);

        if (data.error) {
            return {
                status: 'error',
                error: data.error,
            };
        }

        const spin = this.getSpins(data);
        const bonuses = this.transformBonusesItems(data.bonuses);
        const freeSpins = this.getFreeSpinsFromResponse(data);
        const superGames = this.getSuperGameFromResponse(data);

        return {
            status: data.status,
            bet: data.bet,
            demo: data.demo,
            bigwin: data.bigwin,
            jackpot: data.jackpot,
            ultrawin: data.ultrawin,
            megawin: data.megawin,
            custom_message: data.custom_message || '',
            level: data.level,
            xp: data.experience,
            before_balance: data.before_balance,
            after_balance: data.after_balance,
            freeSpins,
            superGames,
            spin,
            bonuses,
            rewards: data.rewards || [],
            total_win: data.total_win ?? (data.spin?.spin_win ?? 0),
        };
    }

    /**
     * Фриспин
     * @param {Object} parameters
     * @returns {Promise<Object>}
     */
    async freeSpin(parameters, type) {
        if (type === FREE_SPINS_TYPES.DOUBLE_LECHERY) {
            return await this.doubleLecherySpin(parameters);
        } else if (type === FREE_SPINS_TYPES.FULL_PLEASURE) {
            return await this.fullPleasureSpin(parameters);
        }

        const data = await this.post('freespin', parameters);
        const bonuses = this.transformBonusesItems(data.bonuses);
        const superGames = this.getSuperGameFromResponse(data);
        const freeGames = this.getFreeSpinsFromResponse(data);

        return {
            status: data.status,
            bet: data.bet,
            after_balance: data.after_balance,
            before_balance: data.before_balance,
            superGames,
            freeGames,
            bonuses,
            spin: this.getSpins(data),
            total_win: data.spin?.spin_win || 0,
            freespin_left: data.freespin_left,
            freespin_win: data.spin?.spin_win || 0,
            freespin_total_win: data.freespin_total_win,
            freespin_hash: parameters.hash,
            freespin_type: type,
            freespin_bet_level: data.bet,
            custom_message: data.message || '',
            rewards: data.rewards || [],
        };
    }

    async fullPleasureSpin(parameters) {
        const data = await this.post('full-pleasure', parameters);

        return {
            status: data.status,
            bet: data.bet,
            after_balance: data.after_balance,
            before_balance: parameters.balance,
            bonuses: this.transformBonusesItems(data.bonuses),
            spin: this.getSpins(data),
            total_win: data.spin?.spin_win || 0,
            freespin_left: data.freespin_left,
            freespin_win: data.spin?.spin_win || 0,
            freespin_total_win: data.freespin_total_win,
            freespin_hash: parameters.hash,
            freespin_bet_level: data.bet,
            freespin_type: FREE_SPINS_TYPES.FULL_PLEASURE,
            custom_message: data.message || '',
            rewards: data.rewards || [],
        };
    }

    async doubleLecherySpin(parameters) {
        const data = await this.post('double-lechery-spin', parameters);
        const {
            double_lechery_left, double_lechery_total, double_lechery_total_win, double_lechery_final,
            rewards,
        } = data;
        let final;

        if (double_lechery_final && double_lechery_final.double_lechery_final) {
            final = double_lechery_final.double_lechery_final_hash;
        }

        return {
            status: data.status,
            bet: data.bet,
            after_balance: data.after_balance,
            before_balance: data.before_balance,
            rewards,
            bonuses: this.transformBonusesItems(data.bonuses),
            spin: this.getSpins(data),
            total_win: data.spin?.spin_win || 0,
            freespin_left: double_lechery_left,
            freespin_win: data.spin?.spin_win || 0,
            freespin_total_win: double_lechery_total_win,
            freespin_total: double_lechery_total,
            freespin_hash: parameters.hash,
            freespin_final: final,
            freespin_bet_level: data.bet,
            custom_message: data.custom_message || '',
        };
    }

    async finishDoubleLechery(parameters) {
        const data = await this.post('double-lechery-final', parameters);
        const { before_balance, after_balance, custom_message, win, status, card } = data;

        if (status !== 'success') {
            return {
                status: 'error',
                error: data.error,
            };
        }

        return {
            status:  'success',
            totalWin: win,
            multiplier: card,
            hash: parameters.hash,
            bet: data.bet,
            after_balance,
            before_balance,
            custom_message,
        };
    }

    /**
     *
     * @param {string[][]} spinElements
     * @returns {string[]}
     */
    flatSpinElements(spinElements) {
        return spinElements.flatMap(element => element.map(symbol => symbol.toLowerCase()));
    }

    getSpins(data) {
        const {wild_respin, scatter_respin, spin, increase_pleasure} = data;
        let multiplier = increase_pleasure && this.flatSpinElements(spin.spin_elements).includes('wheel') ? 2 : 1;
        const spins = [
            {
                spin_elements: this.mapSymbols(spin.spin_elements),
                spin_win: spin.spin_win,
                spin_multi: spin.spin_multi,
                paylines: spin.paylines.map(p => ({multiplier, ...p}))
            }
        ];

        if (wild_respin && wild_respin.wild_respin_elements) {
            multiplier = increase_pleasure && this.flatSpinElements(wild_respin.wild_respin_elements).includes('wheel') ? 2 : 1;
            spins.push({
                spin_elements: this.mapSymbols(wild_respin.wild_respin_elements),
                spin_win: wild_respin.wild_respin_win,
                spin_multi: wild_respin.wild_respin_multi,
                paylines: wild_respin.paylines.map(p => ({multiplier, ...p}))

            });
        }

        if (scatter_respin && scatter_respin.scatter_respin_elements) {
            multiplier =increase_pleasure && this.flatSpinElements(scatter_respin.scatter_respin_elements).includes('wheel') ? 2 : 1;
            spins.push({
                spin_elements: this.mapSymbols(scatter_respin.scatter_respin_elements),
                spin_win: scatter_respin.scatter_respin_win,
                spin_multi: scatter_respin.scatter_respin_multi,
                paylines: scatter_respin.paylines.map(p => ({multiplier, ...p}))

            });
        }

        return spins
    }

    /**
     * Супер-игра
     * @param {Object} parameters
     * @returns {Promise<Object>}
     */
    async superGame(parameters) {
        const { bet, status, win, multi, after_balance, before_balance, custom_message } = await this.post('naughty-character', parameters);

        return {
            status,
            bet,
            after_balance,
            before_balance,
            total_win: win,
            supergame_total_win: win,
            supergame_multi: multi,
            custom_message,
        };
    }

    /**
     * Купить бонус
     * @param {Object} parameters
     * @param {Object} shopItem
     * @returns {Promise<Object>}
     */
    async buyBonus(parameters, shopItem) {
        const data = await this.post('buy', {bonus_id: shopItem.id, ...parameters});

        if (data.error) {
            return {
                status: 'error',
                error: data.error,
            };
        }

        const item = data.bonus || {};

        item.alias = ALIASES_BY_NAME[item.bonus_name];

        return {
            status: 'success',
            item,
            balance_before: data.balance_before,
            after_balance: data.after_balance,
            custom_message: data.custom_message,
        };
    }

    /**
     * Активировать бонус
     * @param {Object} parameters
     * @param {Object} item
     * @returns {Promise<Object>}
     */
    async activateBonus(parameters, item) {
        const data = await this.post('activate', {bonus_id: item.id, ...parameters});
        const { double_lechery, bonus_reward, custom_message} = data;
        const freeSpins = []

        if (bonus_reward.freespin && bonus_reward.freespin.freespin_total) {
            freeSpins.push({
                type: FREE_SPINS_TYPES.NORMAL,
                totalWin: 0,
                left: bonus_reward.freespin.freespin_total,
                total: bonus_reward.freespin.freespin_total,
                hash: bonus_reward.freespin.freespin_hash,
                bet: bonus_reward.freespin.freespin_bet_level
            });
        }

        if (bonus_reward.double_lechery && bonus_reward.double_lechery.double_lechery_total) {
            freeSpins.push({
                type: FREE_SPINS_TYPES.DOUBLE_LECHERY,
                totalWin: 0,
                left: bonus_reward.double_lechery.double_lechery_total,
                total: bonus_reward.double_lechery.double_lechery_total,
                hash: bonus_reward.double_lechery.double_lechery_hash,
                bet: bonus_reward.double_lechery.double_lechery_bet_level
            });
        }

        if (data.error) {
            return {
                status: 'error',
                error: data.error,
            };
        }

        return {
            status:  'success',
            double_lechery: data.double_lechery,
            freeSpins,
            bonuses: data.bonuses?.ready || [],
            freespin: data.freespin || null,
            error: data.error,
        };
    }

    async activateReward(parameters) {
        const data = await this.post('activate-reward', parameters);
        const { success, custom_message } = data;

        if (success === "error") {
            return {
                success,
                status: 'error',
                error: data.error,
            };
        }

        const {freespin, full_pleasure, double_lechery, naughty_character} = data.reward || {};
        const freeSpins = [];
        const superGames = [];

        if (freespin && freespin.freespin_total) {
            freeSpins.push({
                type: FREE_SPINS_TYPES.NORMAL,
                totalWin: 0,
                left: freespin.freespin_total,
                total: freespin.freespin_total,
                hash: freespin.freespin_hash,
                bet: freespin.freespin_bet_level
            })
        }

        if (full_pleasure && full_pleasure.full_pleasure_total) {
            freeSpins.push({
                type: FREE_SPINS_TYPES.FULL_PLEASURE,
                totalWin: 0,
                left: full_pleasure.full_pleasure_total,
                total: full_pleasure.full_pleasure_total,
                hash: full_pleasure.full_pleasure_hash,
                bet: full_pleasure.full_pleasure_bet_level
            })
        }

        if (double_lechery && double_lechery.double_lechery_total) {
            freeSpins.push({
                type: FREE_SPINS_TYPES.DOUBLE_LECHERY,
                totalWin: 0,
                left: double_lechery.double_lechery_total,
                total: double_lechery.double_lechery_total,
                hash: double_lechery.double_lechery_hash,
                bet: double_lechery.double_lechery_bet_level
            });
        }


        if (naughty_character && naughty_character.naughty_character) {
            superGames.push({
                totalWin: 0,
                hash: naughty_character.naughty_character_hash,
                total: 1,
                left: 1
            });
        }

        return {
            status:  'success',
            freeSpins,
            superGames,
            custom_message,
        };
    }

    /**
     * Таблица выплат
     * @param {Object} parameters
     * @returns {Promise<Object>}
     */
    async getPayTable(parameters) {
        const data = await this.get('paytables', parameters);
        const paytables = {};

        if (data.paytables) {
            for (let key in data.paytables) {
                const table = data.paytables[key];

                if (key === 'scatter' || key === 'wild' || key === 'wheel') {
                    continue;
                }

                if (key === 'pluck') {
                    key = 'plug';
                }

                paytables[key.toLowerCase()] = table;
            }
        }
        return {
            status: 'success',
            paytables,
        };
    }
    async getShopItems(parameters) {
        const data = await this.get('shop-bonuses', parameters);

        if (data.error) {
            return {
                status: 'error',
                error: data.error,
            };
        }

        return {
            status:  'success',
            bonuses: data?.bonuses || [],
            error: data.error,
        };
    }
}
