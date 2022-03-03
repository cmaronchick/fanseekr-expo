import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import globalStyles from '../../stylesheets/globalStyles';
import colors from '../../stylesheets/colors';

const Button = ({ onPressHandler, children, isSelected }) => {
    const { buttonStyle, textStyle, textStyleSelected } = styles;

    if (isSelected == null) {
        isSelected = true;
    }

    if (isSelected) {
        return (
            <TouchableOpacity onPress={onPressHandler} style={buttonStyle}>
                <LinearGradient colors={[colors.primary, colors.primaryDarker]} style={globalStyles.linearGradient}
                    angle={45} useAngle={true}>
                    <Text style={textStyleSelected}>
                        {children}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableOpacity onPress={onPressHandler} style={buttonStyle}>
                <LinearGradient colors={["#EEE", "#EEE"]} style={globalStyles.linearGradient}
                    angle={45} useAngle={true} >
                    <Text style={textStyle}>
                        {children}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }


};

const styles = {
    textStyleSelected: {
        alignSelf: 'center',
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },
    textStyle: {
        alignSelf: 'center',
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    },
    buttonStyle: {
        borderRadius: 5,
        flex: 1,
        backgroundColor: colors.primary,
        marginLeft: 5,
        marginRight: 5
    }
}
export { Button };
