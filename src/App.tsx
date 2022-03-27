import React, { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import Home from './components/Home/Home';
import dataTransformer from './components/Home/utils/dataTransformer';
let initialData = require("./sample.json");
 dataTransformer(initialData)


const headerData = require("./header.json");


function App() {
  const height = window.innerHeight - 24;
  const width = window.innerWidth;


  return (
   <Home
   initialData = {(initialData)}
   headerData = {headerData}

  width={width }
  height={height}
   onSelectedCellChange = {(val: any) => {

    // console.log(val)
   }}

   />
  );
}

export default App;
