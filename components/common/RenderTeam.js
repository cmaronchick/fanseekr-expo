import React from 'react'
import { View } from 'react-native'
import { Image } from 'react-native-elements'

import teamImages from '../../constants/images/teamImages'


const RenderTeam = (team, styles) => {
    return (
        <View style={styles.logoWrapper}>
            <Image style={styles.logo} source={teamImages[team]} resizeMode="contain" />
        </View>
    );
}

export default RenderTeam
