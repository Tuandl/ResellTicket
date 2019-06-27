const appConfig = {
    apiBaseUrl: 'http://api.resellticket.local/',
    apiUrl: {
        route: 'api/route/',
    },
    url: {
        home: '/index.html',
        login: '/login.html',
        forgotPassword: '/ForgotPassword.html',
        checkPhoneNoBeforeRegister: '/checkPhoneNo.html',
    },
    format: {
        datetime: 'ddd, MMM DD, YYYY HH:mm',
        date: 'ddd, MMM DD, YYYY',
        time: 'HH:mm',
    },
    MAX_RANDOM_ID: 9999999,
}

export {
    appConfig 
}