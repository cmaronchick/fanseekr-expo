import { StyleSheet, Dimensions } from 'react-native';
import colors from '../stylesheets/colors';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        paddingTop: 20
    },
    logoWrapper: {
        marginBottom: 5
    },
    titleStyle: {
        fontWeight: 'bold',
        color: colors.darkTxt,
        paddingLeft: 15,
        marginBottom: 10,
        marginLeft: 10,
        marginRight: 10
    },
    sectionWrapper: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5
    },
    sectionContentStyle: {
        padding: 5,
        justifyContent: 'center',
        flexDirection: 'row',
        position: 'relative'
    },
    inputWrapperStyle: {
        paddingLeft: 0, paddingRight: 0, paddingBottom: 7, paddingTop: 12,
        marginLeft: 10, marginRight: 10, marginBottom: 10, borderBottomColor: colors.lightTxt,
        borderBottomWidth: 1
    },
    labelStyle: {
        color: colors.gray,
        paddingLeft: 10
    },
    errorTextStyle: {
        fontSize: 18,
        color: 'red'
    },
    signUpWrapper: {
        position: 'absolute',
        bottom: 45,
        alignSelf: 'center',
        flexDirection: 'row'
    },
    termsWrapper: {
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 5
    },
    sectionTermsStyle: {
        flex: 1,
        flexWrap: 'wrap'
    },
    linkStyle: {
        fontWeight: "bold",
        borderBottomWidth: 1,
        borderBottomColor: "#000"
    },
    errorWrapper: {
        alignSelf: 'center'
    },
    resetPasswordWrapper: {
        marginTop: 10
    },
    resetPasswordLink: {
        fontSize: 14,
        color: colors.gray,
        textAlign: 'center'
    },
    inputLabelWrapper: {
        width: width
    },
    btnWrapper: {
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
        marginLeft: 10,
        marginRight: 10,
        alignSelf: 'stretch'
    },
    btnStyle: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    btnTextStyle: {
        color: colors.lightTxt,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 15
    }
});
