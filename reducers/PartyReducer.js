import {
    PARTY_ADD,
    PARTY_FETCH_SUCCESS,
    PARTY_REMOVE
} from "../actions/_types";

const INITIAL_STATE = {
    parties: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case PARTY_FETCH_SUCCESS:
            return {
                parties: action.payload
            }
        case PARTY_ADD:
            return {
                parties: [...state.parties, action.payload]
            }
        case PARTY_REMOVE:
            return {
                parties: state.parties.filter(party => party.watchPartyId !== action.payload)
            }

        default:
            return state;
    }
};
