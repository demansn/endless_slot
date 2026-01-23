/**
 * Класс FrameLayoutConfig хранит настройки компоновки.
 * Можно расширять и добавлять дополнительные параметры по необходимости.
 */
class FrameLayoutConfig {
    constructor({
                    flexDirection = 'row',       // 'row' или 'column'
                    alignItems = 'start',        // 'start' | 'center' | 'end'
                    justifyContent = 'start',    // 'start' | 'center' | 'end' | 'space-between' | 'space-around'
                    wrap = false,                // true или false
                    padding = 0,                 // число или объект { top, right, bottom, left }
                    elementsMargin = 0,          // отступ между элементами,  число или объект { top, right, bottom, left }
                    width = undefined,
                    height = undefined
                } = {}) {
        this.flexDirection = flexDirection;
        this.alignItems = alignItems;
        this.justifyContent = justifyContent;
        this.wrap = wrap;
        this.width = width;
        this.height = height;
        this.elementsMargin = elementsMargin;

        // Допускаем как единое число, так и объект
        if (typeof padding === 'number') {
            this.padding = {
                top: padding,
                right: padding,
                bottom: padding,
                left: padding
            };
        } else {
            // Заполняем отсутствующие поля нулями
            this.padding = Object.assign({ top: 0, right: 0, bottom: 0, left: 0 }, padding);
        }

    }
}

/**
 * Класс FrameLayout выполняет все вычисления по расположению дочерних элементов.
 * Дети должны предоставлять свойства width, height, x, y.
 */
class FrameLayout {
    constructor(config = {}) {
        this.config = new FrameLayoutConfig(config);
    }

    /**
     * Главный метод: рассчитывает и обновляет позицию всех элементов.
     * @param {Array} children - список дочерних элементов с параметрами: width, height, x, y.
     * @param {Number} [containerWidth] - фиксированная ширина контейнера (если задана).
     * @param {Number} [containerHeight] - фиксированная высота контейнера (если задана).
     * @returns {{width: Number, height: Number}} - итоговые размеры контейнера после раскладки.
     */
    applyLayout(children, containerWidth = this.config.width, containerHeight = this.config.height) {
        // Сначала определим, какова теоретическая ширина/высота всего содержимого (без wrap).
        const { contentWidth, contentHeight } = this.calculateLayout(children);

        // Если контейнеру не заданы фиксированные размеры, то принимаем вычисленные.
        let finalWidth = (typeof containerWidth === 'number') ? containerWidth : contentWidth;
        let finalHeight = (typeof containerHeight === 'number') ? containerHeight : contentHeight;

        // Рассчитываем стартовые смещения для элементов (зависит от justifyContent).
        const offsetData = this.calculateOffsets(children, finalWidth, finalHeight);

        // Располагаем детей с учётом wrap (если задан), паддингов, маргинов и рассчитанных смещений.
        this.positionChildren(children, offsetData, finalWidth, finalHeight);

        // Возвращаем итоговые размеры (полезно, если контейнер сам подстраивается под содержимое).
        return {
            width: finalWidth,
            height: finalHeight
        };
    }

    /**
     * Вычисляет суммарную ширину/высоту (contentWidth / contentHeight),
     * исходя из настроек direction и размеров детей.
     * Не учитывает wrap, так как wrap будет обрабатываться при позиционировании.
     */
    calculateLayout(children) {
        const { flexDirection, padding } = this.config;

        // Суммарный размер по главной оси
        let mainAxisSize = 0;
        // Максимальный размер по поперечной оси (в случае row это высота, в случае column — ширина)
        let crossAxisMaxSize = 0;

        const margin = this.normalizeMargin(this.config.elementsMargin);

        children.forEach(child => {
            const w = child.width;
            const h = child.height;

            if (flexDirection === 'row') {
                mainAxisSize += w + margin.left + margin.right;
                crossAxisMaxSize = Math.max(crossAxisMaxSize, h + margin.top + margin.bottom);
            } else {
                mainAxisSize += h + margin.top + margin.bottom;
                crossAxisMaxSize = Math.max(crossAxisMaxSize, w + margin.left + margin.right);
            }
        });

        // Добавляем padding с обеих сторон
        if (flexDirection === 'row') {
            mainAxisSize += padding.left + padding.right;
            crossAxisMaxSize += padding.top + padding.bottom;
            return {
                contentWidth: mainAxisSize,
                contentHeight: crossAxisMaxSize
            };
        } else {
            mainAxisSize += (padding.top + padding.bottom);
            crossAxisMaxSize += (padding.left + padding.right);
            return {
                contentWidth: crossAxisMaxSize,
                contentHeight: mainAxisSize
            };
        }
    }

    /**
     * Рассчитывает стартовые смещения (offsetX, offsetY) в зависимости от justifyContent.
     * Для простоты этот метод не учитывает wrap. wrap будет обрабатываться внутри positionChildren.
     */
    calculateOffsets(children, containerWidth, containerHeight) {
        const { justifyContent, flexDirection, padding } = this.config;
        let totalSize = 0;
        const margin = this.normalizeMargin(this.config.elementsMargin);

        children.forEach(child => {
            if (flexDirection === 'row') {
                totalSize += child.width + margin.left + margin.right;
            } else {
                totalSize += child.height + margin.top + margin.bottom;
            }
        });

        let space = 0;
        let remainingSpace = 0;

        if (flexDirection === 'row') {
            remainingSpace = containerWidth - padding.left - padding.right - totalSize;
        } else {
            remainingSpace = containerHeight - padding.top - padding.bottom - totalSize;
        }

        // Если оставшегося места меньше 0, значит элементы не помещаются.
        // При wrap=false это приведёт к частичному выходу за границы.
        // При wrap=true мы решаем в другом методе (positionChildren).
        if (remainingSpace < 0) {
            remainingSpace = 0;
        }

        let offsetMain = 0; // начальное смещение по главной оси
        let gap = 0;        // равномерное расстояние между элементами (для space-between / space-around)

        switch (justifyContent) {
            case 'start':
                offsetMain = 0;
                break;
            case 'center':
                offsetMain = remainingSpace / 2;
                break;
            case 'end':
                offsetMain = remainingSpace;
                break;
            case 'space-between':
                gap = children.length > 1 ? (remainingSpace + margin.left + margin.right) / (children.length - 1) : 0;
                break;
            case 'space-around':
                gap = children.length > 0 ? (remainingSpace + margin.left + margin.right) / children.length : 0;
                break;
            default:
                offsetMain = 0;
                break;
        }

        return {
            offsetMain,
            gap
        };
    }

