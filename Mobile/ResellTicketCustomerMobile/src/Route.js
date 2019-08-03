import { createAppContainer, createStackNavigator } from "react-navigation";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ConfirmPhoneNumberRegisterScreen from "./screens/ConfirmPhoneNumberRegisterScreen";
import ForgotPasswordScreen from "./screens/resetPassword/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/resetPassword/ResetPasswordScreen";
import PostedTicketScreen from "./screens/postedTicket/PostedTicketScreen";
import ProfileDetailScreen from "./screens/profile/ProfileDetailScreen";
import ChangePasswordScreen from "./screens/profile/ChangePasswordScreen";
import ConfirmPhone from "./ConfirmPhone";

const MainRoot = createAppContainer(createStackNavigator(
    {
        Login: {
            screen: LoginScreen,
            path: 'login',
        },
        Register: {
            screen: RegisterScreen,
            path: 'register',
        },
        ForgotPassword: {
            screen: ForgotPasswordScreen
        },
        ResetPassword: {
            screen: ResetPasswordScreen
        },
        ConfirmPhoneNumberRegister: {
            screen: ConfirmPhoneNumberRegisterScreen,
            //screen: ConfirmPhone,
            path: 'confirmPhoneRegister'
        },
        Home: {
            screen: HomeScreen,
            path: 'home',
        },
    },
    {
        initialRouteName: 'Login',
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }
));

export default MainRoot;
