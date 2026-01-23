import {Container} from "pixi.js";
import * as PIXI from "pixi.js";
import gsap from "gsap";
import {ReelSymbol} from "./slotSymbol/ReelSymbol";
import {services} from "../ServiceLocator";
import {SuperContainer} from "../lib/objects/SuperContainer";

export class Reel extends SuperContainer {
    constructor(data) {
        super();

        this.column = data.index;
        this.reelsSymbols = data.reelsSymbols;
        this.symbolHeight = data.symbolHeight;
        this.symbolWidth = data.symbolWidth;
        this.reelHeight = data.reelHeight;
        this.reelWidth = data.reelWidth;
        this.rows = data.rows;
        this.symbols = [];
        this.speed = 0;
        this.targetSpeed = 4000;
        this.blur = new PIXI.filters.BlurFilter();
        this.reelStep = 0;
        this.pullSymbolsByName = {};

        for (let row = this.rows - 1; row >=0; row-= 1) {
            this.createNextSymbol(row);
        }
    }

    startSpin(onlySymbols = []) {
        this.onlySymbols = onlySymbols;
        this.blur.blurX = 0;
        this.blur.blurY = 0;
        this.filters = [this.blur];

        gsap.killTweensOf(this);

        const timeline = gsap.timeline();

        this.symbols.forEach(symbol =>{
            if (this.symbolInBlocked(symbol)) {
                symbol.parentLayer = services.layers.symbolsAnimationLayer;
                symbol.playFrame();
            } else {
                symbol.gotToIdle();
            }
        });

        timeline.to(this, {
            speed: this.targetSpeed,
            duration: 0.5,
            ease: 'power2.inOut'
        });

        return timeline;
    }

    stop(matrix, force = false) {
        if  (force) {
            gsap.killTweensOf(this);
            this.speed = 0;
            this.reelStep = 0;
            this.filters = [];
            this.replaceSymbols(matrix);
            this.children.forEach(symbol => symbol.gotToIdle());
            return;
        }

        const timeline = gsap.timeline();

        timeline.call(() => {
            gsap.killTweensOf(this);
            this.filters = [];
            this.speed = 0;

            this.replaceSymbols(matrix);
            this.children.forEach(symbol => symbol.gotToIdle());
        });

        return timeline;
    }

    goToIdle() {
        this.children.forEach(symbol => {
            gsap.killTweensOf(symbol);
            if (this.symbolInBlocked(symbol)) {
                symbol.parentLayer = services.layers.symbolsAnimationLayer;
            } else {
                symbol.gotToIdle();
            }
        });
    }

    update(dt) {
        this.moveSymbols(dt);
    }

    moveSymbols(dt) {
        if (this.speed === 0) {
            return;
        }

        const symbolsToRemove = [];
        const step = dt * this.speed;
        this.blur.blurY = this.speed / 3000 * 10;
        this.reelStep += step;

        this.children.forEach(symbol => {
            if (this.symbolInBlocked(symbol)) {
                return;
            }

            symbol.y += step;

            if ((symbol.getTopBounds()) > this.reelHeight) {
                symbolsToRemove.push(symbol);
            }
        });

        symbolsToRemove.forEach(symbol => {
            this.removeSymbol(symbol);
        });

        if (this.reelStep > this.symbolHeight) {
            this.reelStep = 0;

            this.createNextSymbol(-1);
        }
    }

    createNextSymbol(row) {
        const symbolData = this.reelsSymbols.next(this.onlySymbols);

        this.addNewSymbol(symbolData, row);
    }

    addSymbol(symbol) {
        this.addChild(symbol);
        this.symbols.push(symbol);
    }

    createSymbol(data, row) {
        const pullObjects = this.pullSymbolsByName[data.name] || [];
        const symbol = pullObjects.length ? pullObjects.shift() : new ReelSymbol(data, this);

        symbol.gotToIdle();
        symbol.y = row * this.symbolHeight;

        return symbol;
    }

    addNewSymbol(data, row) {
        const symbol = this.createSymbol(data, row);

        this.addSymbol(symbol);

        return symbol;
    }

    removeSymbol(symbol) {
        if (!this.pullSymbolsByName[symbol.name]) {
            this.pullSymbolsByName[symbol.name] = [];
        }
        symbol.gotToIdle();
        this.removeChild(symbol);
        this.symbols = this.symbols.filter(s => s !== symbol);
        this.pullSymbolsByName[symbol.name].push(symbol);
    }

    replaceSymbols(matrix, onlyNewSymbols = false) {
        const symbolsToRemove = [...this.children];

        symbolsToRemove.forEach(symbol => {
            this.removeSymbol(symbol);
        });

        matrix.forEachColumn(this.column, (row, column, symbol) => {
            if (symbol) {
                this.addNewSymbol(symbol, row);
            }
        });
    }


    blockSymbols(symbolsPositions) {
        this.blockedSymbolsPositions = symbolsPositions;

        this.children.forEach(symbol => {
            symbol.parentLayer = null;

            if (this.symbolInBlocked(symbol)) {
                symbol.parentLayer = services.layers.symbolsAnimationLayer;
            }
        });
    }

    symbolInBlocked(symbol) {
        return this.blockedSymbolsPositions && this.blockedSymbolsPositions.some(position => this.isSymbolInPosition(symbol, position));
    }

    unblockSymbols() {
        this.blockedSymbolsPositions = null;

        this.children.forEach(symbol => {
            symbol.gotToIdle();
            symbol.parentLayer = null;
        });
    }

    getSymbolByRow(row) {
        return this.children.find(symbol => symbol.y === row * this.symbolHeight);
    }

    isSymbolInPosition(symbol, position) {
        return this.getSymbolByRow(position.row) === symbol;
    }

    moveSymbolsDown(symbolsToMove) {
        const timeline = gsap.timeline();
        const timelines = [];

        for (let i = 0; i < symbolsToMove.length; i++) {
            const {distance, position, destinationPosition} = symbolsToMove[i];
            const symbol = this.getSymbolByRow(position.row);

            if (!symbol) {
                console.log("Symbol not found (for move) row =" + position.row + " column=" + position.column);
                continue;
            }

            const distanceBySymbol = distance * this.symbolHeight;
            const durationByDistance = Math.abs(distanceBySymbol / this.symbolHeight * 0.05);

            timelines.push(gsap.timeline().to(symbol, {y: `+=${distanceBySymbol}`, duration: durationByDistance}));
        }

        timeline.add(timelines);

        return timelines;
    }

    getRandomSymbol() {
        return this.children[Math.floor(Math.random() * this.children.length)];
    }
}
