import React, { Component } from 'react';
import { Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { Container, Header, Body, Title, Button, Content, Left, Right, Text } from 'native-base';
import { Icon, ButtonGroup } from 'react-native-elements';
import TicketView from './../../components/TicketViewComponent';
import Api from './../../service/Api';
import TICKET_STATUS from '../../constants/TicketStatus';

export default class PostedTicket extends Component {

    
    currentPage = 1;
    pageSize = 5;
    ticketStatus = TICKET_STATUS.ALL;
    buttonIndexes = {
        all: 0,
        bought: 1,
        renamed: 2,
        completed: 3,
    };

    constructor(props) {
        super(props);
        this.state = {
            postedTickets: [],
            isLoading: false,
            selectedIndex: this.buttonIndexes.all,
            isStill : false
        }
    }

    componentWillMount() {

    }

    componentDidMount() {
        
        this.getCustomerTickets();
    }

    async getCustomerTickets() {
        this.setState({
            isLoading: true,
            isStill: false
        })
        const params = {
            page: this.currentPage,
            pageSize: this.pageSize,
            status: this.ticketStatus
        }
        const res = await Api.get('api/ticket', params);
        if (res.status === 200) {
            // this.isStill = res.data.length === this.pageSize ? true : false
            this.setState({
                isStill: res.data.length === this.pageSize ? true : false,
            })
            this.setState({
                postedTickets: [...this.state.postedTickets, ...res.data],
                isLoading: false,
            })
        }
    }

    refreshPostedTicket = () => {
        this.setState({
            postedTickets: [],
            page: 1
        }, () => {
            this.getCustomerTickets();
        })

    }

    onEndReached = () => {
        if (this.state.isStill) {
            this.currentPage += 1;
            this.getCustomerTickets();
        }
    }

    updateButtonGroupIndex = (selectedIndex) => {
        this.setState({
            selectedIndex: selectedIndex,
            postedTickets: [],
        })
        this.currentPage = 1;
        switch (selectedIndex) {
            case this.buttonIndexes.all:
                this.ticketStatus = TICKET_STATUS.ALL;
                break;
            case this.buttonIndexes.bought:
                this.ticketStatus = TICKET_STATUS.BOUGHT;
                break;
            case this.buttonIndexes.renamed:
                this.ticketStatus = TICKET_STATUS.RENAMED;
                break;
            case this.buttonIndexes.completed:
                this.ticketStatus = TICKET_STATUS.COMPLETED;
                break;
        }
        this.getCustomerTickets(selectedIndex);
    }

    render() {
        const { postedTickets, isLoading, selectedIndex } = this.state
        const username = this.props.navigation.getParam('username');
        const { navigate } = this.props.navigation;
        const buttonAll = () => <Text>All</Text>
        const buttonBought = () => <Text>Bought</Text>
        const buttonRenamed = () => <Text>Renamed</Text>
        const buttonCompleted = () => <Text>Completed</Text>
        const buttons = [{ element: buttonAll }, { element: buttonBought }, { element: buttonRenamed }, { element: buttonCompleted }];

        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    {/* <Left>
                        <Button transparent
                            onPress={() => navigate('Me')}>
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left> */}
                    <Body style={{paddingLeft: 10}}>
                        <Title>
                            Posted Ticket
                        </Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => navigate('PostEditTicket', { refreshPostedTicket: this.refreshPostedTicket, username: username })}>
                            <Icon name="plus-circle-outline" type="material-community" color="#fff" />
                        </Button>
                    </Right>
                </Header>
                <ButtonGroup
                    onPress={this.updateButtonGroupIndex}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                    containerStyle={{ borderRadius: 25 }}
                />
                <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <FlatList onEndReached={this.onEndReached}
                        onEndReachedThreshold={0.1}
                        data={postedTickets}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <TicketView
                                key={index}
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