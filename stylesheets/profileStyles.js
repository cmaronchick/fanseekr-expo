import { StyleSheet } from 'react-native';
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
    avatarSection: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    tagLineWrapper: {
        marginTop: 10
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
    buttonsSection: {
        flexDirection: 'row',
        height: 50
    },
    buttonsWrapper: {
        flex: 1,
        marginBottom: 15
    },
    btnStyle: {
        borderRadius: 5,
        flex: 1,
        alignSelf: 'stretch',
        marginLeft: 5,
        marginRight: 5
    },
    altBtnStyle: {
        borderRadius: 5,
        flex: 1,
        alignSelf: 'stretch',
        borderColor: colors.primary,
        borderWidth: 1,
        backgroundColor: '#fff',
        marginLeft: 5,
        marginRight: 5
    },
    btnTextStyle: {
        alignSelf: 'center',
        color: colors.lightTxt,
        fontSize: 14,
        fontWeight: '600',
        paddingTop: 7,
        paddingBottom: 7
    },
    altBtnTextStyle: {
        alignSelf: 'center',
        color: colors.primary,
        fontSize: 14,
        fontWeight: '600',
        paddingTop: 7,
        paddingBottom: 7
    },
    closeBtnStyle: {
        height: 30,
        borderColor: colors.primary,
        borderRadius: 5,
        alignSelf: 'stretch',
        borderWidth: 1,
        backgroundColor: '#fff',
        marginLeft: 5,
        marginRight: 5
    },
    modalWrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    mainModalContent: {
        height: 140,
        width: '90%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 20,
    },
    reportModalContent: {
        height: 140,
        width: '90%',
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 20,
    }
});
