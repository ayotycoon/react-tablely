const diff = 700;
export default class SafariTouchContextMenu {
    fn: any;
    id = 999999;
    start = 999;
    constructor(fn: any, id: any) {
        this.fn = fn;
        this.id = id;
        this.start = Number(new Date());
    }

    end = (id: any) => {
        if (id == this.id && (Number(new Date()) - this.start) >= diff) {
            this.fn()
        }
    }
}