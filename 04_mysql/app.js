// mysql 모듈
// index.js 파일 분리

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const xlsx = require("xlsx");
require("dotenv").config({ path: "./sql/.env" });
const nodemailer = require("./nodemailer");

const mysql = require("./sql");

// console.log(process.env.HOST);
// console.log(process.env.USERNAME);
// console.log(process.env.PASSWORD);
// console.log(process.env.PORT);
// console.log(process.env.USER);
// console.log(process.env.DATABASE);
// console.log(process.env.LIMIT);

// express 모듈
const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Root 경로");
});

// 이메일 발송 화면
// post방식으로 이메일 보내기
app.post("/email", async (req, res) => {
  try {
    let result = await nodemailer.sendEmail(req.body.param);
    console.log(result);
    res.json({ retCode: "success", retVal: result }); // {"retCode" : "success"}
  } catch (err) {
    res.json({ retCode: "fail" });
  }
});

// 이메일 전송
// get방식으로 이메일 보내기
app.get("/email", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // join 여러경로를 합쳐서 보여주고 싶을떄사용 public아래의 index.html을 보여주게 됨
});

// 조회  customerList
app.get("/customers", async (req, res) => {
  try {
    let result = await mysql.query("customerList");
    res.send(result);
  } catch (err) {
    res.send("에러", err);
  }
});

// 엑셀파일 업로드 및 DB insert
// multer 모듈 필요

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 저장경로
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    // 업로드 파일명
    let fn = Buffer.from(file.originalname, "latin1").toString("utf-8"); // UTF-8 방식으로 인코딩
    cb(null, Date.now() + "_" + fn); // 같은이름의 데이터가 들어오게되는걸 방지하기 위해 => ex) 1212312_sample.jpg 형태로 저장됨
  },
});

// Multer 인스턴스 생성
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 엑셀 첨부처리
app.post("/excel", upload.single("myFile"), async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.body);
    const workbook = xlsx.readFile(`./uploads/${req.file.filename}`);
    const firstSheetName = workbook.SheetNames[0]; // 첫번째 시트
    // 시트명으로 첫번째 시트가져오기
    const firstSheet = workbook.Sheets[firstSheetName]; // [시트이름] 넣어주면
    // 첫번째 시트의 데이터를 json으로 가져온 후 객체로 변환
    const firstSheetJson = xlsx.utils.sheet_to_json(firstSheet);
    console.log(firstSheetJson);

    // 정렬된 값으로 넣어보기
    // 정렬기준은 이름 순
    const fsj = firstSheetJson // [ {a}, {b}, {c} ]
      .sort((a, b) => {
        return a.name < b.name; // 두 값을 비교해 두 값을 빼보면 ==> 마이너스 값이 나온다면 오름차순(1,2,4,6) / 내림차순 => 두값을 비교해 플러스 값이 나오면 내림차순 (6,4,2,1)
      });
    // 정렬된 배열을 다시 생성
    fsj.forEach(async (customer) => {
      let result = await mysql.query("customerInsert", customer);
    });

    // 반복문 활용, insert
    for (let row of firstSheetJson) {
      // await을 쓰는 이유는 비동기처리를 하게 되면 INSERT작업을 하기도 전에 아래의 처리완료가 뜰 가능성이 있음. 그러므로 db처리작업을 보장하기 위해 사용
      await mysql.query("customerInsert", row);
    }
    res.send("처리완료");
  } catch (err) {
    res.send("처리실패");
  }
});

app.get("/excel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "excel.html"));
});

// 추가  customerInsert
// 요청형태에 json으로 값 넘겨보기
app.post("/customer", async (req, res) => {
  try {
    console.log(req.body.param);
    let data = req.body.param;
    let result = await mysql.query("customerInsert", data);
    res.send(result);
  } catch (err) {
    res.send("에러발생=>", err);
  }
});

// customer 테이블에 있는 데이터를 엑셀파일로 export하기
// code made by ChatGPT
const fs = require("fs");

