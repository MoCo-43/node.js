const url = new URL(
  "https://user:pass@sum.example.com:8080/a/b/c?query=name&num=1#node"
);
const params = url.searchParams;

console.log(url);
console.log(params.get("query")); // req.gerParameter의 형태와 비슷함
console.log(params.get("num"));
