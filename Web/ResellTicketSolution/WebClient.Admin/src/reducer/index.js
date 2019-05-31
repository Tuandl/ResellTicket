import { combineReducers } from 'redux';
import loginToken from './loginReducer';
import users from './../reducer/user/usersReducer';
import userEdit from './../reducer/user/userEditReducer';
import {reducer as toastrReducer} from 'react-redux-toastr';

const appReducers = combineReducers({
    loginToken,
    users,
    userEdit,
    toastr: toastrReducer,
});

export default appReducers;