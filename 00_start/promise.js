// p58
// promise.js
const promise = new Promise(function (resolve, reject) {
  // resolve => 성공했을때 / reject => 실패했을때
  let run = parseInt(Math.random() * 2);
  // JS에서는 falsy 존재 => 0, null, "", undefined // 이외에는 truty

  // setTimeout을 이용해 1초(1000ms) 뒤에 실행될 함수 등록
  setTimeout(function () {
    if (run) {
      resolve({ id: "user", name: "회원" }); // 1초 후, Promise를 실패 상태로 만들면서 "error"라는 에러 메시지 전달
    } else {
      reject(new Error("에러호출"));
    }
  }, 1000); // 1000ms(1초) 후에 위 함수 실행
});

// 서버에서 페이지를 잘 전달하거나 안되거나 할때 사용함
// promise는 정상적으로 처리가 된다면 .then의 정의된 함수로 전달됨
// 비동기방식으로 작동
promise
  .then(function (result) {
    // Promise가 성공(resolve)하면 result로 값이 전달되어 이 코드가 실행됨
    console.log(result);
  })
  .catch(function (err) {
    // Promise에서 에러(reject)가 발생하면 err로 에러 값이 전달되어 이 코드가 실행됨
    console.log(err);
  });

// ajax call
fetch(
  "https://jeongkyeongjun.postman.co/workspace/3461b914-2d4f-41c9-8c64-f24308da11f5/request/45560951-edf6f244-dc04-42e6-a962-02a67c0332d1?action=share&source=copy-link&creator=45560951&ctx=documentation"
) //
  .then((json) => json.json()) //
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.error(err));
