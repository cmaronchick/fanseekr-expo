import React, { Fragment } from 'react'
import { View, Dimensions } from 'react-native'
import { Image, Text } from 'react-native-elements'

import globalStyles from '../../stylesheets/globalStyles'
import groupStyles from '../../stylesheets/groupStyles'

const GroupHeader = ({ selectedGroup}) => {
    const { name, bannerUrl } = selectedGroup
    return (
        <Fragment>
            <View>
                <Image
                source={{ uri: bannerUrl}}
                style={{ width: Dimensions.get('window').width - 20, height: 100, marginHorizontal: 5}} />
            </View>
            <View style={[globalStyles.teamHeaderStyle,
                groupStyles.groupRow,
                { textAlign: 'center', justifyContent: 'center', alignContent: 'center'}]}>
                <Text style={{ fontSize: 28, fontWeight: 'bold'}}>{name}</Text>
            </View>
        </Fragment>
    )
}

export default GroupHeader
