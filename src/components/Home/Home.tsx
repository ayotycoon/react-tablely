import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './Home.scss';
import { PropsI } from '../../interfaces/PropsI.interface';
import { DataColOption, DataRowOption } from '../../interfaces/DataOptionI.interface';

const debug = true;
const selectedCellColor = "#1A73E8"
const selectedRowOrColumnBackgroundColor = "rgba(231, 239, 253, 1)"
const selectedRowOrColumnBorderColor = "1px solid rgba(30, 109, 232, 1)"
const firstColumnBackground = "rgba(248, 249, 250, 1)"
const firstRowBackground = "rgba(232, 234, 237, 1)"

const borderColorAtEdges = "1px solid rgba(188,188,188, 1)";
const borderColorAtMiddle = "1px solid rgba(188,188,188, 0.5)";

const defaults = {
  height: 24,
  width: 60
}

function isEdgesInParentView(element: HTMLDivElement, parentElement: HTMLDivElement) {
  const rect = element.getBoundingClientRect();

  const offset = parentElement.getBoundingClientRect().top;

  const res = [(rect.top - offset) >= 0, (rect.bottom - offset) <= parentElement.clientHeight];
  return res
}




function DrawColumn({ rowIndex, initialRowIndex, row, header, data, selectedCell, gridTemplateColumns, selectedColumnIndex, onCellClick, handleCellContextMenu, handleCellEdgeDrag, editableCellIndex, selectedRowIndex, dataRowOptions }: {
  rowIndex: number;
  initialRowIndex: number;
  row: string[];
  header: boolean;
  data: string[][];
  selectedCell: number[];
  gridTemplateColumns: string;
  selectedColumnIndex: number[];
  onCellClick: (initialRowIndex: number, columnIndex: number, isHeader: boolean, e: any) => void;
  handleCellContextMenu: (initialRowIndex: number, columnIndex: number, isHeader: boolean, e: any) => void;
  handleCellEdgeDrag: (initialRowIndex: number, rowIndex: number, columnIndex: number, e: React.DragEvent<HTMLDivElement>, action: number, isHeight: boolean) => void;
  editableCellIndex: number[];
  selectedRowIndex: number[];
  dataRowOptions: { [id: string]: DataRowOption }
}) {
  return (
    <div className={header ? "HeaderRow" : "BodyRow"} style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>

      {row.map((column, columnIndex) => {
        const selected = !header && initialRowIndex == selectedCell[0] && columnIndex == selectedCell[1];
        const styleObj: any = {

          width: "100%",
          position: "relative",
          backgroundColor: "white"

        };

        if (selected) {
          styleObj.border = "1px solid " + selectedCellColor;

        } else {
          // styleObj.borderRight = columnIndex == data[rowIndex].length - 1 ? borderColorAtEdges : borderColorAtMiddle;
          styleObj.borderLeft = borderColorAtMiddle;
          //  if(!header && initialRowIndex != 0)styleObj.borderTop = initialRowIndex == 0 ? borderColorAtEdges : borderColorAtMiddle;
          styleObj.borderBottom = borderColorAtMiddle;
          if (header) styleObj.borderTop = borderColorAtMiddle;


        }
        if (columnIndex == 0) {
          styleObj.backgroundColor = firstColumnBackground;
        }
        if (header && rowIndex == 0) {
          styleObj.backgroundColor = firstRowBackground;
        }
        if (columnIndex >= selectedColumnIndex[0] && columnIndex <= selectedColumnIndex[1]) {
          styleObj.backgroundColor = selectedRowOrColumnBackgroundColor;

          styleObj.borderLeft = selectedRowOrColumnBorderColor;
          styleObj.borderRight = selectedRowOrColumnBorderColor;

          if (rowIndex == 0 && header) styleObj.borderTop = selectedRowOrColumnBorderColor;

        }
        if (!header && initialRowIndex >= selectedRowIndex[0] && initialRowIndex <= selectedRowIndex[1]) {
          styleObj.backgroundColor = selectedRowOrColumnBackgroundColor;

          styleObj.borderTop = selectedRowOrColumnBorderColor;
          styleObj.borderBottom = selectedRowOrColumnBorderColor;



          if (columnIndex == 0) styleObj.borderLeft = selectedRowOrColumnBorderColor;
          if (columnIndex == data[initialRowIndex].length - 1) styleObj.borderRight = selectedRowOrColumnBorderColor;
        }
        // if (rowIndex != 0 && columnIndex != 0) {
        //   styleObj.cursor = "grab";
        // }


        return (<div key={columnIndex} style={styleObj}>
          <div onContextMenu={(e) => handleCellContextMenu(initialRowIndex, columnIndex, header, e)} contentEditable={!header && editableCellIndex[0] == initialRowIndex && editableCellIndex[1] == columnIndex} onClick={(e) => onCellClick(initialRowIndex, columnIndex, header, e)} style={{ width: "100%", height: `${(dataRowOptions[initialRowIndex]?.height || defaults.height) - 4}px`, overflow: "hidden", padding: "1px 2px" }}>{column}</div>

          {(columnIndex == 0 && !header) && <div
            draggable="true"
            onDragStart={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 0, true)}
            onDrag={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 1, true)}
            onDragEnd={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 2, true)}
            // bottom-cell
            style={{ cursor: "row-resize", height: "2px", width: "100%", position: "absolute", bottom: "-2px", left: 0, zIndex: 1, background: debug ? 'red' : undefined }}></div>}
          {(header) && <div
            draggable="true"
            onDragStart={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 0, false)}
            onDrag={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 1, false)}
            onDragEnd={(e) => handleCellEdgeDrag(initialRowIndex, rowIndex, columnIndex, e, 2, false)}

            // right-cell
            style={{ cursor: "col-resize", height: "100%", width: "2px", position: "absolute", top: 0, right: "-2px", zIndex: 1, background: debug ? 'red' : undefined }}></div>}

          {selected && <div style={{ height: "4px", width: "4px", position: "absolute", bottom: 0, right: 0, background: 'blue' }}>
          </div>}
        </div>)
      })}

    </div>
  )
}


