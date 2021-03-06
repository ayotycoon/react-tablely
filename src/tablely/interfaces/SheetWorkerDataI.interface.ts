import { BodyI, HeaderI } from "./InputI.interface";
import { OptionKey } from "./OptionKey.enum";

export interface SheetWorkerDataI {

  action: OptionKey
  initialData: BodyI[]
  initialRowIndex: number
  headerData: HeaderI[]
  columnIndex: number
  }
