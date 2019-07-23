const appConfig = {
    apiBaseUrl: 'http://localhost:59152/',
    apiBaseUrlVisual: 'http://127.0.0.1:8080/',
    apiUrl: {
        route: 'api/route/',
        routeTicket: 'api/route/route-ticket/',
        city: 'api/city/',
        ticket: 'api/ticket',
        ticketDetail: 'api/ticket/detail',
        ticketViewPassengerInfo: 'api/ticket/detail',
        ticketConfirmRenamed: 'api/ticket/confirm-rename',
        ticketRefuseRenamed: 'api/ticket/refuse',
        customer: 'api/customer/',
        customerDetail: 'api/customer/detail',
        vehicle: 'api/vehicle',
        transportation: 'api/transportation',
        ticketType: 'api/ticketType',
        station: 'api/station',
        creditCard: 'api/credit-card',
        setDefaultCard: 'api/credit-card/set-default-card',
        addBankConnectAccount: 'api/customer/add-bank-connect-account',
        checkIsConnectedBank: 'api/customer/check-existed-connect-bank-account',
        getLinkConnectBank: 'api/customer/view-connect-account',
        notificationDataTable: 'api/notification/data-table',
        notification: 'api/notification',
        transaction: 'api/customer/get-transaction',
        logout: 'api/customer/logout'
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
        postedTicket: {
            postEditForm_2: '/postedTicket/postEditTicket_2.html',
            postEditForm: '/postedTicket/postEditTicket.html',
            //detail: ''
            postedTicketList: '/postedTicket/postedTicket.html',
        },
        creditCard: {
            viewListCreditCard: '/creditCard/ListCreditCardView.html',
            createCreditCard: '/creditCard/createCreditCardView.html',
        },
        bank: {
            success: '/bank/createSuccessBankAccount.html',
            fail: '/bank/createFailedBankAccount.html'
        },
        updateProfile: '/updateProfile.html',
        updatePasswordWhenLogedIn: '/changePasswordProfile.html',
        register: '/register.html',
        resetPassword: '/ResetPassword.html',
        transaction: '/transaction/transaction.html'
    },
    format: {
        datetime: 'ddd, MMM DD, YYYY HH:mm',
        date: 'ddd, MMM DD, YYYY',
        time: 'HH:mm',
        datetimeISO: 'YYYY-MM-DD HH:mm',
        datetimeNotification: 'HH:mm - MMM DD, YYYY',
    },
    MAX_RANDOM_ID: 9999999,
    OneSignalAppId: '2c3cad5d-d711-4abb-b25a-5f5cf2c9b5d1',
    SubdomainName: 'webcustomer.os.tc',
    stripe : {
        pusblishableKey: 'pk_test_D0BLH7S0dIaPbxYxUJTFYa0T00ekNdTcE3'
    },
    bankConnect: {
        linkCreate: 'https://connect.stripe.com/express/oauth/authorize?redirect_uri=' + 
        'http://127.0.0.1:8080' + '/updateProfile.html&client_id='+'ca_FLG0Mrxeb6GeNLbV7uvRJG3CVcHaBPQc&state={STATE_VALUE}',
        prexitResponse: 'http://127.0.0.1:8080' + '/updateProfile.html?code=',

    }
}

export {
    appConfig 
}
