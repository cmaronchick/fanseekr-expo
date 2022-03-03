import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import colors from '../../stylesheets/colors';

import { TouchableHighlight, View } from "react-native";

class MyMessagesTabBar extends Component {
    render() {
        var asterisk = this.props.messages.hasUnreadMsg ? <Text style={{ color: colors.primary, fontSize: 20, fontWeight: 'bold' }}>*</Text> : <Text></Text>;
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="comments" type='font-awesome' size={24} color={this.props.tintColor} />
                {asterisk}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        messages: state.messages
    }
}
export default connect(mapStateToProps, {})(MyMessagesTabBar);
