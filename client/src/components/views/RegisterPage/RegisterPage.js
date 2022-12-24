import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Auth from "../../../hoc/auth.js";
import { registerUser } from "../../../_actions/user_action.js";

function RegisterPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    };

    const onNameHandler = (e) => {
        setName(e.currentTarget.value);
    };

    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value);
    };

    const onConfirmPasswordHandler = (e) => {
        setConfirmPassword(e.currentTarget.value);
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return alert("비밀번호와 비밀번호 확인이 같아야 합니다.");
        }

        let body = {
            email: email,
            name: name,
            password: password,
        };

        dispatch(registerUser(body)).then((res) => {
            if (res.payload.success) {
                navigate("/login");
            } else {
                alert("Fail to sign-up!");
            }
        });
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100vh",
            }}
        >
            <form
                style={{ display: "flex", flexDirection: "column" }}
                onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={email} onChange={onEmailHandler} />

                <label>Name</label>
                <input type="test" value={name} onChange={onNameHandler} />

                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={onPasswordHandler}
                />

                <label>Confirm Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={onConfirmPasswordHandler}
                />
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
}

export default Auth(RegisterPage, false);
