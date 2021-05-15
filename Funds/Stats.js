import React from "react";
import {Button, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Stats() {


    return (
        <SafeAreaView style={styles.container}>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        width: 300,
        height: 48,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    }
});
