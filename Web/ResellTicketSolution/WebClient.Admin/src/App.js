import React, { Component } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from './../src/helper/history';
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
