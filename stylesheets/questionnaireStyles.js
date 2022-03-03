import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    questionnaireWrapper: {
        position: 'absolute',
        top: 5,
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%'
    },
    floatingContentWrapper: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 25,
        width: '85%',
        borderRadius: 10,
        alignSelf: 'center',
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5
    },
    sectionTitleStyle: {
        color: colors.darkTxt,
        fontSize: 14,
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    sectionStyle: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 10
    },
    avatarSection: {
        alignItems: 'center'
    },
    inputStyle: {
        height: 40,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 5,
        backgroundColor: colors.grayLighter
    },
    buttonWrapper: {
        marginTop: 15,
        marginBottom: 15,
        marginLeft: 10,
        marginRight: 10
    },
    button: {
        height: 40,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14
    },
    buttonText: {
        color: '#fff'
    }
});
