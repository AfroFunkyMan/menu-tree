class PlaceHolderChanger {

    handleElement;
    activePlaceHolder;
    hidePlaceholder;
    coords = {
        leftX: 0,
        leftY: 0,
        rightX: 0,
        rightY: 0
    };

    dragItemCoordsOffset = {
        offsetLeft:0,
        offsetTop: 0
    };

    swapEnd = true;

    cache: any;

    constructor(selector: string) {
        this.handleElement = document.querySelector(selector);
        this.activePlaceHolder= document.getElementById('first-placeholder');
        this.activePlaceHolder.style.display = 'none';
        this.hidePlaceholder = document.getElementById('second-placeholder');
        this.initHandlers();
    }

    onDragStart(event): void {
        this.activePlaceHolder.style.order = '100';
        this.coords = {
            leftX : this.handleElement.offsetLeft,
            leftY : this.handleElement.offsetTop,
            rightX: this.handleElement.offsetLeft + this.handleElement.offsetWidth,
            rightY: this.handleElement.offsetTop + this.handleElement.offsetHeight + 46
        };
        this.dragItemCoordsOffset.offsetLeft = event.clientX - event.target.offsetLeft;
        this.dragItemCoordsOffset.offsetTop = (event.target.offsetHeight / 2) + event.target.offsetTop - event.clientY
    }

    onDragEnd(): void {
        this.activePlaceHolder.style.display = 'none';
    }


    initHandlers(): void {
        document.querySelectorAll('li').forEach(dragElement => {
            dragElement.ondragstart = this.onDragStart.bind(this);
            dragElement.ondragend = this.onDragEnd.bind(this);
        });
        document.ondragover = this.checkDelta.bind(this);
        document.ondragleave = this.checkDelta.bind(this);
        this.activePlaceHolder.addEventListener('animationend', this.onAnimationEnd);
        this.hidePlaceholder.addEventListener('animationend', this.onAnimationEnd);
    }


    checkDelta(event): void {
        if (this.cursorInMe(event.clientX, event.clientY)) {
            this.activePlaceHolder.style.display = 'block';
            this.cursorOverTask(event);
        }
        else {
            this.activePlaceHolder.style.display = 'none';
            this.hidePlaceholder.style.display = 'none';
        }
    }
    cursorInMe(cursorX, cursorY): boolean {
        //const leftXPoint = cursorX - this.dragItemCoordsOffset.offsetLeft;
        const topYPoint = cursorY + this.dragItemCoordsOffset.offsetTop;
        return topYPoint >= this.coords.leftY && topYPoint <= this.coords.rightY
        // return (leftXPoint >= this.coords.leftX && leftXPoint <= this.coords.rightX) &&
        //     (topYPoint >= this.coords.leftY && topYPoint <= this.coords.rightY)
    }

    cursorOverTask(event): void {
        const leftXPoint = 70;
        const topYPoint = event.clientY + this.dragItemCoordsOffset.offsetTop;
        const elem = document.elementFromPoint(leftXPoint, topYPoint);
        if (elem.tagName === 'LI' && !elem.classList.contains('placeholder')) {
            const index = parseInt(elem.getAttribute('data-index'));
            const mustBe = elem.offsetTop + elem.offsetHeight / 2 > topYPoint ? index : index - 1;
            const placeholderIndex = +this.activePlaceHolder.style.order;
            if (placeholderIndex !== mustBe && this.swapEnd === true) {
                this.swapEnd = false;
                this.hidePlaceholder.style.order = mustBe;
                this.hidePlaceholder.classList.remove('placeholder__hiding');
                this.activePlaceHolder.classList.remove('placeholder__showing');
                void this.activePlaceHolder.offsetWidth;
                void this.hidePlaceholder.offsetWidth;
                this.activePlaceHolder.classList.add('placeholder__hiding');
                this.hidePlaceholder.classList.add('placeholder__showing');
                [this.activePlaceHolder, this.hidePlaceholder] = [this.hidePlaceholder, this.activePlaceHolder];
                setTimeout(this.resetSwapEnd.bind(this), 200);
            }
        }
    }

    resetSwapEnd(): void {
        this.swapEnd = true;
    }

    onAnimationEnd(event): void {
        if (event.animationName === 'hiding') {
            event.target.style.display = 'none';
        }
    }


}


const placeHolderChanger = new PlaceHolderChanger('.main');