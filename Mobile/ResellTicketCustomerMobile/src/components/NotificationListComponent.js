import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, TextInput, ActivityIndicator } from "react-native";
import { Center } from "@builderx/utils";
import Svg, { Ellipse } from "react-native-svg";
import moment from 'moment';
import formatConstant from "../constants/formatConstant";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

export default class NotificationListComponent extends Component {

    constructor(props) {
        super(props);
        
        this.handleOnEndReached = this.handleOnEndReached.bind(this);
        this.handleOnItemPressed = this.handleOnItemPressed.bind(this);
    }

    handleOnEndReached() {
        this.props.getMoreNotification();
    }

    handleOnItemPressed(item) {
        this.props.readNotification(item.id);
    }

    render() {
        const { notifications } = this.props;
        const iconColorUnread = 'rgba(126,211,33,1)';
        const iconColorRead = 'rgb(224, 224, 224)';

        return (
            <View style={[styles.root, this.props.style]}>
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item, separators }) => (
                        <TouchableNativeFeedback onPress={() => this.handleOnItemPressed(item)}>
                            <View style={styles.rowBgColor}>
                                <Center vertical>
                                    <View style={styles.group}>
                                        <Text style={item.read ? styles.rowTitleRead : styles.rowTitleUnread}>Notification</Text>
                                        <Text style={item.read ? styles.messageRead : styles.messageUnread}>
                                            {item.message}
                                        </Text>
                                        <Text style={styles.rowCreatedAt}>
                                            {moment(item.createdAt).format(formatConstant.NOTIFICATION_TIME)}
                                        </Text>
                                    </View>
                                </Center>
                                <Svg viewBox={"0 0 15.33 15.33"} style={styles.ellipse}>
                                    <Ellipse
                                        strokeWidth={7}
                                        fill={item.read ? iconColorRead : iconColorUnread}
                                        stroke={item.read ? iconColorRead : iconColorUnread}
                                        cx={7.67}
                                        cy={7.67}
                                        rx={3.67}
                                        ry={3.67}
                                    />
                                </Svg>
                            </View>
                        </TouchableNativeFeedback>
                    )}
                    ListFooterComponent={this.props.isLoading ? <ActivityIndicator size="large" animating /> : ''}
                    onEndReached={this.handleOnEndReached}
                    onEndReachedThreshold={0.1}
                    style={styles.list}
                />
            </View>
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
    rowBgColor: {
        height: 86,
        flexDirection: "row",
        alignItems: "center",
        marginTop: 1,
        paddingLeft: 16,
        borderColor: "rgba(189,189,189,1)",
        borderWidth: 1,
        borderTopWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0.5,
        borderLeftWidth: 0
    },
    group: {
        top: "0.12%",
        left: 45.11,
        height: 87,
        position: "absolute",
        flexDirection: "column",
        alignItems: "flex-end",
        right: 0,
        flexWrap: "nowrap",
        justifyContent: "space-between",
        padding: 2,
        paddingTop: 4
    },
    rowTitleRead: {
        color: "#787878",
        flexDirection: "column",
        alignSelf: "stretch",
        paddingBottom: 8,
        fontSize: 17
    },
    rowTitleUnread: {
        color: "#212121",
        flexDirection: "column",
        alignSelf: "stretch",
        paddingBottom: 8,
        fontSize: 17
    },
    messageRead: {
        flex: 1,
        color: "#9E9E9E",
        flexDirection: "row",
        alignSelf: "flex-start",
        justifyContent: "space-between",
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0,
        textAlign: "left"
    },
    messageUnread: {
        flex: 1,
        color: "#424242",
        flexDirection: "row",
        alignSelf: "flex-start",
        justifyContent: "space-between",
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0,
        textAlign: "left"
    },
    textInput: {
        width: 94.14,
        height: 18.5,
        color: "rgba(255,255,255,1)",
        flexDirection: "column",
        alignSelf: "flex-end",
        justifyContent: "space-between",
        marginRight: 2,
        marginBottom: 2,
        fontSize: 10,
        fontWeight: "400",
        fontStyle: "italic",
        textAlign: "left"
    },
    rowCreatedAt: {
        width: 94.14,
        height: 18.5,
        color: "rgba(74,144,226,1)",
        flexDirection: "column",
        alignSelf: "flex-end",
        justifyContent: "space-between",
        marginRight: 6,
        marginBottom: 2,
        fontSize: 10,
        fontWeight: "400",
        fontStyle: "italic",
        textAlign: "left"

    },
    ellipse: {
        top: 35.67,
        left: 16.33,
        width: 15.33,
        height: 15.33,
        position: "absolute"
    }
});
