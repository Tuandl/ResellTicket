import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Text, View } from 'react-native';

import MainTabNavigator from './MainTabNavigation';

export default createAppContainer(
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  MainTabNavigator);