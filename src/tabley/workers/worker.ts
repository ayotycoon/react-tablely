import { BodyI } from "../interfaces/InputI.interface";
import { OptionKey } from "../interfaces/OptionKey.enum";
import { SheetWorkerDataI } from "../interfaces/SheetWorkerDataI.interface";


export default () => {

function insertAbove(initialData: BodyI[], initialRowIndex: number) {
  initialData.push({ id: 0 })
  if (initialRowIndex != initialData.length) {
    for (let i = initialData.length; i > 1; i--) {

      if (initialRowIndex == i) {
        initialData[i - 1] = { id: i }
        break
      }
      initialData[i - 1] = initialData[i - 2];

      initialData[i - 1].id = i;
    }

    if (initialRowIndex == 1) {
      initialData[0] = { id: 1 }
    }

  }

}

function insertBelow(initialData: BodyI[], initialRowIndex: number) {
  initialData.push({ id: initialData.length })
  if (initialRowIndex != initialData.length) {
    for (let i = initialData.length; i > 0; i--) {

      if (initialRowIndex == i) {
        initialData[i] = { id: i+1 }
        initialData[i-1].id = i
        break
      }
      initialData[i - 1] = initialData[i - 2];

      initialData[i - 1].id = i;
    }

  }

}
  onmessage = function (event: MessageEvent<SheetWorkerDataI>) {
    console.log('Message received from main script');
    const initialData = event.data.initialData;
    const initialRowIndex = event.data.initialRowIndex;

    switch (event.data.action) {


      case 1: // insert above    
        insertAbove(initialData, initialRowIndex)
        break;

      case 2: // insert below    
        insertBelow(initialData, initialRowIndex)
        break;

      default:
        break;
    }


    postMessage(initialData)

  }
}