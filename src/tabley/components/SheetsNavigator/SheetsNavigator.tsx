import react, { useEffect, useRef, useState } from "react";
import { SheetPropsI } from "../../interfaces/SheetPropsI.interface";
import Settings from "../../Settings";
import Sheet from "../Sheet/Sheet";

function SheetNavigatorCell({ sheet, option, index, activeSheetIndex, funChangeSheetIndex, onOption }: {
    sheet: string
    option: { action: SheetsNavigatorBottomAction, icon: string }
    index: number
    activeSheetIndex: number
    funChangeSheetIndex: (index: number) => void;
    onOption: (option: SheetsNavigatorBottomAction) => void;
}) {
    return (
        <div onClick={sheet ? () => funChangeSheetIndex(index) : () => onOption(option.action)} style={{ display: 'inline-block', cursor: "pointer", fontWeight: "bold", padding: "5px 10px", borderLeft: Settings.borderColorAtMiddle, borderRight: Settings.borderColorAtMiddle, color: sheet && activeSheetIndex == index ? Settings.selectedCellColor : "rgb(70, 70, 70)" }}>
            {!option ? sheet : ""}
            {option ? <i className={option.icon}></i> : ""}
        </div>)

}
enum SheetsNavigatorBottomAction {
    Add,

}



export default function SheetsNavigator({ data }: {
    data: SheetPropsI[]
}) {


    const [sheetsList, setSheetsList] = useState([] as string[])
    const [activeSheetIndex, setActiveSheetIndex] = useState(0);
    const options = [
        { action: SheetsNavigatorBottomAction.Add, icon: "fa fa-plus" },
    ]

    const sheetRef = useRef(null as any)


    function onOption(option: SheetsNavigatorBottomAction) {
        if (option == SheetsNavigatorBottomAction.Add) {
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
            return
        }


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
                initialDataRef={data[activeSheetIndex].initialDataRef}
                headerDataRef={data[activeSheetIndex].headerDataRef}
                width={data[activeSheetIndex].width}
                height={data[activeSheetIndex].height}

            />

            <div style={{ borderTop: Settings.borderColorAtMiddle }}>
                {sheetsList.map((sheet, i) => {
                    //@ts-ignore
                    return <SheetNavigatorCell
                        key={i}
                        activeSheetIndex={activeSheetIndex}
                        index={i}
                        sheet={sheet}
                        funChangeSheetIndex={funChangeSheetIndex} />
                })}

                {options.map((option, i) => {
                    //@ts-ignore
                    return <SheetNavigatorCell
                        key={option.action}
                        option={option}
                        onOption={onOption} />
                })}

            </div>
        </div>
    )

}