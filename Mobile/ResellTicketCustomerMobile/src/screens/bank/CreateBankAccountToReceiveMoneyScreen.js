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
export default class CreateBankAccountToReceiveMoneyScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            linkCreateAccount: '',
            isCallApi: true
        }
        this.createBankConnectAccount = this.createBankConnectAccount.bind(this);
    }


    async createBankConnectAccount(code) {
        try {
            const fileResult = await Api.put('api/customer/add-bank-connect-account?code=' + code);
            if (fileResult.status === 200) {
                RNToasty.Success({
                    title: 'Create Bank Account successfully',
                });
                this.setState({
                    isCallApi: false
                });
            } else {
                RNToasty.Error({
                    title: 'Create credit card Error',
                });
                this.setState({
                    isCallApi: true
                });
            }
            this.props.navigation.navigate('Me');
        } catch (error) {
            RNToasty.Error({
                title: 'Error on Creating Bank Account Card Data',
            });
            this.props.navigation.navigate('Me');
        } finally {
            this.setState({
                showLoading: false,
            });
        }
    }

    componentWillMount() {
        const someHTMLFile = 'https://connect.stripe.com/express/oauth/authorize?' +
            'redirect_uri=https://webhook.site/9381403c-2124-4c32-ba8e-cd9c435ec7e1&' +
            'client_id=' + BankConstant.STORAGE.CLIENTID + '&state={STATE_VALUE}';
        this.setState({
            linkCreateAccount: someHTMLFile,
        });

    }

    render() {

        const { linkCreateAccount, isCallApi } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <WebView
                    style={{ flex: 1 }}
                    onNavigationStateChange={(e) => {
                        if (e.url.includes(BankConstant.STORAGE.WEBSITE) && isCallApi) {
                            this.setState({
                                isCallApi: false
                            });
                            var receiveUrl = e.url;
                            var stringReceive = receiveUrl.split(BankConstant.STORAGE.WEBSITE);
                            var code = stringReceive[1].split('&')[0];
                            this.createBankConnectAccount(code);
                        }
                    }}
                    source={{ uri: linkCreateAccount }}
                    ref={(webView) => this.webView = webView}
                />
            </View>

        );
    }
}

const s = StyleSheet.create({

});