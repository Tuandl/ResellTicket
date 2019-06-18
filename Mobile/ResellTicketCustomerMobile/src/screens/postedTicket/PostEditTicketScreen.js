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

export default class PostEditTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            vehicleId: -1,
            vehicles: [],
            transportations: [],
            transportationId: -1,
            transportationName: '',
            ticketTypes: [],
            ticketTypeId: -1,
            ticketTypeName: '',
            departureCities: [],
            departureCityId: -1,
            departureCityName: '',
            departureStations: [],
            departureStationId: -1,
            departureStationName: '',
            departureVisible: false,
            departureDateTime: '',
            arrivalCities: [],
            arrivalCityId: -1,
            arrivalCityName: '',
            arrivalStations: [],
            arrivalStationId: -1,
            arrivalStationName: '',
            arrivalVisible: false,
            arrivalDateTime: '',
            ticketCode: '',
            sellingPrice: '',
            temp: ''
        }
    }

    componentWillMount() {
        var ticketId = this.props.navigation.getParam('ticketId');
        if (ticketId > 0) {
            this.setState({
                isEdit: true
            })
        }
    }

    componentDidMount() {
        this.getVehicles();
    }

    async getTicketDetail() {
        const ticketId = this.props.navigation.getParam('ticketId');
        const res = await Api.get('api/ticket/detail?ticketId=' + ticketId);
        if (res.status === 200) {
            const ticketDetail = res.data
            this.setState({
                vehicleId: ticketDetail.vehicleId,
                transportationName: ticketDetail.transportationName,
                ticketTypeName: ticketDetail.ticketTypeName,
                departureCityName: ticketDetail.departureCityName,
                departureStationName: ticketDetail.departureStationName,
                arrivalCityName: ticketDetail.arrivalCityName,
                arrivalStationName: ticketDetail.arrivalStationName,
                departureDateTime: moment(ticketDetail.departureDateTime).format('YYYY-MM-DD HH:mm'),
                arrivalDateTime: moment(ticketDetail.arrivalDateTime).format('YYYY-MM-DD HH:mm'),
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
        if (this.state.isEdit) {
            this.getTicketDetail();
        }
    }

    render() {
        const {
            isEdit,
            vehicleId,
            vehicles,
            transportations,
            transportationName,
            ticketTypes,
            ticketTypeName,
            departureCities,
            departureCityName,
            departureStations,
            departureStationName,
            departureDateTime,
            arrivalCities,
            arrivalCityName,
            arrivalStations,
            arrivalStationName,
            arrivalDateTime,
            ticketCode,
            sellingPrice,
            temp
        } = this.state

        const { navigate } = this.props.navigation;

        // temp === 'transportation' ? this.getTransportions() :
            // temp === 'ticketType' ? this.getTicketTypes() :
            //     temp === 'departureCity' ? this.getDepartureCities() :
            //         temp === 'departureStation' ? this.getDepartureStations() :
            //             temp === 'arrivalCity' ? this.getArrivalCities() :
            //                 temp === 'arrivalStation' ? this.getArrivalStations() : '';
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
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
                        {isEdit ? <Title>Edit Ticket</Title> : <Title>Post Ticket</Title>}
                    </Body>
                    <Right />
                </Header>
                <ScrollView>
                    <Content style={styles.content} contentContainerStyle={styles.contentContainer}>
                        {/* Select Vehicle */}
                        <Label style={styles.label}>Vehicle:</Label>
                        <Item picker>
                            <Picker
                                mode={"dialog"}
                                style={{ height: 30 }}
                                selectedValue={vehicleId}
                                onValueChange={(value) => this.setState({ vehicleId: value })}
                            >
                                <Picker.Item label="" value={-1} />
                                {vehicles.map((vehicle, index) => {
                                    return (<Picker.Item label={vehicle.name} value={vehicle.id} key={index} />)
                                })}
                            </Picker>
                        </Item>
                        {/* Select Transportation */}
                        <Label style={styles.label}>Transportation:</Label>
                        <Autocomplete
                            defaultValue={transportationName}
                            data={transportations.length === 1 && comp(transportationName, transportations[0].name) ? [] : transportations}
                            // onChangeText={value => this.setState({ transportationName: value, temp: 'transportation' })}
                            onChangeText={value => this.getTransportions(value)}
                            onFocus={() => {this.getTransportions('')}}
                            onBlur={() => this.setState({ transportations: [] })}
                            placeholder="Enter Transportation"
                            placeholderTextColor={'grey'}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity key={item.id}
                                    onPress={() => this.setState({ transportationName: item.name, transportationId: item.id })}>
                                    <Item>
                                        <Text>
                                            {item.name}
                                        </Text>
                                    </Item>
                                </TouchableOpacity>
                            )}
                        />
                        {/* Select Ticket Type */}
                        <Label style={styles.label}>Ticket Type:</Label>
                        <Autocomplete
                            defaultValue={ticketTypeName}
                            data={ticketTypes.length === 1 && comp(ticketTypeName, ticketTypes[0].name) ? [] : ticketTypes}
                            // onChangeText={value => this.setState({ ticketTypeName: value, temp: 'ticketType' })}
                            onChangeText={value => this.getTicketTypes(value)}
                            onFocus={() => {this.getTicketTypes('')}}
                            onBlur={() => this.setState({ ticketTypes: [] })}
                            placeholder="Enter Ticket Type"
                            placeholderTextColor={'grey'}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity key={item.id}
                                    onPress={() => this.setState({ ticketTypeName: item.name, ticketTypeId: item.id })}>
                                    <Item>
                                        <Text>
                                            {item.name}
                                        </Text>
                                    </Item>
                                </TouchableOpacity>
                            )}
                        />
                        {/* Select Departure City */}
                        <Label style={styles.label}>Departure City:</Label>
                        <Autocomplete
                            defaultValue={departureCityName}
                            data={departureCities.length === 1 && comp(departureCityName, departureCities[0].name) ? [] : departureCities}
                            // onChangeText={value => this.setState({ departureCityName: value, temp: 'departureCity' })}
                            onChangeText={value => this.getDepartureCities(value)}
                            onFocus={() => {this.getDepartureCities('')}}
                            onBlur={() => this.setState({ departureCities: [] })}
                            placeholder="Enter Departure City"
                            placeholderTextColor={'grey'}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity key={item.id}
                                    onPress={() => this.setState({ departureCityName: item.name, departureCityId: item.id, departureStationName: '' })}>
                                    <Item>
                                        <Text>
                                            {item.name}
                                        </Text>
                                    </Item>
                                </TouchableOpacity>
                            )}
                        />
                        {/* Select Departure Station */}
                        <Label style={styles.label}>Departure Station:</Label>
                        <Autocomplete
                            defaultValue={departureStationName}
                            data={departureStations.length === 1 && comp(departureStationName, departureStations[0].name) ? [] : departureStations}
                            // onChangeText={value => this.setState({ departureStationName: value, temp: 'departureStation' })}
                            onChangeText={value => this.getDepartureStations(value)}
                            onFocus={() => {this.getDepartureStations('')}}
                            onBlur={() => this.setState({ departureStations: [] })}
                            placeholder="Enter Departure Station"
                            placeholderTextColor={'grey'}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity key={item.id}
                                    onPress={() => this.setState({ departureStationName: item.name, departureStationId: item.id })}>
                                    <Item>
                                        <Text>
                                            {item.name}
                                        </Text>
                                    </Item>
                                </TouchableOpacity>
                            )}
                        />
                        {/* Select Arrival City */}
                        <Label style={styles.label}>Arrival City:</Label>
                        <Autocomplete
                            defaultValue={arrivalCityName}
                            data={arrivalCities.length === 1 && comp(arrivalCityName, arrivalCities[0].name) ? [] : arrivalCities}
                            // onChangeText={value => this.setState({ arrivalCityName: value, temp: 'arrivalCity' })}
                            onChangeText={value => this.getArrivalCities(value)}
                            onFocus={() => this.getArrivalCities()}
                            onBlur={() => this.setState({ arrivalCities: [] })}
                            placeholder="Enter Arrival City"
                            placeholderTextColor={'grey'}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity key={item.id}
                                    onPress={() => this.setState({ arrivalCityName: item.name, arrivalCityId: item.id, arrivalStationName: '' })}>
                                    <Item>
                                        <Text>
                                            {item.name}
                                        </Text>
                                    </Item>
                                </TouchableOpacity>
                            )}
                        />
                        {/* Select Arrival Station */}
                        <Label style={styles.label}>Arrival Station:</Label>
                        <Autocomplete
                            defaultValue={arrivalStationName}
                            data={arrivalStations.length === 1 && comp(arrivalStationName, arrivalStations[0].name) ? [] : arrivalStations}
                            onChangeText={value => this.getArrivalStations(value)}
                            onFocus={() => {this.getArrivalStations('')}}
                            onBlur={() => this.setState({ arrivalStations: [] })}
                            placeholder="Enter Arrival Station"
                            placeholderTextColor={'grey'}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity key={item.id}
                                    onPress={() => this.setState({ arrivalStationName: item.name, arrivalStationId: item.id })}>
                                    <Item>
                                        <Text>
                                            {item.name}
                                        </Text>
                                    </Item>
                                </TouchableOpacity>
                            )}
                        />
                        {/* Select Departure Datetime */}
                        <Label style={styles.label}>Departure Date:</Label>
                        <Item>
                            <Text style={{ padding: 10, paddingTop: 5, color: 'black' }}>
                                {departureDateTime === '' ? '' : moment(departureDateTime).format('MMM DD YYYY HH:mm')}
                            </Text>
                            <DateTimePicker
                                isVisible={this.state.departureVisible}
                                onConfirm={this.handleDepartureDateTimePicked}
                                onCancel={() => this.setState({ departureVisible: false })}
                                mode={'datetime'}
                                minimumDate={new Date()}
                            />
                            <Right>
                                <TouchableNativeFeedback onPress={() => this.setState({ departureVisible: true })}>
                                    <Icon name="calendar-check" type="material-community" color="grey" />
                                </TouchableNativeFeedback>
                            </Right>
                        </Item>
                        {/* Select Arrival Datetime */}
                        <Label style={styles.label}>Arrival Date:</Label>
                        <Item>
                            <Text style={{ padding: 10, paddingTop: 5, color: 'black' }}>
                                {arrivalDateTime === '' ? '' : moment(arrivalDateTime).format('MMM DD YYYY HH:mm')}
                            </Text>
                            <DateTimePicker
                                isVisible={this.state.arrivalVisible}
                                onConfirm={this.handleArrivalDateTimePicked}
                                onCancel={() => this.setState({ arrivalVisible: false })}
                                mode={'datetime'}
                                minimumDate={departureDateTime === '' ? new Date() : new Date(moment(departureDateTime).format('YYYY-MM-DD'))}
                            />
                            <Right>
                                <TouchableNativeFeedback onPress={() => this.setState({ arrivalVisible: true })}>
                                    <Icon name="calendar-check" type="material-community" color="grey" />
                                </TouchableNativeFeedback>
                            </Right>
                        </Item>
                        {/* Enter Ticket Code */}
                        <Label style={styles.label}>Ticket Code:</Label>
                        <Input

                            onChangeText={ticketCode => this.setState({ ticketCode })}
                            value={ticketCode}
                            inputStyle={{ fontSize: 15, color: 'black' }}
                        />
                        {/* Enter Selling Price */}
                        <Label style={styles.label}>Selling Price:</Label>
                        <NumberFormat value={sellingPrice} displayType={'text'} thousandSeparator={true}
                            // suffix={' $'}
                            renderText={value => (
                                <Input
                                    onChangeText={sellingPrice => this.setState({ sellingPrice })}
                                    value={value}
                                    inputStyle={{ fontSize: 15, color: 'black' }}
                                    keyboardType="numeric"
                                />
                            )}
                        />
                        {isEdit ?
                            <Button rounded block primary
                                style={{ margin: 40, marginBottom: 0 }}
                                onPress={this.editTicket}>
                                <Text style={styles.buttonText}>Edit</Text>
                            </Button> :
                            <Button rounded block primary
                                style={{ margin: 40 }}
                                onPress={this.postTicket}>
                                <Text style={styles.buttonText}>Post Now</Text>
                            </Button>}
                        {isEdit ? <Button rounded block danger
                            style={{ margin: 40, marginTop: 10, marginBottom: 0 }}
                            onPress={this.deletePostedTicket}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </Button> : <Text></Text>}
                    </Content>
                </ScrollView>
            </Container>
        )
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

    editTicket = async () => {
        const { transportationName, ticketTypeName, departureStationName, arrivalStationName,
            ticketCode, sellingPrice, departureDateTime, arrivalDateTime } = this.state;
        const { navigation } = this.props;
        const ticketId = this.props.navigation.getParam('ticketId');

        if (transportationName !== '' && ticketTypeName !== '' && departureStationName !== '' && arrivalStationName !== ''
            && ticketCode !== '' && sellingPrice !== '' && departureDateTime !== '' && arrivalDateTime !== '') {
            var ticket = {
                id: ticketId,
                ticketCode: ticketCode,
                transportationId: this.state.transportationId,
                departureStationId: this.state.departureStationId,
                arrivalStationId: this.state.arrivalStationId,
                sellingPrice: sellingPrice,
                description: '',
                departureDateTime: departureDateTime,
                arrivalDateTime: arrivalDateTime,
                ticketTypeId: this.state.ticketTypeId
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

    postTicket = async () => {
        var { transportationId, ticketTypeId, departureStationId, arrivalStationId,
            ticketCode, sellingPrice, departureDateTime, arrivalDateTime } = this.state;
        var { navigation } = this.props;
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
                navigation.state.params.refreshPostedTicket();
                navigation.navigate('PostedTicket');
            }
        } else {
            RNToasty.Error({
                title: 'Please input required fields'
            })
        }
    }

    handleDepartureDateTimePicked = datetime => {
        this.setState({
            departureDateTime: moment(datetime).format('YYYY-MM-DD HH:mm'),
            departureVisible: false,
            arrivalDateTime: '',
        })
    }

    handleArrivalDateTimePicked = datetime => {
        this.setState({
            arrivalDateTime: moment(datetime).format('YYYY-MM-DD HH:mm'),
            arrivalVisible: false
        })
    }

    getTransportions = async (searchValue) => {
        const res = await Api.get('api/transportation?vehicleId=' + this.state.vehicleId + '&transportationName=' + searchValue);
        if (res.status === 200) {
            this.setState({
                transportations: res.data
            })
        }
    }

    getTicketTypes = async (searchValue) => {
        const res = await Api.get('api/ticketType?vehicleId=' + this.state.vehicleId + '&ticketTypeName=' + searchValue);
        if (res.status === 200) {
            this.setState({
                ticketTypes: res.data
            })
        }
    }

    getDepartureCities = async (searchValue) => {
        const res = await Api.get('api/city?name=' + searchValue);
        if (res.status === 200) {
            this.setState({
                departureCities: res.data
            })
        }
    }

    getDepartureStations = async (searchValue) => {
        const res = await Api.get('api/station?cityId=' + this.state.departureCityId + '&name=' + searchValue);
        if (res.status === 200) {
            this.setState({
                departureStations: res.data
            })
        }
    }

    getArrivalCities = async (searchValue) => {
        const res = await Api.get('api/city?name=' + searchValue);
        if (res.status === 200) {
            this.setState({
                arrivalCities: res.data
            })
        }
    }

    getArrivalStations = async (searchValue) => {
        const res = await Api.get('api/station?cityId=' + this.state.arrivalCityId + '&name=' + searchValue);
        if (res.status === 200) {
            this.setState({
                arrivalStations: res.data
            })
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