import React from 'react'
import { View, TouchableWithoutFeedback } from 'react-native'
import { Icon, Text, Badge } from 'react-native-elements'
import colors from '../../stylesheets/colors'


const ActionButton = ({iconName, iconType, text, onPress, styles, badge}) => {
    // console.log(`badge`, badge)
    return (
        <TouchableWithoutFeedback onPress={onPress} style={styles.buttonsWrapper}>
            <View style={styles.btnStyle}>
                <View>
                <Icon
                containerStyle={styles.icon}
                size={30}
                name={iconName}
                type={iconType}
                color={colors.primary} />
                {badge && badge > 0 ? (
                    <Badge value={badge < 10 ? badge : "9+"}
                        status="error"
                        containerStyle={styles.badgeStyle} />
                ) : null}
                </View>
                <Text style={styles.textStyle}>{text}</Text>
                <Icon
                    containerStyle={styles.iconNext}
                    size={18}
                    name='chevron-right'
                    type='font-awesome'
                    color={colors.primary} />
            </View>
        </TouchableWithoutFeedback>
        )
                }

export default ActionButton
