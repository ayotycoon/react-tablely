import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './Sheet.scss';
import { SheetPropsI } from '../../interfaces/SheetPropsI.interface';
import { DataColOption, DataRowOption } from '../../interfaces/DataOptionI.interface';
import isEdgesInParentView from '../../utils/isEdgesInParentView';
import Settings from '../../Settings';
import DrawColumn from '../DrawColumn/DrawColumn';
import Worker from '../../workers/worker';
import WorkerBuilder from '../../workers/workerBuilder';
import copyTextToClipboard from '../../utils/copy';
import { BodyI } from '../../interfaces/InputI.interface';
import { OptionKey } from '../../interfaces/OptionKey.enum';




var myWorker = new WorkerBuilder(Worker);
const allOptions = [
  {
    text: "Copy",
    fa: "fa fa-copy",
    key: OptionKey.Copy,
    fn: (selectedCellIndex: number[][], maxInitialRowsIndex: number) => {
      return true;
    }
  },
  {
    text: "Insert above",
    fa: "fa fa-arrow-up",
    key: OptionKey.InsertAbove,
    fn: (selectedCellIndex: number[][], maxInitialRowsIndex: number) => {
      if (selectedCellIndex[0][0] == -1 || selectedCellIndex[1][0] != -1) return false;
      return true;
    }
  },
  {
    text: "Insert below",
    fa: "fa fa-arrow-down",
    key: OptionKey.InsertBelow,
    fn: (selectedCellIndex: number[][], maxInitialRowsIndex: number) => {
      if (selectedCellIndex[0][0] == -1 || selectedCellIndex[1][0] != -1) return false;
      return true;
    }
  },
  {
    text: "Insert left",
    fa: "fa fa-arrow-left",
    key: OptionKey.InsertLeft,
    fn: (selectedCellIndex: number[][], maxInitialRowsIndex: number) => {
      if (selectedCellIndex[0][0] != -1 || selectedCellIndex[1][0] == -1) return false;
      return true;
    }
  },
  {
    text: "Insert right",
    fa: "fa fa-arrow-right",
    key: OptionKey.InsertRight,
    fn: (selectedCellIndex: number[][], maxInitialRowsIndex: number) => {
      if (selectedCellIndex[0][0] != -1 || selectedCellIndex[1][0] == -1) return false;
      return true;
    }
  },
]

enum PageAction {
  UP,
  Down,
  Refresh
}

enum CellAction {
  NoAction,
  ColumnSelected,
  RowSelected,
  DoubleClick,
  SelectedCell

}

