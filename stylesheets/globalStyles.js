import { StyleSheet } from 'react-native';
import colors from '../stylesheets/colors';


export default StyleSheet.create({
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'black',
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: colors.lightBg
    },
    pageTitleStyle: {
        justifyContent: 'center',
        alignContent: 'center'
    },
    headerStyle: {
        backgroundColor: colors.darkBg,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        fontSize: 18,
        color: colors.lightTxt
    },
    headerLightStyle: {
        backgroundColor: 'white',
        borderBottomWidth: 0
    },
    headerTransparentStyle: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
    },
    headerTitleLightStyle: {
        fontSize: 18,
        color: colors.darkTxt
    },
    headerExtended: {
        backgroundColor: colors.darkBg,
        height: 65
    },
    headerExtendedWithTitle: {
        backgroundColor: colors.darkBg,
        height: 90
    },
    headerExtendedTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingLeft: 25,
        color: 'white'
    },
    teamHeaderStyle: {
        backgroundColor: '#fff',
        borderBottomWidth: 0,
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5,
        paddingBottom: 10
    },
    teamHeaderTitleStyle: {
        fontSize: 18,
        color: colors.darkTxt
    },
    headerRightButtonWrapper: {
        marginRight: 20, width: 60, height: 25
    },
    headerLeftButtonWrapper: {
        marginLeft: 15, width: 60, height: 25
    },
    hidden: {
        display: 'none'
    },
    linearGradient: {
        paddingHorizontal: 15,
        borderRadius: 5
    },
    testContainer: {
        borderWidth: 3,
        borderColor: '#000'
    }
});