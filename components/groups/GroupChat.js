import React, { Component } from 'react'
import { View, Text } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Chat from '../common/Chat'

export class GroupChat extends Component {
    static propTypes = {
        groups: PropTypes.object.isRequired
    }
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.navigation.setParams({ goBack: this.goBack });
        
        this.props.navigation.setParams({
            chatTitle1: this.props.groups.selectedGroup.name
        })

    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Chat roomType="group" roomName={this.props.groups.selectedGroup.groupId} navigation={this.props.navigation} />
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    groups: state.groups
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(GroupChat)
