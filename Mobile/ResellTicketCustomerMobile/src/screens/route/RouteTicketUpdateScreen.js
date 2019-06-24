import moment from 'moment';
import { Body, Button, Container, Content, Header, Left, Right, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import RouteTicketUpdateComponent from '../../components/RouteComponent/RouteTicketUpdateComponent';
import formatConstant from '../../constants/formatConstant';
import api from '../../service/Api';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

export default class RouteTicketUpdateScreen extends Component {

    URL_ROUTE_TICKET = 'api/route/route-ticket/';

    navigation = null;

    constructor(props) {
        super(props);
        this.navigation = props.navigation;

        const data = this.navigation.getParam('data');

        this.state = {
            route: data.route,
            selectedRouteTicketId: data.selectedRouteTicketId,
            tickets: [],
        };

        this.getUpdatableTickets = this.getUpdatableTickets.bind(this);
        this.onTicketPressed = this.onTicketPressed.bind(this);
        this.renderTickets = this.renderTickets.bind(this);
        this.onBtnBackPressed = this.onBtnBackPressed.bind(this);
        this.getSelectedRouteTicket = this.getSelectedRouteTicket.bind(this);
        this.getRouteTicketByOrderNumber = this.getRouteTicketByOrderNumber.bind(this);
        this.onUpdatePressed = this.onUpdatePressed.bind(this);
    }

    componentDidMount() {
        this.getUpdatableTickets(this.state.selectedRouteTicketId);
    }

    async getUpdatableTickets(routeTicketId) {
        if(routeTicketId === null || routeTicketId === undefined) {
            RNToasty.Error({ title: 'Invalid Ticket Id' });
        } else {
            const response = await api.get(`${this.URL_ROUTE_TICKET}${routeTicketId}/ticket`);
            if(response.status === 200) {
                this.setState({
                    ...this.state,
                    tickets: response.data,
                })
            } else {
                RNToasty.Error({ title: 'Error when loading Updatable tickets' });
            }
        }
    }

    onTicketPressed(pressedTicket) {
        const tickets = [...this.state.tickets];
        tickets.forEach(ticket => {
            if(ticket.id === pressedTicket.id) {
                ticket.isSelected = true;
            } else {
                ticket.isSelected = false;
            }
        });
        this.setState({
            ...this.state,
            tickets: tickets,
        });
    }

    renderTickets(tickets) {
        if(tickets === null || tickets === undefined) return;
        return tickets.map((ticket) => 
            <RouteTicketUpdateComponent ticket={ticket} onPress={this.onTicketPressed} key={ticket.id}/>
        );
    }

    onBtnBackPressed() {
        this.navigation.pop();
    }

    getSelectedRouteTicket() {
        return this.state.route.routeTickets.find(routeTicket => 
            routeTicket.id == this.state.selectedRouteTicketId
        );
    }

    getRouteTicketByOrderNumber(orderNumber) {
        return this.state.route.routeTickets.find(routeTicket => 
            routeTicket.order === orderNumber
        );
    }

    async onUpdatePressed() {
        const selectedTicket = this.state.tickets.find(ticket => 
            ticket.isSelected === true
        );
        
        if(selectedTicket === undefined) {
            RNToasty.Error({title: 'Please selected a new ticket!'});
            return;
        }
        
        const params = {
            routeTicketId: this.state.selectedRouteTicketId,
            newTicketId: selectedTicket.id,
        };

        const response = await api.put(`${this.URL_ROUTE_TICKET}`, params);
        if(response.status === 200) {
            RNToasty.Success({title: 'Update Route Ticket successfully'});
            this.navigation.pop();
        } else {
            RNToasty.Error({ title: 'Update Route Ticket Failed!' });
        }
    }

    render() {
        const { route, tickets } = this.state;
        const currentRouteTicket = this.getSelectedRouteTicket();
        const preRouteTicket = this.getRouteTicketByOrderNumber(currentRouteTicket.order - 1);
        const nextRouteTicket = this.getRouteTicketByOrderNumber(currentRouteTicket.order + 1);
        let fromDate = new Date();
        let toDate = null;

        if(preRouteTicket !== undefined) fromDate = preRouteTicket.arrivalDateTime;
        if(nextRouteTicket !== undefined) toDate = nextRouteTicket.departureDateTime;

        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button transparent onPress={this.onBtnBackPressed}>
                            <Icon name="arrow-left" type="material-community" color="#fff"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Change Ticket</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content style={{ flex: 1, backgroundColor: 'white' }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                    
                    <View style={{ width: width, padding: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 0.45 }}>
                                <Text style={{ textAlign: 'center' }}>{route.departureCityName} </Text>
                                <Text style={{ textAlign: 'center' }}>{moment(fromDate).format(formatConstant.DATE)} </Text>
                                <Text style={{ textAlign: 'center' }}>{moment(fromDate).format(formatConstant.TIME)} </Text>
                            </View>
                            <View style={{ flex: 0.1, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon name="long-arrow-right" type="font-awesome" color="grey"/>
                            </View>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', flex: 0.45 }}>
                                <Text style={{ textAlign: 'center' }}>{route.arrivalCityName}</Text>
                                <Text style={{ textAlign: 'center' }}>{toDate === null ? '...' : moment(toDate).format(formatConstant.DATE)}</Text>
                                <Text style={{ textAlign: 'center' }}>{toDate === null ? '...' : moment(toDate).format(formatConstant.TIME)}</Text>
                            </View>
                        </View>
                    </View>

                    <View styles={{ justifyContent: 'center', alignItems: 'center' }}>
                        {this.renderTickets(tickets)}
                    </View>

                    <View style={{ justifyContent: 'center', width: width, flexDirection: 'column' }}>
                        <View style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10, flex: 1 }}>
                            <Button success onPress={this.onUpdatePressed} block>
                                <Text>Update</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}


const styles = StyleSheet.create({
    ticketCode: {
        fontWeight: 'bold',
        fontSize: 25,
        textAlign: 'center',
    },
});

