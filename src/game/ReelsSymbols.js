export class ReelsSymbols {
    constructor(symbols) {
        this.symbols = symbols;
        this.symbolsConfigsByName = {};
        this.symbolsConfigsByID = {};
        this.originalWeights = {}; // Хранение исходных весов
        this.cumulativeWeights = [];
        this.totalWeight = 0;

        symbols.forEach(symbol => {
            this.symbolsConfigsByID[symbol.id] = symbol;
            this.symbolsConfigsByName[symbol.name] = symbol;
            this.originalWeights[symbol.name] = symbol.weight; // Запоминаем оригинальный вес
        });

        this._calculateWeights();
    }

    // Пересчёт накопленных весов
    _calculateWeights() {
        this.cumulativeWeights = [];
        this.totalWeight = 0;

        this.symbols.forEach(symbol => {
            this.totalWeight += symbol.weight;
            this.cumulativeWeights.push(this.totalWeight);
        });
    }

    // Увеличение веса определённого символа
    increaseWeight(symbolName, factor) {
        const symbol = this.symbolsConfigsByName[symbolName];
        if (symbol) {
            symbol.weight *= factor;
            this._calculateWeights();
        }
    }

    // Сброс всех весов к изначальным значениям
    resetWeights() {
        this.symbols.forEach(symbol => {
            symbol.weight = this.originalWeights[symbol.name];
        });
        this._calculateWeights();
    }

    // Получение случайного символа с учетом обновленных весов
    getRandom(onlySymbols = []) {
        const filteredSymbols = onlySymbols.length
            ? this.symbols.filter(symbol => onlySymbols.includes(symbol.name))
            : this.symbols;

        if (!filteredSymbols.length) return null;

        const totalWeight = filteredSymbols.reduce((sum, s) => sum + s.weight, 0);
        const random = Math.random() * totalWeight;
        let accumulatedWeight = 0;

        for (let symbol of filteredSymbols) {
            accumulatedWeight += symbol.weight;
            if (random < accumulatedWeight) {
                return { ...symbol };
            }
        }

        return { ...filteredSymbols[filteredSymbols.length - 1] };
    }

    // Получение следующего символа
    next(onlySymbols = []) {
        let symbol;
        while (!symbol) {
            symbol = this.getRandom(onlySymbols);
        }
        return symbol;
    }

    // Поиск символа по ID
    getByID(id) {
        return this.symbolsConfigsByID[id];
    }

    // Поиск символа по имени
    getByName(name) {
        return this.symbolsConfigsByName[name];
    }

    // Проверка на Wild
    isWild(symbolName) {
        return this.symbolsConfigsByName[symbolName]?.isWild ?? false;
    }

    // Проверка на NotPay
    isNotPay(symbolName) {
        return this.symbolsConfigsByName[symbolName]?.notPay ?? false;
    }

    // Сравнение символов
    compareSymbols(symbol, name) {
        return symbol.id === this.symbolsConfigsByName[name]?.id;
    }

    // Максимальное количество символов на барабанах
    getMaxSymbolsOnReels(id) {
        return this.symbolsConfigsByID[id]?.maxSymbolsOnReels || Infinity;
    }
}
