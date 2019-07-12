import React, { Component } from "react";
import { StyleSheet, View, FlatList, Text, TextInput } from "react-native";
import { Center } from "@builderx/utils";
import Svg, { Ellipse } from "react-native-svg";
import moment from 'moment';
import formatConstant from "../constants/formatConstant";

export default class NotificationListComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { notifications } = this.props;

        return (
            <View style={[styles.root, this.props.style]}>
                <FlatList
                    data={notifications}
                    renderItem={({ item, separators }) => (
                        <View style={styles.rowBgColor}>
                            <Center vertical>
                                <View style={styles.group}>
                                    <Text style={styles.rowTitle}>Notification</Text>
                                    <Text style={styles.rowSubTitle}>
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
                                    fill={"rgba(126,211,33,1)"}
                                    stroke={"rgba(126,211,33,1)"}
                                    cx={7.67}
                                    cy={7.67}
                                    rx={3.67}
                                    ry={3.67}
                                />
                            </Svg>
                        </View>
                    )}
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
    rowTitle: {
        color: "#212121",
        flexDirection: "column",
        alignSelf: "stretch",
        paddingBottom: 8,
        fontSize: 17
    },
    rowSubTitle: {
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
