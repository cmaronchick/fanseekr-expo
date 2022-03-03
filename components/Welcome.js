import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Linking } from 'react-native';
import { Icon } from 'react-native-elements';
import { _storeLocalItem } from '../helpers/asyncStorage';
import LinearGradient from 'react-native-linear-gradient';

import globalStyles from '../stylesheets/globalStyles';
import colors from '../stylesheets/colors';
import styles from '../stylesheets/welcomeScreenStyles';

class WelcomeScreen extends Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: "Welcome to FanSeekr!",
            headerLeft: null,
            headerRight: null,
            headerStyle: [globalStyles.headerStyle, { height: 70 }],
            headerTitleStyle: globalStyles.headerTitleStyle
        };
    };

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={globalStyles.headerExtended} />

                <View style={styles.welcomeWrapper}>
                    <View style={styles.floatingContentWrapper}>
                        <Text style={styles.textStyle}>Thank you for downloading FanSeekr! Please note that this app is currently only available in certain cities. It will be available in all major cities soon! </Text>
                        <Text style={styles.textStyle}>Stay tuned via <Text onPress={() => {
                            Linking.openURL(`http://fanseekr.com`)
                        }} style={{ color: colors.primary, textDecorationLine: 'underline' }}>FanSeekr.com</Text>, email, and social media.</Text>

                        <View style={[styles.iconWrapper, { marginTop: 15 }]}>
                            <View>
                                <Icon
                                    name="instagram"
                                    type="font-awesome"
                                    color={"white"}
                                    size={18}
                                    containerStyle={[styles.icon, styles.iconIG]}
                                    onPress={() => {
                                        Linking.openURL(`https://instagram.com/FanSeekr`)
                                    }}
                                />
                            </View>

                            <View>
                                <Icon
                                    name="twitter"
                                    type="font-awesome"
                                    color={"white"}
                                    size={18}
                                    containerStyle={[styles.icon, styles.iconTwitter]}
                                    onPress={() => {
                                        Linking.openURL(`https://twitter.com/FanSeekr`)
                                    }}
                                />
                            </View>


                            <View>
                                <Icon
                                    name="facebook"
                                    type="font-awesome"
                                    color={"white"}
                                    size={18}
                                    containerStyle={[styles.icon, styles.iconFB]}
                                    onPress={() => {
                                        Linking.openURL(`https://m.facebook.com/Fanseekr-380763072557343/`)
                                    }}
                                />
                            </View>
                        </View>

                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity onPress={() => {
                                _storeLocalItem("WelcomeAlertDismissed", "True"); this.props.navigation.navigate('LoggedOut')
                            }} style={styles.button}>
                                < LinearGradient colors={[colors.primary, colors.primaryDarker]} style={[styles.button, globalStyles.linearGradient]}
                                    angle={45} useAngle={true} >
                                    <Text style={styles.buttonText}>
                                        Continue
                                        </Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            </View >
        );
    }
}

export default WelcomeScreen;

