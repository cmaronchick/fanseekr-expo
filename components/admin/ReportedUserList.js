import React, { Component } from 'react';
import { View, TouchableOpacity, Linking, Text, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'

import globalStyles from '../../stylesheets/globalStyles';
import colors from '../../stylesheets/colors';
import styles from '../../stylesheets/adminUserListStyles';

class ReportedUserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: "User List",
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

    userClicked = (user) => {

    }

    renderRow(item) {
        return (
            <TouchableOpacity onPress={() => this.userClicked(item)}>
                <View style={styles.userRow}>
                    <View style={styles.rowItemsWrapper}>
                        <Text>{item.username}</Text>
                        <Text style={styles.count}>
                            ID: {item.userId}
                        </Text>
                    </View>
                    <View style={styles.rowItemsWrapper}>
                        <Text style={styles.count}>
                            Inappropriate: {item.reportedAsInappropriateCount}
                        </Text>
                        <Text style={styles.count}>
                            Spam: {item.reportedAsSpamCount}
                        </Text>
                    </View>
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
                    data={this.state.users}
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
        auth: state.auth
    }
}

export default connect(mapStateToProps, {})(ReportedUserList);
