import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    modal: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        padding: 20
    },
    mainContainer: {
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignContent: 'center'
    },
    sectionStyle: {
        marginVertical: 5
    },
    groupRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignContent: 'center',
        borderBottomColor: colors.darkBg,
        borderBottomWidth: 2,
        marginVertical: 2
    },
    groupText: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        flex: 1
    },
    buttonsWrapper: {
        marginHorizontal: 20, 
        marginVertical: 10,
    },
    btnStyle: {
        shadowColor: colors.darkBg,
        shadowOffset: { width: .5, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        paddingHorizontal: 20, 
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    textStyle: {
        fontSize: 24
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    boxText: {
        color: '#000'
    }


})