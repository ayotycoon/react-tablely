export interface PropsI {
    initialData: string[][],
    width: string,
    height: string
    onSelectedCellChange: (value: any) => void
  
    viewableHeight:number
  }