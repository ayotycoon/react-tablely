export interface PropsI {
    initialData: string[][],
    headerData?: string[][],
    width: number,
    height: number
    onSelectedCellChange: (value: any) => void
  
  }