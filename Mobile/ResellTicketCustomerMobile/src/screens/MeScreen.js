import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default class MeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <View style={{flex: 1,alignItems: 'center', justifyContent: 'center', backgroundColor: 'white'}}>
                    <Text>
                        My Profile Here!!!
                    </Text>
            </View>
        );
    }
}