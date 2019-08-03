import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'native-base';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import convertTicketStatus from '../helper/convertTicketStatus';
import TicketStatus from '../constants/TicketStatus';
const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class TicketViewComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            statusColor: '',
            statusTemp: 0
        }
    }

    componentDidMount() {
        var { postedTicket } = this.props
        this.setStatusColor()
        // if (moment(new Date()).isAfter(moment(postedTicket.expiredDateTime))) {
        //     this.state.statusColor = 'lightgrey'
        //     this.setState({
        //         statusTemp: 0
        //     }, () => this.setStatusColor())
        // } else {
        //     this.setState({
        //         statusTemp: postedTicket.status
        //     }, () => this.setStatusColor())
        // }
    }

    componentWillReceiveProps(props) {

    }

    setStatusColor = () => {
        var { postedTicket } = this.props;
        switch (postedTicket.status) {
            case convertTicketStatus.ticketStatus.PENDING:
                this.setState({
                    statusColor: 'orange'
                })
                break;
            case convertTicketStatus.ticketStatus.INVALID:
                this.setState({
                    statusColor: 'red'
                })
                break;
            case convertTicketStatus.ticketStatus.RENAMEDFAIL:
                this.setState({
                    statusColor: 'red'
                })
                break;
            case convertTicketStatus.ticketStatus.EXPIRED:
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



    editTicketOrViewTicketDetails = () => {
        const { postedTicket, navigate, refreshPostedTicket } = this.props;
        var { statusTemp } = this.state;
        if (statusTemp !== 1) {
            navigate('DetailTicket', { refreshPostedTicket: refreshPostedTicket, ticketId: postedTicket.id })
        } else {
            navigate('PostEditTicket', { refreshPostedTicket: refreshPostedTicket, ticketId: postedTicket.id })
        }

    }

    render() {
        const { departureCityName,
            arrivalCityName,
            sellingPrice,
            departureDateTime,
            arrivalDateTime,
            expiredDateTime,
            vehicle,
            ticketCode,
            status } = this.props.postedTicket;
        var { statusTemp, statusColor } = this.state;


        return (
            <TouchableNativeFeedback onPress={this.editTicketOrViewTicketDetails}>
                <View style={styles.wrapper}>
                    <View style={styles.ticketHeader}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>{departureCityName}  </Text>
                            {vehicle === 'Plane' ? <Icon name="airplane" type="material-community" color="grey" />
                                : vehicle === 'Bus' ? <Icon name="bus-side" type="material-community" color="grey" />
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
                            <Text>{ticketCode}</Text>
                            <Text style={{ fontSize: 12 }}>{moment(departureDateTime).format('ddd, MMM DD YYYY')}</Text>
                            <Text style={{ fontSize: 12 }}>{moment(arrivalDateTime).format('ddd, MMM DD YYYY')}</Text>
                        </View>
                        <View style={styles.ticketBodyContent}>
                            <Text style={{ fontSize: 12, color: statusColor }}>{convertTicketStatus.toString(status)}</Text>
                            <Text style={{ fontSize: 12 }}>{moment(departureDateTime).format('HH:mm')}</Text>
                            <Text style={{ fontSize: 12 }}>{moment(arrivalDateTime).format('HH:mm')}</Text>
                        </View>
                    </View>
                    <View style={styles.ticketFooter}>
                        {statusTemp !== TicketStatus.COMPLETED && statusTemp !== TicketStatus.RENAMEDFAIL && statusTemp !== TicketStatus.RENAMEDSUCESS ?
                            <Text style={{ fontSize: 12, color: 'red' }}>Expired Date: {moment(expiredDateTime).format('ddd, MMM DD YYYY HH:mm')}</Text>
                            : null
                        }

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