import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    settingsWrapper: {
        position: 'absolute',
        top: 10,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%'
    },
    floatingContentWrapper: {
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingLeft: 15, paddingRight: 15, paddingTop: 5,
        marginBottom: 25,
        width: '85%',
        borderRadius: 10,
        alignSelf: 'center',
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
    },
    settingsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayLighter
    },
    text: {
        marginLeft: 10
    },
    settingsText: {
        marginRight: 15
    },
    versionWrapper: {
        alignItems: 'center'
    }
});
