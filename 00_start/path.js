// path.js
const path = require("path");

console.log(__filename); // 파일의 경로를 보여줌
console.log(path.basename(__filename)); // 파일의 확장자까지 보여줌
console.log(path.basename(__filename, ".js")); // 파일 이름만 보여줌

let result = path.format({
  base: "sample.txt",
  dir: "/home/temp",
});
console.log(result);

result = path.parse("/home/temp/sample.txt");
console.log(result);
