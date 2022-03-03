import {
    TEAMS_FAV_FETCH_SUCCESS,
    TEAMS_FAV_ADD,
    TEAMS_FAV_REMOVE,
    TEAMS_FAV_SELECTED,
    TEAMS_FETCH_GAMES_SUCCESS
} from "../actions/_types";

const INITIAL_STATE = {
    selectedTeam: { teamId: '', name: '', schedule: [], scheduleLastUpdated: '' },
    teams: [], //{ teamId: '', name: '', schedule: [{'opponent': opponentName,'date': moment(new Date(gameDate)).format("MM/DD/YY"),'time': moment(new Date(gameDate)).format("h:mm a"),'isAway': isAway}], scheduleLastUpdated: ''  },
    teamGames: []
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case TEAMS_FAV_FETCH_SUCCESS:
            return {
                ...state,
                teams: action.payload
            }
        case TEAMS_FAV_ADD:
            return {
                ...state,
                teams: [...state.teams, action.payload]
            }
        case TEAMS_FAV_REMOVE:
            return state.filter(({ team }) => team.teamId !== action.payload.teamId);
        default:
            return state;

        case TEAMS_FAV_SELECTED:
            return {
                ...state,
                selectedTeam: action.payload
            }
        case TEAMS_FETCH_GAMES_SUCCESS:
            return {
                ...state,
                teamGames: action.payload
            }
    }
};
