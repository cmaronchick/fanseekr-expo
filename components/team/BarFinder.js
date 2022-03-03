import React, {Component} from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet,
  Platform,
  Linking,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Button, Icon, Avatar, Image } from 'react-native-elements'
import teamImages from '../../public/images/teamImages';

import {connect} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import _ from 'lodash';

import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import {
  GeoCollectionReference,
  GeoFirestore,
  GeoQuery,
  GeoQuerySnapshot,
} from 'geofirestore';

import globalStyles from '../../stylesheets/globalStyles';
import styles from '../../stylesheets/barFinderStyles';
import colors from '../../stylesheets/colors';
import { Directions, FlingGestureHandler, State } from 'react-native-gesture-handler';

import { getBarDetails } from '../../actions/BarActions'

import AddBar from './AddBar'
import BarMap from './BarMap';

const db = firestore();
const geofirestore: GeoFirestore = new GeoFirestore(db);
const geocollection: GeoCollectionReference = geofirestore.collection('bars2');

const {width, height} = Dimensions.get('window');
const CARD_HEIGHT = 190;
const CARD_WIDTH = width - 20;
var _defaultMarkerIndex = -1;
var firstRun = true;

const RecenterButton = ({top, onPress}) => (
  <View style={{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    position: 'absolute',
    top: top,
    right: 0,
    zIndex: 2,
    backgroundColor: '#fff',
    opacity: 0.8,
    borderRadius: 4}}>
    <Button
    onPress={() => onPress()}
    type="clear"
        icon={<Icon
        name="locate"
        type="ionicon"
        size={25}
        buttonStyle={{height:20, width: 20}}
        color={styles.darkTxt} />
      } />
  </View>
)

