import React, {Component} from 'react';
import {View, TouchableOpacity, Alert, Text} from 'react-native';
import {Icon} from 'react-native-elements';
import {connect} from 'react-redux';
import {GiftedChat, Bubble, InputToolbar, Send} from 'react-native-gifted-chat';
import Filter from 'bad-words';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import styles from '../stylesheets/directMessageStyles';
import globalStyles from '../stylesheets/globalStyles';
import colors from '../stylesheets/colors';
import {
  getMessageList,
  addMessageToUserList,
  removeMessageFromUserList,
  markMsgAsRead,
} from '../actions/MyMessagesActions';

class DirectMessage extends React.Component {
  _chatListener = {};

  static navigationOptions = ({navigation}) => {
    return {
      title: '',
      headerRight: (
        <TouchableOpacity
          onPress={navigation.getParam('deleteMessage')}
          style={globalStyles.headerRightButtonWrapper}>
          <Icon
            name="trash"
            type="font-awesome"
            color={colors.darkTxt}
            size={22}
          />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          onPress={navigation.getParam('goBack')}
          style={globalStyles.headerLeftButtonWrapper}>
          <Icon
            name="arrow-back"
            type="ionic"
            color={colors.darkTxt}
            size={22}
          />
        </TouchableOpacity>
      ),
      headerTransparent: true,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      chatId: '',
      recipientUsername: '',
      recipientId: '',
      recipientAvatar: '',
      messages: [],
      isRecipientBlocked: false,
      isCurrentUserBlocked: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({goBack: this.goBack});
    this.props.navigation.setParams({deleteMessage: this.deleteMessage});
    var that = this;

    const recipientUsername = this.props.navigation.getParam('username', '');
    const recipientAvatar = this.props.navigation.getParam('avatar', '');
    const recipientId = this.props.navigation.getParam('recipient', ''); //new message.  Will be null if new message (use chatId)
    const chatId = recipientId
      ? auth().currentUser.uid + '_' + recipientId
      : this.props.navigation.getParam('chatId', '');
    const teamId = this.props.navigation.getParam('teamId', '');

    this.setState({
      ...this,
      chatId: chatId,
      teamId: teamId, //used for profile "Add to Roster"
      recipientId: recipientId,
      recipientUsername: recipientUsername,
      recipientAvatar: recipientAvatar,
      isRecipientBlocked: false,
      isCurrentUserBlocked: false,
    });

    var expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() - 60);

    this._chatListener = firestore()
      .collection('users_messages')
      .doc(chatId)
      .collection('messages')
      .where('timestamp', '>', expirationDate)
      .orderBy('timestamp', 'desc')
      .onSnapshot(function(snapshot) {
        var messages = [];

        snapshot.docs.forEach(function(doc) {
          messages.push({
            _id: doc.id,
            text: doc.data().message,
            createdAt: doc.data().timestamp.toDate(),
            user: {
              _id: doc.data().userId,
              name: doc.data().name,
              avatar: doc.data().avatar,
            },
          });
        });

        that.setState({...this, messages: messages});
      });

    if (!recipientId) {
      recipientId = chatId.split('_')[1];
    }

    //check if user is blocking recipient to show blocked message
    firestore()
      .collection('users_blocked')
      .doc(auth().currentUser.uid)
      .get()
      .then(function(blocked) {
        var blockedUsers = [];
        if (blocked.exists) {
          blockedUsers = blocked.data().users;
        }

        if (blockedUsers.filter(x => x.userId === recipientId).length > 0) {
          that.setState({...this, isRecipientBlocked: true});
        }
      })
      .catch(function(error) {});

    //check reciepeint's block list to see if Current User exits
    firestore()
      .collection('users_blocked')
      .doc(recipientId)
      .get()
      .then(function(blocked) {
        var blockedUsers = [];
        if (blocked.exists) {
          blockedUsers = blocked.data().users;
        }

        if (
          blockedUsers.filter(x => x.userId === auth().currentUser.uid)
            .length > 0
        ) {
          that.setState({...this, isCurrentUserBlocked: true});
        }
      })
      .catch(function(error) {});
  }

  componentWillUnmount() {
    this._chatListener(); //unsubscribe to snapshot
  }

  goBack = () => {
    this.props.navigation.goBack();
    markMsgAsRead(this.state.recipientId);
  };

