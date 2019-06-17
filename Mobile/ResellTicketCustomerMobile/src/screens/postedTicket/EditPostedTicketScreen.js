import React, { Component } from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import { Container, Header, Body, Title, Item, Picker, Content, Button, Left, Label, Right } from 'native-base';
import { Icon, Input } from 'react-native-elements';
import Api from './../../service/Api';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import DateTimePicker from "react-native-modal-datetime-picker";
import { TouchableNativeFeedback, ScrollView } from 'react-native-gesture-handler';
import { RNToasty } from 'react-native-toasty';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class EditPostedTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicleId: -1,
            transportationId: -1,
            ticketTypeId: -1,
            ticketCode: '',
            sellingPrice: '',

            departureVisible: false,
            departureCityId: -1, //id
            departureStationId: -1,
            departureDateTime: '',
            departureDateTimeUI: '',

            arrivalVisible: false,
            arrivalCityId: -1, //id
            arrivalStationId: -1,
            arrivalDateTime: '',
            arrivalDateTimeUI: '',

            vehicles: [],
            transportations: [],
            ticketTypes: [],
            cities: [],
            departStations: [],
            arrivalStations: [],
        }
    }

    componentWillMount() {
        this.getVehicles();
        this.getCities();
    }

    componentDidMount() {
    }

    async getTicketDetail() {
        const ticketId = this.props.navigation.getParam('ticketId');
        const resTicketDetail = await Api.get('api/ticket/detail?ticketId=' + ticketId);
        if (resTicketDetail.status === 200) {
            const ticketDetail = resTicketDetail.data
            this.onVehicleChange(ticketDetail.vehicleId)
            this.onTransportationChange(ticketDetail.transportationId)
            this.onTicketTypeChange(ticketDetail.ticketTypeId)
            this.onDepartCityChange(ticketDetail.departureCityId)
            this.onDepartStationChange(ticketDetail.departureStationId)
            this.onArrivalCityChange(ticketDetail.arrivalCityId)
            this.onArrivalStationChange(ticketDetail.arrivalStationId)
            this.setState({
                departureDateTime: moment(ticketDetail.departureDateTime).format('YYYY-MM-DD HH:mm'),
                departureDateTimeUI: moment(ticketDetail.departureDateTime).format('MMM DD YYYY HH:mm'),
                arrivalDateTime: moment(ticketDetail.arrivalDateTime).format('YYYY-MM-DD HH:mm'),
                arrivalDateTimeUI: moment(ticketDetail.arrivalDateTime).format('MMM DD YYYY HH:mm'),
                ticketCode: ticketDetail.ticketCode,
                sellingPrice: ticketDetail.sellingPrice
            })
        }
    }

    async getVehicles() {
        const resVehicle = await Api.get('api/vehicle');
        if (resVehicle.status === 200) {
            this.setState({
                vehicles: resVehicle.data
            })
        }
    }

    async getCities() {
        const resCity = await Api.get('api/city');
        if (resCity.status === 200) {
            this.setState({
                cities: resCity.data
            })
        }
        this.getTicketDetail();
    }

    async getDepartStations(value) {
        if (value !== -1) {
            const resStation = await Api.get('api/station?cityId=' + value);
            if (resStation.status === 200) {
                this.setState({
                    departStations: resStation.data
                })
            }
        }
    }

    async getArrivalStations(value) {
        if (value !== -1) {
            const resStation = await Api.get('api/station?cityId=' + value);
            if (resStation.status === 200) {
                this.setState({
                    arrivalStations: resStation.data
                })
            }
        }
    }

    async getTransportations(value) {
        const resTrans = await Api.get('api/transportation?vehicleId=' + value);
        if (resTrans.status === 200) {
            this.setState({
                transportations: resTrans.data
            })
        }
    }

    async getTicketTypes(value) {
        const resTicketType = await Api.get('api/ticketType?vehicleId=' + value);
        if (resTicketType.status === 200) {
            this.setState({
                ticketTypes: resTicketType.data
            })
        }
    }

    onVehicleChange(value) {
        this.setState({
            vehicleId: value
        })
        this.getTransportations(value);
        this.getTicketTypes(value);
    }

    onTransportationChange(value) {
        this.setState({
            transportationId: value
        })
    }

    onTicketTypeChange(value) {
        this.setState({
            ticketTypeId: value
        })
    }

    //Departure
    onDepartCityChange(value) {
        var { arrivalCityId } = this.state;
        if (arrivalCityId !== -1 && arrivalCityId === value) {
            RNToasty.Error({
                title: 'Invalid Departure City'
            })
            this.setState({
                departureCityId: -1
            })
        } else {
            this.setState({
                departureCityId: value
            })
            this.getDepartStations(value)
        }
    }

    onDepartStationChange(value) {
        this.setState({
            departureStationId: value
        })
    }

    showDepartureDateTimePicker = () => {
        this.setState({ departureVisible: true });
    };

    hideDepartureDateTimePicker = () => {
        this.setState({ departureVisible: false });
    };

    handleDepartureDateTimePicked = dateTime => {
        dateTime = moment(dateTime).format('YYYY-MM-DD HH:mm');
        var { arrivalDateTime } = this.state;
        if (arrivalDateTime !== '' && !moment(dateTime).isBefore(moment(arrivalDateTime))) {
            RNToasty.Error({
                title: 'Invalid Departure Date',
            });
            this.setState({
                departureDateTime: '',
                departureDateTimeUI: '',
            })
        } else {
            this.setState({
                departureDateTime: dateTime,
                departureDateTimeUI: moment(dateTime).format('MMM DD YYYY HH:mm')
            })
        }
        this.hideDepartureDateTimePicker();
    };

    //Arrival
    onArrivalCityChange(value) {
        var { departureCityId } = this.state;
        if (departureCityId !== -1 && departureCityId === value) {
            RNToasty.Error({
                title: 'Invalid Arrival City'
            })
            this.setState({
                arrivalCityId: -1
            })
        } else {
            this.setState({
                arrivalCityId: value
            })
            this.getArrivalStations(value)
        }

    }

    onArrivalStationChange(value) {
        this.setState({
            arrivalStationId: value
        })
    }

    showArrivalDateTimePicker = () => {
        this.setState({ arrivalVisible: true });
    };

    hideArrivalDateTimePicker = () => {
        this.setState({ arrivalVisible: false });
    };

    handleArrivalDateTimePicked = dateTime => {
        dateTime = moment(dateTime).format('YYYY-MM-DD HH:mm');
        var { departureDateTime } = this.state;
        if (departureDateTime !== '' && !moment(departureDateTime).isBefore(moment(dateTime))) {
            RNToasty.Error({
                title: 'Invalid Arrival Date',
            });
            this.setState({
                arrivalDateTime: '',
                arrivalDateTimeUI: '',
            })
        } else {
            this.setState({
                arrivalDateTime: dateTime,
                arrivalDateTimeUI: moment(dateTime).format('MMM DD YYYY HH:mm')
            })
        }

        this.hideArrivalDateTimePicker();
    };

    editPostedTicket = async () => {
        const { transportationId, ticketTypeId, departureStationId, arrivalStationId,
            ticketCode, sellingPrice, departureDateTime, arrivalDateTime } = this.state;
        const { navigation } = this.props;
        const ticketId = this.props.navigation.getParam('ticketId');

        if (transportationId !== -1 && ticketTypeId !== -1 && departureStationId !== -1 && arrivalStationId !== -1
            && ticketCode !== '' && sellingPrice !== '' && departureDateTime !== '' && arrivalDateTime !== '') {
            var ticket = {
                id: ticketId,
                ticketCode: ticketCode,
                transportationId: transportationId,
                departureStationId: departureStationId,
                arrivalStationId: arrivalStationId,
                sellingPrice: sellingPrice,
                description: '',
                departureDateTime: departureDateTime,
                arrivalDateTime: arrivalDateTime,
                ticketTypeId: ticketTypeId
            }
            const resEditTicket = await Api.put('api/ticket', ticket);
            if (resEditTicket.status === 200) {
                RNToasty.Success({
                    title: 'Edit Ticket Successfully'
                })
                navigation.state.params.refreshPostedTicket();
                navigation.navigate('PostedTicket');
            }
        } else {
            RNToasty.Error({
                title: 'Please input required fields'
            })
        }
    }

    deletePostedTicket = async () => {
        const ticketId = this.props.navigation.getParam('ticketId');
        const resDeleteTicket = await Api.delete('api/ticket?ticketId=' + ticketId);
        const { navigation } = this.props;
        if(resDeleteTicket.status === 200) {
            RNToasty.Success({
                title: 'Delete Ticket Successfully'
            })
            navigation.state.params.refreshPostedTicket();
            navigation.navigate('PostedTicket');
        }
    }

    render() {
        const { vehicleId,
            transportationId,
            ticketTypeId,
            departureCityId,
            departureStationId,
            arrivalCityId,
            arrivalStationId,
            vehicles,
            transportations,
            ticketTypes,
            cities,
            departStations,
            departureDateTimeUI,
            arrivalStations,
            arrivalDateTimeUI,
            ticketCode,
            sellingPrice
        } = this.state
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
                            Edit Ticket
                        </Title>
                    </Body>
                    <Right />
                </Header>
                <ScrollView>
                    <Content style={styles.content}
                        contentContainerStyle={styles.contentContainer}>
                        {/* Select Vehicle */}
                        <Label style={styles.label}>Vehicle:</Label>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ height: 30 }}
                                selectedValue={vehicleId}
                                onValueChange={this.onVehicleChange.bind(this)}
                            >
                                <Picker.Item label="" value={-1} />
                                {vehicles.map((vehicle, index) => {
                                    return (<Picker.Item label={vehicle.name} value={vehicle.id} key={index} />)
                                })}
                            </Picker>
                        </Item>
                        {/* Select Transportation */}
                        <Label style={styles.label}>Transportation:</Label>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ height: 30 }}
                                placeholder="Transportation"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={transportationId}
                                onValueChange={this.onTransportationChange.bind(this)}
                            >
                                <Picker.Item label="" value={-1} />
                                {transportations.map((transportation, index) => {
                                    return (<Picker.Item label={transportation.name} value={transportation.id} key={index} />)
                                })}
                            </Picker>
                        </Item>

                        {/* Select Ticket Type */}
                        <Label style={styles.label}>Ticket Type:</Label>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ height: 30 }}
                                placeholder="TicketType"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={ticketTypeId}
                                onValueChange={this.onTicketTypeChange.bind(this)}

                            >
                                <Picker.Item label="" value={-1} />
                                {ticketTypes.map((ticketType, index) => {
                                    return (<Picker.Item label={ticketType.name} value={ticketType.id} key={index} />)
                                })}
                            </Picker>
                        </Item>
                        {/* Select Departure City */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Departure City:</Label>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ height: 30 }}
                                placeholder="Departure City"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={departureCityId}
                                onValueChange={this.onDepartCityChange.bind(this)}
                            >
                                <Picker.Item label="" value={-1} />
                                {cities.map((city, index) => {
                                    return (<Picker.Item label={city.name} value={city.id} key={index} />)
                                })}
                            </Picker>
                        </Item>

                        {/* Select Departure Station */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Departure Station:</Label>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ height: 30 }}
                                placeholder="Departure Station"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={departureStationId}
                                onValueChange={this.onDepartStationChange.bind(this)}
                            >
                                <Picker.Item label="" value={-1} />
                                {departStations.map((station, index) => {
                                    return (<Picker.Item label={station.name} value={station.id} key={index} />)
                                })}
                            </Picker>
                        </Item>
                        {/* Select Departure Datetime */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Departure Date:</Label>
                        <Item>
                            <Text style={{ padding: 10, paddingTop: 5, color: 'black' }}>{departureDateTimeUI}</Text>
                            <DateTimePicker
                                isVisible={this.state.departureVisible}
                                onConfirm={this.handleDepartureDateTimePicked}
                                onCancel={this.hideDepartureDateTimePicker}
                                mode={'datetime'}
                                minimumDate={new Date()} />
                            <Right>
                                <TouchableNativeFeedback onPress={this.showDepartureDateTimePicker}>
                                    <Icon name="calendar-check" type="material-community" color="grey" />
                                </TouchableNativeFeedback>
                            </Right>
                        </Item>{/* Select Arrival City */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Arrival City:</Label>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ height: 30 }}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={arrivalCityId}
                                onValueChange={this.onArrivalCityChange.bind(this)}
                            >
                                <Picker.Item label="" value={-1} />
                                {cities.map((city, index) => {
                                    return (<Picker.Item label={city.name} value={city.id} key={index} />)
                                })}
                            </Picker>
                        </Item>

                        {/* Select Arrival Station */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Arrival Station:</Label>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ height: 30 }}
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={arrivalStationId}
                                onValueChange={this.onArrivalStationChange.bind(this)}
                            >
                                <Picker.Item label="" value={-1} />
                                {arrivalStations.map((station, index) => {
                                    return (<Picker.Item label={station.name} value={station.id} key={index} />)
                                })}
                            </Picker>
                        </Item>

                        {/* Select Arrival Date */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Arrival Date:</Label>
                        <Item>
                            <Text style={{ padding: 10, paddingTop: 5, color: 'black' }}>{arrivalDateTimeUI}</Text>
                            <DateTimePicker
                                isVisible={this.state.arrivalVisible}
                                onConfirm={this.handleArrivalDateTimePicked}
                                onCancel={this.hideArrivalDateTimePicker}
                                mode={'datetime'}
                                minimumDate={new Date()} />
                            <Right>
                                <TouchableNativeFeedback onPress={this.showArrivalDateTimePicker}>
                                    <Icon name="calendar-check" type="material-community" color="grey" />
                                </TouchableNativeFeedback>
                            </Right>
                        </Item>
                        {/* Enter Ticket Code */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Ticket Code:</Label>
                        <Input
                            onChangeText={ticketCode => this.setState({ ticketCode })}
                            value={ticketCode}
                            inputStyle={{ fontSize: 15, color: 'black' }}
                        />
                        {/* Enter Selling Price */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Selling Price:</Label>
                        <NumberFormat value={sellingPrice} displayType={'text'} thousandSeparator={true}
                            renderText={value => (
                                <Input
                                    onChangeText={sellingPrice => this.setState({ sellingPrice })}
                                    value={value}
                                    inputStyle={{ fontSize: 15, color: 'black' }}
                                    keyboardType="numeric"
                                />
                            )}
                        />
                        <Button rounded block primary
                            style={{ margin: 40, marginBottom: 0 }}
                            onPress={this.editPostedTicket}>
                            <Text style={{ color: '#fff', fontSize: 20 }}>Edit</Text>
                        </Button>
                        <Button rounded block danger
                            style={{ margin: 40,marginTop: 10,marginBottom: 0  }}
                            onPress={this.deletePostedTicket}>
                            <Text style={{ color: '#fff', fontSize: 20 }}>Delete</Text>
                        </Button>
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
        backgroundColor: '#b3e5fc'
    },
    contentContainer: {
        justifyContent: 'center'
    },
    label: {
        paddingTop: 10,
        fontSize: 10
    }
})