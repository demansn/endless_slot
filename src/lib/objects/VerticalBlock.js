import {SuperContainer} from "./SuperContainer.js";

/**
 * Класс VerticalBlock, наследующий SuperContainer, используется для вертикального расположения дочерних элементов
 * с поддержкой выравнивания и промежутков между ними.
 */
export class VerticalBlock extends SuperContainer {
    /**
     * @param {Object} options - Опции для настройки VerticalBlock.
     * @param {number|null} [options.blockWidth=null] - Ширина блока. Если не задана, вычисляется автоматически.
     * @param {number|null} [options.blockHeight=null] - Высота блока. Если не задана, вычисляется автоматически.
     * @param {string} [options.horizontalAlign="left"] - Выравнивание по горизонтали: "left", "center", "right".
     * @param {string} [options.verticalAlign="top"] - Выравнивание по вертикали: "top", "middle", "bottom".
     * @param {number} [options.gap=0] - Расстояние между дочерними элементами.
     */
    constructor({ blockWidth, blockHeight, horizontalAlign = "left", verticalAlign = "top", gap = 0, items = []} = {}) {
        super();
        /**
         * Ширина блока. Если не задана, вычисляется автоматически.
         * @type {number|null}
         */
        this.blockWidth = blockWidth;

        /**
         * Высота блока. Если не задана, вычисляется автоматически.
         * @type {number|null}
         */
        this.blockHeight = blockHeight;

        /**
         * Выравнивание по горизонтали: "left", "center", "right".
         * @type {string}
         */
        this.horizontalAlign = horizontalAlign;

        /**
         * Выравнивание по вертикали: "top", "middle", "bottom".
         * @type {string}
         */
        this.verticalAlign = verticalAlign;

        /**
         * Расстояние между дочерними элементами.
         * @type {number}
         */
        this.gap = gap;

        /**
         * Вычисленная ширина содержимого контейнера.
         * @type {number}
         */
        this.calculatedWidth = 0;

        /**
         * Вычисленная высота содержимого контейнера.
         * @type {number}
         */
        this.calculatedHeight = 0;

        items.forEach(item => {
            if (typeof item === 'string') {
                this.addObject(item);
            } else {
                this.addChild(item);
            }
        });
        this.layout();
    }

    /**
     * Располагает дочерние элементы в столбец с учётом выравнивания и промежутков.
     */
    layout() {
        let totalHeight = 0;
        let maxWidth = 0;

        this.children.forEach((child, index) => {
            totalHeight += child.height;
            if (index > 0) totalHeight += this.gap;
            if (child.width > maxWidth) maxWidth = child.width;
        });

        const calculatedBlockWidth = this.blockWidth || maxWidth;
        const calculatedBlockHeight = this.blockHeight || totalHeight;

        let currentY = 0;

        if (calculatedBlockHeight) {
            if (this.verticalAlign === "middle") {
                currentY = (calculatedBlockHeight - totalHeight) / 2;
            } else if (this.verticalAlign === "bottom") {
                currentY = calculatedBlockHeight - totalHeight;
            }
        }

        this.children.forEach(child => {
            let xOffset = 0;

            if (calculatedBlockWidth) {
                if (this.horizontalAlign === "center") {
                    xOffset = (calculatedBlockWidth - child.width) / 2;
                } else if (this.horizontalAlign === "right") {
                    xOffset = calculatedBlockWidth - child.width;
                }
            }

            child.x = xOffset;
            child.y = currentY;

            currentY += child.height + this.gap;
        });

        this.calculatedWidth = maxWidth;
        this.calculatedHeight = totalHeight;
    }

    /**
     * Добавляет дочерний элемент и перезапускает выравнивание.
     * @param {Object} child - Дочерний объект.
     */
    addChild(child) {
        super.addChild(child);
        this.layout();
    }

    addObject(name, parameters = {}, props = {}) {
        return super.addObject(name, parameters, props);
        this.layout();
    }

    /**
     * Удаляет дочерний элемент и перезапускает выравнивание.
     * @param {Object} child - Дочерний объект.
     */
    removeChild(child) {
        super.removeChild(child);
        this.layout();
    }
}
