import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import Api from './../service/Api';
import { RNToasty } from 'react-native-toasty';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../../assets/images/bg_screen1.jpg');

export default class RegisterScreen extends Component {
    constructor(props) {
        super(props);
        let { navigation } = props;
        const phoneNumber = navigation.getParam('phoneNumber', '');
        if (phoneNumber === '') {
            navigation.navigate('Login');
            return;
        }

        this.state = {
            username: '',
            username_valid: true,
            fullName: '',
            fullName_valid: true,
            phoneNumber: phoneNumber,
            email: '',
            email_valid: true,
            OTPNumber: '',
            otp_valid: true,
            password: '',
            confirmPassword: '',
            confirmPassword_valid: false,
            login_failed: false,
            showLoading: false,
        };

        this.validateUsername = this.validateUsername.bind(this);
        this.validateFullName = this.validateFullName.bind(this);
        this.submitRegisterCredentials = this.submitRegisterCredentials.bind(this);
    }

    validateUsername(username) {
        let isValid = true;
        if (!username || username.length == 0) {
            isValid = false;
        }
        this.setState({
            username: username,
            username_valid: isValid,
        });
        return isValid;
    }

    validateFullName(fullName) {
        let isValid = true;
        if (!fullName || fullName.length == 0) {
            isValid = false;
        }
        this.setState({
            fullName: fullName,
            fullName_valid: isValid,
        })
        return isValid;
    }

    validateOTP(OTPNumber) {
        let isValid = true;
        if (!OTPNumber || OTPNumber.length == 0) {
            isValid = false;
        }
        this.setState({
            OTPNumber: OTPNumber,
            otp_valid: isValid,
        })
        return isValid;
    }

    validateConfirmPassword(confirmPassword) {
        let isValid = true;
        if (confirmPassword !== this.state.password) {
            isValid = false;
            RNToasty.Error({
                title: 'Confirm Password is not match',
            });
        }
        this.setState({
            confirmPassword: confirmPassword,
            confirmPassword_valid: isValid
        })
        return isValid;
    }

    async submitRegisterCredentials() {
        const { username, password, fullName, phoneNumber, email, OTPNumber } = this.state;

        this.setState({
            showLoading: true,
        });

        const data = {
            username: username,
            passwordHash: password,
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            OTPNumber: OTPNumber,
        };

        try {
            const response = await Api.post('api/customer', data);
            if (response.status === 200) {
                RNToasty.Success({
                    title: 'Register successfully',
                });
                this.props.navigation.navigate('Login');
            } else {
                RNToasty.Error({
                    title: 'Register Error',
                });
            }
        } catch (err) {
            console.error('Register error', err);
        } finally {
            this.setState({
                showLoading: false,
            });
        }
    }

