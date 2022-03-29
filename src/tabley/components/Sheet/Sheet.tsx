import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './Sheet.scss';
import { PropsI } from '../../interfaces/PropsI.interface';
import { DataColOption, DataRowOption } from '../../interfaces/DataOptionI.interface';
import isEdgesInParentView from '../../utils/isEdgesInParentView';
import Settings from '../../Settings';
import DrawColumn from '../DrawColumn/DrawColumn';
import Worker from '../../workers/worker';
import WorkerBuilder from '../../workers/workerBuilder';

var myWorker = new WorkerBuilder(Worker);
const allOptions = [
  {
    text: "Copy",
    fa: "fa fa-copy",
    fn: (selectedRowIndex: number[], selectedColIndex: number[], selectedCellIndex: number[], maxInitialRowsIndex: number) => {
      return true;
    }
  },
  {
    text: "Insert above",
    fa: "fa fa-arrow-up",
       fn: (selectedRowIndex: number[], selectedColIndex: number[], selectedCellIndex: number[], maxInitialRowsIndex: number) => {
         if(selectedCellIndex[0] != -1 || selectedRowIndex[0] == -1 ) return false;
         return true;
       }
  },
  {
    text: "Insert below",
    fa: "fa fa-arrow-down",
       fn: (selectedRowIndex: number[], selectedColIndex: number[], selectedCellIndex: number[], maxInitialRowsIndex: number) => {
        if(selectedCellIndex[0] != -1 || selectedRowIndex[0] == -1 ) return false;
         return true;
       }
  },
  {
    text: "Insert left",
    fa: "fa fa-arrow-left",
       fn: (selectedRowIndex: number[], selectedColIndex: number[], selectedCellIndex: number[], maxInitialRowsIndex: number) => {
        if(selectedCellIndex[0] != -1 || selectedColIndex[0] == -1 ) return false;
         return true;
       }
  },
  {
    text: "Insert right",
    fa: "fa fa-arrow-right",
       fn: (selectedRowIndex: number[], selectedColIndex: number[], selectedCellIndex: number[], maxInitialRowsIndex: number) => {
        if(selectedCellIndex[0] != -1 || selectedColIndex[0] == -1 ) return false;
         return true;
       }
  },
]

myWorker.postMessage("ho");

