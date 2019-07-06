import { Body, Button, Container, Content, DatePicker, Header, Label, Left, View, Right, Title, Item } from 'native-base';
import React, { Component } from 'react';
import { StyleSheet, Text } from 'react-native';
import { RNToasty } from 'react-native-toasty';
import { Icon, Input } from 'react-native-elements';
import api from '../../service/Api';

export default class RouteBuyerInfoScreen extends Component {

    navigation = null;
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        const params = this.navigation.getParam('params');
        this.state = {
            routeId: params.routeId,
            passengerName: '',
            emailBooking: '',
            passengerId: null
        };

        // this.onDateOfBirthChanged = this.onDateOfBirthChanged.bind(this);
        this.onBtnConfirmPressed = this.onBtnConfirmPressed.bind(this);
    }

    componentDidMount() {
        
    }

    // onDateOfBirthChanged(value) {
    //     this.setState({
    //         dateofbirth: value
    //     })
    // }

    async onBtnConfirmPressed () {
        if(this.state.passengerName === '' || this.state.emailBooking === '' || this.state.passengerId === null) {
            RNToasty.Error({
                title: 'Buy route Fail, please input all field!'
            })
        } else {
            var params = { 
                routeId: this.state.routeId,
                emailBooking: this.state.emailBooking,
                passengerName: this.state.passengerName,
                passengerId: this.state.passengerId };
            const resBuyRoute = await api.post('api/route/buy-route', params);
            const { navigation } = this.props;
            if (resBuyRoute.status === 200) {
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
    }

    render() {
        const { 
            passengerName,
            emailBooking,
            passengerId
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
                <Label style={styles.label}>Passenger Name:</Label>
                    <Input

                        onChangeText={passengerName => this.setState({ passengerName })}
                        placeholder="Enter Full Name"
                        value={passengerName}
                        inputStyle={{ fontSize: 15, color: 'black' }}
                    />
                <Label style={styles.label}>IdNumber:</Label>
                    <Input

                            onChangeText={passengerId => this.setState({ passengerId })}
                            placeholder="Enter Id Number"
                            value={passengerId}
                            inputStyle={{ fontSize: 15, color: 'black' }}
                    />
                <Label style={styles.label}>Booking Email:</Label>
                    <Input
                        onChangeText={emailBooking => this.setState({ emailBooking })}
                        placeholder="Enter Email"
                        value={emailBooking}
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