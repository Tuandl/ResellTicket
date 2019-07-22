import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, ActivityIndicator, FlatList } from 'react-native';
import { Icon, ButtonGroup } from 'react-native-elements'
import { Container, Header, Left, Body, Right, Title, Button, Text, Content } from 'native-base';
import RouteHistoryView from '../../components/RouteComponent/RouteHistoryViewComponent';
import api from '../../service/Api';
import { RNToasty } from 'react-native-toasty';
import ROUTE_STATUS from '../../constants/routeStatus';
import { withNavigation } from 'react-navigation';

const {width} = Dimensions.get('window');
const {height} = Dimensions.get('window');

class RouteScreen extends Component {

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
            isLoading: false
        };
        this.updateButtonGroupIndex = this.updateButtonGroupIndex.bind(this);
        this.onHistoryPressed = this.onHistoryPressed.bind(this);
    }

    componentDidMount() {
        this.getCustomerRoute();
        const self = this;
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            self.getCustomerRoute.bind(self)();
        });
    }

    componentWillUnmount() {
        this.focusListener.remove();
    }

    async getCustomerRoute(selectedIndex) {
        this.setState({
            isLoading: true
        })
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
                    isLoading: false
                });
            } else {
                this.setState({
                    routes: response.data.data,
                    selectedIndex: selectedIndex,
                    isLoading: false
                });
            }
        }
    }

    renderRoutes(routes) {
        var {isLoading} = this.state;
        if(isLoading) {
            return <ActivityIndicator size="large" animating />
        } 
        return routes.map((route) =>
            <RouteHistoryView route={route} key={route.id} onPress={this.onHistoryPressed}/>
        );
    }

    onHistoryPressed(route) {
        this.props.navigation.navigate('RouteDetail', {routeId: route.id});
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
        const { routes, selectedIndex, isLoading } = this.state;
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
                    {/* <FlatList onEndReached={this.onEndReached}
                        onEndReachedThreshold={0.1}
                        data={postedTickets}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <RouteHistoryView
                                route={route} key={route.id} 
                                onPress={this.onHistoryPressed}
                                navigate={navigate} />
                        )}
                        ListFooterComponent={isLoading ? <ActivityIndicator size="large" animating /> : ''}>
                    </FlatList> */}
                </Content>
            </Container>
        );
    }
}

export default withNavigation(RouteScreen);