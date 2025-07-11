const express = require("express");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config({ path: "./mysql/.env" });

const { query } = require("./mysql/index.js");
const bodyParser = require("body-parser");

const app = express();

// body-parser
// express모듈이 body-parser에 포함되어 있음
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log(`npm install`);
  console.log("http://localhost:3000");
});

app.get("/", (req, res) => {
  res.send("Root Router");
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

// 데이터 쿼리
app.post("/api/:alias", async (req, res) => {
  // localhost:3000/api/productList  => :alias부분에 미리 정의한 query넣으면 됨

  // console.log(req.params.alias);
  // console.log(req.body.param); // param: {"productname": .., "product_price":....... }
  // console.log(req.body.where);

  const result = await query(req.params.alias, req.body.param, req.body.where);
  res.send(result);
});

// todo목록.
app.get("/todoList", async (req, res) => {
  const result = await query("todoList");
  console.log(result);
  res.json(result);
});

// todo삭제.
app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query("todoDelete", id);
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});

// todo삽입
app.post("/todoAdd/:name/:chk", async (req, res) => {
  const { name, chk } = req.body;
  const result = await query("todoInsert", name, chk);
  res.json(result);
  console.log({ name, chk });
});
