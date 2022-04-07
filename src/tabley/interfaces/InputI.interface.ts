import React from "react"
import { DataColOption } from "./DataOptionI.interface"

export interface HeaderI {
    title: string,
    key: string| number,
    width?: number

  
  }

  export interface BodyI {
id: number;
    [key: string| number]: string | number

  
  }