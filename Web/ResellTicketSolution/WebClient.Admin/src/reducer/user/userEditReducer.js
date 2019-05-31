import * as ActionType from "../../constants/ActionTypes";

var initialState = {

};

const myReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.EDIT_USER:
        	return action.user;
        default:
            return state;
    }
}

export default myReducer;