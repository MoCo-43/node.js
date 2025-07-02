// 객체생성
const members = [
  { id: "guest", name: "손님" },
  { id: "user", name: "회원" },
  { id: "admin", name: "관리자" },
];

// 함수생성
let add = (num1, num2) => num1 + num2;

// destructuring p53
let getPerson = () => {
  return {
    firstName: "John",
    lastName: "Doe",
    age: 37,
    email: "john@email.com",
  };
};

// 모듈을 정의해서 방출
module.exports = { members, add, getPerson };
