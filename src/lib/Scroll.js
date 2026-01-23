import {Container, Graphics} from "pixi.js";

export class Scroll extends Container {
    constructor(content, viewportHeight, scrollBarWidth = 20) {
        super();

        this.content = content; // Внешний контент, которым управляет Scroll
        this.viewportHeight = viewportHeight; // Высота видимой области
        this.scrollBarWidth = scrollBarWidth; // Ширина полосы прокрутки

        this.scrollBar = new ScrollBar(this, viewportHeight, scrollBarWidth);
        this.addChild(this.scrollBar);

        this.scrollPositionY = 0;
        this.updateContentPosition(0);

        this.dragging = false;
        this.content.interactive = true;
        this.content.on('pointerdown', this.onPointerDown.bind(this));
    }

    // Метод для обновления позиции контента
    updateContentPosition(scrollPercent) {
        const maxScrollY = this.content.height - this.viewportHeight;
        this.scrollPositionY = maxScrollY * scrollPercent;
        this.content.position.y = -this.scrollPositionY;
    }

    // Обработка начала перетаскивания контента
    onPointerDown(event) {
        this.dragging = true;
        this.startY = event.data.global.y;
        this.startContentY = this.content.position.y;

        // Подписка на события pointermove и pointerup на контенте
        this.content.on('pointermove', this.onPointerMove, this);
        this.content.on('pointerup', this.onPointerUp, this);
        this.content.on('pointerupoutside', this.onPointerUp, this);
    }

    // Перемещение контента при перетаскивании
    onPointerMove(event) {
        if (!this.dragging) return;

        const deltaY = event.data.global.y - this.startY;
        const newY = this.startContentY + deltaY;

        // Ограничение движения контента в пределах доступной области
        const maxScrollY = 0;
        const minScrollY = -(this.content.height - this.viewportHeight);

        if (newY > maxScrollY) {
            this.content.position.y = maxScrollY;
        } else if (newY < minScrollY) {
            this.content.position.y = minScrollY;
        } else {
            this.content.position.y = newY;
        }

        // Обновление позиции скроллбара
        const scrollPercent = -this.content.position.y / (this.content.height - this.viewportHeight);
        this.scrollBar.updateScrollBar(scrollPercent);
    }

    // Завершение перетаскивания контента
    onPointerUp() {
        this.dragging = false;

        // Удаление подписки на события pointermove и pointerup
        this.content.off('pointermove', this.onPointerMove, this);
        this.content.off('pointerup', this.onPointerUp, this);
        this.content.off('pointerupoutside', this.onPointerUp, this);
    }
}

class ScrollBar extends Container {
    constructor(scrollContainer, viewportHeight, scrollBarWidth) {
        super();

        this.scrollContainer = scrollContainer;
        this.viewportHeight = viewportHeight;
        this.scrollBarWidth = scrollBarWidth;

        this.scrollPercent = 0;

        this.scrollBarBackground = new Graphics();
        this.scrollBarBackground.beginFill(0x46201A);
        this.scrollBarBackground.drawRect(0, 0, this.scrollBarWidth, this.viewportHeight);
        this.scrollBarBackground.endFill();
        this.scrollBarBackground.alpha = 0.4;
        this.addChild(this.scrollBarBackground);

        this.scrollBar = new Graphics();
        this.drawScrollBar();
        this.addChild(this.scrollBar);

        // Включение интерактивности
        this.scrollBar.interactive = true;
        this.scrollBar.buttonMode = true;
        this.scrollBar.on('pointerdown', this.onPointerDown.bind(this));
    }

    drawScrollBar() {
        const scrollBarHeight = (this.viewportHeight * this.viewportHeight) / this.scrollContainer.content.height;
        const scrollBarY = this.scrollPercent * (this.viewportHeight - scrollBarHeight);

        this.scrollBar.clear();
        this.scrollBar.beginFill(0x46201A);
        this.scrollBar.drawRect(0, scrollBarY, this.scrollBarWidth, scrollBarHeight);
        this.scrollBar.endFill();
    }

    onPointerDown(event) {
        this.dragging = true;
        this.startY = event.data.global.y;
        this.startScrollPercent = this.scrollPercent;

        this.scrollBar.on('pointermove', this.onPointerMove, this);
        this.scrollBar.on('pointerup', this.onPointerUp, this);
        this.scrollBar.on('pointerupoutside', this.onPointerUp, this);
    }

    onPointerMove(event) {
        if (!this.dragging) return;

        const deltaY = event.data.global.y - this.startY;
        const maxScrollY = this.viewportHeight - this.scrollBar.height;

        const newScrollPercent = this.startScrollPercent + deltaY / maxScrollY;
        this.scrollPercent = Math.max(0, Math.min(newScrollPercent, 1));

        this.drawScrollBar();
        this.scrollContainer.updateContentPosition(this.scrollPercent);
    }

    onPointerUp() {
        this.dragging = false;

        this.scrollBar.off('pointermove', this.onPointerMove, this);
        this.scrollBar.off('pointerup', this.onPointerUp, this);
        this.scrollBar.off('pointerupoutside', this.onPointerUp, this);
    }

    updateScrollBar(scrollPercent) {
        this.scrollPercent = scrollPercent;
        this.drawScrollBar();
    }
}
