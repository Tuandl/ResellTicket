import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, AsyncStorage } from 'react-native';
import { Container, Text, Content, List, ListItem, Left, Right } from 'native-base';
import { Icon, Avatar } from 'react-native-elements';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import keyConstant from '../constants/keyConstant';
import Api from '../../src/service/Api';
import OneSignal from 'react-native-onesignal'; 
import NavigationService from '../service/NavigationService';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class MeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            isExistConnectAccount: false,
            deviceId: '',
        };
    }

    componentWillMount() {
        OneSignal.addEventListener('ids', this.onIds);
        OneSignal.configure()
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('ids', this.onIds);
    }

    onIds = (device) => {
        console.log('Device info: ', device);
        this.setState({
            deviceId: device.userId
        })
    }

    componentDidMount() {
        this.getUsename();
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            this.isExistedConnectAccount();
        });
        this.isExistedConnectAccount();
    }

    async getUsename() {
        var usernameDefault = await AsyncStorage.getItem(keyConstant.STORAGE.USERNAME);
        //var data = JSON.parse(usernameDefault);
        this.setState({
            username: usernameDefault
        })
    }

    async isExistedConnectAccount() {
        try {
            var response = await Api.get('api/customer/check-existed-connect-bank-account');
            if (response.status === 200) {
                this.setState({
                    isExistConnectAccount: false
                })
            } else {
                this.setState({
                    isExistConnectAccount: true
                })
            }

        } catch (error) {
            RNToasty.Error({
                title: 'Error on Load Connect Bank Account Data',
            });
        }
    }

    render() {
        const { navigate } = this.props.navigation;
        const { username, isExistConnectAccount } = this.state;
        return (
            <Container style={{ flex: 1 }}>
                <Content style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={styles.avatar}>
                        <Avatar />
                        <Text>{username}</Text>
                    </View>
                    <View style={styles.profile}>
                        <List>
                            {/* <TouchableNativeFeedback onPress={() => navigate('PostedTicket', { username: username })}>
                                <ListItem style={{ borderBottomWidth: 0.5 }}>
                                    <Left>
                                        <Text>Posted Ticket</Text>
                                    </Left>
                                    <Right style={{ opacity: 0.5 }}>
                                        <Icon name="chevron-right" type="font-awesome" size={15} />
                                    </Right>
                                </ListItem>
                            </TouchableNativeFeedback> */}
                            <TouchableNativeFeedback onPress={() => navigate('CreditCardViewList')}  >
                                <ListItem style={{ borderBottomWidth: 0.5 }}>
                                    <Left>
                                        <Text>Credit Card</Text>
                                    </Left>
                                    <Right style={{ opacity: 0.5 }}>
                                        <Icon name="chevron-right" type="font-awesome" size={15} />
                                    </Right>
                                </ListItem>
                            </TouchableNativeFeedback>

                            {isExistConnectAccount ? <TouchableNativeFeedback onPress={() => navigate('AccountConnectDetail')}  >
                                <ListItem style={{ borderBottomWidth: 0.5 }}>
                                    <Left>
                                        <Text>Bank Account</Text>
                                    </Left>
                                    <Right style={{ opacity: 0.5 }}>
                                        <Icon name="chevron-right" type="font-awesome" size={15} />
                                    </Right>
                                </ListItem>
                            </TouchableNativeFeedback> : <TouchableNativeFeedback onPress={() => navigate('CreateBankAccountToReceiveMoney')}  >
                                    <ListItem style={{ borderBottomWidth: 0.5 }}>
                                        <Left>
                                            <Text>Connect with Stripe</Text>
                                        </Left>
                                        <Right style={{ opacity: 0.5 }}>
                                            <Icon name="chevron-right" type="font-awesome" size={15} />
                                        </Right>
                                    </ListItem>
                                </TouchableNativeFeedback>}



                            <TouchableNativeFeedback onPress={() => navigate('TransactionViewList')}  >
                                <ListItem style={{ borderBottomWidth: 0.5 }}>
                                    <Left><Text>Transaction History</Text></Left>
                                    <Right style={{ opacity: 0.5 }}>
                                        <Icon name="chevron-right" type="font-awesome" size={15} />
                                    </Right>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={() => navigate('ProfileDetail')}>
                                <ListItem style={{ borderBottomWidth: 0.5 }}>
                                    <Left>
                                        <Text>Edit Profile</Text></Left>
                                    <Right style={{ opacity: 0.5 }}>
                                        <Icon name="chevron-right" type="font-awesome" size={15} />
                                    </Right>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={this.logout}>
                                <ListItem style={{ borderBottomWidth: 0.5 }}>
                                    <Text>Logout</Text>
                                </ListItem>
                            </TouchableNativeFeedback>
                        </List>
                    </View>
                </Content>
            </Container>
        );
    }

    logout = async () => {
        var {deviceId} = this.state;
        const res = await Api.put('api/customer/logout?deviceId=' + deviceId);
        if(res.status === 200) {
            //console.log(this.props.navigation)
            NavigationService.navigate('Login');
            AsyncStorage.clear();
        }
    }
}

const styles = StyleSheet.create({
    avatar: {
        flex: 1,
        backgroundColor: 'blue',
        height: height / 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profile: {
        flex: 3,
        paddingTop: 10
    }
})