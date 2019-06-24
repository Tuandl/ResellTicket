const baseUrl = 'http://localhost:59152/';
const token = localStorage.getItem('TOKEN');

function Get(url) {
    return fetch(baseUrl + url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
}

function Post(url, data) {
    return fetch(baseUrl + url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    })
}

function Put(url, data) {
    return fetch(baseUrl + url, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data)
    })
}

function Delete(url) {
    return fetch(baseUrl + url, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
}