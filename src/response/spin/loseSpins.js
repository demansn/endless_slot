/// symbols
// pear, grape, apple, banana, shop, truck, juicer, freespin, scatter, wild

export const response = {
    "status": "success",
    "bet": 0.5,
    "demo": 0,
    "bigwin": 0,
    "jackpot": 0,
    "ultrawin": 0,
    "megawin": 0,
    "custom_message": "",
    "before_balance": 10000,
    "after_balance": 10000,
    "spin": [{
        "spin_elements": [
            ["pear", "apple", "shop", "apple", "wild"],
            ["grape", "apple", "apple", "apple", "apple"],
            ["banana", "apple", "truck", "apple", "apple"],
            ["freespin", "apple", "apple", "apple", "scatter"],
            ["pear", "apple", "apple", "juicer", "apple"],
            ["juicer", "apple", "apple", "apple", "apple"],
        ],
        "spin_win": 0,
        "spin_multi": 0,
        "paylines": []
    }],
    "freespin": {
        "freespin": 0, "freespin_total": 0, "freespin_hash": 0, "freespin_bet_level": 0
    },
    "supergame": {},
    "total_win": 0,
    "total_multi": 0
};

export const response1 = {
    "status": "success",
    "bet": 0.5,
    "demo": 0,
    "bigwin": 0,
    "jackpot": 0,
    "ultrawin": 0,
    "megawin": 0,
    "custom_message": "",
    "before_balance": 10000,
    "after_balance": 10000,
    "spin": [{
        "spin_elements": [
            ["juicer", "banana", "shop", "freespin", "banana"],
            ["grape", "pear", "truck", "truck", "grape"],
            ["juicer", "pear", "grape", "apple", "grape"],
            ["apple", "banana", "apple", "apple", "freespin"],
            ["freespin", "pear", "grape", "juicer", "apple"],
            ["grape", "banana", "wild", "freespin", "banana"],
        ],
        "spin_win": 0,
        "spin_multi": 0,
        "paylines": []
    }],
    "freespin": {
        "freespin": 0, "freespin_total": 0, "freespin_hash": 0, "freespin_bet_level": 0
    },
    "supergame": {},
    "total_win": 0,
    "total_multi": 0
}


export const response3 = {
    "status": "success",
    "bet": 0.5,
    "demo": 0,
    "bigwin": 0,
    "jackpot": 0,
    "ultrawin": 0,
    "megawin": 0,
    "custom_message": "",
    "before_balance": 10000,
    "after_balance": 10000,
    "spin": [{
        "spin_elements": [
            ["pear", "shop", "shop", "apple", "wild"],
            ["grape", "banana", "freespin", "apple", "grape"],
            ["banana", "apple", "truck", "grape", "banana"],
            ["shop", "apple", "apple", "apple", "juicer"],
            ["pear", "apple", "grape", "banana", "juicer"],
            ["juicer", "banana", "shop", "freespin", "apple"],
        ],
        "spin_win": 0,
        "spin_multi": 0,
        "paylines": []
    }],
    "freespin": {
        "freespin": 0, "freespin_total": 0, "freespin_hash": 0, "freespin_bet_level": 0
    },
    "supergame": {},
    "total_win": 0,
    "total_multi": 0
}

export const LoseSpins = [response, response1, response3];
