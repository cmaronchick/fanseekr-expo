import React, { Component } from 'react';
import { View, ScrollView, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import { Button } from '../common';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'

import LinearGradient from 'react-native-linear-gradient';

import globalStyles from '../../stylesheets/globalStyles';
import colors from '../../stylesheets/colors';
import styles from '../../stylesheets/questionnaireStyles';
import { updateUserProfile } from '../../actions/AuthActions';

class Questionnaire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ageGroup: '',
            gender: ''
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Survey",
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
            headerRight: null,
            headerStyle: [globalStyles.headerStyle, { height: 70 }],
            headerTitleStyle: globalStyles.headerTitleStyle
        };
    };


    componentDidMount() {
        this.props.navigation.setParams({ goBack: this.goBack });
        const source = this.props.navigation.getParam('source', 'SignUp');
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    saveSurvey = () => {
        if (this.state.gender && this.state.ageGroup) {
            firestore().collection('users_survey').doc(auth().currentUser.uid).set({
                gender: this.state.gender,
                ageGroup: this.state.ageGroup
            })
                .then(() => {
                    this.props.navigation.navigate('Home')
                })
                .catch(function (error) {
                    console.error("Error writing document: ", error);
                });
        } else {
            Alert.alert("Please help us understand our users by answering both questions.")
        }
    }

    ageGroupClicked(group) {
        this.setState({
            ageGroup: group
        })
    }

    genderClicked(gender) {
        this.setState({
            gender: gender
        })
    }

    render() {
        return (
            <View style={globalStyles.mainContainer}>
                <View style={globalStyles.headerExtended}></View>

                <ScrollView style={styles.questionnaireWrapper} keyboardDismissMode="on-drag">
                    <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={5}>

                        <View style={styles.floatingContentWrapper}>
                            <View>
                                <Text style={styles.sectionTitleStyle}>AGE GROUP:</Text>
                            </View>
                            <View style={styles.sectionStyle}>

                                <View style={{ flexDirection: 'row', marginBottom: 8 }} >
                                    <Button onPressHandler={() => this.ageGroupClicked('18-24')} isSelected={this.state.ageGroup == '18-24'}>
                                        18-24
                                </Button>
                                    <Button onPressHandler={() => this.ageGroupClicked('25-34')} isSelected={this.state.ageGroup == '25-34'}>
                                        25-34
                                </Button>
                                </View>
                                <View style={{ flexDirection: 'row' }} >
                                    <Button onPressHandler={() => this.ageGroupClicked('35-44')} isSelected={this.state.ageGroup == '35-44'}>
                                        35-44
                                </Button>
                                    <Button onPressHandler={() => this.ageGroupClicked('45+')} isSelected={this.state.ageGroup == '45+'}>
                                        45+
                                </Button>
                                </View>
                            </View>
                            <View>
                                <Text style={styles.sectionTitleStyle}>GENDER:</Text>
                            </View>
                            <View style={styles.sectionStyle}>
                                <View style={{ flexDirection: 'row' }} >
                                    <Button onPressHandler={() => this.genderClicked('Male')} isSelected={this.state.gender == 'Male'}>
                                        Male
                                </Button>
                                    <Button onPressHandler={() => this.genderClicked('Female')} isSelected={this.state.gender == 'Female'}>
                                        Female
                                </Button>
                                </View>
                            </View>

                            <View style={styles.buttonWrapper}>
                                <TouchableOpacity onPress={() => this.saveSurvey()}>
                                    <LinearGradient colors={[colors.primary, colors.primaryDarker]} style={[styles.button, globalStyles.linearGradient]}
                                        angle={45} useAngle={true}>
                                        <Text style={styles.buttonText}>
                                            Save
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </View >
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
        favoriteTeams: state.favoriteTeams
    }
}

export default connect(mapStateToProps, { updateUserProfile })(Questionnaire);

