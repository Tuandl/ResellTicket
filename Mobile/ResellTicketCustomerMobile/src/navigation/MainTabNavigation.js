import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';


import NotificationScreen from '../screens/NotificationScreen';
import RouteScreen from './../screens/RouteScreen';
import TourScreen from './../screens/TourScreen';
import MeScreen from './../screens/MeScreen';


export default createBottomTabNavigator(
  {
    Route: {
      screen: RouteScreen,
      navigationOptions: {
        tabBarLabel: 'Route',
        tabBarIcon: ({tintColor}) => {
          return <Icon name="map-o" type="font-awesome"/>
        }
      }
    },
    Tour: {
      screen: TourScreen,
      navigationOptions: {
        tabBarLabel: 'Tour',
        tabBarIcon: ({}) => {
          return <Icon name="exchange" type="font-awesome"/>
        }
      }
    },
    Notification: {
      screen: NotificationScreen,
      navigationOptions: {
        tabBarLabel: 'Notification',
        tabBarIcon: ({}) => {
          return <Icon name="bell-o" type="font-awesome"/>
        }
      }
    },
    Me: {
      screen: MeScreen,
      navigationOptions: {
        tabBarLabel: 'Me',
        tabBarIcon: ({}) => {
          return <Icon name="user-o" type="font-awesome"/>
        }
      }
    }
  },
  {
    initialRouteName: 'Route'
  }
);
