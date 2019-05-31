import * as ActionType from "../../constants/ActionTypes";

var initialState = [];

const myReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.GET_USERS:
        	state = action.users
            return [...state];
        case ActionType.CREATE_USER:
            state.push(action.newUser);
            return [...state]
        default:
            return state;
    }
}

export default myReducer;