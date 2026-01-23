import {SlotMath} from "../gameMath/SlotMath.js";
import {BONUSES} from "../../constants";
import {GameMath} from "../GameMath.js";
import BonusManager from "./BonusManager.js";

const NO_WIN = [
    ['a', 'j', 'q', 'k', 'wild'],
    ['gag', 'handcuffs', 'plug', 'scatter', 'a'],
    ['a', 'j', 'q', 'k', 'a'],
];
const WIN = [
    ['a', 'a', 'a', 'a', 'a'],
    ['k', 'k', 'k', 'scatter', 'wild'],
    ['a', 'j', 'q', 'k', 'a'],
];

const WILDFREESPIN = [
    ['wild', 'a', 'q', 'a', 'a'],
    ['gag', 'handcuffs', 'wild', 'q', 'k'],
    ['a', 'j', 'q', 'wild', 'a'],
];

const BIG_WIN = [
    ['a', 'a', 'k', 'a', 'a'],
    ['gag', 'q', 'gag', 'gag', 'gag'],
    ['handcuffs', 'handcuffs', 'handcuffs', 'handcuffs', 'handcuffs'],
];

const NAUGHTYCHARACTER = [
    ['a', 'j', 'a', 'a', 'a'],
    ['gag', 'j', 'plug', 'scatter', 'scatter'],
    ['a', 'j', 'scatter', 'k', 'a'],
];

const WILDRESPIN = [
    ['a', 'q', 'a', 'a', 'a'],
    ['gag', 'handcuffs', 'plug', 'q', 'wild'],
    ['a', 'j', 'wild', 'k', 'a'],
];

const SCATTERRESPIN = [
    ['a', 'a', 'j', 'a', 'a'],
    ['gag', 'handcuffs', 'plug', 'scatter', 'wild'],
    ['a', 'j', 'scatter', 'k', 'a'],
];

const INSCREASEPLEASURE = [
    ['a', 'a', 'a', 'a', 'a'],
    ['gag', 'handcuffs', 'plug', 'wheel', 'a'],
    ['a', 'j', 'k', 'k', 'a'],
];

const FREE_SPINS = [
    ['wild', 'k', 'j', 'a', 'a'],
    ['gag', 'handcuffs', 'plug', 'a', 'a'],
    ['wild', 'j', 'k', 'k', 'wild'],
];

const fullpleasure = [
    ['mask', 'k', 'j', 'a', 'a'],
    ['gag', 'handcuffs', 'plug', 'a', 'a'],
    ['a', 'j', 'k', 'k', 'wild'],
];

const cheatsSpins = {
    'wildrespin': WILDRESPIN,
    'scatterrespin': SCATTERRESPIN,
    'wildfreespin': WILDFREESPIN,
    'naughtycharacter': NAUGHTYCHARACTER,
    'inscreasepleasure': INSCREASEPLEASURE,
    'freespin': FREE_SPINS,
    'fullpleasure': fullpleasure,
};


export const SYMBOLS = {
    A: 'a',
    J: 'j',
    Q: 'q',
    K: 'k',
    MASK: 'mask',
    GAG: 'gag',
    HANDCUFFS: 'handcuffs',
    PLUG: 'plug',
    WILD: 'wild',
    SCATTER: 'scatter',
    WHEEL: 'wheel',
};

export const HIRES_SYMBOLS = [SYMBOLS.MASK, SYMBOLS.PLUG, SYMBOLS.HANDCUFFS, SYMBOLS.GAG];
export const FREE_SPINS_TYPES = {
    "FULL_PLEASURE": 'fullPleasure',
    "DOUBLE_LECHERY": 'doubleLechery',
    "NORMAL": 'freespin',
};

const MULTIPLIER_TABLES = {
   [SYMBOLS.A]: {3: 2, 4: 3, 5: 4},
    [SYMBOLS.J]: {3: 2, 4: 3, 5: 4},
    "q": {3: 2, 4: 3, 5: 4},
    "k": {3: 2, 4: 3, 5: 4},
    "mask": {3: 4, 4: 5, 5: 6},
    "gag": {3: 4, 4: 5, 5: 6},
    "handcuffs": {3: 4, 4: 5, 5: 6},
    "plug": {3: 4, 4: 5, 5: 6},
};

