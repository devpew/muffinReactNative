import React, {useEffect, useState} from "react";
import {Text, View, SafeAreaView, Button, FlatList, ScrollView, StyleSheet, TouchableOpacity, TouchableHighlight, TextInput} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Moment from 'moment'
import {Picker} from "@react-native-picker/picker";
import { SwipeListView } from 'react-native-swipe-list-view';

export const Costs = props => {
    const [costsArray, setCostsArray] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState('')

    const [currentCost, setCurrentCost] = useState('')
    const [currentCategory, setCurrentCategory] = useState('Еда')
    const [currentSource, setCurrentSource] = useState('TINK')


    const renderItem = ({item}) => (
        <TouchableHighlight
            onPress={() => console.log('You touched me')}
            style={styles.rowFront}
            underlayColor={'#AAA'}
        >
        <View style={styles.costLineWrapper}>
            <Text style={styles.costAmount}>{item.amount}</Text>
            <Text style={styles.costSource}>{item.source}</Text>
            <Text style={styles.coseCategory}>{item.category}</Text>
            <Text style={styles.costDate}>{Moment(item.datetime).format('DD MMM YYYY')}</Text>
        </View>
        </TouchableHighlight>
    )

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...costsArray];
        const prevIndex = costsArray.findIndex(item => item.id === rowKey);
        newData.splice(prevIndex, 1);
        setCostsArray(newData);
        deleteCosts(rowKey)
    };

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.backRightBtn, styles.backRightBtnRight]}
                onPress={() => deleteRow(rowMap, data.item.id)}
            >
                <Text style={styles.backTextWhite}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    useEffect(() => {
        AsyncStorage.getItem('token').then((value) => {
            if (value) {
                setToken(value)
            }
        })
    }, [])

    useEffect(() => {
        if (token !== '') {
            getPosts()
        }
    }, [token])

    const getPosts = () => {
        setIsLoading(true)
        let URL = 'http://127.0.0.1:8000/costs'
        fetch(URL, {
            headers: {
                'Token': token
            }
        }).then(res => res.json()).then(res => {
            setCostsArray(res)
        }).finally(() => setIsLoading(false))
    }

    function deleteCosts(id) {
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Token': token
            },
            body: JSON.stringify({
                "id": id
            })
        }

        fetch('http://127.0.0.1:8000/costs/'+id, requestOptions).then((res) => {
            return res.json();
        }).then((res) => {
            getPosts()
            console.log('DELETE COSTS OK')
        }).catch(function(error) {
            console.log('delete costs error: ', error)
        })
    }

    function sendCosts() {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Token': token
            },
            body: JSON.stringify({
                "datetime": Moment(Date.now()).format(),
                "amount": Number(currentCost),
                "source": currentSource,
                "category": currentCategory
            })
        }

        fetch('http://127.0.0.1:8000/costs', requestOptions).then((res) => {
            return res.json();
        }).then((res) => {
            getPosts()
            setCurrentCost('')
            console.log("sendCosts OK")
        }).catch(function (error) {
            console.log('sendCosts POST ERROR: ', error)
        })
    }

    return (
        <SafeAreaView>
            <View style={styles.adderblock}>
                <TextInput
                    style={styles.bigtextinput}
                    onChangeText={text => setCurrentCost(text)}
                    keyboardType="numeric"
                    defaultValue={currentCost}
                />
                <Picker
                    selectedValue={currentCategory}
                    onValueChange={(itemValue, itemIndex) =>
                        setCurrentCategory(itemValue)
                    }>
                    <Picker.Item label="Еда" value="Еда" />
                    <Picker.Item label="Кафе" value="Кафе" />
                    <Picker.Item label="Развлечения" value="Развлечения" />
                    <Picker.Item label="Транспорт" value="Транспорт" />
                    <Picker.Item label="Коммуналка" value="Коммуналка" />
                    <Picker.Item label="Экстренные ситуации" value="Экстренные ситуации" />
                    <Picker.Item label="Одежда" value="Одежда" />
                    <Picker.Item label="Аптека" value="Аптека" />
                    <Picker.Item label="Other" value="Other" />
                    <Picker.Item label="Телефон" value="Телефон" />
                    <Picker.Item label="Интернет" value="Интернет" />
                    <Picker.Item label="Электроника" value="Электроника" />
                    <Picker.Item label="Налоги" value="Налоги" />
                    <Picker.Item label="Подписки в интернете" value="Подписки в интернете" />
                </Picker>
                <View style={styles.bigbuttonwrapper}>
                    <Button
                        title={'Add'}
                        style={styles.input}
                        onPress={sendCosts}
                    />
                </View>
            </View>
            <SwipeListView
                data={costsArray}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                onRefresh={getPosts}
                refreshing={isLoading}
                renderHiddenItem={renderHiddenItem}
                //leftOpenValue={75}
                rightOpenValue={-75}
                //previewRowKey={'0'}
                //previewOpenValue={-40}
                //previewOpenDelay={3000}
                //onRowDidOpen={onRowDidOpen}
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
    },
    costLineWrapper: {
        height: 50,
        flex: 1,
        flexDirection: 'row',
    },
    costAmount: {
        height: 50,
        lineHeight: 50,
        flex: 2,
        paddingLeft: 20,
    },
    costSource: {
        height: 50,
        lineHeight: 50,
        flex: 2,
    },
    coseCategory: {
        height: 50,
        lineHeight: 50,
        flex: 4,
    },
    costDate: {
        height: 50,
        lineHeight: 50,
        flex: 3,
        paddingRight: 20,
    },
    adderblock: {
      paddingTop: 55,
    },
    bigtextinput: {
      fontSize: 20,
      borderWidth: 1,
      borderColor: 'grey',
      height: 50,
      width: 300,
      textAlign: 'center',
      alignSelf: 'center',
    },
    bigbuttonwrapper: {
        paddingBottom: 15
    },
    backTextWhite: {
        color: '#FFF',
    },
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 15,
    },
    backRightBtn: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    backRightBtnLeft: {
        backgroundColor: 'blue',
        right: 75,
    },
    backRightBtnRight: {
        backgroundColor: 'red',
        right: 0,
    },
});