  deleteMessage = () => {
    Alert.alert('', 'Are you sure you want to delete this thread?', [
      {
        text: 'OK',
        onPress: () => {
          this.props.removeMessageFromUserList(this.state.recipientId);
          this.goBack();
        },
        style: 'default',
      },
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  };

  goToUserProfile = _user => {
    if (this.props.navigation.state.routeName == 'DirectMessageMyMessages') {
      this.props.navigation.navigate('ProfileMyMessages', {
        user: _user,
        teamId: this.state.teamId,
      });
    } else {
      this.props.navigation.navigate('ProfileRoster', {
        user: _user,
      });
    }
  };

  get user() {
    return {
      name: this.props.auth.userProfile.username,
      avatar: this.props.auth.userProfile.avatar,
      _id: auth().currentUser.uid,
    };
  }

  onSend(messages = []) {
    const _dateNow = new Date();
    var filter = new Filter();
    var message = filter.clean(messages[0].text);

    //write to current user's collections
    firestore()
      .collection('users_messages')
      .doc(this.state.chatId)
      .collection('messages')
      .doc(messages[0]._id)
      .set({
        message: message,
        timestamp: _dateNow,
        name: messages[0].user.name,
        avatar: messages[0].user.avatar,
        userId: auth().currentUser.uid,
      });

    firestore()
      .collection('users2')
      .doc(auth().currentUser.uid)
      .collection('dms')
      .doc(this.state.recipientId)
      .get()
      .then(doc => {
        if (!doc.exists) {
          firestore()
            .collection('users2')
            .doc(this.state.recipientId)
            .get()
            .then(_rec => {
              var messageObj = {
                chatId: this.state.chatId,
                teamId: this.props.favoriteTeams.selectedTeam.teamId
                  ? this.props.favoriteTeams.selectedTeam.teamId
                  : this.state.teamId,
                userId: this.state.recipientId,
                username: this.state.recipientUsername,
                avatar: this.state.recipientAvatar,
                teams: _rec.data().teams.map(a => a.teamId),
                lastModified: _dateNow,
                hasUnreadMsg: false,
              };
              firestore()
                .collection('users2')
                .doc(auth().currentUser.uid)
                .collection('dms')
                .doc(this.state.recipientId)
                .set(messageObj);
            });
        } else {
          firestore()
            .collection('users2')
            .doc(auth().currentUser.uid)
            .collection('dms')
            .doc(this.state.recipientId)
            .update({hasUnreadMsg: false, lastModified: _dateNow});
        }
      })
      .catch(err => {
        console.log('Error getting document', err);
      });

    if (!this.state.isCurrentUserBlocked) {
      //write to reciepient's collections
      firestore()
        .collection('users_messages')
        .doc(this.state.recipientId + '_' + auth().currentUser.uid)
        .collection('messages')
        .doc(messages[0]._id)
        .set({
          message: message,
          timestamp: _dateNow,
          name: messages[0].user.name,
          avatar: messages[0].user.avatar,
          userId: auth().currentUser.uid,
        });

      firestore()
        .collection('users2')
        .doc(this.state.recipientId)
        .collection('dms')
        .doc(auth().currentUser.uid)
        .get()
        .then(doc => {
          if (!doc.exists) {
            var messageObj = {
              chatId:
                this.state.recipientId + '_' + auth().currentUser.uid,
              teamId: this.props.favoriteTeams.selectedTeam.teamId
                ? this.props.favoriteTeams.selectedTeam.teamId
                : this.state.teamId,
              userId: auth().currentUser.uid,
              username: this.props.auth.userProfile.username,
              avatar: this.props.auth.userProfile.avatar,
              teams: this.props.favoriteTeams.teams.map(a => a.teamId),
              lastModified: _dateNow,
              hasUnreadMsg: true,
            };
            firestore()
              .collection('users2')
              .doc(this.state.recipientId)
              .collection('dms')
              .doc(auth().currentUser.uid)
              .set(messageObj);
          } else {
            firestore()
              .collection('users2')
              .doc(this.state.recipientId)
              .collection('dms')
              .doc(auth().currentUser.uid)
              .update({hasUnreadMsg: true, lastModified: _dateNow});
          }

          //notify user
          firestore()
            .collection('users_notifications')
            .doc(this.state.recipientId)
            .collection('messages')
            .doc()
            .set({
              message: message,
              timestamp: _dateNow,
              name: messages[0].user.name,
            });
        })
        .catch(err => {});
    }
  }

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          left: styles.bubbleTextLeft,
          right: styles.bubbleTextRight,
        }}
        wrapperStyle={{
          left: styles.bubbleWrapperLeft,
          right: styles.bubbleWrapperRight,
        }}
        containerStyle={styles.bubbleContainerStyle}
      />
    );
  };

  renderInputToolbar(props) {
    //Add the extra styles via containerStyle
    return (
      <InputToolbar {...props} containerStyle={styles.inputContainerStyle} />
    );
  }

  renderSend(props) {
    return (
      <Send
        {...props}
        containerStyle={[
          styles.sendContainerStyle,
          {position: 'relative', bottom: 16, right: 15},
        ]}>
        <View>
          <Icon
            size={16}
            name="send"
            type="font-awesome"
            color={colors.primary}
          />
        </View>
      </Send>
    );
  }

  renderBlockedUser = () => {
    return this.state.isRecipientBlocked ? (
      <View style={styles.blockedUserWrapper}>
        <Text style={styles.blockedUserText}>
          *You will not receive any messages since you have blocked this user.
        </Text>
      </View>
    ) : (
      <View />
    );
  };

  render() {
    return (
      <GiftedChat
        messages={this.state.messages}
        renderChatFooter={this.renderBlockedUser}
        renderBubble={this.renderBubble}
        renderInputToolbar={this.renderInputToolbar}
        renderSend={this.renderSend}
        backgroundColor={colors.lightBg}
        onSend={messages => this.onSend(messages)}
        user={this.user}
        showAvatarForEveryMessage={true}
        onPressAvatar={user => {
          this.goToUserProfile(user);
        }}
        minInputToolbarHeight={75}
        bottomOffset={5}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    favoriteTeams: state.favoriteTeams,
  };
};

export default connect(
  mapStateToProps,
  {getMessageList, addMessageToUserList, removeMessageFromUserList},
)(DirectMessage);
