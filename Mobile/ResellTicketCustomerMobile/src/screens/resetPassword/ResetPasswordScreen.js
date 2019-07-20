import React, { Component } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import Api from '../../service/Api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../../../assets/images/bg_screen1.jpg');

export default class ResetPasswordScreen extends Component {
    constructor(props) {
        super(props);

        let { navigation } = props;
        const phoneNumber = navigation.getParam('phoneNumber', '');
        if(phoneNumber === '') {
            navigation.navigate('Login');
            return;
        }

        this.state = {
            phoneNumber: phoneNumber,
            otp: '',
            otp_valid: true,
            password: '',
            password_valid: true,
            passwordConfirm: '',
            passwordConfirm_valid: true,
            showLoading: false,
        };

        this.validatePassword = this.validatePassword.bind(this);
        this.validatePasswordConfirm = this.validatePasswordConfirm.bind(this);
        this.validateOtp = this.validateOtp.bind(this);
        this.submitResetPassword = this.submitResetPassword.bind(this);
    }

    validatePassword(password) {
        let isValid = true;

        if(!password) {
            isValid = false;
        }

        this.setState({
            password: password,
            password_valid: isValid,
        });

        return isValid;
    }

    validatePasswordConfirm(password, passwordConfirm) {
        let isValid = true;

        if(password !== passwordConfirm) {
            isValid = false;
        }

        this.setState({
            passwordConfirm: passwordConfirm,
            passwordConfirm_valid: isValid,
        });

        return isValid;
    }

    validateOtp(otp) {
        let isValid = true;

        if(!otp || otp.length !== 6) {
            isValid = false;
        }

        this.setState({
            otp: otp,
            otp_valid: isValid,
        });

        return isValid;
    }

    async submitResetPassword() {
        const { phoneNumber, otp, password, passwordConfirm } = this.state;

        if(!this.validatePassword(password) ||
            !this.validatePasswordConfirm(password, passwordConfirm) ||
            !this.validateOtp(otp)
        ) {
            return;
        }

        this.setState({
            showLoading: true,
        });

        const data = {
            phoneNumber: phoneNumber,
            otp: otp,
            password: password,
        };

        try {
            const response = await Api.post('api/customer/reset-password', data);
            
            if(response.status === 200) {
                RNToasty.Success({
                    title: 'Reset Password Success!',
                });
                this.props.navigation.navigate('Login');
            } 
            else if(response.status === 400) {
                RNToasty.Error({
                    title: 'Wrong OTP.',
                });
            }
            else if(response.status === 406) {
                RNToasty.Error({
                    title: 'Cannot found Customer',
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
        const { showLoading, phoneNumber, phoneNumber_valid, password, password_valid, passwordConfirm, passwordConfirm_valid, otp, otp_valid } = this.state;

        return (
            <View style={styles.container}>
                <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
                    <View style={styles.registerView}>
                        <View style={styles.registerTitle}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.travelText}>RESET PASSWORD</Text>
                            </View>
                        </View>
                        <View style={styles.forgotPasswordInput}>
                            <Input
                                leftIcon={
                                    <Icon
                                        name="lock"
                                        type="font-awesome"
                                        color="rgba(171, 189, 219, 1)"
                                        size={25}
                                    />
                                }
                                containerStyle={{ marginVertical: 10 }}
                                onChangeText={password => {this.setState({ password: password })}}
                                value={password}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                secureTextEntry={true}
                                keyboardAppearance="light"
                                placeholder="New Password"
                                autoFocus={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="next"
                                ref={input => (this.passwordInput = input)}
                                onSubmitEditing={() => {
                                    this.validatePassword(password);
                                    this.passwordConfirmInput.focus();
                                }}
                                blurOnSubmit={false}
                                placeholderTextColor="white"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    password_valid? null : 'Please enter a valid Password.'
                                }
                            />
                            <Input
                                leftIcon={
                                    <Icon
                                        name="lock"
                                        type="font-awesome"
                                        color="rgba(171, 189, 219, 1)"
                                        size={25}
                                    />
                                }
                                containerStyle={{ marginVertical: 10 }}
                                onChangeText={passwordConfirm => {this.setState({ passwordConfirm: passwordConfirm })}}
                                value={passwordConfirm}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                secureTextEntry={true}
                                keyboardAppearance="light"
                                placeholder="Confirm Password"
                                autoFocus={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="next"
                                ref={input => (this.passwordConfirmInput = input)}
                                onSubmitEditing={() => {
                                    this.validatePasswordConfirm(password, passwordConfirm);
                                    this.otpInput.focus();
                                }}
                                blurOnSubmit={false}
                                placeholderTextColor="white"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    passwordConfirm_valid ? null : 'Password Confirm does not match new Password.'
                                }
                            />
                            <Input
                                leftIcon={
                                    <Icon
                                        name="lock"
                                        type="font-awesome"
                                        color="rgba(171, 189, 219, 1)"
                                        size={25}
                                    />
                                }
                                containerStyle={{ marginVertical: 10 }}
                                onChangeText={otp => {this.setState({ otp: otp })}}
                                value={otp}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                keyboardAppearance="light"
                                placeholder="683746"
                                autoFocus={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="number-pad"
                                returnKeyType="next"
                                ref={input => (this.otpInput = input)}
                                onSubmitEditing={() => {
                                    this.validateOtp(otp);
                                }}
                                blurOnSubmit={false}
                                placeholderTextColor="white"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    otp_valid ? null : 'OTP is invalid.'
                                }
                            />
                        </View>
                        <Button
                            title="RESET"
                            activeOpacity={1}
                            underlayColor="transparent"
                            onPress={this.submitResetPassword}
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
        width: 255,
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
