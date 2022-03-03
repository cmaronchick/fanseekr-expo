import React, { Component, useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, View, Alert, TextInput, StyleSheet, Image, Dimensions } from 'react-native';
import { Icon, FAB, Overlay, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { GiftedChat, InputToolbar, Send, Composer, Actions } from 'react-native-gifted-chat';
import Filter from 'bad-words';
import moment from 'moment'

import ImagePicker from 'react-native-image-crop-picker';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import globalStyles from '../../stylesheets/globalStyles';
import colors from '../../stylesheets/colors';
import SlackMessage from './ChatMessage';

import { uploadToFirebase } from '../../helpers/utils';
import { setChatRoomMetadata, addMessage } from '../../actions/ChatActions';
import { Button } from 'react-native-elements/dist/buttons/Button';

import { setLastVisited } from '../../actions/ChatActions';


const Chat = ({route, navigation, selectedChatroom, roomType, roomName, authUser, setChatRoomMetadata, addMessage, chatrooms, setLastVisited }) => {
    const _chatListener = {}; 
    
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [pinnedMessage, setPinnedMessage] = useState({})
    const [image, setImage] = useState("");
    const [channels, setChannels] = useState([roomName]);
    const [showOverlay, toggleOverlay] = useState(false)
    const [errorMessage, setErrorMessage] = useState("");
    

    const navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            headerTitle: (
                <View style={{
                    flex: 1,
                    alignItems: 'center'
                }} >
                    <Text>{params.chatTitle1}</Text>
                    <Text>{params.chatTitle2}</Text>
                </View >
            ),
            headerRight: null,
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        navigation.getParam('goBack')
                    }}
                    style={globalStyles.headerLeftButtonWrapper}
                >
                    <Icon
                        name="arrow-back"
                        type="ionic"
                        color={colors.darkTxt}
                        size={22}
                    />
                </TouchableOpacity>
            ),
            headerStyle: globalStyles.teamHeaderStyle
        };
    };


    // This function handles sending messages.
    const handleSubmit = () => {
        console.log('submitting')
        const { username, avatar } = authUser.userProfile;
        var filter = new Filter();

        // Clear the input field.
        setInput("");
        // Create the message with random `id`.
        const message = {
            text: filter.clean(input),
            _id: Math.random()
                .toString(16)
                .substr(2),
            timetoken: Date.now(),
            author: authUser.userProfile.uid,
            user: {
                name: username,
                avatar
            }
        };
        addMessage(roomName, message)
    };

    // const setMessages = (message) => {
    //     this.setState({
    //         messages: [...this.state.messages, message]
    //     })
    // } 
    // First we need to set our PubNub UUID and subscribe to chat channel.
    // We will use `useEffect` hook for that.
    useEffect(() => {
        console.log(`roomName`, roomName, messages)
        const unsubscribe = firestore().doc(`chatrooms/${roomName}`).collection('messages').onSnapshot((querySnapshot) => {
            const messagesFirestore = querySnapshot
                .docChanges()
                .filter(({ type }) => type === 'added')
                .map(({ doc }) => {
                    const message = doc.data().message ? doc.data().message : doc.data()
                    console.log(`message`, message)
                    //createdAt is firebase.firestore.Timestamp instance
                    //https://firebase.google.com/docs/reference/js/firebase.firestore.Timestamp
                    return { ...message, createdAt: new Date(message.createdAt).getTime()}
                })
                .sort((a, b) => b.createdAt - a.createdAt)
                console.log(`messagesFirestore`, messagesFirestore)
            appendMessages(messagesFirestore)
        })
        return () => unsubscribe()
    }, []);

    const appendMessages = useCallback(
        (messages = []) => {
            setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
        },
        [messages]
    )

    const listener = (selectedChatroom) => {
        console.log(`selectedChatroom.groupId`, selectedChatroom.groupId)
        firestore().doc(`chatrooms/${selectedChatroom.groupId}`).collection("messages").onSnapshot(
            querySnapshot => {
                console.log(`querySnapshot`, querySnapshot)
                querySnapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        console.log(`change.doc.data()`, change.doc.data())
                        // setMessages(messages => {
                        //     console.log(`messages`, messages)
                        //     // return [
                        //     //     ...messages,
                        //     //     {...change.doc.data()}
                        //     // ]
                        // })
                    }
                })
            }
        )
    }

    const goBack = () => {
        navigation.goBack();
    }

    const getUser = () => {
        return {
            name: authUser.userProfile.username,
            avatar: authUser.userProfile.avatar,
            _id: auth().currentUser.uid
        };
    }
    /*
    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const {
        _id,
        createdAt,
        text,
        user,
        } = messages[0]
        db.collection('chats').add({
        _id,
        createdAt,
        text,
        user
        })
        }, [])*/
    const onSend = (messages = []) => {
        var filter = new Filter();
        var message = filter.clean(messages[0].text);
        firestore().collection('chatrooms').doc(roomName).collection('messages').doc(messages[0]._id).set({
            message: message,
            timestamp: new Date(),
            name: messages[0].user.name,
            avatar: messages[0].user.avatar,
            userId: auth().currentUser.uid
        })
        firestore().collection('chatrooms').doc(roomName).set({
            lastMessageReceivedDate: new Date()
        })
    }

    const goToUserProfile = (_user) => {
        navigation.navigate('ProfileTeam', {
            user: _user
        });
    }

    const handleImageSubmit = () => {
        const options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            maxWidth: 200,
            maxHeight: 200
        };


        ImagePicker.openPicker({
            cropping: false,
            width: 200,
            height: 200,
            compressImageQuality: 0.6,
            cropperCircleOverlay: false,
            freeStyleCropEnabled: false,
            avoidEmptySpaceAroundImage: true,
            includeBase64: true,
            mediaType: 'photo'
        }).then(async response => {
            console.log(`response`, response)
            const { width, height, mime, data, size, path } = response

            // get image name from path
            const pathArray = path.split('/')
            const imageName = pathArray[pathArray.length - 1]
            console.log(`imageName`, imageName)
            try {
                setImage(imageName)
                const { uid, username, avatar } = authUser.userProfile
                const uploadImageResult = await uploadToFirebase(response)
                console.log(`uploadImageResult`, uploadImageResult, encodeURI(uploadImageResult.ref.path))
                const message = {
                        _id: Math.random()
                            .toString(16)
                            .substr(2),
                        timetoken: Date.now(),
                        author: authUser.userProfile.uid,
                        user: {
                            name: username,
                            avatar
                        },
                        fileId: `${encodeURI(uploadImageResult.ref.path)}`,
                        fileName: imageName
                    }
                addMessage(roomName, message)
            } catch (sendImageError) {
                console.log(`sendImageError`, sendImageError)
            }
        }).catch((error) => {
            if (error == "Error: Cannot access images. Please allow access if you want to be able to select images.") {

                Alert.alert(
                    '',
                    'Unable to access your photos.  Please allow FanSeekr to access your photo library.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                            },
                            style: 'cancel'
                        }
                    ]
                );
            }
        });
    }

    const deleteMessage = (message) => {
        Alert.alert(
            '',
            'Are you sure you want to delete this message?',
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                    },
                    style: 'cancel',
                },

                {
                    text: 'OK',
                    onPress: () => {
                        firestore().collection('chatrooms').doc(roomName).collection('messages').doc(message._id).delete()
                            .then(function () {
                            }).catch(function (error) {
                            });
                    },
                    style: 'default'
                }
            ]
        );
    }

    const pinMessage = (message) => {
        // const { _id, text, image, user, timestamp } = message
        // pubnub.objects.setChannelMetadata({
        //     channel: roomName,
        //     data: {
        //         custom: {
        //             "pinnedMessage": JSON.stringify({
        //                 _id,
        //                 text: text ? text : '',
        //                 image: image ? image : '',
        //                 user,
        //                 timestamp
        //             })
        //         }
        //     }
        // }, (status, response) => {
        //     console.log(`pinMessage status, response`, status, response)
        //     setPinnedMessage({
        //         _id,
        //         text: text ? text : '',
        //         image: image ? image : '',
        //         user,
        //         timestamp
        //     })
        // })
    }

    const renderActions = (props, setImage) => (
      <Actions
        {...props}
        containerStyle={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 4,
          marginRight: 4,
          marginBottom: 0,
        }}
        icon={() => (
          <Icon
          name="image"
          type="font-awesome"
          size={24}
          />
        )}
        options={{
          'Choose From Library': () => {
            handleImageSubmit()
          },
          Cancel: () => {
            console.log('Cancel');
          },
        }}
        optionTintColor="#222B45"
      />
    );

    const renderInputToolbar = (props) => {
        //Add the extra styles via containerStyle
        return <InputToolbar {...props}
            containerStyle={{
                margin: 10, marginBottom: 15, borderRadius: 20, backgroundColor: 'white', borderTopWidth: 0, paddingLeft: 5, paddingTop: 3,
                shadowColor: colors.darkBg,
                shadowOffset: { width: .5, height: 1 },
                shadowOpacity: 0.25,
                shadowRadius: 2,
                elevation: 5
                }}
            />
    }

    const renderSend = (props) => {
        return (
            <Send
                {...props}
                containerStyle={{
                    marginTop: 0,
                    position: 'relative',
                    bottom: 16,
                    right: 15,
                    borderTopWidth: 0,
                    shadowColor: 'white',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0,
                    shadowRadius: 0,
                    elevation: 0
                }}
            >
                <View>
                    <Icon
                        size={16}
                        name='send'
                        type='font-awesome'
                        color={colors.primary} />
                </View>
            </Send>
        );
    }

        return (
            <View style={{ flex: 1 }}>
                {messages && messages.length === 0 ?
                    <View style={{ paddingLeft: 15, paddingTop: 20, paddingRight: 15 }}>
                        <Text>*There are no messages in this chatroom. Drop a message and start connecting with other fans!</Text>
                    </View> : <View></View>}
                    <GiftedChat
                        messages={messages}
                        onSend={handleSubmit}
                        user={authUser.user}
                        bottomOffset={80}
                        inverted={true}
                        renderMessage={(props) => {
                            return (
                                <SlackMessage {...props}
                                    onUserClicked={(user) => goToUserProfile(user)}
                                    isModerator={authUser.userProfile.isAdmin}
                                    onDeleteClicked={(message) => deleteMessage(message)}
                                    onPinClicked={(message) => pinMessage(message)}
                                />
                            );
                        }}
                        showAvatarForEveryMessage={true}
                        onPressAvatar={(user) => { goToUserProfile(user) }}
                        renderInputToolbar={renderInputToolbar}
                        renderSend={renderSend}
                        renderActions={renderActions}
                        backgroundColor={colors.lightBg}
                        minInputToolbarHeight={75}
                        keyboardShouldPersistTaps='never'
                        onInputTextChanged={setInput}

                    />
                {selectedChatroom.chatroom?.custom?.pinnedMessage ? (
                    <FAB
                        title={() => (<Icon type="material" name="push-pin" size={16} iconStyle={{ color: '#fff'}} />)}
                        onPress={() => {
                            console.log(`FAB clicked`)
                            toggleOverlay(!showOverlay)
                        }}
                        placement="right"
                        visible={true}
                        size="small"
                        containerStyle={{top: Dimensions.get('window').height / -1.5}} 
                        style={{marginBottom: 50}} />
                ) : null}
                <Overlay isVisible={showOverlay}
                onBackdropPress={() => toggleOverlay(!showOverlay)}
                fullScreen={false}
                overlayStyle={{borderRadius: 20}}>
                    <Text h2>Pinned Message</Text>
                    <Text style={{fontWeight: 'bold'}}>{pinnedMessage.user?.name}</Text>
                    <Text>{pinnedMessage?.text}</Text>
                    <Text style={{ color: colors.darkTxt}}>{moment(pinnedMessage.timestamp).format('MMM D yyyy h:mm a')}</Text>
                    <Button
                    onPress={() => toggleOverlay(!showOverlay)}
                    title="Close" />
                </Overlay>
                {errorMessage ? (
                    <View style={styles.errorMessageView}>
                        <Text style={styles.errorMessageText}>{errorMessage}</Text>
                    </View>
                ) : null}

            </View>
        );
}