    render() {
        const { username, password, confirmPassword, confirmPassword_valid, username_valid, showLoading, fullName, fullName_valid,
            email, email_valid, OTPNumber, otp_valid } = this.state;

        return (
            <View style={styles.container}>
                <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
                    <View style={styles.registerView}>
                        <View style={styles.registerTitle}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.travelText}>REGISTER</Text>
                            </View>
                        </View>
                        <View style={styles.registerInput}>
                            <Input
                                leftIcon={
                                    <Icon
                                        name="user-o"
                                        type="font-awesome"
                                        color="rgba(171, 189, 219, 1)"
                                        size={25}
                                    />
                                }
                                containerStyle={{ marginVertical: 10 }}
                                onChangeText={username => { this.setState({ username: username }) }}
                                value={username}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                keyboardAppearance="light"
                                placeholder="Username"
                                autoFocus={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="next"
                                ref={input => (this.usernameInput = input)}
                                onSubmitEditing={() => {
                                    this.validateUsername(username);
                                    this.passwordInput.focus();
                                }}
                                blurOnSubmit={false}
                                placeholderTextColor="white"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    username_valid ? null : 'Please enter a valid username'
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
                                onChangeText={password => this.setState({ password })}
                                value={password}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                secureTextEntry={true}
                                keyboardAppearance="light"
                                placeholder="Password"
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="done"
                                ref={input => (this.passwordInput = input)}
                                blurOnSubmit={true}
                                placeholderTextColor="white"
                                onSubmitEditing={() => {
                                    this.validateUsername(username);
                                    this.confirmPasswordInput.focus();
                                }}
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
                                onChangeText={confirmPassword => this.setState({ confirmPassword })}
                                value={confirmPassword}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                secureTextEntry={true}
                                keyboardAppearance="light"
                                placeholder="Comfirm Password"
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="done"
                                ref={input => (this.confirmPasswordInput = input)}
                                blurOnSubmit={true}
                                placeholderTextColor="white"
                                onSubmitEditing={() => {
                                    this.validateConfirmPassword(confirmPassword);
                                    this.fullNameInput.focus();
                                }}
                                // blurOnSubmit={false}
                                // placeholderTextColor="white"
                                // errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                // errorMessage={
                                //     confirmPassword_valid ? null : 'Password is not match'
                                // }
                            />
                            <Input
                                leftIcon={
                                    <Icon
                                        name="user-o"
                                        type="font-awesome"
                                        color="rgba(171, 189, 219, 1)"
                                        size={25}
                                    />
                                }
                                containerStyle={{ marginVertical: 10 }}
                                onChangeText={fullName => { this.setState({ fullName: fullName }) }}
                                value={fullName}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                keyboardAppearance="light"
                                placeholder="Full Name"
                                autoFocus={false}
                                autoCapitalize="words"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="next"
                                ref={input => (this.fullNameInput = input)}
                                onSubmitEditing={() => {
                                    this.validateFullName(fullName);
                                    this.phoneNumberInput.focus();
                                }}
                                blurOnSubmit={false}
                                placeholderTextColor="white"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    fullName_valid ? null : 'Please enter a valid full name'
                                }
                            />
                            <Input
                                leftIcon={
                                    <Icon
                                        name="user-o"
                                        type="font-awesome"
                                        color="rgba(171, 189, 219, 1)"
                                        size={25}
                                    />
                                }
                                containerStyle={{ marginVertical: 10 }}
                                onChangeText={email => { this.setState({ email: email }) }}
                                value={email}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                keyboardAppearance="light"
                                placeholder="Email Address"
                                autoFocus={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                returnKeyType="next"
                                ref={input => (this.emailInput = input)}
                                blurOnSubmit={false}
                                placeholderTextColor="white"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    email_valid ? null : 'Please enter a valid Email address'
                                }
                            />
                            {/* nhập OTP */}
                            <Input
                                leftIcon={
                                    <Icon
                                        name="user-o"
                                        type="font-awesome"
                                        color="rgba(171, 189, 219, 1)"
                                        size={25}
                                    />
                                }
                                containerStyle={{ marginVertical: 10 }}
                                onChangeText={OTPNumber => { this.setState({ OTPNumber: OTPNumber }) }}
                                value={OTPNumber}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                keyboardAppearance="light"
                                placeholder="OTP Number"
                                autoFocus={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="number-pad"
                                returnKeyType="next"
                                ref={input => (this.OTPNumberInput = input)}
                                onSubmitEditing={() => {
                                    this.validateOTP(OTPNumber);
                                }}
                                blurOnSubmit={false}
                                placeholderTextColor="white"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    otp_valid ? null : 'Please enter a valid otp number'
                                }
                            />
                        </View>
                        <Button
                            title="REGISTER"
                            activeOpacity={1}
                            underlayColor="transparent"
                            onPress={this.submitRegisterCredentials}
                            loading={showLoading}
                            loadingProps={{ size: 'small', color: 'white' }}
                            disabled={!username_valid && !confirmPassword_valid && password.length < 8}
                            buttonStyle={{
                                height: 40,
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
        height: 650,
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
    },
    plusText: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'regular',
    },
    registerInput: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -55,

    },
    footerView: {
        marginTop: 0,
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
