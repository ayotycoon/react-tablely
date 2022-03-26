import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './Home.scss';
import { PropsI } from '../../interfaces/PropsI.interface';

const debug = true;
const selectedCellColor = "#1A73E8"
const selectedRowOrColumnBackgroundColor = "rgba(231, 239, 253, 1)"
const selectedRowOrColumnBorderColor = "1px solid rgba(30, 109, 232, 1)"
const firstColumnBackground = "rgba(248, 249, 250, 1)"
const firstRowBackground = "rgba(232, 234, 237, 1)"

const borderColorAtEdges = "1px solid rgba(188,188,188, 1)";
const borderColorAtMiddle = "1px solid rgba(188,188,188, 0.5)";




function Home(props: PropsI) {

  const width = props.width || window.innerWidth;
  const height = props.height || window.innerHeight;
  const [data, setData] = useState([] as string[][]);
  const onSelectedCellChange = props.onSelectedCellChange || function () { };

  const [gridTemplateRows, setGridTemplateRows] = useState("")
  const [gridTemplateColumns, setGridTemplateColumns] = useState("")

  const [selectedCell, setSelectedCell] = useState([-1, -1])
  const [editableCellIndex, setEditableCellIndex] = useState([-1, -1])

  const [selectedRowIndex, setSelectedRowIndex] = useState([-1, -1])
  const [selectedColumnIndex, setSelectedColumnIndex] = useState([-1, -1])


  const [dataPropertiesRow, setDataPropertiesRow] = useState([{
    height: 24
  }]);
  const [dataPropertiesColumn, setDataPropertiesColumn] = useState([{
    width: 48
  }]);
  const [ marginTopOffset, setMarginTopOffset] = useState(0);
  const [ page, setPage] = useState(0);



  const paginationRef = useRef({
    page: 0,
    maxPage: 0,
    minPage: 0
  })


  function init() {

    let _gridTemplateColumns = "";




    const _dataPropertiesColumn = [...dataPropertiesColumn]


    props.initialData[0].forEach((x, columnIndex) => {
      if (props.initialData[0].length != _dataPropertiesColumn.length) _dataPropertiesColumn.push({ width: 100 })
      _gridTemplateColumns += (`${columnIndex == 0 ? "" : " "}${_dataPropertiesColumn[columnIndex].width}px`)
    })


    setGridTemplateColumns(_gridTemplateColumns)
    setDataPropertiesColumn(_dataPropertiesColumn)

  }
  useEffect(() => {
    init()
    onPageAction(true,false)


  }, [])




  const cellDragRef = useRef({
    rowIndex: 0,
    columnIndex: 0,
    initHeight: 0,
    initWidth: 0,
    start: 0,
    end: 0
  })

  const handleCellEdgeDrag = (rowIndex: number, columnIndex: number, e: React.DragEvent<HTMLDivElement>, action: number, isHeight: boolean) => {
    if (rowIndex != cellDragRef.current.rowIndex && columnIndex != cellDragRef.current.columnIndex && 0 != cellDragRef.current.rowIndex && 0 != cellDragRef.current.columnIndex) {

      cellDragRef.current.rowIndex = 0;
      cellDragRef.current.columnIndex = 0;

      return;
    }

    if (action == 0) {

      cellDragRef.current.rowIndex = rowIndex;
      cellDragRef.current.columnIndex = columnIndex;

      if (isHeight) cellDragRef.current.start = e.clientY; else cellDragRef.current.start = e.clientX;
      cellDragRef.current.initHeight = dataPropertiesRow[rowIndex].height;
      cellDragRef.current.initWidth = dataPropertiesColumn[columnIndex].width;


      var img = new Image();
      img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
      e.dataTransfer.setDragImage(img, 0, 0);


    } else if (action == 2 || action == 1) {
      if (isHeight) cellDragRef.current.end = e.clientY; else cellDragRef.current.end = e.clientX;

      if (isHeight) {
        const _dataPropertiesRow = [...dataPropertiesRow]
        _dataPropertiesRow[rowIndex].height = cellDragRef.current.initHeight + (cellDragRef.current.end - cellDragRef.current.start);
        setDataPropertiesRow(_dataPropertiesRow);

        let _gridTemplateRows = ""
        data.forEach((x, rowIndex) => {
          if (data.length != _dataPropertiesRow.length) _dataPropertiesRow.push({ height: 24 })

          _gridTemplateRows += (`${rowIndex == 0 ? "" : " "}${(_dataPropertiesRow[rowIndex]).height}px`)
        })

        setGridTemplateRows(_gridTemplateRows)
      } else {

        const _dataPropertiesColumn = [...dataPropertiesColumn]
        _dataPropertiesColumn[columnIndex].width = cellDragRef.current.initWidth + (cellDragRef.current.end - cellDragRef.current.start);
        setDataPropertiesColumn(_dataPropertiesColumn);

        let _gridTemplateColumns = "";
        data[0].forEach((x, columnIndex) => {
          if (data[0].length != _dataPropertiesColumn.length) _dataPropertiesColumn.push({ width: 100 })
          _gridTemplateColumns += (`${columnIndex == 0 ? "" : " "}${_dataPropertiesColumn[columnIndex].width}px`)
        })

        setGridTemplateColumns(_gridTemplateColumns)

      }


    }

  }


  const onCellClick = (rowIndex: number, columnIndex: number, e: any) => {
    if (rowIndex == 0 && columnIndex == 0) return;
    setEditableCellIndex([-1, -1])
    if (rowIndex == 0) {

      setSelectedColumnIndex([columnIndex, columnIndex])
      setSelectedRowIndex([-1, -1])
      setSelectedCell([-1, -1])
      return;
    }
    if (columnIndex == 0) {
      setSelectedRowIndex([rowIndex, rowIndex])
      setSelectedColumnIndex([-1, -1])
      setSelectedCell([-1, -1])
      return;
    }

    if (rowIndex == selectedCell[0] && columnIndex == selectedCell[1]) {// doubleclick

      setEditableCellIndex([rowIndex, columnIndex])

      return
    }
    setSelectedCell([rowIndex, columnIndex])
    setSelectedRowIndex([-1, -1])
    setSelectedColumnIndex([-1, -1])

    // lunch selected  cell event
    onSelectedCellChange([rowIndex, columnIndex])

  }
  const parentScrollRef = useRef({ pos: 0, detect: true, lastAction: "" })
  const parentRef = useRef(null as unknown as HTMLDivElement)
  const topBoundRef = useRef(null as unknown as HTMLDivElement)
  const bottomBoundRef = useRef(null as unknown as HTMLDivElement)
  function onParentScroll() {

    console.log("isbottom",isInViewport(bottomBoundRef.current))


    //@ts-ignore
    const parentElement: HTMLDivElement = parentRef.current
    if (!parentScrollRef.current.detect) {
      console.log('cant detect')
      parentScrollRef.current.pos = parentElement.scrollTop;
      return;
    }


    if (parentElement.offsetHeight + parentElement.scrollTop >= parentElement.scrollHeight && paginationRef.current.page < paginationRef.current.maxPage) {
      parentScrollRef.current.detect = false;
 
      paginationRef.current.page++
      console.log("scroll up")
      onPageAction(true,parentScrollRef.current.lastAction == "down")
      parentScrollRef.current.lastAction = "up";
    } else if (parentElement.scrollTop < parentScrollRef.current.pos && parentElement.scrollTop <= ((paginationRef.current.page - 1) * props.viewableHeight) && paginationRef.current.page > 0) {
      parentScrollRef.current.detect = false;
 
      paginationRef.current.page--;
      console.log("scroll down")
      onPageAction(false,parentScrollRef.current.lastAction == "up")
      parentScrollRef.current.lastAction = "down";
    }

    setPage(paginationRef.current.page)





    parentScrollRef.current.pos = parentElement.scrollTop;


  }
  const dataRef = useRef([] as string[][]);

  function onPageAction(up: boolean, switched:boolean) {
    let tempData = dataRef.current;
    const viewableCount = Math.ceil(props.viewableHeight / 24);


    paginationRef.current.maxPage = Math.ceil(props.initialData.length / viewableCount)

    let paginatedData = props.initialData.slice((paginationRef.current.page + (switched ? up ? 1 : -1 : 0)) * viewableCount, ((paginationRef.current.page + (switched ? up ? 1 : -1 : 0)) * viewableCount) + viewableCount)

    console.log(paginationRef.current.page)
    if (up) {
      if (paginationRef.current.page > 1) {
        tempData = tempData.slice(viewableCount, viewableCount * 2)
        setMarginTopOffset((paginationRef.current.page - 1) * props.viewableHeight )


      }
      paginatedData = [...tempData, ...paginatedData]
    } else {

      if (paginationRef.current.page > 1) {
        tempData = tempData.slice(0, viewableCount )
        setMarginTopOffset((paginationRef.current.page - 1) * props.viewableHeight )


      }

      paginatedData = [...paginatedData,...tempData]
    }
    const _dataPropertiesRow = [...dataPropertiesRow]


    let _gridTemplateRows = ""
    paginatedData.forEach((x, rowIndex) => {
      if (paginatedData.length != _dataPropertiesRow.length) _dataPropertiesRow.push({ height: 24 })

      _gridTemplateRows += (`${rowIndex == 0 ? "" : " "}${(_dataPropertiesRow[rowIndex]).height}px`)
    })
    setGridTemplateRows(_gridTemplateRows)
    setDataPropertiesRow(_dataPropertiesRow)





    setData(paginatedData)
    dataRef.current = paginatedData;

    setTimeout(() => {
      parentScrollRef.current.detect = true;
    }, 100);

  }

  function isInViewport(element:HTMLDivElement) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || parentRef.current.clientHeight) &&
        rect.right <= (window.innerWidth || parentRef.current.clientWidth)
    );
  }
  




  return (
    <div className="Home" ref={parentRef} onScroll={(onParentScroll)} style={{  overflow: "auto",width, height }}>
      {debug && <div style={{backgroundColor:'red', padding: 1, position:'fixed', top:0, right:0, zIndex:5, color:'white' }}>
        <small>marginTopOffset: {marginTopOffset} </small>
        <br />
        <small>page: {page} </small>
        </div>}
        <div ref={topBoundRef} className='top-bound'></div>
    <div style={{ display: 'grid', gridTemplateRows: gridTemplateRows,  border: borderColorAtEdges, marginTop: marginTopOffset}}>

      {data.map((row, rowIndex) => {

        return (<div key={rowIndex} className={rowIndex == 0 ? "HeaderRow" : "BodyRow"} style={{ display: 'grid', gridTemplateColumns: gridTemplateColumns }}>

          {row.map((column, columnIndex) => {
            const selected = rowIndex == selectedCell[0] && columnIndex == selectedCell[1];
            const styleObj: any = {

              width: "100%",
              position: "relative",
              backgroundColor: "white"

            };

            if (selected) {
              styleObj.border = "2px solid " + selectedCellColor;

            } else {
              styleObj.borderRight = columnIndex == data[rowIndex].length - 1 ? borderColorAtEdges : borderColorAtMiddle;
              styleObj.borderLeft = columnIndex == 0 ? borderColorAtEdges : borderColorAtMiddle;
              styleObj.borderTop = rowIndex == 0 ? borderColorAtEdges : borderColorAtMiddle;
              styleObj.borderBottom = rowIndex == data.length - 1 ? borderColorAtEdges : borderColorAtMiddle;


            }
            if (columnIndex == 0) {
              styleObj.backgroundColor = firstColumnBackground;
            }
            if (rowIndex == 0) {
              styleObj.backgroundColor = firstRowBackground;
            }
            if (columnIndex >= selectedColumnIndex[0] && columnIndex <= selectedColumnIndex[1]) {
              styleObj.backgroundColor = selectedRowOrColumnBackgroundColor;

              styleObj.borderLeft = selectedRowOrColumnBorderColor;
              styleObj.borderRight = selectedRowOrColumnBorderColor;

              if (rowIndex == 0) styleObj.borderTop = selectedRowOrColumnBorderColor;
              if (rowIndex == data.length - 1) styleObj.borderBottom = selectedRowOrColumnBorderColor;

            }
            if (rowIndex >= selectedRowIndex[0] && rowIndex <= selectedRowIndex[1]) {
              styleObj.backgroundColor = selectedRowOrColumnBackgroundColor;

              styleObj.borderTop = selectedRowOrColumnBorderColor;
              styleObj.borderBottom = selectedRowOrColumnBorderColor;



              if (columnIndex == 0) styleObj.borderLeft = selectedRowOrColumnBorderColor;
              if (columnIndex == data[rowIndex].length - 1) styleObj.borderRight = selectedRowOrColumnBorderColor;
            }
            // if (rowIndex != 0 && columnIndex != 0) {
            //   styleObj.cursor = "grab";
            // }


            return (<div key={columnIndex} style={styleObj}>
              <div contentEditable={editableCellIndex[0] == rowIndex && editableCellIndex[1] == columnIndex} onClick={(e) => onCellClick(rowIndex, columnIndex, e)} style={{ width: "100%", height: `${dataPropertiesRow[rowIndex]?.height - 4}px`, overflowY: "hidden", padding: "1px" }}>{column}</div>

              {(columnIndex == 0 && rowIndex > 0) && <div
                draggable="true"
                onDragStart={(e) => handleCellEdgeDrag(rowIndex, columnIndex, e, 0, true)}
                onDrag={(e) => handleCellEdgeDrag(rowIndex, columnIndex, e, 1, true)}
                onDragEnd={(e) => handleCellEdgeDrag(rowIndex, columnIndex, e, 2, true)}
                // bottom-cell
                style={{ cursor: "row-resize", height: "2px", width: "100%", position: "absolute", bottom: "-2px", left: 0, zIndex: 1, background: debug ? 'red' : undefined }}></div>}
              {(columnIndex > 0 && rowIndex == 0) && <div
                draggable="true"
                onDragStart={(e) => handleCellEdgeDrag(rowIndex, columnIndex, e, 0, false)}
                onDrag={(e) => handleCellEdgeDrag(rowIndex, columnIndex, e, 1, false)}
                onDragEnd={(e) => handleCellEdgeDrag(rowIndex, columnIndex, e, 2, false)}

                // right-cell
                style={{ cursor: "col-resize", height: "100%", width: "2px", position: "absolute", top: 0, right: "-2px", zIndex: 1, background: debug ? 'red' : undefined }}></div>}

              {selected && <div style={{ height: "4px", width: "4px", position: "absolute", bottom: 0, right: 0, background: 'blue' }}>
              </div>}
            </div>)
          })}

        </div>)
      })}



    </div>
    <div ref={bottomBoundRef} className='bottom-bound'></div>
    </div>
  );
}

export default Home;
