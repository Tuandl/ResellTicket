import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, AsyncStorage } from 'react-native';
import { Container, Text, Content, List, ListItem, Left, Right } from 'native-base';
import { Icon, Avatar } from 'react-native-elements';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');

export default class MeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    componentDidMount() {
        this.getUsename();
    }

    async getUsename() {
        var usernameDefault = await AsyncStorage.getItem('USERNAME');
        //var data = JSON.parse(usernameDefault);
        console.log('Mescreen', usernameDefault);
        this.setState({
            username: usernameDefault
        })
    }

    render() {
        const { navigate } = this.props.navigation;
        const { username } = this.state;
        return (
            <Container style={{ flex: 1 }}>
                <Content style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={styles.avatar}>
                        <Avatar />
                        <Text>{username}</Text>
                    </View>
                    <View style={styles.profile}>
                        <List>
                            <TouchableNativeFeedback onPress={() => navigate('PostedTicket', { username: username })}>
                                <ListItem style={{borderBottomWidth: 0.5}}>
                                    <Left>
                                        <Text>Posted Ticket</Text>
                                    </Left>
                                    <Right style={{ opacity: 0.5 }}>
                                        <Icon name="chevron-right" type="font-awesome" size={15}/>
                                    </Right>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback>
                                <ListItem style={{borderBottomWidth: 0.5}}>
                                    <Left>
                                        <Text>Credit Card</Text>
                                    </Left>
                                    <Right style={{ opacity: 0.5 }}>
                                        <Icon name="chevron-right" type="font-awesome" size={15}/>
                                    </Right>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback>
                                <ListItem style={{borderBottomWidth: 0.5}}>
                                    <Left><Text>Transaction History</Text></Left>
                                    <Right style={{ opacity: 0.5 }}>
                                        <Icon name="chevron-right" type="font-awesome" size={15}/>
                                    </Right>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback onPress={() => navigate('ProfileDetail')}>
                                <ListItem style={{borderBottomWidth: 0.5}}>
                                    <Left>
                                        <Text>Edit Profile</Text></Left>
                                    <Right style={{ opacity: 0.5 }}>
                                        <Icon name="chevron-right" type="font-awesome" size={15}/>
                                    </Right>
                                </ListItem>
                            </TouchableNativeFeedback>
                            <ListItem style={{borderBottomWidth: 0.5}}>
                                <Text>Logout</Text>
                            </ListItem>
                        </List>
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    avatar: {
        flex: 1,
        backgroundColor: 'blue',
        height: height / 4,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profile: {
        flex: 3,
        paddingTop: 10
    }
})