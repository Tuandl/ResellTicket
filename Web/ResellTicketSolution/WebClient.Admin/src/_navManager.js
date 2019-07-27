export default {
    items: [
        {
            title: true,
            name: 'MANAGER',
            wrapper: {            // optional wrapper object
                element: '',        // required valid HTML5 element tag
                attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
            },
            class: ''             // optional class names space delimited list for title item ex: "text-center"
        },
        {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
        },
        {
            name: 'User',
            url: '/user',
            icon: 'icon-user'
        },
        {
            name: 'Customer',
            url: '/customer',
            icon: 'icon-people'
        },
        {
            name: 'City',
            url: '/city',
            icon: 'icon-map'
        },
        {
            name: 'Station',
            url: '/station',
            icon: 'icon-location-pin'
        },
        {
            name: 'Transportation',
            url: '/transportation',
            icon: 'icon-cursor'
        },
        {
            name: 'Ticket Type',
            url: '/tickettype',
            icon: 'icon-star'
        },
    ]
}