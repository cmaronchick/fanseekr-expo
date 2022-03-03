import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    userRow: {
        backgroundColor: '#fff',
        padding: 15,
        borderBottomColor: colors.grayLighter,
        borderBottomWidth: 1
    },
    rowItemsWrapper: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    text: {
        fontSize: 16
    },
    iconNext: {
        alignSelf: 'flex-end'
    }
});
