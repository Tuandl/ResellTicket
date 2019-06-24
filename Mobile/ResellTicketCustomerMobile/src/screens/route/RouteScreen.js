import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Icon, ButtonGroup } from 'react-native-elements'
import { Container, Header, Left, Body, Right, Title, Button, Text, Content } from 'native-base';
import RouteHistoryView from '../../components/RouteComponent/RouteHistoryViewComponent';
import api from '../../service/Api';
import { RNToasty } from 'react-native-toasty';
import ROUTE_STATUS from '../../constants/routeStatus';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

export default class RouteScreen extends Component {

    urlRouteDataTable = 'api/route/data-table';
    currentPage = 1;
    pageSize = 10;
    routeStatus = ROUTE_STATUS.NEW;
    buttonIndexes = {
        history: 0,
        bought: 1,
        completed: 2,
    };

    constructor(props) {
        super(props);
        this.state = {
            routes: [],
            selectedIndex: this.buttonIndexes.history,
        };
        this.updateButtonGroupIndex = this.updateButtonGroupIndex.bind(this);
        this.onHistoryPressed = this.onHistoryPressed.bind(this);
    }

    componentDidMount() {
        this.getCustomerRoute();
    }

    async getCustomerRoute(selectedIndex) {
        const params = {
            page: this.currentPage,
            pageSize: this.pageSize,
            status: this.routeStatus,
        }
        const response = await api.get(this.urlRouteDataTable, params);
        if(response.status === 200) {
            if(selectedIndex === undefined) {
                this.setState({
                    routes: response.data.data,
                });
            } else {
                this.setState({
                    routes: response.data.data,
                    selectedIndex: selectedIndex,
                });
            }
        }
    }

    refreshRoute = () => {
        this.getCustomerRoute();
    }

    renderRoutes(routes) {
        return routes.map((route, index) => 
            <RouteHistoryView route={route} key={index} onPress={this.onHistoryPressed}/>
        );
    }

    onHistoryPressed(route) {
        this.props.navigation.navigate('RouteDetail', {refreshRoute: this.refreshRoute, routeId: route.id});
    }

    updateButtonGroupIndex(selectedIndex) {
        switch(selectedIndex) {
            case this.buttonIndexes.history:
                this.routeStatus = ROUTE_STATUS.NEW;
                break;
            case this.buttonIndexes.bought: 
                this.routeStatus = ROUTE_STATUS.BOUGHT;
                break;
            case this.buttonIndexes.completed: 
                this.routeStatus = ROUTE_STATUS.COMPLETED;
                break;
        }
        this.getCustomerRoute(selectedIndex);
    }

    render() {
        const { routes, selectedIndex } = this.state;
        const { navigate } = this.props.navigation;

        const buttonHistory = () => <Text>History</Text>
        const buttonBought = () => <Text>Bought</Text>
        const buttonCompleted = () => <Text>Completed</Text>

        const buttons = [{element: buttonHistory}, {element: buttonBought}, {element: buttonCompleted}];

        //  const BadgedIcon = withBadge(2)(Icon)
        return (

            <Container style={{ flex: 1 }}>
                <Header>
                    <Left></Left>
                    <Body>
                        <Title>Route</Title>
                    </Body>
                    <Right>
                        <Button transparent
                            onPress={() => navigate('RouteSearchForm')}
                        >
                            <Icon name='search' color="#fff" />
                        </Button>
                    </Right>
                </Header>
                <ButtonGroup
                    onPress={this.updateButtonGroupIndex}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                    containerStyle={{borderRadius: 25}}
                />
                <Content style={{ flex: 1, backgroundColor: 'white' }}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}>
                    {this.renderRoutes(routes)}
                </Content>
            </Container>
        );
    }
}

