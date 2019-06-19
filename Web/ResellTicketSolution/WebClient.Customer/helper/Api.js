export const baseUrl = 'http://localhost:59152/';

export function Get(url) {
    console.log(url);
    return fetch(baseUrl + url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
}