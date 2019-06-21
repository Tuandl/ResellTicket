import React, { Component } from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import Api from './../service/Api';
import { RNToasty } from "react-native-toasty";
import keyConstant from '../constants/keyConstant';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../../assets/images/bg_screen1.jpg');

export default class LoginScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            username_valid: true,
            password: '',
            login_failed: false,
            showLoading: false,
        };
    }

    validateUsername(username) {
        let valid = true
        if(!username || username.length == 0) {
            valid = false;
        }
        this.setState({
            username: username,
            username_valid: valid,
        });
        return valid;
    }

    async submitLoginCredentials() {
        const { username, password } = this.state;

        this.setState({
            showLoading: true,
        });

        const data = {
            username: username,
            password: password,
        };

        try {
            const response = await Api.post('api/Authentication/customer', data);
            if(response.status === 200) {
                RNToasty.Success({
                    title: 'Login successfully',
                });
                AsyncStorage.setItem(keyConstant.STORAGE.USERNAME, response.data.username);
                AsyncStorage.setItem(keyConstant.STORAGE.TOKEN, response.data.token);
                Api.setHeader(keyConstant.HEADER_KEY.AUTHORIZE, `Bearer ${response.data.token}`)
                // console.log("use : ", response.data.username);
                // console.log("token : ", response.data.token);
                this.props.navigation.navigate('Home', {username: username});
            } else {
                RNToasty.Error({
                    title: 'Invalid Username or Password',
                });
            }
        } catch(err) {
            console.error('login error', err);
        } finally {
            this.setState({
                showLoading: false,
            });
        }
    }

    render() {
        const { username, password, username_valid, showLoading } = this.state;

        return (
            <View style={styles.container}>
                <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
                    <View style={styles.loginView}>
                        <View style={styles.loginTitle}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.travelText}>RESELL</Text>
                            </View>
                            <View style={{ marginTop: -10 }}>
                                <Text style={styles.travelText}>TICKET</Text>
                            </View>
                        </View>
                        <View style={styles.loginInput}>
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
                                onChangeText={username => this.setState({ username })}
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
                                errorStyle={{ textAlign: 'center', fontSize: 12, color: 'red' }}
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
                            />
                        </View>
                        <Button
                            title="LOG IN"
                            activeOpacity={1}
                            underlayColor="transparent"
                            onPress={this.submitLoginCredentials.bind(this)}
                            loading={showLoading}
                            loadingProps={{ size: 'small', color: 'white' }}
                            disabled={!username_valid && password.length < 8}
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
                        <Button
                            title="Forget Password?"
                            type="clear"
                            activeOpacity={0.5}
                            titleStyle={{ color: 'white', fontSize: 15 }}
                            containerStyle={{ marginTop: -5 }}
                            onPress={() => {
                                this.props.navigation.navigate('ForgotPassword');
                            }}
                        />
                        <View style={styles.footerView}>
                            <Text style={{ color: 'grey' }}>New here?</Text>
                            <Button
                                title="Create an Account"
                                type="clear"
                                activeOpacity={0.5}
                                titleStyle={{ color: 'white', fontSize: 15 }}
                                containerStyle={{ marginTop: -5 }}
                                onPress={() => {
                                    this.props.navigation.navigate('ConfirmPhoneNumberRegister');
                                }}
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
    loginView: {
        marginTop: SCREEN_HEIGHT / 6,
        backgroundColor: 'transparent',
        width: 250,
        height: 400,
    },
    loginTitle: {
        flex: 1,
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
    loginInput: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerView: {
        marginTop: 5,
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
