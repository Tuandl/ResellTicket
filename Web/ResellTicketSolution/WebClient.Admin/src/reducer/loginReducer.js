import * as ActionType from "./../constants/ActionTypes";
import { isFulfilled } from "q";
import { statement } from "@babel/template";

var initialState = '';

const loginReducer = (state = initialState, action) => {
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

export default loginReducer;