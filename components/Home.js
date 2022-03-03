import React, { Component } from 'react';
import { ScrollView, View, TouchableWithoutFeedback, TouchableOpacity, FlatList, Image, Text, TextInput, Modal } from 'react-native';

import { connect } from 'react-redux';
import { Avatar, Icon, Button } from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import auth from '@react-native-firebase/auth'

import teamImages from '../public/images/teamImages';
import globalStyles from '../stylesheets/globalStyles';
import styles from '../stylesheets/homeStyles';
import colors from '../stylesheets/colors';

import { getUserProfile, updateUserFCMToken } from '../actions/AuthActions';
import { setSelectedTeam } from '../actions/FavoriteTeamsActions';
import { getRoster } from '../actions/RosterActions';
import { getMessageList } from '../actions/MyMessagesActions';
import { getBlockedUsers } from '../actions/BlockedUsersActions';
import { updateLocation } from '../actions/LocationActions';
import { fetchMyGroups, fetchAllGroups } from '../actions/GroupsActions'
import { fetchUserChatrooms } from '../actions/ChatActions';
import citiesList from '../data/cities.json';

class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changeLocationModalVisible: false,
            locationSearchTerm: '',
            cities: citiesList
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: null,
            headerLeft: null,
            headerRight: (
                <TouchableOpacity
                    onPress={() => navigation.navigate('Settings')}
                    style={globalStyles.headerRightButtonWrapper}
                >
                    <Icon
                        name="cog"
                        type="font-awesome"
                        color={colors.lightTxt}
                        size={22}
                    />

                </TouchableOpacity>
            ),
            headerStyle: globalStyles.headerStyle,
            headerTitleStyle: globalStyles.headerTitleStyle
        };
    };

    componentDidMount() {
        this.checkNotificationsPermission();
        this.props.setSelectedTeam({ team: {} });
        this.props.getMessageList();
        this.props.getRoster();
        this.props.getBlockedUsers();
        this.props.getUserProfile();
        if (!this.props.auth.userProfile.username) {
            //userProfile was never populated (new Signup)
            this.props.getUserProfile();
        }
    }

    //1
    async checkNotificationsPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getFCMToken();
        } else {
            this.requestPermission();
        }
    }

    //3
    async getFCMToken() {
        var that = this;
        try {
            fcmToken = await messaging().getToken();
            if (fcmToken && this.props.auth.userProfile.fcmToken != "Denied") {
                firestore().collection('users2').doc(auth().currentUser.uid).update({
                    fcmToken: fcmToken
                })
                    .then(() => {
                        that.props.updateUserFCMToken(fcmToken);
                    })
                    .catch(function (error) {
                    });
            } else {
            }
        } catch (error) {
            // User has rejected permissions
            console.log(error);
        }
    }

    //2
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorized
            this.getFCMToken();
        } catch (error) {
            //user rejected permissions
            if (this.props.auth.userProfile.fcmToken != "Denied") {
                // User has rejected permissions
                this.props.updateUserFCMToken('Denied');
                firestore().collection('users2').doc(auth().currentUser.uid).update({
                    fcmToken: 'Denied'
                })
                    .then(() => {
                    })
                    .catch(function (error) {
                    });
            }

        }
    }

    onTeamSelect(team) {
        const {location, auth} = this.props
        this.props.setSelectedTeam({ team, location, auth });
        this.props.navigation.navigate('TeamDashboard');
    }

    renderTeam(item) {
        return (
            <TouchableWithoutFeedback onPress={() => this.onTeamSelect(item)}>
                <View style={styles.logoWrapper}>
                    {item.league == 'NCAAF' ? <View style={{ position: 'absolute', top: 10, right: 10 }}><Icon
                        name='ios-american-football'
                        type='ionicon'
                        color={colors.gray}
                        size={18} /></View> : <View></View>}
                    {item.league == 'NCAAB' ? <View style={{ position: 'absolute', top: 10, right: 10 }}><Icon
                        name='ios-basketball'
                        type='ionicon'
                        color={colors.gray}
                        size={18} /></View> : <View></View>}
                    <Image style={styles.logo} source={teamImages[item.teamId]} resizeMode="contain" />
                </View>
            </TouchableWithoutFeedback>
        );
    }

    renderCityRow(item) {
        return (
            <TouchableWithoutFeedback onPress={() => this.citySelected(item)} >
                <View style={styles.locationRowWrapper}>
                    <Text style={{ fontWeight: "bold" }}>
                        {item.value}
                    </Text>
                    <Text style={{ fontSize: 10, color: '#b8b8b8', marginTop: 5 }}>
                        {item.search}
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    updateLocation = (val, index, data) => {
        let location = citiesList[index];
        this.props.updateLocation(location.id, location.value, location.coordinates);
    }

    citySelected = (item) => {
        this.props.updateLocation(item.id, item.value, item.coordinates);
        this.setState({ changeLocationModalVisible: false, cities: citiesList });
    }

    filterCities = (text) => {
        var filteredCities = [];
        if (text) {
            text = text.toLowerCase();
            for (const c of this.state.cities) {
                if (c.search.toLowerCase().indexOf(text) >= 0) {
                    filteredCities.push(c);
                }
            }
        } else {
            filteredCities = citiesList;
        }

        this.setState({ cities: filteredCities });
    }

    render() {
        return (
            <View style={globalStyles.mainContainer}>
                <View style={globalStyles.headerExtended}></View>

                <View style={styles.homeContentWrapper}>
                    <View style={styles.profileWrapper}>
                        <View style={styles.locationSection}>
                            <Icon name='map-marker' type='font-awesome' size={20}></Icon>
                            <Text style={styles.locationLabel} onPress={() => this.setState({ changeLocationModalVisible: true })}>
                                {this.props.location.currentLocationName}
                            </Text>
                        </View>
                        <View style={[styles.avatarSection]}>
                            {
                                this.props.auth.userProfile.avatar && this.props.auth.userProfile.avatar != "" ?
                                    <Avatar size="large"
                                        source={{ uri: this.props.auth.userProfile.avatar }}
                                        rounded
                                    />
                                    :
                                    <Avatar size="large"
                                        title={(this.props.auth.userProfile.username ? this.props.auth.userProfile.username[0].toUpperCase() : '')}
                                        rounded
                                    />
                            }


                        </View>
                        <View style={styles.nameSection}>
                            <Text style={styles.name}>{this.props.auth.userProfile.username}</Text>
                        </View>
                        <View style={styles.taglineSection}>
                            <Text style={styles.tagline}>{this.props.auth.userProfile.tagline}</Text>
                        </View>
                        <View style={styles.buttonsSection}>
                            <View style={styles.buttonsWrapper}>
                                <TouchableOpacity style={styles.btnStyle}
                                    onPress={() => {
                                        this.props.navigation.navigate('Questionnaire', {
                                            source: 'Home'
                                        });
                                    }}>
                                    <LinearGradient colors={[colors.primary, colors.primaryDarker]} style={globalStyles.linearGradient}
                                        angle={45} useAngle={true}>
                                        <Text style={styles.btnTextStyle}>
                                            Edit Profile
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.buttonsWrapper}>
                                <TouchableOpacity style={styles.btnStyle} onPress={() => {
                                    this.props.navigation.navigate('TeamSelect', {
                                        source: 'Home'
                                    });
                                }}>
                                    <LinearGradient colors={[colors.primary, colors.primaryDarker]} style={globalStyles.linearGradient}
                                        angle={45} useAngle={true}>
                                        <Text style={styles.btnTextStyle}>
                                            Edit Teams
                                        </Text>
                                    </LinearGradient>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.buttonsWrapper}>
                                <TouchableOpacity 
                                onPress={() => {
                                    this.props.fetchMyGroups(this.props.auth.userProfile.groups)
                                    this.props.fetchAllGroups(this.props.location);
                                    this.props.navigation.navigate('MyGroups');
                                }}
                                style={styles.btnStyle}>

                                    <LinearGradient colors={[colors.primary, colors.primaryDarker]} style={globalStyles.linearGradient}
                                        angle={45} useAngle={true}>
                                        <Text style={styles.btnTextStyle}>My Groups</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={[styles.teamsSection]}>
                        <FlatList
                            data={this.props.favoriteTeams.teams}
                            renderItem={({ item }) => (
                                this.renderTeam(item)
                            )}
                            numColumns={3}
                            keyExtractor={(item, index) => index}
                        />
                    </View>
                </View >
                <Modal
                    animationType="slide"
                    visible={this.state.changeLocationModalVisible}
                >
                    <View style={styles.modal}>
                        <View style={styles.modalWrapper}>
                            <View style={styles.modalHeader}>
                                <Text style={[{ width: 260, alignSelf: 'flex-start', height: 45, padding: 7, fontSize: 18, fontWeight: 'bold', justifyContent: 'center' }]}>Change Location</Text>
                                <TouchableOpacity style={[{ width: 100, alignContent: 'flex-end', justifyContent: 'center', marginLeft: 15 }]}
                                    onPress={() => this.setState({ changeLocationModalVisible: false })}>
                                    <LinearGradient colors={[colors.primary, colors.primaryDarker]} style={globalStyles.linearGradient}
                                        angle={45} useAngle={true}>
                                        <Text style={styles.btnTextStyle}>
                                            Close
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            <View style={{ paddingHorizontal: 15, marginBottom: 10 }}>
                                <TextInput
                                    style={[{ width: "100%", backgroundColor: colors.grayLighter, height: 45, padding: 7, borderRadius: 5 }]}
                                    onChangeText={(text) => {
                                        this.filterCities(text)
                                    }}
                                    placeholder="Filter by City"
                                    autoCorrect={false}

                                />
                            </View>
                            <FlatList
                                data={this.state.cities}
                                renderItem={({ item }) => (
                                    this.renderCityRow(item)
                                )}
                                keyExtractor={(item, index) => item.id}
                            />
                        </View>
                    </View>
                </Modal>
            </View >
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        favoriteTeams: state.favoriteTeams,
        location: state.location,
        messages: state.messages
    }
}

const mapDispatchToProps = {
    getUserProfile,
    updateUserFCMToken,
    setSelectedTeam,
    getMessageList,
    getRoster,
    getBlockedUsers,
    updateLocation,
    fetchAllGroups,
    fetchMyGroups,
fetchUserChatrooms }

export default connect(mapStateToProps, mapDispatchToProps)(Home);
