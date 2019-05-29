import 'react-app-polyfill/ie9'; // For IE 9-11 support
import 'react-app-polyfill/ie11'; // For IE 11 support
import './polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, compose, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import appReducers from "./reducer/index";
import ReduxToastr from 'react-redux-toastr';
import Axios from 'axios';
import { API_URL } from './constants/Config';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//tạo store cho cả project
const store = createStore(
    appReducers,
    //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),//extension để dùng tool check state
    composeEnhancer(applyMiddleware(thunk))
);

ReactDOM.render(
    <Provider store={store}>
        <App />
        <ReduxToastr/>
    </Provider>, 
    document.getElementById('root')
);  

var token = localStorage.getItem('userToken');
if(token != null) {
    token.replace(/"/g, '');
    Axios.defaults.headers.common['Authorization'] = `bearer ${token}`;
}
Axios.defaults.baseURL = API_URL;

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
