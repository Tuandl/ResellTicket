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
import CreditCardViewListScreen from '../screens/creditCard/CreditCardViewListScreen';
import CreditCardCreateScreen from '../screens/creditCard/CreditCardCreateScreen';
import RouteDetailScreen from '../screens/route/RouteDetailScreen';
import RouteTicketUpdateScreen from '../screens/route/RouteTicketUpdateScreen';
import CreateBankAccountToReceiveMoneyScreen from '../screens/bank/CreateBankAccountToReceiveMoneyScreen';
import AccountConnectDetailScreen from '../screens/bank/AccountConnectDetailScreen';
import RouteBuyerInfoScreen from '../screens/route/RouteBuyerInfoScreen';
import PassengerInformationScreen from '../screens/postedTicket/PassengerInformationScreen';

const RouteStack = createStackNavigator(
  {
    Route: RouteScreen,
    RouteSearchForm: RouteSearchFormScreen,
    RouteSearchResult: RouteSearchResultScreen,
    RouteDetail: RouteDetailScreen,
    RouteTicketUpdate: RouteTicketUpdateScreen,
    RouteBuyerInfo: RouteBuyerInfoScreen
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
    PassengerInfo: PassengerInformationScreen,
    ProfileDetail: ProfileDetailScreen,
    ChangePassword: ChangePasswordScreen,
    CreditCardViewList: CreditCardViewListScreen,
    CreditCardCreate: CreditCardCreateScreen,
    CreateBankAccountToReceiveMoney: CreateBankAccountToReceiveMoneyScreen,
    AccountConnectDetail: AccountConnectDetailScreen,
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
