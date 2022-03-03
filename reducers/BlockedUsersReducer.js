import {
    BLOCKED_FETCH_SUCCESS,
    BLOCKED_ADD,
    BLOCKED_REMOVE
} from "../actions/_types";

const INITIAL_STATE = {
    users: [{ userId: '', username: '' }]
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BLOCKED_FETCH_SUCCESS:
            return {
                users: action.payload
            }
        case BLOCKED_ADD:
            return {
                users: [...state.users, action.payload]
            }
        case BLOCKED_REMOVE:
            return {
                users: [...state.users.filter(user => user.userId !== action.payload.userId)]
            }

        default:
            return state;
    }
};
