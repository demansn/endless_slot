export const symbols = [
    {
        name: 'a',
        id: 1,
        size: {width: 1, height: 1},
        weight: 30,
        win: {
            spine: 'symbols',
            animation: 'Victory+Frame',
            skin: 'AJKQ/A'
        }
    },
    {
        name: 'j',
        id: 2,
        size: {width: 1, height: 1},
        weight: 30,
        win: {
            spine: 'symbols',
            animation: 'Victory+Frame',
            skin: 'AJKQ/J'
        }
    },
    {
        name: 'q',
        id: 3,
        size: {width: 1, height: 1},
        weight: 30,
        win: {
            spine: 'symbols',
            animation: 'Victory+Frame',
            skin: 'AJKQ/Q'
        }
    },
    {
        name: 'k',
        id: 4,
        size: {width: 1, height: 1},
        weight: 30,
        win: {
            spine: 'symbols',
            animation: 'Victory+Frame',
            skin: 'AJKQ/K'
        }
    },
    {
        name: 'mask',
        id: 5,
        size: {width: 1, height: 1},
        weight: 1,
        win: {
            spine: 'symbols',
            animation: 'Victory+Frame',
            skin: 'symbols/1'
        }
    },
    {
        name: 'gag',
        id: 6,
        size: {width: 1, height: 1},
        weight: 1,
        win: {
            spine: 'symbols',
            animation: 'Victory+Frame',
            skin: 'symbols/2'
        }
    },
    {
        name: 'handcuffs',
        id: 7,
        size: {width: 1, height: 1},
        weight: 1,
        win: {
            spine: 'symbols',
            animation: 'Victory+Frame',
            skin: 'symbols/3'
        }
    },
    {
        name: 'plug',
        id: 8,
        size: {width: 1, height: 1},
        weight: 1,
        win: {
            spine: 'symbols',
            animation: 'Victory+Frame',
            skin: 'symbols/4'
        }
    },
    {
        name: 'wheel',
        id: 9,
        notPay: true,
        size: {width: 1, height: 1},
        weight: 1,
        skinByType: {
            'lesb': 'girl/roulette',
            'guy': 'guy/roulette',
            'normal': 'hetero/roulette',
        },
        win: {
            spine: 'symbols',
            animation: 'Victory+Frame',
            skin: 'girl/roulette'
        }
    },
    {
        name: 'scatter',
        notPay: true,
        id: 10,
        maxSymbolsOnReels: 3,
        size: {width: 1, height: 1},
        weight: 1,
        skinByType: {
            'lesb': 'girl/scatter',
            'guy': 'guy/scatter',
            'normal': 'hetero/scatter',
        },
        win: {
            spine: 'symbols',
            animation: 'Victory+Frame',
            skin: 'girl/scatter'
        }
    },
    {
        name: 'wild',
        id: 11,
        size: {width: 1, height: 1},
        weight: 0.5,
        notPay: true,
        isWild: true,
        skinByType: {
            'lesb': 'girl/wild',
            'guy': 'guy/wild',
            'normal': 'hetero/wild',
        },
        win: {
            spine: 'symbols',
            animation: 'Victory+Frame',
            skin: 'girl/wild'
        }
    }
];
