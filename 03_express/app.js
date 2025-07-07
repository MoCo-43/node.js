// 서버 프로그램
// app.js

const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser"); // p129 body-parser 미들웨어 모듈
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const customerRoute = require("./routes/customer");
const productRoute = require("./routes/product");
const app = express(); // express서버의 instance생성

app.get("/", (req, res) => {
  // readFile 파일위치, 인코딩방식, callback함수
  fs.readFile("./public/index.html", "utf-8", (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data);
  });
});

// 파일업로드 Multer
// 저장경로와 파일명 지정
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
  // html에서 accept처리 후 이미지만 업로드할 수 있도록
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const mimetype = /jpg|jpeg|png|gif/.test(file.mimetype); // / | | / 안의 문자가 있는지 없는지 여부를 받는 변수
    if (mimetype) {
      return cb(null, true);
    }
    return cb("Error", false);
  },
});

// 동일출처 원칙
// app.use(cors());  // 모든 서버에서 요청 허락
app.use(cors({ origin: "http://192.168.0.26:5500/" }));

// 동일출처원칙
// 보안상의 이유로 호스트, 포트까지 다 같아야 동일한 리소스에서 요청을 해야 결과값을 가져온다. 동일출처법칙 위배(app.js 참고)
app.get("/getCors", (req, res) => {
  let result = { id: "user01", name: "hong" };
  res.json(result);
});

// 첨부파일 업로드 화면(라우팅정보)
app.get("/upload", (req, res) => {
  fs.readFile("./public/upload.html", "utf-8", (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data);
  });
});

// express에서 에러처리하기위한 미들웨어
app.use((err, req, res, next) => {
  console.log(err, req, res);
  next();
});

// 첨부처리
// .single 파일 하나만 처리
app.post("/upload", upload.array("myFile"), (req, res) => {
  try {
    console.log(req.files); // 업로드된 파일의 정보
    console.log(req.body); // 요청몸체의 정보
    if (!req.file) {
      res.send("이미지 처리가능함.");
    } else {
      res.send("업로드 완료");
    }
  } catch (err) {
    console.log("err04", err);
  }
});

// bodyParser => bodyParser가 json이라고 정의
// application/json
app.use(bodyParser.json());

// postman에 그냥 요청하면 undefined로 정의 됨 그래서
// application/x-www-form-urlencoded
// 중첩된 객체로 표현하기{ extended: true }
app.use(bodyParser.urlencoded({ extended: true }));

// bodyParser를 활용해서 요청정보의 body정보를 해석
// bodyParser json-data 요청
// bodyParser url/json-data post방식으로 전달
app.post("/json-data", (req, res) => {
  console.log(req.body);
  res.send("json요청");
});

// bodyParser form-data 요청
app.post("/form-data", (req, res) => {
  console.log(req.body);
  res.send("form-data 요청");
});

// 라우팅정보를 파일을 분리(추후 DB를 연결해서 사용예정)
app.use("/customer", customerRoute);
app.use("/product", productRoute);

// listen(3000포트로 실행, callbacak함수 실행)
app.listen(3000, () => {
  console.log("http://localhost:3000 서버실행");
});

// routes product 분리 전 코드
// 한파일에 저장하면 복잡해지고 에러가 날 가능성이 있으니 파일 분리
// router 정보 먼저 분리 => /routes

/*
const express = require("express");
const fs = require("fs");
const app = express(); // express서버의 instance생성


// 요청(req), 응답(res)  => 핸들러
// 라우팅처리 p117
app.get("/", (req, res) => {
  // readFile 파일위치, 인코딩방식, callback함수
  fs.readFile("./public/index.html", "utf8", (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data);
  });
});


// get요청
app.get("/customer", (req, res) => {
  res.send("/customer 경로입니다.");
});

// post요청
app.post("/customer", (req, res) => {
  // send는 기본적으로 text값을 보냄
  // res.send("/customer 경로의 post요청입니다.");

  // json형태로 보냄
  res.json({ id: 10, name: "hongkildong" });
});




// listen(3000포트로 실행, callbacak함수 실행)
app.listen(3000, () => {
  console.log("http://localhost:3000 서버실행");
});



*/
