const express = require("express");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: "./mysql/.env" });

const { query } = require("./mysql/index.js");
const bodyParser = require("body-parser");

const app = express();

// 업로드 경로 확인
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  // (현재경로기준으로) d:/dev/git../05_project 라는 곳에 uploads 폴더가 있느냐 없느냐를 확인
  fs.mkdirSync(uploadDir);
}

// body-parser
// express모듈이 body-parser에 포함되어 있음
app.use(express.json({ limit: "10mb" }));

app.listen(3000, () => {
  console.log(`npm install`);
  console.log("http://localhost:3000");
});

app.get("/", (req, res) => {
  res.send("Root Router");
});

// 파일업로드 페이지 라우트
app.get("/fileupload", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // 특징위치에 파일을 열어주기 위한 메소드  //__dirname => 현재 경로를 나타냄  // (path모듈) public이라는 폴더, 하위의 index.html을 열어줌
});

// 다운로드
app.get("/download/:productId/:fileName", (req, res) => {
  const { productId, fileName } = req.params;
  // 가져올 파일 경로
  const filepath = `${__dirname}/uploads/${productId}/${fileName}`;
  // 응답정보
  res.header("Content-Type", `image/${fileName.lastIndexOf(".")}`); // .기준으로 파일의 이름 파악
  if (!fs.existsSync(filepath)) {
    console.log("없는 파일 입니다.");
    res.send("파일이 없습니다.");
  } else {
    fs.createReadStream(filepath).pipe(res);
    console.log("다운로드 완료");
  }
});

// 업로드
app.post("/upload/:filename/:pid", (req, res) => {
  // {filename} => object destructuring or Array destructuring
  const { filename, pid } = req.params; // {filename: 'sample.jpg', product_id: 3 ....}
  // const filepath = `${__dirname}/${pid}/uploads/${filename}`; //  경로 형태 예시 .../05_project/uploads/sample.jpg
  let productDir = path.join(uploadDir, pid);
  if (!fs.existsSync(productDir)) {
    // (현재경로기준으로) d:/dev/git../05_project/uploads 라는 곳에 uploads 폴더가 있느냐 없느냐를 확인
    fs.mkdirSync(productDir);
  }
  const safeFilename = path.basename(filename); // 경로공격을 방지하기 위해// by chatGPT
  const filePath = path.join(uploadDir, pid, safeFilename);

  let data = req.body.data.slice(req.body.data.indexOf(";base64,") + 8); // 요청정보의 body의 data라는 속성을 저장 => index.html의 axios라이브러리의 값을 가져옴  // ";base64," 이후에 데이터를 넣어주려고 +8을 붙였음
  console.log(filePath);
  fs.writeFile(filePath, data, "base64", (err) => {
    if (err) {
      res.send("error");
    } else {
      res.send("success");
    }
  });
});
// 데이터 쿼리
app.post("/api/:alias", async (req, res) => {
  // localhost:3000/api/productList  => :alias부분에 미리 정의한 query넣으면 됨

  // console.log(req.params.alias);
  // console.log(req.body.param); // param: {"productname": .., "product_price":....... }
  // console.log(req.body.where);

  const result = await query(req.params.alias, req.body.param, req.body.where);
  res.send(result);
});
