import React, { Component } from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import ReduxThunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import { composeWithDevTools } from 'remote-redux-devtools';

import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging'
import reducers from './reducers';
import { AppContainer } from './Router';
import NavigationService from './NavigationService';
import { _retrieveLocalItem, _storeLocalItem } from './helpers/asyncStorage'
// const notifications = firebase.notifications();




class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.createNotificationListeners();
  }
  notificationOpenedListener = messaging().onNotificationOpenedApp((notificationOpen) => {
    notifications.setBadge(badgeCount - 1);
    NavigationService.navigate("MyMessages");
  });

  componentWillUnmount() {
    this.notificationListener();
    this.notificationOpenedListener();
  }
  
  async createNotificationListeners() {
    try {
      this.notificationListener = messaging().onNotificationOpenedApp(async (notif) => {
        if (AppState.currentState === 'background' || AppState.currentState === 'inactive') {
          const badgeCount = await notifications.getBadge();
          notif.android.setChannelId('app-infos');
          messaging().displayNotification(notif);
          notifications.setBadge(badgeCount + 1);
        }
      });

      /*
      * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
      * */
      this.notificationOpenedListener = messaging().onNotificationOpened((notificationOpen) => {
        notifications.setBadge(badgeCount - 1);
        NavigationService.navigate("MyMessages");
      });

      /*
      * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
      * */
      //const notificationOpen = await firebase.notifications().getInitialNotification();
      //if (notificationOpen) {
      //const { title, body } = notificationOpen.notification;
      //}

      /*
      * Triggered for data only payload in foreground
      * */
      //this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      // console.log(JSON.stringify(message));
      //});
    } catch (createNotificationsError) {
      console.log('createNotificationsError', createNotificationsError);
    }

  }

  render() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const store = createStore(reducers, {}, composeEnhancers(applyMiddleware(ReduxThunk)));

    return (
      <Provider store={store}>
        <AppContainer ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }} />
      </Provider>
    );
  }
}
export default App;
