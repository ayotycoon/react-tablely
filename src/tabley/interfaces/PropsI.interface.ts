import React from "react"
import { DataColOption } from "./DataOptionI.interface"

export interface PropsI {
    initialData: string[][],
    headerData?: string[][],
    width: number,
    height: number
    onSelectedCellChange?: (value: any) => void
    dataColOptions?:  { [key: string]: DataColOption }
    sheetRef?: React.MutableRefObject<any>
  
  }