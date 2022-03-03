import {
    EMAIL_CHANGED,
    USERNAME_CHANGED,
    PASSWORD_CHANGED,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAIL,
    LOGIN_USER,
    SIGNUP_USER,
    SIGNUP_FAIL,
    GET_USER_PROFILE_SUCCESS,
    FCM_TOKEN_CHANGED
} from "../actions/_types";

const INITIAL_STATE = { email: '', password: '', userProfile: {}, error: '', loading: false };

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case EMAIL_CHANGED:
            return { ...state, error: '', email: action.payload };
        case USERNAME_CHANGED:
            return { ...state, error: '', username: action.payload };
        case PASSWORD_CHANGED:
            return { ...state, error: '', password: action.payload };
        case LOGIN_USER:
            return { ...state, loading: true, error: '' }
        case SIGNUP_USER:
            return { ...state, loading: true, error: '' } //show loading, clear error
        case LOGIN_USER_SUCCESS:
            return {
                ...state, loading: false, error: ''
            }
        case GET_USER_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                userProfile: action.payload
            }
        case LOGIN_USER_FAIL:
            return { ...state, error: 'Authentication Failed.', loading: false }
        case SIGNUP_FAIL:
            return { ...state, error: action.payload, loading: false }
        case FCM_TOKEN_CHANGED:
            return { ...state, userProfile: { ...state.userProfile, fcmToken: action.payload } }
        default:
            return state;
    }
};