// 엑셀 다운로드 라우트
// GET /excel : customer 테이블 → 엑셀로 변환, excel_download 폴더에 저장, 다운로드
app.get("/exceldownload", async (req, res) => {
  try {
    // 1. DB 조회
    const customers = await mysql.query("customerList");

    // 2. 엑셀 워크북/시트 생성
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(customers);
    xlsx.utils.book_append_sheet(wb, ws, "Customers");

    // 3. 저장 경로 지정
    const fileName = `customers_${Date.now()}.xlsx`;
    // __dirname은 04_mysql 폴더를 가리킴
    const downloadFolder = path.join(__dirname, "excel_download");

    // 3-1. excel_download 폴더가 없으면 생성
    if (!fs.existsSync(downloadFolder)) {
      fs.mkdirSync(downloadFolder, { recursive: true });
    }

    const filePath = path.join(downloadFolder, fileName);

    // 4. 파일로 저장
    xlsx.writeFile(wb, filePath);

    // 5. 파일을 읽어서 다운로드 응답
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error("파일 다운로드 실패:", err);
        res.status(500).send("엑셀 다운로드 실패");
      } else {
        // (선택) 다운로드 후 파일 삭제
        // fs.unlinkSync(filePath);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("엑셀 다운로드 실패");
  }
});

// 수정  customerUpdate
app.put("/customer", async (req, res) => {
  try {
    let data = req.body.param;
    let result = await mysql.query("customerUpdate", data);
    res.send(result);
  } catch (err) {
    res.send("에러발생=>", err);
  }
});

// 삭제 customerDelete
// ex) http://localhost:3000/customer/8
// ex) http://localhost:3000/customer/8/hong/23
// 옛날방식 => http://localhost:3000/customer/?id=8&name=hong&point=10
app.delete("/customer/:id", async (req, res) => {
  try {
    console.log(req.params);
    let { id } = req.params; // id값 받기  // {id: 8} // id속성값을 받아옴
    let result = await mysql.query("customerDelete", id); // 객체가 아닌 값으로 넘김
    res.send(req.params);
  } catch (err) {
    res.send("에러발생=>", err);
  }
});

app.listen(3000, () => {
  console.log("http://localhost:3000 running");
});

// SELECT
// pool.query("select * from customers", (err, result) => {
//   if (err) {
//     console.log("처리중에러", err);
//   } else {
//     console.log(result);
//   }
// });

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

// // 객체로 INSERT
// pool.query("insert into customers set ?", data, (err, result) => {
//   if (err) {
//     console.log("처리중에러", err);
//   } else {
//     console.log(result);
//   }
// });

// // UPDATE
// pool.query("update customers set ? where id = ?", data, (err, result) => {
//   if (err) {
//     console.log("처리중에러", err);
//   } else {
//     console.log(result);
//   }
// });

// // DELETE
// pool.query("delete from customers where id = ?", 1, (err, result) => {
//   if (err) {
//     console.log("처리중에러", err);
//   } else {
//     console.log(result);
//   }
// });

// 쿼리정의
/* express모듈로 재정의함 */
// console.log(custSql["customerList"]); //customerList 보기
// function query(alias, values) {
//   pool.query(custSql[alias], values, (err, result) => {
//     if (err) {
//       console.log("처리중에러", err);
//     } else {
//       console.log(result);
//     }
//   });
// }

// 정의한 쿼리 함수로 SQL 작성

// query SELECT
// query("customerList");
// console.log("customerList");

// query Insert
// query("customerInsert", {
//   name: "홍길동",
//   email: "hong@email.com",
//   phone: "010-1111-2222",
//   address: "",
// });

// query Delete
// query("customerDelete", 5); // ← 5는 실제로 삭제할 id

// query Update
// query("customerUpdate", [
//   {
//     name: "수정할이름",
//     email: "new@email.com",
//     phone: "010-2222-3333",
//     address: "서울시",
//   },
//   5, // 이 부분에 실제로 수정할 id 값(예시로 5)
// ]);
