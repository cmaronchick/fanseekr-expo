import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import {
    PARTY_REMOVE,
    PARTY_ADD,
    PARTY_FETCH_SUCCESS
} from './_types';

export const getUsersParties = () => {
    return dispatch => {
        firestore().collection('users_watchparty').doc(auth().currentUser.uid).collection('parties').get()
            .then(data => {
                var parties = [];

                data.forEach(function (doc) {
                    parties.push({ watchPartyId: doc.id, ...doc.data() });
                });
                console.log(parties);
                dispatch({
                    type: PARTY_FETCH_SUCCESS,
                    payload: parties
                });
            })
            .catch(function (error) {
                console.log(error);
            })
    };
};

export const addParty = (selectedBar, game) => {
    return (dispatch, getState) => {
        const state = getState()

        //write to BARS collection
        const barRef = firestore().collection('bars').doc(state.location.currentLocation).collection('markers').doc(selectedBar.barId).collection('parties').doc(game.gameId);

        firestore().runTransaction(transaction => {
            return transaction.get(barRef).then(doc => {
                if (doc.exists) {
                    var attendees = doc.data().usersAttending;
                    attendees.push({
                        userId: auth().currentUser.uid,
                        name: state.auth.userProfile.username,
                        avatar: state.auth.userProfile.avatar
                    });

                    transaction.update(barRef, { usersAttending: attendees });
                } else {
                    var attendees = [];
                    attendees.push({
                        userId: auth().currentUser.uid,
                        name: state.auth.userProfile.username,
                        avatar: state.auth.userProfile.avatar
                    });

                    transaction.set(barRef, { ...game, usersAttending: attendees });
                }

                //write to USERS_WATCHPARTY collection
                var watchPatchPartyId = selectedBar.barId + "_" + game.gameId;
                game.bar = selectedBar;
                game.watchPartyId = watchPatchPartyId;

                firestore().collection('users_watchparty').doc(auth().currentUser.uid).collection('parties').doc(watchPatchPartyId).set(game).then(() => {
                    dispatch({
                        type: PARTY_ADD,
                        payload: game
                    });
                })
            });
        });
    };
};

export const removeParty = (selectedBar, game) => {
    return (dispatch, getState) => {
        const state = getState()

        //write to BARS collection
        const barRef = firestore().collection('bars').doc(state.location.currentLocation).collection('markers').doc(selectedBar.barId).collection('parties').doc(game.gameId);

        firestore().runTransaction(transaction => {
            return transaction.get(barRef).then(doc => {
                var attendees = doc.data().usersAttending;

                var index = attendees.findIndex(obj => obj.userId === auth().currentUser.uid);
                attendees.splice(index, 1);
                transaction.update(barRef, { usersAttending: attendees });

                //write to USERS_WATCHPARTY collection
                var watchPatchPartyId = selectedBar.barId + "_" + game.gameId;
                firestore().collection('users_watchparty').doc(auth().currentUser.uid).collection('parties').doc(watchPatchPartyId).delete().then(() => {
                    dispatch({
                        type: PARTY_REMOVE,
                        payload: watchPatchPartyId
                    });
                })
            });
        });
    };
};