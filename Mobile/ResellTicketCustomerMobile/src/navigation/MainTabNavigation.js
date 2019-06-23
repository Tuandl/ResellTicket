import React from 'react';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';


import NotificationScreen from '../screens/NotificationScreen';
import RouteScreen from './../screens/route/RouteScreen';
import TourScreen from './../screens/TourScreen';
import MeScreen from './../screens/MeScreen';
import ProfileDetailScreen from './../screens/profile/ProfileDetailScreen';
import ChangePasswordScreen from './../screens/profile/ChangePasswordScreen';
import PostedTicketScreen from './../screens/postedTicket/PostedTicketScreen';
import PostEditTicketScreen from './../screens/postedTicket/PostEditTicketScreen';
import DetailTicketScreen from  './../screens/postedTicket/DetailTicketScreen';
import RouteSearchFormScreen from '../screens/route/RouteSearchFormScreen';
import RouteSearchResultScreen from '../screens/route/RouteSearchResultScreen';
import RouteDetailScreen from '../screens/route/RouteDetailScreen';
import RouteTicketUpdateScreen from '../screens/route/RouteTicketUpdateScreen';

const RouteStack = createStackNavigator(
  {
    Route: RouteScreen,
    RouteSearchForm: RouteSearchFormScreen,
    RouteSearchResult: RouteSearchResultScreen,
    RouteDetail: RouteDetailScreen,
    RouteTicketUpdate: RouteTicketUpdateScreen,
  }, {
    initialRouteName: 'Route',
    headerMode: 'none',
  }
)

const MeStack = createStackNavigator(
  {
    Me: MeScreen,
    PostedTicket: PostedTicketScreen,
    PostEditTicket: PostEditTicketScreen,
    DetailTicket: DetailTicketScreen,
    ProfileDetail: ProfileDetailScreen,
    ChangePassword: ChangePasswordScreen
  },
  {
    initialRouteName: 'Me',
    headerMode: 'none',
  }
)

export default createBottomTabNavigator(
  {
    Route: {
      screen: RouteStack,
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
      navigationOptions: ({ navigation }) => ({
        tabBarLabel: 'Me',
        tabBarIcon: ({ }) => {
          return <Icon name="user-o" type="font-awesome" />
        },
        tabBarVisible: navigation.state.index > 0 ? false: true
      })
    }
  },
  {
    initialRouteName: 'Route',
  }
);
