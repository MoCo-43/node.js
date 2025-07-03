const { Router } = require("express");
const router = Router(); // customer.js의 express모듈 요청과 같은형태

// 라우팅정보
// GET요청
router.get("/product", (req, res) => {
  res.send("/products 루트디렉토리");
});

// POST요청
router.post("/insert", (req, res) => {
  res.send("/products POST 요청.");
});

// PUT요청
router.put("/update", (req, res) => {
  res.send("/products PUT 요청.");
});

// DELETE요청
router.delete("/delete", (req, res) => {
  res.send("/products DELETE 요청.");
});

module.exports = router;
