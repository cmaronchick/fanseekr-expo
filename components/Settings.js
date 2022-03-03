import React, { Component } from 'react';
import { View, TouchableOpacity, Linking, Text, ScrollView, Switch, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import messaging from '@react-native-firebase/messaging'
import crashlytics from '@react-native-firebase/crashlytics'
import analytics from '@react-native-firebase/analytics'
import VersionNumber from 'react-native-version-number';

import { updateUserFCMToken } from '../actions/AuthActions';
import globalStyles from '../stylesheets/globalStyles';
import colors from '../stylesheets/colors';
import styles from '../stylesheets/settingsStyles';
import NavigationService from '../NavigationService';

class Settings extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "Settings",
            headerRight: null,
            headerLeft: (
                <TouchableOpacity
                    onPress={navigation.getParam('goBack')}
                    style={globalStyles.headerLeftButtonWrapper}
                >
                    <Icon
                        name="arrow-back"
                        type="ionic"
                        color={colors.lightTxt}
                        size={22}
                    />

                </TouchableOpacity>
            ),
            headerStyle: globalStyles.headerStyle,
            headerTitleStyle: globalStyles.headerTitleStyle
        };
    };

    goBack = () => {
        this.props.navigation.goBack();
    }

    renderAdminSection() {
        if (this.props.auth.userProfile.isAdmin) {
            return (
                <View style={{ marginLeft: 10, marginRight: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 15 }}>Administrator</Text>
                    <View style={styles.floatingContentWrapper}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate("ReportedUserList")} >
                            <View style={styles.settingsRow}>
                                <Icon name="users" type='font-awesome' size={23} color={this.props.tintColor} />
                                <Text style={styles.text}>Reported Users List</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    notificationSwitchChanged = () => {
        if (this.props.auth.userProfile.fcmToken != 'Denied') {
            //disable notifications
            this.props.updateUserFCMToken('Denied');
            firestore().collection('users2').doc(auth().currentUser.uid).update({
                fcmToken: 'Denied'
            })
                .then(() => {
                })
                .catch(function (error) {
                });
        } else {
            //get token and enable notifications
            this.getFCMToken();
        }

    }

    async getFCMToken() {
        var that = this;
        try {
            fcmToken = await messaging().getToken();
            if (fcmToken) {
                firestore().collection('users2').doc(auth().currentUser.uid).update({
                    fcmToken: fcmToken
                })
                    .then(() => {
                        Alert.alert(
                            '',
                            'Please make sure notifications are enabled in your iOS Settings (Settings > FanSeekr)',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => {
                                    },
                                    style: 'cancel'
                                },
                                {
                                    text: 'Go to Settings',
                                    onPress: () => {
                                        Linking.openURL('app-settings:');
                                    }
                                }
                            ]
                        );

                        that.props.updateUserFCMToken(fcmToken);
                    })
                    .catch(function (error) {
                    });
            }
        } catch (error) {

        }
    }

    logOut = () => {
        var self = this;
        firestore().collection('users2').doc(auth().currentUser.uid).update({
            fcmToken: ''
        })
            .then(() => {
                return analytics().logEvent('logOutSuccess');
            })
            .then(() => self.props.updateUserFCMToken(fcmToken))
            .catch(function (error) {
            });

        auth().signOut();
    }

    componentDidMount() {
        this.props.navigation.setParams({ goBack: this.goBack });
    }

    render() {
        return (
            <View style={globalStyles.mainContainer}>
                <View style={globalStyles.headerExtended}></View>


                <ScrollView style={styles.settingsWrapper}>
                    <View style={styles.floatingContentWrapper}>
                        <View>
                            <View style={styles.settingsRow}>
                                <Text style={styles.settingsText}>Notifications:</Text>
                                <Switch value={(this.props.auth.userProfile.fcmToken != "Denied")} onValueChange={this.notificationSwitchChanged}
                                ></Switch>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => NavigationService.navigate('BlockedUsersList')}>
                            <View style={styles.settingsRow}>
                                <Icon name="ban" type='font-awesome' size={23} color={this.props.tintColor} />
                                <Text style={styles.text}>My Blocked Users</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.floatingContentWrapper}>
                        <TouchableOpacity onPress={() => Linking.openURL('mailto:info@fanseekr.com')}>
                            <View style={styles.settingsRow}>
                                <Icon name="envelope-o" type='font-awesome' size={23} color={this.props.tintColor} />
                                <Text style={styles.text}>Contact FanSeekr</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://app.termly.io/document/terms-of-use-for-website/c2cee056-2add-4d1c-8a0e-b2b6a59e7b53')}>
                            <View style={[styles.settingsRow, { borderBottomWidth: 0 }]}>
                                <Icon name="file-text-o" type='font-awesome' size={24} color={this.props.tintColor} />
                                <Text style={styles.text}>Terms Of Use & Privacy Policy</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            this.logOut();
                        }}>
                            <View style={[styles.settingsRow, { borderBottomWidth: 0 }]}>
                                <Icon name="sign-out" type='font-awesome' size={24} color={this.props.tintColor} />
                                <Text style={styles.text}>Log Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {this.renderAdminSection()}
                    <View style={styles.versionWrapper}>
                        <Text>
                            App Version: {VersionNumber.appVersion}
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, { updateUserFCMToken })(Settings);
