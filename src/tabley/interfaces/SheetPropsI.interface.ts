import React from "react"
import { DataColOption } from "./DataOptionI.interface"
import { BodyI, HeaderI } from "./InputI.interface"

export interface SheetPropsI {
    initialDataRef: React.MutableRefObject<BodyI[]>,
    headerDataRef: React.MutableRefObject<HeaderI[]>,
    width: number,
    height: number
    onSelectedCellChange?: (value: any) => void
    sheetRef?: React.MutableRefObject<any>
  
  }

  export interface SheetNavigatorPropsI {
    dataRef: React.MutableRefObject<SheetPropsI[]>,
    additions?: SheetPropsI[]
}