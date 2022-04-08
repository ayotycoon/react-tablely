import { BodyI, HeaderI } from "../interfaces/InputI.interface";
import { OptionKey } from "../interfaces/OptionKey.enum";
import { SheetWorkerDataI } from "../interfaces/SheetWorkerDataI.interface";


export default () => {
  function getRandomKey(){
    const length = 5;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
  }

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
          initialData[i] = { id: i + 1 }
          initialData[i - 1].id = i
          break
        }
        initialData[i - 1] = initialData[i - 2];

        initialData[i - 1].id = i;
      }

    }

  }

  function insertLeft(headerData: HeaderI[], columnIndex: number) {
    const key = getRandomKey();
    const obj = { key: key, title: key };
    headerData.push(obj)
    if (columnIndex != headerData.length-1) {
      for (let i = headerData.length-1; i > 0; i--) {

        if (columnIndex == i) {
          headerData[i] = obj
          break
        }
        headerData[i] = headerData[i-1];
      }
      if (columnIndex == 0) {
        headerData[0] = obj
      }

    }


  }

  function insertRight(initialData: HeaderI[], columnIndex: number) {


  }
  onmessage = function (event: MessageEvent<SheetWorkerDataI>) {
    console.log('Message received from main script');
    let data: any = null;
    const initialRowIndex = event.data.initialRowIndex;

    switch (event.data.action) {


      case 1: // insert above 
        data = event.data.initialData;
        insertAbove(data, initialRowIndex);
        break;

      case 2: // insert below   
        data = event.data.initialData;
        insertBelow(data, initialRowIndex);
        break;

      case 3: // insert below    
        data = event.data.headerData;
        insertLeft(data, event.data.columnIndex);
        break;

      case 4: // insert below    
        data = event.data.headerData;
        insertRight(data, event.data.columnIndex);
        break;

      default:
        break;
    }


    postMessage(data)

  }
}