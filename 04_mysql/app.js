// mysql 모듈
const mysql = require("mysql2");
const custSql = require("./sql/customerSql.js"); // {custList, }

const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "dev01",
  password: "dev01",
  database: "dev",
  connectionLimit: 10,
});

// SELECT
pool.query("select * from customers", (err, result) => {
  if (err) {
    console.log("처리중에러", err);
  } else {
    console.log(result);
  }
});

// 넣을데이터를 객체방식으로 정의
let data = ["name01", "test@enmail.com", "010-000-0000"];
data = [
  {
    name: "username",
    email: "user@email.com",
    phone: "010-0101-1010",
    address: "",
  },
  1,
];

// 객체로 INSERT
pool.query("insert into customers set ?", data, (err, result) => {
  if (err) {
    console.log("처리중에러", err);
  } else {
    console.log(result);
  }
});

// UPDATE
pool.query("update customers set ? where id = ?", data, (err, result) => {
  if (err) {
    console.log("처리중에러", err);
  } else {
    console.log(result);
  }
});

// DELETE
pool.query("delete from customers where id = ?", 1, (err, result) => {
  if (err) {
    console.log("처리중에러", err);
  } else {
    console.log(result);
  }
});

// 쿼리정의
// console.log(custSql["customerList"]); //customerList 보기
function query(alias, values) {
  pool.query(custSql[alias], values, (err, result) => {
    if (err) {
      console.log("처리중에러", err);
    } else {
      console.log(result);
    }
  });
}

// 정의한 쿼리 함수로 SQL 작성

// Select 조회
query("customerList");

// 삽입
query("customerInsert", {
  name: "홍길동",
  email: "hong@email.com",
  phone: "010-1111-2222",
  address: "",
});

// DELETE 삭제
query("customerDelete", 5); // 또는 query("customerDelete", [5])  // 5는 실제로 삭제할 id

// UPDATE 수정
query("customerUpdate", [
  {
    name: "수정된이름",
    email: "new@email.com",
    phone: "010-2222-3333",
    address: "서울시",
  },
  5, // 이 부분에 실제로 수정할 id 값(예시로 5)
]);
