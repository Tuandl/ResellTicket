import React, { Component } from 'react';
import { Dimensions, Text } from 'react-native';
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

export default class PostNewTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicleId: -1,
            transportationId: -1,
            ticketTypeId: -1,
            ticketCode: '',
            sellingPrice: '',

            departureVisible: false,
            departureCity: -1, //id
            departureStationId: -1,
            departureDateTime: '',
            departureDateTimeUI: '',

            arrivalVisible: false,
            arrivalCity: -1, //id
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
            console.log(resTicketType)
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
        var { arrivalCity } = this.state;
        if (arrivalCity !== -1 && arrivalCity === value) {
            RNToasty.Error({
                title: 'Invalid Departure City'
            })
            this.setState({
                departureCity: -1
            })
        } else {
            this.setState({
                departureCity: value
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
        //var arrivalTemp = moment(arrivalDateTime).format('YYYY-MM-DD HH:mm');
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
        var { departureCity } = this.state;
        if (departureCity !== -1 && departureCity === value) {
            RNToasty.Error({
                title: 'Invalid Arrival City'
            })
            this.setState({
                arrivalCity: -1
            })
        } else {
            this.setState({
                arrivalCity: value
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
        //var departTemp = moment(departureDateTime).format('YYYY-MM-DD HH:mm');
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

    postTicket = async () => {
        var { transportationId, ticketTypeId, departureStationId, arrivalStationId,
            ticketCode, sellingPrice, departureDateTime, arrivalDateTime } = this.state;

        if (transportationId !== -1 && ticketTypeId !== -1 && departureStationId !== -1 && arrivalStationId !== -1
            && ticketCode !== '' && sellingPrice !== '' && departureDateTime !== '' && arrivalDateTime !== '') {
            var ticket = {
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
            const resPostTicket = await Api.post('api/ticket', ticket);
            if (resPostTicket.status === 200) {
                RNToasty.Success({
                    title: 'Post Ticket Successfully'
                })
                this.props.navigation.navigate('PostedTicket');
            }
        } else {
            RNToasty.Error({
                title: 'Please input required fields'
            })
        }

    }

    render() {
        const { navigate } = this.props.navigation;
        //const username = this.props.navigation.getParam('username');
        const { departureCity,
            departureStationId,
            vehicleId,
            transportationId,
            departureDateTime,
            departureDateTimeUI,
            arrivalCity,
            arrivalStationId,
            arrivalDateTime,
            arrivalDateTimeUI,
            ticketTypeId,
            ticketCode,
            sellingPrice,
            cities,
            vehicles,
            transportations,
            ticketTypes,
            departStations,
            arrivalStations } = this.state;
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
                    <Right/>
                </Header>
                <ScrollView>
                    <Content
                        style={{ flex: 1, padding: 30, paddingTop: 10 }}
                        contentContainerStyle={{ justifyContent: 'center' }}>
                        {/* Select Vehicle */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Vehicle:</Label>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ height: 30 }}
                                selectedValue={vehicleId}
                                onValueChange={this.onVehicleChange.bind(this)}
                            >
                                <Picker.Item label="" value='-1' />
                                {vehicles.map((vehicle, index) => {
                                    return (<Picker.Item label={vehicle.name} value={vehicle.id} key={index} />)
                                })}
                            </Picker>
                        </Item>

                        {/* Select Transportation */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Transportation:</Label>
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
                                <Picker.Item label="" value='-1' />
                                {transportations.map((transportation, index) => {
                                    return (<Picker.Item label={transportation.name} value={transportation.id} key={index} />)
                                })}
                            </Picker>
                        </Item>

                        {/* Select Ticket Type */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Ticket Type:</Label>
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
                                <Picker.Item label="" value='-1' />
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
                                selectedValue={departureCity}
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
                        </Item>

                        {/* Select Arrival City */}
                        <Label style={{ paddingTop: 10, fontSize: 10 }}>Arrival City:</Label>
                        <Item picker>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ height: 30 }}
                                placeholder="Departure City"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={arrivalCity}
                                onValueChange={this.onArrivalCityChange.bind(this)}
                            >
                                <Picker.Item label="" value='-1' />
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
                                placeholder="Departure Station"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={arrivalStationId}
                                onValueChange={this.onArrivalStationChange.bind(this)}
                            >
                                <Picker.Item label="" value='-1' />
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
                            style={{ margin: 40 }}
                            onPress={this.postTicket}>
                            <Text style={{ color: '#fff', fontSize: 20 }}>Post Now</Text>
                        </Button>
                    </Content>
                </ScrollView>
            </Container>
        )
    }
}



{/* <Label style={{ paddingTop: 10, fontSize: 10 }}>Departure Date:</Label>
<Item>
    <DatePicker
        defaultDate={new Date()}
        minimumDate={new Date()}
        maximumDate={new Date(2020, 12, 31)}
        locale={"en"}
        timeZoneOffsetInMinutes={undefined}
        modalTransparent={false}
        animationType={"fade"}
        androidMode={"default"}
        textStyle={{ color: "black" }}
        placeHolderTextStyle={{ color: "black" }}
        selectedValue={departureDateTime}
        onDateChange={this.onDepartureDateChange.bind(this)}
        disabled={false}
    />
</Item> */}