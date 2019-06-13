import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text, Card } from 'native-base';
import CardView from 'react-native-cardview';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class TicketViewComponent extends Component {

    onPress = () => {

    }

    render() {
        return (
            <TouchableOpacity>
                <View style={styles.wrapper}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: 'lightgrey' }}>
                        <Text style={{ fontSize: 20 }}>2.000.000 VND</Text>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'row' }}>
                        <View style={styles.alignCenter}>
                            <Text>Tickets: 3</Text>
                            <Text>From</Text>
                            <Text>8/6/2019 12:00</Text>
                        </View>
                        <View style={styles.alignCenter}>
                            <Text>5 Hours left</Text>
                            <Text>To</Text>
                            <Text>8/6/2019 13:00</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        height: height / 4,
        width: width / 1.2,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderTopWidth: 0.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'grey',
        margin: 10,
    },
    ticketHeader: {
        height: height / 25,
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey',
    },
    alignCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})