import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';


import NotificationScreen from '../screens/NotificationScreen';
import RouteScreen from './../screens/RouteScreen';
import TourScreen from './../screens/TourScreen';
import MeScreen from './../screens/MeScreen';
import ProfileDetailScreen from './../screens/profile/ProfileDetailScreen';
import ChangePasswordScreen from './../screens/profile/ChangePasswordScreen';
import PostedTicketScreen from './../screens/postedTicket/PostedTicketScreen';
import PostNewTicketScreen from './../screens/postedTicket/PostNewTicketScreen'
import EditPostedTicketScreen from './../screens/postedTicket/EditPostedTicketScreen';

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
    },
    EditPostedTicket: {
      screen: EditPostedTicketScreen
    },
    ProfileDetail: {
      screen: ProfileDetailScreen
    },
    ChangePassword: {
      screen: ChangePasswordScreen
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
      screen: TourScreen,
      navigationOptions: {
        tabBarLabel: 'Tour',
        tabBarIcon: ({ }) => {
          return <Icon name="exchange" type="font-awesome" />
        }
      }
    },
    Notification: {
      screen: NotificationScreen,
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
