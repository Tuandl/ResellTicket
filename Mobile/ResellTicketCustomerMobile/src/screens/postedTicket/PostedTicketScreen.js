import React, { Component } from 'react';
import { Dimensions, FlatList, ActivityIndicator, ImageBackground } from 'react-native';
import { Container, Header, Body, Title, Button, Content, Left, Right, Text } from 'native-base';
import { Icon, ButtonGroup } from 'react-native-elements';
import TicketView from './../../components/TicketViewComponent';
import Api from './../../service/Api';
import TICKET_STATUS from '../../constants/TicketStatus';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BG_IMAGE = require('../../../assets/images/empty-list.png');

export default class PostedTicket extends Component {


    currentPage = 1;
    pageSize = 5;
    ticketStatus = TICKET_STATUS.ALL;
    total = 0;
    buttonIndexes = {
        all: 0,
        bought: 1,
        renamed: 2,
        completed: 3,
    };
    isExistConnectAccount = false;

    constructor(props) {
        super(props);
        this.state = {
            postedTickets: [],
            isLoading: false,
            selectedIndex: this.buttonIndexes.all,
            isStill : false,
            isShowEmptyView: false,
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
                //isLoading: false,
            })
            this.total = res.data.length;
            if(this.total === 0){
                this.setState({
                    isLoading: false,
                    isShowEmptyView: true
                })
            } else {
                this.setState({
                    isLoading: false,
                    isShowEmptyView: false
                })
            }
        } else {
            this.setState({
                isLoading: false,
                isShowEmptyView: true
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
        this.total = 0;
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

    postTicket = () => {
        this.checkExistedConnectAccount();
        if (!this.isExistConnectAccount) {
            this.props.navigation.navigate('CreateBankAccountToReceiveMoney')
        } else {
            this.props.navigation.navigate('PostEditTicket', { refreshPostedTicket: this.refreshPostedTicket, username: username })
        }
        
    }

    checkExistedConnectAccount = async () => {
        try {
            var response = await Api.get('api/customer/check-existed-connect-bank-account');
            if (response.status === 200) {
                this.isExistConnectAccount = false
            } else {
                this.isExistConnectAccount = true
            }
        } catch (error) {
            RNToasty.Error({
                title: 'Error on Load Connect Bank Account Data',
            });
        }
    }

    render() {
        const { postedTickets, isLoading, selectedIndex, isShowEmptyView } = this.state
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
                    <Body style={{ paddingLeft: 10 }}>
                        <Title>
                            Posted Ticket
                        </Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={this.postTicket}>
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
                {isShowEmptyView ? <ImageBackground source={BG_IMAGE}
                    style={{ flex: 1, top: 50, left: 0, width: SCREEN_WIDTH, height: SCREEN_HEIGHT / 1.75, justifyContent: 'center', alignItems: 'center' }} /> : null}
                {!isShowEmptyView ? <Content contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
                </Content> : null}
                
            </Container>
        )
    }
}