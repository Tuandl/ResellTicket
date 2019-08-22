import React, { Component } from 'react';
import { Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Container, Header, Body, Title, Item, Content, Button, Left, Label, Right } from 'native-base';
import { Icon } from 'react-native-elements';
import Api from '../../service/Api';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { ScrollView } from 'react-native-gesture-handler';
import { RNToasty } from 'react-native-toasty';
import Dialog from "react-native-dialog";
import TicketStatus from '../../constants/TicketStatus';
import colors from '../../config/colors';

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
            isDeleteLoading: false,
            invalidField: {
                isTicketCodeValid: true,
                isVehicleValid: true,
                isTransportationValid: true,
                isTicketTypeValid: true,
                isDepatureValid: true,
                isArrivalValid: true,
                isPassengerNameValid: true,
                isEmailBookingValid: true
            },
            dialogVisibleConfirmTicketRenamed: false,
            dialogVisibleRefuseTicketRenamed: false,
            dialogVisibleDeleteTicket: false
        }
    }

    componentDidMount() {
        this.getTicketDetail();
    }

    showDialogConfirmTicketRenamed = () => {
        this.setState({
            dialogVisibleConfirmTicketRenamed: true
        });
    }

    handleConfirmTicketRenamedCANCEL = () => {
        this.setState({
            dialogVisibleConfirmTicketRenamed: false
        });
    }

    showDialogRefuseTicketRenamed = () => {
        this.setState({
            dialogVisibleRefuseTicketRenamed: true
        });
    }

    handleRefuseTicketRenamedCANCEL = () => {
        this.setState({
            dialogVisibleRefuseTicketRenamed: false
        });
    }

    showDialogDeleteTicket = () => {
        this.setState({
            dialogVisibleDeleteTicket: true
        });
    }

    handleDeleteTicketCANCEL = () => {
        this.setState({
            dialogVisibleDeleteTicket: false
        });
    }

    async getTicketDetail() {
        this.setState({
            isLoading: true
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
                departureDateTime: moment(ticketDetail.departureDateTime).format('ddd, MMM DD YYYY HH:mm'),
                arrivalDateTime: moment(ticketDetail.arrivalDateTime).format('ddd, MMM DD YYYY HH:mm'),
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
            isDeleteLoading,
            invalidField
        } = this.state
        const { navigation } = this.props;
        const isBuyer = this.props.navigation.getParam('isBuyer')
        return (
            <Container style={{ flex: 1 }}>
                <Header color={colors.secondary}>
                    <Left>
                        <Button transparent
                            onPress={() => navigation.pop()}>
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
                            <Label style={!invalidField.isVehicleValid && status === 3 ? styles.invalidLabel : styles.label}>Vehicle</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{vehicleName}</Text>
                            </Item>
                            <Label style={!invalidField.isTransportationValid && status === 3 ? styles.invalidLabel : styles.label}>Transportation</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{transportationName}</Text>
                            </Item>
                            <Label style={!invalidField.isTicketTypeValid && status === 3 ? styles.invalidLabel : styles.label}>Ticket Type</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{ticketTypeName}</Text>
                            </Item>
                            <Label style={!invalidField.isDepartureValid && status === 3 ? styles.invalidLabel : styles.label}>Departure City</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{departureCityName}</Text>
                            </Item>
                            <Label style={!invalidField.isDepartureValid && status === 3 ? styles.invalidLabel : styles.label}>Departure Station</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{departureStationName}</Text>
                            </Item>
                            <Label style={!invalidField.isArrivalValid && status === 3 ? styles.invalidLabel : styles.label}>Arrival City</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{arrivalCityName}</Text>
                            </Item>
                            <Label style={!invalidField.isArrivalValid && status === 3 ? styles.invalidLabel : styles.label}>Arrival Station</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{arrivalStationName}</Text>
                            </Item>
                            <Label style={!invalidField.isDepartureValid && status === 3 ? styles.invalidLabel : styles.label}>Departure Date</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{departureDateTime}</Text>
                            </Item>
                            <Label style={!invalidField.isArrivalValid && status === 3 ? styles.invalidLabel : styles.label}>Arrival Date</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{arrivalDateTime}</Text>
                            </Item>
                            <Label style={!invalidField.isTicketCodeValid && status === 3 ? styles.invalidLabel : styles.label}>Ticket Code</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{ticketCode}</Text>
                            </Item>
                            <Label style={!invalidField.isPassengerNameValid && status === 3 ? styles.invalidLabel : styles.label}>Passenger Name</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{passengerName}</Text>
                            </Item>
                            <Label style={!invalidField.isEmailBookingValid && status === 3 ? styles.invalidLabel : styles.label}>Email Booking</Label>
                            <Item style={styles.detail}>
                                <Text style={{ color: 'black' }}>{emailBooking}</Text>
                            </Item>
                            <Label style={styles.label}>Selling Price</Label>
                            <Item style={styles.detail}>
                                <NumberFormat value={sellingPrice} displayType={'text'} thousandSeparator={true}
                                    suffix={' $'}
                                    renderText={value => (
                                        <Text style={{ color: 'black' }}>{value}</Text>
                                    )}
                                />
                            </Item>
                            {status == TicketStatus.BOUGHT ?
                                <Container>
                                    <Button block primary
                                        style={{ margin: 10, marginTop: 40 }}
                                        onPress={this.PassengerInformation}>
                                        <Text style={styles.buttonText}>View Passenger Information</Text>
                                    </Button>
                                    <Button block primary
                                        style={{ margin: 10, marginTop: 10 }}
                                        onPress={this.showDialogConfirmTicketRenamed}>
                                        {isConfirmLoading ? <ActivityIndicator size="small" animating color="#fff" />
                                            : <Text style={styles.buttonText}>Confirm Ticket Renamed</Text>}
                                    </Button>
                                    <Dialog.Container visible={this.state.dialogVisibleConfirmTicketRenamed}>
                                        <Dialog.Title>Confirm Ticket Renamed</Dialog.Title>
                                        <Dialog.Description>
                                            Do you want to Confirm Renamed this Ticket?
                                        </Dialog.Description>
                                        <Dialog.Button label="Rename" onPress={this.confirmTicketRenamed} />
                                        <Dialog.Button label="Cancel" onPress={this.handleConfirmTicketRenamedCANCEL} />
                                    </Dialog.Container>
                                    <Button block danger
                                        style={{ margin: 10, marginTop: 10}}
                                        onPress={this.showDialogRefuseTicketRenamed}>
                                        {isRefuseLoading ? <ActivityIndicator size="small" animating color="#fff" />
                                            : <Text style={styles.buttonText}>Refuse Ticket Renamed</Text>}
                                    </Button>
                                    <Dialog.Container visible={this.state.dialogVisibleRefuseTicketRenamed}>
                                        <Dialog.Title>Refuse Ticket Renamed</Dialog.Title>
                                        <Dialog.Description>
                                            Do you want to Refuse to rename this Ticket ?
                                        </Dialog.Description>
                                        <Dialog.Button label="Refuse" onPress={this.RefuseTicket} />
                                        <Dialog.Button label="Cancel" onPress={this.handleRefuseTicketRenamedCANCEL} />
                                    </Dialog.Container>
                                </Container>
                                : isBuyer === undefined && status !== TicketStatus.RENAMED && status !== TicketStatus.RENAMEDSUCESS ?
                                <Button block danger
                                    style={{ margin: 10, marginTop: 40 }}
                                    onPress={this.showDialogDeleteTicket}>
                                    {isDeleteLoading ? <ActivityIndicator size="small" animating color="#fff" />
                                        : <Text style={styles.buttonText}>Delete</Text>}
                                </Button> : null}
                            <Dialog.Container visible={this.state.dialogVisibleDeleteTicket}>
                                <Dialog.Title>Delete Ticket</Dialog.Title>
                                <Dialog.Description>
                                    Do you want to Delete this Ticket ?
                                        </Dialog.Description>
                                <Dialog.Button label="Delete" onPress={this.deletePostedTicket} />
                                <Dialog.Button label="Cancel" onPress={this.handleDeleteTicketCANCEL} />
                            </Dialog.Container>
                        </Content>
                    }
                </ScrollView>
            </Container>
        )
    }

    PassengerInformation = async () => {
        const ticketId = this.props.navigation.getParam('ticketId');
        const params = {
            ticketId: ticketId
        }
        const { navigation } = this.props;
        navigation.navigate('PassengerInfo', { params: params });
    }

    confirmTicketRenamed = async () => {
        this.setState({
            isConfirmLoading: true,
            showDialogConfirmTicketRenamed: false
        })
        const ticketId = this.props.navigation.getParam('ticketId');
        const resConfirmRenamedTicket = await Api.put('api/ticket/confirm-rename?id=' + ticketId);
        const { navigation } = this.props;
        if (resConfirmRenamedTicket.status === 200) {
            this.setState({
                isConfirmLoading: false,
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
            isRefuseLoading: true,
            dialogVisibleRefuseTicketRenamed: false
        })
        const ticketId = this.props.navigation.getParam('ticketId');
        const resRefuseTicket = await Api.put('api/ticket/refuse?id=' + ticketId);
        const { navigation } = this.props;
        if (resRefuseTicket.status === 200) {
            this.setState({
                isRefuseLoading: false,
                
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
            isDeleteLoading: true,
            dialogVisibleDeleteTicket: false
        })
        const ticketId = this.props.navigation.getParam('ticketId');
        const index = this.props.navigation.getParam('index');
        const resDeleteTicket = await Api.delete('api/ticket?ticketId=' + ticketId);
        const { navigation } = this.props;
        if (resDeleteTicket.status === 200) {
            this.setState({
                isDeleteLoading: false,
            })
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