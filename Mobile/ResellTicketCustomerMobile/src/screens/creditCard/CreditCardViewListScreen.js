import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    View,
    ImageBackground,
    Image,

    StyleSheet,
    Platform,
    AsyncStorage,
    FlatList
} from "react-native";
import { Text, ListItem, Left, Body, Right, Title } from "native-base";
import { Container, Header, Button, Content } from 'native-base';
import defaultIcons from "./Icons";
import Api from './../../service/Api';
import keyConstant from '../../constants/keyConstant';
import { Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import FlipCard from "react-native-flip-card";
import { Input, } from 'react-native-elements';
const BASE_SIZE = { width: 300, height: 190 };

/* eslint react/prop-types: 0 */ // https://github.com/yannickcr/eslint-plugin-react/issues/106
export default class CreditCardViewListScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            creditCard: []
        }
    }

    componentDidMount() {
        this.getCreditCardListByCustomerId();
    }

    async getCreditCardListByCustomerId() {
        var customerIdDefault = await AsyncStorage.getItem(keyConstant.STORAGE.ID);
        try {
            var creditCardResponse = await Api.get('api/credit-card?id=' + customerIdDefault);
            console.log('repone', creditCardResponse);
            this.setState({
                creditCard: creditCardResponse.data
            });
        } catch (error) {
            toastr.error('Error', 'Error on Load CreditData Data');
        }
    }

    async deleteCreditCard(id) {

        try {
            var creditCardResponse = await Api.put('api/credit-card?id=' + id);
            this.componentDidMount();
        } catch (error) {
            toastr.error('Error', 'Error Delete Credit Data');
        }
    }

    renderItem = ({ item }) => {
        const Icons = { ...defaultIcons };
        return (
            <ListItem style={{ marginLeft: 10 }}>
                <Body>
                    <Image style={[s.icon]}
                        source={Icons[item.brand]} />
                    <Text maxLength={10}>{item.name} - {item.nameOnCard}</Text>
                    <Button onPress={()=> this.deleteCreditCard(item.id)}  style={[s.buton]} >
                        <Icon style={[s.smallIcon]} name="minus-circle-outline" type="material-community" color="#fff" />
                    </Button>
                </Body>
            </ListItem>
        );

    };

    render() {
        const { creditCard, isLoading } = this.state;
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
                <FlatList
                    data={creditCard}
                    renderItem={this.renderItem}
                    keyExtractor={item => item.name}
                    stickyHeaderIndices={this.state.stickyHeaderIndices}
                />
                {/* </Content> */}
            </Container>

        );
    }
}

const s = StyleSheet.create({
    cardContainer: {
        margin: 10
    },
    cardFace: {},
    icon: {
        position: "absolute",
        top: -2,
        bottom: 10,
        right: 50,
        width: 70,
        height: 30,
        resizeMode: "contain",
    },
    buton: {
        position: "absolute",
        top: -2,
        textAlign: "center",
        right: 5,
        width: 30,
        height: 30,
        resizeMode: "cover",
    },
    smallIcon: {
        textAlign: "center"
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