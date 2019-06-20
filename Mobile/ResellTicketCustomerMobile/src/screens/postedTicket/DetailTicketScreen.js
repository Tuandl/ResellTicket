import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Container, Header, Body, Title, Item, Picker, Content, Button, Left, Label, Right } from 'native-base';
import { Icon, Input } from 'react-native-elements';
import Api from '../../service/Api';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import DateTimePicker from "react-native-modal-datetime-picker";
import { TouchableNativeFeedback, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { RNToasty } from 'react-native-toasty';
import Autocomplete from 'react-native-autocomplete-input';

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
            sellingPrice: '',
            status: ''
        }
    }

    componentDidMount() {
        this.getTicketDetail();
    }

    async getTicketDetail() {
        const ticketId = this.props.navigation.getParam('ticketId');
        const res = await Api.get('api/ticket/detail?ticketId=' + ticketId);
        if (res.status === 200) {
            const ticketDetail = res.data
            this.setState({
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
                sellingPrice: ticketDetail.sellingPrice,
                status: ticketDetail.status
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
            sellingPrice,
            status
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
                    <Content style={styles.content} contentContainerStyle={styles.contentContainer}>
                        <Label style={styles.label}>Vehicle:</Label>
                        <Item style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{vehicleName}</Text>
                        </Item>
                        <Label style={styles.label}>Transportation:</Label>
                        <Item style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{transportationName}</Text>
                        </Item>
                        <Label style={styles.label}>Ticket Type:</Label>
                        <Item style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{ticketTypeName}</Text>
                        </Item>
                        <Label style={styles.label}>Departure City:</Label>
                        <Item style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{departureCityName}</Text>
                        </Item>
                        <Label style={styles.label}>Departure Station:</Label>
                        <Item style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{departureStationName}</Text>
                        </Item>
                        <Label style={styles.label}>Arrival City:</Label>
                        <Item style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{arrivalCityName}</Text>
                        </Item>
                        <Label style={styles.label}>Arrival Station:</Label>
                        <Item style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{arrivalStationName}</Text>
                        </Item>
                        <Label style={styles.label}>Departure Date:</Label>
                        <Item style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{departureDateTime}</Text>
                        </Item>
                        <Label style={styles.label}>Arrival Date:</Label>
                        <Item style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{arrivalDateTime}</Text>
                        </Item>
                        <Label style={styles.label}>Ticket Code:</Label>
                        <Item style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{ticketCode}</Text>
                        </Item>
                        <Label style={styles.label}>Selling Price:</Label>
                        <Item style={{ height: 30, paddingLeft: 10 }}>
                            <NumberFormat value={sellingPrice} displayType={'text'} thousandSeparator={true}
                                suffix={' $'}
                                renderText={value => (
                                    <Text style={{color: 'black'}}>{value}</Text>
                                )}
                            />
                        </Item>
                        {status == 4 ? 
                        <Container>
                        <Button rounded block success
                            style={{ margin: 20, marginBottom: 0 }}
                            onPress={this.confirmTicketRenamed}>
                            <Text style={styles.buttonText}>Confirm Ticket Renamed</Text>
                        </Button>
                        <Button rounded block danger
                            style={{ marginLeft: 60, marginRight: 60, marginTop: 20, marginBottom: 0 }}
                            onPress={this.RefuseTicket}>
                            <Text style={styles.buttonText}>Refuse Ticket</Text>
                        </Button>
                        </Container>
                        : <Button rounded block danger
                            style={{ margin: 40, marginBottom: 0 }}
                            onPress={this.deletePostedTicket}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </Button>}
                        
                    </Content>
                </ScrollView>
            </Container>
        )
    }

    confirmTicketRenamed = async () => {
        const ticketId = this.props.navigation.getParam('ticketId');
        const resConfirmRenamedTicket = await Api.post('api/ticket/confirm-rename?id=' + ticketId);
        const { navigation } = this.props;
        if (resConfirmRenamedTicket.status === 200) {
            RNToasty.Success({
                title: 'Confirm Renamed Ticket Successfully'
            })
            navigation.state.params.refreshPostedTicket();
            navigation.navigate('PostedTicket');
        }
    }

    RefuseTicket = async () => {
        const ticketId = this.props.navigation.getParam('ticketId');
        const resRefuseTicket = await Api.put('api/ticket/refuse?id=' + ticketId);
        const { navigation } = this.props;
        if (resRefuseTicket.status === 200) {
            RNToasty.Success({
                title: 'Refuse Ticket Successfully'
            })
            navigation.state.params.refreshPostedTicket();
            navigation.navigate('PostedTicket');
        }
    }

    deletePostedTicket = async () => {
        const ticketId = this.props.navigation.getParam('ticketId');
        const resDeleteTicket = await Api.delete('api/ticket?ticketId=' + ticketId);
        const { navigation } = this.props;
        if (resDeleteTicket.status === 200) {
            RNToasty.Success({
                title: 'Delete Ticket Successfully'
            })
            navigation.state.params.refreshPostedTicket();
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
    buttonText: {
        color: '#fff',
        fontSize: 20
    }
})