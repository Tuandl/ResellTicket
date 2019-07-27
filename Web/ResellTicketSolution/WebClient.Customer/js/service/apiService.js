import { appConfig } from './../../constant/appConfig.js';
import toastService from './toastService.js';
import commonService from './commonService.js';

const token = localStorage.getItem('TOKEN');

function Get(url, params) {
    return new Promise((resolve, reject) => {
        if(Pace) Pace.start();
        
        fetch(appConfig.apiBaseUrl + url + '?' + commonService.getQueryString(params), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            if (response.status === 401) {
                localStorage.clear();
                window.location.replace(appConfig.url.login);
                reject(response);
            }
            if (response.status === 200) {
                response.json().then(data => resolve(data));
            } else {
                reject(response);
            }
        }).catch((error) => {
            toastService.error('Error');
            reject(error);
        }).finally(() => {
            if(Pace) Pace.stop();
        })
    });
}

function Post(url, data) {
    if(Pace) Pace.start();
    
    return new Promise((resolve, reject) => {
        fetch(appConfig.apiBaseUrl + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status === 401) {
                localStorage.clear();
                window.location.replace(appConfig.url.login);
                reject(response);
            }
            if (response.status === 200) {
                resolve(response);
            } else {
                reject(response);
            }
        }).catch((error) => {
            toastService.error('Error');
            reject(error);
        }).finally(() => {
            if(Pace) Pace.stop();
        })
    });
}

function Put(url, data) {
    if(Pace) Pace.start();
    
    return new Promise((resolve, reject) => {
        fetch(appConfig.apiBaseUrl + url, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        }).then((response) => {
            if (response.status === 401) {
                localStorage.clear();
                window.location.replace(appConfig.url.login);
                reject(response);
            }
            if (response.status === 200) {
                resolve(response);
            } else {
                reject(response);
            }
        }).catch((error) => {
            toastService.error('Error');
            reject(error);
        }).finally(() => {
            if(Pace) Pace.stop();
        })
    });
}

function PutParams(url, params) {
    if(Pace) Pace.start();
    
    return new Promise((resolve, reject) => {
        fetch(appConfig.apiBaseUrl + url + '?' + commonService.getQueryString(params), {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }).then((response) => {
            if (response.status === 401) {
                localStorage.clear();
                window.location.replace(appConfig.url.login);
                reject(response);
            }
            if (response.status === 200) {
                resolve(response);
            } else {
                reject(response);
            }
        }).catch((error) => {
            toastService.error('Error');
            reject(error);
        }).finally(() => {
            if(Pace) Pace.stop();
        })
    });
}

function Delete(url, params) {
    if(Pace) Pace.start();
    
    return new Promise((resolve, reject) => {
        fetch(appConfig.apiBaseUrl + url + '?' + commonService.getQueryString(params), {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        }).then((response) => {
            if (response.status === 401) {
                localStorage.clear();
                window.location.replace(appConfig.url.login);
                reject(response);
            }
            if (response.status === 200) {
                resolve(response);
            } else {
                reject(response);
            }
        }).catch((error) => {
            toastService.error('Error');
            reject(error);
        }).finally(() => {
            if(Pace) Pace.stop();
        })
    });
}

const apiService = {
    get: Get,
    post: Post,
    put: Put,
    putParams: PutParams,
    delete: Delete,
}

export default apiService;