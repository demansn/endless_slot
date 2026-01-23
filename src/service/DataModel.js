import {Service} from "./Service";
import * as PIXI from "pixi.js";

export class DataModel extends Service {
    emitter = new PIXI.utils.EventEmitter();
    data = {};

    async init({data, dontSaveKeys = []}) {
        this.dontSaveKeys = dontSaveKeys;
        Object.keys(data).forEach(key => {
            this.addSetter(key);
        });

        this.v = 2;

        for (const key in data) {
            this.data[key] = data[key];
        }

        this.loadFromLocalStorage();
        this.onChangeAny(this.saveToLocalStorage, this);
    }

    saveToLocalStorage() {
        const savedData = {};

        for (const key in this.data) {
            if (!this.dontSaveKeys.includes(key)) {
                savedData[key] = this.data[key];
            }
        }

        localStorage.setItem(this.dataKey, JSON.stringify(savedData));
    }

    get dataKey() {
        return 'data' + this.v;
    }

    loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem(this.dataKey));

        if (data) {
            this.setData(data);
        }
    }

    /**
     * Sets multiple data fields at once, creating setters if needed.
     * @param {Object} data
     * @returns {string[]} List of changed keys
     */
    setData(data) {
        const changedKeys = [];
        for (const key in data) {
            if (!Object.prototype.hasOwnProperty.call(this.data, key)) {
                this.addSetter(key);
            }
            if (this[key] !== data[key]) {
                this[key] = data[key];
                changedKeys.push(key);
            }
        }
        return changedKeys;
    }

    getData() {
        return this.data;
    }

    /**
     * @param {string} key - Ключ
     * @param {function} callback
     * @param {Object} [context]
     */
    on(key, callback, context) {
        this.emitter.on(key, callback, context);
    }

    onChangeAny(callback, context) {
        this.emitter.on('any', callback, context);
    }

    /**
     * @param {string} key
     * @param {function} callback
     * @param {Object} [context]
     */
    off(key, callback, context) {
        this.emitter.off(key, callback, context);
    }

    addSetter(key, callback) {
        if (!this.data.hasOwnProperty(key)) {
            this.data[key] = undefined;
        }

        Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get: () => this.data[key],
            set: (value) => {
                const oldValue = this.data[key];

                if (oldValue !== value) {
                    this.data[key] = value;
                    this.onChangeValue(key, value, oldValue);
                }
            },
        });
    }

    onChangeValue(key, newValue, oldValue) {
        this.emitter.emit(key, newValue, oldValue);
        this.emitter.emit('any', key, newValue, oldValue);
    }

    /**
     * Batch update for multiple keys with a single event emission.
     * @param {Object} data
     * @returns {string[]} List of changed keys
     */
    batchUpdate(data) {
        const changedKeys = [];
        const oldValues = {};
        for (const key in data) {
            if (!Object.prototype.hasOwnProperty.call(this.data, key)) {
                this.addSetter(key);
            }
            if (this[key] !== data[key]) {
                oldValues[key] = this[key];
                this.data[key] = data[key];
                changedKeys.push(key);
            }
        }
        if (changedKeys.length) {
            this.emitter.emit('batch', changedKeys, data, oldValues);
            this.emitter.emit('any', 'batch', changedKeys, data, oldValues);
        }
        return changedKeys;
    }

    /**
     * Resets the store to its initial state.
     * @param {Object} [newInitial] - Optional new initial state
     */
    reset(newInitial) {
        const initial = newInitial || this._initialData || {};
        // Удаляем все ключи кроме служебных
        Object.keys(this.data).forEach(key => {
            delete this[key];
            delete this.data[key];
        });
        Object.keys(initial).forEach(key => {
            this.addSetter(key);
            this[key] = initial[key];
        });
        this.emitter.emit('reset', this.getData());
        this.emitter.emit('any', 'reset', this.getData());
    }

    /**
     * Сохраняет исходное состояние для reset
     * @private
     */
    _setInitialData(data) {
        this._initialData = JSON.parse(JSON.stringify(data));
    }
}
