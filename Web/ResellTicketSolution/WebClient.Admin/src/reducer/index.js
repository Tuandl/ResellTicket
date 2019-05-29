import { combineReducers } from 'redux';
import loginToken from './../reducer/loginReducer';
import users from './../reducer/usersReducer';


const appReducers = combineReducers({
    loginToken,
    users
});

export default appReducers;