export const SHOP_ITEMS = {
    WILD: 'x5Wild',
    DOUBLE_LECHERY: 'doubleLechery',
    WHEEL: 'x5WheelOfPleasure',
    SCATTER: 'x5ScatterOfPleasure',
    FREE_SPINS_10: '10FreeSpins',
    FREE_SPINS_20: '20FreeSpins',
    FREE_SPINS_50: '50FreeSpins',
};

export const LEVELS = [
    {level: 2, xp: 250},
    {level: 3, xp: 500},
    {level: 4, xp: 750},
    {level: 5, xp: 1000},
    {level: 6, xp: 1250},
];

export const LEVELS_UP_REWARDS = {
    2: [BONUSES.FREE_SPINS],
    3: [BONUSES.FREE_SPINS, BONUSES.FULL_PLEASURE],
    4: [BONUSES.FREE_SPINS, BONUSES.FULL_PLEASURE],
    5: [BONUSES.DOUBLE_LECHERY, BONUSES.FREE_SPINS],
    6: [BONUSES.DOUBLE_LECHERY, BONUSES.FREE_SPINS, BONUSES.NAUGHTY_CHARACTER],
};

export const DOUBLE_LECHERY_MULTIPLIERS = [1, 2, 0.5, 0];

export class OfflineAPI {
    /** @type {GameMath|null} */
    gameMath = null;
    symbols = ['a', 'j', 'q', 'k', 'mask', 'gag', 'handcuffs', 'plug', 'wild', 'scatter'];
    balance = 1000;
    maxXP = LEVELS[LEVELS.length - 1].xp;
    shopItems = {
        [SHOP_ITEMS.DOUBLE_LECHERY]: {
            "id": 1,
            alias: SHOP_ITEMS.DOUBLE_LECHERY,
            "bonus_name": "double-lechery7",
            "bonus_description": "Double Lechery game",
            "bonus_price": 0.6,
            "price": 0.6,
            "bonus_duration": 7,
            "bonus_type": "double-lechery",
            active: [],
            purchased: [],
        },
        [SHOP_ITEMS.SCATTER]: {
            "id": 3,
            alias: SHOP_ITEMS.SCATTER,
            "bonus_name": "scatter50",
            "bonus_description": "Increased chance of getting SCATTER x5 until the end of the day",
            "bonus_price": 0.6,
            "price": 0.6,
            "bonus_duration": 50,
            "bonus_type": "scatter",
            active: [],
            purchased: [],
        },
        [SHOP_ITEMS.WHEEL]: {
            "id": 2,
            alias: SHOP_ITEMS.WHEEL,
            "bonus_name": "wheel50",
            "bonus_description": "Increased chance of getting WHEEL x5 until the end of the day",
            "bonus_price": 0.6,
            "price": 0.6,
            "bonus_duration": 50,
            "bonus_type": "wheel",
            active: [],
            purchased: [],
        },
        [SHOP_ITEMS.FREE_SPINS_10]: {
            "id": 5,
            alias: SHOP_ITEMS.FREE_SPINS_10,
            "bonus_name": "freespin10",
            "bonus_description": "Freespin game 10",
            "bonus_price": 0.6,
            "price": 0.6,
            "bonus_duration": 10,
            "bonus_type": "freespin",
            active: [],
            purchased: [],
        },
        [SHOP_ITEMS.FREE_SPINS_20]: {
            "id": 6,
            alias: SHOP_ITEMS.FREE_SPINS_20,
            "bonus_name": "freespin20",
            "bonus_description": "Freespin game 20",
            "bonus_price": 0.6,
            "price": 0.6,
            "bonus_duration": 20,
            "bonus_type": "freespin",
            active: [],
            purchased: [],
        },
        [SHOP_ITEMS.FREE_SPINS_50]: {
            "id": 7,
            alias: SHOP_ITEMS.FREE_SPINS_50,
            "bonus_name": "freespin50",
            "bonus_description": "Freespin game 50",
            "bonus_price": 0.6,
            "price": 0.6,
            "bonus_duration": 50,
            "bonus_type": "freespin",
            active: [],
            purchased: [],
        },
        [SHOP_ITEMS.WILD]: {
            "id": 4,
            alias: SHOP_ITEMS.WILD,
            "bonus_name": "wild50",
            "bonus_description": "Increased chance of getting WILD x5 until the end of the day",
            "bonus_price": 0.6,
            "price": 0.6,
            "bonus_duration": 50,
            "bonus_type": "wild",
            active: [],
            purchased: [],
        },
    };
    /** @type {any[]} */
    freeSpins = [];
    /** @type {any[]} */
    superGames = [];
    /** @type {any|null} */
    doubleLecheryGame = null;
    /** @type {any|null} */
    currentFreeSpin = null;
    /** @type {Record<string, any[]>} */
    cheatsSpins = cheatsSpins;
    xp = 0;
    level = 1;
    rewards = [
        {
            "reward_name": "freespin10",
            "reward_type": "freespin-low",
            "reward_hash": null,
            "active": 0
        },
        {
            "reward_name": "freespin10",
            "reward_type": "freespin-high",
            "reward_hash": null,
            "active": 0
        },
        {
            "reward_name": "full-pleasure",
            "reward_type": "full-pleasure",
            "reward_hash": null,
            "active": 0
        },
        {
            "reward_name": "double-lechery",
            "reward_type": "double-lechery",
            "reward_hash": null,
            "active": 0
        },
        {
            "reward_name": "naughty-character",
            "reward_type": "naughty-character",
            "reward_hash": null,
            "active": 0
        }
    ]

