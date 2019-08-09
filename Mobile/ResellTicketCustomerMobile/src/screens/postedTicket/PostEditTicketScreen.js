import React, { Component } from 'react';
import { Dimensions, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Container, Header, Body, Title, Item, Picker, Content, Button, Left, Label, Right } from 'native-base';
import { Icon, Input } from 'react-native-elements';
import Api from '../../service/Api';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import DateTimePicker from "react-native-modal-datetime-picker";
import { TouchableNativeFeedback, TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import { RNToasty } from 'react-native-toasty';
import Autocomplete from 'react-native-autocomplete-input';
import Dialog from "react-native-dialog";

const { width } = Dimensions.get('window');

export default class PostEditTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isPostEditLoading: false,
            isDeleteLoading: false,
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
            passengerName: '',
            emailBooking: '',
            emailValid: true,
            dialogVisibleDeletePostedTicket: false
        }
    }

    handleDeletePostedTicketCANCEL = () => {
        this.setState({
            dialogVisibleDeletePostedTicket: false
        });
    }

    showDialogDeletePostedTicket = () => {
        this.setState({
            dialogVisibleDeletePostedTicket: true
        });
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
        this.setState({
            isLoading: true
        })
        const res = await Api.get('api/ticket/detail?ticketId=' + ticketId);
        if (res.status === 200) {
            const ticketDetail = res.data
            this.setState({
                vehicleId: ticketDetail.vehicleId,
                transportationId: ticketDetail.transportationId,
                transportationName: ticketDetail.transportationName,
                ticketTypeId: ticketDetail.ticketTypeId,
                ticketTypeName: ticketDetail.ticketTypeName,
                departureCityId: ticketDetail.departureCityId,
                departureCityName: ticketDetail.departureCityName,
                departureStationId: ticketDetail.departureStationId,
                departureStationName: ticketDetail.departureStationName,
                arrivalCityId: ticketDetail.arrivalCityId,
                arrivalCityName: ticketDetail.arrivalCityName,
                arrivalStationId: ticketDetail.arrivalStationId,
                arrivalStationName: ticketDetail.arrivalStationName,
                departureDateTime: moment(ticketDetail.departureDateTime).format('YYYY-MM-DD HH:mm'),
                arrivalDateTime: moment(ticketDetail.arrivalDateTime).format('YYYY-MM-DD HH:mm'),
                ticketCode: ticketDetail.ticketCode,
                sellingPrice: ticketDetail.sellingPrice,
                passengerName: ticketDetail.passengerName,
                emailBooking: ticketDetail.emailBooking,
                isLoading: false,
                status: ticketDetail.status,
            })
        }
    }

    async getVehicles() {
        this.setState({
            isLoading: true
        })
        const resVehicle = await Api.get('api/vehicle');
        if (resVehicle.status === 200) {
            this.setState({
                vehicles: resVehicle.data,
                vehicleId: resVehicle.data[0].id,
            })
        }
        if (this.state.isEdit) {
            this.getTicketDetail();
        } else {
            this.setState({
                isLoading: false
            })
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
            passengerName,
            emailBooking,
            isLoading,
            isPostEditLoading,
            isDeleteLoading,
            emailValid, //check regular
        } = this.state
        const { navigate } = this.props.navigation;
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();
        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button transparent
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
                    {isLoading ? <ActivityIndicator size="large" animating /> :
                        <Content style={styles.content} contentContainerStyle={styles.contentContainer}>
                            {/* Select Vehicle */}
                            <Label style={styles.label}>Vehicle:</Label>
                            <Item picker>
                                <Picker
                                    mode={"dialog"}
                                    style={{ height: 30 }}
                                    selectedValue={vehicleId}
                                    onValueChange={(value) => this.setState({
                                        vehicleId: value,
                                        transportationId: value === vehicleId ? this.state.transportationId : -1,
                                        transportationName: value === vehicleId ? transportationName : '',
                                        ticketId: value === vehicleId ? this.state.ticketTypeId : -1,
                                        ticketTypeName: value === vehicleId ? ticketTypeName : ''
                                    })}
                                >
                                    {vehicles.map((vehicle, index) => {
                                        return (<Picker.Item label={vehicle.name} value={vehicle.id} key={index} />)
                                    })}
                                </Picker>
                            </Item>
                            {/* Select Transportation */}
                            <Label style={styles.label}>Transportation:</Label>
                            <Autocomplete
                                defaultValue={transportationName}
                                data={transportations}
                                // onChangeText={value => this.setState({ transportationName: value, temp: 'transportation' })}
                                onChangeText={value => this.getTransportions(value)}
                                placeholder="Enter Transportation"
                                placeholderTextColor={'grey'}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity key={item.id}
                                        onPress={() => this.setState({
                                            transportations: [],
                                            transportationName: item.name,
                                            transportationId: item.id
                                        })}>
                                        <Item style={{height: 35}}>
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
                                data={ticketTypes}
                                // onChangeText={value => this.setState({ ticketTypeName: value, temp: 'ticketType' })}
                                onChangeText={value => this.getTicketTypes(value)}
                                placeholder="Enter Ticket Type"
                                placeholderTextColor={'grey'}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity key={item.id}
                                        onPress={() => this.setState({ ticketTypes: [], ticketTypeName: item.name, ticketTypeId: item.id })}>
                                        <Item style={{height: 35}}>
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
                                data={departureCities}
                                onChangeText={value => this.getDepartureCities(value)}
                                placeholder="Enter Departure City"
                                placeholderTextColor={'grey'}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity key={item.id}
                                        onPress={() => this.setState({
                                            departureCityName: item.name,
                                            departureCities: [],
                                            departureCityId: item.id,
                                            departureStationId: item.id === this.state.departureCityId ? this.state.departureStationId : -1,
                                            departureStationName: item.id === this.state.departureCityId ? departureStationName : ''
                                        })}>
                                        <Item style={{height: 35}}>
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
                                data={departureStations}
                                onChangeText={value => this.getDepartureStations(value)}
                                placeholder="Enter Departure Station"
                                placeholderTextColor={'grey'}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity key={item.id}
                                        onPress={() => this.setState({
                                            departureStations: [],
                                            departureStationName: item.name,
                                            departureStationId: item.id,
                                            departureCityId: item.cityId,
                                            departureCityName: item.cityName
                                        })}>
                                        <Item style={{height: 35}}>
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
                                data={arrivalCities}
                                onChangeText={value => this.getArrivalCities(value)}
                                placeholder="Enter Arrival City"
                                placeholderTextColor={'grey'}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity key={item.id}
                                        onPress={() => this.setState({
                                            arrivalCityName: item.name,
                                            arrivalCities: [],
                                            arrivalCityId: item.id,
                                            arrivalStationId: item.id === this.state.arrivalCityId ? this.state.arrivalStationId : -1,
                                            arrivalStationName: item.id === this.state.arrivalCityId ? arrivalStationName : ''
                                        })}>
                                        <Item style={{height: 35}}>
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
                                data={arrivalStations}
                                onChangeText={value => this.getArrivalStations(value)}
                                placeholder="Enter Arrival Station"
                                placeholderTextColor={'grey'}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity key={item.id}
                                        onPress={() => this.setState({
                                            arrivalStations: [],
                                            arrivalStationName: item.name,
                                            arrivalStationId: item.id,
                                            arrivalCityId: item.cityId,
                                            arrivalCityName: item.cityName
                                        })}>
                                        <Item style={{height: 35}}>
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
                            {/* Enter Passenger Name */}
                            <Label style={styles.label}>Passenger Name:</Label>
                            <Input
                                onChangeText={passengerName => this.setState({ passengerName })}
                                value={passengerName}
                                inputStyle={{ fontSize: 15, color: 'black' }}
                            />
                            {/* Enter Email Booking */}
                            <Label style={styles.label}>Email Booking:</Label>
                            <Input
                                onChangeText={emailBooking => this.setState({ emailBooking })}
                                value={emailBooking}
                                inputStyle={{ fontSize: 15, color: 'black' }}
                                errorStyle={{ textAlign: 'center', fontSize: 12, color: 'red' }}
                                errorMessage={
                                    emailValid ? null : 'Please enter a valid email'
                                }
                            />
                            {/* Enter Selling Price */}
                            <Label style={styles.label}>Selling Price:</Label>
                            <NumberFormat value={sellingPrice} displayType={'text'} thousandSeparator={true}
                                decimalScale={2} decimalSeparator={'.'} allowNegative={false}
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
                                <Button block primary
                                    style={{ margin: 10, marginTop: 40 }}
                                    onPress={this.editTicket}>
                                    {isPostEditLoading ? <ActivityIndicator size="small" animating color="#fff" />
                                        : <Text style={styles.buttonText}>Save</Text>}
                                </Button> :
                                <Button block primary
                                    style={{ margin: 10, marginTop: 40}}
                                    onPress={this.postTicket}>
                                    {isPostEditLoading ? <ActivityIndicator size="small" animating color="#fff" />
                                        : <Text style={styles.buttonText}>Post Now</Text>}
                                </Button>}
                            {isEdit ? <Button block danger
                                style={{ margin: 10, marginTop: 10 }}
                                onPress={this.showDialogDeletePostedTicket}>
                                {isDeleteLoading ? <ActivityIndicator size="small" animating color="#fff" />
                                    : <Text style={styles.buttonText}>Delete</Text>}
                            </Button> : <Text></Text>}
                            <Dialog.Container visible={this.state.dialogVisibleDeletePostedTicket}>
                                <Dialog.Title>Delete Ticket</Dialog.Title>
                                <Dialog.Description>
                                    Do you want to Delete this Ticket ?
                                        </Dialog.Description>
                                <Dialog.Button label="Delete" onPress={this.deletePostedTicket} />
                                <Dialog.Button label="Cancel" onPress={this.handleDeletePostedTicketCANCEL} />
                            </Dialog.Container>
                        </Content>
                    }
                </ScrollView>
            </Container>
        )
    }

    deletePostedTicket = async () => {
        this.setState({
            isDeleteLoading: true
        })
        const ticketId = this.props.navigation.getParam('ticketId');
        const index = this.props.navigation.getParam('index');
        const resDeleteTicket = await Api.delete('api/ticket?ticketId=' + ticketId);
        const { navigation } = this.props;
        this.setState({
            dialogVisibleDeletePostedTicket: false
        });
        if (resDeleteTicket.status === 200) {
            this.setState({
                isDeleteLoading: false
            })
            RNToasty.Success({
                title: 'Delete Ticket Successfully'
            })
            navigation.state.params.refreshPostedTicket();
            navigation.navigate('PostedTicket');
        }
    }

    editTicket = async () => {
        const { transportationName, ticketTypeName, departureStationName, arrivalStationName,
            ticketCode, sellingPrice, departureDateTime, arrivalDateTime, passengerName, emailBooking,
            vehicleId, transportationId, ticketTypeId, departureCityId, departureStationId, arrivalCityId, arrivalStationId } = this.state;
        const { navigation } = this.props;
        const ticketId = this.props.navigation.getParam('ticketId');
        const index = this.props.navigation.getParam('index');

        if (transportationName !== '' && ticketTypeName !== '' && departureStationName !== ''
            && arrivalStationName !== '' && passengerName != '' && emailBooking != ''
            && ticketCode !== '' && sellingPrice !== '' && departureDateTime !== '' && arrivalDateTime !== '') {
            var ticket = {
                id: ticketId,
                ticketCode: ticketCode,
                vehicleId: vehicleId,
                transportationId: transportationId,
                ticketTypeId: ticketTypeId,
                departureCityId: departureCityId,
                departureStationId: departureStationId,
                departureDateTime: departureDateTime,
                arrivalCityId: arrivalCityId,
                arrivalStationId: arrivalStationId,
                arrivalDateTime: arrivalDateTime,
                sellingPrice: sellingPrice,
                description: '',
                emailBooking: emailBooking,
                passengerName: passengerName
            }
            this.setState({
                isPostEditLoading: true
            })
            const resEditTicket = await Api.put('api/ticket', ticket);
            if (resEditTicket.status === 200) {
                this.setState({
                    isPostEditLoading: false
                })
                RNToasty.Success({
                    title: 'Edit Ticket Successfully'
                })
                navigation.state.params.refreshPostedTicket();
                navigation.navigate('PostedTicket');
            } else {
                this.setState({
                    isPostEditLoading: false
                })
                RNToasty.Error({
                    title: 'Please input required fields and select what we suggest'
                })
            }
        } else {
            RNToasty.Error({
                title: 'Please input required fields and select what we suggest'
            })
        }
    }

    postTicket = async () => {
        var { transportationId, ticketTypeId, departureStationId, arrivalStationId,
            ticketCode, sellingPrice, departureDateTime, arrivalDateTime, passengerName, emailBooking } = this.state;
        var { navigation } = this.props;
        if (transportationId !== -1 && ticketTypeId !== -1 && departureStationId !== -1 && arrivalStationId !== -1
            && ticketCode !== '' && sellingPrice !== '' && departureDateTime !== ''
            && arrivalDateTime !== '' && passengerName !== '' && emailBooking !== '') {
            var ticket = {
                ticketCode: ticketCode,
                transportationId: transportationId,
                departureStationId: departureStationId,
                arrivalStationId: arrivalStationId,
                sellingPrice: sellingPrice,
                description: '',
                departureDateTime: departureDateTime,
                arrivalDateTime: arrivalDateTime,
                ticketTypeId: ticketTypeId,
                passengerName: passengerName,
                emailBooking: emailBooking
            }
            this.setState({
                isPostEditLoading: true
            })
            const resPostTicket = await Api.post('api/ticket', ticket);
            if (resPostTicket.status === 200) {
                this.setState({
                    isPostEditLoading: false
                })
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
        this.setState({
            transportationName: searchValue
        })
        const res = await Api.get('api/transportation?vehicleId=' + this.state.vehicleId + '&transportationName=' + searchValue);
        if (res.status === 200) {
            this.setState({
                transportations: res.data
            })
        }
    }

    getTicketTypes = async (searchValue) => {
        this.setState({
            ticketTypeName: searchValue
        })
        const res = await Api.get('api/ticketType?vehicleId=' + this.state.vehicleId + '&ticketTypeName=' + searchValue);
        if (res.status === 200) {
            this.setState({
                ticketTypes: res.data
            })
        }
    }

    getDepartureCities = async (searchValue) => {
        this.setState({
            departureCityName: searchValue
        })
        const res = await Api.get('api/city?name=' + searchValue + '&ignoreCityId=' + this.state.arrivalCityId);
        if (res.status === 200) {
            this.setState({
                departureCities: res.data
            })
        }
    }

    getDepartureStations = async (searchValue) => {
        this.setState({
            departureStationName: searchValue
        })
        const res = await Api.get('api/station?cityId=' + this.state.departureCityId + '&name=' + searchValue + '&ignoreStationId=' + this.state.arrivalStationId);
        if (res.status === 200) {
            this.setState({
                departureStations: res.data
            })
        }
    }

    getArrivalCities = async (searchValue) => {
        this.setState({
            arrivalCityName: searchValue
        })
        const res = await Api.get('api/city?name=' + searchValue + '&ignoreCityId=' + this.state.departureCityId);
        if (res.status === 200) {
            this.setState({
                arrivalCities: res.data
            })
        }
    }

    getArrivalStations = async (searchValue) => {
        this.setState({
            arrivalStationName: searchValue
        })
        const res = await Api.get('api/station?cityId=' + this.state.arrivalCityId + '&name=' + searchValue + '&ignoreStationId=' + this.state.departureStationId);
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
        fontSize: 10,
    },
    invalidLabel: {
        paddingTop: 10,
        fontSize: 10,
        color: 'red'
    },
    buttonText: {
        color: '#fff',
        fontSize: 20
    }
})