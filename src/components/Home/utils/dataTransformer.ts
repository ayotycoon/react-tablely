export default (data:(string| number)[][]) => {
    data.forEach((row, i) => {
row[0] = i+1;
    })
}