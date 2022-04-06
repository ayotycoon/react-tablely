const fs = require('fs');

const data = fs.readFileSync("src/header.json", {encoding:'utf-8'})

const arr = JSON.parse(data);

const res = [];

for (let i = 0; i < arr.length; i++) {
    const element = arr[i];
    const obj = {key: i,title:element};


    
    res.push(obj)
    
}


fs.writeFileSync("src/header.json", JSON.stringify(res))