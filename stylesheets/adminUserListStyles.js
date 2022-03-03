import { StyleSheet } from 'react-native';
import colors from './colors';

export default StyleSheet.create({
    userRow: {
        flexDirection: "row",
        backgroundColor: '#fff',
        padding: 15,
        justifyContent: "space-between",
        borderBottomColor: colors.grayLighter,
        borderBottomWidth: 1
    },
    rowItemsWrapper: {
        alignSelf: 'flex-end'
    },
    count: {
        fontSize: 10,
        textAlign: 'right'
    }
});
