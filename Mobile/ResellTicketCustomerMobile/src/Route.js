import { createAppContainer, createStackNavigator } from "react-navigation";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import ConfirmPhoneNumberRegisterScreen from "./screens/ConfirmPhoneNumberRegisterScreen";
import ForgotPasswordScreen from "./screens/resetPassword/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/resetPassword/ResetPasswordScreen";

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
        ConfirmPhoneNumberRegister: {
            screen: ConfirmPhoneNumberRegisterScreen,
            path: 'confirmPhoneRegister'
        },
        Home: {
            screen: HomeScreen,
            path: 'home',
        },
        //BEGIN Reset Password
        ForgotPassword: {
            screen: ForgotPasswordScreen,
            path: 'forgotPassword',
        },
        ResetPassword: {
            screen: ResetPasswordScreen,
            path: 'resetPassword',
        }, 
        //END Reset Password
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        }
    }
));

export default MainRoot;