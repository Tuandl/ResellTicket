import React, { Component } from 'react';
import { Dimensions } from 'react-native';
import { Container, Header, Body, Title, Button, Content, List, ListItem, Left, Right } from 'native-base';
import { Icon } from 'react-native-elements';
import TicketView from './../../components/TicketViewComponent';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class PostedTicket extends Component {
    render() {
        const username = this.props.navigation.getParam('username');
        const {navigate} = this.props.navigation;
        return (
            <Container style={{ flex: 1 }}>
                <Header style={{alignItems:'flex-end'}}>
                    <Left>
                        <Button 
                        onPress={() => navigate('Me')}>
                            <Icon name="arrow-left" type="material-community" color="#fff"/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>
                            Posted Ticket
                        </Title>
                    </Body>
                    <Right>
                        <Button onPress={() => navigate('PostNewTicket', {username: username})}>
                            <Icon name="plus-circle-outline" type="material-community" color="#fff"/>
                        </Button>
                    </Right>
                </Header>
                <Content padder
                    style={{ flex: 1, backgroundColor: '#b3e5fc' }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                        <TicketView />
                </Content>
            </Container>
        )
    }
}