import * as ActionType from "../constants/ActionTypes";

var initialState = '';

const myReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.LOGIN:
        	state = action.token;
            if(parseInt(state) === 406) {
                return state;
            } else {
                localStorage.setItem('userToken', state);
            }
            return state;
        default:
            return state;
    }
}

export default myReducer;