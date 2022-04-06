export default (data:any) => {
    data.forEach((row: any, i: number) => {
row.id = i+1;
    })
}