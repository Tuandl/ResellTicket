import { Body, Button, Container, Content, Header, Left, Right, Title } from 'native-base';
import React, { Component } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import RouteViewComponent from '../../components/RouteViewComponent';
import api from '../../service/Api';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class RouteSearchResultScreen extends Component {

    URL_ROUTE_SEARCH = 'api/route/search';
    URL_ROUTE_SAVE = 'api/route';
    params = null;
    navigation = null;

    constructor(props) {
        super(props);

        this.params = this.props.navigation.getParam('params');
        console.log('route search params here', this.params);
        this.navigate = this.props.navigation;
        this.state = {
            routes: [],
        };
    }

    componentDidMount() {
        this.searchRoutes(this.params);
    }

    async searchRoutes(params) {
        if(params === null || params === undefined) {
            this.navigation.pop();
        } else {
            const response = await api.get(this.URL_ROUTE_SEARCH, params);
            if(response.status === 200) {
                this.setState({
                    routes: response.data,
                });
            } else {
                RNToasty.Error({
                    title: 'Search Error.'
                })
            }
        }
    }

    async saveRoute(params) {
        if(params === null || params === undefined) {
            RNToasty.Error({title: 'Cannot save route'});
        } else {
            const response = await api.post(this.URL_ROUTE_SAVE, params);
            if(response.status === 200) {
                RNToasty.Success({title: 'Save route successfullt'});
            } else {
                RNToasty.Error({title: 'Save Route Failed'});
            }
        }
    }

    renderRoutes(routes) {
        return routes.map((route, index) => 
            <RouteViewComponent route={route} key={index} onRoutePressed={(params) => this.saveRoute(params)}/>
        );
    }

    render() {
        const {routes} = this.state;
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
                <Content style={styles.content} contentContainerStyle={styles.contentContainer}>
                    {this.renderRoutes(routes)}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
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