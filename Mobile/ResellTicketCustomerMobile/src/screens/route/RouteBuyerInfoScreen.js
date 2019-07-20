import { Body, Button, Container, Content, DatePicker, Header, Label, Left, View, Right, Title, Item } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { RNToasty } from 'react-native-toasty';
import { Icon, Input } from 'react-native-elements';
import api from '../../service/Api';
import Dialog from "react-native-dialog";

export default class RouteBuyerInfoScreen extends Component {

    navigation = null;
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        const params = this.navigation.getParam('params');
        this.state = {
            routeId: params.routeId,
            buyerPassengerName: params.buyerPassengerName,
            buyerPassengerEmail: params.buyerPassengerEmail,
            buyerPassengerPhone: params.buyerPassengerPhone,
            buyerPassengerIdentify: '',
            dialogVisibleConfirmBuy: false
        };

        // this.onDateOfBirthChanged = this.onDateOfBirthChanged.bind(this);
        this.onBtnConfirmPressed = this.onBtnConfirmPressed.bind(this);
        this.onBtnConfirmCallApiPressed = this.onBtnConfirmCallApiPressed.bind(this);
        this.showDialogConfirmBuy = this.showDialogConfirmBuy.bind(this);
    }

    showDialogConfirmBuy() {
        this.setState({
            dialogVisibleConfirmBuy: true
        });
    }

    handleConfirmBuyCANCEL = () => {
        this.setState({
            dialogVisibleConfirmBuy: false
        });
    }


    componentDidMount() {

    }

    // onDateOfBirthChanged(value) {
    //     this.setState({
    //         dateofbirth: value
    //     })
    // }

    onBtnConfirmPressed() {
        if (this.state.buyerPassengerName === '' || this.state.buyerPassengerEmail === '' || this.state.buyerPassengerPhone === '' || this.state.buyerPassengerIdentify === '') {
            RNToasty.Error({
                title: 'Buy route Fail, please input all field!'
            })
        } else {
            this.showDialogConfirmBuy();
        }
    }

    async onBtnConfirmCallApiPressed() {
        var params = {
            routeId: this.state.routeId,
            buyerPassengerEmail: this.state.buyerPassengerEmail,
            buyerPassengerName: this.state.buyerPassengerName,
            buyerPassengerPhone: this.state.buyerPassengerPhone,
            buyerPassengerIdentify: this.state.buyerPassengerIdentify
        };
        const resBuyRoute = await api.post('api/route/buy-route', params);
        const { navigation } = this.props;
        if (resBuyRoute.status === 200) {
            this.setState({
                dialogVisibleConfirmBuy: false
            });
            RNToasty.Success({
                title: 'Buy route Successfully'
            })
            navigation.navigate('Route');
        }
        else {
            RNToasty.Error({
                title: 'Buy route Fail, All tickets in route must be valid!'
            })
        }
    }

    render() {
        const {
            buyerPassengerName,
            buyerPassengerEmail,
            buyerPassengerPhone,
            buyerPassengerIdentify
        } = this.state;
        const { navigation } = this.props;

        // const equal = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button transparent
                            onPress={() => navigation.pop()}
                        >
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Customer Information</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content style={styles.content} contentContainerStyle={styles.contentContainer}>
                    {/* <Label style={styles.label}>Last name:</Label>
                    <Input
                        onChangeText={lastName => this.setState({ lastName })}
                        placeholder="Enter Last Name"
                        value={lastName}
                        inputStyle={{ fontSize: 15, color: 'black' }}
                    /> */}
                    <Label style={styles.label}>New Passenger Name:</Label>
                    <Input
                        onChangeText={buyerPassengerName => this.setState({ buyerPassengerName })}
                        placeholder="Enter Your Name"
                        value={buyerPassengerName}
                        inputStyle={{ fontSize: 15, color: 'black' }}
                    />
                    <Label style={styles.label}>New Passenger Email:</Label>
                    <Input
                        onChangeText={buyerPassengerEmail => this.setState({ buyerPassengerEmail })}
                        placeholder="Enter Email"
                        value={buyerPassengerEmail}
                        inputStyle={{ fontSize: 15, color: 'black' }}
                    />
                    <Label style={styles.label}>New Passenger Phone:</Label>
                    <Input
                        onChangeText={buyerPassengerPhone => this.setState({ buyerPassengerPhone })}
                        placeholder="Enter Phone"
                        value={buyerPassengerPhone}
                        inputStyle={{ fontSize: 15, color: 'black' }}
                    />
                    <Label style={styles.label}>New Passenger Identify:</Label>
                    <Input

                        onChangeText={buyerPassengerIdentify => this.setState({ buyerPassengerIdentify })}
                        placeholder="Enter Identify Number"
                        value={buyerPassengerIdentify}
                        inputStyle={{ fontSize: 15, color: 'black' }}
                    />

                    {/* <Label style={styles.label}>Date Of Birth:</Label> */}
                    {/* Select Date Of Birth */}
                    {/* <Item>
                    <DatePicker
                        defaultDate={dateOfBirth}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"calendar"}
                        placeHolderText="Select Date Of Birth"
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={this.onDateOfBirthChanged}
                        disabled={false}
                    />
                    <Right>
                            <Icon name="calendar-check" type="material-community" color="grey" />
                    </Right>
                </Item> */}
                    <Button rounded block success
                        style={{ margin: 40, marginBottom: 0 }}
                        onPress={this.onBtnConfirmPressed}>
                        <Text style={styles.buttonText}>Confirm</Text>
                    </Button>
                    <Dialog.Container visible={this.state.dialogVisibleConfirmBuy}>
                        <Dialog.Title>Confirm Buy Route</Dialog.Title>
                        <Dialog.Description>
                            Do you want to buy this Route and Confirm your Information ?
                        </Dialog.Description>
                        <Dialog.Button label="Confirm" onPress={this.onBtnConfirmCallApiPressed} />
                        <Dialog.Button label="Cancel" onPress={this.handleConfirmBuyCANCEL} />
                    </Dialog.Container>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        padding: 30,
        paddingTop: 10,
        // backgroundColor: 'lightgrey'
    },
    contentContainer: {
        justifyContent: 'center'
    },
    label: {
        paddingTop: 10,
        fontSize: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 20
    }
})