    /** @type {BonusManager} */
    bonusManager;

    /**
     * @param {GameMath} gameMath
     * @param {object} gameConfig
     */
    constructor(gameMath, gameConfig) {
        this.gameMath = gameMath;
        this.paramters = new URLSearchParams(window.location.search);
        this.slotMath = new SlotMath(gameConfig);
        this.stored = null;
        this.bonusManager = new BonusManager(this.shopItems);

        if (this.paramters.has('bonus') && this.paramters.get('bonus') === 'doubleleachery') {
            this.bonusManager.purchase(SHOP_ITEMS.DOUBLE_LECHERY);
        }

        if (this.paramters.has('level')) {
            this.level = parseInt(this.paramters.get('level'));
            this.xp = LEVELS.find(({level}) => level === this.level).xp;
        }

        if (this.paramters.has('xp')) {
            this.xp = parseInt(this.paramters.get('xp'));
            this.level = this.getCurrentLevelByXP(this.xp);
        }
    }

    getCurrentLevelByXP(xp = this.xp) {
        let currentLevel = 1;

        for (let i = 0; i < LEVELS.length; i++) {
            const levelInfo = LEVELS[i];
            if (xp >= levelInfo.xp) {
                currentLevel = levelInfo.level;
            }
        }

        return currentLevel;
    }

    /**
     * Get level for given xp
     * @param {number} xp
     * @returns {number}
     */
    getLevelByXP(xp) {
        let currentLevel = 1;

        for (let i = 0; i < LEVELS.length; i++) {
            const levelInfo = LEVELS[i];
            if (xp >= levelInfo.xp) {
                currentLevel = levelInfo.level;
            }
        }

        return currentLevel;
    }

    /**
     * Fetch player state and simulate RemoteAPI.player structure
     * @param {{balance: number}} parameters
     * @returns {Promise<Object>} player data matching RemoteAPI
     */
    async player(parameters) {
        await this.randomDelay();

        this.balance = parameters.balance;

        const session_uuid = 'offline';
        const balance = this.balance;
        const xp = this.xp;
        const level = this.level;
        const levels = LEVELS.slice();
        const freeSpins = this.freeSpins.map(fs => ({
            type: fs.freespin_type,
            totalWin: fs.freespin_total_win ?? 0,
            left: fs.freespin_left ?? fs.freespin_total ?? 0,
            total: fs.freespin_total ?? 0,
            hash: fs.freespin_hash ?? null,
            bet: fs.freespin_bet_level ?? 0,
        }));

        /** @type {any[]} */
        const superGames = [];
        /** @type {any[]} */
        const doubleLecheryFinals = [];
        /** @type {any[]} */
        const bonuses = this.bonusManager.getRawItems();

        /** @type {any[]} */
        const last_spin = [];
        /** @type {any[]} */
        const rewards = this.rewards;

        return this.clone({
            session_uuid,
            balance,
            xp,
            level,
            levels,
            superGames,
            freeSpins,
            doubleLecheryFinals,
            bonuses,
            last_spin,
            rewards,
        });
    }

