import { StyleSheet } from 'react-native'
import colors from './colors'

const rosterStyles = StyleSheet.create({
    rosterWrapper: {
        backgroundColor: colors.backgroundColor,
    },
    boxWrapper: {
        padding: 2
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 8,
        borderRadius: 5,
        backgroundColor: '#fff',
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 5
    },
    boxText: {
        marginLeft: 12
    },
    teamsWrapper: {
        alignSelf: 'flex-start',
        marginLeft: 8
    },
    logoWrapper: {
        alignItems: 'flex-start',
        height: 20,
        marginTop: 2,
        padding: 2,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    logo: {
        flex: 1,
        alignSelf: 'flex-start',
        width: 17,
        height: 17
    },
    iconNext: {
        marginLeft: 'auto',
        paddingRight: 5
    }
})

export default rosterStyles