import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import crashlytics from '@react-native-firebase/crashlytics'
import { GeoCollectionReference, GeoFirestore, } from 'geofirestore';
const db = firestore();
const geofirestore: GeoFirestore = new GeoFirestore(db);
const geocollection: GeoCollectionReference = geofirestore.collection('users2');

import {
    LOCATION_FETCH_SUCCESS,
    LOCATION_UPDATE_SUCCESS
} from './_types';
import citiesList from "../data/cities.json";

// export const getUserLocation = () => {
//     return dispatch => {
//         firestore().collection('users2').doc(auth().currentUser.uid).get().then(function (user) {
//             var locationId = user.data().location;
//             var _loc = citiesList.find(x => x.id == locationId);
//             dispatch({
//                 type: LOCATION_FETCH_SUCCESS,
//                 payload: { locationId: _loc.id, locationName: _loc.value, coordinates: _loc.coordinates }
//             });
//         })
//     };
// };

export const setUserLocationById = (locId, coords) => {
    return dispatch => {
        var _loc = citiesList.find(x => x.id == locId);
        var payload;

        var _coords;
        if (coords) {
            _coords = { latitude: coords.latitude, longitude: coords.longitude };
            payload = { locationId: _loc.id, locationName: _loc.value, coordinates: { latitude: coords.latitude, longitude: coords.longitude } }
        } else {
            _coords = { latitude: _loc.coordinates.latitude, longitude: _loc.coordinates.longitude };
            payload = { locationId: _loc.id, locationName: _loc.value, coordinates: _loc.coordinates }
        }

        geocollection.doc(auth().currentUser.uid).update({
            location: locId,
            coordinates: new firebase.firestore.GeoPoint(_coords.latitude, _coords.longitude)
        }).then(() => {
            dispatch({
                type: LOCATION_FETCH_SUCCESS,
                payload: payload
            });
        })
        .catch(getLocationError => {
            console.log(`getLocationError`, getLocationError)
            crashlytics().recordError(getLocationError, 'getLocationError')
        })
    };
}

export const updateLocation = (locationId, locationName, coordinates) => {
    return dispatch => {
        geocollection.doc(auth().currentUser.uid).update({
            location: locationId,
            coordinates: new firebase.firestore.GeoPoint(coordinates.latitude, coordinates.longitude)
        }).then(function () {
            dispatch({
                type: LOCATION_UPDATE_SUCCESS,
                payload: { locationId: locationId, locationName: locationName, coordinates: coordinates }
            });
        })
        .catch(updateLocationError => {

            crashlytics().recordError(updateLocationError, 'updateLocationError')
        })
    };
};