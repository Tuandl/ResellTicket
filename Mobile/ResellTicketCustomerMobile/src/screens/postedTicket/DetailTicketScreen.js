import React, { Component } from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Container, Header, Body, Title, Item, Content, Button, Left, Label, Right } from 'native-base';
import { Icon } from 'react-native-elements';
import Api from '../../service/Api';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { ScrollView } from 'react-native-gesture-handler';
import { RNToasty } from 'react-native-toasty';

export default class DetailTicketScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicleName: '',
            transportationName: '',
            ticketTypeName: '',
            departureCityName: '',
            departureStationName: '',
            departureDateTime: '',
            arrivalCityName: '',
            arrivalStationName: '',
            arrivalDateTime: '',
            ticketCode: '',
            passengerName: '',
            emailBooking: '',
            sellingPrice: '',
            status: '',
            isLoading: false,
            isConfirmLoading: false,
            isRefuseLoading: false,
            invalidField: {
                isTicketCodeValid: true,
                isVehicleValid: true,
                isTransportationValid: true,
                isTicketTypeValid: true,
                isDepatureValid: true,
                isArrivalValid: true,
                isPassengerNameValid: true,
                isEmailBookingValid: true
            }
        }
    }

    componentDidMount() {
        this.getTicketDetail();
    }

    async getTicketDetail() {
        this.setState({
            isLoading : true
        })
        const ticketId = this.props.navigation.getParam('ticketId');
        const res = await Api.get('api/ticket/detail?ticketId=' + ticketId);
        if (res.status === 200) {
            const ticketDetail = res.data
            this.setState({
                isLoading: false,
                vehicleName: ticketDetail.vehicleName,
                transportationName: ticketDetail.transportationName,
                ticketTypeName: ticketDetail.ticketTypeName,
                departureCityName: ticketDetail.departureCityName,
                departureStationName: ticketDetail.departureStationName,
                arrivalCityName: ticketDetail.arrivalCityName,
                arrivalStationName: ticketDetail.arrivalStationName,
                departureDateTime: moment(ticketDetail.departureDateTime).format('YYYY-MM-DD HH:mm'),
                arrivalDateTime: moment(ticketDetail.arrivalDateTime).format('YYYY-MM-DD HH:mm'),
                ticketCode: ticketDetail.ticketCode,
                passengerName: ticketDetail.passengerName,
                emailBooking: ticketDetail.emailBooking,
                sellingPrice: ticketDetail.sellingPrice,
                status: ticketDetail.status,
                invalidField: {
                    isTicketCodeValid: ticketDetail.isTicketCodeValid,
                    isVehicleValid: ticketDetail.isVehicleValid,
                    isTransportationValid: ticketDetail.isTransportationValid,
                    isTicketTypeValid: ticketDetail.isTicketTypeValid,
                    isDepartureValid: ticketDetail.isDepartureValid,
                    isArrivalValid: ticketDetail.isArrivalValid,
                    isPassengerNameValid: ticketDetail.isPassengerNameValid,
                    isEmailBookingValid: ticketDetail.isEmailBookingValid
                }
            })
        }
    }

    render() {
        const {
            vehicleName,
            transportationName,
            ticketTypeName,
            departureCityName,
            departureStationName,
            departureDateTime,
            arrivalCityName,
            arrivalStationName,
            arrivalDateTime,
            ticketCode,
            passengerName,
            emailBooking,
            sellingPrice,
            status,
            isLoading,
            isConfirmLoading,
            isRefuseLoading,
            invalidField
        } = this.state
        const { navigate } = this.props.navigation;
        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button
                            onPress={() => navigate('PostedTicket')}>
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Ticket Detail</Title>
                    </Body>
                    <Right />
                </Header>
                <ScrollView>
                    {isLoading ? <ActivityIndicator size="large" animating /> :
                        <Content style={styles.content} contentContainerStyle={styles.contentContainer}>
                            {/* {status === 3 ?
                            <Text style={{ color: 'red', marginBottom: 10, marginTop: 10 }}>
                                There are some information of your ticket are invalid(red inputs). Please post a new ticket and check all inputs carefully.
                            </Text> : null} */}
                            <Label style={!invalidField.isVehicleValid && status === 3 ? styles.invalidLabel : styles.label}>Vehicle:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{vehicleName}</Text>
                            </Item>
                            <Label style={!invalidField.isTransportationValid && status === 3 ? styles.invalidLabel : styles.label}>Transportation:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{transportationName}</Text>
                            </Item>
                            <Label style={!invalidField.isTicketTypeValid && status === 3 ? styles.invalidLabel : styles.label}>Ticket Type:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{ticketTypeName}</Text>
                            </Item>
                            <Label style={!invalidField.isDepartureValid && status === 3 ? styles.invalidLabel : styles.label}>Departure City:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{departureCityName}</Text>
                            </Item>
                            <Label style={!invalidField.isDepartureValid && status === 3 ? styles.invalidLabel : styles.label}>Departure Station:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{departureStationName}</Text>
                            </Item>
                            <Label style={!invalidField.isArrivalValid && status === 3 ? styles.invalidLabel : styles.label}>Arrival City:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{arrivalCityName}</Text>
                            </Item>
                            <Label style={!invalidField.isArrivalValid && status === 3 ? styles.invalidLabel : styles.label}>Arrival Station:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{arrivalStationName}</Text>
                            </Item>
                            <Label style={!invalidField.isDepartureValid && status === 3 ? styles.invalidLabel : styles.label}>Departure Date:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{departureDateTime}</Text>
                            </Item>
                            <Label style={!invalidField.isArrivalValid && status === 3 ? styles.invalidLabel : styles.label}>Arrival Date:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{arrivalDateTime}</Text>
                            </Item>
                            <Label style={!invalidField.isTicketCodeValid && status === 3 ? styles.invalidLabel : styles.label}>Ticket Code:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{ticketCode}</Text>
                            </Item>
                            <Label style={!invalidField.isPassengerNameValid && status === 3 ? styles.invalidLabel : styles.label}>Passenger Name:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{passengerName}</Text>
                            </Item>
                            <Label style={!invalidField.isEmailBookingValid && status === 3 ? styles.invalidLabel : styles.label}>emailBooking:</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{emailBooking}</Text>
                            </Item>
                            <Label style={styles.label}>Selling Price:</Label>
                            <Item style={styles.detail}>
                                <NumberFormat value={sellingPrice} displayType={'text'} thousandSeparator={true}
                                    suffix={' $'}
                                    renderText={value => (
                                        <Text style={{ color: 'black' }}>{value}</Text>
                                    )}
                                />
                            </Item>
                            {status == 4 ?
                                <Container>
                                    <Button rounded block success
                                        style={{ margin: 20, marginBottom: 0 }}
                                        onPress={this.confirmTicketRenamed}>
                                        {isConfirmLoading ?  <ActivityIndicator size="small" animating color="#fff" /> 
                                        : <Text style={styles.buttonText}>Confirm Ticket Renamed</Text>}
                                    </Button>
                                    <Button rounded block danger
                                        style={{ marginTop: 20, marginBottom: 0 }}
                                        onPress={this.RefuseTicket}>
                                        {isRefuseLoading ? <ActivityIndicator size="small" animating color="#fff" /> 
                                        : <Text style={styles.buttonText}>Refuse Ticket Renamed</Text>}
                                    </Button>
                                </Container>
                                : <Button rounded block danger
                                    style={{ margin: 40, marginBottom: 0 }}
                                    onPress={this.deletePostedTicket}>
                                    {isLoading ? <ActivityIndicator size="small" animating color="#fff" />
                                        : <Text style={styles.buttonText}>Delete</Text>}
                                </Button>}
                        </Content>
                    }
                </ScrollView>
            </Container>
        )
    }

    confirmTicketRenamed = async () => {
        this.setState({
            isConfirmLoading: true
        })
        const ticketId = this.props.navigation.getParam('ticketId');
        const resConfirmRenamedTicket = await Api.post('api/ticket/confirm-rename?id=' + ticketId);
        const { navigation } = this.props;
        if (resConfirmRenamedTicket.status === 200) {
            this.setState({
                isConfirmLoading: false
            })
            RNToasty.Success({
                title: 'Confirm Renamed Ticket Successfully'
            })
            navigation.state.params.refreshPostedTicket();
            navigation.navigate('PostedTicket');
        }
    }

    RefuseTicket = async () => {
        this.setState({
            isRefuseLoading: true
        })
        const ticketId = this.props.navigation.getParam('ticketId');
        const resRefuseTicket = await Api.put('api/ticket/refuse?id=' + ticketId);
        const { navigation } = this.props;
        if (resRefuseTicket.status === 200) {
            this.setState({
                isRefuseLoading: false
            })
            RNToasty.Success({
                title: 'Refuse Ticket Successfully'
            })
            navigation.state.params.refreshPostedTicket();
            navigation.navigate('PostedTicket');
        }
    }

    deletePostedTicket = async () => {
        this.setState({
            isLoading: true
        })
        const ticketId = this.props.navigation.getParam('ticketId');
        const index = this.props.navigation.getParam('index');
        const resDeleteTicket = await Api.delete('api/ticket?ticketId=' + ticketId);
        const { navigation } = this.props;
        if (resDeleteTicket.status === 200) {
            this.setState({ isLoading: false })
            RNToasty.Success({
                title: 'Delete Ticket Successfully'
            })
            navigation.state.params.refreshPostedTicket(null, index);
            navigation.navigate('PostedTicket');
        }
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
    invalidLabel: {
        paddingTop: 10,
        fontSize: 10,
        color: 'red'
    },
    detail: {
        height: 30,
        paddingLeft: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 20
    }
})