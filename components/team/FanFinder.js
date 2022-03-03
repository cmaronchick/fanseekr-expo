import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Text,
  FlatList,
  Image,
  Animated,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import teamImages from '../../public/images/teamImages';
import {connect} from 'react-redux';
import {Avatar, Icon} from 'react-native-elements';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import {
  GeoCollectionReference,
  GeoFirestore,
  GeoQuery,
  GeoQuerySnapshot,
} from 'geofirestore';
import globalStyles from '../../stylesheets/globalStyles';
import styles from '../../stylesheets/fanFinderStyles';
import colors from '../../stylesheets/colors';
import {addToRoster} from '../../actions/RosterActions';

const {width, height} = Dimensions.get('window');
const db = firestore();
const geofirestore: GeoFirestore = new GeoFirestore(db);

class FanFinder extends Component {
  static navigationOptions = ({navigation}) => {
    const {state} = navigation;
    const params = state.params || {};
    return {
      title: params.username,
      headerRight: null,
      headerLeft: (
        <TouchableOpacity
          onPress={navigation.getParam('goBack')}
          style={globalStyles.headerLeftButtonWrapper}>
          <Icon
            name="arrow-back"
            type="ionic"
            color={colors.lightTxt}
            size={22}
          />
        </TouchableOpacity>
      ),
      headerStyle: globalStyles.headerStyle,
      headerTitleStyle: globalStyles.headerTitleStyle,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      users: [],
      fadeAnim: new Animated.Value(1),
      indexToAnimate: -1,
    };
  }

  goBack = () => {
    this.props.navigation.goBack();
  };

  componentDidMount() {
    this.props.navigation.setParams({goBack: this.goBack});
    this.getLocalFans();
  }

  getLocalFans() {
    var self = this;
    geofirestore
      .collection('users2')
      .near({
        center: new firebase.firestore.GeoPoint(
          this.props.location.currentLocationCoordinates.latitude,
          this.props.location.currentLocationCoordinates.longitude,
        ),
        radius: 15,
      })
      .get()
      .then(usersNearby => {
        var userList = [];

        firestore()
          .collection('users_dismissed')
          .doc(auth().currentUser.uid)
          .get()
          .then(dismissed => {
            var dismissedUsers = [];

            if (dismissed.exists) {
              dismissedUsers = dismissed.data().users;
            }

            usersNearby.forEach(function(user) {
              var userObj = user.data();
              if (user.id != auth().currentUser.uid) {
                //check if user is not in current roster
                if (
                  self.props.roster.users.filter(e => e._id === user.id)
                    .length <= 0
                ) {
                  //check if user not previously dismissed
                  if (dismissedUsers.filter(e => e === user.id).length <= 0) {
                    //check if user follows current team
                    if (
                      userObj.teams.some(
                        e => e.teamId == self.props.teams.selectedTeam.teamId,
                      )
                    ) {
                      userObj._id = user.id;
                      userList.push(userObj);
                    }
                  }
                }
              }
            });

            this.setState({users: userList, isLoading: false});

            if (this.state.users.length > 0) {
              this.props.navigation.setParams({
                username: this.state.users[0].username,
              });
            }
          });
      })
      .catch(function(error) {
        this.setState({users: [], isLoading: false});
      });
  }

  addToRoster(user, index) {
    this.props.addToRoster(
      user._id,
      user.username,
      user.avatar,
      this.props.favTeams.selectedTeam.teamId,
      user.teams,
    );
    this.removeUserFromState(index);
  }

  dismissUser(userId, index) {
    var self = this;
    firestore()
      .collection('users_dismissed')
      .doc(auth().currentUser.uid)
      .set(
        {
          users: firebase.firestore.FieldValue.arrayUnion(userId),
        },
        {merge: true},
      )
      .then(function() {
        self.removeUserFromState(index);
      });
  }

  removeUserFromState(index) {
    this.setState(
      {
        indexToAnimate: index,
      },
      () => {
        const animations = [
          Animated.timing(this.state.fadeAnim, {
            toValue: 0,
            duration: 400,
          }),
        ];

        Animated.sequence(animations).start(() => {
          var userArr = [...this.state.users];
          userArr.splice(index, 1);
          this.setState({
            users: userArr,
            indexToAnimate: -1,
            fadeAnim: new Animated.Value(1),
          });

          if (userArr.length > 0) {
            this.props.navigation.setParams({
              username: userArr[0].username,
            });
          } else {
            this.props.navigation.setParams({
              username: '',
            });
          }
        });
      },
    );
  }

