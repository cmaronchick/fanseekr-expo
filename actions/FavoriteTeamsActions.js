import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { _getTeamsFromLocal } from '../helpers/asyncStorage'
import schedule from '../data/schedule.json'
import moment from "moment";

import {
    TEAMS_FAV_FETCH_SUCCESS,
    TEAMS_FAV_SELECTED,
    TEAMS_FETCH_GAMES_SUCCESS
} from './_types';
import { fetchMessages } from './ChatActions';

export const getFavoriteTeams = () => async (dispatch) => {
    try {    
        var user = auth().currentUser;

        let userDoc = await firestore().collection('users2').doc(user.uid).get()
            dispatch({
                type: TEAMS_FAV_FETCH_SUCCESS,
                payload: userDoc.data().teams
            });
    } catch(error) {
        console.error("Error writing document: ", error);
    };
};

export const addRemoveFavorites = ({ team }) => {
    return dispatch => {
        var teams = [];
        const userRef = firestore().collection('users2').doc(auth().currentUser.uid);
        firestore().runTransaction(transaction => {
            return transaction.get(userRef).then(doc => {
                teams = doc.data().teams;

                if (team.isSelected) {
                    teams.push(team);
                } else {
                    var index = teams.findIndex(obj => obj.teamId === team.teamId);
                    teams.splice(index, 1);
                }

                transaction.update(userRef, { teams: teams });
            });
        }).then(function () {
            dispatch({ type: TEAMS_FAV_FETCH_SUCCESS, payload: teams });
        }).catch(function (error) {
            console.log("Transaction failed: ", error);
        });
    };
};

export const setSelectedTeam = ({ team, location, auth }) => {
    console.log(`team, location`, team, location, auth)

    return dispatch => {
        if (team && Object.keys(team).length != 0) {
            var today = new Date();
            var oneDayAgo = new Date();
            oneDayAgo.setDate(today.getDate() - 1);
            const uuid = firebase.auth().currentUser.uid
            
            dispatch({ type: TEAMS_FAV_SELECTED, payload: team });
            dispatch(loadTeamGames(team))
            let roomName = [`${location.currentLocation}_${team.teamId}`]
            let chatroom = auth.userProfile.chatrooms ? auth.userProfile.chatrooms[roomName] : null
            dispatch(fetchMessages(uuid, {[roomName]: {groupId: roomName, lastVisited: chatroom ? chatroom.lastVisited : Date.now()}}))
        } else {
            dispatch({ type: TEAMS_FAV_SELECTED, payload: {} });
        }
    };
}


export const loadTeamGames = (team) => async (dispatch) => {
    try {
      let { league, api_id } = team
      console.log(`api_id, league`, api_id, league)
      let now = new Date().getTime()
      let games = []
      let upcomingGamesArray = [];
      let upcomingGames = await firestore()
        .collection('sports')
        .doc(league.toLowerCase())
        .collection('games')
        .where('startDateTime','>', now)
        .get();
        //.where('awayTeam.code','==',api_id)
      if (upcomingGames.docs && upcomingGames.docs.length > 0) {
        upcomingGames = upcomingGames.docs.filter(doc => {
          let game = doc.data();
          return game.awayTeam.code === api_id || game.homeTeam.code === api_id
        })
        upcomingGames.forEach(game => {
          upcomingGamesArray.push(game.data())
        })
    //   console.log(`upcomingGamesArray`, upcomingGamesArray)
      }
      dispatch({
          type: TEAMS_FETCH_GAMES_SUCCESS,
          payload: upcomingGamesArray
      })
    } catch(getGamesError) {
      console.log(`getGamesError`, getGamesError)
    }

  }

async function getNFLSchedule(dispatch, team, currentYear, today) {
    var gameCount = 0; //counter to limit results to next 3 games
    var games = [];

    _getTeamsFromLocal().then(async (teams) => {
        for (let game of schedule) {
            if (gameCount < 3) {
                var gameDate = new Date(game.date);
                if (gameDate >= today) {
                    //check alias for matching team
                    if (game.homeTeamId == team.teamId || game.awayTeamId == team.teamId) {
                        var isAway = game.awayTeamId == team.teamId;
                        var opponent = isAway ? game.homeTeamId : game.awayTeamId;
                        var opponentName = teams.find(x => x.teamId == opponent).name;

                        var gameId = team.teamId + "_" + opponent + "_" + moment(new Date(gameDate)).format("MMDDYY");
                        games.push({
                            'gameId': gameId,
                            'teamId': team.teamId,
                            'opponent': opponentName,
                            'date': moment(new Date(gameDate)).format("MM/DD/YY"),
                            'time': moment(new Date(gameDate)).format("h:mm a"),
                            'isAway': isAway
                        });
                        gameCount += 1;
                        if (gameCount == 3)
                            break; //exit for loops
                    }
                }
            } else {
                break;
            }
        }

        team.schedule = games;
        team.scheduleLastUpdated = today;
        dispatch({ type: TEAMS_FAV_SELECTED, payload: team });
    })
}

function getNCAAFSchedule(dispatch, team, currentYear, today) {
    fetch('https://api.sportradar.us/ncaafb-t1/' + currentYear + '/REG/schedule.json?api_key=68butd7tpwk4cwgwysa5tq2u', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    })
        .then((response) => response.json())
        .then((responseJson) => {
            var gameCount = 0; //limits results to next 3 games
            var games = [];

            //loop through each week
            responseJson.weeks.forEach(week => {
                if (gameCount < 3) {
                    week.games.forEach(game => {
                        var gameDate = new Date(game.scheduled);
                        if (gameDate < today) { //ignore previous games
                            return;
                        }

                        //check alias for matching team
                        if (game.home == team.api_id || game.away == team.api_id) {
                            var isAway = game.away == team.api_id;
                            var gameScheduled = new Date(game.scheduled);
                            games.push({
                                'opponent': isAway ? game.home : game.away,
                                'date': moment(new Date(gameScheduled)).format("MM/DD/YY"),
                                'time': moment(new Date(gameScheduled)).format("h:mm a"),
                                'isAway': isAway
                            });
                            gameCount += 1;
                            return;
                        }
                    })
                } else {
                    return;
                }
            })
            _getTeamsFromLocal().then((teams) => {
                games.forEach(g => {
                    //get name of opponent since API returns ID
                    var name = teams.find(x => x.api_id == g.opponent).name;
                    g.opponent = name;
                })

                team.schedule = games;
                team.scheduleLastUpdated = today;
                dispatch({ type: TEAMS_FAV_SELECTED, payload: team });
            })
        })
        .catch((error) => {
            console.error(error);
        });
}