import { Body, Button, Container, Content, DatePicker, Header, Item, Label, Left, Picker, Right, Text, Title } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Autocomplete from 'react-native-autocomplete-input';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import api from '../../service/Api';
import moment from 'moment';

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
        };

        this.getDepartureCityAutoSuggest = this.getDepartureCityAutoSuggest.bind(this);
        this.getArrivalCityAutoSuggest = this.getArrivalCityAutoSuggest.bind(this);
        this.onDepartureDateChanged = this.onDepartureDateChanged.bind(this);
        this.onArrivalDateChanged = this.onArrivalDateChanged.bind(this);
        this.onMaxTicketCombinationChanged = this.onMaxTicketCombinationChanged.bind(this);
        this.onBtnSearchPress = this.onBtnSearchPress.bind(this);
    }

    componentDidMount() {
        // this.getDepartureCityAutoSuggest('');
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
            departureDate: moment(value).format('ddd, MMM DD YYYY')
        })
    }

    onArrivalDateChanged(value) {
        this.setState({
            arrivalDate: moment(value).format('ddd, MMM DD YYYY')
        })
    }

    onMaxTicketCombinationChanged(value) {
        this.setState({
            maxTicketCombination: value,
        });
    }

    onBtnSearchPress() {
        var params = {
            departureCityId: this.state.departureCityId,
            arrivalCityId: this.state.arrivalCityId,
            maxTicketCombination: this.state.maxTicketCombination,
            departureDate: moment(this.state.departureDate).format('YYYY-MM-DD 00:00:00'),
            arrivalDate: moment(this.state.arrivalDate).format('YYYY-MM-DD 00:00:00'),
            page: 1,
            pageSize: 10,
        };
        this.props.navigation.navigate('RouteSearchResult', {params: params});
    }

    render() {
        const { departureCityName,
            arrivalCityName,
            arrivalCitiesAutoSuggest,
            departureCitiesAutoSuggest,
            departureDate,
            arrivalDate,
            maxTicketCombination
        } = this.state;
        const { navigation } = this.props;

        const equal = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        return (
            <Container style={{ flex: 1 }}>
                <Header>
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
                            placeholder="Enter Departure City"
                            placeholderTextColor={'grey'}
                            keyExtractor={(item, index) => index.toString()}
                            // containerStyle={styles.autocompleteContainer}
                            renderItem={({ item }) => (
                                <TouchableOpacity key={item.id}
                                    onPress={() => this.setState({ departureCityName: item.name, departureCityId: item.id, departureCitiesAutoSuggest: [] })}>
                                    <Item style={{height: 35}}>
                                        <Text>
                                            {item.name}
                                        </Text>
                                    </Item>
                                </TouchableOpacity>
                            )}
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
                            placeholder="Enter Arrival City"
                            placeholderTextColor={'grey'}
                            keyExtractor={(item, index) => index.toString()}
                            // containerStyle={styles.autocompleteContainer}
                            renderItem={({ item }) => (
                                <TouchableOpacity key={item.id}
                                    onPress={() => this.setState({ arrivalCityName: item.name, arrivalCityId: item.id, arrivalCitiesAutoSuggest: [] })}>
                                    <Item style={{height: 35}}>
                                        <Text>
                                            {item.name}
                                        </Text>
                                    </Item>
                                </TouchableOpacity>
                            )}
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
                        placeHolderText="Select Departure Date"
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={this.onDepartureDateChanged}
                        disabled={false}
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
                        placeHolderText="Select Arrival Date"
                        placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={this.onArrivalDateChanged}
                        disabled={false}
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
                    >
                        <Picker.Item label="Only 1 Ticket" value={1} />
                        <Picker.Item label="Less or equal than 2 tickets" value={2} />
                        <Picker.Item label="Less or equal than 3 tickets" value={3} />
                    </Picker>

                    <View style={{ marginTop: 15 }}>
                        <Button iconLeft block primary
                            style={{margin: 10}}
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
})