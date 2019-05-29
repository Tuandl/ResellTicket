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
    </Provider>, 
    document.getElementById('root')
);  

//Axios.defaults.headers.common['Authorization'] = 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0dWFuZGFwY2hhaSIsImp0aSI6IjIxYmFlODJlLWU4YzYtNDgwOC04YmM5LThlZDhlMWZkYzJjZSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWVpZGVudGlmaWVyIjoiNzRjODhlNmYtYzVlYy00M2FmLWJiNjktNWFmMTkyMDc4MjFkIiwiZXhwIjoxNTU5MDI4Nzg5LCJpc3MiOiJSZXNlbGxUaWNrZXRBZG1pbkFQSSIsImF1ZCI6ImF1ZGllbmNlQWRtaW4ifQ.VhPhd6yiGIGIWhkyT8NkWupl2QXeFWnIW38EqlLV4pA';
// Axios.defaults.baseURL = 'http://api.admin.resellticket.local/api/';

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
