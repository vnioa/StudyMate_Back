const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");
require("./config/db"); // DB 연결

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// 기본 라우트
app.get("/", (req, res) => {
    res.send("서버 실행 중");
})

// API 라우트 설정
app.use("/api", routes);

module.exports = app;