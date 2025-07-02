// crypto.js

// p94 crypto 암호 모듈
const crypto = require("crypto");

// sh512 방식의 해쉬
let pw = crypto.createHash("sha512").update("pw1234").digest("base64");
// console.log(pw);

// salting 암호화를 하여 해쉬값을 더 이해하기 어렵게 하기
const createSalt = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) {
        reject(err);
      }
      resolve(buf.toString("base64")); // falsy값이 아니라면 buf에 저장  // base64로 인코딩
    });
  });
};
//createSalt()
// .then((result) => console.log(result));

// salt방식으로 암호화
const createCryptoPassword = (plainPassword, salt) => {
  return new Promise((resolve, reject) => {
    // pbkdf2 암호화하는 함수 (평문 비밀번호, salt넣을 값, )
    crypto.pbkdf2(plainPassword, salt, 1000, 64, "sha512", (err, key) => {
      if (err) {
        reject(err);
      }
      resolve({ salt: salt, password: key.toString("base64") });
    });
  });
};

// 패스워드를 함수로 만들어보기
async function main() {
  // .then이 많아 질수록 .then안의 .then 형태로 많아져서 구현이 어려울수 있으니 await의 비동기 형태를 사용예정
  const salt = await createSalt();
  const pw = await createCryptoPassword("1111", salt);
  console.log(pw);
  console.log(pw.password);
}

main();
