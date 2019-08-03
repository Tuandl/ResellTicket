import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';


export default class ConfirmPhone extends Component {
    constructor() {
        super();

        this.onPressFlag = this.onPressFlag.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.onSelectedContry = this.onSelectedContry.bind(this);
        this.state = {
            cca2: 'US',
        };
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
        if(this.phone) {
            console.log('test', this.phone.getValue());
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <PhoneInput
                    ref={(ref) => { this.phone = ref; }}
                    onPressFlag={this.onPressFlag}
                    initialCountry='vn'
                    // onSelectCountry={this.onSelectedContry}
                    autoFormat={true}
                    onChangePhoneNumber={number => { console.log('on change phone number', number)}}
                    allowZeroAfterCountryCode={false}
                />

                <CountryPicker
                    ref={(ref) => {
                        this.countryPicker = ref;
                    }}
                    onChange={value => {this.selectCountry(value)}}
                    translation="eng"
                    cca2={this.state.cca2}
                >
                    <View />
                </CountryPicker>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 60,
    },
});
