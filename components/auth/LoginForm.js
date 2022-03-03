import React, { Component } from 'react';
import { View, Text, Image, Linking, TouchableOpacity, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';
import globalStyles from '../../stylesheets/globalStyles';
import colors from '../../stylesheets/colors';

import { GoogleSignin, statusCodes } from '@react-native-community/google-signin';
import firebase from '@react-native-firebase/app'
import auth from '@react-native-firebase/auth'
import crashlytics from '@react-native-firebase/crashlytics'
import analytics from '@react-native-firebase/analytics'
import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { Icon, Overlay } from 'react-native-elements';
import { emailChanged, passwordChanged, loginUser, toggleLoginUser } from '../../actions/AuthActions';
import { Button } from '../common';
import styles from '../../stylesheets/loginStyles';

class LoginForm extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
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

  goToGoogleLogin = () => {
    this.onGoogleButtonPress().then(() => console.log('Signed in with Google!'));
  }

  goToFBLogin = () => {
    this.facebookLogin().then(() => console.log('Signed in with FB!'));
  }

  async onGoogleButtonPress() {
    try {
      await GoogleSignin.configure({
        webClientId: '700160758328-rkddtsstfg5dulp5klss55vfu1n0dlq9.apps.googleusercontent.com'
      });
      this.props.toggleLoginUser()
      const data = await GoogleSignin.signIn();
      if (data) {
        const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
        const signInResponse = await auth().signInWithCredential(credential);
        console.log('signInResponse :>> ', signInResponse);
        await analytics().logEvent('loginSuccess');

      }
    } catch (error) {
      await analytics().logEvent('loginFailure', { errorCode: error.code })
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }

  async facebookLogin() {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (!result.isCancelled) {
        // get the access token
        const data = await AccessToken.getCurrentAccessToken();

        if (data) {
          // create a new firebase credential with the token
          const credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
          const firebaseUserCredential = await auth().signInWithCredential(credential);
        } else {
          console.log("Something went wrong with getting token");
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  goToTerms() {
    Linking.openURL(`https://app.termly.io/document/terms-of-use-for-website/c2cee056-2add-4d1c-8a0e-b2b6a59e7b53`)

  }

  goToEULA() {
    Linking.openURL(`http://fanseekr.com/eula.html`)

  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../../public/images/logos/180.png')}
          style={{ alignSelf: 'center', width: 150, height: 150 }} />
        <View style={{ alignSelf: 'stretch', height: 50, marginBottom: 15 }}>
          <TouchableOpacity style={styles.btnWrapper} onPress={this.goToGoogleLogin.bind(this)}>
            <LinearGradient colors={[colors.primary, colors.primaryDarker]} style={[globalStyles.linearGradient, styles.btnStyle]}
              angle={45} useAngle={true}>
              <Icon
                name="google"
                type="font-awesome"
                color={colors.lightTxt}
                size={22}
              />
              <Text style={styles.btnTextStyle}>
                Login with Google
               </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={{ alignSelf: 'stretch', height: 50 }}>
          <TouchableOpacity style={styles.btnWrapper} onPress={this.goToFBLogin.bind(this)}>
            <LinearGradient colors={[colors.primary, colors.primaryDarker]} style={[globalStyles.linearGradient, styles.btnStyle]}
              angle={45} useAngle={true}>
              <Icon
                name="facebook"
                type="font-awesome"
                color={colors.lightTxt}
                size={22}
              />
              <Text style={styles.btnTextStyle}>
                Login with Facebook
               </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <View style={[styles.sectionWrapper, styles.termsWrapper]}>
          <View style={[styles.sectionContentStyle, styles.sectionTermsStyle]}>
            <Text>By logging in, you agree to our </Text>
            <Text style={styles.linkStyle} onPress={this.goToTerms.bind(this)}>
              Terms of Use & Privacy Policy
                            </Text>
          </View>
        </View>
        <Overlay
        fullScreen
        isVisible={this.props.loading}>
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator />
          </View>
        </Overlay>
      </View >
    );
  }
}

const mapStateToProps = state => {
  return {
    //properties below are from AuthReducer is now avaiable in component above.  state.auth is reducer from combinedReducer
    email: state.auth.email,
    password: state.auth.password,
    error: state.auth.error,
    loading: state.auth.loading
  }
}

export default connect(mapStateToProps, { emailChanged, passwordChanged, loginUser, toggleLoginUser })(LoginForm);
