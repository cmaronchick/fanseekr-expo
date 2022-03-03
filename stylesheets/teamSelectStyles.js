import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    mainContainer: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: colors.lightBg
    },
    logoWrapper: {
        flex: 1,
        flexDirection: 'column',
        margin: 5,
        height: 100,
        padding: 15,
        opacity: 0.3,
        borderRadius: 10,
        backgroundColor: '#fff'
    },
    logo: {
        flex: 1,
        alignSelf: 'stretch',
        width: 50,
        height: 50
    },
    teamName: {
        textAlign: 'center',
        fontSize: 10,
        marginTop: 8
    },
    selectedTeam: {
        opacity: 1,
        shadowColor: '#000',
        shadowOffset: { width: .5, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 5
    }

});
