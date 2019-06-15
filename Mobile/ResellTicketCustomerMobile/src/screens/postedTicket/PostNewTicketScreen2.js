import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Container, Header, Body, Title, Item, Picker, Content, Button, Left, Label, Right } from 'native-base';
import { Icon, Input } from 'react-native-elements';
import Api from './../../service/Api';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import DateTimePicker from "react-native-modal-datetime-picker";
import { TouchableNativeFeedback, ScrollView } from 'react-native-gesture-handler';
import { RNToasty } from 'react-native-toasty';

export default class PostNewTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicleId: -1,
            vehicleName: '',
            transportationId: -1,
            transportationName: '',
            ticketTypeId: -1,
            ticketTypeName: '',
            departureCityId: -1,
            departureCityName:'',
            departureStationId: -1,
            departureStationName: '',
            ticket: {

            }
        }
    }

    onSelectValue = (data) => {
        if (data.type === "Vehicles") {
            this.setState({
                vehicleId: data.item.id,
                vehicleName: data.item.name
            })
        } else if (data.type === 'Transportations') {
            this.setState({
                transportationId: data.item.id,
                transportationName: data.item.name
            })
        } else if (data.type === 'TicketTypes') {
            this.setState({
                ticketTypeId: data.item.id,
                ticketTypeName: data.item.name
            })
        } else if (data.type === 'DepartureCities') {
            this.setState({
                departureCityId: data.item.id,
                departureCityName: data.item.name
            })
        } else if (data.type === 'DepartureStations') {
            this.setState({
                departureStationId: data.item.id,
                departureStationName: data.item.name
            })
        }
    }

    onPress = (value) => {
        if (value === 'Vehicles' || value === 'DepartureCities') {
            this.props.navigation.navigate("ValueSelected",
                { onSelectValue: this.onSelectValue, type: value })
        } else if (value === 'Transportations' || value === 'TicketTypes') {
            this.props.navigation.navigate("ValueSelected",
                { onSelectValue: this.onSelectValue, type: value, vehicleId: this.state.vehicleId })
        } else if (value === 'DepartureStations') {
            this.props.navigation.navigate("ValueSelected",
                { onSelectValue: this.onSelectValue, type: value, departureCityId: this.state.departureCityId })
        } 

    }

    render() {
        const { vehicleName, transportationName, ticketTypeName,departureCityName,departureStationName } = this.state
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
                        <Title>
                            Post New Ticket
                        </Title>
                    </Body>
                    <Right />
                </Header>
                <ScrollView>
                    <Content style={styles.content} contentContainerStyle={styles.contentContainer}>
                        <Label style={styles.label}>Vehicle:</Label>
                        <Item onPress={() => this.onPress('Vehicles')} style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{vehicleName}</Text>
                        </Item>
                        <Label style={styles.label}>Transportation:</Label>
                        <Item
                            onPress={() => this.onPress('Transportations')} style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{transportationName}</Text>
                        </Item>
                        <Label style={styles.label}>Ticket Type:</Label>
                        <Item
                            onPress={() => this.onPress('TicketTypes')} style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{ticketTypeName}</Text>
                        </Item>
                        <Label style={styles.label}>Departure City:</Label>
                        <Item
                            onPress={() => this.onPress('DepartureCities')} style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{departureCityName}</Text>
                        </Item><Label style={styles.label}>Departure Station:</Label>
                        <Item
                            onPress={() => this.onPress('DepartureStations')} style={{ height: 30, paddingLeft: 10 }}>
                            <Text style={{ color: 'black' }}>{departureStationName}</Text>
                        </Item>
                    </Content>
                </ScrollView>
            </Container>
        )
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
    }
})