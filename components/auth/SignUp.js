import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Image, Linking, Platform, Animated } from 'react-native';
import { connect } from 'react-redux';
import { emailChanged, usernameChanged, passwordChanged, signUp } from '../../actions/AuthActions';
import { Input, Button, Spinner } from '../common';
import styles from '../../stylesheets/loginStyles';

const animatedFontSize = new Animated.Value(14);
const animatedBottomPadding = new Animated.Value(0);
const animatedHeaderSize = new Animated.Value(14);
const animatedLogoSize = new Animated.Value(100);


class SignUpForm extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    //additions for animated form
    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            this._keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            this._keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = (e) => {
        Animated.parallel([
            Animated.spring(animatedBottomPadding, {
                duration: 100,
                toValue: e.endCoordinates.height,

            }),
            Animated.timing(animatedFontSize, {
                duration: 100,
                toValue: 10,
            }),
            Animated.timing(animatedHeaderSize, {
                duration: 100,
                toValue: 0
            }),
            Animated.timing(animatedLogoSize, {
                duration: 100,
                toValue: 0
            })
        ]).start();

    }

    _keyboardDidHide = (e) => {
        Animated.parallel([
            Animated.spring(animatedBottomPadding, {
                duration: 100,
                toValue: 0
            }),
            Animated.timing(animatedFontSize, {
                duration: 100,
                toValue: 16
            }),
            Animated.timing(animatedHeaderSize, {
                duration: 100,
                toValue: 22
            }),
            Animated.timing(animatedLogoSize, {
                duration: 100,
                toValue: 100
            })
        ]).start();
    }
    //end additions for animated form
    onEmailChange(text) {
        this.props.emailChanged(text);
    }

    onUsernameChange(text) {
        this.props.usernameChanged(text.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()); //Call Action Creator
    }

    onPasswordChange(text) {
        this.props.passwordChanged(text); //Call Action Creator
    }

    onButtonPress() {
        const { username, email, password } = this.props;
        this.props.signUp({ username, email, password });
    }

    renderError() {
        if (this.props.error) {
            return (
                <View>
                    <Text style={styles.errorTextStyle}>
                        {this.props.error}
                    </Text>
                </View>
            )
        }
    }

    renderButton() {
        if (this.props.loading) {
            return (<Spinner size="large" />)
        }

        return (
            <Button onPressHandler={this.onButtonPress.bind(this)}>
                Sign Up
            </Button>)
    }


    goToLogin() {
        this.props.navigation.goBack(null);
    }


    goToTerms() {
        Linking.openURL(`https://app.termly.io/document/terms-of-use-for-website/c2cee056-2add-4d1c-8a0e-b2b6a59e7b53`)

    }

    goToEULA() {
        Linking.openURL(`http://fanseekr.com/eula.html`)

    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <Animated.View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: animatedBottomPadding, paddingTop: 25 }}>
                    <Animated.Image
                        source={require('../../public/images/logos/180.png')}
                        style={{ alignSelf: 'center', width: animatedLogoSize, height: animatedLogoSize }} />
                    <Animated.Text style={{ ...styles.titleStyle, fontSize: animatedHeaderSize }}>Sign Up</Animated.Text>
                    <View style={styles.inputLabelWrapper}>
                        <Animated.Text style={{ ...styles.labelStyle, fontSize: animatedFontSize }}>Username</Animated.Text>
                    </View>
                    <View style={[styles.sectionContentStyle, styles.inputWrapperStyle]}>
                        <Input
                            placeholder="Username"
                            onChangeText={this.onUsernameChange.bind(this)}
                            value={this.props.username}
                            maxLength={20}
                        />
                    </View>
                    <View style={styles.inputLabelWrapper}>
                        <Animated.Text style={{ ...styles.labelStyle, fontSize: animatedFontSize }}>Email</Animated.Text>
                    </View>
                    <View style={[styles.sectionContentStyle, styles.inputWrapperStyle]}>
                        <Input
                            placeholder="User@gmail.com"
                            onChangeText={this.onEmailChange.bind(this)}
                            value={this.props.email}
                        />
                    </View>
                    <View style={styles.inputLabelWrapper}>
                        <Animated.Text style={{ ...styles.labelStyle, fontSize: animatedFontSize }}>Password</Animated.Text>
                    </View>
                    <View style={[styles.sectionContentStyle, styles.inputWrapperStyle]}>
                        <Input
                            secureTextEntry
                            placeholder="Password"
                            onChangeText={this.onPasswordChange.bind(this)}
                            value={this.props.password}
                        />
                    </View>
                    <View style={[styles.sectionWrapper, styles.termsWrapper]}>
                        <View style={[styles.sectionContentStyle, styles.sectionTermsStyle]}>
                            <Text>By signing up, you agree to our </Text>
                            <Text style={styles.linkStyle} onPress={this.goToTerms.bind(this)}>
                                Terms of Use & Privacy Policy
                            </Text>
                        </View>
                    </View>
                    <View style={{ ...styles.sectionWrapper, flexDirection: 'row', marginLeft: 0, marginRight: 0 }}>
                        <View style={{ ...styles.sectionContentStyle, flex: 1 }}>
                            {this.renderButton()}
                        </View>
                    </View>

                    <View style={[styles.sectionWrapper, styles.errorWrapper]}>
                        <View style={styles.sectionContentStyle}>
                            {this.renderError()}
                        </View>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 25 }}>
                        <View style={styles.sectionContentStyle}>
                            <Text onPress={this.goToLogin.bind(this)}>
                                Already a member? Log In.
                        </Text>
                        </View>
                    </View>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}

const mapStateToProps = state => {
    return {
        //properties below are from AuthReducer is now avaiable in component above.  state.auth is reducer from combinedReducer
        email: state.auth.email,
        username: state.auth.username,
        password: state.auth.password,
        error: state.auth.error,
        loading: state.auth.loading
    }
}

export default connect(mapStateToProps, { emailChanged, usernameChanged, passwordChanged, signUp })(SignUpForm);
