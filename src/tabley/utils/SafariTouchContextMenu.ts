const diff = 500;
export default class SafariTouchContextMenu {

    ref = null as any;
    constructor(fn: any) {



        this.ref = setTimeout(fn, diff);
    }

    end = () => {
        clearTimeout(this.ref)
    }
}
/*

For safari

*/