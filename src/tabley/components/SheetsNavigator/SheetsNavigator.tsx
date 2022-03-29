import react, { useEffect, useRef, useState } from "react";
import { PropsI } from "../../interfaces/PropsI.interface";
import Settings from "../../Settings";
import Sheet from "../Sheet/Sheet";

function SheetNavigatorCell({ sheet, option, index, activeSheetIndex, funChangeSheetIndex, onOption }: any) {
    return (
        <div onClick={sheet ? () => funChangeSheetIndex(index) : () => onOption(option)} style={{ display: 'inline-block', cursor: "pointer", fontWeight: "bold", padding: "5px 10px", borderLeft: Settings.borderColorAtMiddle, borderRight: Settings.borderColorAtMiddle, color: sheet && activeSheetIndex == index ? Settings.selectedCellColor : "rgb(70, 70, 70)" }}>
            {option && option == "add" ? "Add" : sheet}
        </div>)

}



export default function SheetsNavigator({ data }: {
    data: PropsI[]
}) {


    const [sheetsList, setSheetsList] = useState([] as string[])
    const [activeSheetIndex, setActiveSheetIndex] = useState(0);
    const options = ["add"]

    const sheetRef = useRef(null as any)


    function onOption(option: string) {
        if (option == "add") {
            const _sheetsList = [...sheetsList];
            _sheetsList.push("Sheet " + (_sheetsList.length + 1))
            setSheetsList(_sheetsList)
        }

    }

    function funChangeSheetIndex(index: number) {

        setActiveSheetIndex(index);

    }
    const ref = useRef(false)
    useEffect(() => {
        if (!ref.current) {
            ref.current = true;
            return}
     

        sheetRef.current.resetState();

        



    }, [activeSheetIndex])

    useEffect(() => {
        const _sheetsList = [...sheetsList];
        data.forEach((d, i) => {
            _sheetsList.push("Sheet " + (i + 1))
        })

        setSheetsList(_sheetsList)
    }, [])
    return (
        <div style={{}}>

            <Sheet
                sheetRef={sheetRef}
                initialData={data[activeSheetIndex].initialData}
                headerData={data[activeSheetIndex].headerData}
                width={data[activeSheetIndex].width}
                height={data[activeSheetIndex].height}

            />

<div style={{borderTop:Settings.borderColorAtMiddle}}>
            {sheetsList.map((sheet, i) => <SheetNavigatorCell
                key={i}
                activeSheetIndex={activeSheetIndex}
                index={i}
                sheet={sheet}
                funChangeSheetIndex={funChangeSheetIndex} />)}

            {options.map((option, i) =>
                <SheetNavigatorCell
                    key={option}
                    option={option}
                    onOption={onOption} />)}

        </div>
        </div>
    )

}