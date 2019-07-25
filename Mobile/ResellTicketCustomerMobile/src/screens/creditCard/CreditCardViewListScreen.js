import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    AsyncStorage,
    FlatList
} from "react-native";
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { Text, ListItem, Left, Body, Right, Title } from "native-base";
import { Container, Header, Button, Content } from 'native-base';
import defaultIcons from "./Icons";
import Api from './../../service/Api';
import keyConstant from '../../constants/keyConstant';
import { Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import FlipCard from "react-native-flip-card";
import { Input, } from 'react-native-elements';
import Dialog from "react-native-dialog";
const BASE_SIZE = { width: 300, height: 190 };
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BG_IMAGE = require('../../../assets/images/empty-list.png');

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardViewListScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            creditCard: [],
            dialogVisible: false,
            creditCardId: null,
            isShowEmptyView: false
        }
        //this.deleteCreditCard = this.deleteCreditCard.bind(this);
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            this.getCreditCardListByCustomerId();
        });
        this.getCreditCardListByCustomerId();
    }

    async getCreditCardListByCustomerId() {
        var customerIdDefault = await AsyncStorage.getItem(keyConstant.STORAGE.ID);
        try {
            var creditCardResponse = await Api.get('api/credit-card?id=' + customerIdDefault);
            this.setState({
                creditCard: creditCardResponse.data
            });
            if (this.state.creditCard.length === 0) {
                this.setState({
                    isShowEmptyView: true
                });
            } else {
                this.setState({
                    isShowEmptyView: false
                });
            }
        } catch (error) {
            RNToasty.Error({
                title: 'Error on Load Credit Card Data',
            });
        }
    }

    async deleteCreditCard(id) {

        try {
            var creditCardResponse = await Api.put('api/credit-card?id=' + id);
            this.setState({
                dialogVisible: false
            });
            RNToasty.Success({
                title: 'Delete Credit Card successfully',
            });
            this.componentDidMount();
        } catch (error) {
            RNToasty.Error({
                title: 'Error Delete Credit Data',
            });
        }
    }

    async setDefaultCard(id, customerId) {

        try {
            var creditCardResponse = await Api.put('api/credit-card/set-default-card?Id=' + id + '&CustomerId=' + customerId);
            RNToasty.Success({
                title: 'Set Credit Card as default successfully',
            });
            this.componentDidMount();
        } catch (error) {
            RNToasty.Error({
                title: 'Error Set default Credit Data',
            });
        }
    }

    handleCancel = () => {
        this.setState({
            dialogVisible: false,
            creditCardId: null
        });
    }
    handleDelete = (id) => {

        this.setState({
            dialogVisible: true,
            creditCardId: id
        });
    }



    renderItem = ({ item }) => {
        const Icons = { ...defaultIcons };
        return (
            <ListItem style={{ marginLeft: 10 }} >

                <Body>
                    <Image style={[s.icon]}
                        source={Icons[item.brand]} />
                    {console.log("qa:", item.isdefault)}
                    <TouchableOpacity onPress={() => this.setDefaultCard(item.id, item.customerId)}>
                        <Text maxLength={10}>{item.last4DigitsHash} </Text></TouchableOpacity>
                    {item.isdefault === false ? <Button onPress={() => this.handleDelete(item.id)} style={[s.buton]} >
                        <Icon style={[s.smallIcon]} name="minus-circle-outline" type="material-community" color="#fff" />
                    </Button> : null}

                    {item.isdefault === true ? <Button style={[s.butonCheck]} >
                        <Icon name="check-circle-outline" type="material-community" color="#fff" />
                    </Button> : null}
                </Body>
            </ListItem>
        );

    };

    render() {
        const { creditCard, isLoading, creditCardId, isShowEmptyView } = this.state;
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
                            My Credit Card
                        </Title>
                    </Body>
                    <Right>
                        <Button onPress={() => this.props.navigation.navigate('CreditCardCreate')}>
                            <Icon name="plus-circle-outline" type="material-community" color="#fff" />
                        </Button>
                    </Right>
                </Header>
                {/* <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}> */}

                {isShowEmptyView ? <ImageBackground source={BG_IMAGE} style={s.bgImage} /> : null}
                {!isShowEmptyView ? <FlatList
                    data={creditCard}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.id}
                    stickyHeaderIndices={this.state.stickyHeaderIndices}
                /> : null}

                <Dialog.Container visible={this.state.dialogVisible}>
                    <Dialog.Title>Delete Credit card</Dialog.Title>
                    <Dialog.Description>
                        Do you want to delete this credit card?
                            </Dialog.Description>
                    <Dialog.Button label="Delete" onPress={() => this.deleteCreditCard(creditCardId)} />
                    <Dialog.Button label="Cancel" onPress={() => this.handleCancel()} />
                </Dialog.Container>
                {/* </Content> */}
            </Container>

        );
    }
}

const s = StyleSheet.create({
    bgImage: {
        flex: 1,
        top: 50,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT / 1.75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        margin: 10
    },
    cardFace: {},
    icon: {
        position: "absolute",
        top: -4,
        bottom: 10,
        right: 40,
        width: 70,
        height: 30,
        resizeMode: "contain",
    },
    buton: {
        position: "absolute",
        top: -4,
        textAlign: "center",
        right: 10,
        width: 30,
        height: 30,
        resizeMode: "cover",
    },
    butonCheck: {
        backgroundColor: "green",
        position: "absolute",
        top: -2,
        //textAlign: "center",
        right: 150,
        width: 25,
        height: 25,
        //resizeMode: "cover",
    },
    smallIcon: {

        position: "absolute",
        textAlign: "center",
        width: 28,
        height: 28
    },
    baseText: {
        color: "rgba(255, 255, 255, 0.8)",
        backgroundColor: "transparent",
    },
    placeholder: {
        color: "rgba(255, 255, 255, 0.5)",
    },
    brand: {
        fontSize: 16,
        position: "absolute",
        bottom: 40,
        left: 25,
        right: 100,
    },

});