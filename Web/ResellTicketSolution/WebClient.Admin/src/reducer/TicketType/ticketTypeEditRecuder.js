import * as ActionType from "../../constants/ActionTypes";

var initialState = {

};

const ticketTypeEditReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.EDIT_TICKETTYPE:
        	return action.ticketType;
        default:
            return state;
    }
}

export default ticketTypeEditReducer;