    getCheatSpin() {
        for (const key in this.cheatsSpins) {
            if (this.paramters.has(key)) {
                return /** @type {any} */(this.cheatsSpins[key]);
            }
        }

        if (this.paramters.has('bonus')) {
           const bonus = /** @type {string} */(this.paramters.get('bonus'));

            if (this.cheatsSpins[bonus]) {
                return /** @type {any} */(this.cheatsSpins[bonus]);
            }
        }

        if (this.paramters.has('freespin')) {
            return /** @type {any} */(WinFreeSpins);
        }
        if (this.paramters.has('win')) {
            return /** @type {any} */(WIN);
        }

        if (this.paramters.has('bigwin') || this.paramters.has('jackpot') || this.paramters.has('ultrawin') || this.paramters.has('megawin')) {
            return /** @type {any} */(BIG_WIN);
        }

        return null;
    }

    /**
     * Simulate RemoteAPI.spin
     * @param {{ balance: number, bet: number }} parameters
     * @returns {Promise<Object>}
     */
    async spin({ balance, bet }) {
        const before_balance = balance;
        await this.randomDelay();

        const firstSpinElements = this.getCheatSpin();
        const spin = this.slotMath.getSpins({ firstSpinElements: /** @type {any} */(firstSpinElements) });
        const lastSpin = spin[spin.length - 1];
        const multiplier = this.slotMath.getSymbolPositions(lastSpin.spin_elements, SYMBOLS.WHEEL).length ? 2 : 1;
        const total_win = this.slotMath.addWinsToSpins(spin, MULTIPLIER_TABLES, bet, multiplier);

        // xp calculation
        const isNoWin = spin.filter(({ paylines }) => paylines.length).length === 0;
        let xpGain = spin.filter(({ paylines }) => paylines.length).length;
        const wildCount = this.slotMath.getSymbolPositions(lastSpin.spin_elements, SYMBOLS.WILD).length;
        const scatterCount = this.slotMath.getSymbolPositions(lastSpin.spin_elements, SYMBOLS.SCATTER).length;
        const allHires = this.slotMath.hasSymbols(lastSpin.spin_elements, HIRES_SYMBOLS);
        if (wildCount === 2 || scatterCount === 2) xpGain += 2;
        this.xp += xpGain;
        this.level = this.getCurrentLevelByXP(this.xp);

        // decrement active bonuses and filter expired
        this.bonusManager.decrement();

        // free spins array
        const freeSpins = [];
        if (wildCount >= 3) {
            const fs = this.getFreeSpins(bet, FREE_SPINS_TYPES.NORMAL);
            this.freeSpins.push(fs);
            freeSpins.push({
                type: fs.freespin_type,
                totalWin: fs.freespin_total_win,
                left: fs.freespin_left,
                total: fs.freespin_total,
                hash: fs.freespin_hash,
                bet: fs.freespin_bet_level,
            });
        }

        // super games array
        const superGames = [];
        if (scatterCount >= 3) {
            const sg = this.getSuperGame(bet);
            this.superGames.push(sg);
            superGames.push({
                type: FREE_SPINS_TYPES.NORMAL,
                totalWin: 0,
                left: 0,
                total: 0,
                hash: sg.supergame_hash,
                bet: sg.supergame_bet,
            });
        }

        if (allHires && !freeSpins.length && !superGames.length && isNoWin) {
            const fs = this.getFreeSpins(bet, FREE_SPINS_TYPES.FULL_PLEASURE);
            this.freeSpins.push(fs);
            freeSpins.push({
                type: fs.freespin_type,
                totalWin: fs.freespin_total_win,
                left: fs.freespin_left,
                total: fs.freespin_total,
                hash: fs.freespin_hash,
                bet: fs.freespin_bet_level,
            });
        }

        const after_balance = before_balance + total_win;
        /** @type {any[]} */
        const bonuses = this.bonusManager.getRawItems();

        this.rewardByLevelUp(this.xp);
        const rewards = this.rewards;

        return this.clone({
            status: 'success',
            bet,
            demo: 0,
            ...this.getBigWinData(),
            custom_message: '',
            level: this.level,
            xp: this.xp,
            before_balance,
            after_balance,
            freeSpins,
            superGames,
            bonuses,
            spin,
            rewards,
            total_win,
            multiplier,
        });
    }

