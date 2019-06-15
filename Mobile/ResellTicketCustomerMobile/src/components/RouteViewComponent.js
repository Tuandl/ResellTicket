import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text, Card} from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class RouteViewComponent extends Component {

    onPress = () => {
    }

    render() {
        return (
            <TouchableOpacity onPress={this.onPress}>
                <Card style={styles.wrapper}>
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
                </Card>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        height: height / 4,
        width: width / 1.2,
        backgroundColor: "#fff",
        margin: 10,
        borderRadius: 10,
        borderColor: 'blue',
        borderWidth: 10,
    },
    alignCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})