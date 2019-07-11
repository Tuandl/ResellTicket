import { Body, Container, Content, Header, Right, Title } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import NotificationListComponent from '../components/NotificationListComponent';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class NotificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    {/* <Left></Left> */}
                    <Body style={{paddingLeft: 10}}>
                        <Title>Notification</Title>
                    </Body>
                    <Right>
                        <Button transparent
                            onPress={() => navigate('RouteSearchForm')}
                        >
                            <Icon name='search' color="#fff" />
                        </Button>
                    </Right>
                </Header>
                <Content style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{flex: 1, backgroundColor: "rgb(255,255,255)"}}>
                        <NotificationListComponent/>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default withNavigation(NotificationScreen);