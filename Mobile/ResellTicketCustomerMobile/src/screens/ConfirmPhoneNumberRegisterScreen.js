import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import { Input, Button, Icon } from 'react-native-elements';
import Api from './../service/Api';
import { RNToasty } from 'react-native-toasty';
import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';


const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const BG_IMAGE = require('../../assets/images/bg_screen1.jpg');

export default class ConfirmPhoneNumberRegisterScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
            phoneNumber: '',
            phoneNumber_valid: true,
            password: '',
            login_failed: false,
            showLoading: false,
            cca2: 'US',
        };

        this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
        this.submitRegisterCredentials = this.submitRegisterCredentials.bind(this);
        this.onPressFlag = this.onPressFlag.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.onSelectedContry = this.onSelectedContry.bind(this);
    }

    componentDidMount() {
        this.setState({
            pickerData: this.phone.getPickerData(),
        });
    }

    onPressFlag() {
        this.countryPicker.openModal();
    }

    selectCountry(country) {
        this.phone.selectCountry(country.cca2.toLowerCase());
        console.log("1234", this.phone.selectCountry(country.cca2.toLowerCase()));
        console.log("1234", this.phone.getDialCode());
        this.setState({ cca2: country.cca2 });
    }

    onSelectedContry(country) {
        console.log('onSelectedCountry', country);
        if (this.phone) {
            console.log('test', this.phone.getValue());
        }
    }

    validatePhoneNumber(phoneNumber) {
        let isValid = true;
        if (!phoneNumber && phoneNumber.length < 12) {
            isValid = false;
        }
        // else {
        //     var regex = new RegExp(/\d[0-9]{9,12}/gm);
        //     isValid = regex.test(phoneNo);
        // }



        this.setState({
            phoneNumber_valid: isValid,
            phoneNumber: phoneNumber
        });

        return isValid;
    }

    async submitRegisterCredentials() {
        
        this.validatePhoneNumber(this.state.phoneNumber);
        if (this.state.phoneNumber_valid) {
            this.setState({
                showLoading: true,
            });

            const data = {
                phoneNumber: this.state.phoneNumber.replace('+', '') 
            };
            console.log("Phone number Data", data);

            try {
                const response = await Api.post('api/customer/checkPhone', data);

                console.log("Phone number", data);
                if (response.status === 200) {
                    RNToasty.Success({
                        title: 'Phone number is valid',
                    });
                    this.props.navigation.navigate('Register', { phoneNumber: this.state.phoneNumber });
                } else {
                    RNToasty.Error({
                        title: 'Phone Number is existed',
                    });
                }
            } catch (err) {
                console.error('Phone Number is existed', err);
            } finally {
                this.setState({
                    showLoading: false,
                });
            }
        } else {
            RNToasty.Error({
                title: 'Phone Number is not valid',
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
                                <Text style={styles.travelText}>REGISTER</Text>
                            </View>
                        </View>
                        <View style={styles.registerInput}>
                            <PhoneInput
                                ref={(ref) => { this.phone = ref; }}
                                onPressFlag={this.onPressFlag}
                                initialCountry='vn'
                                // onSelectCountry={this.onSelectedContry}
                                textStyle={{fontSize: 20, color: 'white'}}
                                autoFormat={true}
                                onChangePhoneNumber={phoneNumber => { this.setState({ phoneNumber: phoneNumber }) }}
                                allowZeroAfterCountryCode={false}
                                textComponent={Input}
                                textProps={{inputStyle:{ marginLeft: 10, color: 'white' }}}
                            />

                            <CountryPicker
                                ref={(ref) => {
                                    this.countryPicker = ref;
                                }}
                                onChange={value => { this.selectCountry(value) }}
                                translation="eng"
                                cca2={this.state.cca2}
                            >
                                <View />
                            </CountryPicker>
                            
                            {/* <Input
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
                            /> */}
                        </View>

                        <Button
                            title="REGISTER"
                            activeOpacity={1}
                            underlayColor="transparent"
                            onPress={this.submitRegisterCredentials}
                            loading={showLoading}
                            loadingProps={{ size: 'small', color: 'white' }}
                            disabled={!phoneNumber_valid && phoneNumber.length < 11}
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
        color: 'white',
        fontSize: 15,
    },
    footerView: {
        marginTop: 0,
        flex: 0.1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        // width: 200,
        borderRadius: 5,
        backgroundColor: "#f0f0f0",
        padding: 10,
        marginTop: 20
    }
});
