import { combineReducers } from "redux";
import AuthReducer from "./AuthReducer";
import BarReducer from './BarReducer'
import FavoriteTeamsReducer from "./FavoriteTeamsReducer";
import LocationReducer from "./LocationReducer";
import MyRosterReducer from "./MyRosterReducer";
import MyMessagesReducer from "./MyMessagesReducer";
import BlockedUsersReducer from './BlockedUsersReducer';
import PartyReducer from './PartyReducer';
import GroupsReducer from './GroupsReducer'
import ChatReducer from "./ChatReducer";

const appReducer = combineReducers({
    auth: AuthReducer, //state.auth available in components. This piece of state available from AuthReducer.js
    favoriteTeams: FavoriteTeamsReducer,
    location: LocationReducer,
    roster: MyRosterReducer,
    messages: MyMessagesReducer,
    blockedUsers: BlockedUsersReducer,
    bars: BarReducer,
    parties: PartyReducer,
    groups: GroupsReducer,
    chat: ChatReducer
});

export default rootReducer = (state, action) => {
    if (action.type === 'logout_user') {
        state = undefined
    }

    return appReducer(state, action)
} 