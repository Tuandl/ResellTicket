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
// api của Transportation
export const getTransportationRequest = (param) =>{
    return dispatch => {
        var url = null;
        if(param) {
            url = 'api/transportation?param=' + param;
        } else {
            url = 'api/transportation';
        }
        return callApiWithToken(url, 'GET', null).then(res => { 
            dispatch(getTransportation(res.data));
        });
    }
}



export const getTransportation = (transportations) => {
    
    return {
        type: ActionType.GET_TRANSPORTATION,
        transportations
    }
}

export const findTransportationByIdRequest = (id) => {
    return dispatch => {
        return callApiWithToken(`api/transportation/${id}`, 'GET', null).then(res => {
            // if(res) {
            //     dispatch(findTransportationById(res.data));           
            // }
            dispatch(findTransportationById(res.data));           
            
        });
    }
}

export const findTransportationById = (transportation) => {
    return {
        type: ActionType.EDIT_TRANSPORTATION,
        transportation
    }
}

export const createTransportationRequest = (user) => {
    return dispatch => {
        return callApiWithToken('api/transportation', 'POST', user, null).then(res => {
            console.log(res.data);
            dispatch(doRegister(res.data));
        })
    }
}

export const createTransportation = (newTransportation) => {
    return {
        type: ActionType.CREATE_TRANSPORTATION,
        newTransportation
    }
}