    rewardByLevelUp(xp) {
        const level = this.getLevelByXP(xp);
        const reward = this.rewards[level - 2];

        if (!reward || reward.reward_hash) {
            return;
        }

        reward.reward_hash = 'offline-reward-' + level;
        reward.active = 1;
    }

    /**
     * @param {number} bet
     * @returns {{supergame_bet:number, supergame_hash:string}}
     */
    getSuperGame(bet) {
        return {
            supergame_bet: bet,
            supergame_hash: 'offline-super-game' + this.superGames.length,
        }
    }

    /**
     * Simulate RemoteAPI.freeSpin
     * @param {{hash: string, bet: number, balance: number}} parameters
     * @param {string} type
     * @returns {Promise<Object>}
     */
    async freeSpin({ hash, bet, balance }, type) {
        const before_balance = balance;
        await this.randomDelay();

        const fs = this.freeSpins.find(s => s.freespin_hash === hash);
        if (!fs) {
            return this.clone({ status: 'error', error: 'Free spin not found' });
        }
        if (fs.freespin_left <= 0) {
            return this.clone({ status: 'error', error: 'No free spins left' });
        }

        const spin = this.slotMath.getSpins({ onlySymbols: type === FREE_SPINS_TYPES.FULL_PLEASURE ? HIRES_SYMBOLS : [] });
        const lastSpin = spin[spin.length - 1];
        const multiplier = this.slotMath.getSymbolPositions(lastSpin.spin_elements, SYMBOLS.WHEEL).length ? 2 : 1;
        const total_win = this.slotMath.addWinsToSpins(spin, MULTIPLIER_TABLES, bet, multiplier)
        const bonuses = this.bonusManager.getRawItems();
        let freespin_final = null;

        fs.freespin_left--;
        fs.freespin_total_win = (fs.freespin_total_win || 0) + total_win;

        if (fs.freespin_left === 0 && type === FREE_SPINS_TYPES.DOUBLE_LECHERY) {
            fs.freespin_final = freespin_final =  'offline-double-final-' + hash;
        } else if (fs.freespin_left === 0) {
            this.balance += fs.freespin_total_win;
        }

        const after_balance = this.balance;

        return this.clone({
            status: 'success',
            bet,
            demo: 0,
            ...this.getBigWinData(),
            custom_message: '',
            before_balance,
            after_balance,
            freeSpins: [],
            superGames: [],
            bonuses,
            spin,
            total_win,
            freespin_left: fs.freespin_left,
            freespin_win: total_win,
            freespin_total_win: fs.freespin_total_win,
            freespin_hash: hash,
            freespin_type: type,
            freespin_bet_level: bet,
            freespin_final,
        });
    }

    /**
     * @param {{hash:string}} parameters
     * @returns {Promise<Object>}
     */
    async superGame({hash}) {
        await this.randomDelay();
        const balance_before = this.balance;
        const superGame = this.superGames.find(superGame => superGame.supergame_hash === hash);

        if (!superGame) {
            return {
                "status": "error", "error": "Super game not found"
            }
        }

        const multipliers = [0, 1, 2, 5, 10, 50, 100];
        const multiplier = multipliers[Math.floor(Math.random() * multipliers.length)];
        const bet = superGame.supergame_bet;
        const total_win = bet * multiplier;

        this.balance += total_win;

        const after_balance = this.balance;
        const response = {
            "status": "success",
            "bet": 0.5,
            "demo": 0,
            "custom_message": "",
            balance_before,
            after_balance,
            total_win,
            "supergame_total_win": total_win,
            "supergame_multi": multiplier
        };

        console.log('response ----- ');
        console.log(response);

        return this.clone(response);
    }

