// fetchAPI.js

// fetch에서 딱히 옵션지정을 하지 없았다면 GET방식
// fetch를 통해 순서대로 .then .then방식으로 진행

// function json_func() {
//   fetch("http://localhost:3000/posts", {
//     method: "post",
//     Headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ id: 9, title: "fetch연습", author: "admin" }),
//   })
//     .then((resolve) => resolve.json()) // js으로 받은 값을 json으로 변환
//     .then((result) => {
//       console.log("결과=>", result); // 삭제된 결과를 보여줌
//       return fetch("http://localhost:3000/posts"); // 조회
//     })
//     .then((resolve) => resolve.json())
//     .then((result) => console.log(result))
//     .catch((err) => console.error(err));
// }

// async await를 사용하여 동기방식으로 처리
// .then방식 제거되어 복잡함이 줄어듦
// async function json_func() {
//   let promise = await fetch("http://localhost:3000/posts", {
//     method: "post",
//     Headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ id: 9, title: "fetch연습", author: "admin" }),
//   });
//   let resolve = await promise.json(); // promise가 끝날때까지 기다림
//   console.log("결과=>", resolve); // return해줄값이 없어 await사용이 안됨
//   // 조회
//   promise = await fetch("http://localhost:3000/posts");
//   resolve = await promise.json();
//   console.log("조회=>", resolve);
// }

// put요청 p108
// try-catch까지
async function json_func() {
  try {
    let promise = await fetch("http://localhost:3000/posts/2", {
      method: "put",
      Headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "5", title: "2번수정", author: "two" }),
    });
    let resolve = await promise.json(); // promise가 끝날때까지 기다림
    console.log("결과=>", resolve); // return해줄값이 없어 await사용이 안됨
    // 조회
    promise = await fetch("http://localhost:3000/posts");
    resolve = await promise.json();
    console.log("조회=>", resolve);
  } catch (err) {
    console.log(err);
  }
}

// 함수호출
json_func();