let defaultWidth = Settings.defaultWidth;
function Sheet(props: PropsI) {
  const headerData = props.headerData || []
  const width = props.width;
  const height = props.height;
  const [paginatedBodyData, setPaginatedBodyData] = useState([] as string[][]);
  const onSelectedCellChange = props.onSelectedCellChange || function () { };

  const [gridTemplateRows, setGridTemplateRows] = useState("")
  const [gridTemplateColumns, setGridTemplateColumns] = useState("")


  const [editableCellIndex, setEditableCellIndex] = useState([-1, -1])

  const [selectedCellIndex, setSelectedCellIndex] = useState([-1, -1])
  const [selectedRowIndex, setSelectedRowIndex] = useState([-1, -1])
  const [selectedColIndex, setSelectedColIndex] = useState([-1, -1])
  const [contextMenuPosition, setContextMenuPosition] = useState(null as any as number[])


  const [dataRowOptions, setDataRowOptions] = useState({} as { [key: string]: DataRowOption });
  const [dataColOptions, setDataColOptions] = useState(props.dataColOptions || {} as { [key: string]: DataColOption });
  const [marginTopOffset, setMarginTopOffset] = useState(0);

  const [stateCount, setStateCount] = useState(0);

  const paginationRef = useRef({
    lowerPage: 0,
    higherPage: 0,
    maxPage: 0,
    minPage: 0
  })


  const cellDragRef = useRef({
    rowIndex: 0,
    columnIndex: 0,
    initHeight: 0,
    initWidth: 0,
    start: 0,
    end: 0
  })
  const parentScrollRef = useRef({ pos: 0, detect: true, lastScrollPosition: "" });
  const dataRef = useRef([] as string[][]);
  const tablelyRef = useRef(null as unknown as HTMLDivElement);
  const parentRef = useRef(null as unknown as HTMLDivElement);
  const headerRef = useRef(null as unknown as HTMLDivElement);
  const mainElRef = useRef(null as unknown as HTMLDivElement);


  function init() {
    defaultWidth = Math.max(Settings.defaultWidth, Math.floor(width / props.initialData[0].length)) - 1;

    let _gridTemplateColumns = "";



    props.initialData[0].forEach((x, columnIndex) => {

      _gridTemplateColumns += (`${columnIndex == 0 ? "" : " "}${defaultWidth}px`)
    })

    setGridTemplateColumns(_gridTemplateColumns);
    onPageAction(true)

  }
  useEffect(() => {
    tablelyRef.current.addEventListener('contextmenu', event => event.preventDefault());


    if (props.sheetRef) {
      props.sheetRef.current = {};
      props.sheetRef.current.resetState = resetState
    }

  }, [])


  function resetState() {

    setPaginatedBodyData(Settings.defaultSheetState.paginatedBodyData)
    setGridTemplateRows(Settings.defaultSheetState.gridTemplateRows)
    setGridTemplateColumns(Settings.defaultSheetState.gridTemplateColumns)
    setEditableCellIndex(Settings.defaultSheetState.editableCellIndex)
    setSelectedCellIndex(Settings.defaultSheetState.selectedCell)
    setSelectedRowIndex(Settings.defaultSheetState.selectedRowIndex)
    setSelectedColIndex(Settings.defaultSheetState.selectedColIndex)
    setContextMenuPosition(null as any as number[])
    setDataColOptions(props.dataColOptions || {} as { [key: string]: DataColOption });
    setMarginTopOffset(0);

    paginationRef.current = {
      lowerPage: 0,
      higherPage: 0,
      maxPage: 0,
      minPage: 0
    }

    cellDragRef.current = {
      rowIndex: 0,
      columnIndex: 0,
      initHeight: 0,
      initWidth: 0,
      start: 0,
      end: 0
    }
    parentScrollRef.current = { pos: 0, detect: true, lastScrollPosition: "" };
    dataRef.current = []
    Settings.stateCount++;
    setStateCount(Settings.stateCount)
  }


  useEffect(() => {

    init()
  }, [stateCount])



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
      cellDragRef.current.initHeight = dataRowOptions[initialRowIndex]?.height || Settings.defaultHeight;
      cellDragRef.current.initWidth = dataColOptions[columnIndex]?.width || defaultWidth;

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
          _gridTemplateRows += (`${x[0] == 1 ? "" : " "}${_dataRowOptions[x[0]]?.height || Settings.defaultHeight}px`)
        })

        setGridTemplateRows(_gridTemplateRows)
      } else {

        const _dataColOptions = { ...dataColOptions }
        if (!_dataColOptions[columnIndex]) _dataColOptions[columnIndex] = {} as any
        _dataColOptions[columnIndex].width = cellDragRef.current.initWidth + (cellDragRef.current.end - cellDragRef.current.start);
        setDataColOptions(_dataColOptions);

        let _gridTemplateColumns = "";
        paginatedBodyData[0].forEach((x, columnIndex) => {
          _gridTemplateColumns += (`${columnIndex == 0 ? "" : " "}${_dataColOptions[columnIndex]?.width || defaultWidth}px`)
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

      setSelectedColIndex([columnIndex, columnIndex])
      setSelectedRowIndex([-1, -1])
      setSelectedCellIndex([-1, -1])
      if (!fromContext) setContextMenuPosition(null as any)
      return;
    }
    if (columnIndex == 0) {
      setSelectedRowIndex([initialRowIndex, initialRowIndex])
      setSelectedColIndex([-1, -1])
      setSelectedCellIndex([-1, -1])
      if (!fromContext) setContextMenuPosition(null as any)
      return;
    }

    if (!fromContext && initialRowIndex == selectedCellIndex[0] && columnIndex == selectedCellIndex[1]) {// doubleclick

      setEditableCellIndex([initialRowIndex, columnIndex])

      return
    }
    setSelectedCellIndex([initialRowIndex, columnIndex])
    setSelectedRowIndex([-1, -1])
    setSelectedColIndex([-1, -1])

    // lunch selected  cell event
    onSelectedCellChange([initialRowIndex, columnIndex])
    if (!fromContext) setContextMenuPosition(null as any)

  }



  function onParentScroll() {
    headerRef.current.scrollLeft = parentRef.current.scrollLeft;
    if (contextMenuPosition) setContextMenuPosition(null as any)
    if (!parentScrollRef.current.detect) return;
    const [isTopInView, isBottomInView] = isEdgesInParentView(mainElRef.current, parentRef.current);

    if (isBottomInView == isTopInView) return
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
      _gridTemplateRows += (`${x[0] == 0 ? "" : " "}${_dataRowOptions[x[0]]?.height || Settings.defaultHeight}px`)
    })
    setGridTemplateRows(_gridTemplateRows)
    setDataRowOptions(_dataRowOptions)





    setPaginatedBodyData(paginatedData)
    dataRef.current = paginatedData;


    setTimeout(() => {
      parentScrollRef.current.detect = true;
    }, 10);

  }







  return (<div className="Sheet" ref={tablelyRef}>

    {contextMenuPosition && <div className='ContextMenu' style={{  top: contextMenuPosition[0], left: contextMenuPosition[1], }}>
      {allOptions.map((option, i) => option.fn(selectedRowIndex, selectedColIndex, selectedCellIndex, props.initialData.length) ? <div className='ContextMenuOption' key={option.text} style={{  }}>
        <div><i className={option.fa}></i></div>
        <div>{option.text}</div>

      </div>: <span key={option.text}></span>)}
    </div>}

    <div ref={headerRef} className='HeaderDiv' style={{ width: `calc(${width}px - 10px)`, marginLeft: '0', overflow: 'hidden' }}>

      {Settings.debug && <div style={{ backgroundColor: 'red', padding: 2, position: 'fixed', top: 0, right: 0, zIndex: 5, color: 'white' }}>
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
          selectedCellIndex={selectedCellIndex}
          gridTemplateColumns={gridTemplateColumns}
          selectedColIndex={selectedColIndex}
          onCellClick={onCellClick}
          handleCellContextMenu={handleCellContextMenu}
          handleCellEdgeDrag={handleCellEdgeDrag}
          editableCellIndex={editableCellIndex}
          selectedRowIndex={selectedRowIndex}
          dataRowOptions={dataRowOptions}
          dataColOptions={dataColOptions}
        />)
      })}
    </div>
    <div ref={parentRef} onScroll={(onParentScroll)} style={{ overflow: "auto", width, height }}>


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
            selectedCellIndex={selectedCellIndex}
            gridTemplateColumns={gridTemplateColumns}
            selectedColIndex={selectedColIndex}
            onCellClick={onCellClick}
            handleCellContextMenu={handleCellContextMenu}
            handleCellEdgeDrag={handleCellEdgeDrag}
            editableCellIndex={editableCellIndex}
            selectedRowIndex={selectedRowIndex}
            dataRowOptions={dataRowOptions}
            dataColOptions={dataColOptions}
          />)
        })}



      </div>

    </div>
  </div>);
}

export default Sheet;
