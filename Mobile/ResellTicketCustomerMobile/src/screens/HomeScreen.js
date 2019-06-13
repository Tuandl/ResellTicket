import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, Text } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../../assets/images/bg_screen1.jpg');
import AppNavigation from './../navigation/AppNavigation';
//import { createStackNavigator } from 'react-navigation';
//import PostedTicketScreen from "./postedTicket/PostedTicketScreen";

// const navigation = createStackNavigator({
//     Tabbar: {
//         screen: AppNavigation
//     },
//     PostedTicket: {
//         screen: PostedTicketScreen
//     }
// })

export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    } 

    render() {
        //const name = this.props.navigation.getParam('username')
        return (
            <AppNavigation screenProps={{username: 'huy0933'}}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImage: {
        flex: 1,
        top: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginView: {
        marginTop: SCREEN_HEIGHT / 6,
        backgroundColor: 'transparent',
        width: 250,
        height: 400,
    },
    loginTitle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    travelText: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'bold',
    },
    plusText: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'regular',
    },
    loginInput: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerView: {
        marginTop: 5,
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
