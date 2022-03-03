import React, { Component } from 'react';
import { View, Alert, Text, TouchableWithoutFeedback, FlatList, Image } from 'react-native';
import { connect } from 'react-redux';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'

import { _storeLocalItem } from '../../helpers/asyncStorage';
import teamImages from '../../constants/images/teamImages';
import teamImage from '../../public/images/teams/nflwas.png'
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import globalStyles from '../../stylesheets/globalStyles';
import tabBarStyles from '../../stylesheets/scrollableTabStyles';
import colors from '../../stylesheets/colors';
import styles from '../../stylesheets/teamSelectStyles';
import { addRemoveFavorites } from '../../actions/FavoriteTeamsActions';
import { addNewGroupDetails } from '../../actions/GroupsActions'
import { suggestBarUpdate } from '../../actions/BarActions'

class TeamSelect extends Component {
    constructor(props) {
        super(props);
        this.state = { teams: [], numOfTeamsSelected: 0 };
    }

    static navigationOptions = ({ navigation }) => {
        const source = navigation.getParam('source', 'SignUp');
        const maxSelectable = source === 'MyGroups' || source === 'BarDetails' ? 1 : 6
        return {
            headerTitle: `Select Up To ${maxSelectable} Teams`,
            headerLeft: null,
            headerRight: (
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (source == 'Home') {
                            navigation.navigate('Home')
                        } else if (source === "MyGroups") {
                            navigation.navigate('MyGroups', { overlayVisible: true})
                        } else if (source === "BarDetails") {
                            navigation.navigate('BarDetails')
                        } else {
                            navigation.navigate('Questionnaire')
                        }
                    }}
                    style={globalStyles.headerRightButtonWrapper}
                >
                    <Text style={{ color: colors.primary, fontSize: 14, marginRight: 15 }} > {source == 'Home' ? "Done" : "Next"}</Text>
                </TouchableWithoutFeedback>
            ),
            headerStyle: [globalStyles.headerStyle, { height: 60, paddingTop: 10 }],
            headerTitleStyle: globalStyles.headerTitleStyle
        };
    };

    componentDidMount() {
        const source = this.props.navigation.getParam('source', 'SignUp');
        var teamsArr = [];

        firestore().collection('teams').get().then((teams) => {
            teams.forEach((e, i) => {
                var newTeam = {
                    teamId: e.id,
                    name: e.data().name,
                    league: e.data().league,
                    api_id: e.data().api_id,
                    isSelected: false
                };

                if (source == 'Home') {
                    //preselect favorite teams
                    var favTeams = this.props.favoriteTeams.teams;
                    const found = favTeams.some(el => el.teamId == e.id);
                    if (found) {
                        newTeam.isSelected = true;
                    }
                }

                teamsArr.push(newTeam);
            })

            this.setState({
                teams: teamsArr
            });

            _storeLocalItem("teams", teamsArr);
        })

    }

    renderLeague = (type) => {
        var teams = this.state.teams.filter(function (obj) {
            return obj.league == type;
        })

        return (
            <FlatList
                data={teams}
                renderItem={({ item }) => (
                    this.renderTeamButton(item)
                )}
                numColumns={3}
                keyExtractor={(item, index) => index}
            />
        )
    }

    onTeamSelect(team) {

        const source = this.props.navigation.getParam('source', 'SignUp');
        //update state
        var teams = [...this.state.teams];
        var index = teams.findIndex(obj => obj.teamId === team.teamId);

        if (teams[index].isSelected) { //current status is true, switching to UNSELECTED
            this.setState({ teams, numOfTeamsSelected: this.state.numOfTeamsSelected - 1 });
        } else {
            var maxSelectable = source === 'MyGroups' || source === 'BarDetails' ? 1 : 6
            //check number of isSelected
            var numOfAlreadySelected = this.state.teams.filter(function (x) { return x.isSelected }).length;
            if (numOfAlreadySelected >= maxSelectable) {
                Alert.alert(
                    '',
                    `You may only select up to ${maxSelectable} teams.`,
                    [
                        {
                            text: 'OK',
                            onPress: () => { },
                            style: 'cancel',
                        }
                    ]
                );
                return true;
            }
        }

        teams[index].isSelected = !teams[index].isSelected; //flip current status
        this.setState({ teams });

        //update redux store
        if (source === 'MyGroups') {
            this.props.addNewGroupDetails('teams',[team])
        } else if (source === 'BarDetails') {
            this.props.suggestBarUpdate('addedTeams',[team])
        } else {
            this.props.addRemoveFavorites({ team });
        }
    }

    renderTeamButton(item) {
        // console.log('item.teamId :>> ', );
        // const imageSrc = require('../../constants/images/teams/nflwas.png')
        // console.log('styles.logo :>> ', teamImage);
        // teamImages[item.teamId]
        return (
            <TouchableWithoutFeedback onPress={() => this.onTeamSelect(item)}>
                <View style={[styles.logoWrapper, item.isSelected ? styles.selectedTeam : null]}>
                    <Image
                        style={[styles.logo, { resizeMode: 'contain', width: '100%', height: '100%'}]}
                        source={teamImages[item.teamId]} resizeMode="contain" />
                    <Text style={styles.teamName}>{item.name}</Text>
                </View>
            </TouchableWithoutFeedback >
        );
    }

    render() {
        var defaultTeamIndex = 0;
        return (
            <View style={styles.mainContainer}>
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
                    <View tabLabel='NFL' style={tabBarStyles.viewContainer} key='0'>
                        {this.renderLeague('NFL')}
                    </View>
                    <View tabLabel='NBA' style={tabBarStyles.viewContainer} key='1'>
                        {this.renderLeague('NBA')}
                    </View>
                    <View tabLabel='NCAAF' style={tabBarStyles.viewContainer} key='2'>
                        {this.renderLeague('NCAAF')}
                    </View>
                    <View tabLabel='NCAAB' style={tabBarStyles.viewContainer} key='3'>
                        {this.renderLeague('NCAAB')}
                    </View>
                    <View tabLabel='MLB' style={tabBarStyles.viewContainer} key='4'>
                        {this.renderLeague('MLB')}
                    </View>
                    <View tabLabel='NHL' style={tabBarStyles.viewContainer} key='5'>
                        {this.renderLeague('NHL')}
                    </View>
                    <View tabLabel='MLS' style={tabBarStyles.viewContainer} key='6'>
                        {this.renderLeague('MLS')}
                    </View>
                    <View tabLabel='EPL' style={tabBarStyles.viewContainer} key='7'>
                        {this.renderLeague('EPL')}
                    </View>
                </ScrollableTabView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        favoriteTeams: state.favoriteTeams,
        auth: state.auth,
        bars: state.bars
    }
}

const mapDispatchToProps = {
    addRemoveFavorites,
    addNewGroupDetails,
    suggestBarUpdate
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamSelect);
