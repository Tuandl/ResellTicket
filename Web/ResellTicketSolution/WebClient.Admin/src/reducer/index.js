import { combineReducers } from 'redux';
import userReducer from './../views/Pages/Reducer/UserReducer';


const appReducers = combineReducers({
    userReducer
});

export default appReducers;