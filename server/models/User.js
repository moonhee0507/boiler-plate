import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    },
});

// 유저 모델에 저장하기 전에 콜백함수 처리
userSchema.pre("save", function (next) {
    // 비밀번호 암호화(bcrypt로 Salt 이용)
    var user = this;

    // 다른정보 말고 비밀번호가 바뀔 때만 암호화하기
    if (user.isModified("password")) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, function (err, hash) {
                // hash는 암호화된 비밀번호
                if (err) return next(err);
                // 비밀번호 DB에 hash 저장
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

// comparePassword메서드 만들기
userSchema.methods.comparePassword = function (plainPassword, cb) {
    //plainPassword 1234567    암호화된 비밀번호 $2bskdfsdfl---
    bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// generateToken메서드 만들기
userSchema.methods.generateToken = function (cb) {
    var user = this;
    // jsonwebtoken을 이용해서 토큰 생성
    var token = jwt.sign(user._id.toHexString(), "secretToken");
    user.token = token;
    user.save(function (err, user) {
        if (err) return cb(err);
        cb(null, user);
    });
};

// findByToken메서드 만들기
// statics는 methods와 다르게 객체의 인스턴스를 만들지 않아도 사용가능하다. 자주 쓰이는 함수에서 많이 쓴다...
userSchema.statics.findByToken = function (token, cb) {
    var user = this;

    // 토큰을 decode한다(jsonwebtoken 라이브러리 사용)
    jwt.verify(token, "secretToken", function (err, decoded) {
        // 유저아이디를 이용해서 유저를 찾은 다음에(몽고DB 메서드 findOne 사용)
        // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({ _id: decoded, token: token }, function (err, user) {
            if (err) return cb(err);
            cb(null, user);
        });
    });
};

const User = mongoose.model("User", userSchema);

export default User;
