import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { View,
    TouchableWithoutFeedback,
    TouchableOpacity,
    FlatList,
    Image,
    TextInput,
    Modal } from 'react-native';

import { Avatar,
    Icon,
    Text,
    Button,
    Overlay,
    Input } from 'react-native-elements';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import messaging from '@react-native-firebase/messaging'
import auth from '@react-native-firebase/auth'

import teamImages from '../../public/images/teamImages';
import globalStyles from '../../stylesheets/globalStyles';
import styles from '../../stylesheets/groupStyles'
import teamDashboardStyles from '../../stylesheets/teamDashboardStyles'
import colors from '../../stylesheets/colors';

import { addNewGroup, toggleAddGroupOverlay, fetchGroup } from '../../actions/GroupsActions'
import AddGroupOverlay from './AddGroupOverlay';
import NavigationService from '../../NavigationService'

import ActionButton from '../../components/common/ActionButton'

export class MyGroups extends Component {
    constructor(props) {
        super(props)
    }
    
    static propTypes = {
        groups: PropTypes.object.isRequired,
        auth: PropTypes.object.isRequired
    }

    navigateToGroup = (groupId) => {
        this.props.fetchGroup(groupId)
        NavigationService.navigate('GroupDashboard', { groupId: groupId })
    }
    

    render() {
        const { auth, groups } = this.props
        const { userProfile } = auth
        const { myGroups } = groups
        // console.log(`userProfile`, userProfile)
        return (
            <View style={styles.mainContainer}>
                {myGroups && myGroups.length > 0 && (
                    <View style={[globalStyles.pageTitleStyle, globalStyles.headerExtendedTitle]}>
                        <Text h3 style={{textAlign: 'center'}}>My Groups</Text>
                            {myGroups.map(group => {
                                return (
                                <View key={group.groupId}>
                                    <ActionButton 
                                        text={group.name}
                                        iconType="material"
                                        iconName="group"
                                        styles={{...styles, ...teamDashboardStyles}}
                                        onPress={() => this.navigateToGroup(group.groupId)}
                                        />

                                </View>

                                )}
                            )}
                    </View>
                )}
                {Object.keys(groups.groups).length > 0 && (
                    <View style={[globalStyles.pageTitleStyle, globalStyles.headerExtendedTitle]}>
                        <Text h2 style={{textAlign: 'center'}}>Local Groups</Text>
                        {Object.keys(groups.groups).map(groupKey => {
                            const group = groups.groups[groupKey]
                            return !group.memberOf && (
                                <View key={group.groupId}>
                                    <ActionButton 
                                        text={group.name}
                                        iconType="material"
                                        iconName="group"
                                        styles={{...styles, ...teamDashboardStyles}}
                                        onPress={() => this.navigateToGroup(group.groupId)}
                                        />

                                </View>
                            )

                        })}
                    </View>
                )}
                <View>  
                    <Text style={globalStyles.headerExtendedTitle} h1>ADMIN ONLY</Text>
                    <Button onPress={() => this.props.toggleAddGroupOverlay()}
                    title="Create a Group" />
                </View>

                <AddGroupOverlay addGroupOverlayVisible={this.props.groups.addGroupOverlayVisible}/>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    groups: state.groups,
    location: state.location,
    auth: state.auth
})

const mapDispatchToProps = {
    addNewGroup,
    toggleAddGroupOverlay,
    fetchGroup
}

export default connect(mapStateToProps, mapDispatchToProps)(MyGroups)
