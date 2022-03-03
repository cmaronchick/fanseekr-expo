import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, Image } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import teamImages from '../public/images/teamImages';

import { connect } from 'react-redux';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import globalStyles from '../stylesheets/globalStyles';
import tabBarStyles from '../stylesheets/scrollableTabStyles';
import styles from '../stylesheets/rosterStyles'
import colors from '../stylesheets/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getRoster } from '../actions/RosterActions';

import NavigationService from '../NavigationService'

import RenderRoster from './common/RenderRoster'

class MyRoster extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "My Roster",
            headerLeft: null,
            headerRight: null,
            headerStyle: globalStyles.headerLightStyle,
            headerTitleStyle: globalStyles.headerTitleLightStyle,
        };
    };

    constructor(props) {
        super(props);
    }

    goToUserProfile(_user) {
        NavigationService.navigate('ProfileRoster', {
            user: _user,
            teamId: _user.team
        });
    }

    renderTopTabs = () => {
        return (
            this.props.favTeams.teams.map((team, index) => (
                <View tabLabel={team.name} style={tabBarStyles.viewContainer} key={index}>
                    {this.renderFriends(team.teamId)}
                </View>
            )))
    }

    renderFriends = (teamId) => {
        var friends = [];
        if (teamId == 'All') {
            friends = this.props.roster.users.sort((a, b) => a.name > b.name);
        } else {
            friends = this.props.roster.users.filter(u => u.teams.includes(teamId)).sort((a, b) => a.name > b.name);
        }
        return RenderRoster({user: this.props.auth, roster: friends, styles: styles, goToUserProfile: this.goToUserProfile});
    }

    render() {
        var defaultTeamIndex = 0;
        var team = this.props.favTeams.selectedTeam;

        if (team) {
            defaultTeamIndex = this.props.favTeams.teams.findIndex(t => t.teamId == team.teamId) + 1;
        }
        console.log('rendering roster')

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
                    locked={true}
                    style={{
                        flex: 1,
                        backgroundColor: colors.lightBg
                    }}>
                    <View tabLabel='All' style={[tabBarStyles.viewContainer, styles.rosterWrapper]} key='0'>
                        {this.renderFriends('All')}
                    </View>
                    {this.renderTopTabs()}
                </ScrollableTabView>
            </View >
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        favTeams: state.favoriteTeams,
        roster: state.roster
    }
}

export default connect(mapStateToProps, { getRoster })(MyRoster);