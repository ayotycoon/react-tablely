import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import Sheet from './tabley/components/Sheet/Sheet';
import dataTransformer from './tabley/utils/dataTransformer';
import SheetsNavigator from './tabley/components/SheetsNavigator/SheetsNavigator';
import { BodyI, HeaderI } from './tabley/interfaces/InputI.interface';
import * as sample from './sampleLarge'



function App() {
  const height = window.innerHeight - 52;
  const width = window.innerWidth;

  let initialDataRef = useRef(sample.initialData as unknown as BodyI[]);
dataTransformer(initialDataRef.current)



const headerDataRef = useRef(sample.headerData as HeaderI[]);



  return (
    <>

      <SheetsNavigator data={[
        {
          initialDataRef,
          headerDataRef,
          width,
          height
        
        },
        // {
        //   initialDataRef: [[1, 2, 3, 4]] as any,
        //   headerDataRef: [["S/N", "b", "ff", "uuu"]],
        //   width,
        //   height
        // }
      ]} />
    </>
  );
}

export default App;
