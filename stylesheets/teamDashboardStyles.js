import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: colors.lightBg
    },
    avatarSection: {
        marginTop: 25,
        alignItems: 'center'
    },
    logoWrapper: {
        //overflow: 'hidden',
        borderRadius: 50,
        height: 100,
        flexDirection: 'column',
        backgroundColor: '#fff',
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
        padding: 20
    },
    logo: {
        flex: 1,
        alignSelf: 'center',
        width: 60,
        height: 60
    },
    nameSection: {
        marginTop: 15,
        marginBottom: 15,
        alignItems: 'center',
    },
    name: {
        fontSize: 25
    },
    scheduleSection: {
        marginTop: 10,
        marginBottom: 5,
        paddingLeft: 15,
        paddingRight: 15
    },
    scheduleTitle: {
        fontSize: 16,
        paddingLeft: 5,
        marginBottom: 10
    },
    gameWrapper: {
        flexDirection: 'row',
    },
    gameBox: {
        backgroundColor: '#fff',
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: .5 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 5,
        flex: 1 / 3,
        marginRight: 5,
        marginLeft: 5,
        padding: 15,
        borderRadius: 5
    },
    gameBoxIcon: {
        marginRight: 5
    },
    gameBoxText: {
        fontSize: 10
    },
    teamNavigation: {
        marginTop: 20,
        flexDirection: 'column'
    },
    buttonsWrapper: {
        alignContent: 'stretch'
    },
    btnStyle: {
        flexDirection: "row",
        marginBottom: 15,
        marginLeft: 20,
        marginRight: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
        height: 60
    },
    icon: {
        paddingLeft: 15,
        paddingTop: 15,
        paddingBottom: 15,
        alignSelf: 'center',
        width: 50
    },
    textStyle: {
        alignSelf: 'center',
        fontSize: 16,
        paddingLeft: 20
    },
    iconNext: {
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        alignSelf: 'center',
        marginLeft: 'auto'
    }
});