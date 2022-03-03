import { SET_CHATROOM_DATA,
    FETCH_CHATROOM_DATA,
    FETCH_USER_CHATROOMS,
    ADD_MESSAGE,
    PIN_MESSAGE,
    FETCH_MESSAGES,
    SET_NEW_MESSAGE_INDICATOR,
    SET_SELECTED_CHATROOM

} from "./_types"

import firestore from '@react-native-firebase/firestore'

import { generateRandomString } from "../helpers/utils"



export const setChatRoomMetadata = (chatRoomData) => (dispatch) => {
    dispatch({
        type: SET_CHATROOM_DATA,
        payload: chatRoomData
    })
}

export const addChatroomListeners = (uuid, groups) => async (dispatch) => {
    
    try {
                
        
    /* 
      get users chatrooms
      add listeners for each chatroom
      update chatroom messages in redux state
    */
        // console.log(`34 groups`, groups)
        let groupKeys = Object.keys(groups)
        const chatrooms = await firestore().collection('chatrooms').where(firestore.FieldPath.documentId(), 'in', groupKeys);
        // console.log(`chatrooms`, chatrooms.docs)
        const observer = chatrooms.onSnapshot(querySnapshot => {
        console.log(`Received query snapshot of size ${querySnapshot.size}`);
        // ...
        }, err => {
        console.log(`Encountered error: ${err}`);
        });
        console.log(`44 groups`, groups)
        dispatch(fetchMessages(uuid, groups))
    } catch (fetchChannelsError) {
        console.log(`fetchChannelsError`, fetchChannelsError)
    }

}

export const setMessageAsRead = (messageId) => async (dispatch) => {

}

export const subscribeToChannel = (uuid, group) => async (dispatch) => {
    console.log(`uuid, groupId`, uuid, group)
    const groupId = group.groupId ? group.groupId : group
    console.log(`58 groupId`, groupId)
    
    try {
        let chatroom = await firestore().collection('chatrooms').doc(groupId).get()
        //add chatroom if it doesn't exist
        if (!chatroom.exists) {
            console.log('adding chat room')
            let addChatroom = await firestore().collection('chatrooms').doc(groupId).set({
                messages: []
            })
        }

        // add chatrooms property to user if they have not subscribed
        let userDetails = await firestore().doc(`users2/${uuid}`).get()
        let addChatroomToUser;
        if (!userDetails.data().chatrooms) {
            addChatroomToUser = await firestore().doc(`users2/${uuid}`).set({
                chatrooms: {
                    [groupId]: {
                        lastVisited: Date.now()
                    }
                }
            })
        } else {
            addChatroomToUser = await firestore().doc(`users2/${uuid}`).set({
                    chatrooms: {
                        [groupId] : {lastVisited: Date.now()}
                    }
            }, {merge: true})
        }
        if (chatroom.exists) {
            console.log(`chatroom.data()`, chatroom.data());
            console.log(`group`, group);
            dispatch(fetchMessages(uuid, {[groupId]: {
                lastVisited: group.lastVisited,
                ...chatroom.data()
            }
            }))
        }

    } catch (subscribeError) {
        console.log(`subscribeError`, subscribeError)
    }
}

export const fetchMessages = (user, groups) => async (dispatch) => {
    // console.log(`groups`, groups)
    console.trace()
    try {

        let d = new Date();
        // console.log(`channels: [groups[0]]`, {channels: [groups[2]]})
        let queryPromises = []
        let listeners = []
        Object.keys(groups).forEach(async (groupKey) => {
            console.log(`groupKey`, groupKey)
            const group = groups[groupKey]
            console.log(`group`, group)
            let newMessages = 0;
            try {
                let messages = await firestore().doc(`chatrooms/${groupKey}`).collection('messages').get()
                // console.log(`110 messages`, messages.docs?.length)
                let messageArray = []
                messages.docs.forEach(messageDoc => {
                    const message = messageDoc.data().message;
                    // console.log(`122 message.timetoken > group.lastVisited`, message?.timetoken, group.lastVisited, message?.timetoken > group.lastVisited)
                    if (message?.timetoken > group.lastVisited) {
                        newMessages++;
                        // console.log(`newMessages`, newMessages)
                    }
                    if (message?._id) {
                        messageArray.push({_id: messageDoc.id,
                            ...message
                        })
                    }
                })
                console.log(`messageArray`, group, messageArray)
                dispatch({
                    type: FETCH_MESSAGES,
                    payload: {
                        groupId: groupKey,
                        lastVisited: group.lastVisited,
                        messages: messageArray,
                        newMessages
                    }
                })
                dispatch(setListeners(group))
            } catch (fetchMessagesError) {
                console.log(`fetchMessagesError, group`, fetchMessagesError, group)
            }
        })
        let newMessagesArray = await Promise.all(queryPromises)
        // console.log(`newMessagesArray`, newMessagesArray.length)
        newMessagesArray.forEach(messages => {
            messages.docs.forEach(doc => {
                console.log(`doc.data()`, doc.data())
            })
        })
    } catch (fetchMessagesError) {
        console.log(`fetchMessagesError`, fetchMessagesError)
    }
}

export const setListeners = (chatroom) => async (dispatch) => {
    try {
        const observer = firestore().doc(`chatrooms/${chatroom}`).collection('messages')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                console.log('New city: ', change.doc.data());
                dispatch(addMessage(chatroom, {message: change.doc.data()}))
                }
                if (change.type === 'modified') {
                console.log('Modified city: ', change.doc.data());
                }
                if (change.type === 'removed') {
                console.log('Removed city: ', change.doc.data());
                }
            })
        });
    } catch(observerSnapshotError) {
        console.log(`observerSnapshotError`, observerSnapshotError)
    }
}

export const addMessage = (groupId, message) => async (dispatch) => {
    try {
        let messageId = generateRandomString(20)
        let addMessageResponse = await firestore().doc(`chatrooms/${groupId}`).collection('messages')
            .add({
                ...message,
                createdAt: Date.now()
            });

        console.log(`addMessageResponse`, addMessageResponse)
        dispatch({
            type: ADD_MESSAGE,
            payload: {
                groupId,
                message
            }

        })
        
    } catch (addMessageError) {
        console.log(`addMessageError`, addMessageError)
    }
}

export const setSelectedChatroom = (chatroom) => (dispatch) => {
    console.log(`chatroom`, chatroom)
    dispatch({
        type: SET_SELECTED_CHATROOM,
        payload: {chatroom}
    })
}

export const setNewMessagesIndicator = (groupId) => {

}

export const setLastVisited = (uuid, groupId) => async (dispatch) => {
    // console.log(`uuid, groupId`, uuid, groupId)
    try {
        let userDoc = await firestore().doc(`users2/${uuid}`).get();
        if (userDoc.data().chatrooms) {
            let updateLastVisited = await firestore().doc(`users2/${uuid}`)
            .set({
                    chatrooms: {
                        [groupId] : {lastVisited: Date.now()}
                    }
            }, {merge: true})
        } else {
            let updateLastVisited = await firestore().doc(`users2/${uuid}`)
            .set({
                chatrooms: {
                    [groupId]: {lastVisited: Date.now()}
                }
            })
        }

    } catch (setLastVisitedError) {
        console.log(`setLastVisitedError`, setLastVisitedError)
    }
}