import User from "../models/User.js";

let auth = (req, res, next) => {
    // 인증처리하는 곳
    // 클라이언트 쿠키에서 토큰을 가져옴
    let token = req.cookies.x_auth;

    // 토큰을 복호화하고 유저를 찾는다(User 모델에서 메서드를 만듦)
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true });

        // err도 아니고 user도 있으면 req로 token과 user를 값으로 사용할 수 있게 처리해준다
        req.token = token;
        req.user = user;

        next();
    });
    // 유저가 있으면 인증 OK
    // 유저가 없으면 인증 No
};

export default auth;
