import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import MainRoot from './Route';
import NavigationService from './service/NavigationService';
import OneSignal from 'react-native-onesignal';
import AppID from './constants/notifications'


export default class App extends Component {

  componentWillMount() {
    OneSignal.init(AppID.ONESIGNAL_APP_ID);
    
    OneSignal.inFocusDisplaying(2);
  }

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