import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    profileWrapper: {
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
        padding: 8,
        paddingTop: 15,
        paddingBottom: 15,
        marginBottom: 25,
        width: '90%',
        borderRadius: 10,
        alignSelf: 'center',
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5
    },
    noFansContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        color: '#eee'
    },
    noFansText: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20
    },
    avatarSection: {
        alignItems: 'center',
        borderBottomColor: colors.grayLighter,
        borderBottomWidth: 1,
        marginRight: 10,
        marginLeft: 10,
        marginBottom: 10
    },
    tagLineWrapper: {
        marginTop: 10,
        marginBottom: 15
    },
    logoWrapper: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        margin: 15,
        height: 45,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    logo: {
        flex: 1,
        alignSelf: 'center',
        width: 45,
        height: 45
    },
    rowStyle: {
        flexDirection: 'row',
        padding: 5
    },
    labelStyle: {
        color: colors.darkTxt,
        fontSize: 14,
        fontWeight: '600',
        marginRight: 10
    },
    textStyle: {
        color: colors.darkTxt,
        fontSize: 14
    },
    buttonsWrapper: {
        marginTop: 20,
        flex: 1,
        flexDirection: 'row'
    },
    btnStyle: {
        borderRadius: 5,
        flex: 1,
        alignSelf: 'stretch',
        marginLeft: 5,
        marginRight: 5,
        justifyContent: 'center',

    }, btnTextStyle: {
        alignSelf: 'center',
        color: colors.lightTxt,
        fontSize: 14,
        fontWeight: '600',
        paddingTop: 10,
        paddingBottom: 10
    }
});