  renderFlatlistItem = (u, index) => {
    return (
      <Animated.View
        style={{
          flex: 1,
          height: height,
          width: width,
          opacity: index == this.state.indexToAnimate ? this.state.fadeAnim : 1,
        }}>
        <View style={globalStyles.headerExtended} />
        <ScrollView style={styles.profileWrapper}>
          <View style={styles.floatingContentWrapper}>
            <View style={[styles.sectionStyle, styles.avatarSection]}>
              {u.avatar ? (
                <Avatar size="xlarge" source={{uri: u.avatar}} rounded />
              ) : (
                <Avatar
                  size="xlarge"
                  title={u.username ? u.username[0].toUpperCase() : ''}
                  rounded
                />
              )}

              <Text style={styles.tagLineWrapper}>{u.tagline}</Text>

              <FlatList
                data={u.teams}
                renderItem={({item}) => this.renderTeam(item)}
                numColumns={6}
                keyExtractor={(item, index) => index}
              />
            </View>

            <View>
              {u.favoriteSport ? (
                <View style={styles.rowStyle}>
                  <Text style={styles.labelStyle}>FAVORITE SPORT:</Text>
                  <Text style={styles.textStyle}>{u.favoriteSport}</Text>
                </View>
              ) : (
                <View />
              )}

              {u.favoriteAthlete ? (
                <View style={styles.rowStyle}>
                  <Text style={styles.labelStyle}>FAVORITE ATHLETE:</Text>
                  <Text style={styles.textStyle}>{u.favoriteAthlete}</Text>
                </View>
              ) : (
                <View />
              )}
              {u.leastFavoriteAthlete ? (
                <View style={styles.rowStyle}>
                  <Text style={styles.labelStyle}>MOST HATED ATHLETE:</Text>
                  <Text style={styles.textStyle}>{u.leastFavoriteAthlete}</Text>
                </View>
              ) : (
                <View />
              )}

              {u.mostHatedTeam ? (
                <View style={styles.rowStyle}>
                  <Text style={styles.labelStyle}>MOST HATED TEAM:</Text>
                  <Text style={styles.textStyle}>{u.mostHatedTeam}</Text>
                </View>
              ) : (
                <View />
              )}
            </View>

            <View style={styles.buttonsWrapper}>
              <TouchableOpacity
                style={styles.btnStyle}
                onPress={() => this.addToRoster(u, index)}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDarker]}
                  style={globalStyles.linearGradient}
                  angle={45}
                  useAngle={true}>
                  <Text style={styles.btnTextStyle}>Add To Roster</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnStyle}
                onPress={() => this.dismissUser(u._id, index)}>
                <LinearGradient
                  colors={['#ff583e', '#d1371f']}
                  style={globalStyles.linearGradient}
                  angle={45}
                  useAngle={true}>
                  <Text style={styles.btnTextStyle}>Dismiss</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Animated.View>
    );
  };

  renderTeam(item) {
    return (
      <View style={styles.logoWrapper}>
        <Image
          style={styles.logo}
          source={teamImages[item.teamId]}
          resizeMode="contain"
        />
      </View>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={[globalStyles.mainContainer, {justifyContent: 'center'}]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    } else if (this.state.users.length > 0) {
      return (
        <View style={globalStyles.mainContainer}>
          <FlatList
            horizontal={true}
            scrollEnabled={false}
            renderItem={({item, index}) => this.renderFlatlistItem(item, index)}
            keyExtractor={item => item._id}
            data={this.state.users}
            extraData={this.state}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.noFansContainer}>
          <Text style={styles.noFansText}>
            There are no more new {this.props.favTeams.selectedTeam.name} fans
            in your area.
          </Text>
        </View>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    teams: state.favoriteTeams,
    location: state.location,
    roster: state.roster,
    favTeams: state.favoriteTeams,
  };
};

export default connect(
  mapStateToProps,
  {addToRoster},
)(FanFinder);
