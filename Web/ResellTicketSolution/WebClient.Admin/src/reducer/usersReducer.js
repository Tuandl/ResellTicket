import * as ActionType from "./../constants/ActionTypes";

var initialState = [];

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.GET_USERS:
        	state = action.users
            return [...state];
        default:
            return state;
    }
}

export default loginReducer;