    getBigWinData() {
        return {
            "bigwin": this.paramters.has('bigwin') ? 1 : 0,
            "jackpot": this.paramters.has('jackpot') ? 1 : 0,
            "ultrawin": this.paramters.has('ultrawin') ? 1 : 0,
            "megawin": this.paramters.has('megawin') ? 1 : 0,
        }
    }

    /**
     * @param {number} bet
     * @param {string} type
     * @param {number} [count]
     * @returns {Object}
     */
    getFreeSpins(bet, type, count = 10) {
        return this.getFreeSpin(bet, count, type);
    }

    /**
     * @param {number} bet
     * @param {number} count
     * @param {string} [type]
     * @returns {Object}
     */
    getFreeSpin(bet, count, type = 'freespin') {
        return {
            "freespin": count,
            "freespin_total": count,
            'freespin_left': count,
            freespin_total_win: 0,
            "freespin_hash": 'offline-freespin' + this.freeSpins.length,
            "freespin_bet_level": bet,
            "freespin_type": type,
        };
    }

    /**
     * Buy a bonus item.
     * @param {Object} parameters - request parameters including session and demo.
     * @param {Object} shopItem - item to purchase.
     * @returns {Promise<Object>} purchase result.
     */
    async buyBonus(parameters, shopItem) {
        await this.randomDelay();
        let error = null;
        if (!shopItem) error = 'Item not found';
        if (this.balance < shopItem.price) error = 'Not enough money';
        if (error) return {status: 'error', error};
        this.bonusManager.purchase(shopItem.alias);
        const balance_before = this.balance;
        this.balance -= shopItem.price;
        const after_balance = this.balance;


        return this.clone({
            status: 'success',
            item: shopItem,
            balance_before,
            after_balance,
            custom_message: ''
        });
    }

    /**
     * Activate a bonus item.
     * @param {Object} parameters - request parameters.
     * @param {Object} item - item to activate.
     * @returns {Promise<Object>} activation result.
     */
    async activateBonus(parameters, item) {
        await this.randomDelay();
        let activeItem;
        try {
            activeItem = this.bonusManager.activate(item.alias);
        } catch (e) {
            return this.clone({ status: 'error', error: e.message });
        }

        const freeSpins = [];
        if ([SHOP_ITEMS.FREE_SPINS_10, SHOP_ITEMS.FREE_SPINS_20, SHOP_ITEMS.FREE_SPINS_50, SHOP_ITEMS.DOUBLE_LECHERY].includes(item.alias)) {
            const type = item.alias === SHOP_ITEMS.DOUBLE_LECHERY ? FREE_SPINS_TYPES.DOUBLE_LECHERY : FREE_SPINS_TYPES.NORMAL;
            const fs = this.getFreeSpin(0.5, activeItem.bonus_duration, type);
            this.freeSpins.push(fs);
            freeSpins.push({
                type: fs.freespin_type,
                totalWin: fs.freespin_total_win,
                left: fs.freespin_left,
                total: fs.freespin_total,
                hash: fs.freespin_hash,
                bet: fs.freespin_bet_level
            });
        }

        return this.clone({ status: 'success', freeSpins, error: null });
    }

