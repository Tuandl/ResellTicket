import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    StyleSheet,
    Platform,
    AsyncStorage,
    FlatList,
    WebView
} from "react-native";
//import { WebView } from 'react-native-webview';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { Text, ListItem, Left, Body, Right, Title } from "native-base";
import { Container, Header, Button, Content } from 'native-base';
import Api from '../../service/Api';
import BankConstant from '../../constants/BankConstant';
import StripeConstant from '../../constants/StripeConstant';
import { Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import FlipCard from "react-native-flip-card";
import { Input, } from 'react-native-elements';
const BASE_SIZE = { width: 300, height: 190 };

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class AccountConnectDetailScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            linkCreateAccount: '',
        }
    }


    async getLinkViewConnectAccount() {

        try {
            const fileResult = await Api.get('api/customer/view-connect-account');
            console.log("response", fileResult);
            if (fileResult.status === 200) {
                RNToasty.Success({
                    title: 'Load Bank Account successfully',
                });
                this.setState({
                    linkCreateAccount: fileResult.data
                });
            } else {
                RNToasty.Error({
                    title: 'Load credit card Error',
                });
                this.setState({
                    isCallApi: true
                });
            }
            //this.props.navigation.navigate('Me');
        } catch (error) {
            RNToasty.Error({
                title: 'Error on Loading Bank Account Data',
            });

        } finally {
            this.setState({
                showLoading: false,
            });
        }
    }

    componentWillMount() {

        this.getLinkViewConnectAccount();
    }

    render() {

        const { linkCreateAccount } = this.state;

        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button
                            onPress={() => this.props.navigation.navigate('Me')}>
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>
                            Connect Account
                        </Title>
                    </Body>
                    <Right />
                </Header>
                <View style={{ flex: 1 }}>
                    <WebView
                        style={{ flex: 1 }}
                        onNavigationStateChange={(e) => {
                            

                        }}
                        source={{ uri: linkCreateAccount }}
                        ref={(webView) => this.webView = webView}
                    />
                </View>
            </Container>


        );
    }

}
const s = StyleSheet.create({

});