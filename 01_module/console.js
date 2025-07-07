// 01_module/console.js
// p78

// 내장 모듈
const { Console } = require("console"); // Console이라는 내장모듈안의 기능
const fs = require("fs");
// 외장 모듈
const express = require("express");

//  sample폴더 하위에 output.log 파일생성
const output = fs.createWriteStream("./sample/output.log", { flags: "a" }); // { flags: "a" } log내용안 누적
//  sample폴더 하위에 errlog.log 파일생성
const errlog = fs.createWriteStream("./sample/errlog.log", { flags: "a" });

const logger = new Console({
  stdout: output,
  stderr: errlog,
});

logger.log("로그기록하기");
logger.error("에러로그 기록하기");
console.log("end ");
