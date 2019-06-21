import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import MainRoot from './Route';
import NavigationService from './service/NavigationService';


export default class App extends Component {
  render() {
    return (
        <MainRoot 
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});