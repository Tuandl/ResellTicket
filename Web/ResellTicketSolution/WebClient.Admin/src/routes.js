import React from 'react';

const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
const Collapses = React.lazy(() => import('./views/Base/Collapses'));
const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));
const Forms = React.lazy(() => import('./views/Base/Forms'));
const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
const Navbars = React.lazy(() => import('./views/Base/Navbars'));
const Navs = React.lazy(() => import('./views/Base/Navs'));
const Paginations = React.lazy(() => import('./views/Base/Paginations'));
const Popovers = React.lazy(() => import('./views/Base/Popovers'));
const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
const Switches = React.lazy(() => import('./views/Base/Switches'));
const Tables = React.lazy(() => import('./views/Base/Tables'));
const Tabs = React.lazy(() => import('./views/Base/Tabs'));
const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
const Charts = React.lazy(() => import('./views/Charts'));
const Dashboard = React.lazy(() => import('./views/Dashboard'));
const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
const Flags = React.lazy(() => import('./views/Icons/Flags'));
const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
const Badges = React.lazy(() => import('./views/Notifications/Badges'));
const Modals = React.lazy(() => import('./views/Notifications/Modals'));
const Colors = React.lazy(() => import('./views/Theme/Colors'));
const Typography = React.lazy(() => import('./views/Theme/Typography'));
const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
const Users = React.lazy(() => import('./views/Users/UsersComponent'));
const UserView = React.lazy(() => import('./views/Users/UserViewComponent'));
const UserCreate = React.lazy(() => import('./views/Users/UserCreateComponent'));
const UserProfile = React.lazy(() => import('./views/Users/UserProfileComponent'));
const NewPostedTickets = React.lazy(() => import('./views/Tickets/NewPostedTickets'));
const Customers = React.lazy(() => import('./views/Customers/CustomersComponent'));
const CustomerView = React.lazy(() => import('./views/Customers/CustomerViewComponent'));
const Transportations = React.lazy(() => import('./views/transportation/TransportationsComponent'));
const TransportationView = React.lazy(() => import('./views/transportation/TransportationViewComponent'));
const TransportationCreateView = React.lazy(() => import('./views/transportation/TransportationCreateComponent'));
const Cities = React.lazy(() => import('./views/Cities/CitiesComponent'));
const CityView = React.lazy(() => import('./views/Cities/CityViewComponent'));
const CityCreate = React.lazy(() => import('./views/Cities/CityCreateComponent'));
const TicketTypes = React.lazy(() => import('./views/TicketType/TicketTypeComponent'));
const TicketTypeView = React.lazy(() => import('./views/TicketType/TicketTypeViewComponent'));
const TicketTypeCreateView = React.lazy(() => import('./views/TicketType/TicketTypeCreateComponent'));
const Stations = React.lazy(() => import('./views/Stations/StationsComponent'));
const StationView = React.lazy(() => import('./views/Stations/StationViewComponent'));
const StationCreate = React.lazy(() => import('./views/Stations/StationCreateComponent'));
const ValidTickets = React.lazy(() => import('./views/Tickets/ValidTickets'));
const InValidTickets = React.lazy(() => import('./views/Tickets/InValidTickets'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/theme', exact: true, name: 'Theme', component: Colors },
  { path: '/theme/colors', name: 'Colors', component: Colors },
  { path: '/theme/typography', name: 'Typography', component: Typography },
  { path: '/base', exact: true, name: 'Base', component: Cards },
  { path: '/base/cards', name: 'Cards', component: Cards },
  { path: '/base/forms', name: 'Forms', component: Forms },
  { path: '/base/switches', name: 'Switches', component: Switches },
  { path: '/base/tables', name: 'Tables', component: Tables },
  { path: '/base/tabs', name: 'Tabs', component: Tabs },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  { path: '/base/carousels', name: 'Carousel', component: Carousels },
  { path: '/base/collapses', name: 'Collapse', component: Collapses },
  { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  { path: '/base/navbars', name: 'Navbars', component: Navbars },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/paginations', name: 'Paginations', component: Paginations },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
  { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  { path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', component: Flags },
  { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/widgets', name: 'Widgets', component: Widgets },
  { path: '/charts', name: 'Charts', component: Charts },
  { path: '/user', exact: true,  name: 'Users', component: Users },
  { path: '/user/add', exact: true, name: 'Register', component: UserCreate},
  { path: '/user/:id', name: 'User Details', component: UserView},
  { path: '/profile', name: 'User Profile', component: UserProfile},
  {path: '/newPostedTicket', name: 'New Posted Tickets', component: NewPostedTickets},
  {path: '/customer', exact: true, name: 'Customers', component: Customers},
  {path: '/customer/:id', name: 'Customer Details', component: CustomerView},
  { path: '/transportation', exact: true,  name: 'Transportations', component: Transportations },
  { path: '/transportation/add', exact: true, name: 'Create Transportation', component: TransportationCreateView},
  { path: '/transportation/:id', name: 'Transportation Detail', component: TransportationView },
  { path: '/city', exact: true,  name: 'Cities', component: Cities },
  { path: '/city/add', exact: true, name: 'Add City', component: CityCreate },
  { path: '/city/:id', name: 'City Details', component: CityView},
  { path: '/tickettype', exact: true,  name: 'Ticket Types', component: TicketTypes },
  { path: '/tickettype/add', exact: true,  name: 'Create Ticket Type', component: TicketTypeCreateView },
  { path: '/tickettype/:id', name: 'Ticket Type Details', component: TicketTypeView},
  { path: '/station', exact: true,  name: 'Stations', component: Stations },
  { path: '/station/add', exact: true, name: 'Add Station', component: StationCreate },
  {path: '/station/:id', name: 'Station Details', component: StationView},
  {path: '/validTicket', name: 'Valid Tickets', component: ValidTickets},
  {path: '/invalidTicket', name: 'InValid Tickets', component: InValidTickets}
];

export default routes;