function Home(props: PropsI) {
  const headerData = props.headerData || []
  const width = props.width;
  const height = props.height;
  const [paginatedBodyData, setPaginatedBodyData] = useState([] as string[][]);
  const onSelectedCellChange = props.onSelectedCellChange || function () { };

  const [gridTemplateRows, setGridTemplateRows] = useState("")
  const [gridTemplateColumns, setGridTemplateColumns] = useState("")


  const [editableCellIndex, setEditableCellIndex] = useState([-1, -1])

  const [selectedCell, setSelectedCell] = useState([-1, -1])
  const [selectedRowIndex, setSelectedRowIndex] = useState([-1, -1])
  const [selectedColumnIndex, setSelectedColumnIndex] = useState([-1, -1])
  const [contextMenuPosition, setContextMenuPosition] = useState(null as any as number[])


  const [dataRowOptions, setDataRowOptions] = useState({} as { [key: string]: DataRowOption });
  const [dataColOptions, setDataColOptions] = useState({} as { [key: string]: DataColOption });
  const [marginTopOffset, setMarginTopOffset] = useState(0);



  const paginationRef = useRef({
    lowerPage: 0,
    higherPage: 0,
    maxPage: 0,
    minPage: 0
  })


  function init() {
    defaults.width = Math.max(defaults.width, Math.floor(width / props.initialData[0].length)) - 0.5;

    let _gridTemplateColumns = "";



    props.initialData[0].forEach((x, columnIndex) => {

      _gridTemplateColumns += (`${columnIndex == 0 ? "" : " "}${defaults.width}px`)
    })

    setGridTemplateColumns(_gridTemplateColumns)

  }
  useEffect(() => {
    tablelyRef.current.addEventListener('contextmenu', event => event.preventDefault());
    init()
    onPageAction(true)


  }, [])




  const cellDragRef = useRef({
    rowIndex: 0,
    columnIndex: 0,
    initHeight: 0,
    initWidth: 0,
    start: 0,
    end: 0
  })

  const handleCellEdgeDrag = (initialRowIndex: number, rowIndex: number, columnIndex: number, e: React.DragEvent<HTMLDivElement>, action: number, isHeight: boolean) => {

    if (initialRowIndex != cellDragRef.current.rowIndex && columnIndex != cellDragRef.current.columnIndex && 0 != cellDragRef.current.rowIndex && 0 != cellDragRef.current.columnIndex) {

      cellDragRef.current.rowIndex = 0;
      cellDragRef.current.columnIndex = 0;

      return;
    }

    if (action == 0) {

      cellDragRef.current.rowIndex = initialRowIndex;
      cellDragRef.current.columnIndex = columnIndex;

      if (isHeight) cellDragRef.current.start = e.clientY; else cellDragRef.current.start = e.clientX;
      cellDragRef.current.initHeight = dataRowOptions[initialRowIndex]?.height || defaults.height;
      cellDragRef.current.initWidth = dataColOptions[columnIndex]?.width || defaults.width;

      var img = new Image();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
      e.dataTransfer.setDragImage(img, 0, 0);


    } else if (action == 1 || action == 2) {
      if (isHeight) cellDragRef.current.end = e.clientY; else cellDragRef.current.end = e.clientX;

      if (isHeight) {
        const _dataRowOptions = { ...dataRowOptions }

        if (!_dataRowOptions[initialRowIndex]) _dataRowOptions[initialRowIndex] = {} as any
        _dataRowOptions[initialRowIndex].height = cellDragRef.current.initHeight + (cellDragRef.current.end - cellDragRef.current.start);
        setDataRowOptions(_dataRowOptions);

        let _gridTemplateRows = ""
        paginatedBodyData.forEach((x, rowIndex) => {

          // @ts-ignore
          _gridTemplateRows += (`${x[0] == 1 ? "" : " "}${_dataRowOptions[x[0]]?.height || defaults.height}px`)
        })

        setGridTemplateRows(_gridTemplateRows)
      } else {

        const _dataColOptions = { ...dataColOptions }
        if (!_dataColOptions[columnIndex]) _dataColOptions[columnIndex] = {} as any
        _dataColOptions[columnIndex].width = cellDragRef.current.initWidth + (cellDragRef.current.end - cellDragRef.current.start);
        setDataColOptions(_dataColOptions);

        let _gridTemplateColumns = "";
        paginatedBodyData[0].forEach((x, columnIndex) => {
          _gridTemplateColumns += (`${columnIndex == 0 ? "" : " "}${_dataColOptions[columnIndex]?.width || defaults.width}px`)
        })

        setGridTemplateColumns(_gridTemplateColumns)

      }


    }

  }


  const handleCellContextMenu = (initialRowIndex: number, columnIndex: number, isHeader: boolean, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    onCellClick(initialRowIndex, columnIndex, isHeader, e, true)

    const y = e.clientY;
    const x = e.clientX;
    setContextMenuPosition([y, x]);
  }
  const onCellClick = (initialRowIndex: number, columnIndex: number, isHeader: boolean, e: React.MouseEvent<HTMLDivElement, MouseEvent>, fromContext?: boolean) => {

    if (isHeader && columnIndex == 0) return;
    setEditableCellIndex([-1, -1])
    if (isHeader) {

      setSelectedColumnIndex([columnIndex, columnIndex])
      setSelectedRowIndex([-1, -1])
      setSelectedCell([-1, -1])
      if(!fromContext)setContextMenuPosition(null as any)
      return;
    }
    if (columnIndex == 0) {
      setSelectedRowIndex([initialRowIndex, initialRowIndex])
      setSelectedColumnIndex([-1, -1])
      setSelectedCell([-1, -1])
      if(!fromContext)setContextMenuPosition(null as any)
      return;
    }

    if (!fromContext && initialRowIndex == selectedCell[0] && columnIndex == selectedCell[1]) {// doubleclick

      setEditableCellIndex([initialRowIndex, columnIndex])

      return
    }
    setSelectedCell([initialRowIndex, columnIndex])
    setSelectedRowIndex([-1, -1])
    setSelectedColumnIndex([-1, -1])

    // lunch selected  cell event
    onSelectedCellChange([initialRowIndex, columnIndex])
    if(!fromContext)setContextMenuPosition(null as any)

  }
  const parentScrollRef = useRef({ pos: 0, detect: true, lastScrollPosition: "" });
  const tablelyRef = useRef(null as unknown as HTMLDivElement);
  const parentRef = useRef(null as unknown as HTMLDivElement);
  const headerRef = useRef(null as unknown as HTMLDivElement);
  const mainElRef = useRef(null as unknown as HTMLDivElement);


  function onParentScroll() {
    headerRef.current.scrollLeft = parentRef.current.scrollLeft;
    if(contextMenuPosition)setContextMenuPosition(null as any)
    if (!parentScrollRef.current.detect) return;
    const [isTopInView, isBottomInView] = isEdgesInParentView(mainElRef.current, parentRef.current);

    if (isBottomInView == isTopInView) return

    console.log("isTop", isTopInView)
    console.log("isbottom", isBottomInView)

    if (isBottomInView && paginationRef.current.higherPage < paginationRef.current.maxPage) {
      parentScrollRef.current.detect = false;


      if (paginationRef.current.higherPage != 0) paginationRef.current.lowerPage = paginationRef.current.higherPage
      paginationRef.current.higherPage++
      console.log("scroll up")
      onPageAction(true)
      parentScrollRef.current.lastScrollPosition = "up";
    } else if (isTopInView && paginationRef.current.lowerPage > 0) {
      parentScrollRef.current.detect = false;

      paginationRef.current.lowerPage--;
      paginationRef.current.higherPage = paginationRef.current.lowerPage + 1
      console.log("scroll down")
      onPageAction(false)
      parentScrollRef.current.lastScrollPosition = "down";
    }


    //  console.log({ lower: paginationRef.current.lowerPage, higher: paginationRef.current.higherPage })





  }
  const dataRef = useRef([] as string[][]);

  function onPageAction(up: boolean) {
    let tempData = dataRef.current;
    const viewableCount = Math.ceil(height / 24);

    //   console.log(getCalculatedRowWithPagination(rowIndex, paginationRef.current.higherPage, viewableCount))

    paginationRef.current.maxPage = Math.ceil(props.initialData.length / viewableCount)

    let paginatedData: string[][];

    if (up) {
      paginatedData = props.initialData.slice((paginationRef.current.higherPage) * viewableCount, ((paginationRef.current.higherPage) * viewableCount) + viewableCount);
      if (paginationRef.current.higherPage > 1) {
        tempData = tempData.slice(viewableCount, viewableCount * 2)
        setMarginTopOffset((paginationRef.current.higherPage - 1) * height)


      }
      paginatedData = [...tempData, ...paginatedData]
    } else {
      paginatedData = props.initialData.slice((paginationRef.current.lowerPage) * viewableCount, ((paginationRef.current.lowerPage) * viewableCount) + viewableCount);



      tempData = tempData.slice(0, viewableCount)
      setMarginTopOffset((paginationRef.current.lowerPage) * height)



      paginatedData = [...paginatedData, ...tempData]
    }
    const _dataRowOptions = { ...dataRowOptions }


    let _gridTemplateRows = ""
    paginatedData.forEach((x) => {

      // @ts-ignore
      _gridTemplateRows += (`${x[0] == 0 ? "" : " "}${_dataRowOptions[x[0]]?.height || defaults.height}px`)
    })
    setGridTemplateRows(_gridTemplateRows)
    setDataRowOptions(_dataRowOptions)





    setPaginatedBodyData(paginatedData)
    dataRef.current = paginatedData;


    setTimeout(() => {
      parentScrollRef.current.detect = true;
    }, 10);

  }







  return (<div ref={tablelyRef}>

    {contextMenuPosition && <div style={{ backgroundColor: 'purple', padding: 5, position: 'fixed', top: contextMenuPosition[0], left: contextMenuPosition[1], zIndex: 5, color: 'white', width: 200, height: 200 }}>

    </div>}

    <div ref={headerRef} className='HeaderDiv' style={{ width: `calc(${width}px - 10px)`, marginLeft: '0', overflow: 'hidden' }}>

      {debug && <div style={{ backgroundColor: 'red', padding: 2, position: 'fixed', top: 0, right: 0, zIndex: 5, color: 'white' }}>
        <small>Margin Top Offset: {marginTopOffset} </small>
        <br />
        <small>Rendered length: {paginatedBodyData.length} </small>
        <br />
        {paginatedBodyData[paginatedBodyData.length - 1] && <small>Last Rendered Item: {paginatedBodyData[paginatedBodyData.length - 1][0]} </small>}
        <br />
        <small>Total length: {props.initialData.length} </small>
        <br />
        <small>Scroll Position: {parentScrollRef.current.lastScrollPosition} </small>
        <br />
        <small>Lower Page: {paginationRef.current.lowerPage} </small>
        <br />
        <small>Higher Page: {paginationRef.current.higherPage} </small>
      </div>}

      {headerData.map((row, rowIndex) => {


        return (<DrawColumn
          header={true}
          rowIndex={rowIndex}
          initialRowIndex={0}
          row={row}
          key={rowIndex}
          data={headerData}
          selectedCell={selectedCell}
          gridTemplateColumns={gridTemplateColumns}
          selectedColumnIndex={selectedColumnIndex}
          onCellClick={onCellClick}
          handleCellContextMenu={handleCellContextMenu}
          handleCellEdgeDrag={handleCellEdgeDrag}
          editableCellIndex={editableCellIndex}
          selectedRowIndex={selectedRowIndex}
          dataRowOptions={dataRowOptions}
        />)
      })}
    </div>
    <div className="Home" ref={parentRef} onScroll={(onParentScroll)} style={{ overflow: "auto", width, height }}>


      <div ref={mainElRef} style={{ display: 'grid', gridTemplateRows: gridTemplateRows, marginTop: marginTopOffset }}>

        {paginatedBodyData.map((row, rowIndex) => {
          const initialRowIndex = row[0];

          return (<DrawColumn
            header={false}
            rowIndex={rowIndex}
            initialRowIndex={initialRowIndex as any}
            row={row}
            key={initialRowIndex}
            data={paginatedBodyData}
            selectedCell={selectedCell}
            gridTemplateColumns={gridTemplateColumns}
            selectedColumnIndex={selectedColumnIndex}
            onCellClick={onCellClick}
            handleCellContextMenu={handleCellContextMenu}
            handleCellEdgeDrag={handleCellEdgeDrag}
            editableCellIndex={editableCellIndex}
            selectedRowIndex={selectedRowIndex}
            dataRowOptions={dataRowOptions}
          />)
        })}



      </div>

    </div>
  </div>);
}

export default Home;
