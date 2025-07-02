// js.js
// filesystem

const fs = require("fs");

console.log("start");
// 1. 비동기방식 파일읽기 parameter값 (읽을파일, 인코딩방식, Callbackfunction)
// 처리할것이 많다면 속도가 유리함
/* fs.readFile("./sample/output.log", "utf8", (err, data) => {
  if (err) {
    throw err;
  }
  console.log(data);
});
*/

// 2. 동기방식 파일읽기
/* let data = fs.readFileSync("./sample/output.log", "utf8");
console.log(data);
console.log("end");
*/

// 1. 비동기방식 파일쓰기
fs.writeFile("./sample/write.txt", "글쓰기...", "utf8", (err) => {
  if (err) {
    throw err;
  }
  console.log("쓰기완료");
});
console.log("end");

// 2. 동기방식 파일쓰기
// 교제에 있으니 참고
