import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'native-base';
import { Icon } from 'react-native-elements';
import { TouchableOpacity, TouchableNativeFeedback } from 'react-native-gesture-handler';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import formatConstant from '../constants/formatConstant';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class RouteViewComponent extends Component {

    constructor(props) {
        super(props);

        var route = { ...props.route };
        this.initRouteDetail(route);

        this.state = {
            route: route,
        };

        this.onPress = this.onPress.bind(this);
    }

    initRouteDetail(route) {
        route.routeTickets.sort((a, b) => {
            return a.order - b.order;
        });

        route.departureCityName = route.routeTickets[0].departureCityName;
        route.arrivalCityName = route.routeTickets[route.routeTickets.length - 1].arrivalCityName;
        route.departureDate = moment(route.routeTickets[0].departureDateTime).format(formatConstant.DATE);
        route.departureTime = moment(route.routeTickets[0].departureDateTime).format(formatConstant.TIME);
        route.arrivalDate = moment(route.routeTickets[route.routeTickets.length - 1].arrivalDateTime).format(formatConstant.DATE);
        route.arrivalTime = moment(route.routeTickets[route.routeTickets.length - 1].arrivalDateTime).format(formatConstant.TIME);
        route.expiredDate = moment(route.routeTickets[0].departureDateTime).format(formatConstant.DATE_TIME);
    }

    onPress = () => {
        this.props.onRoutePressed(this.state.route);
    }

    render() {
        var { route } = this.state;
        let ticketQuantity = route.routeTickets.length;

        return (
            <TouchableNativeFeedback onPress={this.onPress}>
                <View style={styles.wrapper}>
                    <View style={styles.routeHeader}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>{route.departureCityName} </Text>
                            <Icon name="long-arrow-right" type="font-awesome" color="grey"/>
                            <Text> {route.arrivalCityName}</Text>
                        </View>
                        <View>
                            <NumberFormat value={route.totalAmount}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' $'}
                                renderText={value => (
                                    <Text style={{ fontSize: 20, color: '#d32f2f' }}>{value}</Text>
                                )}
                            />
                        </View>
                    </View>
                    <View style={styles.routeBody}>
                        <View style={styles.routeBodyContent}>
                            <Text style={{ fontSize: 12, color: 'grey' }}>Route</Text>
                            <Text style={{ fontSize: 12, color: 'grey' }}>Departure</Text>
                            <Text style={{ fontSize: 12, color: 'grey' }}>Arrival</Text>
                        </View>
                        <View style={styles.routeBodyContent}>
                            <Text style={{ fontSize: 15 }}>{ticketQuantity} tickets</Text>
                            <Text style={{ fontSize: 12 }}>{route.departureDate}</Text>
                            <Text style={{ fontSize: 12 }}>{route.arrivalDate}</Text>
                        </View>
                        <View style={styles.routeBodyContent}>
                            <Text style={{ fontSize: 12, color: '#28a745' }}>Available</Text>
                            <Text style={{ fontSize: 12 }}>{route.departureTime}</Text>
                            <Text style={{ fontSize: 12 }}>{route.arrivalTime}</Text>
                        </View>
                    </View>
                    <View style={styles.routeFooter}>
                        <Text style={{ fontSize: 12, color: 'red' }}>Expired Date: {route.expiredDate}</Text>
                    </View>
                </View>
            </TouchableNativeFeedback>
        )
    }
}

const styles = StyleSheet.create({
    wrapper: {
        height: height / 4.5,
        width: width / 1.1,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderTopWidth: 0.5,
        borderLeftWidth: 0.5,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'grey',
        margin: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    routeHeader: {
        flex: 1.2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey',
    },
    routeBody: {
        flex: 2,
        flexDirection: 'column',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey',
    },
    routeBodyContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    routeFooter: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'flex-end'
    }
})