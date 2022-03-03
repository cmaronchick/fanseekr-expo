import React, { Component } from 'react';
import { View, TouchableOpacity, Linking, Text, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'

import globalStyles from '../../stylesheets/globalStyles';
import colors from '../../stylesheets/colors';
import styles from '../../stylesheets/blockedUserListStyles';

class BlockedUserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "My Blocked Users",
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

    goToUserProfile(userId) {
        this.props.navigation.navigate('ProfileHome', {
            user: { _id: userId }
        });
    }

    renderRow(item) {
        return (
            <TouchableOpacity
                style={styles.userRow}
                onPress={() => {
                    this.goToUserProfile(item.userId);
                }}>
                <View style={styles.rowItemsWrapper}>
                    <Text style={styles.text}>{item.username}</Text>
                    <Icon
                        containerStyle={styles.iconNext}
                        size={18}
                        name='chevron-right'
                        type='font-awesome'
                        color={colors.primary} />
                </View>
            </TouchableOpacity >

        );
    }

    componentDidMount() {
        this.props.navigation.setParams({ goBack: this.goBack });
        var self = this;

        firestore().collection("users_reported").orderBy("reportedAsInappropriateCount", "desc").get().then(function (querySnapshot) {
            var users = [];
            querySnapshot.forEach(function (doc) {
                users.push(doc.data());
            });

            self.setState({
                users: users
            });
        }).catch(function (error) {
        });
    }

    render() {
        return (
            <View style={globalStyles.mainContainer}>
                <FlatList
                    data={this.props.blockedUsers.users}
                    renderItem={({ item }) => (
                        this.renderRow(item)
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        blockedUsers: state.blockedUsers
    }
}

export default connect(mapStateToProps, {})(BlockedUserList);
