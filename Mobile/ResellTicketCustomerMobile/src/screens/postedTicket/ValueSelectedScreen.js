import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Container, Header, Body, Title, Item, Picker, Content, Button, Left, Label, Right } from 'native-base';
import { Icon, Input, ListItem } from 'react-native-elements';
import Api from './../../service/Api';

export default class ValueSelected extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listItems: [],
            type: ''
        }
    }

    onPress = (item) => {
        const { navigation } = this.props
        const type = this.props.navigation.getParam('type');
        navigation.state.params.onSelectValue({ item: item, type: type })
        navigation.navigate('PostNewTicket');
    }

    componentWillMount() {
        const type = this.props.navigation.getParam('type');
        if (type === 'Vehicles') {
            this.getVehicles();
        } else if (type === 'Transportations') {
            const vehicleId = this.props.navigation.getParam('vehicleId');
            this.getTransportations(vehicleId)
        } else if(type === 'TicketTypes') {
            const vehicleId = this.props.navigation.getParam('vehicleId');
            this.getTicketTypes(vehicleId)
        } else if(type === 'DepartureCities') {
            this.getCities()
        } else if(type === 'DepartureStations') {
            const departureCityId = this.props.navigation.getParam('departureCityId');
            this.getDepartStations(departureCityId)
        }
    }

    async getVehicles() {
        const resVehicle = await Api.get('api/vehicle');
        if (resVehicle.status === 200) {
            this.setState({
                listItems: resVehicle.data
            })
        }
    }

    async getTransportations(value) {
        const resTrans = await Api.get('api/transportation?vehicleId=' + value);
        if (resTrans.status === 200) {
            this.setState({
                listItems: resTrans.data
            })
        }
    }

    async getTicketTypes(value) {
        const resTicketType = await Api.get('api/ticketType?vehicleId=' + value);
        if (resTicketType.status === 200) {
            this.setState({
                listItems: resTicketType.data
            })
        }
    }

    async getCities() {
        const resCity = await Api.get('api/city');
        if (resCity.status === 200) {
            this.setState({
                listItems: resCity.data
            })
        }
    }

    async getDepartStations(value) {
        if (value !== -1) {
            const resStation = await Api.get('api/station?cityId=' + value);
            if (resStation.status === 200) {
                this.setState({
                    listItems: resStation.data
                })
            }
        }
    }

    render() {
        const { listItems } = this.state;
        const type = this.props.navigation.getParam('type')
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
                            {type}
                        </Title>
                    </Body>
                    <Right />
                </Header>
                <Content>
                    <ScrollView>
                        {listItems.map((item, index) => (
                            <ListItem key={index}
                                title={item.name}
                                onPress={() => this.onPress(item)}
                                titleStyle={{ color: 'black' }}
                                containerStyle={{ borderBottomWidth: 0.5 }} />
                        ))}
                    </ScrollView>

                </Content>
            </Container>
        )
    }
}