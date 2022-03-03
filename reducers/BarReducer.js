import {
    BAR_FETCH_TOGGLE_LOADING,
    BAR_FETCH_SUCCESS,
    BAR_ADD_LOADING,
    BAR_ADD_SUCCESS,
    BAR_ADD_REMOVE_TEAM,
    BAR_SUGGEST_BAR_UPDATE,
    BAR_SUBMITTING_SUGGESTION
 } from '../actions/_types'
const initialState = {
    selectedBarDetails: {
        isLoading: false
    },
    addingBar: false,
    addingBarSuccess: false,
    submittingSuggestion: false
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case BAR_FETCH_TOGGLE_LOADING:
        return { 
            ...state, 
            selectedBarDetails: {
                isLoading: !state.selectedBarDetails.isLoading
            },
            ...payload
        }
    case BAR_FETCH_SUCCESS:
        // console.log(`payload`, payload)
        return { 
            ...state, 
            selectedBarDetails: {
                isLoading: false,
                ...payload
            }
        }
    case BAR_SUGGEST_BAR_UPDATE:
        // console.log(`payload`, payload);
        return {
            ...state,
            selectedBarDetails: {
                ...state.selectedBarDetails,
                ...payload
            }
        }
    case BAR_SUBMITTING_SUGGESTION:
        return {
            ...state,
            submittingSuggestion: !state.submittingSuggestion
        }

    default:
        return state
    }
}
