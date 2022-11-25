import express, { application } from "express";
import "dotenv/config";
import mongoose from "mongoose";
import User from "./models/User.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import auth from "./middleware/auth.js";

const app = express();
const port = 5000;

// application/x-www-form-urlencoded를 분석해준다
app.use(bodyParser.urlencoded({ extended: true }));

// application/json를 분석해준다
app.use(bodyParser.json());

// express에서 cookie를 사용한다
app.use(cookieParser());

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("몽고DB 연결 중..."))
    .catch((e) => console.error(e));

app.get("/", (req, res) => res.send("안녕하세요🥰 노드몬 좋으네요."));
app.get("/api/hello", (req, res) => {
    res.send("axios 테스트 중...");
});

// 회원가입을 위한 라우트
app.post("/api/users/register", (req, res) => {
    // 인스턴스를 만들어서 DB에 넣는다
    const user = new User(req.body);
    //몽고DB 메서드 save
    user.save((err, userInfo) => {
        // err은 에러메시지, 성공시 userInfo 전달
        if (err) return res.json({ success: false, err });
        return res.status(200).json({ success: true });
    });
});

app.post("/api/users/login", (req, res) => {
    // 요청된 email을 DB에서 찾기
    // findOne은 몽고DB 메서드
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다.",
            });
        }

        // email이 DB에 있다면 비밀번호가 같은지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) {
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다.",
                });
            }
            // 비밀번호까지 맞다면 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 토큰을 쿠키에 저장
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id });
            });
        });
    });
});

app.get("/api/users/auth", auth, (req, res) => {
    // middleware를 통과하면 시작
    console.log("미들웨어ㅓㅓ");
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true, // role이 0이면 일반유저, 아니면 관리자
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

app.get("/api/users/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({ success: true });
    });
});

app.listen(port, () => console.log(`${port} 실행 중...`));
