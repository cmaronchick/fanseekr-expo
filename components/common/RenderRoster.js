import React from 'react'
import { View, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { Text, Avatar, Icon } from 'react-native-elements'
import RenderTeam from './RenderTeam'

import colors from '../../stylesheets/colors'

const RenderRoster = ({user, roster, styles, goToUserProfile}) => {
    return (
            <FlatList
                data={roster}
                renderItem={({ item, index }) => {
                    return (
                    <TouchableOpacity
                        disabled={item.uid === user.userProfile.uid}
                        onPress={() => goToUserProfile(item)} key={index} style={styles.boxWrapper}>
                        <View style={[styles.box, item.uid === user.userProfile.uid ? styles.disabledRow : null]}>
                            {item.avatar ?
                                <Avatar size="small"
                                    source={{ uri: item.avatar }}
                                    rounded
                                />
                                :
                                <Avatar
                                    title={item.name ? item.name[0].toUpperCase() : ''}
                                    size="small"
                                    rounded
                                />
                            }
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.boxText} ellipsizeMode='tail'>{item.username} {item.uid === user.userProfile.uid && `(You)`}</Text>
                                <FlatList
                                    style={styles.teamsWrapper}
                                    data={item.teams}
                                    renderItem={({ item }) => (
                                        RenderTeam(item, styles)
                                    )}
                                    numColumns={6}
                                    keyExtractor={(item, index) => index}
                                />
                            </View>
                            {item.uid !== user.userProfile.uid && (
                                <Icon
                                    containerStyle={styles.iconNext}
                                    size={18}
                                    name='chevron-right'
                                    type='font-awesome'
                                    color={colors.darkTxt} />
                            )}
                        </View>
                    </TouchableOpacity>
                )}}
                numColumns={1}
                keyExtractor={(item, index) => `${index}`}
            />
    )
}

const styles = StyleSheet.create({
    disabledRow: {
        backgroundColor: colors.lightBg
    }
})

export default RenderRoster