    async randomDelay() {
        const delay = Math.floor(Math.random() * 1000);

        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    /**
     * @param {{bet:number}} parameters
     * @returns {Promise<Object>}
     */
    async getPayTable({bet}) {
        await this.randomDelay();

        const paytables = {};

        this.symbols.forEach(symbol => {
            if (MULTIPLIER_TABLES[symbol]) {
                const multipliers = MULTIPLIER_TABLES[symbol];

                paytables[symbol] = {};

                Object.keys(multipliers).forEach(count => {
                    paytables[symbol][count] = bet * multipliers[count];
                });
            }
        });

        return this.clone({
            "status": "success", paytables,
        });
    }

    /**
     * @param {any} obj
     * @returns {any}
     */
    clone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Simulate RemoteAPI.finishDoubleLechery
     * @param {{hash: string, balance: number}} parameters
     * @returns {Promise<Object>}
     */
    async finishDoubleLechery({ hash, balance }) {
        await this.randomDelay();
        const fs = this.freeSpins.find(s => s.freespin_final === hash);

        if (!fs) {
            return { status: 'error', error: 'Free spin not found' };
        }
        const multiplier = DOUBLE_LECHERY_MULTIPLIERS[Math.floor(Math.random() * DOUBLE_LECHERY_MULTIPLIERS.length)];
        const totalWin = fs.freespin_total_win * multiplier;
        const before_balance = balance;
        this.balance += totalWin;
        const after_balance = this.balance;
        return this.clone({
            status: 'success',
            totalWin,
            multiplier,
            hash,
            bet: 0,
            before_balance,
            after_balance,
            custom_message: '',
        });
    }

    /**
     * @param {Object} parameters
     * @returns {Promise<Object>}
     */
    async getShopItems(parameters) {
        const bonuses = this.bonusManager.getRawItems().map(
            /** @param {{alias:string, price:number, bonus_duration:number}} b */
            ({alias, price, bonus_duration: count}) => ({
            alias,
            price,
            id: alias,
            bonus_name: alias,
            bonus_price: price,
            bonus_duration: count,
        }));
        return this.clone({status: 'success', bonuses, error: null});
    }

    /**
     * @param {Object} parameters
     * @returns {Promise<Object>}
     */
    async activateReward({ hash }) {
        await this.randomDelay();

        const rewrdIndex = this.rewards.findIndex(({reward_hash}) => reward_hash === hash);

        if (rewrdIndex > 0 && this.rewards[rewrdIndex].active) {
            return this.getError('Reward not found');
        }

        this.rewards[rewrdIndex].active = 0;

        const level = rewrdIndex + 2;
        const levelRewards = LEVELS_UP_REWARDS[level];
        const reward = levelRewards[Math.floor(Math.random() * levelRewards.length)];
        const freeSpins = [];
        const bonusGames = [];
        let fs = null;

        if (reward === BONUSES.FREE_SPINS) {
         fs = this.getFreeSpin(0.1, 10, FREE_SPINS_TYPES.NORMAL);
        }

        if (reward === BONUSES.FULL_PLEASURE) {
            const fs = this.getFreeSpin(0.1, 10, FREE_SPINS_TYPES.FULL_PLEASURE);
        }

        if (reward === BONUSES.DOUBLE_LECHERY) {
            fs = this.getFreeSpin(0.1, 10, FREE_SPINS_TYPES.DOUBLE_LECHERY);
        }

        if (fs) {
            this.freeSpins.push(fs);
            freeSpins.push({
                type: fs.freespin_type,
                totalWin: fs.freespin_total_win,
                left: fs.freespin_left,
                total: fs.freespin_total,
                hash: fs.freespin_hash,
                bet: fs.freespin_bet_level
            });
        }

        if (reward === BONUSES.DOUBLE_LECHERY) {
            const sg = this.getSuperGame(0.5);
            this.superGames.push(sg);
            bonusGames.push({
                type: sg.supergame_type,
                totalWin: sg.supergame_total_win,
                left: sg.supergame_left,
                total: sg.supergame_total,
                hash: sg.supergame_hash,
                bet: sg.supergame_bet,
            });
        }


        return this.clone({
            status: 'success',
            freeSpins,
            bonusGames,
            custom_message: '',
        });
    }

    /**
     * @param {Object} parameters
     * @returns {Promise<Object>}
     */
    async getReadyBonuses(parameters) {
        return this.clone({status: 'success', bonuses: [], error: null});
    }

    /**
     * @param {string} message
     * @returns {Object}
     */
    getError(message) {
        return {status: 'error', error: {message}};
    }
}


