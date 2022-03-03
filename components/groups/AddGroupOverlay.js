import React, { Component } from 'react'
import { ActivityIndicator, View, Image } from 'react-native'
import { Overlay, Text, Input, Button, Icon } from 'react-native-elements'
import LinearGradient from 'react-native-linear-gradient';

import { connect } from 'react-redux'

import { getGeoCodeResponse } from '../../helpers/utils'

import homeStyles from '../../stylesheets/homeStyles';
import styles from '../../stylesheets/groupStyles'
import colors from '../../stylesheets/colors';
import teamImages from '../../constants/images/teamImages'
import teamSelectStyles from '../../stylesheets/teamSelectStyles'

import firestore from '@react-native-firebase/firestore'

import { addNewGroup, addNewGroupDetails, toggleAddGroupOverlay } from '../../actions/GroupsActions'

import NavigationService from '../../NavigationService';
import { GeoCollectionReference, GeoFirestore, } from 'geofirestore';


class AddGroupOverlay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loadingCoordinates: false,
            barVerified: false
        }
    }

    handleGetCoordinates = async () => {
        const { newGroup } = this.props.groups
        this.setState({
            loadingCoordinates: true
        })
        if (!newGroup.location) {
            this.setState({
                error: {
                    message: 'Please enter a city and state.'
                }
            })
            return;
        }
        try {
            let geoCodeResponse = await getGeoCodeResponse(newGroup.location)
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
                this.props.addNewGroupDetails('coordinates', coordinates)
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
    verifyFavoriteBar = async () => {
        try {
            const {favoriteBar} = this.props.groups.newGroup
            let bar = await firestore().collection('bars2')
                .where('name','==',favoriteBar.name)
                .get()
            if (bar.exists) {
                this.setState({
                    barVerified: true
                })
            } else {
                this.setState({
                    error: {
                        message: 'A bar by that name does not exist'
                    }
                })
            }
        } catch (getBarError) {
            console.log(`getBarError`, getBarError)
        }
    }

    updateGroupInformation = (key, text) => {
        this.props.addNewGroupDetails(key, text)
    }

    renderTeamButton(item) {
        // const imageSrc = require('../../constants/images/teams/nflwas.png')
        // console.log('styles.logo :>> ', teamImage);
        // teamImages[item.teamId]
        return (
                <View key={item.teamId} style={teamSelectStyles.logoWrapper}>
                    <Image
                        style={[teamSelectStyles.logo, { resizeMode: 'contain', width: '100%', height: '100%'}]}
                        source={teamImages[item.teamId]} resizeMode="contain" />
                    <Text style={teamSelectStyles.teamName}>{item.name}</Text>
                </View>
        );
    }

    render() {
        // console.log(`this.props.groups`, this.props.groups)
        const { newGroup } = this.props.groups
        return (
            <Overlay
                animationType="slide"
                isVisible={this.props.addGroupOverlayVisible}
                onBackdropPress={() => this.props.toggleAddGroupOverlay()}>
                {newGroup ? (
                <View style={homeStyles.modal}>
                    <View style={[homeStyles.guideModalWrapper, {height: 'auto'}]}>
                        <View style={[homeStyles.guideRow, { backgroundColor: colors.purple, justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={[homeStyles.modalTitle, {color: '#fff', marginTop: 5, marginBottom: 5}]}>CREATE YOUR GROUP</Text>
                        </View>
                        <View style={styles.sectionStyle}>
                            <Input
                                label="GROUP NAME"
                                labelStyle={styles.inputStyle}
                                inputStyle={styles.inputStyle}
                                onChangeText={(text) => {
                                    this.updateGroupInformation('name', text);
                                }}
                                value={newGroup.name}
                                placeholder="Your Group's Name"
                                maxLength={30}
                            />
                        </View>

                        <View style={styles.sectionStyle}>
                            <Input
                                label="DESCRIPTION"
                                labelStyle={styles.inputStyle}
                                inputStyle={styles.inputStyle}
                                onChangeText={(text) => {
                                    this.updateGroupInformation('description', text);
                                }}
                                placeholder="A brief description of your group"
                                value={newGroup.description}
                                maxLength={80}
                            />
                        </View>
                        <View style={styles.sectionStyle}>
                            <Input 
                                label="LOCATION"
                                labelStyle={styles.inputStyle}
                                inputStyle={styles.inputStyle}
                                onChangeText={(text) => this.updateGroupInformation('location',text)}
                                placeholder="Enter City and State"
                                value={newGroup.location}
                                rightIcon={
                                    this.state.loadingCoordinates ? (
                                        <ActivityIndicator />
                                    ) : (<Icon
                                        name="search"
                                        type="font-awesome"
                                        onPress={() => this.handleGetCoordinates()}
                                        />)
                                }
                            />
                            {newGroup.coordinates && (<Text>Coordinates found!</Text>)}
                        </View>
                        {newGroup.teams.length > 0 ? (
                            newGroup.teams.map(team => {
                                return (
                                    this.renderTeamButton(team)
                                )
                            })
                        ) : (
                        <View style={styles.sectionStyle}>
                            <Button 
                            onPress={() => NavigationService.navigate('TeamSelect',{
                                source: 'MyGroups'
                            })}
                            title="Select Group Teams"
                            />
                        </View>
                        )}
                        <View style={styles.sectionStyle}>
                            <Button 
                            onPress={() => NavigationService.navigate('BarFinder',{
                                source: 'MyGroups',
                                onBarSelect: this.props.addNewGroupDetails
                            })}
                            title="Select Favorite Bar"
                            />
                            {newGroup.favoriteBar ? (<Text>Bar verified! ID: {newGroup.favoriteBar}</Text>) : (<Text />)}
                        </View>
                        

                        <View style={[styles.buttonWrapper, { marginTop: 10}]}>
                            <Button
                                onPress={() => this.props.addNewGroup(newGroup)}
                                title="Save"
                                ViewComponent={LinearGradient}
                                disabled={!(newGroup.name && newGroup.description && newGroup.location && newGroup.teams.length > 0)}
                                disabledStyle={{opacity: 0.5}}
                                linearGradientProps={{
                                    colors: [colors.primary, colors.primaryDarker],
                                    angle: 45,
                                    useAngle: true
                                }}
                                loading={this.props.groups.addingGroup}
                                titleStyle={styles.buttonText} />
                            {this.state.error && (<Text style={colors.red}>{this.state.error.message}</Text>)}
                        </View>
                    </View>
                </View>
                ) : (
                    <View />
                )}
                        
            </Overlay>
        )
    }
}

const mapStateToProps = (state) => ({
    groups: state.groups
})

const mapDispatchToProps = {
    addNewGroup,
    addNewGroupDetails,
    toggleAddGroupOverlay
}

export default connect(mapStateToProps, mapDispatchToProps)(AddGroupOverlay)