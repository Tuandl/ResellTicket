import * as ActionType from "../../constants/ActionTypes";

var initialState = [];

const ticketTypeReducer = (state = initialState, action) => {
    switch (action.type) {
        case ActionType.GET_TICKETTYPE:
            state = action.ticketTypes;
            return [...state];
        // case ActionType.CREATE_TRANSPORTATION:
        //     state.push(action.newTransportation);
        //     return [...state]
        default:
            return state;
    }
}

export default ticketTypeReducer;