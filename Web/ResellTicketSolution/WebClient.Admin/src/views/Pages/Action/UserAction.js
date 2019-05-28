

import { callApiWithNoneToken, callApiLogin } from '../../../helper/ApiCaller';
import * as ActionType from '../../../constants/ActionTypes';

export const doRegisterRequest = (user) => {
    return dispatch => {
        return callApiWithNoneToken('api/token/register', 'POST', user).then(res => {
            dispatch(doRegister());
            console.log("loi" , res);
        })
    }
}

export const doRegister = () => {
    return {
        type: ActionType.REGISTER
    }
}

export const doLoginRequest = (username, password) => {
    return dispatch => {
        return callApiLogin('api/token/checkLogin', 'POST', username, password).then(res => {
            dispatch(doLogin());
            console.log("Token: ", res);
            localStorage.setItem('userToken', JSON.stringify(res.data));
        })
    }
}

export const doLogin = () => {
    return {
        type: ActionType.LOGIN
    }
}
