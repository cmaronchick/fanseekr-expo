import React, { Component } from 'react';
import { View, Text, KeyboardAvoidingView, Keyboard, Image, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { emailChanged, resetPassword } from '../../actions/AuthActions';
import { Input, Button, Spinner } from '../common';
import styles from '../../stylesheets/loginStyles';
import colors from '../../stylesheets/colors';

class ResetPassword extends Component {
    onEmailChange(text) {
        this.props.emailChanged(text);
    }

    onButtonPress() {
        const { email } = this.props;
        this.props.resetPassword({ email });
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
                Submit
            </Button>)
    }


    goToLogin() {
        this.props.navigation.goBack(null);
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <KeyboardAvoidingView style={styles.mainContainer} behavior="height" enabled>
                    <View style={styles.logoWrapper}>
                        <Image
                            source={require('../../public/images/logos/180.png')}
                            style={{ alignSelf: 'center', width: 130, height: 130 }} />
                    </View>
                    <View>
                        <Text style={[styles.titleStyle, { fontSize: 22 }]}>Reset Password</Text>
                    </View>

                    <View style={styles.sectionWrapper}>
                        <View>
                            <Text style={styles.labelStyle}>Email</Text>
                        </View>
                        <View style={[styles.sectionContentStyle, styles.inputWrapperStyle]}>
                            <Input
                                placeholder="User@gmail.com"
                                onChangeText={this.onEmailChange.bind(this)}
                                value={this.props.email}
                            />
                        </View>
                    </View>

                    <View style={[styles.errorWrapper]}>
                        <View style={styles.sectionContentStyle}>
                            {this.renderError()}
                        </View>
                    </View>
                    <View style={styles.sectionWrapper}>
                        <View style={styles.sectionContentStyle}>
                            {this.renderButton()}
                        </View>
                    </View>

                    <View style={[styles.sectionWrapper, styles.signUpWrapper]}>
                        <View style={styles.sectionContentStyle}>
                            <Icon name='arrow-circle-left' type='font-awesome' size={14} color={colors.darkTxt}></Icon>
                            <Text onPress={this.goToLogin.bind(this)} style={{ marginLeft: 10 }}>
                                Return to Log In
                        </Text>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback >
        );
    }
}

const mapStateToProps = state => {
    return {
        //properties below are from AuthReducer is now avaiable in component above.  state.auth is reducer from combinedReducer
        email: state.auth.email,
        error: state.auth.error,
        loading: state.auth.loading
    }
}

export default connect(mapStateToProps, { emailChanged, resetPassword })(ResetPassword);