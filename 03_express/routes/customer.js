const express = require("express");
const router = express.Router(); // instance생성
// 라우팅정보
// CRUD

// GET요청
router.get("/customer", (req, res) => {
  res.send("/customer 루트디렉토리");
});

// POST요청
router.post("/insert", (req, res) => {
  res.send("/customer POST 요청.");
});

// PUT요청
router.put("/update", (req, res) => {
  res.send("/customer PUT 요청.");
});

// DELETE요청
router.delete("/delete", (req, res) => {
  res.send("/customer DELETE 요청.");
});

module.exports = router;
