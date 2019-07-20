import React, { Component } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import Api from '../../service/Api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../../../assets/images/bg_screen1.jpg');

export default class ForgotPasswordScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phoneNumber: '',
            phoneNumber_valid: true,
            showLoading: false,
        };

        this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
        this.submitForgotPassword = this.submitForgotPassword.bind(this);
    }

    validatePhoneNumber(phoneNumber) {
        let isValid = true;

        if(!phoneNumber) {
            isValid = false;
        }
        else {
            var regex = new RegExp(/^\d[0-9]{9,12}$/gm);
            isValid = regex.test(phoneNumber);
        }

        this.setState({
            phoneNumber_valid: isValid,
            phoneNumber: phoneNumber
        });

        return isValid;
    }

    async submitForgotPassword() {
        const { phoneNumber } = this.state;

        if(!this.validatePhoneNumber(phoneNumber)) {
            RNToasty.Error({
                title: "Phone number is invalid!"
            });
            return;
        }

        this.setState({
            showLoading: true,
        });

        const data = {
            phoneNumber: phoneNumber
        };

        try {
            const response = await Api.post('api/customer/forget-password', data);
            
            if(response.status === 200) {
                RNToasty.Success({
                    title: 'OTP Sent!',
                });
                this.props.navigation.navigate('ResetPassword', { phoneNumber: phoneNumber });
            } 
            else if(response.status === 406) {
                RNToasty.Error({
                    title: 'There is no account with this phone number.',
                });
            } 
            else {
                console.log(response);
                RNToasty.Error({
                    title: 'Error!',
                });
            }
        } catch(err) {
            console.error('Error', err);
        } finally {
            this.setState({
                showLoading: false,
            });
        }
    }

    render() {
        const { showLoading, phoneNumber, phoneNumber_valid } = this.state;

        return (
            <View style={styles.container}>
                <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
                    <View style={styles.registerView}>
                        <View style={styles.registerTitle}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.travelText}>FORGOT PASSWORD</Text>
                            </View>
                        </View>
                        <View style={styles.forgotPasswordInput}>
                            <Input
                                leftIcon={
                                    <Icon
                                        name="phone"
                                        type="font-awesome"
                                        color="rgba(171, 189, 219, 1)"
                                        size={25}
                                    />
                                }
                                containerStyle={{ marginVertical: 10 }}
                                onChangeText={phoneNumber => {this.setState({ phoneNumber: phoneNumber })}}
                                value={phoneNumber}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                keyboardAppearance="light"
                                placeholder="Phone Number"
                                autoFocus={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="number-pad"
                                returnKeyType="next"
                                ref={input => (this.phoneNumberInput = input)}
                                onSubmitEditing={() => {
                                    this.validatePhoneNumber(phoneNumber);
                                }}
                                blurOnSubmit={false}
                                placeholderTextColor="white"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    phoneNumber_valid ? null : 'Please enter a valid phone number'
                                }
                            />
                        </View>
                        <Button
                            title="SEND OTP"
                            activeOpacity={1}
                            underlayColor="transparent"
                            onPress={this.submitForgotPassword}
                            loading={showLoading}
                            loadingProps={{ size: 'small', color: 'white' }}
                            disabled={false}
                            buttonStyle={{
                                height: 50,
                                width: 250,
                                backgroundColor: 'transparent',
                                borderWidth: 2,
                                borderColor: 'white',
                                borderRadius: 30,
                            }}
                            containerStyle={{ marginVertical: 10 }}
                            titleStyle={{ fontWeight: 'bold', color: 'white' }}
                        />
                        <View style={styles.footerView}>
                            <Button
                                title="Login"
                                type="clear"
                                activeOpacity={0.5}
                                titleStyle={{ color: 'white', fontSize: 15 }}
                                containerStyle={{ marginTop: -5 }}
                                onPress={() => this.props.navigation.navigate('Login')}
                            />
                        </View>
                    </View>
                </ImageBackground>
            </View>
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
    registerView: {
        marginTop: 0,
        backgroundColor: 'transparent',
        width: 250,
        height: 600,
    },
    registerTitle: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    travelText: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'bold',
        width: 283,
    },
    plusText: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'regular',
    },
    forgotPasswordInput: {
        flex: 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -70,

    },
    footerView: {
        marginTop: 0,
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
