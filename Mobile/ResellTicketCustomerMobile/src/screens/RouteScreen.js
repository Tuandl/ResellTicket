import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Icon } from 'react-native-elements'
import { Container, Header, Left, Body, Right, Title, Button, Text, Content } from 'native-base';
import RouteView from './../components/RouteViewComponent';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

export default class RouteScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        //  const BadgedIcon = withBadge(2)(Icon)
        return (

            <Container style={{ flex: 1 }}>
                <Header>
                    <Left />
                    <Body>
                        <Title>
                            Route
                        </Title>
                    </Body>
                    <Right>
                        <Button>
                            <Icon name="search" type="font-awesome" color="#fff"/>
                        </Button>
                    </Right>
                </Header>
                <Content style={{ flex: 1, backgroundColor: '#b3e5fc' }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                    
                    <RouteView />
                    <RouteView />
                    <RouteView />
                    <RouteView />
                </Content>
            </Container>
        );
    }
}

