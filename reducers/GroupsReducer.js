import {
    GROUPS_GET_ALL_GROUPS,
    GROUPS_GET_MY_GROUPS,
    GROUPS_ADD_NEW_GROUP_SUCCESS,
    GROUPS_TOGGLE_ADDING_GROUP,
    GROUPS_TOGGLE_LOADING_ALL_GROUPS,
    GROUPS_JOIN_GROUP_SUCCESS,
    GROUPS_TOGGLE_JOINING_GROUP,
    GROUPS_ADD_NEW_GROUP_DETAILS,
    GROUPS_CLEAR_NEW_GROUP_DETAILS,
    GROUPS_TOGGLE_ADD_GROUP_OVERLAY,
    GROUPS_TOGGLE_LOADING_GROUP,
    GROUPS_SELECT_GROUP,
    GROUPS_CLEAR_SELECT_GROUP,
    GROUPS_FETCH_GROUP_MEMBERS,
    GROUPS_FETCH_GROUP_MESSAGES,
    SET_CHATROOM_DATA,
    FETCH_CHATROOM_DATA
} from "../actions/_types";

import { auth } from '@react-native-firebase/auth'
import ActionButton from "../components/common/ActionButton";

const INITIAL_STATE = {
    groups: {},
    selectedGroup: {},
    loadingSelectedGroup: false,
    loadingGroups: false,
    newGroup: {
        name: '',
        description: '',
        location: '',
        favoriteBar: '',
        teams: []
    },
    addingGroup: false,
    joiningGroup: false,
    addGroupOverlayVisible: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GROUPS_GET_ALL_GROUPS:
            return {
                ...state,
                groups: action.payload
            }
        case GROUPS_ADD_NEW_GROUP_DETAILS:
            return {
                ...state,
                newGroup: {
                    ...state.newGroup,
                    ...action.payload
                }
            }
        case GROUPS_ADD_NEW_GROUP_SUCCESS:
            return {
                ...state,
                groups: [
                    ...state.groups,
                    action.payload
                ]
            }
        case GROUPS_TOGGLE_LOADING_ALL_GROUPS:
            return {
                ...state,
                loadingGroups: !state.loadingGroups
            }
        case GROUPS_TOGGLE_ADDING_GROUP:
            return {
                ...state,
                addingGroup: !state.addingGroup
            }
        case GROUPS_JOIN_GROUP_SUCCESS:
            return {
                ...state,
                joiningGroup: false
            }
        case GROUPS_TOGGLE_JOINING_GROUP:
            return {
                ...state,
                joiningGroup: !state.joiningGroup
            }
        case GROUPS_CLEAR_NEW_GROUP_DETAILS:
            return {
                ...state,
                newGroup: {
                    name: '',
                    description: '',
                    location: '',
                    favoriteBar: '',
                    teams: []
                }
            }
        case GROUPS_TOGGLE_ADD_GROUP_OVERLAY:
            return {
                ...state,
                addGroupOverlayVisible: !state.addGroupOverlayVisible
            }
        case GROUPS_TOGGLE_LOADING_GROUP:
            return {
                ...state,
                loadingSelectedGroup: !state.loadingSelectedGroup
            }
        case GROUPS_SELECT_GROUP:
            return {
                ...state,
                selectedGroup: action.payload,
                loadingSelectedGroup: false
            }
        case GROUPS_FETCH_GROUP_MEMBERS:
            return {
                ...state,
                selectedGroup: {
                    ...state.selectedGroup,
                    members: action.payload
                }
            }
        case GROUPS_FETCH_GROUP_MESSAGES:
            return {
                ...state,
                selectedGroup: {
                    ...state.selectedGroup,
                    chatroom: action.payload
                }
            }
        case GROUPS_GET_MY_GROUPS:
            return {
                ...state,
                myGroups: action.payload
            }
        case SET_CHATROOM_DATA:
            return {
                ...state,
                selectedGroup: {
                    ...state.selectedGroup,
                    chatroom: {
                        ...state.selectedGroup.chatroom,
                        ...action.payload
                    }
                }
            }
        default:
            return {
                ...state
            }
            break;
    }
}
