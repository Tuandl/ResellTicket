/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './src/App.js';

//const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

//tạo store cho cả project
// const store = createStore(
//   appReducers,
//   //window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),//extension để dùng tool check state
//   // applyMiddleware(thunk)
// );

// const RNRedux = () => (
//     <Provider store = { store }>
//       <App />
//     </Provider>
//   )


AppRegistry.registerComponent(appName, () => App);
