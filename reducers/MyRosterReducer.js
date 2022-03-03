import {
    ROSTER_FETCH_SUCCESS,
    ROSTER_ADD,
    ROSTER_REMOVE
} from "../actions/_types";

const INITIAL_STATE = {
    users: [{
        _id: '',
        name: '',
        avatar: '',
        team: '',
        dateAdded: ''
    }]
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ROSTER_FETCH_SUCCESS:
            return {
                ...state,
                users: action.payload
            }
        case ROSTER_ADD:
            return {
                ...state,
                users: [...state.users, action.payload]
            }
        case ROSTER_REMOVE:
            return {
                ...state,
                users: [...state.users.filter(user => user._id !== action.payload)]
            }

        default:
            return state;
    }
};
