import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import {ROSTER_FETCH_SUCCESS, ROSTER_ADD, ROSTER_REMOVE} from './_types';

export const getRoster = () => {
  return dispatch => {
    firestore()
      .collection('rosters')
      .doc(auth().currentUser.uid)
      .collection('users2')
      .get()
      .then(users => {
        var friends = [];
        users.forEach(function(doc) {
          friends.push({...doc.data(), _id: doc.id});
        });

        dispatch({
          type: ROSTER_FETCH_SUCCESS,
          payload: friends,
        });
      })
      .catch(function(error) {});
  };
};

export const addToRoster = (
  userId,
  username,
  avatar,
  selectedTeamId,
  teams,
) => {
  return dispatch => {
    const dateNow = new Date();
    var teamIds = teams.map(a => a.teamId);
    firestore()
      .collection('rosters')
      .doc(auth().currentUser.uid)
      .collection('users2')
      .doc(userId)
      .set({
        name: username,
        avatar: avatar,
        team: selectedTeamId,
        teams: teamIds,
        dateAdded: dateNow,
      })
      .then(function() {
        dispatch({
          type: ROSTER_ADD,
          payload: {
            _id: userId,
            name: username,
            avatar: avatar,
            addedFromTeam: selectedTeamId,
            teams: teamIds,
            dateAdded: dateNow,
          },
        });
      });
  };
};

export const removeFromRoster = userId => {
  return dispatch => {
    firestore()
      .collection('rosters')
      .doc(auth().currentUser.uid)
      .collection('users2')
      .doc(userId)
      .delete()
      .then(function() {
        dispatch({type: ROSTER_REMOVE, payload: userId});
      });
  };
};
