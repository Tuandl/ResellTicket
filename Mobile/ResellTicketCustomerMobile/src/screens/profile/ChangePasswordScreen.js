import React, { Component } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { Container, Button, Header, Body, Title, Left, Right } from 'native-base';
import { Input, Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import Api from '../../service/Api';
import keyConstant from '../../constants/keyConstant';
import colors from '../../config/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../../../assets/images/bg_screen1.jpg');

export default class ChangePasswordScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            oldpassword: '',
            oldpassword_valid: true,
            password: '',
            password_valid: true,
            passwordConfirm: '',
            passwordConfirm_valid: true,
            showLoading: false,
        };

        this.validateOldPassword = this.validateOldPassword.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validatePasswordConfirm = this.validatePasswordConfirm.bind(this);
        this.submitResetPassword = this.submitResetPassword.bind(this);
    }

    validateOldPassword(oldpassword) {
        let isValid = true;

        if (!oldpassword) {
            isValid = false;
        }

        this.setState({
            oldpassword: oldpassword,
            oldpassword_valid: isValid,
        });

        return isValid;
    }

    validatePassword(password) {
        let isValid = true;

        if (!password) {
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

        if (password !== passwordConfirm) {
            isValid = false;
        }

        this.setState({
            passwordConfirm: passwordConfirm,
            passwordConfirm_valid: isValid,
        });

        return isValid;
    }

    async submitResetPassword() {
        var usernameDefault = await AsyncStorage.getItem(keyConstant.STORAGE.USERNAME);
        const { password, passwordConfirm, oldpassword } = this.state;

        if (!this.validateOldPassword(oldpassword) || !this.validatePassword(password) ||
            !this.validatePasswordConfirm(password, passwordConfirm)

        ) {
            return;
        }

        this.setState({
            showLoading: true,
        });

        const data = {
            username: usernameDefault,
            passwordHash: oldpassword,
            newPassword: password,
        };

        try {
            const response = await Api.put('api/customer/change-password', data);

            if (response.status === 200) {
                RNToasty.Success({
                    title: 'Change Password Successfully!',
                });
                this.props.navigation.navigate('ProfileDetail');
            }
            else if (response.status === 400) {
                RNToasty.Error({
                    title: 'Invalid Current Password.',
                });
            }
            else if (response.status === 406) {
                RNToasty.Error({
                    title: 'Wrong Old password.',
                });
            }
        } catch (err) {
            console.error('Error', err);
        } finally {
            this.setState({
                showLoading: false,
            });
        }
    }

    render() {
        const { showLoading, password, password_valid, passwordConfirm,
            passwordConfirm_valid, oldpassword, oldpassword_valid } = this.state;

        return (
            <Container style={{ flex: 1 }}>
                <Header color={colors.secondary}>
                    <Left>
                        <Button transparent
                            onPress={() => this.props.navigation.navigate('ProfileDetail')}>
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>
                            Change Password
                        </Title>
                    </Body>
                    <Right />
                </Header>
                <ImageBackground style={styles.bgImage}>
                    <View style={styles.registerView}>
                        <View style={styles.changePasswordInput}>
                            <Input
                                leftIcon={
                                    <Icon
                                        name="lock"
                                        type="font-awesome"
                                        color="rgba(171, 189, 219, 1)"
                                        size={25}
                                    />
                                }
                                //Old pass word
                                containerStyle={{ marginVertical: 10 }}
                                onChangeText={oldpassword => { this.setState({ oldpassword: oldpassword }) }}
                                value={oldpassword}
                                inputStyle={{ marginLeft: 10, color: 'black' }}
                                secureTextEntry={true}
                                keyboardAppearance="light"
                                placeholder="Old Password"
                                autoFocus={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="default"
                                returnKeyType="next"
                                ref={input => (this.oldpasswordInput = input)}
                                onSubmitEditing={() => {
                                    this.validateOldPassword(oldpassword);
                                    this.passwordInput.focus();
                                }}
                                blurOnSubmit={false}
                                placeholderTextColor="black"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    oldpassword_valid ? null : 'Please enter a valid Password.'
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
                                onChangeText={password => { this.setState({ password: password }) }}
                                value={password}
                                inputStyle={{ marginLeft: 10, color: 'black' }}
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
                                placeholderTextColor="black"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    password_valid ? null : 'Please enter a valid Password.'
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
                                onChangeText={passwordConfirm => { this.setState({ passwordConfirm: passwordConfirm }) }}
                                value={passwordConfirm}
                                inputStyle={{ marginLeft: 10, color: 'black' }}
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
                                }}
                                blurOnSubmit={false}
                                placeholderTextColor="black"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    passwordConfirm_valid ? null : 'Password Confirm does not match new Password.'
                                }
                            />

                        </View>
                        <Button block primary
                            title="Change Password"
                            activeOpacity={1}
                            underlayColor="transparent"
                            onPress={this.submitResetPassword}
                            loading={showLoading}
                            loadingProps={{ size: 'small', color: '#fff' }}
                            style={{
                                marginTop: 10
                            }}

                        ><Text style={{ color: '#fff', fontSize: 20 }}>Change Password</Text></Button>
                    </View>
                </ImageBackground>
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bgImage: {
        //flex: 1,
        top: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerView: {
        //marginTop: 0,
        backgroundColor: 'transparent',
        width: SCREEN_WIDTH / 1.2,
        height: SCREEN_HEIGHT / 1.1,
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
    registerInput: {
        //flex: 0.7,
        justifyContent: 'center',
        alignItems: 'center',
        //marginTop: -70,

    },
    footerView: {
        //marginTop: 0,
        //flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
