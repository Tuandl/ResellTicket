import { Body, Button, Container, Content, DatePicker, Header, Item, Label, Left, Picker, Right, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../../service/Api';
import moment from 'moment';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import NumericInput from 'react-native-numeric-input';
import formatConstant from './../../constants/formatConstant';
import { RNToasty } from 'react-native-toasty';
import colors from '../../config/colors';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class RouteSearchFormScreen extends Component {

    URL_CITY_AUTO_SUGGEST = 'api/city';

    constructor(props) {
        super(props);
        this.state = {
            departureCityId: null,
            departureCityName: '',
            arrivalCityId: null,
            arrivalCityName: '',
            departureDate: new Date(),
            arrivalDate: new Date(),
            maxTicketCombination: 3,
            departureCitiesAutoSuggest: [],
            arrivalCitiesAutoSuggest: [],
            vehiclesSelectData: [
                {
                    id: 0,
                    name: 'Vehicle',
                    children: [],
                }
            ],
            transportationSelectData: [
                {
                    id: 0,
                    name: 'Transportation',
                    children: [],
                }
            ],
            ticketTypeSelectData: [
                {
                    id: 0,
                    name: 'Ticket Type',
                    children: [],
                }
            ],
            maxWaitingHours: 5,
            selectedVehicles: [],
            selectedTicketTypes: [],
            selectedTransportations: [],
        };

        this.getDepartureCityAutoSuggest = this.getDepartureCityAutoSuggest.bind(this);
        this.getArrivalCityAutoSuggest = this.getArrivalCityAutoSuggest.bind(this);
        this.onDepartureDateChanged = this.onDepartureDateChanged.bind(this);
        this.onArrivalDateChanged = this.onArrivalDateChanged.bind(this);
        this.onMaxTicketCombinationChanged = this.onMaxTicketCombinationChanged.bind(this);
        this.onBtnSearchPress = this.onBtnSearchPress.bind(this);
        this.initData = this.initData.bind(this);
        this.onVehicleSelectedChanged = this.onVehicleSelectedChanged.bind(this);
        this.onTransportationSelectedChanged = this.onTransportationSelectedChanged.bind(this);
        this.onTicketTypesSelectedChanged = this.onTicketTypesSelectedChanged.bind(this);
        this.onMaxWaitingHoursChanged = this.onMaxWaitingHoursChanged.bind(this);
        this.validateBeforeSearch = this.validateBeforeSearch.bind(this);
    }

    componentDidMount() {
        // this.getDepartureCityAutoSuggest('');
        this.initData();
    }

    async getDepartureCityAutoSuggest(searchValue) {
        const params = {
            name: searchValue,
        };
        var response = await api.get(this.URL_CITY_AUTO_SUGGEST, params);
        if (response.status === 200) {
            this.setState({
                departureCitiesAutoSuggest: response.data,
            });
        }
    }

    async getArrivalCityAutoSuggest(searchValue) {
        const params = {
            name: searchValue,
        };
        var response = await api.get(this.URL_CITY_AUTO_SUGGEST, params);
        if (response.status === 200) {
            this.setState({
                arrivalCitiesAutoSuggest: response.data,
            });
        }
    }

    onDepartureDateChanged(value) {
        this.setState({
            departureDate: moment(value).format(formatConstant.DATE),
            arrivalDate: moment(value).format(formatConstant.DATE),
        })
    }

    onArrivalDateChanged(value) {
        this.setState({
            arrivalDate: moment(value).format(formatConstant.DATE)
        })
    }

    onMaxTicketCombinationChanged(value) {
        this.setState({
            maxTicketCombination: value,
        });
    }

    onBtnSearchPress() {
        if(!this.validateBeforeSearch()) {
            return;
        }
        
        var params = {
            departureCityId: this.state.departureCityId,
            arrivalCityId: this.state.arrivalCityId,
            maxTicketCombination: this.state.maxTicketCombination,
            departureDate: moment(this.state.departureDate).format('YYYY-MM-DD 00:00:00'),
            arrivalDate: moment(this.state.arrivalDate).format('YYYY-MM-DD 00:00:00'),
            vehicleIds: this.state.selectedVehicles,
            transportationIds: this.state.selectedTransportations,
            ticketTypeIds: this.state.selectedTicketTypes,
            maxWaitingHours: this.state.maxWaitingHours,
            page: 1,
            pageSize: 10,
        };
        this.props.navigation.navigate('RouteSearchResult', { params: params });
    }

    onVehicleSelectedChanged = function(selectedVehicles) {
        console.log('Vehicle selected Changed ', selectedVehicles);

        const transportationFiltered = this.transportations.filter(transportation => {
            const vehicleId = selectedVehicles.find(vehicleId => {
                return vehicleId === transportation.vehicleId;
            });
            return vehicleId !== null && vehicleId !== undefined;
        });

        const ticketTypeFilterd = this.ticketTypes.filter(ticketType => {
            const vehicleId = selectedVehicles.find(vehicleId => {
                return vehicleId === ticketType.vehicleId;
            });
            return vehicleId !== null && vehicleId !== undefined;
        });

        this.setState({ 
            selectedVehicles,
            transportationSelectData: [
                {
                    id: 0,
                    name: 'Transportation',
                    children: transportationFiltered.map(transportation => {
                        return {
                            id: transportation.id,
                            name: transportation.name,
                        }
                    }),
                }
            ],
            selectedTransportations: transportationFiltered.map(transportation => {
                return transportation.id;
            }),
            ticketTypeSelectData: [
                {
                    id: 0,
                    name: 'Ticket Type',
                    children: ticketTypeFilterd.map(ticketType => {
                        return {
                            id: ticketType.id,
                            name: ticketType.name,
                        };
                    }),
                }
            ],
            selectedTicketTypes: ticketTypeFilterd.map(ticketType => {
                return ticketType.id;
            })
        });
    };

    onTransportationSelectedChanged(selectedTransportations) {
        console.log('Transportation selected changed ', selectedTransportations);
        this.setState({ selectedTransportations });
    }

    onTicketTypesSelectedChanged(selectedTicketTypes) {
        console.log('Ticket Type Selected Changed', selectedTicketTypes);
        this.setState({ selectedTicketTypes });
    }

    onMaxWaitingHoursChanged(maxWaitingHours) {
        this.setState({maxWaitingHours: maxWaitingHours});
    }
    
    async initData() {
        const vehiclesResponse = api.get('api/vehicle');
        const transportationsResponse = api.get('api/transportation?vehicleId=-1');
        const ticketTypeResponse = api.get('api/ticketType?vehicleId=-1');
        
        this.vehicles = (await vehiclesResponse).data;
        this.transportations = (await transportationsResponse).data;
        this.ticketTypes = (await ticketTypeResponse).data;

        this.setState({
            vehiclesSelectData: [
                {
                    id: 0,
                    name: 'Vehicle',
                    children: this.vehicles.map(vehicle => {
                        return {
                            id: vehicle.id,
                            name: vehicle.name,
                        };
                    }),
                }
            ],
            selectedVehicles: this.vehicles.map(vehicle => {
                return vehicle.id;
            }),
            transportationSelectData: [
                {
                    id: 0,
                    name: 'Transportation',
                    children: this.transportations.map(transportation => {
                        return {
                            id: transportation.id,
                            name: transportation.name,
                        }
                    }),
                }
            ],
            selectedTransportations: this.transportations.map(transportation => {
                return transportation.id;
            }),
            ticketTypeSelectData: [
                {
                    id: 0,
                    name: 'Ticket Type',
                    children: this.ticketTypes.map(ticketType => {
                        return {
                            id: ticketType.id,
                            name: ticketType.name,
                        };
                    }),
                }
            ],
            selectedTicketTypes: this.ticketTypes.map(ticketType => {
                return ticketType.id;
            }),
        });
    }

    validateBeforeSearch() {
        let result;
        if(!this.state.departureCityId) {
            result = 'Please choose Departure City.';
        } else 
        if(!this.state.arrivalCityId) {
            result = 'Please choose Arrival City.';
        } else 
        if(!this.state.departureDate) {
            result = 'Please choose Departure Date.';
        } else 
        if(!this.state.arrivalDate) {
            result = 'Please choose Arrval Date.';
        } else 
        if(this.state.selectedVehicles.length === 0) {
            result = 'Please choose some Vehicles.';
        } else 
        if(this.state.selectedTransportations.length === 0) {
            result = 'Please choose some Transportations.';
        } else 
        if(this.state.selectedTicketTypes.length === 0) {
            result = 'Please choose some Ticket Types.';
        } 

        if(result) {
            RNToasty.Error({ title: result });
            return false;
        }
        return true;
    }

    render() {
        const { departureCityName,
            arrivalCityName,
            arrivalCitiesAutoSuggest,
            departureCitiesAutoSuggest,
            departureDate,
            arrivalDate,
            maxTicketCombination,
            vehiclesSelectData,
            transportationSelectData,
            ticketTypeSelectData,
            maxWaitingHours,
        } = this.state;
        const { navigation } = this.props;

        const equal = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <Container style={{ flex: 1 }}>
                <Header color={colors.secondary}>
                    <Left>
                        <Button transparent
                            onPress={() => navigation.pop()}
                        >
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Route</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                <Content style={styles.content} contentContainerStyle={styles.contentContainer}>
                    {/* Get Departure City */}
                    <Label style={styles.label}>Departure City</Label>
                    {/* <View style={styles.container}> */}
                    <Autocomplete
                        defaultValue={departureCityName}
                        data={departureCitiesAutoSuggest.length === 1 && equal(departureCityName, departureCitiesAutoSuggest[0].name) ? [] : departureCitiesAutoSuggest}
                        onChangeText={value => this.getDepartureCityAutoSuggest(value)}
                        onFocus={() => { this.getDepartureCityAutoSuggest('') }}
                        onBlur={() => this.setState({ departureCitiesAutoSuggest: [] })}
                        placeholder="Please enter Departure City..."
                        placeholderTextColor={colors.greyPlaceHolder}
                        keyExtractor={(item, index) => index.toString()}
                        // containerStyle={styles.autocompleteContainer}
                        renderItem={({ item }) => (
                            <TouchableOpacity key={item.id}
                                onPress={() => this.setState({ departureCityName: item.name, departureCityId: item.id, departureCitiesAutoSuggest: [] })}>
                                <Item style={{ height: 35 }}>
                                    <Text>
                                        {item.name}
                                    </Text>
                                </Item>
                            </TouchableOpacity>
                        )}
                        inputContainerStyle={styles.inputContainer}
                    />
                    {/* </View> */}

                    {/* Get Arrival City */}
                    <Label style={styles.label}>Arrival City</Label>
                    {/* <View style={styles.container}> */}
                    <Autocomplete
                        defaultValue={arrivalCityName}
                        data={arrivalCitiesAutoSuggest.length === 1 && equal(arrivalCityName, arrivalCitiesAutoSuggest[0].name) ? [] : arrivalCitiesAutoSuggest}
                        onChangeText={value => this.getArrivalCityAutoSuggest(value)}
                        onFocus={() => { this.getArrivalCityAutoSuggest('') }}
                        onBlur={() => this.setState({ arrivalCitiesAutoSuggest: [] })}
                        placeholder="Please enter Arrival City..."
                        placeholderTextColor={colors.greyPlaceHolder}
                        keyExtractor={(item, index) => index.toString()}
                        // containerStyle={styles.autocompleteContainer}
                        renderItem={({ item }) => (
                            <TouchableOpacity key={item.id}
                                onPress={() => this.setState({ arrivalCityName: item.name, arrivalCityId: item.id, arrivalCitiesAutoSuggest: [] })}>
                                <Item style={{ height: 35 }}>
                                    <Text>
                                        {item.name}
                                    </Text>
                                </Item>
                            </TouchableOpacity>
                        )}
                        inputContainerStyle={styles.inputContainer}
                    />
                    {/* </View> */}


                    {/* Select Departure date */}
                    <Label style={styles.label}>Departure Date</Label>
                    <DatePicker
                        defaultDate={departureDate}
                        minimumDate={new Date()}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"calendar"}
                        // placeHolderText="Select Departure Date"
                        // placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={this.onDepartureDateChanged}
                        disabled={false}
                        formatChosenDate={date => {return moment(date).format(formatConstant.DATE)}}
                        textStyle={{...styles.inputContainer}}
                    />

                    {/* Select Arrival date */}
                    <Label style={styles.label}>Arrival Date</Label>
                    <DatePicker
                        defaultDate={arrivalDate}
                        minimumDate={new Date()}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"calendar"}
                        // placeHolderText="Select Arrival Date"
                        // placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={this.onArrivalDateChanged}
                        disabled={false}
                        formatChosenDate={date => {return moment(date).format(formatConstant.DATE)}}
                        textStyle={{...styles.inputContainer}}
                    />

                    <Label style={styles.label}>Maximum Tickets:</Label>
                    <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        // style={{ width: undefined }}
                        placeholder="Maximum Tickets"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        selectedValue={maxTicketCombination}
                        onValueChange={this.onMaxTicketCombinationChanged}
                        style={{ borderColor: colors.greyUnderlineInput, borderBottomWidth: 0.666666 }}

                    >
                        <Picker.Item label="Only 1 Ticket" value={1} />
                        <Picker.Item label="Less or equal than 2 tickets" value={2} />
                        <Picker.Item label="Less or equal than 3 tickets" value={3} />
                    </Picker>

                    <Label style={styles.label}>Maximum Waiting Hours between Tickets:</Label>
                    <View style={{alignItems: "center"}}>
                        <NumericInput 
                            value={maxWaitingHours} 
                            minValue={0}
                            maxValue={1000}
                            onChange={this.onMaxWaitingHoursChanged} 
                            onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                            totalWidth={150} 
                            totalHeight={40} 
                            iconSize={25}
                            step={1}
                            valueType='real'
                            rounded
                        />
                    </View>
                    

                    {/* <Label style={styles.label}>Vehicle:</Label> */}
                    <SectionedMultiSelect
                        items={vehiclesSelectData}
                        uniqueKey="id"
                        subKey="children"
                        selectText="Choose Vehicles..."
                        showDropDowns={false}
                        readOnlyHeadings={true}
                        onSelectedItemsChange={this.onVehicleSelectedChanged}
                        selectedItems={this.state.selectedVehicles}
                        searchPlaceholderText="Search Vehicles..."
                        modalAnimationType="slide"
                        styles={{container: styles.inputContainer}}
                    />

                    {/* <Label style={styles.label}>Transportation:</Label> */}
                    <SectionedMultiSelect
                        items={transportationSelectData}
                        uniqueKey="id"
                        subKey="children"
                        selectText="Choose Transportation..."
                        showDropDowns={false}
                        readOnlyHeadings={true}
                        onSelectedItemsChange={this.onTransportationSelectedChanged}
                        selectedItems={this.state.selectedTransportations}
                        searchPlaceholderText="Search Transportation..."
                        modalAnimationType="slide"
                    />

                    {/* <Label style={styles.label}>Ticket Type:</Label> */}
                    <SectionedMultiSelect
                        items={ticketTypeSelectData}
                        uniqueKey="id"
                        subKey="children"
                        selectText="Choose Ticket Type..."
                        showDropDowns={false}
                        readOnlyHeadings={true}
                        onSelectedItemsChange={this.onTicketTypesSelectedChanged}
                        selectedItems={this.state.selectedTicketTypes}
                        searchPlaceholderText="Search Ticket Type..."   
                        modalAnimationType="slide"
                    />

                    <View style={{ marginTop: 15 }}>
                        <Button iconLeft block primary
                            style={{ margin: 10 }}
                            onPress={this.onBtnSearchPress}
                        >
                            <Icon name="search" color="#fff"></Icon>
                            <Text>Search</Text>
                        </Button>
                    </View>


                </Content>
            </Container>
        );
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
    },
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        paddingTop: 25
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    inputContainer: {
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0.66666666666,
        borderColor: colors.greyUnderlineInput,
        backgroundColor: 'transparent',
    },
})