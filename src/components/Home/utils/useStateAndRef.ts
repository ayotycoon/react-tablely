import { useRef, useState } from "react";

export default <T>(initialState: T) => {

    const [x, y] = useState(initialState)
    const ref = useRef(initialState);

    const getter: T = x;
    // @ts-ignore
    const setter: React.Dispatch<React.SetStateAction<T>> = (value: T) => {
        ref.current = value
        y(value)

    };

    return [getter, ref.current,  setter]

}