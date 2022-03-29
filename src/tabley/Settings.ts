import { DataColOption, DataRowOption } from "./interfaces/DataOptionI.interface";

export default {
    selectedCellColor: "#1A73E8",
    selectedRowOrColumnBackgroundColor: "rgba(231, 239, 253, 1)",
    selectedRowOrColumnBorderColor: "1px solid rgba(30, 109, 232, 1)",
    firstColumnBackground: "rgba(248, 249, 250, 1)",
    firstRowBackground: "rgba(232, 234, 237, 1)",

    borderColorAtEdges: "1px solid rgba(188,188,188, 1)",
    borderColorAtMiddle: "1px solid rgba(188,188,188, 0.5)",

    defaultHeight: 24,
    defaultWidth: 60,
    defaultColColor: "white",
    debug: false,



    stateCount:0,
    defaultSheetState: {
        paginatedBodyData: [] as string[][],
        gridTemplateRows: "",
        gridTemplateColumns: "",
        editableCellIndex: [-1, -1],
        selectedCell: [-1, -1],
        selectedRowIndex: [-1, -1],
        selectedColIndex: [-1, -1],
        contextMenuPosition: null as any as number[],
        dataRowOptions: {} as { [key: string]: DataRowOption },
        dataColOptions: {} as { [key: string]: DataColOption },
        marginTopOffset: 0,


        paginationRef: {
            lowerPage: 0,
            higherPage: 0,
            maxPage: 0,
            minPage: 0
        },


        cellDragRef: {
            rowIndex: 0,
            columnIndex: 0,
            initHeight: 0,
            initWidth: 0,
            start: 0,
            end: 0
        },
        parentScrollRef: { pos: 0, detect: true, lastScrollPosition: "" }
    }
}