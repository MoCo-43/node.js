// fetchAPI.js

// fetch에서 딱히 옵션지정을 하지 없았다면 GET방식
fetch("http://localhost:3000/posts/", {
  method: "post",
  Headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 9, title: "fetch연습", author: "admin" }),
})
  .then((resolve) => resolve.text())
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.err(err));
