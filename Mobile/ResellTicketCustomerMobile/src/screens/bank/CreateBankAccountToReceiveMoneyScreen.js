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
    WebView,
    ActivityIndicator
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
            isCallApi: true,
            isLoading: false
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
                    isCallApi: true,
                    isLoading: false
                });
            }
            //this.props.navigation.navigate('Me');
            this.props.navigation.pop()
        } catch (error) {
            RNToasty.Error({
                title: 'Error on Creating Bank Account Card Data',
            });
            //this.props.navigation.navigate('Me');
            this.props.navigation.pop();
        } finally {
            this.setState({
                showLoading: false,
            });
        }
    }

    componentWillMount() {
        const someHTMLFile = 'https://connect.stripe.com/express/oauth/authorize?' +
            'redirect_uri=' + BankConstant.STORAGE.URLREDIRECT +
            '&client_id=' + BankConstant.STORAGE.CLIENTID + '&state={STATE_VALUE}';
        this.setState({
            linkCreateAccount: someHTMLFile,
        });
    }


    render() {

        const { linkCreateAccount, isCallApi, isLoading } = this.state;

        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button 
                            transparent
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
                {isLoading ? <ActivityIndicator size="large" animating /> :
                    <View style={{ flex: 1 }}>

                        <WebView
                            style={{ flex: 1 }}
                            onNavigationStateChange={(e) => {
                                if (e.url.includes(BankConstant.STORAGE.PREXITRETURRN) && isCallApi) {
                                    this.setState({
                                        isCallApi: false,
                                        isLoading: true
                                    });
                                    var receiveUrl = e.url;
                                    var stringReceive = receiveUrl.split(BankConstant.STORAGE.PREXITRETURRN);
                                    var code = stringReceive[1].split('&')[0];
                                    this.createBankConnectAccount(code);
                                }
                            }}
                            source={{ uri: linkCreateAccount }}
                            ref={(webView) => this.webView = webView}
                        />
                    </View>
                }
            </Container>
        );
    }
}

const s = StyleSheet.create({

});