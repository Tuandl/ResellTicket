import { callApiWithToken } from '../helper/ApiCaller';
import * as ActionType from '../constants/ActionTypes';

export const doRegisterRequest = (user) => {
    return dispatch => {
        return callApiWithToken('api/user', 'POST', user, null).then(res => {
            console.log(res.data);
            dispatch(doRegister(res.data));
        })
    }
}

export const doRegister = (newUser) => {
    return {
        type: ActionType.CREATE_USER,
        newUser
    }
}

export const getUsersRequest = (param) => {
    return dispatch => {
        var url = null;
        if(param) {
            url = 'api/user?param=' + param;
        } else {
            url = 'api/user'
        }
        return callApiWithToken(url, 'GET', null).then(res => {
            dispatch(getUsers(res.data));           
        });
    }
}

export const getUsers = (users) => {
    return {
        type: ActionType.GET_USERS,
        users
    }
}

export const findUserByIdRequest = (id) => {
    return dispatch => {
        return callApiWithToken(`api/user/${id}`, 'GET', null).then(res => {
            //console.log(res.data);
            res.data.isActive += '';    //Convert isActive into string -> map with select box
            dispatch(findUserById(res.data));           
        });
    }
}

export const findUserById = (user) => {
    return {
        type: ActionType.EDIT_USER,
        user
    }
}