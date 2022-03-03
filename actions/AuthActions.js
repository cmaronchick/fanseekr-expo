import { Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore'
import crashlytics from '@react-native-firebase/crashlytics'
import auth from '@react-native-firebase/auth'
import { GeoCollectionReference, GeoFirestore, } from 'geofirestore';

const db = firestore();
const geofirestore: GeoFirestore = new GeoFirestore(db);
const geocollection: GeoCollectionReference = geofirestore.collection('users2');
import citiesList from "../data/cities.json";

import NavigationService from '../NavigationService';
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
    TEAMS_FAV_FETCH_SUCCESS,
    FCM_TOKEN_CHANGED
} from './_types';

import { fetchMyGroups } from './GroupsActions'
import { addChatroomListeners } from './ChatActions';

export const emailChanged = text => {
    return {
        type: EMAIL_CHANGED,
        payload: text
    };
};

export const usernameChanged = text => {
    return {
        type: USERNAME_CHANGED,
        payload: text
    };
};

export const passwordChanged = text => {
    return {
        type: PASSWORD_CHANGED,
        payload: text
    };
};

export const loginUser = ({ email, password }) => {
    return dispatch => {
        dispatch({ type: LOGIN_USER });

        auth()
            .signInWithEmailAndPassword(email, password)
            .then(user => {
                crashlytics().log('User signed in')
                return Promise.all([
                    crashlytics().setUserId(user.uid),
                    crashlytics().setAttribute({
                        email: user.email,
                        username: user.username
                    })
                ])
            })
            .then(() => {
                loginUserSuccess(dispatch);
            })
            .catch((e) => {
                console.log(e);
                loginUserFail(dispatch)
            });
    };
};

export const signUp = ({ username, email, password }) => {
    return dispatch => {
        dispatch({ type: SIGNUP_USER });

        db.collection('users2').where("username", "==", username).get().then(function (existingUser) {
            if (existingUser.docs.length > 0) {
                signUpUserFail(dispatch, "Username already exists.");
            } else {
                auth().createUserWithEmailAndPassword(email, password)
                    .then((user) => {
                        auth().currentUser.sendEmailVerification();
                        signUpUserSuccess(dispatch, username);
                    })
                    .catch((e) => {
                        signUpUserFail(dispatch, e.message)
                    });
            }
        })
    };
};

export const resetPassword = ({ email }) => {
    return dispatch => {
        dispatch({ type: SIGNUP_USER });

        auth().sendPasswordResetEmail(email)
            .then(function () {
                Alert.alert(
                    '',
                    'Please check your e-mail to reset your password.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                            },
                            style: 'cancel'
                        }
                    ]
                );
                dispatch({
                    type: LOGIN_USER_SUCCESS
                });
            }).catch(function (e) {
                Alert.alert(
                    '',
                    'Account not found.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                            },
                            style: 'cancel'
                        }
                    ]
                );
                dispatch({
                    type: LOGIN_USER_SUCCESS
                });
            })
    };
};

const signUpUserSuccess = (dispatch, username) => {
    dispatch({
        type: LOGIN_USER_SUCCESS
    });
    var _loc = citiesList.find(x => x.id == 'BAY');

    geocollection.doc(auth().currentUser.uid).set({
        username: username,
        email: auth().currentUser.email,
        location: 'BAY',
        tagline: '',
        favoriteAthlete: '',
        leastFavoriteAthlete: '',
        mostHatedTeam: '',
        favoriteSport: '',
        avatar: '',
        teams: [],
        isAdmin: auth().currentUser.email.split('@')[1] == 'fanseekr.com',
        coordinates: new firestore.GeoPoint(_loc.coordinates.latitude, _loc.coordinates.longitude)
    });

    db.collection("users_dismissed").doc(auth().currentUser.uid).set({
        users: []
    });

    NavigationService.navigate('TeamSelect');
};

const signUpUserFail = (dispatch, error) => {
    dispatch({
        type: SIGNUP_FAIL,
        payload: error
    });
}

const loginUserFail = dispatch => {
    dispatch({
        type: LOGIN_USER_FAIL
    });
};
const loginUserSuccess = (dispatch) => {
    dispatch({
        type: LOGIN_USER_SUCCESS
    });

    NavigationService.navigate('Home');
};

export const setUserProfile = (user) => {
    return dispatch => {
        dispatch({
            type: GET_USER_PROFILE_SUCCESS,
            payload: user
        });

        dispatch({
            type: TEAMS_FAV_FETCH_SUCCESS,
            payload: user.teams
        });
    }
}

export const logoutUser = () => {
    return dispatch => {
        dispatch({
            type: "logout_user",
            payload: {}
        });
    }
}

export const toggleLoginUser = () => (dispatch) => {
    dispatch({
        type: LOGIN_USER
    })
}

export const getUserProfile = () => async (dispatch) => {
    try {
        let user = await db.collection('users2').doc(auth().currentUser.uid).get()
        let currentUser = await auth().currentUser;
            dispatch({
                type: GET_USER_PROFILE_SUCCESS,
                payload: {
                    email: currentUser._user.email,
                    uid: currentUser._user.uid,
                    ...user.data()}
            });

            dispatch({
                type: TEAMS_FAV_FETCH_SUCCESS,
                payload: user.data().teams
            });
            if (user.data().groups && user.data().groups.length > 0) {
                const groups = user.data().groups;
                dispatch(fetchMyGroups(user.data().groups))
                console.log(`user.data().chatrooms`, user.data().chatrooms)
                dispatch(addChatroomListeners(currentUser._user.uid, user.data().chatrooms))
            }
    } catch(error) {
            console.error("Error writing document: ", error);
    };
};

export const updateUserProfile = (profile) => {
    return dispatch => {
        dispatch({
            type: GET_USER_PROFILE_SUCCESS,
            payload: profile
        });
    };
};

export const updateUserFCMToken = (token) => {
    return dispatch => {
        dispatch({
            type: FCM_TOKEN_CHANGED,
            payload: token
        });
    };
};

