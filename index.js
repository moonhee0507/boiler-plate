import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import User from "./models/User.js";
import bodyParser from "body-parser";

const app = express();
const port = 5000;
const isHeroku = process.env.NODE_ENV; // 개발환경인지 프로덕션환경인지

const middleware = (req, res, next) => {
    res.locals.isHeroku = isHeroku;
    next();
};

app.use(middleware);

// application/x-www-form-urlencoded를 분석해준다
app.use(bodyParser.urlencoded({ extended: true }));

// application/json를 분석해준다
app.use(bodyParser.json());

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("몽고DB 연결 중..."))
    .catch((e) => console.error(e));

app.get("/", (req, res) => res.send("안녕하세요🥰 노드몬 좋으네요."));

// 회원가입을 위한 라우트
app.post("/register", (req, res) => {
    // 인스턴스를 만들어서 DB에 넣는다
    const user = new User(req.body);
    //몽고DB 메서드 save
    user.save((err, userInfo) => {
        // err은 에러메시지, 성공시 userInfo 전달
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
    });
});

app.listen(port, () => console.log(`${port} 실행 중...`));
