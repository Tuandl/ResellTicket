import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    AsyncStorage
} from 'react-native';
import { Container, Button, Header, Body, Title, Left, Right } from 'native-base';
import { Input, Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import Api from '../../service/Api';
import keyConstant from '../../constants/keyConstant';
import StripeConstant from '../../constants/StripeConstant';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import Stripe from 'react-native-stripe-api';

//var StripeNative = require('react-native-stripe');

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


export default class CreditCardCreateScreen extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
            cardId: '',
            name_valid: true,
            nameOnCard: '',
            nameOnCard_valid: '',
            postalCode: '',
            postalCode_valid: '',
            cvc: '',
            cvc_valid: '',
            last4DigitsHash: '',
            last4DigitsHash_valid: '',
            expiredYearHash: '',
            expiredYearHash_valid: '',
            expiredMonthHash: '',
            expiredMonthHash_valid: '',
            customerId: 1,
            brand: '',
            isCreate: false,
            showLoading: false,
        }


        this.createCreditCard = this.createCreditCard.bind(this);
    }


    _onChange = formData => {
        /* eslint no-console: 0 */
        // console.log("du lieu", formData.status.cvc === "incincomplete");
        if (formData.status.number === "valid") {
            this.setState({
                last4DigitsHash: formData.values.number,
                last4DigitsHash_valid: formData.status.number,
                brand: formData.values.type,
            })
        }
        if (formData.status.expiry === "valid") {
            var array = formData.values.expiry.split("/");
            this.setState({
                expiredYearHash: array[1],
                expiredYearHash_valid: formData.status.expiry,
                expiredMonthHash: array[0],
                expiredMonthHash_valid: formData.status.expiry,
            })
        }
        if (formData.status.cvc === "valid") {
            this.setState({
                cvc: formData.values.cvc,
                cvc_valid: formData.status.cvc,
            })
        }
        if (formData.status.name === "valid") {
            this.setState({
                nameOnCard: formData.values.name,
                nameOnCard_valid: formData.status.name,
            })
        }

        if (formData.status.postalCode === "valid") {
            this.setState({
                postalCode: formData.values.postalCode,
                postalCode_valid: formData.status.postalCode,
            })
        }
        if (formData.status.cvc === "valid" && formData.status.number === "valid" && formData.status.expiry === "valid"
            && formData.status.name === "valid" && formData.status.postalCode === "valid") {
            this.setState({
                isCreate: true,
            })
        }
        console.log(JSON.stringify(formData, null, " "));
    };

    async createCreditCard() {
        const { isCreate, name, name_valid, last4DigitsHash, last4DigitsHash_valid, nameOnCard, nameOnCard_valid, postalCode, postalCode_valid, expiredMonthHash,
            expiredMonthHash_valid, expiredYearHash, brand, cvc, cvc_valid, customerId, cardId } = this.state;

        const { navigate } = this.props.navigation;
        console.log("isss", isCreate);
        if (isCreate) {
            this.setState({
                showLoading: true,
            });
            var customerIdDefault = await AsyncStorage.getItem(keyConstant.STORAGE.ID);
            const data = {
                brand: brand,
                name: name,
                nameOnCard: nameOnCard,
                cvc: cvc,
                postalCode: postalCode,
                last4DigitsHash: last4DigitsHash,
                expiredYearHash: expiredYearHash,
                expiredMonthHash: expiredMonthHash,
                customerId: customerIdDefault
            }






            try {
                const client = new Stripe('pk_test_D0BLH7S0dIaPbxYxUJTFYa0T00ekNdTcE3');
                const stripeResponse = await client.createToken({
                    number: data.last4DigitsHash,
                    exp_month: data.expiredMonthHash,
                    exp_year: data.expiredYearHash,
                    cvc: data.cvc,
                    address_zip: data.postalCode
                });

                const dataCreditCard = {
                    cardId: stripeResponse.card.id,
                    brand: brand,
                    name: name,
                    nameOnCard: nameOnCard,
                    customerId: customerIdDefault
                }
                var creditCardResponse = await Api.post('/api/credit-card', dataCreditCard);
                if (creditCardResponse.status === 200) {
                    RNToasty.Success({
                        title: 'Create Credit Card successfully',
                    });
                    navigate('CreditCardViewList');
                } else {
                    RNToasty.Error({
                        title: 'Create credit card Error',
                    });
                }
            } catch (error) {
                RNToasty.Error({
                    title: 'Error on Create Credit Card Data',
                });
            } finally {
                this.setState({
                    showLoading: false,
                });
            }
        } else {
            if (last4DigitsHash_valid !== "valid") {
                RNToasty.Error({
                    title: 'Number is invalid',
                });
            }
            if (nameOnCard_valid !== "valid") {
                RNToasty.Error({
                    title: 'Name on your card is invalid',
                });
            }
            if (postalCode_valid !== "valid") {
                RNToasty.Error({
                    title: 'Postal Code is invalid'
                });
            }
            if (expiredMonthHash_valid !== "valid") {
                RNToasty.Error({
                    title: 'Expiry is invalid',
                });
            }
            if (cvc_valid !== "valid") {
                RNToasty.Error({
                    title: 'CVC is invalid',
                });
            }
            if (name.length <= 3) {
                RNToasty.Error({
                    title: 'Name is invalid',
                });
            }
        }
    }

    validateName(name) {
        let isValid = 'valid';
        console.log("name1: ", name);
        if (!name || name.length == 0) {
            console.log("name2: ", name);
            isValid = '';
        }
        console.log("isvalid: ", isValid);
        this.setState({
            name: name,
            name_valid: isValid,
            //isEditting: isValid,

        });
        return isValid;
    }

    _onFocus = field => {
        /* eslint no-console: 0 */
        // console.log(field);
    };

    render() {
        const { showLoading, name, name_valid } = this.state;
        return (

            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button
                            onPress={() => this.props.navigation.navigate('CreditCardViewList')}>
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>
                            Add Credit Card
                        </Title>
                    </Body>
                    <Right />
                </Header>
                <ImageBackground style={styles.bgImage}>
                    <View style={styles.registerView}>

                        <CreditCardInput
                            autoFocus

                            requiresName
                            requiresCVC
                            requiresPostalCode

                            labelStyle={styles.label}
                            inputStyle={styles.input}
                            validColor={"black"}
                            invalidColor={"red"}
                            placeholderColor={"darkgray"}

                            onFocus={this._onFocus}
                            onChange={this._onChange} />
                        <Input
                            leftIcon={
                                <Icon
                                    name="user-o"
                                    type="font-awesome"
                                    color="black"
                                    size={25}
                                />
                            }
                            containerStyle={{ marginVertical: 10 }}
                            onChangeText={name => { this.setState({ name: name }) }}
                            value={name}
                            inputStyle={{ marginLeft: 10, color: 'black' }}
                            keyboardAppearance="light"
                            placeholder="Your name given to Credit Card"
                            autoFocus={false}
                            autoCapitalize="words"
                            autoCorrect={false}
                            keyboardType="default"
                            returnKeyType="next"
                            ref={input => (this.nameInput = input)}
                            onSubmitEditing={() => {
                                this.validateName(name);
                            }}
                            blurOnSubmit={false}
                            placeholderTextColor="gray"
                            errorStyle={{ textAlign: 'center', fontSize: 12 }}
                            errorMessage={
                                name_valid ? null : 'Please enter a valid name'
                            }
                        />
                        <Button rounded block primary
                            //activeOpacity={1}
                            underlayColor="transparent"
                            onPress={this.createCreditCard}
                            loading={showLoading}
                            loadingProps={{ size: 'small', color: '#fff' }}
                            style={{
                                flex: 0.3,
                                marginTop: 10
                            }}
                            titleStyle={{ fontSize: 20, color: '#fff' }}
                        ><Text style={{ color: '#fff', fontSize: 20 }}>Add Credit Card</Text></Button>
                    </View>
                </ImageBackground>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    // container: {
    //     backgroundColor: "#F5F5F5",
    //     marginTop: 60,
    // },
    container: {
        flex: 1,
    },
    bgImage: {
        flex: 1,
        top: 10,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerView: {
        marginTop: 200,
        backgroundColor: 'transparent',
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    registerTitle: {
        //flex: 0.3,
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
    // registerInput: {
    //     //flex: 0.7,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     marginTop: -70,

    // },
    footerView: {
        //marginTop: 0,
        //flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: "black",
        fontSize: 12,
    },
    input: {
        fontSize: 16,
        color: "black",
    },
});