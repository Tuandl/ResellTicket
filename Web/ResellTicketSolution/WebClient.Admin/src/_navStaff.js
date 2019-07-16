export default {
    items: [
        {
            title: true,
            name: 'STAFF',
            wrapper: {            // optional wrapper object
                element: '',        // required valid HTML5 element tag
                attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
            },
            class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
            title: true,
            name: 'SELLER TICKETS MANAGEMENT',
            wrapper: {            // optional wrapper object
                element: '',        // required valid HTML5 element tag
                attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
            },
            class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
            name: 'New Posted Tickets',
            url: '/newPostedTicket',
            icon: 'fa fa-ticket'
        },
        {
            name: 'Valid Tickets',
            url: '/validTicket',
            icon: 'fa fa-ticket'
        },
        {
            name: 'Invalid Tickets',
            url: '/invalidTicket',
            icon: 'fa fa-ticket'
        },
        {
            name: 'Bought Tickets',
            url: '/boughtTicket',
            icon: 'fa fa-ticket'
        },
        {
            name: 'Renamed Tickets',
            url: '/renamedTicket',
            icon: 'fa fa-ticket'
        },
        {
            name: 'Completed Tickets',
            url: '/completedTicket',
            icon: 'fa fa-ticket'
        },
        {
            title: true,
            name: 'BUYER ROUTES MANAGEMENT',
            wrapper: {            // optional wrapper object
                element: '',        // required valid HTML5 element tag
                attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
            },
            class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
            name: 'Bought Routes',
            url: '/boughtRoute',
            icon: 'fa fa-ticket'
        },
        {
            name: 'Completed Routes',
            url: '/completedRoute',
            icon: 'fa fa-ticket'
        },
    ]
}