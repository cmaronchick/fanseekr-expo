import React, { Component, Fragment } from 'react';
import { View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Text,
    Linking,
    ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { Icon, Avatar, Input, Button, CheckBox } from 'react-native-elements';
import moment from "moment";
import teamImages from '../../public/images/teamImages';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import globalStyles from '../../stylesheets/globalStyles';
import styles from '../../stylesheets/barDetailsStyles';
import colors from '../../stylesheets/colors';
import { 
    getBarDetails,
    updateBarDetails,
    suggestBarUpdate,
    submitBarSuggestion } from '../../actions/BarActions'
import { getUsersParties, addParty, removeParty } from '../../actions/PartyActions';

import NavigationService from '../../NavigationService'

class BarDetails extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const params = state.params || {};
        return {
            title: params.barName,
            headerRight: null,
            headerLeft: (
                <TouchableOpacity
                    onPress={navigation.getParam('goBack')}
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
            headerStyle: globalStyles.teamHeaderStyle,
            headerTitleStyle: globalStyles.teamHeaderTitleStyle
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            barDetails: {},
            parties: [],
            isEditing: false
        };
    }
    getBarDetails = async (barId) => {
        console.log(`barId`, barId)
        let barDetails = await this.props.getBarDetails(barId)
        console.log(`barDetails`, barDetails)
        this.setState({ 
            barDetails: this.props.bars.selectedBarDetails
        })
        
        let parties = await doc.ref.collection("parties").get()
            parties.docs.forEach(p => {
                let partyDetail = p.data();
                let partyDate = new Date(partyDetail.date);

                if (partyDetail.teamId == this.props.teams.selectedTeam.teamId && partyDetail.usersAttending.length > 0 && partyDate >= today) {
                    partyDetail.date = moment(partyDetail.date).format("dddd, MMMM Do, YYYY");
                    var partiesJoined = this.state.parties.concat(partyDetail);
                    this.setState({ parties: partiesJoined })

                }
            })
    }

    componentDidMount() {
        let barName = this.props.navigation.getParam("name", "");
        let barId = this.props.navigation.getParam("barId", 0);
        this.props.navigation.setParams({ goBack: this.goBack, barName: barName });
        let today = new Date(new Date().setHours(0, 0, 0, 0));
        //TODO: change location below
        if (barId) {
            this.getBarDetails(barId)
        }
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    renderWatchParties = () => {
        var self = this;
        if (this.state.parties.length > 0) {
            return (
                this.state.parties.map((p, key) => {
                    return (
                        <View style={(key === this.state.parties.length - 1) ? { marginBottom: 20 } : styles.partyCard} key={key} >
                            <View style={styles.cardRow}>
                                <View style={styles.cardIconWrapper}>
                                    <Icon name="calendar" type="font-awesome" color={colors.darkTxt} size={16} />
                                </View>
                                <Text numberOfLines={1} style={styles.cardText}>
                                    {p.date}
                                </Text>
                                <View style={{ marginLeft: "auto" }}>
                                    {self.renderAttendButton(p, key)}
                                </View>
                            </View>
                            <View style={styles.cardRow}>
                                <View style={styles.cardIconWrapper}>
                                    <Icon name="flag" type="font-awesome" color={colors.darkTxt} size={16} />
                                </View>
                                <Text>{this.props.teams.selectedTeam.name} vs. {p.opponent}</Text>
                            </View>
                            <View>
                                <View>
                                    <Text style={{ fontWeight: "bold", marginTop: 10, marginBottom: 5 }}>{p.usersAttending.length.toString()} people are going</Text>
                                </View>
                            </View>
                            <View style={[styles.cardRow]}>
                                <View style={{ flexDirection: 'row' }}>
                                    {p.usersAttending.slice(0, 8).map((u, uk) => <Avatar size="small"
                                        source={{ uri: u.avatar }}
                                        rounded
                                        key={uk}
                                        containerStyle={{ marginLeft: 5 }}
                                    />)}
                                </View>
                                {/* <View style={{ marginLeft: "auto" }}>
                                    <Icon name="chevron-right" type="font-awesome" color={colors.grayLighter} size={16} />
                                </View> */}
                            </View>
                        </View >
                    )
                })
            )
        } else {
            return (
                <View>
                    <Text>There are no {this.props.teams.selectedTeam.name} watch parties for this venue.</Text>
                </View>
            )
        }
    }

    renderUpcomingGames = () => {
        const { teamGames } = this.props.teams;
        if (teamGames.length > 0) {
            return (
                teamGames.map((g, index) => {
                    return index === 0 && (
                        <View style={(index === teamGames.length - 1) ? { marginBottom: 20 } : styles.partyCard} key={g.gameId} >
                            <View style={styles.cardRow}>
                                <View style={styles.cardIconWrapper}>
                                    <Icon name="calendar" type="font-awesome" color={colors.darkTxt} size={16} />
                                </View>
                                <Text numberOfLines={1} style={styles.cardText}>
                                    {moment(g.startDateTime).format('MMM D, YYYY h:mm a')}
                                </Text>
                                <View style={{ marginLeft: "auto" }}>
                                    {/* {self.renderAttendButton(g, index)} */}
                                </View>
                            </View>
                            <View style={styles.cardRow}>
                                <View style={styles.cardIconWrapper}>
                                    <Icon name="flag" type="font-awesome" color={colors.darkTxt} size={16} />
                                </View>
                                <Text>
                                    {g.awayTeam.fullName} at {g.homeTeam.fullName}
                                </Text>
                            </View>
                            <View>
                                <View>
                                    {/* <Text style={{ fontWeight: "bold", marginTop: 10, marginBottom: 5 }}>{p.usersAttending.length.toString()} people are going</Text> */}
                                </View>
                            </View>
                            <View style={[styles.cardRow]}>
                                <View style={{ flexDirection: 'row' }}>
                                    {/* {p.usersAttending.slice(0, 8).map((u, uk) => <Avatar size="small"
                                        source={{ uri: u.avatar }}
                                        rounded
                                        key={uk}
                                        containerStyle={{ marginLeft: 5 }}
                                    />)} */}
                                </View>
                                {/* <View style={{ marginLeft: "auto" }}>
                                    <Icon name="chevron-right" type="font-awesome" color={colors.grayLighter} size={16} />
                                </View> */}
                            </View>
                        </View >
                    )
                })
            )

        }
    }

    renderAttendButton = (game, gameIndex) => {
        var watchPatchPartyId = selectedBarDetails.barId + "_" + game.gameId;
        var attending = this.props.parties.parties.filter(p => p.watchPartyId == watchPatchPartyId).length > 0;
        if (attending) {
            return <TouchableOpacity onPress={() => { this.unattendWatchParty(game, gameIndex) }}>
                <View style={styles.watchPartyUnattendButton}>
                    <Text style={styles.watchPartyButtonText}>
                        I'm out
                    </Text>
                </View>
            </TouchableOpacity>
        } else {
            return <TouchableOpacity onPress={() => { this.attendWatchParty(game, gameIndex) }}>
                <View style={styles.watchPartyAttendButton}>
                    <Text style={styles.watchPartyButtonText}>
                        I'm in!
                    </Text>
                </View>
            </TouchableOpacity>
        }
    }

    attendWatchParty = async (game, gameIndex) => {
        this.props.addParty(this.props.bars.selectedBarDetails, game);

        const parties = [...this.state.parties]; //make copy of parties array in state

        parties[gameIndex].usersAttending = [...parties[gameIndex].usersAttending, {
            name: this.props.auth.userProfile.username,
            avatar: this.props.auth.userProfile.avatar,
            _id: auth().currentUser.uid
        }];
        this.setState({ parties: parties });
    }

    unattendWatchParty = async (game, gameIndex) => {
        this.props.removeParty(this.props.bars.selectedBarDetails, game);

        const parties = [...this.state.parties]; //make copy of parties array in state

        parties[gameIndex].usersAttending = parties[gameIndex].usersAttending.filter(user => user._id !== auth().currentUser.uid);
        this.setState({ parties: parties });
    }

    openMapForDirections = () => {
        let open = Platform.select({
            ios: () => {
                Linking.openURL('http://maps.apple.com/maps?daddr=' + selectedBarDetails.address);
            },
            android: () => {
                Linking.openURL('http://maps.google.com/maps?daddr=' + selectedBarDetails.address);
            }
        });

        open();
    }

    render() {
        const { bars, teams } = this.props
        const {selectedBarDetails} = bars ? bars : { selectedBarDetails: null}
        const {isLoading} = selectedBarDetails
        const { isEditing } = this.state
        console.log(`selectedBarDetails`, selectedBarDetails)
        return (
            <View style={styles.mainContainer}>
                {isLoading || !selectedBarDetails ? (
                    <View style={[globalStyles.mainContainer, {justifyContent: 'center'}]}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                <ScrollView>
                    <View>
                        <Text style={styles.sectionHeader}>Venue</Text>
                    </View>
                    <View style={styles.sectionWrapper}>
                        <View style={styles.cardRow}>
                            <View style={styles.cardIconWrapper}>
                                <Icon name="map-marker" type="font-awesome" color={colors.darkTxt} size={16} onPress={() => this.openMapForDirections()} />
                            </View>
                            <Text numberOfLines={1} style={styles.cardText} onPress={() => this.openMapForDirections()}>
                                {selectedBarDetails.address}
                            </Text>
                        </View>
                        <View style={styles.cardRow}>
                            <View style={styles.cardIconWrapper}>
                                <Icon name="phone" type="font-awesome" color={colors.darkTxt} size={16} onPress={() => {
                                    Linking.openURL(`tel:${selectedBarDetails.phone.replace(' ', '')}`)
                                }} />
                            </View>
                            <Text numberOfLines={1} style={styles.cardText} onPress={() => {
                                Linking.openURL(`tel:${selectedBarDetails.phone.replace(' ', '')}`)
                            }}>
                            {selectedBarDetails.phone}
                            </Text>
                        </View>
                        {selectedBarDetails.website ?
                            (<View style={styles.cardRow}>
                                        <View style={styles.cardIconWrapper}>
                                            <Icon name="globe" type="font-awesome" color={colors.darkTxt} size={16} />
                                        </View>
                                        <Text numberOfLines={1} style={styles.cardText} onPress={
                                            () => Linking.openURL(selectedBarDetails.website)
                                        }>
                                            {selectedBarDetails.website}
                                        </Text>
                            </View>) : (<View></View>)}
                        {isEditing ? (
                            <Fragment>
                            <View style={styles.cardColumn}>
                                <CheckBox
                                title="Bar is Closed"
                                titleStyle={styles.cardText}
                                checkedIcon='check-square-o'
                                uncheckedIcon='square-o'
                                checked={selectedBarDetails.isClosed}
                                onPress={() => this.props.suggestBarUpdate('isClosed', !selectedBarDetails.isClosed)}
                                />
                                <CheckBox
                                title={`No Longer a ${this.props.teams.selectedTeam.name} bar`}
                                titleStyle={styles.cardText}
                                checkedIcon='check-square-o'
                                uncheckedIcon='square-o'
                                checked={selectedBarDetails.removeTeam && selectedBarDetails.removeTeam !== null}
                                onPress={() => this.props.suggestBarUpdate('removeTeam', !selectedBarDetails.removeTeam ? this.props.teams.selectedTeam.teamId : null)}
                                />
                                {selectedBarDetails.addedTeams && selectedBarDetails.addedTeams.length > 0  ? selectedBarDetails.addedTeams.map(team => (
                                    <View key={team.teamId} style={styles.cardRow}>
                                        <Text style={styles.cardText}>{team.name}</Text>
                                    </View>)
                                ) : (<Button onPress={() => NavigationService.navigate('TeamSelect', { source: 'BarDetails'})}
                                title="Suggest a new team"
                                titleStyle={styles.buttonStyle}
                                />)}
                            </View>

                            <View style={[styles.cardRow, {width: '100%', justifyContent: 'space-evenly'}]}>
                                <Button onPress={() => {
                                    this.props.submitBarSuggestion(selectedBarDetails)
                                }}
                                title="Submit Update"
                                buttonStyle={{
                                    backgroundColor: colors.primary
                                }}
                                />
                                <Button onPress={() => {
                                    this.setState({isEditing: false})
                                    this.getBarDetails(selectedBarDetails.barId)
                                }}
                                    title="Cancel"
                                    buttonStyle={{
                                        backgroundColor: colors.secondary
                                    }} />

                            </View>
                            </Fragment>
                        ) : (
                            <Button
                                onPress={() => this.setState({isEditing: true})}
                                title="Suggest Edit" />
                        )}
                    </View>
                    <View>
                        <Text style={styles.sectionHeader}>Watch Parties</Text>
                    </View>
                    <View style={styles.sectionWrapper}>
                        {this.renderWatchParties()}
                        {this.renderUpcomingGames()}
                    </View>
                </ScrollView>
                )}
            </View>
        );
    }
}


const mapStateToProps = state => {
    return {
        auth: state.auth,
        teams: state.favoriteTeams,
        parties: state.parties,
        bars: state.bars
    }
}

const mapDispatchToProps = {
    addParty,
    removeParty,
    getBarDetails,
    updateBarDetails,
    suggestBarUpdate,
    submitBarSuggestion
}

export default connect(mapStateToProps, mapDispatchToProps)(BarDetails);
