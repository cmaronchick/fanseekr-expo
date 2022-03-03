import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import {
    MESSAGES_FETCH_SUCCESS,
    MESSAGES_ADD,
    MESSAGES_REMOVE
} from './_types';

export const getMessageList = () => {
    return dispatch => {
        firestore().collection('users2').doc(auth().currentUser.uid).collection('dms').orderBy("lastModified", "desc")
            .onSnapshot(function (snapshot) {
                var _dms = [];
                var hasUnread = false;
                snapshot.docs.forEach(function (doc) {
                    _dms.push(doc.data());

                    if (!hasUnread && doc.data().hasUnreadMsg) {
                        hasUnread = true;
                    }
                })

                dispatch({
                    type: MESSAGES_FETCH_SUCCESS,
                    payload: {
                        messages: _dms,
                        hasUnreadMsg: hasUnread
                    }
                });
            });
    };
};

// export const addMessageToUserList = (messageObj) => {
//     return dispatch => {
//         dispatch({
//             type: MESSAGES_ADD,
//             payload: {
//                 avatar: messageObj.avatar,
//                 chatId: messageObj.chatId,
//                 teamId: messageObj.teamId,
//                 userId: messageObj.userId,
//                 username: messageObj.username,
//                 lastModified: _dateNow
//             }
//         });
//     };
// };

export const removeMessageFromUserList = (userId) => {
    return dispatch => {
        firestore().collection('users_messages').doc(auth().currentUser.uid + "_" + userId).collection('messages').get().then(querySnapshot => {
            querySnapshot.forEach(function (doc) {
                doc.ref.delete();
            });

            firestore().collection('users2').doc(auth().currentUser.uid).collection('dms').doc(userId).delete()
                .then(function () {
                    dispatch({
                        type: MESSAGES_REMOVE,
                        payload: userId
                    });
                })
        });
    };
}



export const markMsgAsRead = (recipientId) => {
    firestore().collection('users2').doc(auth().currentUser.uid).collection('dms').doc(recipientId).update({
        hasUnreadMsg: false
    }).then(function () {
    })
};