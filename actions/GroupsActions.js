import { 
    GROUPS_TOGGLE_ADD_GROUP_OVERLAY,
    GROUPS_TOGGLE_ADDING_GROUP,
    GROUPS_ADD_NEW_GROUP_SUCCESS,
    GROUPS_TOGGLE_LOADING_MY_GROUPS,
    GROUPS_GET_MY_GROUPS,
    GROUPS_TOGGLE_LOADING_ALL_GROUPS,
    GROUPS_GET_ALL_GROUPS,
    GROUPS_JOIN_GROUP_SUCCESS,
    GROUPS_TOGGLE_JOINING_GROUP,
    GROUPS_ADD_NEW_GROUP_DETAILS,
    GROUPS_CLEAR_NEW_GROUP_DETAILS,
    GROUPS_TOGGLE_LOADING_GROUP,
    GROUPS_SELECT_GROUP,
    GROUPS_FETCH_GROUP_MEMBERS,
    GROUPS_FETCH_GROUP_MESSAGES,
    GROUPS_ATTEND_WATCH_PARTY,
    FETCH_MESSAGES } from './_types'

import {generateRandomString} from '../helpers/utils'

import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import crashlytics from '@react-native-firebase/crashlytics'
import { getUserProfile } from './AuthActions'
import { loadTeamGames } from './FavoriteTeamsActions'
import { subscribeToChannel, fetchMessages } from './ChatActions'

import {GeoFirestore, GeoCollectionReference} from 'geofirestore'

const db = firestore();
const geofirestore: GeoFirestore = new GeoFirestore(db);
const geocollection: GeoCollectionReference = geofirestore.collection('groups');


export const addNewGroupDetails = (key, value) => (dispatch) => {
    dispatch({
        type: GROUPS_ADD_NEW_GROUP_DETAILS,
        payload: {
            [key]: value
        }
    })
}

export const toggleAddGroupOverlay = () => (dispatch) => {
    dispatch({
        type: GROUPS_TOGGLE_ADD_GROUP_OVERLAY
    })
    dispatch({
        type: GROUPS_CLEAR_NEW_GROUP_DETAILS
    })
}

export const addNewGroup = (groupDetails) => async (dispatch) => {
    // console.log(`groupDetails`, groupDetails)
    dispatch({
        type: GROUPS_TOGGLE_ADDING_GROUP
    })

    try {
        let idToken = await auth().currentUser.getIdToken()
        let uid = await auth().currentUser.uid
        let userEmail = await auth().currentUser.email
        let groupId = generateRandomString(20)
        //TO DO CHECK FOR EXISTING GROUP NAME
        let addGroup = await geocollection.doc(groupId).set({
            ...groupDetails,
            members: [],
            owner: {
                uid: uid,
                email: userEmail
            }
        })
        let addToCreatorGroups = await firestore().collection('users2').doc(userId).update({
            groups: firestore.FieldValue.arrayUnion({groupId: groupId})
        })
        dispatch({
            type: GROUPS_TOGGLE_ADDING_GROUP
        })
        dispatch({
            type: GROUPS_TOGGLE_ADD_GROUP_OVERLAY
        })
        dispatch(getUserProfile())
    } catch (addGroupError) {
        console.log(`addGroupError`, addGroupError)
        crashlytics().recordError(addGroupError)
    }

}

export const joinGroup = (groupId) => async (dispatch) => {
    try {
        let currentUser = await auth().currentUser
        let uid = await auth().currentUser.uid;
        let userDetails = await firestore().collection('users2').doc(uid).get()
        let addUserToGroupResult = await firestore().collection('groups').doc(groupId)
            .update({
                members: firestore.FieldValue.arrayUnion({uid: uid, name: userDetails.data().username})
            })
        let addGroupToUserResult = await firestore().collection('users2').doc(uid)
            .update({
                groups: firestore.FieldValue.arrayUnion({ groupId: groupId })
            })
        dispatch(fetchGroup(groupId))
        dispatch(getUserProfile())
    } catch (joinGroupError) {
        console.log(`joinGroupError`, joinGroupError)
    }
}

export const leaveGroup = (groupId) => async (dispatch) => {
    try {
        let uid = await auth().currentUser.uid;
        let userDetails = await firestore().collection('users2').doc(uid).get()
        let removeUserFromGroupResult = await firestore().collection('groups').doc(groupId)
            .update({
                members: firestore.FieldValue.arrayRemove({uid: uid, name: userDetails.data().username})
            })
        let removeGroupFromUserResult = await firestore().collection('users2').doc(uid)
            .update({
                groups: firestore.FieldValue.arrayRemove({ groupId: groupId })
            })
        dispatch(fetchGroup(groupId))
        dispatch(getUserProfile())
    } catch (joinGroupError) {
        console.log(`joinGroupError`, joinGroupError)
    }

}

export const fetchAllGroups = (location) => async (dispatch) => {
    if (!location) {
        location = store.getState().location
    }
    const { longitude, latitude } = location.currentLocationCoordinates
    
    try {
        
    var _groups = {};
    let groupDocs = await geofirestore
      .collection('groups')
      .near({center: new firestore.GeoPoint(latitude, longitude), radius: 100})
      .get();

        groupDocs.forEach((doc) => {
            _groups[doc.id] = {...doc.data(), groupId: doc.id};
        });

        // ADD MEMBER OF FOR GROUPS THAT INCLUDE USER

        let currentUser = await auth().currentUser

        Object.keys(_groups).forEach(groupKey => {
            const group = _groups[groupKey]
            if (group.owner.uid === currentUser.uid) {
                _groups[groupKey].memberOf = true
            }
            if (group.members && group.members.length > 0) {
                group.members.filter(member => member.uid === currentUser.uid)
                if (group.members.length > 0) {
                    _groups[groupKey].memberOf = true;
                }
            }
            return _groups[groupKey].memberOf = false;
        })
        
        dispatch({
            type: GROUPS_GET_ALL_GROUPS,
            payload: _groups
        })

    } catch (getGroupsError) {
        console.log(`getGroupsError`, getGroupsError)
    }
}

