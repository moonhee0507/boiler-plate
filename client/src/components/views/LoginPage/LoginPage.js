import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action.js";
import Auth from "../../../hoc/auth.js";

function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onEmailHandler = (e) => {
        setEmail(e.currentTarget.value);
    };

    const onPasswordHandler = (e) => {
        setPassword(e.currentTarget.value);
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();

        let body = {
            email: email,
            password: password,
        };

        dispatch(loginUser(body)).then((res) => {
            if (res.payload.loginSuccess) {
                navigate("/");
            } else alert("Error");
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
                <label>Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={onPasswordHandler}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Auth(LoginPage, false);
