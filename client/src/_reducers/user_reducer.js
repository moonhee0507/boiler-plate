import { LOGIN_USER, REGISTER_USER, AUTH_USER } from "../_actions/types.js";

export default function user(state = {}, action) {
    switch (action.type) {
        case LOGIN_USER:
            return { ...state, loginSuccess: action.payload }; // 빈 state를 가져오고 그 안에 loginSuccess: ...를 넣는다
            break;

        case REGISTER_USER:
            return { ...state, register: action.payload };
            break;

        case AUTH_USER:
            return { ...state, userData: action.payload }; // 유저의 모든 데이터가 들어가 있다
            break;

        default:
            return state;
    }
}
