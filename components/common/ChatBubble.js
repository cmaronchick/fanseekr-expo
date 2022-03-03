import PropTypes from 'prop-types';
import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    ViewPropTypes,
    Platform
} from 'react-native';
import { Icon } from 'react-native-elements';
import { MessageText, MessageImage, Time, utils, } from 'react-native-gifted-chat';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../../stylesheets/colors';

import { connect } from 'react-redux';

const { isSameUser, isSameDay } = utils;

class Bubble extends React.Component {
    constructor(props) {
        super(props);
    }

    renderMessageText() {
        if (this.props.currentMessage.text) {
            const { containerStyle, wrapperStyle, messageTextStyle, ...messageTextProps } = this.props;

            if (this.props.renderMessageText) {
                return this.props.renderMessageText(messageTextProps);
            }
            // console.log(`messageTextProps`, messageTextProps)
            return (
                <MessageText
                    {...messageTextProps}
                    textStyle={{
                        left: styles.slackMessageText
                    }}
                />
            );
        }
        return (<View><Text>No message text</Text></View>);
    }
    renderMessageImage() {
        if (this.props.currentMessage.image) {
            const { containerStyle, wrapperStyle, messageTextStyle, ...messageImageProps } = this.props;
            // if (this.props.renderMessageText) {
            //     return this.props.renderMessageText(messageTextProps);
            // }
            return (
                <MessageImage
                    {...messageImageProps}
                    textStyle={{
                        left: styles.slackMessageText
                    }}
                    imageStyle={{...styles.slackImage, height: 100, width: 100}}
                />
            );
        }
        return null;

    }

    renderUsername() {
        const username = this.props.currentMessage.user.name;
        if (username) {
            const { containerStyle, wrapperStyle, onUserClicked, ...usernameProps } = this.props;
            if (this.props.renderUsername) {
                return this.props.renderUsername(usernameProps);
            }
            return (
                <TouchableOpacity onPress={this.props.onUserClicked()}>
                    <Text style={[styles.standardFont, styles.headerItem, styles.username, this.props.usernameStyle]}>
                        {username}
                    </Text>
                </TouchableOpacity>
            );
        }
        return null;
    }

    renderTime() {
        if (this.props.currentMessage.createdAt) {
            const { containerStyle, wrapperStyle, ...timeProps } = this.props;
            if (this.props.renderTime) {
                return this.props.renderTime(timeProps);
            }
            return (
                <Time
                    {...timeProps}
                    containerStyle={{ left: [styles.timeContainer] }}
                    textStyle={{ left: [styles.standardFont, styles.headerItem, styles.time, timeProps.textStyle] }}
                />
            );
        }
        return null;
    }


    renderAdminDelete() {
        if (this.props.isModerator) {
            return (
                <View style={styles.messageIcons}>
                    <TouchableOpacity style={{ marginLeft: 5 }}
                        onPress={() => this.props.onDeleteClicked(this.props.currentMessage)} >
                        <Icon
                            size={14}
                            name='trash'
                            type='font-awesome'
                            color={colors.gray}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginLeft: 5 }}
                        onPress={() => this.props.onPinClicked(this.props.currentMessage)} >
                        <Icon
                            size={14}
                            name='push-pin'
                            type='material'
                            color={colors.gray}
                        />
                    </TouchableOpacity>
                </View>
            );
        }
    }

    renderCustomView() {
        if (this.props.renderCustomView) {
            return this.props.renderCustomView(this.props);
        }
        return null;
    }

    render() {
        const isSameThread = isSameUser(this.props.currentMessage, this.props.previousMessage)
            && isSameDay(this.props.currentMessage, this.props.previousMessage);

        const messageHeader = isSameThread ? null : (
            <View style={styles.headerView}>
                {this.renderUsername()}
                {this.renderTime()}
                {this.renderAdminDelete()}
            </View>
        );
        // console.log(`this.props.currentMessage`, this.props.currentMessage)
        return (
            <View style={[styles.container, this.props.containerStyle]}>
                <View
                    style={[
                        styles.wrapper,
                        this.props.wrapperStyle
                    ]}
                >
                    <View>
                        {this.renderCustomView()}
                        {messageHeader}
                        {this.props.currentMessage.text && this.renderMessageText()}

                        {this.props.currentMessage.image && this.renderMessageImage()}
                    </View>
                </View>
            </View>
        );
    }

}

const mapStateToProps = (state) => ({
    authUser: state.auth
})

export default connect(mapStateToProps)(Bubble)

// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
    slackMessageText: {
        marginLeft: 0,
        marginRight: 0, fontSize: 14,
        color: colors.darkTxt

    },
    container: {
        flex: 1,
        alignItems: 'flex-start',
    },
    wrapper: {
        marginRight: 60,
        minHeight: 20,
        justifyContent: 'flex-end',
    },
    username: {
        fontWeight: 'bold'
    },
    time: {
        textAlign: 'left',
        fontSize: 14,
    },
    timeContainer: {
        marginLeft: 0,
        marginRight: 0,
        marginBottom: 0,
    },
    headerItem: {
        marginRight: 10,
        marginTop: 5
    },
    headerView: {
        // Try to align it better with the avatar on Android.
        marginTop: Platform.OS === 'android' ? -2 : 0,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    slackImage: {
        borderRadius: 3,
        marginLeft: 0,
        marginRight: 0,
    },
});

Bubble.contextTypes = {
    actionSheet: PropTypes.func,
};

Bubble.defaultProps = {
    touchableProps: {},
    onLongPress: null,
    onUserClicked: null,
    renderMessageImage: null,
    renderMessageText: null,
    renderCustomView: null,
    renderTime: null,
    currentMessage: {
        text: null,
        createdAt: null,
        image: null,
    },
    nextMessage: {},
    previousMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    tickStyle: {},
    containerToNextStyle: {},
    containerToPreviousStyle: {},
};

Bubble.propTypes = {
    touchableProps: PropTypes.object,
    onLongPress: PropTypes.func,
    onUserClicked: PropTypes.func,
    renderMessageImage: PropTypes.func,
    renderMessageText: PropTypes.func,
    renderCustomView: PropTypes.func,
    renderUsername: PropTypes.func,
    renderTime: PropTypes.func,
    renderTicks: PropTypes.func,
    currentMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    user: PropTypes.object,
    containerStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    wrapperStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    messageTextStyle: Text.propTypes.style,
    usernameStyle: Text.propTypes.style,
    tickStyle: Text.propTypes.style,
    containerToNextStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
    containerToPreviousStyle: PropTypes.shape({
        left: ViewPropTypes.style,
        right: ViewPropTypes.style,
    }),
};