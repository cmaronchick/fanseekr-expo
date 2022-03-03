import React, { Component } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, FlatList, Image, Alert, Modal } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import teamImages from '../public/images/teamImages';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'


import globalStyles from '../stylesheets/globalStyles';
import styles from '../stylesheets/profileStyles';
import colors from '../stylesheets/colors';
import { addToRoster, removeFromRoster } from '../actions/RosterActions';
import { addBlockedUser, removeBlockedUser } from "../actions/BlockedUsersActions";

class Profile extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state, setParams, navigate } = navigation;
        const params = state.params || {};

        return {
            title: params.username,
            headerRight:
                (<TouchableOpacity
                    onPress={navigation.getParam('showMainModal')}
                    style={globalStyles.headerRightButtonWrapper}
                >
                    <Icon
                        name="ellipsis-h"
                        type="font-awesome"
                        color={colors.lightTxt}
                        size={16}
                    />
                </TouchableOpacity>),
            headerLeft: (
                <TouchableOpacity
                    onPress={navigation.getParam('goBack')}
                    style={globalStyles.headerLeftButtonWrapper}
                >
                    <Icon
                        name="arrow-back"
                        type="ionic"
                        color={colors.lightTxt}
                        size={22}
                    />
                </TouchableOpacity>
            ),
            headerStyle: globalStyles.headerStyle,
            headerTitleStyle: globalStyles.headerTitleStyle
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            avatar: "",
            username: "",
            tagline: "",
            favoriteAthlete: "",
            favoriteSport: "",
            mostHatedTeam: "",
            leastFavoriteAthlete: "",
            userId: "",
            addedToRoster: false,
            teamId: "",
            teams: [],
            showMainModal: false,
            showReportUserModal: false,
            isUserBlocked: false
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        const _user = navigation.getParam("user");
        navigation.setParams({ goBack: this.goBack });
        navigation.setParams({ showMainModal: this.showMainModal });

        const teamId = this.props.navigation.getParam('teamId', ''); //used if props.favTeam.selectedTeamId is null
        var isUserBlocked = this.props.blockedUsers.users.filter(user => user.userId === _user._id).length > 0;

        var that = this;
        firestore().collection('users2').doc(_user._id).get()
            .then(function (user) {
                that.setState({
                    avatar: user.data().avatar,
                    username: user.data().username,
                    tagline: user.data().tagline,
                    favoriteAthlete: user.data().favoriteAthlete,
                    favoriteSport: user.data().favoriteSport,
                    mostHatedTeam: user.data().mostHatedTeam,
                    leastFavoriteAthlete: user.data().leastFavoriteAthlete,
                    userId: _user._id,
                    teamId: teamId,
                    teams: user.data().teams,
                    isUserBlocked: isUserBlocked
                });

                that.props.navigation.setParams({
                    username: user.data().username
                })

            })
            .catch(function (error) {
            });

        //check if user is already on roster
        firestore().collection('rosters').doc(auth().currentUser.uid).collection('users2').doc(_user._id).get()
            .then(doc => {
                if (doc.exists) {
                    that.setState({
                        ...this,
                        addedToRoster: true
                    });
                } else {
                    that.setState({
                        ...this,
                        addedToRoster: false
                    });
                }
            })
            .catch(function (error) {
            });
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    showMainModal = () => {
        this.setState({ ...this, showMainModal: true });
    }

    reportUser = (spam) => {
        const _user = this.props.navigation.getParam("user");
        var self = this;
        var userRef = firestore().collection('users_reported').doc(_user._id);

        if (spam) {
            firestore().runTransaction(t => {
                return t.get(userRef)
                    .then(doc => {
                        var count = 0;
                        if (doc.exists) {
                            if (doc.data().reportedAsSpamCount) {
                                count = doc.data().reportedAsSpamCount;
                            }

                            var newCount = count + 1;
                            t.update(userRef, { reportedAsSpamCount: newCount });
                        } else {
                            userRef.set({ reportedAsSpamCount: count, reportedAsInappropriateCount: 0, username: this.state.username, userId: this.state.userId })
                        }

                        self.setState({ ...this, showReportUserModal: false });
                    });
            }).then(result => {
                Alert.alert(
                    '',
                    'User has been reported.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                            },
                            style: 'cancel'
                        }
                    ]
                );
            }).catch(err => {
            });
        } else {
            firestore().runTransaction(t => {
                return t.get(userRef)
                    .then(doc => {
                        var count = 0;
                        if (doc.exists) {
                            if (doc.data().reportedAsInappropriateCount) {
                                count = doc.data().reportedAsInappropriateCount;
                            }

                            var newCount = count + 1;
                            t.update(userRef, { reportedAsInappropriateCount: newCount });
                        } else {
                            userRef.set({ reportedAsSpamCount: count, reportedAsInappropriateCount: 0, username: this.state.username, userId: this.state.userId })
                        }

                        self.setState({ ...this, showReportUserModal: false });
                    });
            }).then(result => {
                Alert.alert(
                    '',
                    'User has been reported.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                            },
                            style: 'cancel'
                        }
                    ]
                );
            }).catch(err => {
            });
        }
    }

    blockUser = () => {
        this.props.addBlockedUser(this.state.userId, this.state.username);
        this.setState({
            ...this,
            isUserBlocked: true
        });
    }

    unblockUser = () => {
        this.props.removeBlockedUser(this.state.userId, this.state.username);
        this.setState({
            ...this,
            isUserBlocked: false
        });
    }

    addToRoster = () => {
        this.setState({
            ...this,
            addedToRoster: true
        });
        var teamId = this.props.favTeams.selectedTeam.teamId ? this.props.favTeams.selectedTeam.teamId : this.state.teamId;
        this.props.addToRoster(this.state.userId, this.state.username, this.state.avatar, teamId, this.state.teams);
    }

    removeFromRoster = () => {
        this.props.removeFromRoster(this.state.userId);
        this.setState({
            ...this,
            addedToRoster: false
        });
        if (!this.props.favTeams.selectedTeam.teamId) {
            //removed from home page to disallow adding users without selecting team
            this.props.navigation.goBack();
        }
    }

    renderButtons() {
        if (this.state.userId != auth().currentUser.uid && (this.state.teamId || this.props.favTeams.selectedTeam.teamId)) {
            return (
                <View style={styles.buttonsSection}>
                    {
                        this.props.navigation.state.routeName != 'ProfileMyMessages' ?
                            <View style={styles.buttonsWrapper}>
                                <TouchableOpacity style={styles.btnStyle}
                                    onPress={() => {
                                        if (this.props.navigation.state.routeName == 'ProfileRoster') {
                                            this.props.navigation.navigate('DirectMessageRoster', {
                                                recipient: this.state.userId,
                                                username: this.state.username,
                                                avatar: this.state.avatar,
                                                teamId: this.state.teamId
                                            });
                                        } else {
                                            this.props.navigation.navigate('DirectMessageTeam', {
                                                recipient: this.state.userId,
                                                username: this.state.username,
                                                avatar: this.state.avatar,
                                                teamId: this.state.teamId
                                            });
                                        }

                                    }}>
                                    <LinearGradient colors={[colors.primary, colors.primaryDarker]} style={globalStyles.linearGradient}
                                        angle={45} useAngle={true}>
                                        <Text style={styles.btnTextStyle}>
                                            Message
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                            :
                            <Text></Text>
                    }
                    <View style={styles.buttonsWrapper}>
                        {this.state.addedToRoster ?
                            (
                                <TouchableOpacity style={styles.altBtnStyle} onPress={() => {
                                    this.removeFromRoster()
                                }}>
                                    <Text style={styles.altBtnTextStyle}>
                                        Remove from Roster
                                </Text>
                                </TouchableOpacity>
                            )
                            :
                            (
                                <TouchableOpacity style={styles.btnStyle} onPress={() => {
                                    this.addToRoster()
                                }}>
                                    <LinearGradient colors={[colors.primary, colors.primaryDarker]} style={globalStyles.linearGradient}
                                        angle={45} useAngle={true}>
                                        <Text style={styles.btnTextStyle}>
                                            Add To Roster
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            )
        }
    }

    renderTeam(item) {
        return (
            <View style={styles.logoWrapper}>
                <Image style={styles.logo} source={teamImages[item.teamId]} resizeMode="contain" />
            </View>
        );
    }

    render() {
        return (
            <View style={globalStyles.mainContainer}>
                <View style={globalStyles.headerExtended}></View>
                <SafeAreaView style={styles.profileWrapper}>
                    <View style={styles.floatingContentWrapper}>

                        <View style={[styles.avatarSection]}>
                            {this.state.avatar ?
                                <Avatar size="xlarge"
                                    source={{ uri: this.state.avatar }}
                                    rounded
                                />
                                :
                                <Avatar size="xlarge"
                                    title={this.state.username ? this.state.username[0].toUpperCase() : ""}
                                    rounded
                                />
                            }

                            {this.state.tagline ?
                                <Text style={styles.tagLineWrapper}>
                                    {this.state.tagline}
                                </Text>
                                :
                                <View />
                            }
                            <FlatList
                                data={this.state.teams}
                                renderItem={({ item }) => (
                                    this.renderTeam(item)
                                )}
                                numColumns={6}
                                keyExtractor={(item, index) => index}
                            />

                            {this.renderButtons()}
                        </View>


                        {this.state.favoriteSport ?
                            <View style={styles.rowStyle}>
                                <Text style={styles.labelStyle}>FAVORITE SPORT:</Text>
                                <Text style={styles.textStyle}>
                                    {this.state.favoriteSport}
                                </Text>
                            </View>
                            :
                            <View />
                        }

                        {this.state.favoriteAthlete ?
                            <View style={styles.rowStyle}>
                                <Text style={styles.labelStyle}>FAVORITE ATHLETE:</Text>
                                <Text style={styles.textStyle}>
                                    {this.state.favoriteAthlete}
                                </Text>
                            </View>
                            :
                            <View />
                        }
                        {this.state.leastFavoriteAthlete ?
                            <View style={styles.rowStyle}>
                                <Text style={styles.labelStyle}>MOST HATED ATHLETE:</Text>
                                <Text style={styles.textStyle}>
                                    {this.state.leastFavoriteAthlete}
                                </Text>
                            </View>
                            :
                            <View />
                        }

                        {this.state.mostHatedTeam ?
                            <View style={styles.rowStyle}>
                                <Text style={styles.labelStyle}>MOST HATED TEAM:</Text>
                                <Text style={styles.textStyle}>
                                    {this.state.mostHatedTeam}
                                </Text>
                            </View> :
                            <View />
                        }
                    </View>
                </SafeAreaView>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showMainModal}
                >
                    <View style={styles.modalWrapper}>
                        <View style={styles.mainModalContent}>
                            <TouchableOpacity
                                style={styles.btnStyle}
                                onPress={() => {
                                    this.setState({ ...this, showMainModal: false, showReportUserModal: true })
                                }}>
                                <LinearGradient colors={['#ff583e', '#d1371f']} style={globalStyles.linearGradient}
                                    angle={45} useAngle={true}>
                                    <Text style={styles.btnTextStyle}>
                                        Report User
                                        </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {
                                this.state.isUserBlocked ?
                                    <TouchableOpacity
                                        style={styles.btnStyle}
                                        onPress={() => {
                                            this.unblockUser();
                                        }}>
                                        <LinearGradient colors={[colors.primary, colors.primaryDarker]} style={globalStyles.linearGradient}
                                            angle={45} useAngle={true}>
                                            <Text style={styles.btnTextStyle}>
                                                Unblock User
                                        </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        style={styles.btnStyle}
                                        onPress={() => {
                                            this.blockUser();
                                        }}>
                                        <LinearGradient colors={['#ff583e', '#d1371f']} style={globalStyles.linearGradient}
                                            angle={45} useAngle={true}>
                                            <Text style={styles.btnTextStyle}>
                                                Block User
                                        </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                            }

                            <TouchableOpacity
                                style={styles.closeBtnStyle}
                                onPress={() => {
                                    this.setState({ ...this, showMainModal: false })
                                }}>
                                <Text style={styles.altBtnTextStyle}>
                                    Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.showReportUserModal}
                >
                    <View style={styles.modalWrapper}>
                        <View style={styles.reportModalContent}>
                            <TouchableOpacity
                                style={styles.btnStyle}
                                onPress={() => {
                                    this.reportUser(true);
                                    this.setState({ ...this, showMainModal: false })

                                }}>
                                <LinearGradient colors={['#ff583e', '#d1371f']} style={globalStyles.linearGradient}
                                    angle={45} useAngle={true}>
                                    <Text style={styles.btnTextStyle}>
                                        Mark as Spam
                                        </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.btnStyle}
                                onPress={() => {
                                    this.reportUser(false);
                                    this.setState({ ...this, showMainModal: false })
                                }}>
                                <LinearGradient colors={['#ff583e', '#d1371f']} style={globalStyles.linearGradient}
                                    angle={45} useAngle={true}>
                                    <Text style={styles.btnTextStyle}>
                                        Mark as Inappropriate
                                        </Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.closeBtnStyle}
                                onPress={() => {
                                    this.setState({ ...this, showReportUserModal: false })
                                }}>
                                <Text style={styles.altBtnTextStyle}>
                                    Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View >
        );
    }
}

const mapStateToProps = state => {
    return {
        favTeams: state.favoriteTeams,
        blockedUsers: state.blockedUsers
    }
}

export default connect(mapStateToProps, { addToRoster, removeFromRoster, addBlockedUser, removeBlockedUser })(Profile);
