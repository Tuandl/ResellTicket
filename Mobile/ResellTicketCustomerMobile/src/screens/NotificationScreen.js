import {StyleSheet, Body, Container, Content, Header, Right, Title, Button } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, View, ImageBackground } from 'react-native';
import { Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import { withNavigation } from 'react-navigation';
import NotificationListComponent from '../components/NotificationListComponent';
import convertDateTime from '../helper/convertDateTime';
import api from '../service/Api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BG_IMAGE = require('../../assets/images/empty-list.png');

class NotificationScreen extends Component {

    page = 1;
    pageSize = 10;
    total = 0;

    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            isLoading: false,
            isShowEmptyView: false
        };

        this.getNotification = this.getNotification.bind(this);
        this.getMoreNotification = this.getMoreNotification.bind(this);
        this.readNotification = this.readNotification.bind(this);
        this.handleOnReadAllClicked = this.handleOnReadAllClicked.bind(this);
        this.resetData = this.resetData.bind(this);
    }

    componentDidMount() {
        // this.getNotification(this.page, this.pageSize);
        const self = this;
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            self.resetData.bind(self)();
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
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

        if (response.status === 200) {
            const listData = response.data.data.map(notification => {
                return {
                    ...notification,
                    createdAt: convertDateTime.convertToLocalFromUTC(notification.createdAtUTC),
                }
            });
            this.total = response.data.total;
            if (this.total === 0) {
                this.setState({
                    isShowEmptyView: true
                })
            } else {
                this.setState({
                    isShowEmptyView: false
                })
            }
            this.setState({
                notifications: [...this.state.notifications, ...listData],
                isLoading: false,
            });
        } else {
            this.setState({
                isShowEmptyView: true
            })
        }
    }

    getMoreNotification() {
        if (this.state.notifications.length < this.total) {
            this.page++;
            this.getNotification(this.page, this.pageSize);
        }
    }

    readNotification(notificationId) {
        this.sendReadNotificationMessage(notificationId);

        const notifications = [...this.state.notifications];
        notifications.forEach(notification => {
            if (notification.id === notificationId) {
                notification.read = true;
            }
        });

        this.setState({
            notifications: notifications,
        });
    }

    async sendReadNotificationMessage(notificationId) {
        const response = await api.post(`api/notification/${notificationId}/read`);
        if (response.status !== 200) {
            RNToasty.Error({
                title: 'Error while sending read notification request.',
            });
        }
    }

    async handleOnReadAllClicked() {
        const response = await api.post('api/notification/read-all');
        if (response.status === 200) {
            this.resetData();
        } else {
            RNToasty.Error({
                title: 'An Error occured when clear all notification.'
            })
        }
    }

    resetData() {
        //clear notification
        this.page = 1;
        this.pageSize = 10;
        this.total = 0;
        this.setState({
            notifications: [],
            isLoading: true
        });
        this.getNotification(this.page, this.pageSize);
    }

    render() {
        const { notifications, isLoading, isShowEmptyView } = this.state;

        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Body style={{ paddingLeft: 10 }}>
                        <Title>Notification</Title>
                    </Body>
                    <Right>
                        <Button transparent
                            onPress={() => { this.handleOnReadAllClicked(); }}
                        >
                            <Icon name='clear-all' type='material' color="#fff" />
                        </Button>
                    </Right>
                </Header>
                {isShowEmptyView ? <ImageBackground source={BG_IMAGE} 
                style={{flex:1, top: 50, left: 0,width:SCREEN_WIDTH, height: SCREEN_HEIGHT/2,justifyContent: 'center', alignItems: 'center'}} /> : null}
                {!isShowEmptyView ? <Content style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{ flex: 1, backgroundColor: "rgb(255,255,255)" }}>
                        <NotificationListComponent
                            notifications={notifications}
                            isLoading={isLoading}
                            getMoreNotification={this.getMoreNotification}
                            readNotification={this.readNotification}
                        />
                    </View>
                </Content> : null}

            </Container>
        );
    }
}


export default withNavigation(NotificationScreen);