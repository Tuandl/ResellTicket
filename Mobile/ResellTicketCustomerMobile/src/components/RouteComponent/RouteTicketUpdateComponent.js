import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'native-base';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import convertTicketStatus from './../../helper/convertTicketStatus';
import formatConstant from '../../constants/formatConstant';
import RouteStatus from '../../constants/routeStatus';
import TicketStatus from '../../constants/TicketStatus';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class RouteTicketUpdateComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusColor: '',
            ticket: props.ticket,
            routeStatus: props.routeStatus
        }

        this.onPress = this.onPress.bind(this);
    }

    componentDidMount() {
        this.setStatusColor()
    }

    setStatusColor = () => {
        var { status } = this.state.ticket;
        switch (status) {
            case TicketStatus.PENDING:
                this.setState({
                    statusColor: 'orange'
                })
                break;
            case TicketStatus.INVALID:
                this.setState({
                    statusColor: 'red'
                })
                break;
            case TicketStatus.RENAMEDFAIL:
                this.setState({
                    statusColor: 'red'
                })
                break;
            case TicketStatus.EXPIRED:
                this.setState({
                    statusColor: 'lightgrey'
                })
                break;
            default:
                this.setState({
                    statusColor: '#28a745'
                })
                break;
        }
    }

    onPress() {
        this.props.onPress(this.state.ticket);
    }

    render() {
        const { departureCityName,
            arrivalCityName,
            sellingPrice,
            departureDateTime,
            arrivalDateTime,
            expiredDateTime,
            vehicleName,
            ticketCode,
            isSelected,
            status
        } = this.state.ticket;
        const {routeStatus} = this.state;
        // {   //check hết hạn vé
        //     status === 1 ? this.state.statusColor = 'orange' 
        //     : status === 3 ? this.state.statusColor = 'red' 
        //     : this.state.statusColor = '#28a745'
        // } 

        return (
            <TouchableNativeFeedback onPress={this.onPress}>
                <View style={isSelected === true ? styles.wrapper_selected : styles.wrapper}>
                    <View style={styles.ticketHeader}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>{departureCityName}  </Text>
                            {vehicleName === 'Plane' ? <Icon name="airplane" type="material-community" color="grey" />
                                : vehicleName === 'Bus' ? <Icon name="bus-side" type="material-community" color="grey" />
                                    : <Icon name='train' type="material-community" color="grey" />
                            }
                            <Text>  {arrivalCityName}</Text>
                        </View>
                        <View>
                            <NumberFormat value={sellingPrice}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' $'}
                                renderText={value => (
                                    <Text style={{ fontSize: 20, color: '#d32f2f' }}>{value}</Text>
                                )}
                            />
                        </View>
                    </View>
                    <View style={styles.ticketBody}>
                        <View style={styles.ticketBodyContent}>
                            <Text style={{ fontSize: 12, color: 'grey' }}>Ticket</Text>
                            <Text style={{ fontSize: 12, color: 'grey' }}>Departure</Text>
                            <Text style={{ fontSize: 12, color: 'grey' }}>Arrival</Text>
                        </View>
                        <View style={styles.ticketBodyContent}>
                            {routeStatus === RouteStatus.NEW ? 
                                <Text style={{ fontSize: 12, color: this.state.statusColor }}>{convertTicketStatus.toBuyer(status, null, null)}</Text> 
                                : <Text>{ticketCode}</Text>
                            } 
                            <Text style={{ fontSize: 12 }}>{moment(departureDateTime).format(formatConstant.DATE)}</Text>
                            <Text style={{ fontSize: 12 }}>{moment(arrivalDateTime).format(formatConstant.DATE)}</Text>
                        </View>
                        <View style={styles.ticketBodyContent}>
                            {routeStatus === RouteStatus.NEW ? 
                                <Text style={{ fontSize: 12, opacity: 0 }}>{convertTicketStatus.toBuyer(status, null, null)}</Text> 
                                :  
                                <Text style={{ fontSize: 12, color: this.state.statusColor }}>{convertTicketStatus.toBuyer(status, null, null)}</Text>
                            }
                            <Text style={{ fontSize: 12 }}>{moment(departureDateTime).format(formatConstant.TIME)}</Text>
                            <Text style={{ fontSize: 12 }}>{moment(arrivalDateTime).format(formatConstant.TIME)}</Text>
                        </View>
                    </View>
                    <View style={styles.ticketFooter}>
                        <Text style={{ fontSize: 12, color: 'red' }}>Expired Date: {moment(expiredDateTime).format(formatConstant.DATE_TIME)}</Text>
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
    wrapper_selected: {
        height: height / 4.5,
        width: width / 1.1,
        backgroundColor: "#aee7e8",
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
    ticketHeader: {
        flex: 1.2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey',
    },
    ticketBody: {
        flex: 2,
        flexDirection: 'column',
        borderBottomWidth: 0.5,
        borderBottomColor: 'lightgrey',
    },
    ticketBodyContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    ticketFooter: {
        flex: 0.8,
        justifyContent: 'center',
        alignItems: 'flex-end'
    }
})