import React, { useState } from 'react';
import logo from './logo.svg';
import './App.scss';
import Home from './components/Home/Home';

function App() {
  const height = 120;

  const initialData = require("./sample.json");
  return (
   <Home
   initialData = {initialData}

   width={"600px"}
   height={height+"px"}
   viewableHeight={height}
   onSelectedCellChange = {(val: any) => {

    // console.log(val)
   }}

   />
  );
}

export default App;
