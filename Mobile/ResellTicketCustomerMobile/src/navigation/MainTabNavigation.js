import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';


import NotificationScreen from '../screens/NotificationScreen';
import RouteScreen from './../screens/RouteScreen';
import TourScreen from './../screens/TourScreen';
import MeScreen from './../screens/MeScreen';
import ProfileDetailScreen from './../screens/profile/ProfileDetailScreen';
import ChangePasswordScreen from './../screens/profile/ChangePasswordScreen';
import PostedTicketScreen from './../screens/postedTicket/PostedTicketScreen';
import PostNewTicketScreen from './../screens/postedTicket/PostNewTicketScreen';

const MeStack = createStackNavigator(
  {
    Me: {
      screen: MeScreen
    },
    PostedTicket: {
      screen: PostedTicketScreen,
    },
    PostNewTicket: {
      screen: PostNewTicketScreen
    }
  },
  {
    initialRouteName: 'Me',
    headerMode: 'none',
  }
)

export default createBottomTabNavigator(
  {
    Route: {
      screen: RouteScreen,
      navigationOptions: {
        tabBarLabel: 'Route',
        tabBarIcon: ({ tintColor }) => {
          return <Icon name="map-o" type="font-awesome" />
        }
      }
    },
    Tour: {
      screen: ChangePasswordScreen,
      navigationOptions: {
        tabBarLabel: 'Tour',
        tabBarIcon: ({ }) => {
          return <Icon name="exchange" type="font-awesome" />
        }
      }
    },
    Notification: {
      //screen: NotificationScreen,
      //Thanh để đỡ profile customer screen ở đây
      screen: ProfileDetailScreen,
      navigationOptions: {
        tabBarLabel: 'Notification',
        tabBarIcon: ({ }) => {
          return <Icon name="bell-o" type="font-awesome" />
        }
      }
    },
    Me: {
      screen: MeStack,
      navigationOptions: {
        tabBarLabel: 'Me',
        tabBarIcon: ({ }) => {
          return <Icon name="user-o" type="font-awesome" />
        },
      }
    },
  },
  {
    initialRouteName: 'Me',
    
  }
);
