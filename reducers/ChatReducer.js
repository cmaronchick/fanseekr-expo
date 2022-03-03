import { FETCH_USER_CHATROOMS,
    FETCH_MESSAGES,
    ADD_MESSAGE,
    TOGGLE_NEW_MESSAGE_INDICATOR,
    SET_SELECTED_CHATROOM
 } from "../actions/_types"

const initialState = {
    chatrooms: {},
    selectedChatroom: {}
}

export default (state = initialState, { type, payload }) => {
    switch (type) {

    case FETCH_USER_CHATROOMS:
        return { 
            ...state, 
            chatrooms: {
                ...state.chatrooms,
                ...payload
            }
        }
    case FETCH_MESSAGES:
        // console.log(`payload`, payload)
        return { 
            ...state, 
            chatrooms: {
                ...state.chatrooms,
                [payload.groupId]: {
                    groupId: payload.groupId,
                    messages: payload.messages,
                    newMessages: payload.newMessages
                }
            }
        }
    case ADD_MESSAGE:
        console.log(`state.chatrooms`, state.chatrooms, payload.groupId)
        let chatroom = state.chatrooms[payload.groupId]
        if (!chatroom) {
            chatroom = {
                messages: []
            }
        }
        let messages = chatroom.messages
        messages.push(payload.message)
        return { 
            ...state, 
            chatrooms: {
                ...state.chatrooms,
                [payload.groupId]: {
                    ...chatroom,
                    messages
                }
            }
        }
    case TOGGLE_NEW_MESSAGE_INDICATOR:
        return {
            ...state,
            chatrooms: {
                ...state.chatrooms,
                [payload.groupId]: {
                    ...state.chatrooms[payload.groupId],
                    newMessages: payload.newMessages
                }
            }
        }
    case SET_SELECTED_CHATROOM:
        console.log(`payload`, payload)
        return {
            ...state,
            selectedChatroom: {
                ...payload.chatroom
            }
        }

    default:
        return state
    }
}
