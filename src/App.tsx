import React, { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import Sheet from './tabley/components/Sheet/Sheet';
import dataTransformer from './tabley/utils/dataTransformer';
import SheetsNavigator from './tabley/components/SheetsNavigator/SheetsNavigator';
let initialData: string[][] = require("./sample.json");
dataTransformer(initialData)



const headerData = require("./header.json");


function App() {
  const height = window.innerHeight - 52;
  const width = window.innerWidth;


  return (
    <>
    {/* <Sheet
      initialData={(initialData)}
      headerData={headerData}
    //  dataColOptions={{4: {backgroundColor: "rgba(0, 128, 0, 0.534)"}}}
      width={width}
      height={height}
      onSelectedCellChange={(val: any) => {

        // console.log(val)
      }}

    /> */}
    <SheetsNavigator data = {[
      {
        initialData,
        headerData,
        width,
        height
      },
      {
        initialData:[[1,2,3,4]] as any,
        headerData:[["S/N","b","ff","uuu"]],
        width,
        height
      }
    ]} />
    </>
  );
}

export default App;
