import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { Container, Header, Body, Title, Button, Content, Left, Right } from 'native-base';
import { Icon } from 'react-native-elements';
import TicketView from './../../components/TicketViewComponent';
import Api from './../../service/Api';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class PostedTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            postedTickets: []
        }
    }

    componentWillMount() {
        this.getCustomerTickets();
    }

    async getCustomerTickets() {
        const resCustomerTickets = await Api.get('api/ticket?customerId=' + 1);
        if (resCustomerTickets.status === 200) {
            this.setState({
                postedTickets: resCustomerTickets.data
            })
        }
    }

    refreshPostedTicket = () => {
        this.getCustomerTickets();
    }

    render() {
        const { postedTickets } = this.state
        const username = this.props.navigation.getParam('username');
        const { navigate } = this.props.navigation;
        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button
                            onPress={() => navigate('Me')}>
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>
                            Posted Ticket
                        </Title>
                    </Body>
                    <Right>
                        <Button onPress={() => navigate('PostNewTicket', { refreshPostedTicket: this.refreshPostedTicket, username: username })}>
                            <Icon name="plus-circle-outline" type="material-community" color="#fff" />
                        </Button>
                    </Right>
                </Header>
                <Content padder
                    style={{ flex: 1 }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                    {postedTickets.map((postedTicket, index) => {
                        return (<TicketView key={index} 
                            postedTicket={postedTicket} 
                            navigate={navigate} 
                            refreshPostedTicket= {this.refreshPostedTicket}/>)
                    })}
                </Content>
            </Container>
        )
    }
}