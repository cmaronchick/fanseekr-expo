import React, { Component } from 'react'
import { View } from 'react-native'
import { Text } from 'react-native-elements'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import GroupHeader from './GroupHeader'
import { Fragment } from 'react'

import styles from '../../stylesheets/globalStyles'
import colors from '../../stylesheets/colors'
import globalStyles from '../../stylesheets/globalStyles'
import moment from 'moment'

export class GroupSchedule extends Component {
    static propTypes = {
        auth: PropTypes.object.isRequired,
        groups: PropTypes.object.isRequired
    }

    render() {
        const { favoriteTeams } = this.props
        const { selectedGroup } = this.props.groups
        console.log(`favoriteTeams`, favoriteTeams)
        return (
            <Fragment>
                <GroupHeader
                    selectedGroup={selectedGroup}
                    />
                    <View style={{borderBottomColor: colors.darkTxt, borderBottomWidth: 2, flexDirection: 'row', justifyContent: 'center', marginBottom: 5, marginHorizontal: 5}}>
                        <Text style={[globalStyles.headerTitleStyle, { color: colors.darkTxt}]} h3>Upcoming Games</Text>
                    </View>
                {favoriteTeams.teamGames?.length > 0 ? favoriteTeams.teamGames.map(game => (
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        padding: 8,
                        borderRadius: 5,
                        backgroundColor: '#fff',
                        shadowColor: colors.darkBg,
                        shadowOffset: { width: .5, height: 1 },
                        shadowOpacity: 0.25,
                        shadowRadius: 2,
                        elevation: 5
                    }}>
                        {/* <Text style={[globalStyles.teamHeaderTitleStyle, { color: colors.darkTxt, fontSize: 24}]}>Watch Party</Text> */}
                        <Text style={{ color: colors.darkTxt}}>{favoriteTeams.teamGames[0].awayTeam.shortName} @ {favoriteTeams.teamGames[0].homeTeam.shortName}</Text>
                        <Text style={{ color: colors.darkTxt}}>{moment(favoriteTeams.teamGames[0].startDateTime).format('MMM D yyyy h:mm a')}</Text>
                    </View>
                )) : (
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'center'
                    }}>
                        <Text>There are no upcoming games.</Text>
                    </View>
                )}
                
            </Fragment>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    groups: state.groups,
    favoriteTeams: state.favoriteTeams
})


export default connect(mapStateToProps)(GroupSchedule)
