import { appConfig } from './../../constant/appConfig.js';
import toastService from './toastService.js';

const token = localStorage.getItem('TOKEN');

function getQueryString(paramObject) {
    let query = Object.keys(paramObject)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(paramObject[k]))
        .join('&');
    return query;
}

function Get(url, params) {
    return new Promise((resolve, reject) => {
        fetch(appConfig.apiBaseUrl + url + '?' + getQueryString(params), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            if (response.status === 401) {
                window.location.replace(appConfig.url.login);
                reject(response);
            }
            if(response.status === 200) {
                response.json().then(data => resolve(data));
            } else {
                reject(response);
            }
        }).catch(() => {
            toastService.error('Error');
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
            if (response.status === 401) {
                window.location.replace(appConfig.url.login);
                reject(response);
            }
            if(response.status === 200) {
                response.json().then(data => resolve(data));
            } else {
                reject(response);
            }
        }).catch((error) => {
            toastService.error('Error');
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
            if (response.status === 401) {
                window.location.replace(appConfig.url.login);
                reject(response);
            }
            if(response.status === 200) {
                response.json().then(data => resolve(data));
            } else {
                reject(response);
            }
        }).catch((error) => {
            toastService.error('Error');
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
            if (response.status === 401) {
                window.location.replace(appConfig.url.login);
                reject(response);
            }
            if(response.status === 200) {
                response.json().then(data => resolve(data));
            } else {
                reject(response);
            }
        }).catch((error) => {
            toastService.error('Error');
        })
    });
}

const apiService = {
    get: Get,
    post: Post,
    put: Put,
    delete: Delete,
}

export default apiService;