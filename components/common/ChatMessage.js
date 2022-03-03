import PropTypes from 'prop-types';
import React from 'react';
import {
    View,
    ViewPropTypes,
    StyleSheet,
} from 'react-native';

import { Avatar, Day, utils } from 'react-native-gifted-chat';
import Bubble from './ChatBubble';

import { connect } from 'react-redux'
import { colors } from 'react-native-elements';

const { isSameUser, isSameDay } = utils;

class Message extends React.Component {

    getInnerComponentProps() {
        const { containerStyle, ...props } = this.props;
        return {
            ...props,
            position: 'left',
            isSameUser,
            isSameDay,
        };
    }

    handleUserNameClick = () => {
        this.props.onUserClicked(this.props.currentMessage.user);
    }

    renderDay() {
        if (this.props.currentMessage.createdAt) {
            const dayProps = this.getInnerComponentProps();
            if (this.props.renderDay) {
                return this.props.renderDay(dayProps);
            }
            return <Day {...dayProps} />;
        }
        return null;
    }

    renderBubble() {
        const bubbleProps = this.getInnerComponentProps();
        // console.log(`bubbleProps`, bubbleProps)
        if (this.props.renderBubble) {
            return this.props.renderBubble(bubbleProps);
        }
        return <Bubble {...bubbleProps} onUserClicked={() => this.handleUserNameClick} />;
    }

    renderAvatar() {
        let extraStyle;
        if (
            isSameUser(this.props.currentMessage, this.props.previousMessage)
            && isSameDay(this.props.currentMessage, this.props.previousMessage)
        ) {
            // Set the invisible avatar height to 0, but keep the width, padding, etc.
            extraStyle = {
                height: 0
            };
        }

        const avatarProps = this.getInnerComponentProps();
        return (
            <Avatar
                {...avatarProps}
                imageStyle={{ left: [styles.slackAvatar, avatarProps.imageStyle, extraStyle] }}
            />
        );
    }

    render() {
        const marginBottom = isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10;
        const { authUser } = this.props
        const { uid } = authUser.userProfile
        
        return (
            <View key={this.props.currentMessage._id}>
                {this.renderDay()}
                <View
                    style={[
                        styles.container,
                        { marginBottom },
                        this.props.containerStyle,
                        uid === this.props.currentMessage.author ? { 
                            right: 0,
                            alignItems: 'center',
                            backgroundColor: colors.grey5
                        } : null
                    ]}
                >
                    {this.renderAvatar()}
                    {this.renderBubble()}
                </View>
            </View>
        );
    }

}

const mapStateToProps = (state) => ({
    authUser: state.auth
})

export default connect(mapStateToProps)(Message)

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 8,
        marginRight: 0,
        marginVertical: 3
    },
    slackAvatar: {
        // The bottom should roughly line up with the first line of message text.
        height: 40,
        width: 40,
        borderRadius: 3,
    },
});

Message.defaultProps = {
    renderAvatar: undefined,
    renderBubble: null,
    renderDay: null,
    onUserClicked: null,
    currentMessage: {},
    nextMessage: {},
    previousMessage: {},
    user: {},
    containerStyle: {},
};

Message.propTypes = {
    renderAvatar: PropTypes.func,
    renderBubble: PropTypes.func,
    renderDay: PropTypes.func,
    onUserClicked: PropTypes.func,
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    user: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
};
