import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, ActivityIndicator } from "react-native";
import { Left, Body, Right, Title } from "native-base";
import { Container, Header, Button } from 'native-base';
import Api from '../../service/Api';
import { Icon } from 'react-native-elements';
import { RNToasty } from 'react-native-toasty';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import formatConstant from '../../constants/formatConstant';


export default class TransactionViewListScreen extends Component {
    currentPage = 1;
    pageSize = 7;
    constructor(props) {
        super(props);
        this.state = {
            transaction: [],
            isLoading: false,
            isStill: false
        }

    }

    componentDidMount() {
        this.getTransactionList();
    }

    async getTransactionList() {
        this.setState({
            isLoading: true,
            isStill: false
        })
        const params = {
            page: this.currentPage,
            pageSize: this.pageSize
        }
        try {
            var transactionResponse = await Api.get('/api/customer/get-transaction', params);
            console.log('repone', transactionResponse);
            if (transactionResponse.status === 200) {
                // this.isStill = res.data.length === this.pageSize ? true : false
                this.setState({
                    isStill: transactionResponse.data.length === this.pageSize ? true : false,
                })
                console.log('isStill', this.state.isStill);
                this.setState({
                    transaction: [...this.state.transaction, ...transactionResponse.data],
                    isLoading: false,
                })
            }
        } catch (error) {
            RNToasty.Error({
                title: 'Error when Load Transaction Data'
            });
        }
    }

    refreshTransaction = () => {
        this.setState({
            transaction: [],
            page: 1
        }, () => {
            this.getTransactionList();
        })
    }

    onEndReached = () => {
        if (this.state.isStill) {
            this.currentPage += 1;
            this.getTransactionList();
        }
    }


    render() {
        const { transaction, isLoading } = this.state;
        return (
            <Container style={{ flex: 1 }}>
                <Header>
                    <Left>
                        <Button transparent
                            onPress={() => this.props.navigation.navigate('Me')}>
                            <Icon name="arrow-left" type="material-community" color="#fff" />
                        </Button>
                    </Left>
                    <Body>
                        <Title>
                            My Transaction
                        </Title>
                    </Body>
                </Header>
                <View style={[styles.root, this.props.style]}>
                    <FlatList
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={0.1}
                        data={transaction}
                        renderItem={({ item, separators }) => (
                            <View style={styles.rect}>
                                <Text style={styles.rowTitle}>{item.type}</Text>
                                <Text style={styles.rowSubTitle}>
                                    {item.description}
                                </Text>

                                {item.type == "Payment" ? <NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true}
                                    decimalScale={2} decimalSeparator={'.'} allowNegative={false}
                                    renderText={value => (
                                        <Text style={styles.text}>- ${value}</Text>
                                    )}
                                /> : <NumberFormat value={item.amount} displayType={'text'} thousandSeparator={true}
                                    decimalScale={2} decimalSeparator={'.'} allowNegative={false}
                                    renderText={value => (
                                        <Text style={styles.plus}>+ ${value}</Text>
                                    )}
                                    />}


                                <Text style={styles.text2}>{moment(item.createdAtUTC).format(formatConstant.NOTIFICATION_TIME)}</Text>
                            </View>
                        )}
                        ListFooterComponent={isLoading ? <ActivityIndicator size="large" animating /> : ''}
                        ItemSeparatorComponent={() => <View style={styles.rect2} />}
                        style={styles.list}
                        // ListFooterComponent={isLoading ? <ActivityIndicator size="large" animating /> : ''}></FlatList>
                    />
                </View>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#FFF",
        paddingTop: 8
    },
    list: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    rect: {
        height: 100,
        marginLeft: 16,
        padding: 16,
        paddingLeft: 0,
        borderColor: "#000000",
        borderWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0
    },
    rowTitle: {
        color: "rgba(0,0,0,1)",
        paddingBottom: 8,
        fontSize: 16,
        fontWeight: "600"
    },
    rowSubTitle: {
        color: "rgba(79,79,79,1)",
        alignSelf: "stretch",
        fontSize: 13,
        lineHeight: 16
    },
    text: {
        top: 12,
        width: 200,
        color: "rgba(183,28,28,1)",
        position: "absolute",
        fontSize: 20,
        right: 30,
        fontWeight: "bold",
        textAlign: "right"
    },
    plus: {
        top: 12,
        width: 200,
        color: "#1faa00",
        position: "absolute",
        fontSize: 20,
        right: 30,
        fontWeight: "bold",
        textAlign: "right"
    },
    text2: {
        top: 77.2,
        left: 0,
        height: 12.21,
        color: "rgba(17,86,146,1)",
        position: "absolute",
        right: 0,
        fontSize: 10,
        fontStyle: "italic"
    },
    rect2: {
        width: "100%",
        height: 1,
        backgroundColor: "rgba(138,138,138,1)"
    }
});
