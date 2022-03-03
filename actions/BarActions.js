import firestore from '@react-native-firebase/firestore'
import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'

import { generateRandomString } from '../helpers/utils'

import {
    BAR_FETCH_TOGGLE_LOADING,
    BAR_FETCH_SUCCESS,
    BAR_ADD_LOADING,
    BAR_ADD_SUCCESS,
    BAR_ADD_REMOVE_TEAM,
    BAR_SUGGEST_BAR_UPDATE,
    BAR_SUBMITTING_SUGGESTION
} from './_types'

export const getBarDetails = (barId) => async (dispatch) => {
    dispatch({
        type: BAR_FETCH_TOGGLE_LOADING
    })
    try {
        let doc = await firestore().collection('bars2').doc(barId).get()
        var barDetails = doc.data();
        barDetails.barId = barId;
        dispatch({
            type: BAR_FETCH_SUCCESS,
            payload: barDetails
        })
    } catch (getBarError) {
        console.log(`getBarError`, getBarError)
    }

}

export const updateBarDetails = (barDetails) => async (dispatch) => {
    dispatch({
        type: BAR_FETCH_TOGGLE_LOADING
    })
    try {
        await firestore().collection('bars2').doc(barDetails.barId).update({
            address: barDetails.address,
            phone: barDetails.phone,
            website: barDetails.website
        })
        
        dispatch(getBarDetails(barDetails.barId))
    } catch (updateError) {
        console.log(`updateError`, updateError)
    }
}

export const suggestBarUpdate = (key, value) => (dispatch) => {
    dispatch({
        type: BAR_SUGGEST_BAR_UPDATE,
        payload: {
            [key]: value
        }
    })
}

export const submitBarSuggestion = (barDetails) => async (dispatch) => {
    dispatch({
        type: BAR_SUBMITTING_SUGGESTION
    })
    try {
        let docId = generateRandomString(20)
        let suggestionResponse = await firestore().collection('suggestions').doc(docId).set({
            barId: barDetails.barId,
            isClosed: barDetails.isClosed,
            addedTeams: barDetails.addedTeams,
            removeTeam: barDetails.removeTeam
        })
        console.log(`suggestionResponse`, suggestionResponse)
        dispatch({
            type: BAR_SUBMITTING_SUGGESTION
        })
        dispatch(getBarDetails(barDetails.barId))
    } catch(submitSuggestionError) {
        console.log(`submitSuggestionError`, submitSuggestionError)
    }
}
