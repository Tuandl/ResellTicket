import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Container, Header, Body, Title, Item, Content, Button, Left, Label, Right } from 'native-base';
import { Icon } from 'react-native-elements';
import Api from '../../service/Api';
import { ScrollView } from 'react-native-gesture-handler';

export default class PassengerInformationScreen extends Component {
    navigation = null;
    constructor(props) {
        super(props);
        this.navigation = props.navigation;
        const params = this.navigation.getParam('params');
        this.state = {
            ticketId: params.ticketId,
            passengerName: '',
            emailBooking: '',
            passengerId: null
        }
    }

    componentDidMount() {
        this.getTicketDetail();
    }

    async getTicketDetail() {
        const ticketId = this.state.ticketId;
        const res = await Api.get('api/ticket/detail?ticketId=' + ticketId);
        if (res.status === 200) {
            const ticketDetail = res.data
            this.setState({
                passengerName: ticketDetail.passengerName,
                emailBooking: ticketDetail.emailBooking,
                passengerId: ticketDetail.passengerId
            })
        }
    }

    render() {
        const {
            passengerName,
            emailBooking,
            passengerId
        } = this.state
        const { navigate } = this.props.navigation;
        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button
                            onPress={() => navigate('DetailTicket')}>
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Passenger Information</Title>
                    </Body>
                    <Right />
                </Header>
                <ScrollView>
                    <Content style={styles.content} contentContainerStyle={styles.contentContainer}>
                        <Label style={styles.label}>Passenger Name:</Label>
                        <Item style={styles.detail}>
                            <Text style={{ color: 'black' }}>{passengerName}</Text>
                        </Item>
                        <Label style={styles.label}>Passenger Id:</Label>
                        <Item style={styles.detail}>
                            <Text style={{ color: 'black' }}>{passengerId}</Text>
                        </Item>
                        <Label style={styles.label}>Passenger Email:</Label>
                        <Item style={styles.detail}>
                            <Text style={{ color: 'black' }}>{emailBooking}</Text>
                        </Item>
                    </Content>
                </ScrollView>
            </Container>
        )
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
    detail: {
        height: 30,
        paddingLeft: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 20
    }
})