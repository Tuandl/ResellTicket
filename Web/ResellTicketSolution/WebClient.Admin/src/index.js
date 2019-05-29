import React from 'react';
import 'react-app-polyfill/ie11'; // For IE 11 support
import 'react-app-polyfill/ie9'; // For IE 9-11 support
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from './App';
import AxiosConfigurate from './helper/AxiosConfigurate';
import './index.css';
import './polyfill';
import appReducers from "./reducer/index";
import * as serviceWorker from './serviceWorker';

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

AxiosConfigurate();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
