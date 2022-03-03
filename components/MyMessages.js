import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import teamImages from '../public/images/teamImages';

import { connect } from 'react-redux';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import globalStyles from '../stylesheets/globalStyles';
import tabBarStyles from '../stylesheets/scrollableTabStyles';
import colors from '../stylesheets/colors';
import { removeMessageFromUserList, markMsgAsRead } from '../actions/MyMessagesActions';

class MyMessages extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "My Messages",
            headerLeft: null,
            headerRight: null,
            headerStyle: globalStyles.headerLightStyle,
            headerTitleStyle: globalStyles.headerTitleLightStyle,
        };
    };

    constructor(props) {
        super(props);
    }

    renderTopTabs = () => {
        return (
            this.props.favTeams.teams.map((team, index) => (
                <View tabLabel={team.name} style={tabBarStyles.viewContainer} key={index}>
                    {this.renderMessages(team.teamId)}
                </View>
            )))
    }

    goToMessage(_message) {
        this.props.navigation.navigate('DirectMessageMyMessages', {
            recipient: _message.userId,
            username: _message.username,
            avatar: _message.avatar,
            teamId: _message.teamId
        });

        markMsgAsRead(_message.userId);
    }

    removeMessage(userId) {
        Alert.alert(
            '',
            'Are you sure you want to delete this thread?',
            [

                {
                    text: 'OK',
                    onPress: () => { this.props.removeMessageFromUserList(userId) },
                    style: 'default'
                },
                {
                    text: 'Cancel',
                    onPress: () => {
                    },
                    style: 'cancel',
                },
            ]
        );
    }
    renderMessages = (teamId) => {
        var newMessages = [];
        var otherMessages = [];

        if (teamId == 'All') {
            newMessages = this.props.messages.messages.filter((a) => a.hasUnreadMsg);
            otherMessages = this.props.messages.messages.filter((a) => !a.hasUnreadMsg).sort((a, b) => a.name > b.name);
        } else {
            newMessages = this.props.messages.messages.filter((a) => a.teams.includes(teamId) && a.hasUnreadMsg);
            otherMessages = this.props.messages.messages.filter((a) => a.teams.includes(teamId) && !a.hasUnreadMsg).sort((a, b) => a.name > b.name);
        }

        var messages = newMessages.concat(otherMessages);
        return this.renderMessagesList(messages);
    }

    renderTeam(item) {
        return (
            <View style={styles.logoWrapper}>
                <Image style={styles.logo} source={teamImages[item]} resizeMode="contain" />
            </View>
        );
    }

    renderMessagesList = (messages) => {
        return (
            <FlatList
                data={messages}
                renderItem={({ item, index }) => (
                    <View key={index}>
                        <TouchableOpacity onPress={() => this.goToMessage(item)} style={styles.boxWrapper}>
                            <View style={[styles.box, item.hasUnreadMsg ? styles.newMessage : ""]}>
                                <View style={{ alignItems: 'center' }}>
                                    {item.avatar ?
                                        <Avatar size="small"
                                            source={{ uri: item.avatar }}
                                            rounded
                                        />
                                        :
                                        <Avatar
                                            title={item.username ? item.username[0].toUpperCase() : ""}
                                            size="small"
                                            rounded
                                        />
                                    }

                                </View>
                                <View style={{ flexDirection: 'column' }}>
                                    <Text style={styles.rowText} ellipsizeMode='tail'>{item.username}</Text>
                                    <FlatList
                                        style={styles.teamsWrapper}
                                        data={item.teams}
                                        renderItem={({ item }) => (
                                            this.renderTeam(item)
                                        )}
                                        numColumns={6}
                                        keyExtractor={(item, index) => item}
                                    />
                                </View>
                                <Icon
                                    containerStyle={styles.iconNext}
                                    size={18}
                                    name='chevron-right'
                                    type='font-awesome'
                                    color={colors.darkTxt} />
                                {/* <View style={styles.deleteButtonWrapper}>
                                    <TouchableOpacity onPress={() => this.removeMessage(item.userId)}>
                                        <Icon
                                            name="trash"
                                            type="font-awesome"
                                            color={colors.gray}
                                            size={18}
                                        />
                                    </TouchableOpacity>
                                </View> 
                                {item.hasUnreadMsg ?
                                    <View style={styles.newMessageWrapper}>
                                        <Icon
                                            name="asterisk"
                                            type="font-awesome"
                                            color={colors.primary}
                                            size={16}
                                        />
                                    </View> : null
                                }*/}
                            </View>
                        </TouchableOpacity>
                    </ View>
                )}
                keyExtractor={(item, index) => index}
            />
        )
    }

    render() {
        var defaultTeamIndex = 0;
        var team = this.props.favTeams.selectedTeam;

        if (team) {
            defaultTeamIndex = this.props.favTeams.teams.findIndex(t => t.teamId == team.teamId) + 1;
        }

        return (
            <View style={globalStyles.mainContainer}>
                <ScrollableTabView
                    renderTabBar={() =>
                        <ScrollableTabBar
                            tabStyle={tabBarStyles.tabBarWrapper}
                        />
                    }
                    ref={(tabView) => { this.tabView = tabView; }}
                    tabBarBackgroundColor={'white'}
                    tabBarUnderlineStyle={{
                        backgroundColor: colors.primary
                    }}
                    tabBarActiveTextColor={colors.primary}
                    tabBarInactiveTextColor={colors.darkTxt}
                    initialPage={defaultTeamIndex}
                    locked={true}>
                    <View tabLabel='All' style={[tabBarStyles.viewContainer, styles.messageWrapper]} key='0'>
                        {this.renderMessages('All')}
                    </View>
                    {this.renderTopTabs()}
                </ScrollableTabView>
            </View >
        );
    }
}


const styles = StyleSheet.create({
    messageWrapper: {
        backgroundColor: colors.backgroundColor
    },
    boxWrapper: {
        padding: 2
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5
    },
    rowUnread: {
        borderTopColor: colors.primary,
        borderTopWidth: 8
    },
    rowText: {
        marginLeft: 12
    },
    teamsWrapper: {
        alignSelf: 'flex-start',
        marginLeft: 8
    },
    logoWrapper: {
        alignItems: 'flex-start',
        height: 20,
        marginTop: 2,
        padding: 2,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    logo: {
        flex: 1,
        alignSelf: 'flex-start',
        width: 17,
        height: 17
    },
    deleteButtonWrapper: {
        position: 'absolute',
        right: 10
    },
    newMessage: {
        borderLeftWidth: 8,
        borderLeftColor: colors.primary
    },
    iconNext: {
        marginLeft: 'auto',
        paddingRight: 5
    }
})

const mapStateToProps = state => {
    return {
        auth: state.auth,
        favTeams: state.favoriteTeams,
        messages: state.messages
    }
}

export default connect(mapStateToProps, { removeMessageFromUserList })(MyMessages);