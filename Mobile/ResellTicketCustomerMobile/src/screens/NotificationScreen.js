import { Body, Container, Content, Header, Right, Title } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import NotificationListComponent from '../components/NotificationListComponent';
import api from '../service/Api';
import convertDateTime from '../helper/convertDateTime';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

class NotificationScreen extends Component {

    page = 1;
    pageSize = 10;
    total = 0;

    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
        };

        this.getNotification = this.getNotification.bind(this);
    }

    componentDidMount() {
        this.getNotification(this.page, this.pageSize);
    }

    async getNotification(page, pageSize) {
        const param = {
            page: page, 
            pageSize: pageSize,
        };
        const response = await api.get(`api/notification/data-table`, param);

        if(response.status === 200) {
            this.total = response.data.total;
            this.setState({
                notifications: response.data.data.map(notification => {
                    return {
                        ...notification,
                        createdAt: convertDateTime.convertToLocalFromUTC(notification.createdAtUTC),
                    }
                }),
            });
        }
    }

    render() {
        const { notifications } = this.state;

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
                        <NotificationListComponent notifications={notifications}/>
                    </View>
                </Content>
            </Container>
        );
    }
}

export default withNavigation(NotificationScreen);