import axios from 'axios';
import * as Config from './../constants/Config';

export function callApiWithNoneToken(endpoint, method, body){
    return axios({
        method: method,
        url: `${Config.API_URL}/${endpoint}`,
        data: body
    }).catch(err => {
        console.log(err);
    });
};

export function callApiLogin(endpoint, method, username, password){
    return axios({
        method: method,
        url: `${Config.API_URL}/${endpoint}`,
        data: {
            'username': username,
            'password': password
        },
    })
};

export function callApiWithToken(endpoint, method, body){
    //axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    return axios({
        method: method,
        url: `${Config.API_URL}/${endpoint}`,
        data: body,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('userToken')
        }
    }).catch(err => {
        console.log(err);
    });
};