const appConfig = {
    apiBaseUrl: 'http://api.resellticket.local/',
    apiUrl: {
        route: 'api/route/',
        city: 'api/city/'
    },
    url: {
        home: '/index.html',
        login: '/login.html',
        forgotPassword: '/ForgotPassword.html',
        checkPhoneNoBeforeRegister: '/checkPhoneNo.html',
        route: {
            searchForm: '/route/searchRouteForm.html',
            searchResult: '/route/searchResult.html',
            detail: '/route/routeDetail.html',
        }
    },
    format: {
        datetime: 'ddd, MMM DD, YYYY HH:mm',
        date: 'ddd, MMM DD, YYYY',
        time: 'HH:mm',
        datetimeISO: 'YYYY-MM-DD HH:mm',
    },
    MAX_RANDOM_ID: 9999999,
    OneSignalAppId: '2c3cad5d-d711-4abb-b25a-5f5cf2c9b5d1',
    SubdomainName: 'webcustomer.os.tc'
}

export {
    appConfig 
}
