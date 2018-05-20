class PlaceHolderChanger {
    constructor(selector) {
        this.coords = {
            leftX: 0,
            leftY: 0,
            rightX: 0,
            rightY: 0
        };
        this.dragItemCoordsOffset = {
            offsetLeft: 0,
            offsetTop: 0
        };
        this.handleElement = document.querySelector(selector);
        const placeholder = document.createElement('LI');
        placeholder.className = 'placeholder';
        placeholder.setAttribute('id', 'placeholder');
        this.handleElement.appendChild(placeholder);
        this.placeholder = document.getElementById('placeholder');
        this.placeholder.animated = false;
        this.initHandlers();
    }
    onDragStart(event) {
        this.placeholder.style.order = '10000';
        this.coords = {
            leftX: this.handleElement.offsetLeft,
            leftY: this.handleElement.offsetTop,
            rightX: this.handleElement.offsetLeft + this.handleElement.offsetWidth,
            rightY: this.handleElement.offsetTop + this.handleElement.offsetHeight + 46
        };
        this.dragItemCoordsOffset.offsetLeft = event.clientX - event.target.offsetLeft;
        this.dragItemCoordsOffset.offsetTop = (event.target.offsetHeight / 2) + event.target.offsetTop - event.clientY;
    }
    onDragEnd() {
        this.placeholder.style.display = 'none';
    }
    initHandlers() {
        this.handleElement.querySelectorAll('li').forEach(dragElement => {
            if (dragElement.className !== 'placeholder')
                dragElement.setAttribute('draggable', 'true');
            dragElement.ondragstart = this.onDragStart.bind(this);
            dragElement.ondragend = this.onDragEnd.bind(this);
        });
        document.ondragover = this.checkDelta.bind(this);
    }
    checkDelta(event) {
        if (this.cursorInMe(event.clientX, event.clientY)) {
            this.placeholder.style.display = 'block';
            this.cursorOverTask(event);
        }
        else {
            if (this.placeholder.style === 'block')
                this.placeholder.style.display = 'none';
        }
    }
    cursorInMe(cursorX, cursorY) {
        const topYPoint = cursorY + this.dragItemCoordsOffset.offsetTop;
        return topYPoint >= this.coords.leftY && topYPoint <= this.coords.rightY;
    }
    cursorOverTask(event) {
        const leftXPoint = 70;
        const topYPoint = event.clientY + this.dragItemCoordsOffset.offsetTop;
        const topElement = document.elementFromPoint(leftXPoint, topYPoint - 50);
        const bottomElement = document.elementFromPoint(leftXPoint, topYPoint + 50);
        if (topElement.hasAttribute('draggable') && bottomElement.hasAttribute('draggable')) {
            const newOrder = topElement.getAttribute('data-index');
            return this.animate(newOrder);
        }
        if (topElement.className === 'placeholder' && bottomElement.hasAttribute('draggable')) {
            const newOrder = (parseInt(bottomElement.getAttribute('data-index')) - 1).toString();
            return this.animate(newOrder);
        }
        if (topElement.hasAttribute('draggable') && bottomElement.className === 'placeholder') {
            const newOrder = topElement.getAttribute('data-index');
            return this.animate(newOrder);
        }
        if (topElement.tagName === 'UL' && bottomElement.hasAttribute('draggable')) {
            return this.animate("1");
        }
        if (topElement.hasAttribute('draggable') && bottomElement.tagName === 'UL') {
            return this.animate("10000");
        }
    }
    animate(newOrder) {
        if (this.placeholder.animated !== false)
            return null;
        const prevRect = this.placeholder.getBoundingClientRect();
        this.placeholder.style.order = newOrder;
        const newRect = this.placeholder.getBoundingClientRect();
        this.placeholder.style.transition = 'none';
        this.placeholder.style.transform = 'translate3d('
            + (prevRect.left - newRect.left) + 'px,'
            + (prevRect.top - newRect.top) + 'px,0)';
        const forRepaintDummy = this.placeholder.offsetWidth; // repaint
        this.placeholder.style.transition = 'all 150ms';
        this.placeholder.style.transform = 'translate3d(0,0,0)';
        clearTimeout(this.placeholder.animated);
        this.placeholder.animated = setTimeout(this.resetAnimationStyles.bind(this), 150);
    }
    resetAnimationStyles() {
        this.placeholder.style.transition = '';
        this.placeholder.style.transform = '';
        this.placeholder.animated = false;
    }
}
const placeHolderChanger = new PlaceHolderChanger('.main');
//# sourceMappingURL=main.js.map