let defaultWidth = Settings.defaultWidth;
function Sheet(props: SheetPropsI) {

  const width = props.width;
  const height = props.height;
  const [paginatedBodyData, setPaginatedBodyData] = useState([] as BodyI[]);
  const onSelectedCellChange = props.onSelectedCellChange || function () { };

  const [gridTemplateRows, setGridTemplateRows] = useState("")
  const [gridTemplateColumns, setGridTemplateColumns] = useState("")


  const [editableCellIndex, setEditableCellIndex] = useState([-1, -1])

  const [selectedCellIndex, setSelectedCellIndex] = useState([[-1, -1], [-1, -1]])

  const [contextMenuPosition, setContextMenuPosition] = useState(null as any as number[])


  const [dataRowOptions, setDataRowOptions] = useState({} as { [key: string]: DataRowOption });
  const [dataColOptions, setDataColOptions] = useState({} as { [key: string]: DataColOption });
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
  const dataRef = useRef([] as BodyI[]);
  const tablelyRef = useRef(null as unknown as HTMLDivElement);
  const parentRef = useRef(null as unknown as HTMLDivElement);
  const headerDivRef = useRef(null as unknown as HTMLDivElement);
  const mainElRef = useRef(null as unknown as HTMLDivElement);


  function init() {
    defaultWidth = Math.max(Settings.defaultWidth, Math.floor(width / props.headerDataRef.current.length)) - 1;

    let _gridTemplateColumns = "";

    const _dataColOptions: {[index: string]:DataColOption} = {}

    props.headerDataRef.current.forEach((x, columnIndex) => {
      if(x.width){
        if(!_dataColOptions[columnIndex]) _dataColOptions[columnIndex] = {}
        _dataColOptions[columnIndex].width = x.width
      }

      _gridTemplateColumns += (`${columnIndex == 0 ? "" : " "}${_dataColOptions[columnIndex]?.width || defaultWidth}px`)
    })
    setDataColOptions(_dataColOptions);
    setGridTemplateColumns(_gridTemplateColumns);
    onPageAction(PageAction.UP)

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
    setContextMenuPosition(null as any as number[])
    setDataColOptions( {} as { [key: string]: DataColOption });
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
        props.headerDataRef.current.forEach((x, columnIndex) => {
          _gridTemplateColumns += (`${columnIndex == 0 ? "" : " "}${_dataColOptions[columnIndex]?.width || defaultWidth}px`)
        })

        setGridTemplateColumns(_gridTemplateColumns)

      }


    }

  }


  const handleCellContextMenu = (initialRowIndex: number, columnIndex: number, isHeader: boolean, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    let approxContextMenuHeight = 90;
    let approxContextMenuWidth = 140;
    const res = onCellClick(initialRowIndex, columnIndex, isHeader, e, true);
    if (!res) return;
    if (res == CellAction.SelectedCell) approxContextMenuHeight = 35;

      let y = e.clientY;
    let x = e.clientX;

    if (y + approxContextMenuHeight > height) {
      y -= approxContextMenuHeight;
    }

    if (x + approxContextMenuWidth > width) {
      x -= approxContextMenuWidth;
    }


    setContextMenuPosition([y, x]);
  }
  const onCellClick = (initialRowIndex: number, columnIndex: number, isHeader: boolean, e: React.MouseEvent<HTMLDivElement, MouseEvent>, fromContext?: boolean) => {

    if (isHeader && columnIndex == 0) return CellAction.NoAction;
    setEditableCellIndex([-1, -1])
    if (isHeader) {
      // selecting column only
      setSelectedCellIndex([[-1, -1], [columnIndex, columnIndex]])
      if (!fromContext) setContextMenuPosition(null as any)
      return CellAction.ColumnSelected;
    }
    if (columnIndex == 0) {
      // selecting row only
      setSelectedCellIndex([[initialRowIndex, initialRowIndex], [-1, -1]])

      if (!fromContext) setContextMenuPosition(null as any)
      return CellAction.RowSelected;
    }

    if (!fromContext && initialRowIndex == selectedCellIndex[0][0] && columnIndex == selectedCellIndex[1][0]) {// doubleclick
      // double click
      setEditableCellIndex([initialRowIndex, columnIndex])

      return CellAction.DoubleClick
    }
    // selected cell
    setSelectedCellIndex([[initialRowIndex, initialRowIndex], [columnIndex, columnIndex]])


    // lunch selected  cell event
    onSelectedCellChange([initialRowIndex, columnIndex])
    if (!fromContext) setContextMenuPosition(null as any)
    return CellAction.SelectedCell;

  }



  function onParentScroll() {
    headerDivRef.current.scrollLeft = parentRef.current.scrollLeft;
    if (contextMenuPosition) setContextMenuPosition(null as any)
    if (!parentScrollRef.current.detect) return;
    const [isTopInView, isBottomInView] = isEdgesInParentView(mainElRef.current, parentRef.current);

    if (isBottomInView == isTopInView) return
    if (isBottomInView && paginationRef.current.higherPage < paginationRef.current.maxPage) {
      parentScrollRef.current.detect = false;


      if (paginationRef.current.higherPage != 0) paginationRef.current.lowerPage = paginationRef.current.higherPage
      paginationRef.current.higherPage++
      console.log("scroll up")
      onPageAction(PageAction.UP)
      parentScrollRef.current.lastScrollPosition = "up";
    } else if (isTopInView && paginationRef.current.lowerPage > 0) {
      parentScrollRef.current.detect = false;

      paginationRef.current.lowerPage--;
      paginationRef.current.higherPage = paginationRef.current.lowerPage + 1
      console.log("scroll down")
      onPageAction(PageAction.Down)
      parentScrollRef.current.lastScrollPosition = "down";
    }


    //  console.log({ lower: paginationRef.current.lowerPage, higher: paginationRef.current.higherPage })





  }


  function onPageAction(direction: PageAction) {
    let tempData = dataRef.current;
    const viewableCount = Math.ceil(height / Settings.defaultHeight);

    //   console.log(getCalculatedRowWithPagination(rowIndex, paginationRef.current.higherPage, viewableCount))

    paginationRef.current.maxPage = Math.ceil(props.initialDataRef.current.length / viewableCount) - 1;
    let paginatedData: BodyI[] = [];

    if (direction == PageAction.UP) {
      paginatedData = props.initialDataRef.current.slice((paginationRef.current.higherPage) * viewableCount, ((paginationRef.current.higherPage) * viewableCount) + viewableCount);
      //  console.log(paginationRef.current.higherPage,paginatedBodyData.length)
      if (paginationRef.current.higherPage > 1) {
        // get last
        tempData = tempData.slice(viewableCount, viewableCount * 2)
        setMarginTopOffset((paginationRef.current.higherPage - 1) * height)


      }
      paginatedData = [...tempData, ...paginatedData]
    } else if (direction == PageAction.Down) {
      paginatedData = props.initialDataRef.current.slice((paginationRef.current.lowerPage) * viewableCount, ((paginationRef.current.lowerPage) * viewableCount) + viewableCount);



      tempData = tempData.slice(0, viewableCount)
      setMarginTopOffset((paginationRef.current.lowerPage) * height)



      paginatedData = [...paginatedData, ...tempData]
    } else {
      const upper = paginationRef.current.lowerPage == paginationRef.current.higherPage ? [] : props.initialDataRef.current.slice((paginationRef.current.lowerPage) * viewableCount, ((paginationRef.current.lowerPage) * viewableCount) + viewableCount);
      const lower = props.initialDataRef.current.slice((paginationRef.current.higherPage) * viewableCount, ((paginationRef.current.higherPage) * viewableCount) + viewableCount);

      paginatedData = upper.concat(lower);
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

  function handleEditableOnBlur(e: any, initialRowIndex: number, columnIndex: number) {
 
    const key = props.headerDataRef.current[columnIndex].key;

    props.initialDataRef.current[initialRowIndex-1][key] = e.target.innerText;


   

  }
  function onContextMenuItemClick(key: OptionKey) {
    setContextMenuPosition(null as any)

    switch (key) {
      case OptionKey.Copy:

        let dataToCopy: any = "";
        // Jest cell
        if (selectedCellIndex[0][0] != -1 && selectedCellIndex[1][0] != -1) {
          dataToCopy = props.initialDataRef.current[selectedCellIndex[0][0]][selectedCellIndex[1][0]] || "";

        } else if (selectedCellIndex[0][0] != -1 && selectedCellIndex[1][0] == -1) { // analyse row
          dataToCopy = JSON.stringify(props.initialDataRef.current[selectedCellIndex[0][0] - 1]);

        } else if (selectedCellIndex[0][0] == -1 && selectedCellIndex[1][0] != -1) { // analyse column

        }

        copyTextToClipboard(dataToCopy);


        break;

      case OptionKey.InsertAbove:
        myWorker.postMessage({ action: OptionKey.InsertAbove, initialData: props.initialDataRef.current, initialRowIndex: selectedCellIndex[0][0] });
        myWorker.onmessage = (ev: MessageEvent<any>) => {
          const initialData = ev.data;
          props.initialDataRef.current = initialData;

          onPageAction(PageAction.Refresh)
        }


        break;
      case OptionKey.InsertBelow:
        myWorker.postMessage({ action: OptionKey.InsertBelow, initialData: props.initialDataRef.current, initialRowIndex: selectedCellIndex[0][0] });
        myWorker.onmessage = (ev: MessageEvent<any>) => {
          const initialData = ev.data;
          props.initialDataRef.current = initialData;

          onPageAction(PageAction.Refresh)
        }


        break;

      default:
        break;
    }
  }





  return (<div className="Sheet" ref={tablelyRef}>

    {contextMenuPosition && <div className='ContextMenu' style={{ top: contextMenuPosition[0], left: contextMenuPosition[1], }}>
      {allOptions.map((option, i) => option.fn(selectedCellIndex, props.initialDataRef.current.length) ? <div onClick={() => onContextMenuItemClick(option.key)} className='ContextMenuOption' key={option.text} style={{}}>
        <div><i className={"icon "+option.fa}></i></div>
        <div>{option.text}</div>

      </div> : <span key={option.text}></span>)}
    </div>}

    <div ref={headerDivRef} className='HeaderDiv' style={{ width: `calc(${width}px - 10px)`, marginLeft: '0', overflow: 'hidden' }}>

      {Settings.debug && <div style={{ backgroundColor: 'red', padding: 2, position: 'fixed', top: 0, right: 0, zIndex: 5, color: 'white' }}>
        <small>Margin Top Offset: {marginTopOffset} </small>
        <br />
        <small>Rendered length: {paginatedBodyData.length} </small>
        <br />
        {paginatedBodyData[paginatedBodyData.length - 1] && <small>Last Rendered Item: {paginatedBodyData[paginatedBodyData.length - 1][0]} </small>}
        <br />
        <small>Total length: {props.initialDataRef.current.length} </small>
        <br />
        <small>Scroll Position: {parentScrollRef.current.lastScrollPosition} </small>
        <br />
        <small>Lower Page: {paginationRef.current.lowerPage} </small>
        <br />
        <small>Higher Page: {paginationRef.current.higherPage} </small>
      </div>}




      <DrawColumn

handleEditableOnBlur={null as any}
        paginatedBodyData={null as unknown as BodyI[]}
        headerData={props.headerDataRef.current}
        selectedCellIndex={selectedCellIndex}
        gridTemplateColumns={gridTemplateColumns}
        onCellClick={onCellClick}
        handleCellContextMenu={handleCellContextMenu}
        handleCellEdgeDrag={handleCellEdgeDrag}
        editableCellIndex={editableCellIndex}
        dataRowOptions={dataRowOptions}
        dataColOptions={dataColOptions}
      />
    </div>
    <div ref={parentRef} onScroll={(onParentScroll)} style={{ overflow: "auto", width, height }}>


      <div ref={mainElRef} style={{ display: 'grid', gridTemplateRows: gridTemplateRows, marginTop: marginTopOffset }}>

        <DrawColumn
handleEditableOnBlur={handleEditableOnBlur}
          headerData={props.headerDataRef.current}

          paginatedBodyData={paginatedBodyData}
          selectedCellIndex={selectedCellIndex}
          gridTemplateColumns={gridTemplateColumns}
          onCellClick={onCellClick}
          handleCellContextMenu={handleCellContextMenu}
          handleCellEdgeDrag={handleCellEdgeDrag}
          editableCellIndex={editableCellIndex}
          dataRowOptions={dataRowOptions}
          dataColOptions={dataColOptions}
        />



      </div>

    </div>
  </div>);
}

export default Sheet;
