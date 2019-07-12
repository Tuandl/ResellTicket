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
            icon: 'icon-user'
        },
        {
            name: 'Station',
            url: '/station',
            icon: 'icon-user'
        },
        {
            name: 'Transportation',
            url: '/transportation',
            icon: 'icon-user'
        },
        {
            name: 'Ticket Type',
            url: '/tickettype',
            icon: 'icon-user'
        },
    ]
}