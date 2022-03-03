import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: colors.lightBg,
        color: '#eee'
    },
    welcomeWrapper: {
        position: 'absolute',
        top: 5,
        width: '100%'
    },
    floatingContentWrapper: {
        flexDirection: 'column',
        backgroundColor: 'white',
        padding: 10,
        width: '85%',
        borderRadius: 10,
        alignSelf: 'center',
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5
    },
    textStyle: {
        padding: 15,
        color: colors.darkTxt,
        fontSize: 14,
        textAlign: 'center'
    },
    iconWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        marginTop: 8
    },
    icon: {
        width: 30,
        height: 30,
        borderRadius: 50,
        marginRight: 6,
        marginLeft: 6,
        alignContent: 'center',
        justifyContent: 'center'
    },
    iconIG: {
        backgroundColor: '#293E6A',

    },
    iconTwitter: {
        backgroundColor: '#1da1f2',

    },
    iconFB: {
        backgroundColor: '#3b5998',

    },
    buttonWrapper: {
        marginTop: 25,
        marginBottom: 15
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
