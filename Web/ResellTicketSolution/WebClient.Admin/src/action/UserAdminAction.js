import { callApiWithToken } from '../helper/ApiCaller';
import * as ActionType from '../constants/ActionTypes';

export const getUsersRequest = (token) => {
    return dispatch => {
        return callApiWithToken('api/users', 'GET', null, token).then(res => {
            dispatch(getUsers(res.data));
            //console.log("Token: ", res);           
        })
    }
}

export const getUsers = (users) => {
    return {
        type: ActionType.GET_USERS,
        users
    }
}