import {appConfig} from './../../constant/appConfig.js';

const token = localStorage.getItem('TOKEN');

function Get(url) {
    return new Promise((resolve, reject) => {
        fetch(appConfig.apiBaseUrl + url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            resolve(response);
        }).catch(() => {
            window.location.replace(appConfig.url.login);
        })
    });
}

function Post(url, data) {
    return new Promise((resolve, reject) => {
        fetch(baseUrl + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        }).then((response) => {
            resolve(response);
        }).catch((error) => {
            window.location.replace(appConfig.url.login);
        })
    });
}

function Put(url, data) {
    return new Promise((resolve, reject) => {
        fetch(baseUrl + url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        }).then((response) => {
            resolve(response);
        }).catch((error) => {
            window.location.replace(appConfig.url.login);
        })
    });
}

function Delete(url) {
    return new Promise((resolve, reject) => {
        fetch(baseUrl + url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            resolve(response);
        }).catch((error) => {
            window.location.replace(appConfig.url.login);
        })
    });
}

const apiService = {
    get: Get,
    post: Post,
    put: Put,
    delete: Delete,
}

export {apiService}