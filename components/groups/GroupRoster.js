import React, { Fragment } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'react-native'
import { Text, Image, Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import styles from '../../stylesheets/rosterStyles'


import RenderRoster from '../common/RenderRoster'
import GroupHeader from './GroupHeader'

const GroupRoster = ({auth, groups, navigation}) => {
    const { selectedGroup } = groups
    const { owner, members } = selectedGroup

    const goToUserProfile = (_user) => {
        navigation.navigate('ProfileRoster', {
            user: _user,
            teamId: _user.team,
            goBack: 'GroupRoster'
        });
    }
    return (
        <Fragment>
            <GroupHeader selectedGroup={selectedGroup} />
            <View style={{paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                <View style={ownerStyles.row}>
                    <Text>Owner:</Text>
                    <View style={ownerStyles.details}>
                        {owner.avatar && (
                            <Avatar 
                                containerStyle={ownerStyles.avatar}
                                rounded
                                source={{uri: owner.avatar}}
                                size='small'
                            />
                        )}
                        <Text>{owner.username}</Text>
                    </View>
                </View>
                {members && members.length > 0 ? (
                    <RenderRoster user={auth} roster={members} styles={styles} goToUserProfile={goToUserProfile} />
                ) : (<Text>There are no members of this group yet.</Text>)}
            </View>
        </Fragment>
    )
}

const mapStateToProps = (state) => ({
    groups: state.groups,
    auth: state.auth
})

const ownerStyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: 10
    },
    avatar: {
        marginRight: 5,
    }
})

export default connect(mapStateToProps)(GroupRoster)