class BarFinder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: this.props.location.currentLocationCoordinates.latitude, //TODO: change to users exact location
        longitude: this.props.location.currentLocationCoordinates.longitude,
        latitudeDelta: 0.15,
        longitudeDelta: 0.001,
      },
      noFavModalVisible: false,
      helpModalVisible: false,
      addBarModalVisible: false,
      selectedBar: {},
      activeBarIndex: null,
      markers: [],
      defaultMarkerIndex: -1,
      isLoading: false,
      isScrolling: false,
      onBarSelect: null
    };

    this.loadBarsDelayed = _.debounce(this.loadBars, 1100);
  }

  static navigationOptions = ({navigation}) => {
    return {
      title: '',
      headerRight: (
        <View style={styles.headerRightButtons}>
          <TouchableOpacity
            onPress={navigation.getParam('toggleAddBarModalVisible')}
            >
            <Avatar
              rounded={true}
              icon={{ name: 'plus', type: 'font-awesome'}}
              color="#000"
              size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={navigation.getParam('toggleHelpModalVisible')}
            style={globalStyles.headerRightButtonWrapper}>
            <Icon name="help" type="ionic" color={colors.darkTxt} size={22} />
          </TouchableOpacity>
        </View>
      ),
      headerLeft: (
        <TouchableOpacity
          onPress={navigation.getParam('goHome')}
          style={globalStyles.headerLeftButtonWrapper}>
          <Icon
            name="arrow-back"
            type="ionic"
            color={colors.darkTxt}
            size={22}
          />
        </TouchableOpacity>
      ),
      headerTransparent: true,
    };
  };

  goHome = () => {
    if (this.props.navigation.getParam('source') === 'MyGroups') {
      this.props.navigation.navigate('MyGroups');
    } else {
      this.props.navigation.goBack();
    }
  };

  UNSAFE_componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  componentDidMount() {
    _defaultMarkerIndex = -1;

    this.props.navigation.setParams({goHome: this.goHome});
    this.props.navigation.setParams({
      toggleHelpModalVisible: this.toggleHelpModalVisible,
      toggleAddBarModalVisible: this.toggleAddBarModalVisible
    });


    this.animation.addListener(({value}) => {
      let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
      if (index >= this.state.markers.length) {
        index = this.state.markers.length - 1;
      }
      if (index <= 0) {
        index = 0;
      }

      clearTimeout(this.regionTimeout);
      this.regionTimeout = setTimeout(() => {
        if (this.index !== index) {
          this.index = index;
          const {coordinates} = this.state.markers[index];

          this._map.animateToRegion(
            {
              latitude: coordinates.latitude,
              longitude: coordinates.longitude,
              latitudeDelta: this.state.region.latitudeDelta,
              longitudeDelta: this.state.region.longitudeDelta,
            },
            350,
          );
        }
      }, 10);
    });
  }

  setNoFavModalVisible(visible) {
    this.setState({...this, noFavModalVisible: visible});
  }

  toggleHelpModalVisible = () => {
    this.setState({...this, helpModalVisible: !this.state.helpModalVisible});
  };

  toggleAddBarModalVisible = () => {
    console.log(`button clicked`)
    this.setState({
      addBarModalVisible: !this.state.addBarModalVisible
    })
  }

  markerClick = i => {
    var selectedBar = this.state.markers[i];
    const {coordinate} = selectedBar;
    // this._map.animateToRegion(
    //   {
    //     latitude: coordinate.latitude,
    //     longitude: coordinate.longitude,
    //     latitudeDelta: this.state.region.latitudeDelta,
    //     longitudeDelta: this.state.region.longitudeDelta,
    //   },
    //   350,
    // );
    if (this.props.navigation.getParam('onBarSelect')) {
      this.props.navigation.getParam('onBarSelect')('favoriteBar', selectedBar.barId)
    }
    this.setState({selectedBar: selectedBar, isScrolling: false, activeBarIndex: i});
  };

  loadFirstFavTeam = () => {
    if (this.state.defaultMarkerIndex != -1) {
      this.markerClick(this.state.defaultMarkerIndex);
    } else {
      this.markerClick(0);
    }
  };

  openMapForDirections = address => {
    let open = Platform.select({
      ios: () => {
        Linking.openURL('http://maps.apple.com/maps?daddr=' + address);
      },
      android: () => {
        Linking.openURL('http://maps.google.com/maps?daddr=' + address);
      },
    });

    open();
  };

  regionChanged = region => {
    console.log(`region`, region)
    const {longitude, latitude} = region;
    this.setState({isScrolling: true});

    this.loadBarsDelayed(latitude, longitude);
  };

  recenterMap = () => {
    console.log(`recenter button pressed`)

    this._map.animateToRegion(
      {
        latitude: this.props.location.currentLocationCoordinates.latitude,
        longitude: this.props.location.currentLocationCoordinates.longitude,
        latitudeDelta: this.state.region.latitudeDelta,
        longitudeDelta: this.state.region.longitudeDelta,
      },
      350,
    );
    this.regionChanged({
      latitude: this.props.location.currentLocationCoordinates.latitude, //TODO: change to users exact location
      longitude: this.props.location.currentLocationCoordinates.longitude
    })
    
  }

  loadBars = (lat, long) => {
    if (this.state.isLoading) {
      return false;
    }
    console.log(`lat, long`, lat, long)

    var _bars = [];
    var self = this;
    this.setState({isLoading: true});
    geofirestore
      .collection('bars2')
      .near({center: new firebase.firestore.GeoPoint(lat, long), radius: 8})
      .get()
      .then(function(querySnapshot) {
        console.log(`querySnapshot`, querySnapshot)
        querySnapshot.forEach(function(doc) {
          console.log(`doc.data()`, doc.data())
          _bars.push({...doc.data(), barId: doc.id});
        });
        var barArr = [];

        _bars.forEach(function(bar, index) {
          //determine if bar supports team
          var isFavTeam = false;
          if (bar.isActive === false) {
            return;
          }

          for (var i = 0; i < bar.teams.length; i++) {
            if (!isFavTeam) {
              if (bar.teams[i].teamId == self.props.teams.selectedTeam.teamId) {
                isFavTeam = true;

                if (self.state.defaultMarkerIndex == -1) {
                  //set default marker once
                  self.setState({defaultMarkerIndex: index});
                }
                break;
              } else {
                isFavTeam = false;
              }
            }
          }
          //add bar to new array for state
          barArr.push({...bar, isFavTeam: isFavTeam});
        });
        
        self.setState({markers: barArr, isLoading: false});
        
        if (firstRun) {
          firstRun = false;
          if (barArr.length == 0) {
            self.setState({
              noFavModalVisible: true,
            });
          } else {
            self.loadFirstFavTeam();
          }
        }
      })
      .catch((loadBarsError) => {
        console.log(`loadBarsError`, loadBarsError)
      });

  };

  renderLoading() {
    if (this.state.isLoading) {
      return (
        <View
          style={{
            width: width,
            height: height,
            backgroundColor: 'transparent',
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
          }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    } else {
      return null;
    }
  }


  render() {
    const { activeBarIndex } = this.state
    return (
      <View style={[styles.container, {flexDirection: 'column'}]}>
        {this.renderLoading()}
        <BarMap
          region={this.state.region}
          ref={map => (_map = map)}
          markers={this.state.markers}
          selectedBar={this.state.selectedBar}
          styles={styles}
          regionChanged={this.regionChanged}
          markerClick={this.markerClick} />
        <Modal
          animationType="slide"
          transparent
          visible={this.state.noFavModalVisible}>
          <View style={styles.modal}>

            <View style={styles.modalWrapper}>
              <Text style={styles.modalText}>
                We couldn’t find any bars in the area affiliated with your team.
                Please contact us below if you have any recommendations.
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL('mailto:info@fanseekr.com')}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDarker]}
                  style={[styles.modalButton, globalStyles.linearGradient]}
                  angle={45}
                  useAngle={true}>
                  <Text style={styles.buttonText}>Email Us</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  this.setNoFavModalVisible(!this.state.noFavModalVisible);
                }}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDarker]}
                  style={[styles.modalButton, globalStyles.linearGradient]}
                  angle={45}
                  useAngle={true}>
                  <Text style={styles.buttonText}>Close</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {this.state.noFavModalVisible ||
            this.state.helpModalVisible ||
            this.state.isScrolling && <RecenterButton top={Dimensions.get('window').height * 0.8} onPress={this.recenterMap} />}
            <FlingGestureHandler
              key='left'
              direction={Directions.LEFT}
              onHandlerStateChange={ev => {
                if (ev.nativeEvent.state === State.END) {
                  //setActiveIndex()
                  if (this.state.markers.length < 2) {
                    return

                  }
                  if (activeBarIndex === this.state.markers.length -1) {
                    this.markerClick(0)
                  }
                  this.markerClick(this.state.activeBarIndex + 1)
                }
              }}>

            <FlingGestureHandler
              key='right'
              direction={Directions.RIGHT}
              onHandlerStateChange={ev => {
                if (ev.nativeEvent.state === State.END) {
                  //setActiveIndex()
                  if (this.state.markers.length < 2) {
                    return
                  }
                  if (activeBarIndex === 0) {
                    this.markerClick(this.state.markers.length -1)
                  }
                  this.markerClick(this.state.activeBarIndex - 1)
                }
              }}>
            <View
              style={[
                cardStyle.card,
                this.state.noFavModalVisible ||
                this.state.helpModalVisible ||
                this.state.isScrolling
                  ? globalStyles.hidden
                  : '',
              ]}>
                {!(this.state.noFavModalVisible ||
                this.state.helpModalVisible ||
                this.state.isScrolling) && <RecenterButton onPress={this.recenterMap} top={-50} />}
              <View style={[styles.cardRow,styles.cardButtonWrapper, {width: '100%', justifyContent: 'space-between', alignItems: 'center'}]}>
              <Text numberOfLines={1} style={styles.cardtitle}>
                {this.state.selectedBar.name}
              </Text>
                  <Button
                    onPress={() => {
                      this.props.getBarDetails(this.state.selectedBar.barId)
                      this.props.navigation.navigate('BarDetails', { ...this.state.selectedBar})
                    }}
                    title="Bar Details"
                    titleStyle={
                      {fontSize: 12,
                      paddingLeft: 3}
                    }
                    icon={<Icon
                      name="info-circle"
                      type="font-awesome"
                      color="#fff"
                      size={12}
                    />} />
              </View>
              <View style={styles.cardRow}>
                <View style={styles.cardIconWrapper}>
                  <Icon
                    name="map-marker"
                    type="font-awesome"
                    color={colors.darkTxt}
                    size={16}
                  />
                </View>
                <Text numberOfLines={1} style={styles.cardText}>
                  {this.state.selectedBar.address}
                </Text>
              </View>

              {this.state.selectedBar.phone ? (
                <View style={styles.cardRow}>
                  <View style={styles.cardIconWrapper}>
                    <Icon
                      name="phone"
                      type="font-awesome"
                      color={colors.darkTxt}
                      size={16}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={styles.cardText}
                    onPress={() => {
                      Linking.openURL(`tel:${this.state.selectedBar.phone}`);
                    }}>
                    {this.state.selectedBar.phone}
                  </Text>
                </View>
              ) : null}

              {this.state.selectedBar.website ? (
                <View style={styles.cardRow}>
                  <View style={styles.cardIconWrapper}>
                    <Icon
                      name="globe"
                      type="font-awesome"
                      color={colors.darkTxt}
                      size={16}
                    />
                  </View>
                  <Text
                    numberOfLines={1}
                    style={styles.cardText}
                    onPress={() => Linking.openURL(this.state.selectedBar.website)}>
                    {this.state.selectedBar.website}
                  </Text>
                </View>
              ) : null}

              {this.state.selectedBar.teams ? (
                <View style={[styles.cardRow, styles.cardRowTeams]}>
                  <View style={styles.cardIconTeamWrapper}>
                    <Icon
                      name="flag"
                      type="font-awesome"
                      color={colors.darkTxt}
                      size={16}
                    />
                  </View>
                  <View style={styles.cardTeamsWrapper}>
                    {this.state.selectedBar.teams.map((team, i) => {
                      return (
                        <View key={i} style={styles.cardRow}>
                          <Image
                            style={styles.cardTeamLogo}
                            source={teamImages[team.teamId]}
                            resizeMode="contain"
                          />
                          {(team.teamId.includes('ncaaf') || team.teamId.includes('nfl')) ? (
                            <View>
                              <Icon
                                name="ios-american-football"
                                type="ionicon"
                                color={colors.secondary}
                                size={11}
                              />
                            </View>
                          ) : (
                            <View />
                          )}
                          {team.teamId.includes('ncaab') ? (
                            <View style={{position: 'absolute', top: 0, right: 0}}>
                              <Icon
                                name="ios-basketball"
                                type="ionicon"
                                color={colors.secondary}
                                size={11}
                              />
                            </View>
                          ) : (
                            <View />
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              ) : null}

              <View style={styles.cardButtonWrapper}>
                <TouchableOpacity
                  onPress={() => {
                    this.openMapForDirections(this.state.selectedBar.address);
                  }}>
                  <LinearGradient
                    colors={[colors.primary, colors.primaryDarker]}
                    style={[styles.cardButton, globalStyles.linearGradient]}
                    angle={45}
                    useAngle={true}>
                    <Icon
                      name="location-arrow"
                      type="font-awesome"
                      color={'#fff'}
                      size={12}
                    />
                    <Text style={styles.buttonText}>Get Directions</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            </FlingGestureHandler>
            </FlingGestureHandler>
        <Modal
          animationType="slide"
          transparent
          visible={this.state.helpModalVisible}>
          <View style={styles.modal}>
            <View style={styles.guideModalWrapper}>
              <Text style={styles.modalTitle}>Bar Finder Guide</Text>
              <View style={styles.guideRow}>
                <Icon
                  name="flag"
                  type="font-awesome"
                  color={colors.purple}
                  size={18}
                />
                <Text style={styles.guideText}>
                  Bars affiliated with your team. *Search the map, there may be
                  multiple for your team!
                </Text>
              </View>
              <View style={styles.guideRow}>
                <Icon
                  name="map-marker"
                  type="font-awesome"
                  color={colors.purple}
                  size={20}
                />
                <Text style={styles.guideText}>
                  Bars affiliated with other teams.
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  this.toggleHelpModalVisible();
                }}>
                <LinearGradient
                  colors={[colors.primary, colors.primaryDarker]}
                  style={[styles.modalButton, globalStyles.linearGradient]}
                  angle={45}
                  useAngle={true}>
                  <Text style={styles.buttonText}>Close</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <AddBar addBarModalVisible={this.state.addBarModalVisible} toggleAddBarModalVisible={this.state.toggleAddBarModalVisible} />
      </View>
    );
  }
}

const cardStyle = StyleSheet.create({
  card: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    padding: 15,
    shadowColor: colors.darkBg,
    shadowOffset: {width: 0.5, height: 1},
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 5,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    borderRadius: 10,
  },
});

const mapStateToProps = state => ({
    bars: state.bars,
    teams: state.favoriteTeams,
    location: state.location,
    auth: state.auth,
  });

const mapDispatchToProps = {
  getBarDetails
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BarFinder);
