class PlaceHolderChanger {

    handleElement;
    placeholder;
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
        this.placeholder= document.getElementById('placeholder');
        this.placeholder.style.display = 'none';
        this.initHandlers();
    }

    onDragStart(event): void {
        this.placeholder.style.order = '10000';
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
        this.placeholder.style.display = 'none';
    }


    initHandlers(): void {
        document.querySelectorAll('li').forEach(dragElement => {
            dragElement.ondragstart = this.onDragStart.bind(this);
            dragElement.ondragend = this.onDragEnd.bind(this);
        });
        document.ondragover = this.checkDelta.bind(this);
        document.ondragleave = this.checkDelta.bind(this);
    }


    checkDelta(event): void {
        if (this.cursorInMe(event.clientX, event.clientY)) {
            this.placeholder.style.display = 'block';
            this.cursorOverTask(event);
        }
        else {
            if (this.placeholder.style === 'block') this.placeholder.style.display = 'none';
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
        const leftXPoint = 500;
        const topYPoint = event.clientY + this.dragItemCoordsOffset.offsetTop;
        const elem = document.elementFromPoint(leftXPoint, topYPoint);
        if (elem.tagName === 'LI' && !elem.classList.contains('placeholder')) {
            console.log('li');
            const index = parseInt(elem.getAttribute('data-index'));
            const mustBe = elem.offsetTop + elem.offsetHeight / 2 > topYPoint ? index : index - 1;
            const placeholderIndex = +this.placeholder.style.order;
            if (placeholderIndex !== mustBe && this.swapEnd === true) {
                this.swapEnd = false;
                const prevRect = this.placeholder.getBoundingClientRect();
                this.placeholder.style.order = mustBe;
                const newRect = this.placeholder.getBoundingClientRect();

                this.placeholder.style.transition = 'none';
                this.placeholder.style.transform = 'translate3d('
                    + (prevRect.left - newRect.left) + 'px,'
                    + (prevRect.top - newRect.top) + 'px,0)';

                const forRepaintDummy = this.placeholder.offsetWidth; // repaint

                this.placeholder.style.transition = 'all .4s';
                this.placeholder.style.transform = 'translate3d(0,0,0)';

                clearTimeout(this.placeholder.animated);
                this.placeholder.animated = setTimeout(this.resetAnimationStyles.bind(this), 400);
                setTimeout(this.resetSwapEnd.bind(this), 400);
            }
        }
    }

    resetAnimationStyles(): void {
        this.placeholder.style.transition = 'all 1s';
        this.placeholder.style.transform = 'translate3d(0,0,0)';
        this.placeholder.animated = false;
    }

    resetSwapEnd(): void {
        this.swapEnd = true;
    }

}


const placeHolderChanger = new PlaceHolderChanger('.main');