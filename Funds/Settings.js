import React from "react";
import {Button, SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";

import {AuthContext} from "../context/context";

export default function Settings() {

    const {signOut} = React.useContext(AuthContext)

    async function clearToken() {
        AsyncStorage.removeItem('token')
        signOut()
    }

    return (
        <SafeAreaView style={styles.container}>
            <Button
                title={'Logout'}
                style={styles.input}
                onPress={clearToken}
            />
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
