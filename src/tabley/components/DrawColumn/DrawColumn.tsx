import react from "react";
import { DataColOption, DataRowOption } from "../../interfaces/DataOptionI.interface";
import { BodyI, HeaderI } from "../../interfaces/InputI.interface";
import Settings from "../../Settings";

export default ({ headerData, paginatedBodyData, selectedCellIndex, gridTemplateColumns, onCellClick, handleEditableOnBlur,handleCellContextMenu, handleCellEdgeDrag, editableCellIndex, dataRowOptions, dataColOptions }: {


    headerData: HeaderI[],
    paginatedBodyData: BodyI[];
    selectedCellIndex: number[][];
    gridTemplateColumns: string;
    handleEditableOnBlur: (e: any, initialRowIndex: number, renderedRowIndex:number,columnIndex: number) => void;
    onCellClick: (initialRowIndex: number, columnIndex: number, isHeader: boolean, e: any) => void;
    handleCellContextMenu: (initialRowIndex: number, columnIndex: number, isHeader: boolean, e: any) => void;
    handleCellEdgeDrag: (initialRowIndex: number, rowIndex: number, columnIndex: number, e: React.DragEvent<HTMLDivElement>, action: number, isHeight: boolean) => void;
    editableCellIndex: number[];

    dataRowOptions: { [id: string]: DataRowOption }
    dataColOptions: { [id: string]: DataColOption }
}) => {
    const header = !paginatedBodyData
    const row = header ? [[0]] : paginatedBodyData;
    return (
        <div className={header ? "HeaderRow" : "BodyRow"} style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>

            {row.map((eachRow, renderedRowIndex) => {
                return headerData.map((column, columnIndex) => {
                    // @ts-ignore
                    const cellData = header ? column.title : (eachRow[column.key] || "");
                    // @ts-ignore
                    const initialRowIndex: number = header ? 0 : eachRow.id;

                    const selected = !header &&
                        selectedCellIndex[0][0] == selectedCellIndex[0][1] &&
                        selectedCellIndex[1][0] == selectedCellIndex[1][1] &&
                        initialRowIndex == selectedCellIndex[0][0] &&
                        columnIndex == selectedCellIndex[1][0];
                    const styleObj: react.CSSProperties = {

                        width: "100%",
                        position: "relative",
                        backgroundColor: "white",
                        textAlign: "right"

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
                        styleObj.textAlign = "center";
                        styleObj.fontWeight = "600";
                    }
                    if (header && renderedRowIndex == 0) {
                        styleObj.backgroundColor = Settings.firstRowBackground;
                        styleObj.textAlign = "center";
                        styleObj.fontWeight = "600";
                    }
                    // analysing column
                    if (columnIndex >= selectedCellIndex[1][0] &&
                        columnIndex <= selectedCellIndex[1][1] &&
                        (selectedCellIndex[0][0] == -1 || selectedCellIndex[0][0] != selectedCellIndex[0][1])

                    ) {
                        styleObj.backgroundColor = Settings.selectedRowOrColumnBackgroundColor;

                        styleObj.borderLeft = Settings.selectedRowOrColumnBorderColor;
                        styleObj.borderRight = Settings.selectedRowOrColumnBorderColor;

                        if (renderedRowIndex == 0 && header) styleObj.borderTop = Settings.selectedRowOrColumnBorderColor;

                    }
                    // Analysing row
                    if (!header &&
                        initialRowIndex >= selectedCellIndex[0][0] &&
                        initialRowIndex <= selectedCellIndex[0][1] &&
                        (selectedCellIndex[1][0] == -1 || selectedCellIndex[1][0] != selectedCellIndex[1][1])

                    ) {
                        styleObj.backgroundColor = Settings.selectedRowOrColumnBackgroundColor;

                        styleObj.borderTop = Settings.selectedRowOrColumnBorderColor;
                        styleObj.borderBottom = Settings.selectedRowOrColumnBorderColor;



                        if (columnIndex == 0) styleObj.borderLeft = Settings.selectedRowOrColumnBorderColor;
                        // console.log({columnIndex,initialRowIndex,data})
                        if (columnIndex == headerData.length - 1) styleObj.borderRight = Settings.selectedRowOrColumnBorderColor;
                    }


                    // customizations
                    if (dataColOptions[columnIndex]?.backgroundColor) styleObj.backgroundColor = dataColOptions[columnIndex].backgroundColor
                    if (dataColOptions[columnIndex]?.color) styleObj.color = dataColOptions[columnIndex].color


                    const canEdit = !header && editableCellIndex[0] == initialRowIndex && editableCellIndex[1] == columnIndex;
                 


                    return (<div key={columnIndex} style={styleObj}>
                        <div
                            onContextMenu={(e) => handleCellContextMenu(initialRowIndex, columnIndex, header, e)}
                            onBlur={canEdit ? (e) => handleEditableOnBlur(e,editableCellIndex[0],renderedRowIndex,editableCellIndex[1]) : undefined}
                            contentEditable={canEdit}
                            onClick={(e) => onCellClick(initialRowIndex, columnIndex, header, e)}
                            style={{ width: "100%",
                                height: canEdit? undefined :`${(dataRowOptions[initialRowIndex]?.height || Settings.defaultHeight)}px`,
                                overflow: "hidden", padding: "1px 2px",
                                border: canEdit ? "1px solid " + Settings.selectedCellColor: undefined,
                                backgroundColor: canEdit ? "white" : undefined,
                                position: canEdit ? "absolute" : undefined,
                                zIndex: canEdit ? 5 : undefined,
                                textAlign: canEdit ? 'left' : undefined
                            }}>  {cellData}</div>

                        {(columnIndex == 0 && !header) && <div
                            draggable="true"
                            onDragStart={(e) => handleCellEdgeDrag(initialRowIndex, renderedRowIndex, columnIndex, e, 0, true)}
                            onDrag={(e) => handleCellEdgeDrag(initialRowIndex, renderedRowIndex, columnIndex, e, 1, true)}
                            onDragEnd={(e) => handleCellEdgeDrag(initialRowIndex, renderedRowIndex, columnIndex, e, 2, true)}
                            // bottom-cell
                            style={{ cursor: "row-resize", height: "2px", width: "100%", position: "absolute", bottom: "-2px", left: 0, zIndex: 1, background: Settings.debug ? 'red' : undefined }}></div>}
                        {(header) && <div
                            draggable="true"
                            onDragStart={(e) => handleCellEdgeDrag(initialRowIndex, renderedRowIndex, columnIndex, e, 0, false)}
                            onDrag={(e) => handleCellEdgeDrag(initialRowIndex, renderedRowIndex, columnIndex, e, 1, false)}
                            onDragEnd={(e) => handleCellEdgeDrag(initialRowIndex, renderedRowIndex, columnIndex, e, 2, false)}

                            // right-cell
                            style={{ cursor: "col-resize", height: "100%", width: "2px", position: "absolute", top: 0, right: "-2px", zIndex: 1, background: Settings.debug ? 'red' : undefined }}></div>}

                        {selected && <div style={{ height: "4px", width: "4px", position: "absolute", bottom: 0, right: 0, background: 'blue' }}>
                        </div>}
                    </div>)
                })
            })}

        </div>
    )
}