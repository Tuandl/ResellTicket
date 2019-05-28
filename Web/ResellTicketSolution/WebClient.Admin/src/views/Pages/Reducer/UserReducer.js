
import * as ActionType from "./../../../constants/ActionTypes";

var initialState = {};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.REGISTER:
            return state;
        case ActionType.LOGIN:
            return state;
        default:
            return state;
    }
}

export default userReducer;