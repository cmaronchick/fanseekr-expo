import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import {
    BLOCKED_FETCH_SUCCESS,
    BLOCKED_ADD,
    BLOCKED_REMOVE
} from './_types';

export const getBlockedUsers = () => {
    return dispatch => {
        firestore().collection('users_blocked').doc(auth().currentUser.uid).get()
            .then(blocked => {
                var blockedUsers = [];
                if (blocked.exists) {
                    blockedUsers = blocked.data().users;
                }
                dispatch({
                    type: BLOCKED_FETCH_SUCCESS,
                    payload: blockedUsers
                });
            })
            .catch(function (error) {
                console.log(error);
            })
    };
};

export const addBlockedUser = (userId, username) => {
    return dispatch => {
        firestore().collection('users_blocked').doc(auth().currentUser.uid).set({
            users: firebase.firestore.FieldValue.arrayUnion({ userId: userId, username: username })
        }, { merge: true }
        ).then(function () {
            dispatch({
                type: BLOCKED_ADD,
                payload: { userId: userId, username: username }
            });
        })
    };
};

export const removeBlockedUser = (userId, username) => {
    return dispatch => {
        firestore().collection('users_blocked').doc(auth().currentUser.uid).set({
            users: firebase.firestore.FieldValue.arrayRemove({ userId: userId, username: username })
        }, { merge: true }
        ).then(function () {
            dispatch({
                type: BLOCKED_REMOVE,
                payload: { userId: userId, username: username }
            });
        })
    };
};