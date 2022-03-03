import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    bubbleTextLeft: {
        color: colors.darkTxt,
        fontSize: 14
    },
    bubbleTextRight: {
        color: 'white',
        fontSize: 14
    },
    bubbleWrapperLeft: {
        backgroundColor: 'white',
        padding: 5,
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5
    },
    bubbleWrapperRight: {
        backgroundColor: colors.primary,
        padding: 5
    },
    bubbleContainerStyle: {
        marginBottom: 25
    },
    inputContainerStyle: {
        margin: 10, marginBottom: 15, borderRadius: 20, backgroundColor: 'white', borderTopWidth: 0, paddingLeft: 5, paddingTop: 3,
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5
    },
    sendContainerStyle: {
        marginTop: 0,
        borderTopWidth: 0,
        shadowColor: 'white',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0
    },
    blockedUserWrapper: {
        paddingRight: 15,
        paddingLeft: 15,
        paddingTop: 10,
        paddingBottom: 10
    },
    blockedUserText: {
        color: colors.gray
    }
});
