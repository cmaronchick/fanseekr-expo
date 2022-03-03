import {
    LOCATION_FETCH_SUCCESS,
    LOCATION_UPDATE_SUCCESS
} from "../actions/_types";

const INITIAL_STATE = {
    currentLocation: 'DEN',
    currentLocationName: 'Rocky Mountains',
    currentLocationCoordinates: {
        latitude: 39.753668,
        longitude: -104.994747
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case LOCATION_FETCH_SUCCESS:
            return {
                currentLocation: action.payload.locationId,
                currentLocationName: action.payload.locationName,
                currentLocationCoordinates: action.payload.coordinates
            }
        case LOCATION_UPDATE_SUCCESS:
            return {
                currentLocation: action.payload.locationId,
                currentLocationName: action.payload.locationName,
                currentLocationCoordinates: action.payload.coordinates
            }
        default:
            return state;
    }
};
