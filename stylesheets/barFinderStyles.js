import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    loadingContainer: {
        flex: 1
    },
    container: {
        flex: 1
    },
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 2,
        paddingBottom: 2,
        marginVertical: 3
    },
    cardIconWrapper: {
        alignItems: 'center', marginRight: 7
    },
    cardIconTeamWrapper: {
        position: 'relative', top: 4,
        width: 20, height: 20, alignItems: 'center', marginRight: 7
    },
    cardtitle: {
        fontSize: 16,
        marginTop: 2,
        marginBottom: 6,
        fontWeight: "bold",
        color: colors.darkTxt
    },
    cardText: {
        fontSize: 14,
        color: colors.darkTxt
    },
    cardRowTeams: {
        marginBottom: 15
    },
    cardTeamsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cardTeamLogo: {
        width: 25,
        height: 25,
        marginTop: 2,
        marginBottom: 2,
        marginRight: 2
    },
    cardButtonWrapper: {
        margin: 5
    },
    cardButton: {
        height: 30,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        color: '#fff',
        flexDirection: 'row'
    },
    modal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalWrapper: {
        backgroundColor: '#fff',
        width: 320,
        height: 195,
        borderRadius: 5,
        padding: 17
    },
    guideModalWrapper: {
        backgroundColor: '#fff',
        width: 300,
        height: 220,
        borderRadius: 5,
        padding: 17
    },
    modalTitle: {
        fontSize: 16,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    modalText: {
        marginBottom: 13
    },
    modalButton: {
        margin: 3,
        height: 30,
        width: '100%',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        fontSize: 14,
        color: '#fff'
    },
    guideRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    guideText: {
        fontSize: 14,
        paddingRight: 20,
        paddingLeft: 15
    },
    buttonText: {
        color: '#fff',
        marginLeft: 8
    },
    markerWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        width: 20,
        height: 20,
        borderRadius: 50,
        backgroundColor: "rgba(130,4,150, 0.9)",
    },
    ring: {
        width: 45,
        height: 45,
        borderRadius: 50,
        backgroundColor: "rgba(130,4,150, 0.3)"
    },
    watchPartyModalWrapper: {
        backgroundColor: '#fff',
        width: 400,
        height: 250,
        borderRadius: 5,
        padding: 17
    },
    watchPartyAttendButton: {
        padding: 8,
        width: '100%',
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: colors.secondary,
        position: 'relative',
        bottom: 5
    },
    watchPartyUnattendButton: {
        padding: 8,
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: colors.red,
        position: 'relative',
        bottom: 5
    },
    watchPartyButtonText: {
        fontSize: 12,
        color: '#fff',
    },
    barDetailsInput: {
        width: '100%'
    },
    headerRightButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    addBarButton: {
        position: 'absolute',
        top: 0
    }
});
