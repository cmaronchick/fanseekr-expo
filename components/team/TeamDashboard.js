import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, TouchableOpacity, Text, Image } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import teamImages from '../../public/images/teamImages';
import ActionButton from '../../components/common/ActionButton'

import firebase from '@react-native-firebase/app';

import globalStyles from '../../stylesheets/globalStyles';
import styles from '../../stylesheets/teamDashboardStyles';
import colors from '../../stylesheets/colors';

import { setLastVisited, setSelectedChatroom } from '../../actions/ChatActions'


class TeamDashboard extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: "Team Dashboard",
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

    componentDidMount() {
        this.props.navigation.setParams({ goBack: this.goBack });

    }

    goBack = () => {
        this.props.navigation.navigate('Home');
    }

    // renderSchedule = () => {
    //     if (this.props.teams.selectedTeam.schedule) {
    //         return (
    //             this.props.teams.selectedTeam.schedule.map((game, index) => (
    //                 <View style={styles.gameBox} key={index}>
    //                     <View style={{ flexDirection: 'row' }}>
    //                         <Icon
    //                             containerStyle={styles.gameBoxIcon}
    //                             size={10}
    //                             name='calendar'
    //                             type='font-awesome'
    //                             color={colors.primary} />
    //                         <Text style={styles.gameBoxText}>
    //                             {game.date}
    //                         </Text>
    //                     </View>
    //                     {/* <View style={{ flexDirection: 'row' }}>
    //                         <Icon
    //                             containerStyle={styles.gameBoxIcon}
    //                             size={10}
    //                             name='clock-o'
    //                             type='font-awesome'
    //                             color={colors.primary} />
    //                         <Text style={styles.gameBoxText}>
    //                             {game.time}
    //                         </Text>
    //                     </View> */}

    //                     <Text style={[styles.gameBoxText, { marginTop: 5 }]}>{game.isAway ? "vs." : "@"} {game.opponent}</Text>
    //                 </View>
    //             )))
    //     }
    // }

    render() {
        const { chatrooms } = this.props
        const roomName = `${this.props.location.currentLocation}_${this.props.teams.selectedTeam.teamId}`
        console.log(`chatrooms, roomName`, chatrooms, roomName, chatrooms[roomName])
        styles.badgeStyle = { position: 'absolute', top: 5, right: -10 }
        return (
            <View style={styles.mainContainer}>
                <View style={[styles.avatarSection]}>
                    <View style={styles.logoWrapper}>
                        <Image style={styles.logo} source={teamImages[this.props.teams.selectedTeam.teamId]} resizeMode="contain" />
                    </View>
                </View>

                <View style={styles.nameSection}>
                    <Text style={styles.name}>{this.props.teams.selectedTeam.name}</Text>
                </View>

                {/* {this.props.teams.selectedTeam.schedule && this.props.teams.selectedTeam.schedule.length > 0 ?
                    <View style={styles.scheduleSection}>
                        <Text style={styles.scheduleTitle}>Upcoming Games:</Text>
                        <View style={styles.gameWrapper}>
                            {this.renderSchedule()}
                        </View>
                    </View> : <View></View>} */}

                <View style={styles.teamNavigation}>
                    <ActionButton text="Find Local Fans" iconName="search" iconType="font-awesome" onPress={() => this.props.navigation.navigate('FanFinder')} styles={styles} />
                    <ActionButton text="Find Local Bars" iconName="ios-beer" iconType="ionicon" onPress={() => this.props.navigation.navigate("BarFinder")} styles={styles} />
                    <ActionButton text="Local Chat" badge={chatrooms[roomName] ? chatrooms[roomName].newMessages : null} iconName="comment" iconType="material" onPress={() => {
                        this.props.setLastVisited(this.props.auth.userProfile.uid, `${this.props.location.currentLocation}_${this.props.teams.selectedTeam.teamId}`)
                        this.props.setSelectedChatroom(chatrooms[roomName])
                        this.props.navigation.navigate("TeamChat", { uid: this.props.auth.userProfile.uid, roomName: `${this.props.location.currentLocation}_${this.props.teams.selectedTeam.teamId}` })
                    }} styles={styles} />
                    

                </View>
            </View >
        );
    }
}


const mapStateToProps = state => {
    return {
        auth: state.auth,
        teams: state.favoriteTeams,
        chatrooms: state.chat.chatrooms,
        location: state.location
    }
}

const mapDispatchToProps = {
    setLastVisited,
    setSelectedChatroom
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamDashboard);
