import React from "react"
import { DataColOption } from "./DataOptionI.interface"
import { BodyI, HeaderI } from "./InputI.interface"

export interface PropsI {
    initialData: BodyI[],
    headerData: HeaderI[],
    width: number,
    height: number
    onSelectedCellChange?: (value: any) => void
    dataColOptions?:  { [key: string]: DataColOption }
    sheetRef?: React.MutableRefObject<any>
  
  }