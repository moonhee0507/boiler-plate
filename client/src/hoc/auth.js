import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { auth } from "../_actions/user_action.js";
import { useNavigate } from "react-router-dom";

export default function (SpecificComponent, option, adminRoute = null) {
    // option null: 아무나 출입이 가능한 페이지, true: 로그인한 유저만 출입 가능한 페이지, false: 로그인한 유저는 출입 불가능한 페이지
    function AuthenticationCheck(props) {
        const dispatch = useDispatch();
        const navigate = useNavigate();

        useEffect(() => {
            // 페이지가 바뀔 때마다 dispatch가 작동해서 req를 날린다
            dispatch(auth()).then((res) => {
                console.log(res);
                // 로그인하지 않은 상태
                if (!res.payload.isAuth) {
                    if (option) {
                        // 로그인한 유저만 출입가능한 곳에 비로그인 유저가 진입한 경우 로그인 페이지로 가라
                        navigate("/login");
                    }
                } else {
                    // 로그인한 상태
                    // admin만 갈 수 있는 곳에 어드민계정이 아닌 유저가 진입한 경우 홈으로 가라
                    if (adminRoute && !res.payload.isAdmin) {
                        navigate("/");
                    } else {
                        // 로그인 유저가 출입할 수 없는 페이지에 진입한 경우 홈으로 가라
                        if (option === false) {
                            navigate("/");
                        }
                    }
                }
            });
            axios.get("/api/users/auth");
        }, []);

        return <SpecificComponent />;
    }

    return AuthenticationCheck;
}
