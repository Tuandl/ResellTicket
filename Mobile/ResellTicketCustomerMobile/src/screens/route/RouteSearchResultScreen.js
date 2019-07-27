import { Body, Button, Container, Content, Header, Left, Right, Title } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, ActivityIndicator, ImageBackground } from 'react-native';
import { Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import RouteViewComponent from '../../components/RouteComponent/RouteSearchViewComponent';
import api from '../../service/Api';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BG_IMAGE = require('../../../assets/images/empty_state.png');

export default class RouteSearchResultScreen extends Component {

    URL_ROUTE_SEARCH = 'api/route/search';
    URL_ROUTE_SAVE = 'api/route';
    params = null;
    navigation = null;

    constructor(props) {
        super(props);

        this.params = this.props.navigation.getParam('params');
        // console.log('route search params here', this.params);
        this.navigation = this.props.navigation;
        this.state = {
            routes: [],
            isLoading: false,
            isShowEmptyView: false
        };

        this.onRoutePressed = this.onRoutePressed.bind(this);
        this.saveRoute = this.saveRoute.bind(this);
    }

    componentDidMount() {
        this.searchRoutes(this.params);
    }

    async searchRoutes(params) {
        if (params === null || params === undefined) {
            this.navigation.pop();
        } else {
            this.setState({
                isLoading: true
            })
            const response = await api.post(this.URL_ROUTE_SEARCH, params);
            if(response.status === 200) {
                this.setState({
                    isLoading: false,
                    routes: response.data,
                });
                if (response.data.length === 0) {
                    this.setState({
                        isShowEmptyView: true
                    })
                } else {
                    this.setState({
                        isShowEmptyView: false
                    })
                }
            } else {
                this.setState({
                    isShowEmptyView: true
                })
            }
        }
    }

    async saveRoute(params) {
        if (params === null || params === undefined) {
            RNToasty.Error({ title: 'Cannot save route' });
        } else {
            const response = await api.post(this.URL_ROUTE_SAVE, params);
            if (response.status === 200) {
                RNToasty.Success({ title: 'Save route successfullt' });
                params.id = response.data;
                this.navigation.navigate('RouteDetail', { routeId: params.id });
            } else {
                RNToasty.Error({ title: 'Save Route Failed' });
            }
        }
    }

    onRoutePressed(route) {
        if (route.id === null || route.id === undefined || route.id <= 0) {
            this.saveRoute(route);
        } else {
            this.navigation.navigate('RouteDetail', { routeId: route.id });
        }
    }

    renderRoutes(routes) {
        if (this.state.isLoading) {
            return <ActivityIndicator size="large" animating />
        }
        return routes.map((route, index) =>
            <RouteViewComponent route={route} key={index} onRoutePressed={(route) => this.onRoutePressed(route)} />
        );
    }

    render() {
        const { routes, isShowEmptyView } = this.state;
        const { navigation } = this.props;

        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button transparent
                            onPress={() => navigation.pop()}
                        >
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>Route</Title>
                    </Body>
                    <Right>
                    </Right>
                </Header>
                {isShowEmptyView ? <ImageBackground source={BG_IMAGE} style={styles.bgImage} /> : null}
                {!isShowEmptyView ? <Content style={styles.content} contentContainerStyle={styles.contentContainer}>
                    {this.renderRoutes(routes)}
                </Content> : null}

            </Container>
        );
    }
}

const styles = StyleSheet.create({
    bgImage: {
        flex: 1,
        top: 50,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT / 1.75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        // padding: 30,
        // paddingTop: 10,
        // backgroundColor: 'lightgrey'
    },
    contentContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        paddingTop: 10,
        fontSize: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 20
    },
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        paddingTop: 25
    },
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
})