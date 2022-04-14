import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import './App.scss';

import {SheetsNavigator} from './tablely';
import { BodyI, HeaderI } from './tablely';
import * as sample from './sampleLarge'

const dataTransformer = (data:any) => {
  data.forEach((row: any, i: number) => {
row.id = i+1;
  })
}

function App() {



  const dataRef = useRef([
    {
      initialDataRef: useRef(sample.initialData as unknown as BodyI[]),
      headerDataRef: useRef(sample.headerData as HeaderI[]),
      width: window.innerWidth,
      height: window.innerHeight - 52

    }
  ])

  const additions = [
    {
      initialDataRef: useRef([{ id: 1 }]),
      headerDataRef: useRef(dataRef.current[0].headerDataRef.current),
      width: dataRef.current[0].width,
      height: dataRef.current[0].height
    },
    {
      initialDataRef: useRef([{ id: 1 }]),
      headerDataRef: useRef(dataRef.current[0].headerDataRef.current),
      width: dataRef.current[0].width,
      height: dataRef.current[0].height

    },
  ]

  dataTransformer(dataRef.current[0].initialDataRef.current)

  return (
    <>

      <SheetsNavigator
        dataRef={dataRef}
        additions={additions}

      />
    </>
  );
}

export default App;
