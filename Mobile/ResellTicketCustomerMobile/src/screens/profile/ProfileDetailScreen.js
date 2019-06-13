import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    AsyncStorage
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import Api from './../../service/Api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../../../assets/images/bg_screen1.jpg');
//const BG_IMAGE2 = require('../../../assets/images/bg_screen1');

export default class ProfileDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            fullName: '',
            fullName_valid: true,
            phoneNumber: '',
            address: '',
            address_valid: true,
            email: '',
            email_valid: true,
            isActive: true,
            //isEditting: false, 
            showLoading: false,
        }

        //this.handleOnChanged = this.handleOnChanged.bind(this);
        this.submitRegisterCredentials = this.submitRegisterCredentials.bind(this);
        //this.onBtnCancleClicked = this.onBtnCancleClicked.bind(this);
    }

    validateAddress(address) {
        let isValid = true;
        if (!address || address.length == 0) {
            isValid = false;
        }
        this.setState({
            address: address,
            address_valid: isValid,
            //isEditting: isValid,
        });
        return isValid;
    }

    validateEmail(email) {
        let isValid = true;
        if (!email || email.length == 0) {
            isValid = false;
        }
        this.setState({
            email: email,
            email_valid: isValid,
            //isEditting: isValid,
        });
        return isValid;
    }

    validateFullname(fullName) {
        let isValid = true;
        if (!fullName || fullName.length == 0) {
            isValid = false;
        }
        this.setState({
            fullName: fullName,
            fullName_valid: isValid,
            //isEditting: isValid,

        });
        return isValid;
    }
    componentDidMount() {
        this.getCustomerProfile();
    }

    async getCustomerProfile() {
        var usernameDefault = await AsyncStorage.getItem('USENAME');
        try {
            var customerResponse = await Api.get('api/customer/getCustomerByUsename?usename=' + usernameDefault);
            console.log('repone', customerResponse);
            this.setState({
                username: usernameDefault,
                fullName: customerResponse.data.fullName,
                phoneNumber: customerResponse.data.phoneNumber,
                address: customerResponse.data.address,
                email: customerResponse.data.email,
            });
        } catch (error) {
            toastr.error('Error', 'Error on Load Customer Data');
        }
    }
    async submitRegisterCredentials() {
        const { username, fullName, email, address } = this.state;

        this.setState({
            showLoading: true,
        });

        const data = {
            username: username,
            fullName: fullName,
            email: email,
            address: address
        };

        try {
            const response = await Api.put('api/customer', data);
            if (response.status === 200) {
                RNToasty.Success({
                    title: 'Update profile successfully',
                });
                this.props.navigation.navigate('Home');
            } else {
                RNToasty.Error({
                    title: 'Update profile Error',
                });
            }
        } catch (err) {
            console.error('Update profile error', err);
        } finally {
            this.setState({
                showLoading: false,
            });
        }
    }

    render() {
        const { username, fullName, fullName_valid, email, email_valid,
            address, address_valid, phoneNumber, showLoading } = this.state;

        return (
            <View style={styles.container}>
                <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
                    <View style={styles.registerView}>
                        <View style={styles.registerTitle}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={styles.travelText}>Profile Detail</Text>
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
                                blurOnSubmit={false}
                                placeholderTextColor="white"
                                enabled={false}
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
                                onChangeText={address => { this.setState({ address: address }) }}
                                value={address}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                keyboardAppearance="light"
                                placeholder="Address"
                                autoFocus={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                returnKeyType="next"
                                ref={input => (this.addressInput = input)}
                                blurOnSubmit={false}
                                placeholderTextColor="white"
                                errorStyle={{ textAlign: 'center', fontSize: 12 }}
                                errorMessage={
                                    address_valid ? null : 'Please enter a valid Address'
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
                                onChangeText={phoneNumber => { this.setState({ phoneNumber: phoneNumber }) }}
                                value={phoneNumber}
                                inputStyle={{ marginLeft: 10, color: 'white' }}
                                keyboardAppearance="light"
                                placeholder="Phone Number"
                                autoFocus={false}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                returnKeyType="next"
                                ref={input => (this.phoneNumberInput = input)}
                                blurOnSubmit={false}
                                placeholderTextColor="white"
                                enabled={false}
                            />
                        </View>
                        <Button
                            title="UPDATE PROFILE"
                            activeOpacity={1}
                            underlayColor="transparent"
                            onPress={this.submitRegisterCredentials}
                            loading={showLoading}
                            loadingProps={{ size: 'small', color: 'white' }}
                            //disabled={isEditting == false}
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
                            title="CHANGE PASSWORD"
                            activeOpacity={1}
                            underlayColor="transparent"
                            onPress={() => this.props.navigation.navigate('ChangePassword')}
                            loading={showLoading}
                            loadingProps={{ size: 'small', color: 'white' }}
                            //disabled={isEditting == false}
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
                                title="Go Back Home"
                                type="clear"
                                activeOpacity={0.5}
                                titleStyle={{ color: 'white', fontSize: 15 }}
                                containerStyle={{ marginTop: -5 }}
                                onPress={() => this.props.navigation.navigate('Me')}
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
    },
    plusText: {
        color: 'white',
        fontSize: 30,
        fontFamily: 'regular',
    },
    registerInput: {
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
