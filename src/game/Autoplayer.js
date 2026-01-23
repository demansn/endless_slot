export default class Autoplayer {
    _gameLimit = null;
    _winLimit = null;
    _lossLimit = null;
    isSpinning = false;
    _gameCount = null;
    _winnings = null;
    _losses = null;

    start(gameLimit, winLimit, lossLimit) {
        this._gameLimit = gameLimit;
        this._winLimit = winLimit;
        this._lossLimit = lossLimit;

        this._gameCount = 0;
        this._winnings = 0;
        this._losses = 0;

        this.isSpinning = true;
    }

    next(win, loss, gameCount = 1) {
        this._winnings += win;
        this._losses += loss;
        this._gameCount += gameCount;

        this.isSpinning = !(this._winLimit != 0 && this._winnings >= this._winLimit
            || this._lossLimit != 0 && this._losses >= this._lossLimit
            || this._gameLimit != 0 && this._gameCount >= this._gameLimit);
    }

    progress() {
        return this._gameCount / this._gameLimit;
    }

    stop() {
        this.isSpinning = false;
    }
}
