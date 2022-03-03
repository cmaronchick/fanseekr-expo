import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: colors.lightBg
    },
    sectionHeader: {
        fontWeight: "bold",
        padding: 10
    },
    sectionWrapper: {
        backgroundColor: '#fff',
        padding: 15,
        borderTopColor: colors.grayLighter,
        borderTopWidth: 1,
        borderBottomColor: colors.grayLighter,
        borderBottomWidth: 1
    },
    cardRow: {
        paddingTop: 3,
        paddingBottom: 3,
        flexDirection: 'row'
    },
    cardColumn: {
        paddingTop: 3,
        paddingBottom: 3,
        flexDirection: 'column'
    },
    cardIconWrapper: {
        width: 20, height: 20, alignItems: 'center', marginRight: 7
    },
    partyCard: {
        marginBottom: 20, paddingBottom: 30, borderBottomColor: colors.grayLighter, borderBottomWidth: 1
    },
    watchPartyAttendButton: {
        height: 25,
        padding: 5,
        width: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: colors.secondary,
        position: 'relative',
        bottom: 5
    },
    watchPartyUnattendButton: {
        height: 25,
        padding: 5,
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: colors.red,
        position: 'relative',
        bottom: 5
    },
    watchPartyButtonText: {
        fontSize: 12,
        color: '#fff',
    }
});
