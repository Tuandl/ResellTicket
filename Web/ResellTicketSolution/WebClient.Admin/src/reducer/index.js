import { combineReducers } from 'redux';
import loginToken from './loginReducer';
import users from './../reducer/user/usersReducer';
import userEdit from './../reducer/user/userEditReducer';
import {reducer as toastrReducer} from 'react-redux-toastr';
import transportations from './../reducer/transportation/transportationReducer';
import transportationEdit from './../reducer/transportation/transportationEditReducer';

const appReducers = combineReducers({
    loginToken,
    users,
    userEdit,
    toastr: toastrReducer,
    transportations,
    transportationEdit
    
});

export default appReducers;