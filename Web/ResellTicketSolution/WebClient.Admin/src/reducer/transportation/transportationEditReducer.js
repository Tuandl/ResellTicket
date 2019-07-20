import * as ActionType from "../../constants/ActionTypes";

var initialState = {

};

const transportationEditReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.EDIT_TRANSPORTATION:
        	return action.transportation;
        default:
            return state;
    }
}

export default transportationEditReducer;