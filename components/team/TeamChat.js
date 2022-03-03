import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Chat from '../common/Chat'

export class TeamChat extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        favoriteTeams: PropTypes.object.isRequired
    }

    componentDidMount() {
        this.props.navigation.setParams({ goBack: this.goBack });
        var that = this;

        this.props.navigation.setParams({
            chatTitle1: this.props.favoriteTeams.selectedTeam.name + ' fans',
            chatTitle2: 'in ' + this.props.location.currentLocationName
        })
    }

    render() {
        return (
            <View style={{ flex: 1, paddingHorizontal: 10}}>
                <Chat navigation={this.props.navigation} roomName={this.props.location.currentLocation + '_' + this.props.favoriteTeams.selectedTeam.teamId} />
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    location: state.location,
    favoriteTeams: state.favoriteTeams
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamChat)