const mapStateToProps = state => {
    return {
        authUser: state.auth,
        favoriteTeams: state.favoriteTeams,
        location: state.location,
        selectedChatroom: state.chat.selectedChatroom,
        chatrooms: state.chat.chatrooms
    }
}

const mapDispatchToProps = {
    setChatRoomMetadata,
    addMessage,
    setLastVisited
}

const styles = StyleSheet.create({
    outerContainer: {
      width: "100%",
      height: "100%"
    },
    innerContainer: {
      width: "100%",
      height: "100%"
    },
    topContainer: {
      flex: 1,
      width: "100%",
      flexDirection: "column",
      justifyContent: "flex-end",
      paddingHorizontal: 16
    },
    messageContainer: {
      flexDirection: "row",
      marginTop: 16,
      alignItems: "center",
      backgroundColor: "#fff",
      padding: 8,
      borderRadius: 4
    },
    avatar: {
      width: 38,
      height: 38,
      borderRadius: 50,
      overflow: "hidden",
      marginRight: 16
    },
    avatarContent: {
      fontSize: 30,
      textAlign: "center",
      textAlignVertical: "center"
    },
    messageContent: {
      flex: 1
    },
    bottomContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      padding: 16
    },
    textInput: {
      flex: 1,
      backgroundColor: "#fff",
      borderRadius: 4,
      padding: 16,
      elevation: 2
    },
    submitButton: {
      position: "absolute",
      right: 32
    },
    errorMessageView: {
        backgroundColor: colors.red,
        paddingHorizontal: 10,
        paddingVertical: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        borderRadius: 5

    },
    errorMessageText: {
        color: colors.lightTxt
    }
   });

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
