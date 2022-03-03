import React, { Component } from 'react';
import { View, ScrollView, Button, Text, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert } from 'react-native';
import { fbProjectName } from '../../app.json';
import { Avatar, Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import Filter from 'bad-words';

import LinearGradient from 'react-native-linear-gradient';

import globalStyles from '../../stylesheets/globalStyles';
import colors from '../../stylesheets/colors';
import styles from '../../stylesheets/questionnaireStyles';
import ImagePicker from 'react-native-image-crop-picker';
import { updateUserProfile } from '../../actions/AuthActions';

class Questionnaire extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tagline: '',
            favoriteAthlete: '',
            leastFavoriteAthlete: '',
            mostHatedTeam: '',
            favoriteSport: '',
            avatar: '',
            username: '',
            previousScreen: ''
        };
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "About You",
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
        var userProfile = this.props.auth.userProfile;

        if (source == 'Home') {
            //user came from Home screen "Edit"
            this.setState({
                avatar: userProfile.avatar,
                tagline: userProfile.tagline,
                favoriteAthlete: userProfile.favoriteAthlete,
                leastFavoriteAthlete: userProfile.leastFavoriteAthlete,
                mostHatedTeam: userProfile.mostHatedTeam,
                favoriteSport: userProfile.favoriteSport,
                username: userProfile.username,
                previousScreen: 'Home'
            });
        } else {
            //user came from sign-up wizard
            this.setState({
                avatar: userProfile.avatar
            });
        }
    }

    goBack = () => {
        this.props.navigation.goBack();
    }

    getImage = () => {
        const options = {
            title: 'Select Avatar',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            maxWidth: 200,
            maxHeight: 200
        };


        ImagePicker.openPicker({
            cropping: true,
            width: 200,
            height: 300,
            compressImageQuality: 0.6,
            cropperCircleOverlay: true,
            freeStyleCropEnabled: true,
            avoidEmptySpaceAroundImage: true
        }).then(response => {
            this.uploadToFirebase(response.path)
        }).catch((error) => {
            if (error == "Error: Cannot access images. Please allow access if you want to be able to select images.") {

                Alert.alert(
                    '',
                    'Unable to access your photos.  Please allow FanSeekr to access your photo library.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                            },
                            style: 'cancel'
                        }
                    ]
                );
            }
        });
    }

    uploadToFirebase = (img) => {
        return new Promise((resolve, reject) => {
            const uid = auth().currentUser.uid;
            var storageRef = firebase.storage().ref('avatars/' + uid + '.jpg');

            storageRef.put(img, {
                contentType: 'image/jpeg'
            }).on(
                firebase.storage.TaskEvent.STATE_CHANGED,
                snapshot => {
                    this.setState({
                        ...this,
                        avatar: `https://firebasestorage.googleapis.com/v0/b/${fbProjectName}/o/avatars%2F${uid}.jpg?alt=media`
                    })

                    resolve(snapshot);
                },
                error => {
                    reject(error);
                });
        });
    }

    saveBio = async () => {
        var filter = new Filter();
        var tagline = filter.clean(this.state.tagline);
        var favoriteSport = filter.clean(this.state.favoriteSport);
        var favoriteAthlete = filter.clean(this.state.favoriteAthlete);
        var leastFavoriteAthlete = filter.clean(this.state.leastFavoriteAthlete);
        var mostHatedTeam = filter.clean(this.state.mostHatedTeam);
        try {
            let updateResponse = await firestore().collection('users2').doc(auth().currentUser.uid).update({
                tagline: tagline,
                favoriteSport: favoriteSport,
                favoriteAthlete: favoriteAthlete,
                leastFavoriteAthlete: leastFavoriteAthlete,
                mostHatedTeam: mostHatedTeam,
                avatar: this.state.avatar
            })
        
            this.props.updateUserProfile({
                tagline: tagline,
                favoriteSport: favoriteSport,
                favoriteAthlete: favoriteAthlete,
                leastFavoriteAthlete: leastFavoriteAthlete,
                mostHatedTeam: mostHatedTeam,
                avatar: this.state.avatar,
                username: this.state.username
            });

            if (this.state.previousScreen) {
                this.props.navigation.navigate('Home');
            } else {
                this.props.navigation.navigate('Survey');
            }
        } catch(error) {
            console.error("Error writing document: ", error);
        };

    }

    render() {
        return (
            <View style={globalStyles.mainContainer}>
                <View style={globalStyles.headerExtended}></View>

                <ScrollView style={styles.questionnaireWrapper} keyboardDismissMode="on-drag">
                    <KeyboardAvoidingView behavior="padding" enabled keyboardVerticalOffset={5}>

                        <View style={styles.floatingContentWrapper}>
                            <View>
                                <Text style={styles.sectionTitleStyle}>PROFILE PIC</Text>
                            </View>
                            <View style={[styles.sectionStyle, styles.avatarSection]}>
                                {
                                    this.state.avatar ?
                                        <Avatar size="large"
                                            source={{ uri: this.state.avatar }}
                                            rounded
                                            showEditButton
                                            onPress={() => this.getImage()}
                                        />
                                        :
                                        <Avatar size="large"
                                            title={(this.state.username ? this.state.username[0].toUpperCase() : '')}
                                            rounded
                                            showEditButton
                                            onPress={() => this.getImage()}
                                        />
                                }
                            </View>

                            <View>
                                <Text style={styles.sectionTitleStyle}>TAGLINE:</Text>
                            </View>
                            <View style={styles.sectionStyle}>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(text) => {
                                        this.setState({ tagline: text });
                                    }}
                                    value={this.state.tagline}
                                    maxLength={30}
                                />
                            </View>

                            <View>
                                <Text style={styles.sectionTitleStyle}>FAVORITE SPORT:</Text>
                            </View>
                            <View style={styles.sectionStyle}>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(text) => {
                                        this.setState({ favoriteSport: text });
                                    }}
                                    value={this.state.favoriteSport}
                                />
                            </View>

                            <View>
                                <Text style={styles.sectionTitleStyle}>FAVORITE ATHLETE:</Text>
                            </View>
                            <View style={styles.sectionStyle}>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(text) => this.setState({ favoriteAthlete: text })}
                                    value={this.state.favoriteAthlete}
                                />
                            </View>

                            <View>
                                <Text style={styles.sectionTitleStyle}>MOST HATED ATHLETE:</Text>
                            </View>
                            <View style={styles.sectionStyle}>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(text) => this.setState({ leastFavoriteAthlete: text })}
                                    value={this.state.leastFavoriteAthlete}
                                    onFocus={() => this.setState({ behavior: 'position' })}
                                />
                            </View>

                            <View>
                                <Text style={styles.sectionTitleStyle}>MOST HATED TEAM:</Text>
                            </View>
                            <View style={styles.sectionStyle}>
                                <TextInput
                                    style={styles.inputStyle}
                                    onChangeText={(text) => this.setState({ mostHatedTeam: text })}
                                    value={this.state.mostHatedTeam}
                                />
                            </View>

                            <View style={styles.buttonWrapper}>
                                <TouchableOpacity onPress={() => this.saveBio()}>
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
            </View>
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

