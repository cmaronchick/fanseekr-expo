import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View, ActivityIndicator, Alert} from 'react-native';
import styles from '../stylesheets/globalStyles';
import firebase from '@react-native-firebase/app';
import crashlytics from '@react-native-firebase/crashlytics'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'
import {setUserLocationById} from '../actions/LocationActions';
import {setUserProfile, logoutUser} from '../actions/AuthActions';
import colors from '../stylesheets/colors';
import {_storeLocalItem, _retrieveLocalItem} from '../helpers/asyncStorage';
import Geolocation from '@react-native-community/geolocation';
import {findNearestCity} from '../helpers/locationHelper';


class Loading extends Component {
  componentDidMount() {
    auth().onAuthStateChanged(user => {
      if (user) {
        //SIGNED IN
        var that = this;
        firestore()
          .collection('users2')
          .doc(user.uid)
          .get()
          .then(function(profile) {
            Geolocation.getCurrentPosition(
              position => {
                var nearestCity = findNearestCity(position.coords);
                that.props.setUserLocationById(nearestCity, position.coords);

                that.checkIfUserExists(profile, user, nearestCity);
              },
              error => {
                console.log(`error`, error)
                crashlytics().recordError(error)
                that.props.setUserLocationById(profile.data().location);
                that.checkIfUserExists(profile, user, null);
              },
              {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
            );
          })
          .catch(function(error) {
            console.log(`error`, error)
            auth().signOut();
            that.props.logoutUser();
            that.props.navigation.navigate('LoggedOut');
          });
      } else {
        console.log('no user')
        //SIGNED OUT
        this.props.logoutUser();
        this.props.navigation.navigate('LoggedOut');
      }
    });
  }

  checkIfUserExists(profile, user, nearestCity) {
    if (profile.exists) {
      //USER EXISTS: Redirect to homepage
      this.props.setUserProfile(profile.data());

      if (profile.data().teams.length > 0) {
        this.props.navigation.navigate('LoggedIn');
      } else {
        this.props.navigation.navigate('Wizard');
      }
    } else {
      //NEW USER: Redirect to sign up
      var fullName = user._user.displayName;
      if (fullName.includes(' ')) {
        var name = fullName.split(' ');
        var firstName = name[0];
        var lastNameInitial = name[1].charAt(0);
        fullName = firstName + ' ' + lastNameInitial;
      }

      var user = {
        username: fullName,
        avatar: user._user.photoURL,
        location: nearestCity ? nearestCity : '',
        tagline: '',
        favoriteAthlete: '',
        leastFavoriteAthlete: '',
        mostHatedTeam: '',
        favoriteSport: '',
        teams: [],
        isAdmin:
          auth().currentUser.email.split('@')[1] == 'fanseekr.com',
      };
      firestore()
        .collection('users2')
        .doc(auth().currentUser.uid)
        .set(user);

      firestore()
        .collection('users_dismissed')
        .doc(auth().currentUser.uid)
        .set({
          users: [],
        });

      this.props.setUserProfile(user);
      this.props.navigation.navigate('Wizard');
    }
  }

  render() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    favoriteTeams: state.favoriteTeams,
    location: state.location,
  };
};

export default connect(
  mapStateToProps,
  {setUserProfile, logoutUser, setUserLocationById},
)(Loading);
