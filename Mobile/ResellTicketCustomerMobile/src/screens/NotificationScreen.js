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
            isLoading: false,
        };

        this.getNotification = this.getNotification.bind(this);
        this.getMoreNotification = this.getMoreNotification.bind(this);
    }

    componentDidMount() {
        this.getNotification(this.page, this.pageSize);
    }

    async getNotification(page, pageSize) {

        this.setState({
            isLoading: true,
        });

        const param = {
            page: page, 
            pageSize: pageSize,
        };
        const response = await api.get(`api/notification/data-table`, param);

        if(response.status === 200) {
            const listData = response.data.data.map(notification => {
                return {
                    ...notification,
                    createdAt: convertDateTime.convertToLocalFromUTC(notification.createdAtUTC),
                }
            });
            this.total = response.data.total;
            this.setState({
                notifications: [...this.state.notifications, ...listData],
                isLoading: false,
            });
        }
    }

    getMoreNotification() {
        if(this.state.notifications.length < this.total) {
            this.page++;
            this.getNotification(this.page, this.pageSize);
        }
    }

    render() {
        const { notifications, isLoading } = this.state;

        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Body style={{paddingLeft: 10}}>
                        <Title>Notification</Title>
                    </Body>
                    <Right>
                        <Button transparent
                            onPress={() => navigate('RouteSearchForm')}
                        >
                            <Icon name='search' type="material-community" color="#fff" />
                        </Button>
                    </Right>
                </Header>
                <Content style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{flex: 1, backgroundColor: "rgb(255,255,255)"}}>
                        <NotificationListComponent 
                            notifications={notifications}
                            isLoading={isLoading}
                            getMoreNotification={this.getMoreNotification}
                        />
                    </View>
                </Content>
            </Container>
        );
    }
}

export default withNavigation(NotificationScreen);