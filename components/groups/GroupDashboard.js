import React, { Component } from 'react'
import { ScrollView, View, ActivityIndicator, Image } from 'react-native'
import { Text, Button, Icon } from 'react-native-elements'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import moment from 'moment'

import globalStyles from '../../stylesheets/globalStyles'
import groupStyles from '../../stylesheets/groupStyles'
import homeStyles from '../../stylesheets/homeStyles'
import colors from '../../stylesheets/colors'
import { Fragment } from 'react'

import firestore from '@react-native-firebase/firestore'
import { updateGroupLocation, joinGroup, leaveGroup, attendWatchParty } from '../../actions/GroupsActions'
import { getGeoCodeResponse } from '../../helpers/utils'

import ActionButton from '../common/ActionButton'

import GroupHeader from './GroupHeader'
import GroupRoster from './GroupRoster'
import rosterStyles from '../../stylesheets/rosterStyles'

import { subscribeToChannel, setLastVisited, setSelectedChatroom } from '../../actions/ChatActions'

const GroupRow = ({label, text, style}) => (
    <View style={groupStyles.groupRow}>
        <Text style={[globalStyles.headerTitleLightStyle, groupStyles.groupText]}>{label}</Text>
        <Text style={[globalStyles.teamHeaderTitleStyle, groupStyles.groupText]}>{text}</Text>
    </View>
)

export class GroupDashboard extends Component {
    static propTypes = {
        groups: PropTypes.object.isRequired
    }



    updateGroupLocation = async () => {
        const { selectedGroup } = this.props.groups
        try {
            let geoCodeResponse = await getGeoCodeResponse(selectedGroup.location)
            console.log(`geoCodeResponse`, geoCodeResponse)
            if (geoCodeResponse.error_message) {
                this.setState({
                    error: {
                        message:  geoCodeResponse.error_message
                    }
                })
            } else {
                const coordinate = geoCodeResponse.results[0].geometry.location
                let coordinates = new firestore.GeoPoint(coordinate.lat, coordinate.lng)
                this.setState({
                    coordinates,
                    error: null,
                    loadingCoordinates: false
                })
                selectedGroup.coordinates = coordinates
                this.props.updateGroupLocation(selectedGroup)
            }

        } catch (getCoordinatesError) {
            console.log(`getCoordinatesError`, getCoordinatesError)
            this.setState({
                error: {
                    message:  getCoordinatesError
                }
            })

        }
    }

    render() {
        const { groups, favoriteTeams, auth, chatrooms } = this.props
        const {selectedGroup, loadingSelectedGroup} = groups
        const { groupId, name, description, location, barDetails, teams, bannerUrl, members } = selectedGroup
        console.log(`selectedGroupId`, groupId)
        const chatroom = chatrooms[groupId]
        
        groupStyles.badgeStyle = { position: 'absolute', top: -5, right: -10 }
        return (
            <ScrollView contentContainerStyle={groupStyles.mainContainer}>
                {loadingSelectedGroup ? (
                    <ActivityIndicator />
                ) : (
                    <Fragment>
                        <GroupHeader selectedGroup={selectedGroup} />
                        <View style={[globalStyles.teamHeaderStyle, groupStyles.groupRow]}>
                            <Text style={groupStyles.groupText}>{description}</Text>
                        </View>
                        {favoriteTeams.teamGames.length > 0 && (
                            <View style={[globalStyles.teamHeaderStyle, groupStyles.groupRow, { flexDirection: 'row', backgroundColor: colors.darkTxt, paddingHorizontal: 15, paddingVertical: 10}]}>
                                <View style={{flex: 1, flexDirection: 'column'}}>
                                    <Text style={[globalStyles.teamHeaderTitleStyle, { color: colors.lightTxt, fontSize: 24}]}>Watch Party</Text>
                                    <Text style={{ color: colors.lightTxt}}>{favoriteTeams.teamGames[0].awayTeam.shortName} @ {favoriteTeams.teamGames[0].homeTeam.shortName}</Text>
                                    <Text style={{ color: colors.lightTxt}}>{moment(favoriteTeams.teamGames[0].startDateTime).format('MMM D yyyy h:mm a')}</Text>
                                </View>
                                <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row'}}>
                                    <Button containerStyle={{flex: 1}} titleStyle={{flex: 1}} onPress={() => this.props.attendWatchParty(selectedGroup, favoriteTeams.teamGames[0], auth.userProfile.uid)}
                                    title="I'm going!"
                                    disabled={selectedGroup.watchParties && selectedGroup.watchParties[favoriteTeams.teamGames[0].gameId]?.attendees?.indexOf(auth.userProfile.uid) > -1}
                                    raised />
                                    {selectedGroup.watchParties && selectedGroup.watchParties[favoriteTeams.teamGames[0].gameId].attendees.length > 0 && (
                                        <View style={{flexDirection: 'row', flex: 1}}>
                                        <Icon 
                                        text={selectedGroup.name}
                                        type="material"
                                        name="group" 
                                        size={24}
                                        color={colors.lightTxt}
                                        containerStyle={{width: 50, height: 50}}
                                        
                                        /><Text style={{color: '#fff'}}>{selectedGroup.watchParties[favoriteTeams.teamGames[0].gameId]?.attendees?.length}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        )}
                    <GroupRow style={[groupStyles.groupRow, globalStyles.teamHeaderStyle]} label='Location:' text={location} />
                    {barDetails && barDetails.name && (
                        <GroupRow label='Favorite Bar:' text={barDetails.name} />
                    )}
                    {teams && teams[0] && (
                        <GroupRow label='Favorite Team:' text={teams[0].name} />
                    )}
                    <ActionButton
                    iconName="group"
                    iconType="font-awesome"
                    text="Group Roster"
                    onPress={() => this.props.navigation.navigate('GroupRoster', { selectedGroup })}
                    styles={groupStyles}
                        />
                    <ActionButton
                    iconName="calendar"
                    iconType="font-awesome"
                    text="Group Schedule"
                    onPress={() => this.props.navigation.navigate('GroupSchedule', { selectedGroup })}
                    styles={groupStyles}
                        />

                    <ActionButton
                    text="Group Chat"
                    iconName="comment"
                    iconType="material"
                    badge={chatroom?.newMessages}
                    onPress={() => {
                        console.log(`auth`, auth, chatroom)
                        this.props.setLastVisited(auth.userProfile.uid, selectedGroup.groupId)
                        this.props.setSelectedChatroom(this.props.chatrooms[selectedGroup.groupId])
                        return this.props.navigation.navigate("GroupChat")
                    }}
                    styles={groupStyles} />
                    </Fragment>
                )}
                {selectedGroup.owner?.uid === auth.userProfile.uid ? (
                    <View>
                        <Button
                            title="Edit Group Details"
                            onPress={() => this.props.leaveGroup()}
                            disabled
                            />
                    </View>
                ) : selectedGroup.memberOf ? (
                    <Button
                    title="Leave Group"
                    onPress={() => this.props.leaveGroup(selectedGroup.groupId)}
                    />
                ) : (
                    <Button
                    title="Join Group"
                    onPress={() => this.props.joinGroup(selectedGroup.groupId)}
                    />
                )}
            </ScrollView>
        )
    }
}

const mapStateToProps = (state) => ({
    groups: state.groups,
    auth: state.auth,
    favoriteTeams: state.favoriteTeams,
    chatrooms: state.chat.chatrooms
})

const mapDispatchToProps = {
    updateGroupLocation,
    joinGroup,
    leaveGroup,
    attendWatchParty,
    subscribeToChannel,
    setLastVisited,
    setSelectedChatroom
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupDashboard)
