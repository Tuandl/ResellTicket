import { combineReducers } from 'redux';
import loginToken from './loginReducer';
import users from './../reducer/user/usersReducer';
import userEdit from './../reducer/user/userEditReducer';
// import isCreated from './../reducer/createUserReducer';


const appReducers = combineReducers({
    loginToken,
    users,
    userEdit
});

export default appReducers;