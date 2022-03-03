import { 
    Animated,
    View } from 'react-native'
import React from 'react';
import MapView from 'react-native-maps';
import fanSeekrIcon from '../../constants/images/logos/180.png'
import styles from '../../stylesheets/barFinderStyles';
import { Icon, Image } from 'react-native-elements'
import colors from '../../stylesheets/colors';

const BarMap = (props) => {
    console.log('props', props);
    const { region, _map, markers, selectedBar, regionChanged, markerClick } = props
  return (region && markers && regionChanged && markerClick) ? (
    <MapView
        initialRegion={region}
        style={styles.container}
        onRegionChangeComplete={e => regionChanged(e)}>
        {markers.map((marker, index) => {
            const opacityStyle = {
                opacity: selectedBar.barId == marker.barId ? 1 : 0.5,
                width: 45,
                height: 45,
                borderRadius: 50,
                backgroundColor:
                selectedBar.barId == marker.barId
                    ? 'rgba(185, 232, 183, 0.7)'
                    : 'transparent',
            };
        if (marker.isFavTeam === true) {
            return (
            <MapView.Marker
                key={`favTeam${index}`}
                coordinate={{
                latitude: marker.coordinates.latitude,
                longitude: marker.coordinates.longitude,
                }}
                onPress={() => {
                markerClick(index);
                }}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                <Image source={fanSeekrIcon} style={{height: 50, width: 50}} />

                </Animated.View>
            </MapView.Marker>
            );
        } else {
            return (
            <MapView.Marker
                key={index}
                coordinate={{
                latitude: marker.coordinates.latitude,
                longitude: marker.coordinates.longitude,
                }}
                onPress={() => {
                    markerClick(index);
                }}>
                <Animated.View style={[styles.markerWrap, opacityStyle]}>
                <Icon
                    name="map-marker"
                    type="font-awesome"
                    color={colors.purple}
                    size={28}
                />
                </Animated.View>
            </MapView.Marker>
            );
        }
        })}
    </MapView>
  ) : (<View></View>);
}

export default BarMap