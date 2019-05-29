import { callApiLogin } from '../helper/ApiCaller';
import * as ActionType from '../constants/ActionTypes';

export const doLoginRequest = (username, password) => {
    return dispatch => {
        return callApiLogin('api/token/checkLogin', 'POST', username, password).then(res => {
            if(res.data) {
                dispatch(doLogin(res.data));
            }        
        }).catch(err => {
            dispatch(doLogin(err.request.status));
        });
    }
}

export const doLogin = (token) => {
    return {
        type: ActionType.LOGIN,
        token
    }
}
