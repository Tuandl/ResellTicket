const appConfig = {
    apiBaseUrl: 'http://localhost:59152/',
    apiUrl: {
        route: 'api/route/',
        routeTicket: 'api/route/route-ticket/',
        city: 'api/city/',
        ticket: 'api/ticket',
        ticketDetail: 'api/ticket/detail',
        ticketConfirmRenamed: 'api/ticket/confirm-rename',
        ticketRefuseRenamed: 'api/ticket/refuse',
        vehicle: 'api/vehicle',
        transportation: 'api/transportation',
        ticketType: 'api/ticketType',
        station: 'api/station',
        creditCard: 'api/credit-card',
        setDefaultCard: 'api/credit-card/set-default-card',
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
        },
        ticket: {
            postEditForm_2: '/postedTicket/postEditTicket_2.html',
            postEditForm: '/postedTicket/postEditTicket.html',
            //detail: ''
        },
        creditCard: {
            viewListCreditCard: '/creditCard/ListCreditCardView.html'
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
    SubdomainName: 'webcustomer.os.tc',
    stripe : {
        pusblishableKey: 'pk_test_D0BLH7S0dIaPbxYxUJTFYa0T00ekNdTcE3'
    }
}

export {
    appConfig 
}
