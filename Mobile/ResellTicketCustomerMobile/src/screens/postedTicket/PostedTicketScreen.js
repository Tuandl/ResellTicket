import React, { Component } from 'react';
import { Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { Container, Header, Body, Title, Button, Content, Left, Right } from 'native-base';
import { Icon } from 'react-native-elements';
import TicketView from './../../components/TicketViewComponent';
import Api from './../../service/Api';

export default class PostedTicket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            postedTickets: [],
            page: 1,
            isLoading: false,
            isStill: false
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        this.getCustomerTickets();
    }

    async getCustomerTickets() {
        this.setState({
            isLoading: true
        })
        const resCustomerTickets = await Api.get('api/ticket?page=' + this.state.page);
        if (resCustomerTickets.status === 200) {
            if (resCustomerTickets.data.length === 5) {
                this.setState({
                    isStill: true
                })
            } else {
                this.setState({
                    isStill: false
                })
            }
            this.setState({
                postedTickets: [...this.state.postedTickets, ...resCustomerTickets.data],
                isLoading: false
            })

        }
    }

    refreshPostedTicket = (ticket, index) => {
        if(index >= 0) {
            this.state.postedTickets.splice(index, 1)
        }
        if(ticket !== null) {
            this.setState({
                postedTickets: [ticket, ...this.state.postedTickets]
            })
        } else {
            this.setState({
                postedTickets: this.state.postedTickets
            })
        }
    }

    onEndReached = () => {
        if (this.state.isStill) {
            this.setState({
                page: this.state.page + 1
            }, () => {
                this.getCustomerTickets();
            })
        }
    }

    render() {
        const { postedTickets, isLoading } = this.state
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
                <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <FlatList onEndReached={this.onEndReached}
                        onEndReachedThreshold={0.2}
                        data={postedTickets}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TicketView
                                index={index}
                                postedTicket={item}
                                navigate={navigate}
                                refreshPostedTicket={this.refreshPostedTicket} />
                        )}
                        ListFooterComponent={isLoading ? <ActivityIndicator size="large" animating /> : ''}>
                    </FlatList>
                </Content>
            </Container>
        )
    }
}