export const fetchMyGroups = (userGroups) => async (dispatch) => {
    let groupIds = []
    let myGroupsArray = []
    try {
        // userGroups.forEach(group => {

        // })
        userGroups.forEach(group => {
            groupIds.push(group.groupId)
        })
        let myGroups = await firestore().collection('groups')
        .where(firestore.FieldPath.documentId(), "in", groupIds).get();
        if (myGroups && myGroups.docs.length > 0) {
            myGroups.docs.forEach(doc => {
                myGroupsArray.push({
                    groupId: doc.id,
                    ...doc.data(),
                    memberOf: true
                })
            });
            dispatch({
                type: GROUPS_GET_MY_GROUPS,
                payload: myGroupsArray
            })
            dispatch
        }
    } catch (fetchMyGroupsError) {
        console.log(`fetchMyGroupsError`, fetchMyGroupsError)
    }
}

export const fetchGroup = (groupId) => async (dispatch) => {
    dispatch({
        type: GROUPS_TOGGLE_LOADING_GROUP
    })
    try {
        
        let uid = await auth().currentUser.uid
        
        let selectedGroupDoc = await firestore().collection('groups').doc(groupId).get()
        let selectedGroup = selectedGroupDoc.data();
        selectedGroup.groupId = groupId;
        // GET FAVORITE BAR DETAILS
        let barDoc = await firestore().collection('bars2').doc(selectedGroup.favoriteBar).get()
        selectedGroup.barDetails = barDoc.data();
        let ownerDoc = await firestore().collection('users2').doc(selectedGroup.owner.uid).get();
        selectedGroup.owner = {
            ...selectedGroup.owner,
            ...ownerDoc.data()
        };
        // CHECK FOR USER'S MEMBERSHIP IN THE GROUP
        if (selectedGroup.members && selectedGroup.members.length > 0) {
            let members = [...selectedGroup.members]
            
            members.forEach(member => {
                if (member.uid === uid) {
                    selectedGroup.memberOf = true;
                }
            })
        }
        console.log('here')
        dispatch({
            type: GROUPS_SELECT_GROUP,
            payload: selectedGroup
        })
        if (selectedGroup.teams && selectedGroup.teams.length > 0) {
            dispatch(loadTeamGames(selectedGroup.teams[0]))
        }
        if (selectedGroup.members && selectedGroup.members.length > 0) {
            dispatch(fetchGroupMembers(selectedGroup.members))
        }
        // console.log('subscibing to channel')
        // dispatch(subscribeToChannel(uid, selectedGroup))
        // dispatch(fetchMessages(uid, [selectedGroup.groupId]))
    } catch (fetchGroupError) {
        console.log(`fetchGroupError`, fetchGroupError)
        crashlytics().recordError(addGroupError)
    }
}

export const fetchGroupMembers = (groupMembers) => async (dispatch) => {
    var memberPromises = []
    var memberDetails = []
    try {
        groupMembers.forEach(member => {
            memberPromises.push(firestore().collection('users2').doc(member.uid).get())
        })
        let memberDetailsResponse = await Promise.all(memberPromises)
        if (memberDetailsResponse && memberDetailsResponse.length > 0) {
            memberDetailsResponse.forEach(doc => {
                memberDetails.push(
                    {uid: doc.id,
                    ...doc.data()})
            })
        }
        console.log(`memberDetails`, memberDetails)
        dispatch({
            type: GROUPS_FETCH_GROUP_MEMBERS,
            payload: memberDetails
        })
    } catch (fetchGroupMembersError) {
        console.log(`fetchGroupMembersError`, fetchGroupMembersError)
    }
}

export const fetchGroupMessages = (groupId) => async (dispatch) => {
    try {
        let groupMessages = await firestore().collection('chatrooms').doc(groupId).get()
        let groupMessagesData = groupMessages.data()
        dispatch({
            type: 'GROUPS_FETCH_GROUP_MESSAGES',
            payload: groupMessagesData
        })
    } catch (fetchGroupMessagesError) {
        console.log(`fetchGroupMessagesError`, fetchGroupMessagesError)
    }
}

export const updateGroupLocation = (group) => async (dispatch) => {
    try {
        let geopoint = new firestore.GeoPoint(group.coordinates.latitude, group.coordinates.longitude)
        let updateResult = await geocollection.doc(group.groupId).update({
            coordinates: geopoint
        })
        console.log(`updateResult`, updateResult)
    } catch (updateGroupError) {
        console.log(`updateGroupError`, updateGroupError)
    }
}

export const attendWatchParty = (group, game, userId) => async (dispatch) => {
    const { gameId, startDateTime } = game
    const { groupId, watchParties } = group
    try {
        if (!watchParties || !watchParties[gameId]) {
            console.log('305')
            let setWatchParties = await firestore().collection('groups').doc(groupId).set({
                    watchParties: {
                        [gameId]: {
                            startDateTime,
                            attendees: [userId]
                        }
                    }
                }, { merge: true })
                console.log(`setWatchParties`, setWatchParties)
        } else {
            console.log('315')
                let addUserToWatchPartyResult = await firestore().collection('groups').doc(groupId).set({
                    watchParties:
                        {
                            [gameId]: {
                                attendees: firestore.FieldValue.arrayUnion(userId)
                            }
                        }
                }, { merge: true })
        }
    } catch (setWatchPartiesError) {
        console.log(`setWatchPartiesError`, setWatchPartiesError)
    }
}
