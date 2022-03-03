import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    homeContentWrapper: {
        position: 'absolute',
        top: 15,
        width: '100%'
    },
    profileWrapper: {
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
    locationSection: {
        width: "100%",
        marginTop: 5,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationLabel: {
        height: 45,
        marginLeft: 15,
        paddingTop: 15
    },
    logoWrapper: {
        flex: 1,
        maxWidth: '30%',
        justifyContent:'space-around',
        flexDirection: 'column',
        margin: 5,
        height: 100,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5
    },
    logo: {
        flex: 1,
        alignSelf: 'center',
        width: 60,
        height: 60
    },
    avatarSection: {
        marginTop: 15,
        alignItems: 'center',
    },
    teamsSection: {
        marginTop: 20,
        marginRight: 15,
        marginLeft: 15
    },
    nameSection: {
        marginTop: 15,
        marginBottom: 8,
        alignItems: 'center',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 24
    },
    taglineSection: {
        marginBottom: 20,
        alignItems: 'center'
    },
    tagline: {
        fontSize: 14
    },
    buttonsSection: {
        flexDirection: 'row'
    },
    buttonsWrapper: {
        flex: 1,
        height: 27,
        marginBottom: 15
    },
    btnStyle: {
        borderRadius: 5,
        flex: 1,
        alignSelf: 'stretch',
        marginLeft: 5,
        marginRight: 5
    },
    btnTextStyle: {
        alignSelf: 'center',
        color: colors.lightTxt,
        fontSize: 14,
        fontWeight: '600',
        paddingTop: 5,
        paddingBottom: 7
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
    },
    modalWrapper: {
        height: "100%",
        borderRadius: 5,
        paddingVertical: 45
    },
    modalHeader: {
        paddingHorizontal: 15,
        flexDirection: 'row',
        marginVertical: 10
    },
    locationRowWrapper: {
        padding: 15,
        borderBottomColor: colors.grayLighter,
        borderBottomWidth: 1
    }
});