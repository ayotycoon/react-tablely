import react from "react";
import { DataColOption, DataRowOption } from "../../interfaces/DataOptionI.interface";
import Settings from "../../Settings";

export default ({ rowIndex, initialRowIndex, row, header, data, selectedCellIndex, gridTemplateColumns, selectedColIndex, onCellClick, handleCellContextMenu, handleCellEdgeDrag, editableCellIndex, selectedRowIndex, dataRowOptions, dataColOptions }: {
    rowIndex: number;
    initialRowIndex: number;
    row: string[];
    header: boolean;
    data: string[][];
    selectedCellIndex: number[];
    gridTemplateColumns: string;
    selectedColIndex: number[];
    onCellClick: (initialRowIndex: number, columnIndex: number, isHeader: boolean, e: any) => void;
    handleCellContextMenu: (initialRowIndex: number, columnIndex: number, isHeader: boolean, e: any) => void;
    handleCellEdgeDrag: (initialRowIndex: number, rowIndex: number, columnIndex: number, e: React.DragEvent<HTMLDivElement>, action: number, isHeight: boolean) => void;
    editableCellIndex: number[];
    selectedRowIndex: number[];
    dataRowOptions: { [id: string]: DataRowOption }
    dataColOptions: { [id: string]: DataColOption }
}) => {
    return (
        <div className={header ? "HeaderRow" : "BodyRow"} style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>

            {row.map((column, columnIndex) => {
                const selected = !header && initialRowIndex == selectedCellIndex[0] && columnIndex == selectedCellIndex[1];
                const styleObj: react.CSSProperties = {

                    width: "100%",
                    position: "relative",
                    backgroundColor: "white"

                };

                if (selected) {
                    styleObj.border = "1px solid " + Settings.selectedCellColor;

                } else {
                    // styleObj.borderRight = columnIndex == data[rowIndex].length - 1 ? borderColorAtEdges : borderColorAtMiddle;
                    styleObj.borderLeft = Settings.borderColorAtMiddle;
                    //  if(!header && initialRowIndex != 0)styleObj.borderTop = initialRowIndex == 0 ? borderColorAtEdges : borderColorAtMiddle;
                    styleObj.borderBottom = Settings.borderColorAtMiddle;
                    if (header) styleObj.borderTop = Settings.borderColorAtMiddle;


                }

                if (columnIndex == 0) {
                    styleObj.backgroundColor = Settings.firstColumnBackground;
                }
                if (header && rowIndex == 0) {
                    styleObj.backgroundColor = Settings.firstRowBackground;
                }
                if (columnIndex >= selectedColIndex[0] && columnIndex <= selectedColIndex[1]) {
                    styleObj.backgroundColor = Settings.selectedRowOrColumnBackgroundColor;

                    styleObj.borderLeft = Settings.selectedRowOrColumnBorderColor;
                    styleObj.borderRight = Settings.selectedRowOrColumnBorderColor;

                    if (rowIndex == 0 && header) styleObj.borderTop = Settings.selectedRowOrColumnBorderColor;

                }
                if (!header && initialRowIndex >= selectedRowIndex[0] && initialRowIndex <= selectedRowIndex[1]) {
                    styleObj.backgroundColor = Settings.selectedRowOrColumnBackgroundColor;

                    styleObj.borderTop = Settings.selectedRowOrColumnBorderColor;
                    styleObj.borderBottom = Settings.selectedRowOrColumnBorderColor;



                    if (columnIndex == 0) styleObj.borderLeft = Settings.selectedRowOrColumnBorderColor;
                    if (columnIndex == data[initialRowIndex].length - 1) styleObj.borderRight = Settings.selectedRowOrColumnBorderColor;
                }


                // customizations
                if (dataColOptions[columnIndex]?.backgroundColor) styleObj.backgroundColor = dataColOptions[columnIndex].backgroundColor
                if (dataColOptions[columnIndex]?.color) styleObj.color = dataColOptions[columnIndex].color





                return (<div key={columnIndex} style={styleObj}>
                    <div onContextMenu={(e) => handleCellContextMenu(initialRowIndex, columnIndex, header, e)} contentEditable={!header && editableCellIndex[0] == initialRowIndex && editableCellIndex[1] == columnIndex} onClick={(e) => onCellClick(initialRowIndex, columnIndex, header, e)} style={{ width: "100%", height: `${(dataRowOptions[initialRowIndex]?.height || Settings.defaultHeight) - 4}px`, overflow: "hidden", padding: "1px 2px" }}>{column}</div>

                    {(columnIndex == 0 && !header) && <div
                        draggable="true"
                        onDragStart={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 0, true)}
                        onDrag={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 1, true)}
                        onDragEnd={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 2, true)}
                        // bottom-cell
                        style={{ cursor: "row-resize", height: "2px", width: "100%", position: "absolute", bottom: "-2px", left: 0, zIndex: 1, background: Settings.debug ? 'red' : undefined }}></div>}
                    {(header) && <div
                        draggable="true"
                        onDragStart={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 0, false)}
                        onDrag={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 1, false)}
                        onDragEnd={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 2, false)}

                        // right-cell
                        style={{ cursor: "col-resize", height: "100%", width: "2px", position: "absolute", top: 0, right: "-2px", zIndex: 1, background: Settings.debug ? 'red' : undefined }}></div>}

                    {selected && <div style={{ height: "4px", width: "4px", position: "absolute", bottom: 0, right: 0, background: 'blue' }}>
                    </div>}
                </div>)
            })}

        </div>
    )
}