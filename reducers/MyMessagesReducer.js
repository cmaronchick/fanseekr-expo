import {
    MESSAGES_FETCH_SUCCESS,
    MESSAGES_ADD,
    MESSAGES_REMOVE
} from "../actions/_types";

const INITIAL_STATE = {
    messages: [{
        avatar: '',
        chatId: '',
        teamId: '',
        userId: '',
        username: ''
    }],
    hasUnreadMsg: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MESSAGES_FETCH_SUCCESS:
            return {
                ...state,
                messages: action.payload.messages,
                hasUnreadMsg: action.payload.hasUnreadMsg
            }
        case MESSAGES_ADD:
            return {
                ...state,
                messages: [...state.messages, action.payload]
            }
        case MESSAGES_REMOVE:
            return {
                ...state,
                messages: [...state.messages.filter(dm => dm.userId !== action.payload)]
            }

        default:
            return state;
    }
};
