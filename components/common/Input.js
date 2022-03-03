import React, { Component } from 'react';
import { TextInput, View } from 'react-native';
import colors from '../../stylesheets/colors';

const Input = ({ value, onChangeText, placeholder, secureTextEntry, maxLength }) => {
    return (
        <View style={styles.container}>
            <TextInput
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                autoCorrect={false}
                value={value}
                onChangeText={onChangeText}
                maxLength={maxLength}
                style={styles.inputStyle}
                placeholderTextColor={colors.lightTxt}
            >
            </TextInput>
        </View>
    );
};

const styles = {
    container: {
        flex: 1,
        alignContent: 'stretch'
    },
    inputStyle: {
        fontSize: 18,
        padding: 0,
        color: colors.darkTxt
    }
};

export { Input };