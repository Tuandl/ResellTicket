import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';


import TicketScreen from './../screens/TicketScreen';
import RouteScreen from './../screens/RouteScreen';
import TourScreen from './../screens/TourScreen';
import MeScreen from './../screens/MeScreen';

// const HomeStack = createStackNavigator({
//   Home: {
//       screen: HomeScreen
//     }
// });

// HomeStack.navigationOptions = {
//   tabBarLabel: 'Home',
// };


export default createBottomTabNavigator({
  Ticket: TicketScreen,
  Route: RouteScreen,
  Tour: TourScreen,
  Me: MeScreen
},
{
  defaultNavigationOptions: ({navigation}) => ({
    tabBarIcon: ({ focused }) => {
      const { routeName } = navigation.state;
      if(routeName === 'Ticket') {
        return <Icon name="ticket-alt" type="font-awesome"/>;
      } else if(routeName === 'Route') {
        return <Icon name='user-o' type='font-awesome'/>
      }
    }
  })
});
