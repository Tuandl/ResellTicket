import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import MainRoot from './Route';


export default class App extends Component {
  render() {
    return (
        <MainRoot />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});