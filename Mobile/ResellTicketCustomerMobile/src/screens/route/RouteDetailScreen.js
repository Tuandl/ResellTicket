import { Body, Button, Container, Content, Header, Left, Right, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import NumberFormat from 'react-number-format';
import RouteTicketViewComponent from '../../components/RouteComponent/RouteTicketViewComponent';
import api from '../../service/Api';
import { withNavigationFocus } from 'react-navigation';
import Dialog from "react-native-dialog";

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

class RouteDetailScreen extends Component {

    URL_ROUTE_DETAIL = 'api/route/';

    navigation = null;
    routeId = null;


    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        this.routeId = this.navigation.getParam('routeId');
        this.state = {
            route: {},
            dialogVisibleDelete: false
        };

        this.onBtnBuyRoutePressed = this.onBtnBuyRoutePressed.bind(this);
        this.onBtnDeletePressed = this.onBtnDeletePressed.bind(this);
        this.onBtnBackPressed = this.onBtnBackPressed.bind(this);
        this.getRouteDetail = this.getRouteDetail.bind(this);
        this.initRoute = this.initRoute.bind(this);
        this.deleteRoute = this.deleteRoute.bind(this);
        this.onRouteTicketPressed = this.onRouteTicketPressed.bind(this);
    }

    handleDeleteCANCEL = () => {
        this.setState({
            dialogVisibleDelete: false
        });
    }

    showDialogDelete = () => {
        this.setState({
            dialogVisibleDelete: true
        });
    }



    initRoute(route) {
        if (route === null || route === undefined) return;
        route.routeTickets.sort((a, b) => a.order - b.order);

        route.departureCityName = route.routeTickets[0].departureCityName;
        route.arrivalCityName = route.routeTickets[route.routeTickets.length - 1].arrivalCityName;
    }

    componentDidMount() {
        this.getRouteDetail(this.routeId);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isFocused !== this.props.isFocused) {
            if (this.props.isFocused === true) {
                this.getRouteDetail(this.routeId);
            }
        }
    }

    async getRouteDetail(id) {
        if (id === null || id === undefined) {
            this.navigation.navigate('Route');
            RNToasty.Error({ title: 'Invalid Route Id' });
        } else {
            const response = await api.get(this.URL_ROUTE_DETAIL + id);
            if (response.status === 200) {
                this.initRoute(response.data);
                this.setState({
                    route: response.data,
                });
            } else {
                RNToasty.Error({ title: 'Error when load route detail' });
            }
        }
    }

    async deleteRoute(id) {
        if (id === null || id === undefined) {
            RNToasty.Error({ title: 'Route Id is invalid' });
        } else {
            const response = await api.delete(this.URL_ROUTE_DETAIL + id);
            if (response.status === 200) {
                this.setState({
                    dialogVisibleDelete: false
                });
                RNToasty.Success({ title: 'Delete Route Successfully' });
                this.navigation.pop();
            } else {
                this.setState({
                    dialogVisibleDelete: false
                });
                RNToasty.Error({ title: 'Error when delete route.' });
            }
        }
    }

    onRouteTicketPressed(routeTicket) {
        const navigationData = {
            route: this.state.route,
            selectedRouteTicketId: routeTicket.id,
        };

        this.props.navigation.navigate('RouteTicketUpdate', { data: navigationData });
    }

    renderTickets(routeTickets) {
        if (routeTickets === null || routeTickets === undefined) return;
        return routeTickets.map((routeTicket) =>
            <RouteTicketViewComponent onPress={this.onRouteTicketPressed} routeTicket={routeTicket} key={routeTicket.ticketId} />
        );
    }


    async onBtnBuyRoutePressed() {
        const response = await api.get('api/customer/detail');
        if (response.status === 200) {
            var params = {
                routeId: this.routeId,
                buyerPassengerName: response.data.fullName,
                buyerPassengerEmail: response.data.email,
                buyerPassengerPhone: response.data.phoneNumber
            };
        }
        this.setState({
            dialogVisibleBuyRoute: false
        });

        this.props.navigation.navigate('RouteBuyerInfo', { params: params });
    }

    onBtnDeletePressed() {
        this.deleteRoute(this.routeId);
    }

    onBtnBackPressed() {
        this.navigation.pop();
    }

    render() {
        const { route } = this.state;

        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button transparent onPress={this.onBtnBackPressed}>
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Route Detail</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content style={{ flex: 1, backgroundColor: 'white' }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>

                    <View style={{ width: width, padding: 5 }}>
                        <View>
                            <Text style={styles.ticketCode}>{route.code}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text>{route.departureCityName} </Text>
                            <Icon name="long-arrow-right" type="font-awesome" color="grey" />
                            <Text>{route.arrivalCityName}</Text>
                        </View>
                    </View>

                    <View styles={{ justifyContent: 'center', alignItems: 'center' }}>
                        {this.renderTickets(route.routeTickets)}
                    </View>

                    <View>
                        <NumberFormat value={route.totalAmount}
                            displayType={'text'}
                            thousandSeparator={true}
                            suffix={' $'}
                            renderText={value => (
                                <Text style={{ fontSize: 20, color: '#d32f2f' }}>Total Amount: {value}</Text>
                            )}
                        />
                    </View>

                    <View style={{ justifyContent: 'center', width: width, flexDirection: 'column' }}>
                        <View style={{ paddingTop: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10, flex: 0.5 }}>
                            <Button success onPress={this.onBtnBuyRoutePressed} block>
                                <Text>Buy Route</Text>
                            </Button>
                        </View>
                        <View style={{ paddingTop: 5, paddingBottom: 5, paddingLeft: 10, paddingRight: 10, borderRadius: 10, flex: 0.5 }}>
                            <Button danger onPress={this.showDialogDelete} block>
                                <Text>Delete</Text>
                            </Button>
                            <Dialog.Container visible={this.state.dialogVisibleDelete}>
                                <Dialog.Title>Delete Route</Dialog.Title>
                                <Dialog.Description>
                                    Do you want to Delete this Route ?
                                        </Dialog.Description>
                                <Dialog.Button label="Delete Route" onPress={this.onBtnDeletePressed} />
                                <Dialog.Button label="Cancel" onPress={this.handleDeleteCANCEL} />
                            </Dialog.Container>
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
    }
});

export default withNavigationFocus(RouteDetailScreen);