    /**
     * Расставляет элементы в контейнере с учётом:
     * - wrap
     * - padding
     * - margin
     * - offsetMain и gap
     * - направлений (row / column)
     */
    positionChildren(children, offsetData, containerWidth, containerHeight) {
        const { flexDirection, padding, wrap, width, height } = this.config;
        let { offsetMain, gap } = offsetData;

        // Текущие координаты внутри контейнера
        let currentX = padding.left;
        let currentY = padding.top;

        // Для режима wrap нам нужно следить за строками / колонками
        let lineSize = 0;   // размер по главной оси для текущей линии
        let crossSize = 0;  // максимальный размер по поперечной оси для текущей линии

        // Начальное смещение c учётом offsetMain (justifyContent)
        if (flexDirection === 'row') {
            currentX += offsetMain;
        } else {
            currentY += offsetMain;
        }

        const margin = this.normalizeMargin(this.config.elementsMargin);
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const w = child.width;
            const h = child.height;

            if (flexDirection === 'row') {
                // Проверяем wrap (если элемент не помещается в текущую строку)
                if (wrap && (currentX + w + margin.left + margin.right + padding.right > containerWidth)) {
                    // переносим на новую строку
                    currentX = padding.left + offsetMain;
                    currentY += (crossSize);
                    crossSize = 0;
                    lineSize = 0;
                }

                // Устанавливаем позицию: сначала прибавляем margin
                const childX = currentX + margin.left;
                const childY = currentY + margin.top;

                // Ставим ребёнка
                child.x = childX;
                child.y = childY;

                currentX += w + margin.left + margin.right;
                lineSize += w + margin.left + margin.right;
                if (gap && i < children.length - 1) {
                    currentX += gap; // Добавляем промежуток
                }

                // высота строки
                const totalHeight = h + margin.top + margin.bottom;
                crossSize = Math.max(crossSize, totalHeight);
            } else {
                // column
                if (wrap && (currentY + h + margin.top + margin.bottom + padding.bottom > containerHeight)) {
                    // переносим на новую "колонку"
                    currentY = padding.top + offsetMain;
                    currentX += (crossSize);
                    crossSize = 0;
                    lineSize = 0;
                }

                // Устанавливаем позицию
                const childX = currentX + margin.left;
                const childY = currentY + margin.top;

                child.x = childX;
                child.y = childY;

                // Подготавливаемся к следующему
                lineSize = h + margin.top + margin.bottom;
                currentY += lineSize;
                if (gap && i < children.length - 1) {
                    currentY += gap;
                }

                // ширина колонки
                const totalWidth = w + margin.left + margin.right;
                crossSize = Math.max(crossSize, totalWidth);
            }
        }

        this.alignByCrossAxis(children, containerWidth, containerHeight);
    }

    /**
     * Выравниваем элементы по поперечной оси (alignItems).
     */
    alignByCrossAxis(children, containerWidth, containerHeight) {
        const { flexDirection, alignItems, padding } = this.config;

        if (alignItems === 'start') {
            return;
        }

        children.forEach(child => {
            const { x, y } = child;
            const w = child.width;
            const h = child.height;
            const margin = this.normalizeMargin(this.config.elementsMargin);

            if (flexDirection === 'row') {
                const availableHeight = containerHeight - padding.top - padding.bottom;
                if (alignItems === 'center') {
                    // Fixed: Include margin in centering calculation
                    const totalHeight = h + margin.top + margin.bottom;
                    const centerOffset = (availableHeight - totalHeight) / 2;
                    child.y = padding.top + centerOffset + margin.top;
                    child.x = x;
                } else if (alignItems === 'end') {
                    child.y = containerHeight - padding.bottom - h - margin.bottom;
                    child.x = x;
                }
            } else {
                const availableWidth = containerWidth - padding.left - padding.right;
                if (alignItems === 'center') {
                    // Fixed: Include margin in centering calculation
                    const totalWidth = w + margin.left + margin.right;
                    const centerOffset = (availableWidth - totalWidth) / 2;
                    child.x = padding.left + centerOffset + margin.left;
                    child.y = y;
                } else if (alignItems === 'end') {
                    child.x = containerWidth - padding.right - w - margin.right;
                    child.y = y;
                }
            }
        });
    }

    /**
     * Утилита: превращает margin (число или объект) в объект { top, right, bottom, left }.
     */
    normalizeMargin(margin) {
        if (!margin) {
            return { top: 0, right: 0, bottom: 0, left: 0 };
        }
        if (typeof margin === 'number') {
            return { top: margin, right: margin, bottom: margin, left: margin };
        }

        if (Array.isArray(margin)) {
            return { top: margin[0], right: margin[1], bottom: margin[2], left: margin[3] };
        }

        return Object.assign({ top: 0, right: 0, bottom: 0, left: 0 }, margin);
    }
}

export { FrameLayout, FrameLayoutConfig };
