import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from './../src/helper/history';
import { toastr } from 'react-redux-toastr';
// import { renderRoutes } from 'react-router-config';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Login'));
// const Register = React.lazy(() => import('./views/Pages/Register'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));


class App extends Component {
  constructor(props) {
    super(props);
    history.listen((location, action) => {
        // clear alert on location change
    });
    const OneSignalAppId = 'bcc5a63f-d900-4eb0-af8d-6a85c8dbd01b';
    const SubDomainName = 'webadmin.OS.TC';

    var OneSignal = window.OneSignal || [];
    OneSignal.push(function () {
      OneSignal.init({
        appId: OneSignalAppId,
        subdomainName: SubDomainName,
        notifyButton: {
          enable: false,
        }
      });
      OneSignal.on('notificationDisplay', function (event) {
        // toastr.success('Notifications', event.content);
      });
      OneSignal.setSubscription(true);
    });
}
  render() {
    return (
      <Router history={history}>
          <React.Suspense fallback={loading()}>
            <Switch>
              <Route exact path="/login" name="Login Page" component={Login} />
              {/* <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} /> */}
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path="/" name="Home" render={props => <DefaultLayout {...props}/>} />
              {/* <PrivateRoute path="/" component={DefaultLayout} /> */}
            </Switch>
          </React.Suspense>
      </Router>
    );
  }
}

export default App;
