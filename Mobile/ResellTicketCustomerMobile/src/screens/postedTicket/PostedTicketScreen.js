import React, { Component } from 'react';
import { Dimensions, FlatList, View } from 'react-native';
import { Container, Header, Body, Title, Button, Content, Left, Right } from 'native-base';
import { Icon } from 'react-native-elements';
import TicketView from './../../components/TicketViewComponent';
import Api from './../../service/Api';
// import { FlatList } from 'react-native-gesture-handler';
import { RNToasty } from 'react-native-toasty';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class PostedTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            postedTickets: [],
            page: 1
        }
    }

    componentWillMount() {
        this.getCustomerTickets();
    }

    componentDidMount() {
        
    }

    async getCustomerTickets() {
        const resCustomerTickets = await Api.get('api/ticket?customerId=5&page=' + this.state.page);
        if (resCustomerTickets.status === 200) {
            this.setState({
                postedTickets: resCustomerTickets.data
            })
        }
    }

    refreshPostedTicket = () => {
        this.getCustomerTickets();
    }

    onEndReached = () => {
        // this.setState({
        //     page: this.state.page + 1
        // }, () => {
        //     this.getCustomerTickets();
        // })
        // console.log('End Reached')
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
                        <Button onPress={() => navigate('PostEditTicket', { refreshPostedTicket: this.refreshPostedTicket, username: username })}>
                            <Icon name="plus-circle-outline" type="material-community" color="#fff" />
                        </Button>
                    </Right>
                </Header>
                <Content contentContainerStyle={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <FlatList onEndReached={this.onEndReached}
                        onEndReachedThreshold={0.2}
                        data={postedTickets}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => (
                            <TicketView 
                                postedTicket={item}
                                navigate={navigate}
                                refreshPostedTicket={this.refreshPostedTicket} />
                        )}>
                    </FlatList>
                </Content>
            </Container>
        )
    }
}