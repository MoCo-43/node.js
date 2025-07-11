// data.js에서 불러옴
const { members, add, getPerson } = require("./data.js");

// 테스트
console.log("hello, world");

let myName = "정경준";
let age = 20;

// backtick 사용
if (age > 20) {
  console.log(`${myName}성인`);
} else {
  console.log(`${myName}미성년`);
}

// console.log(members);
// console.log(add(10, 20));

// 배열 반복
members.forEach((item, idx) => {
  if (idx > 0) {
    console.log(item);
  }
}); // function(item, idx, array)

let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];

// spread operator 연습 P52
console.log(...arr1);
let result = [...arr1, ...arr2]; // ...arr
let result2 = [arr1, arr2]; // ...arr과 달리 배열안의 배열을 하나 더 생성
console.log(result);
console.log(result2);

// Object Destructuring 연습 P52
//data.js 에서 function을 불러옴
let { firstName, lastName, email } = getPerson(); // 객체반환을 하는데 변수 person에 저장  // {firstName, lastName ....} 객체값이 담겨져 있음
console.log(firstName, lastName, email);

function getScores() {
  return [70, 80, 90, 90, 60, 40];
}

// 배열요소를 담기
let [x, y, ...z] = getScores(); // x에서 getScores()의 첫번째 값으로 넣겠다 ... => z가 나머지 값을 다 담음(펼침 연산자)
// ScoreAry[1]
console.log(x, y, z);

function sumAry(...ary) {
  // ...ary =>  parameter의 갯수를 알수 없을때 사용!  //p56 펼침연산자 rest parameter
  let sum = 0;
  for (let num of ary) {
    sum += num;
  }
  console.log(`합계: ${sum}`);
}

sumAry(1, 2, 3, 4, 5);
